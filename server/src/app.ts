import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { CATALOG } from '../../shared/catalog.ts';
import type { Claims, Verify } from './auth.ts';
import { isReadable } from './core/access.ts';
import { createNotifier, type Notifier } from './core/notifications.ts';
import { manifest, VERSION } from './core/manifest.ts';
import { settingsSchema, withDefaults, type Settings, type SettingsSchema } from './core/settings.ts';
import type { Host } from './host.ts';
import { registerCaseRoutes } from './routes/case.ts';
import { registerOwnerRoutes } from './routes/owner.ts';
import { registerPlatformRoutes } from './routes/platform.ts';
import type { Store } from './store.ts';
import type { ServerTool } from './tools/types.ts';

declare module 'fastify' {
	interface FastifyRequest {
		claims: Claims;
	}
}

export class HttpError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export interface AppOptions {
	store: Store;
	verify: Verify;
	host: Host;
	tools: ServerTool[];
	now?: () => Date;
	notifyWindowMs?: number;
	timeZone?: string;
	uiDir?: string;
	logger?: boolean;
}

/** What the route modules share. */
export interface Core {
	store: Store;
	host: Host;
	tools: ServerTool[];
	schema: SettingsSchema;
	notifier: Notifier;
	timeZone: string;
	now: () => Date;
	tool(id: string): ServerTool;
	settings(claims: Claims): Promise<Settings>;
}

const catalogIndex = (id: string) => CATALOG.findIndex((tool) => tool.id === id);

export const buildApp = (options: AppOptions): { app: FastifyInstance; core: Core } => {
	const { store, verify, host } = options;
	const now = options.now ?? (() => new Date());
	const tools = [...options.tools].sort((a, b) => catalogIndex(a.id) - catalogIndex(b.id));
	const schema = settingsSchema(tools);
	const app = Fastify({ logger: options.logger ?? false, bodyLimit: 256 * 1024 });

	const core: Core = {
		store,
		host,
		tools,
		schema,
		timeZone: options.timeZone ?? 'Europe/Berlin',
		now,
		notifier: undefined as unknown as Notifier,
		tool(id) {
			const tool = tools.find((candidate) => candidate.id === id);
			if (!tool) {
				throw new HttpError(404, 'unknown tool');
			}
			return tool;
		},
		async settings(claims) {
			return withDefaults(schema, await host.settings(claims));
		}
	};
	core.notifier = createNotifier({
		store,
		host,
		now,
		windowMs: options.notifyWindowMs ?? 15 * 60_000,
		log: app.log,
		stillShared: async (claims, toolId) => {
			const tool = tools.find((candidate) => candidate.id === toolId);
			if (!tool) {
				return false;
			}
			const [settings, release, share] = await Promise.all([
				core.settings(claims),
				store.releaseOf(claims.tenantId, claims.sub, toolId),
				store.shareOf(claims.tenantId, claims.sub, toolId)
			]);
			return isReadable(settings, tool, release, share);
		}
	});

	app.decorateRequest('claims', undefined as unknown as Claims);

	app.removeContentTypeParser('application/json');
	app.addContentTypeParser('application/json', { parseAs: 'string' }, (_request, body, done) => {
		if (!body) {
			done(null, undefined);
			return;
		}
		try {
			done(null, JSON.parse(body as string));
		} catch {
			done(new HttpError(400, 'invalid json'), undefined);
		}
	});

	// The AddonService gateway streams every POST body, so a bodyless request arrives as an empty
	// chunked body without a content type.
	app.addContentTypeParser('*', { parseAs: 'buffer' }, (_request, body, done) => {
		if ((body as Buffer).length === 0) {
			done(null, undefined);
			return;
		}
		done(new HttpError(415, 'unsupported content type'), undefined);
	});

	app.setErrorHandler((error, request, reply) => {
		if (error instanceof HttpError) {
			return reply.code(error.status).send({ error: error.message });
		}
		if (error instanceof ZodError) {
			return reply
				.code(400)
				.send({ error: 'invalid input', issues: error.issues.map((issue) => issue.message) });
		}
		const status = (error as { statusCode?: number }).statusCode;
		if (status && status < 500) {
			return reply.code(status).send({ error: (error as Error).message });
		}
		request.log.error(error);
		return reply.code(500).send({ error: 'internal error' });
	});

	app.addHook('onSend', async (request, reply) => {
		if (!request.url.startsWith('/ui/')) {
			reply.header('Cache-Control', 'no-store');
		}
	});

	const authenticate = async (request: FastifyRequest) => {
		const claims = await verify(request.headers.authorization).catch((error: Error) => {
			request.log.warn(`token keys not available: ${error.message}`);
			throw new HttpError(503, 'token keys not available');
		});
		if (!claims) {
			throw new HttpError(401, 'invalid token');
		}
		request.claims = claims;
	};

	app.get('/.well-known/oriso-addon.json', async () => manifest(tools));
	app.get('/schema/settings.json', async () => schema);
	app.get('/health', async () => ({ status: 'UP' }));

	if (options.uiDir && existsSync(options.uiDir)) {
		app.register(fastifyStatic, {
			root: options.uiDir,
			prefix: '/ui/',
			setHeaders: (res) => res.header('Cache-Control', 'no-cache')
		});
		const entryFile = join(options.uiDir, 'entry.js');
		app.get<{ Params: { version: string } }>('/ui/:version/entry.js', async (request, reply) =>
			reply
				.type('application/javascript; charset=utf-8')
				.header(
					'Cache-Control',
					request.params.version === VERSION ? 'public, max-age=31536000, immutable' : 'no-cache'
				)
				.send(await readFile(entryFile))
		);
	}

	app.register(async (secured) => {
		secured.addHook('onRequest', authenticate);
		registerPlatformRoutes(secured, core);
		registerOwnerRoutes(secured, core, 'client');
		registerOwnerRoutes(secured, core, 'demo');
		registerCaseRoutes(secured, core);
	});

	return { app, core };
};
