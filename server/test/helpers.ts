import { generateKeyPairSync, sign } from 'node:crypto';
import type { Pool } from 'mariadb';
import { buildApp } from '../src/app.ts';
import { createVerifier } from '../src/auth.ts';
import { NAME } from '../src/core/manifest.ts';
import { migrate } from '../src/db/migrate.ts';
import { openPool } from '../src/db/pool.ts';
import type { Host, HostAudit, HostContext, HostGates, HostNotification } from '../src/host.ts';
import { Store } from '../src/store.ts';
import { TOOLS } from '../src/tools/index.ts';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwks = { keys: [{ ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' }] };
const b64 = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');

export const signToken = (claims: Record<string, unknown>, header: Record<string, unknown> = {}) => {
	const head = b64({ alg: 'RS256', kid: 'k1', typ: 'JWT', ...header });
	const body = b64({
		iss: 'oriso-addonservice',
		aud: [NAME],
		exp: Math.floor(Date.now() / 1000) + 120,
		tenantId: 1,
		...claims
	});
	return `${head}.${body}.${sign('sha256', Buffer.from(`${head}.${body}`), privateKey).toString('base64url')}`;
};

export const jwksFetch: typeof fetch = async () => new Response(JSON.stringify(jwks));

export const testVerifier = (trustedReaders: string[] = []) =>
	createVerifier({
		jwksUrl: 'http://addonservice/addons/.well-known/jwks.json',
		issuer: 'oriso-addonservice',
		audience: NAME,
		trustedReaders,
		fetchImpl: jwksFetch
	});

export const tokens = {
	asker: (sub = 'asker-1', extra: Record<string, unknown> = {}) =>
		signToken({ sub, username: `user_${sub}`, roles: ['user'], ...extra }),
	counsellor: (
		askerId: string | null = 'asker-1',
		sub = 'consultant-1',
		extra: Record<string, unknown> = {}
	) =>
		signToken({
			sub,
			username: sub,
			roles: ['consultant'],
			...(askerId ? { askerId, sessionId: 4711, agencyId: 10 } : {}),
			...extra
		}),
	service: (tenantId = 1) => signToken({ sub: 'addonservice', roles: ['addon-service'], tenantId })
};

/** A host that records what the add-on asks for and answers as configured. */
export class FakeHost implements Host {
	settingsValue: Record<string, unknown> | null = {};
	gatesValue: HostGates | null = { dpa: { newCounsellingAllowed: true } };
	contextValue: HostContext | null = { sessions: [{ id: 4711, consultantId: 'consultant-1' }] };
	notifyOk = true;
	notifications: Array<{ token: string; body: HostNotification }> = [];
	audits: Array<{ token: string; body: HostAudit }> = [];

	async settings() {
		return this.settingsValue;
	}
	async gates() {
		return this.gatesValue;
	}
	async context() {
		return this.contextValue;
	}
	async notify(claims: { token: string }, body: HostNotification) {
		this.notifications.push({ token: claims.token, body });
		return this.notifyOk;
	}
	async audit(claims: { token: string }, body: HostAudit) {
		this.audits.push({ token: claims.token, body });
		return true;
	}
	take() {
		const taken = { notifications: this.notifications, audits: this.audits };
		this.notifications = [];
		this.audits = [];
		return taken;
	}
}

export const TEST_DATABASE_URL =
	process.env.TEST_DATABASE_URL ??
	'mariadb://beratungstools:beratungstools@127.0.0.1:3307/beratungstools_test';

/** An empty schema with all migrations applied. */
export const freshDatabase = async (): Promise<Pool> => {
	const pool = openPool(TEST_DATABASE_URL, 5);
	const tables = (await pool.query(
		'SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()'
	)) as Array<{ name: string }>;
	for (const { name } of tables) {
		await pool.query(`DROP TABLE \`${name}\``);
	}
	await migrate(pool, () => undefined);
	return pool;
};

export interface TestContext {
	app: ReturnType<typeof buildApp>['app'];
	core: ReturnType<typeof buildApp>['core'];
	host: FakeHost;
	pool: Pool;
	clock: { now: number; advance(ms: number): void };
	call(
		method: string,
		url: string,
		token?: string,
		body?: unknown
	): Promise<{ status: number; body: any; headers: Record<string, unknown>; raw: Buffer }>;
	close(): Promise<void>;
}

export const startApp = async (trustedReaders: string[] = []): Promise<TestContext> => {
	const pool = await freshDatabase();
	const host = new FakeHost();
	const clock = {
		now: Date.parse('2026-11-20T09:00:00.000Z'),
		advance(ms: number) {
			this.now += ms;
		}
	};
	const { app, core } = buildApp({
		store: new Store(pool),
		verify: testVerifier(trustedReaders),
		host,
		tools: TOOLS,
		now: () => new Date(clock.now),
		trustedReaders
	});
	await app.ready();
	return {
		app,
		core,
		host,
		pool,
		clock,
		async call(method, url, token, body) {
			const response = await app.inject({
				method: method as 'GET',
				url,
				headers: token ? { authorization: `Bearer ${token}` } : {},
				...(body === undefined ? {} : { payload: body as object })
			});
			const type = String(response.headers['content-type'] ?? '');
			return {
				status: response.statusCode,
				body: type.includes('json') ? response.json() : response.body,
				headers: response.headers,
				raw: response.rawPayload
			};
		},
		async close() {
			await core.notifier.settled();
			await app.close();
			await pool.end();
		}
	};
};
