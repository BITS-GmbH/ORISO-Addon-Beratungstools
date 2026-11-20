import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { ClientTool, ClientToolList, Entry } from '../../../shared/api.ts';
import { toolInfo } from '../../../shared/catalog.ts';
import { HttpError, type Core } from '../app.ts';
import { isAsker, isCounsellor, type Claims } from '../auth.ts';
import { isActive } from '../core/access.ts';
import { APP_ID } from '../core/manifest.ts';
import { allowsSharing, isOffered, optionsOf } from '../core/settings.ts';
import type { EntryChange } from '../store.ts';
import type { EntryKind, ServerTool } from '../tools/types.ts';

const DAY = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const createBody = z.object({ kind: z.string().min(1).max(40), day: DAY.nullish(), data: z.unknown() });
const updateBody = z.object({ day: DAY.nullish(), data: z.unknown() });
const shareBody = z.object({ shared: z.boolean() });

interface Owner {
	tenantId: number;
	ownerId: string;
	demo: boolean;
}

type Mode = 'client' | 'demo';

/**
 * The tool as its user works with it: the client on their own data (`/api/me`), or a counsellor
 * in demo mode on separate data owned by `demo:<counsellorId>` (`/api/demo`). Demo data never
 * triggers notifications, audit entries or counts in statistics.
 */
