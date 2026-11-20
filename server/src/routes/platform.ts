import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { HttpError, type Core } from '../app.ts';
import { hasRole, isAsker, isCounsellor, SERVICE_ROLE } from '../auth.ts';
import { isActive, isReadable } from '../core/access.ts';
import { APP_ID, SLOTS } from '../core/manifest.ts';
import { isOffered } from '../core/settings.ts';

const eventBody = z.looseObject({
	id: z.string().optional(),
	type: z.string(),
	userId: z.string().optional()
});
const calendarQuery = z.object({
	from: z.iso.datetime({ offset: true }).optional(),
	to: z.iso.datetime({ offset: true }).optional()
});

/** What the AddonService calls besides the API: visibility, statistics, lifecycle events, calendar. */
export const registerPlatformRoutes = (app: FastifyInstance, core: Core): void => {
	const { store } = core;

	/**
	 * Clients see the app once a tool is released, with a badge for tools they have not opened yet;
	 * counsellors always, with a badge for the case's tools that have entries new to them.
	 */
	app.get('/visibility', async (request) => {
		const { claims } = request;
		if (isAsker(claims)) {
			const [settings, releases] = await Promise.all([
				core.settings(claims),
				store.releasesOf(claims.tenantId, claims.sub)
			]);
			const released = core.tools.filter(
				(tool) => isOffered(settings, tool) && isActive(releases.get(tool.id))
			);
			const unopened = released.filter((tool) => !releases.get(tool.id)?.openedAt).length;
			core.notifier.flushInBackground(claims);
			return {
				apps: {
					[APP_ID]:
						released.length > 0
							? { visible: true, ...(unopened ? { badge: unopened } : {}) }
							: { visible: false }
				}
			};
		}
		if (isCounsellor(claims)) {
			if (!claims.askerId) {
				return { apps: { [APP_ID]: { visible: true } } };
			}
			const [settings, releases, shares, summaries] = await Promise.all([
				core.settings(claims),
				store.releasesOf(claims.tenantId, claims.askerId),
				store.sharesOf(claims.tenantId, claims.askerId),
				store.entrySummaries(claims.tenantId, claims.askerId, claims.sub)
			]);
			const fresh = core.tools.filter(
				(tool) =>
					isReadable(settings, tool, releases.get(tool.id), shares.get(tool.id)) &&
					(summaries.get(tool.id)?.unseen ?? 0) > 0
			).length;
			return { apps: { [APP_ID]: { visible: true, ...(fresh ? { badge: fresh } : {}) } } };
		}
		return { apps: { [APP_ID]: { visible: false } } };
	});

	app.get('/stats', async (request) => {
		const { claims } = request;
		const tenantId = Number((request.query as { tenantId?: string }).tenantId);
		if (!hasRole(claims, SERVICE_ROLE) || tenantId !== claims.tenantId) {
			throw new HttpError(403, 'forbidden');
		}
		const stats = await store.statistics(tenantId);
		const values: Record<string, number> = {};
		for (const tool of core.tools) {
			const value = stats.get(tool.id) ?? { released: 0, started: 0, shared: 0 };
			values[`${tool.id}.released`] = value.released;
			values[`${tool.id}.started`] = value.started;
			values[`${tool.id}.shared`] = value.shared;
		}
		return { values };
	});

	/**
	 * Lifecycle events (ADR-034 section 6), delivered by the AddonService with retries: handlers are
	 * idempotent and accept unknown ids. `session.deleted` is not subscribed: the data belongs to
	 * the client, not to a session.
	 */
	app.post('/events', async (request, reply) => {
		if (!hasRole(request.claims, SERVICE_ROLE)) {
			throw new HttpError(403, 'forbidden');
		}
		const event = eventBody.parse(request.body);
		if (event.type === 'user.deleted' && event.userId) {
			const removed = await store.deleteUser(event.userId);
			request.log.info(`lifecycle ${event.id ?? '?'} user.deleted: ${removed} row(s)`);
		}
		return reply.code(204).send();
	});

	app.get('/calendar', async (request) => {
		const { claims } = request;
		const { from, to } = calendarQuery.parse(request.query);
		if (!isAsker(claims)) {
			return { entries: [] };
		}
		const [settings, releases, shares] = await Promise.all([
			core.settings(claims),
			store.releasesOf(claims.tenantId, claims.sub),
			store.sharesOf(claims.tenantId, claims.sub)
		]);
		const entries = [];
		for (const tool of core.tools) {
			const release = releases.get(tool.id);
			if (!tool.calendar || !isOffered(settings, tool) || !isActive(release)) {
				continue;
			}
			const own = await store.entries(claims.tenantId, claims.sub, tool.id);
			for (const entry of tool.calendar({
				releasedAt: release.releasedAt.toISOString(),
				shared: Boolean(shares.get(tool.id)?.shared),
				entries: own
			})) {
				entries.push({ ...entry, appId: APP_ID, link: { slot: SLOTS.askerNavigation } });
			}
		}
		const inRange = entries.filter(({ start }) => {
			const time = Date.parse(start);
			return (!from || time >= Date.parse(from)) && (!to || time < Date.parse(to));
		});
		return { entries: inRange };
	});
};