export const registerOwnerRoutes = (app: FastifyInstance, core: Core, mode: Mode): void => {
	const { store } = core;
	const prefix = mode === 'client' ? '/api/me' : '/api/demo';

	const ownerOf = (claims: Claims): Owner => {
		if (mode === 'client' && isAsker(claims)) {
			return { tenantId: claims.tenantId, ownerId: claims.sub, demo: false };
		}
		if (mode === 'demo' && isCounsellor(claims)) {
			return { tenantId: claims.tenantId, ownerId: `demo:${claims.sub}`, demo: true };
		}
		throw new HttpError(403, 'not allowed');
	};

	/** The owner and the tool, after checking it is offered and (for clients) released. */
	const access = async (request: FastifyRequest) => {
		const owner = ownerOf(request.claims);
		const tool = core.tool((request.params as { tool: string }).tool);
		const settings = await core.settings(request.claims);
		if (!isOffered(settings, tool)) {
			throw new HttpError(404, 'tool not offered');
		}
		if (!owner.demo) {
			const release = await store.releaseOf(owner.tenantId, owner.ownerId, tool.id);
			if (!isActive(release)) {
				throw new HttpError(403, 'not released');
			}
		}
		return { owner, tool, settings };
	};

	const kindOf = (tool: ServerTool, kind: string): EntryKind => {
		const definition = tool.kinds[kind];
		if (!definition) {
			throw new HttpError(400, `unknown kind ${kind}`);
		}
		return definition;
	};

	const checkDay = (definition: EntryKind, day: string | null | undefined) => {
		if (definition.dated && !day) {
			throw new HttpError(400, 'day is required');
		}
		return definition.dated ? day : null;
	};

	/** New and changed entries in a shared tool notify the client's counsellors (bundled). */
	const afterWrite = async (request: FastifyRequest, owner: Owner, tool: ServerTool, change: EntryChange) => {
		if (owner.demo || change === 'unchanged') {
			return;
		}
		const share = await store.shareOf(owner.tenantId, owner.ownerId, tool.id);
		if (share?.shared) {
			await core.notifier.record(request.claims, tool.id, change === 'created' ? 'newEntry' : 'changedEntry');
		}
	};

	const seedDemo = async (owner: Owner, tool: ServerTool) => {
		const now = core.now();
		for (const seed of tool.demo?.() ?? []) {
			const definition = kindOf(tool, seed.kind);
			const data = definition.schema.parse(seed.data);
			const write = { kind: seed.kind, key: seed.key ?? null, day: seed.day ?? null, data };
			if (seed.key) {
				await store.putKeyed(owner.tenantId, owner.ownerId, tool.id, { ...write, key: seed.key }, now);
			} else {
				await store.createEntry(owner.tenantId, owner.ownerId, tool.id, write, now);
			}
		}
		await store.setShare(owner.tenantId, owner.ownerId, tool.id, false, now);
	};

	if (mode === 'client') {
		app.get(`${prefix}/tools`, async (request): Promise<ClientToolList> => {
			const owner = ownerOf(request.claims);
			const settings = await core.settings(request.claims);
			const [releases, shares, summaries] = await Promise.all([
				store.releasesOf(owner.tenantId, owner.ownerId),
				store.sharesOf(owner.tenantId, owner.ownerId),
				store.entrySummaries(owner.tenantId, owner.ownerId)
			]);
			core.notifier.flushInBackground(request.claims);
			return {
				tools: core.tools.flatMap((tool) => {
					const release = releases.get(tool.id);
					if (!isOffered(settings, tool) || !isActive(release)) {
						return [];
					}
					return [
						{
							id: tool.id,
							releasedAt: release.releasedAt.toISOString(),
							opened: Boolean(release.openedAt),
							shared: allowsSharing(settings) && Boolean(shares.get(tool.id)?.shared),
							hasEntries: (summaries.get(tool.id)?.total ?? 0) > 0
						}
					];
				})
			};
		});
	}

	app.get(`${prefix}/tools/:tool`, async (request): Promise<ClientTool> => {
		const { owner, tool, settings } = await access(request);
		let share = await store.shareOf(owner.tenantId, owner.ownerId, tool.id);
		let entries: Entry[] = await store.entries(owner.tenantId, owner.ownerId, tool.id);
		if (owner.demo && !share && entries.length === 0) {
			await seedDemo(owner, tool);
			share = await store.shareOf(owner.tenantId, owner.ownerId, tool.id);
			entries = await store.entries(owner.tenantId, owner.ownerId, tool.id);
		}
		if (!owner.demo) {
			await store.markOpened(owner.tenantId, owner.ownerId, tool.id, core.now());
			core.notifier.flushInBackground(request.claims);
		}
		return {
			id: tool.id,
			demo: owner.demo,
			shared: allowsSharing(settings) && Boolean(share?.shared),
			allowSharing: allowsSharing(settings),
			options: optionsOf(settings, tool),
			entries
		};
	});

	app.post(`${prefix}/tools/:tool/entries`, async (request, reply) => {
		const { owner, tool } = await access(request);
		const body = createBody.parse(request.body);
		const definition = kindOf(tool, body.kind);
		if (definition.keys) {
			throw new HttpError(400, `kind ${body.kind} is keyed`);
		}
		const data = definition.schema.parse(body.data);
		if (
			definition.max &&
			(await store.countKind(owner.tenantId, owner.ownerId, tool.id, body.kind)) >= definition.max
		) {
			throw new HttpError(409, `at most ${definition.max} entries of kind ${body.kind}`);
		}
		const entry = await store.createEntry(
			owner.tenantId,
			owner.ownerId,
			tool.id,
			{ kind: body.kind, day: checkDay(definition, body.day), data },
			core.now()
		);
		await afterWrite(request, owner, tool, 'created');
		return reply.code(201).send(entry);
	});

	app.put(`${prefix}/tools/:tool/entries/:id`, async (request) => {
		const { owner, tool } = await access(request);
		const { id } = request.params as { id: string };
		const existing = await store.entry(owner.tenantId, owner.ownerId, tool.id, id);
		if (!existing) {
			throw new HttpError(404, 'no such entry');
		}
		const definition = kindOf(tool, existing.kind);
		const body = updateBody.parse(request.body);
		const data = definition.schema.parse(body.data);
		const result = await store.updateEntry(
			owner.tenantId,
			owner.ownerId,
			tool.id,
			id,
			{ data, day: definition.dated ? checkDay(definition, body.day) : null },
			core.now()
		);
		if (!result) {
			throw new HttpError(404, 'no such entry');
		}
		await afterWrite(request, owner, tool, result.change);
		return result.entry;
	});

	app.delete(`${prefix}/tools/:tool/entries/:id`, async (request, reply) => {
		const { owner, tool } = await access(request);
		const { id } = request.params as { id: string };
		if (!(await store.deleteEntry(owner.tenantId, owner.ownerId, tool.id, id))) {
			throw new HttpError(404, 'no such entry');
		}
		return reply.code(204).send();
	});

	const keyedTarget = (tool: ServerTool, params: unknown) => {
		const { kind, key } = params as { kind: string; key: string };
		const definition = kindOf(tool, kind);
		if (!definition.keys || !definition.keys(key)) {
			throw new HttpError(400, `no key ${key} for kind ${kind}`);
		}
		return { kind, key, definition };
	};

	app.put(`${prefix}/tools/:tool/keyed/:kind/:key`, async (request) => {
		const { owner, tool } = await access(request);
		const { kind, key, definition } = keyedTarget(tool, request.params);
		const body = updateBody.parse(request.body);
		const data = definition.schema.parse(body.data);
		const result = await store.putKeyed(
			owner.tenantId,
			owner.ownerId,
			tool.id,
			{ kind, key, day: checkDay(definition, body.day), data },
			core.now()
		);
		await afterWrite(request, owner, tool, result.change);
		return result.entry;
	});

	app.delete(`${prefix}/tools/:tool/keyed/:kind/:key`, async (request, reply) => {
		const { owner, tool } = await access(request);
		const { kind, key } = keyedTarget(tool, request.params);
		await store.deleteKeyed(owner.tenantId, owner.ownerId, tool.id, kind, key);
		return reply.code(204).send();
	});

	app.put(`${prefix}/tools/:tool/share`, async (request) => {
		const { owner, tool, settings } = await access(request);
		const { shared } = shareBody.parse(request.body);
		if (shared && !allowsSharing(settings)) {
			throw new HttpError(403, 'sharing is switched off');
		}
		const wasShared = await store.setShare(owner.tenantId, owner.ownerId, tool.id, shared, core.now());
		if (!owner.demo && shared !== wasShared) {
			const title = toolInfo(tool.id)?.title.de ?? tool.id;
			await core.host.audit(
				request.claims,
				shared
					? {
							action: 'tool.shared',
							appId: APP_ID,
							summary: { de: `Einsicht in „${title}“ freigegeben` },
							subject: 'self'
						}
					: {
							action: 'tool.unshared',
							appId: APP_ID,
							summary: { de: `Einsicht in „${title}“ zurückgenommen` },
							subject: 'self'
						}
			);
			if (shared) {
				await core.notifier.record(request.claims, tool.id, 'firstShare');
			}
		}
		return { shared };
	});

	if (mode === 'demo') {
		app.post(`${prefix}/tools/:tool/reset`, async (request, reply) => {
			const { owner, tool } = await access(request);
			await store.clearTool(owner.tenantId, owner.ownerId, tool.id);
			await seedDemo(owner, tool);
			return reply.code(204).send();
		});
	}
};
