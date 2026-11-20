import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { CaseEntries, CaseOverview, CaseTool, NotificationPrefs } from '../../../shared/api.ts';
import { toolInfo } from '../../../shared/catalog.ts';
import { HttpError, type Core } from '../app.ts';
import { isCounsellor, type Claims } from '../auth.ts';
import { isActive, isReadable } from '../core/access.ts';
import { APP_ID, SLOTS } from '../core/manifest.ts';
import { renderPdf } from '../core/pdf.ts';
import { isOffered, optionsOf } from '../core/settings.ts';

const prefsBody = z.object({ firstShare: z.boolean(), newEntry: z.boolean(), changedEntry: z.boolean() });
const seenBody = z.object({ until: z.iso.datetime().optional() });
const DAY = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const exportQuery = z.object({ from: DAY.optional(), to: DAY.optional() });

const formatDay = (day: string) => {
	const [year, month, date] = day.split('-');
	return `${date}.${month}.${year}`;
};

/**
 * The counsellor's side of a case. The client comes from the token's `askerId`, which the
 * AddonService only sets for a counsellor with access to the session.
 */
export const registerCaseRoutes = (app: FastifyInstance, core: Core): void => {
	const { store, host } = core;

	const counsellor = (claims: Claims) => {
		if (!isCounsellor(claims)) {
			throw new HttpError(403, 'not allowed');
		}
		return claims;
	};

	const inCase = (claims: Claims) => {
		counsellor(claims);
		if (!claims.askerId) {
			throw new HttpError(400, 'no client context');
		}
		return { tenantId: claims.tenantId, askerId: claims.askerId, counsellorId: claims.sub };
	};

	/** The tool and the client, after checking right now that the counsellor may read its entries. */
	const readable = async (request: FastifyRequest) => {
		const target = inCase(request.claims);
		const tool = core.tool((request.params as { tool: string }).tool);
		const [settings, release, share] = await Promise.all([
			core.settings(request.claims),
			store.releaseOf(target.tenantId, target.askerId, tool.id),
			store.shareOf(target.tenantId, target.askerId, tool.id)
		]);
		if (!isReadable(settings, tool, release, share)) {
			throw new HttpError(403, 'not shared');
		}
		return { ...target, tool, settings, share };
	};

	const offeredTool = async (request: FastifyRequest) => {
		const tool = core.tool((request.params as { tool: string }).tool);
		if (!isOffered(await core.settings(request.claims), tool)) {
			throw new HttpError(404, 'tool not offered');
		}
		return tool;
	};

	app.get('/api/case/tools', async (request): Promise<CaseOverview> => {
		const { tenantId, askerId, counsellorId } = inCase(request.claims);
		const [settings, releases, shares, summaries] = await Promise.all([
			core.settings(request.claims),
			store.releasesOf(tenantId, askerId),
			store.sharesOf(tenantId, askerId),
			store.entrySummaries(tenantId, askerId, counsellorId)
		]);
		const tools = core.tools
			.filter((tool) => isOffered(settings, tool))
			.map((tool): CaseTool => {
				const release = releases.get(tool.id);
				const share = shares.get(tool.id);
				const summary = summaries.get(tool.id);
				const readableNow = isReadable(settings, tool, release, share);
				return {
					id: tool.id,
					released: isActive(release),
					releasedAt: isActive(release) ? release.releasedAt.toISOString() : null,
					hasEntries: (summary?.total ?? 0) > 0,
					shared: readableNow,
					sharedSince: readableNow ? (share?.sharedSince?.toISOString() ?? null) : null,
					lastChangedAt: readableNow ? (summary?.lastChangedAt?.toISOString() ?? null) : null,
					newCount: readableNow ? (summary?.unseen ?? 0) : 0,
					exportRange: Boolean(tool.exportRange)
				};
			});
		return { sessionId: request.claims.sessionId ?? null, tools };
	});

	app.post('/api/case/tools/:tool/release', async (request) => {
		const { tenantId, askerId, counsellorId } = inCase(request.claims);
		const tool = await offeredTool(request);
		const current = await store.releaseOf(tenantId, askerId, tool.id);
		if (!isActive(current)) {
			// A new release starts new counselling work and follows the Träger's DPA gate. When the
			// host cannot tell, the release goes ahead: enabling the add-on is the operator's control.
			const gates = await host.gates(request.claims);
			if (gates?.dpa?.newCounsellingAllowed === false) {
				throw new HttpError(409, 'dpa');
			}
		}
		const isNew = await store.release(tenantId, askerId, tool.id, counsellorId, core.now());
		if (isNew) {
			const title = toolInfo(tool.id)?.title ?? { de: tool.id, en: tool.id };
			await Promise.all([
				host.audit(request.claims, {
					action: 'tool.released',
					appId: APP_ID,
					summary: { de: `Tool „${title.de}“ freigeschaltet`, en: `Released tool “${title.en}”` },
					subject: 'asker'
				}),
				host.notify(request.claims, {
					recipient: 'asker',
					appId: APP_ID,
					important: true,
					title: { de: 'Neues Tool freigeschaltet', en: 'New tool released' },
					text: {
						de: `„${title.de}“ steht ab jetzt unter „Meine Tools“ bereit.`,
						en: `“${title.en}” is now available in your tools.`
					},
					target: { slot: SLOTS.askerNavigation }
				})
			]);
		}
		const release = await store.releaseOf(tenantId, askerId, tool.id);
		return { released: true, releasedAt: release?.releasedAt.toISOString() ?? null };
	});

	app.delete('/api/case/tools/:tool/release', async (request) => {
		const { tenantId, askerId } = inCase(request.claims);
		const tool = core.tool((request.params as { tool: string }).tool);
		if (await store.withdraw(tenantId, askerId, tool.id, core.now())) {
			const title = toolInfo(tool.id)?.title ?? { de: tool.id, en: tool.id };
			await host.audit(request.claims, {
				action: 'tool.withdrawn',
				appId: APP_ID,
				summary: { de: `Freischaltung „${title.de}“ aufgehoben`, en: `Withdrew tool “${title.en}”` },
				subject: 'asker'
			});
		}
		return { released: false };
	});

	app.get('/api/case/tools/:tool/entries', async (request): Promise<CaseEntries> => {
		const { tenantId, askerId, counsellorId, tool, settings, share } = await readable(request);
		const [entries, seenAt] = await Promise.all([
			store.entries(tenantId, askerId, tool.id),
			store.seenAt(tenantId, counsellorId, askerId, tool.id)
		]);
		return {
			id: tool.id,
			options: optionsOf(settings, tool),
			entries,
			seenAt: seenAt?.toISOString() ?? null,
			sharedSince: share?.sharedSince?.toISOString() ?? null
		};
	});

	app.post('/api/case/tools/:tool/seen', async (request) => {
		const { tenantId, askerId, counsellorId, tool } = await readable(request);
		const { until } = seenBody.parse(request.body ?? {});
		const now = core.now();
		const at = until && Date.parse(until) < now.getTime() ? new Date(until) : now;
		await store.markSeen(tenantId, counsellorId, askerId, tool.id, at);
		return { seenAt: at.toISOString() };
	});

	app.get('/api/case/tools/:tool/export', async (request, reply) => {
		const { tenantId, askerId, tool, settings } = await readable(request);
		const query = exportQuery.parse(request.query);
		const range = tool.exportRange ? query : {};
		const entries = await store.entries(tenantId, askerId, tool.id, range);
		const title = toolInfo(tool.id)?.title ?? { de: tool.id, en: tool.id };
		const days = entries.map((entry) => entry.day ?? entry.updatedAt.slice(0, 10)).sort();
		const first = range.from ?? days[0];
		const last = range.to ?? days[days.length - 1];
		const period =
			!first || !last
				? 'Keine Einträge'
				: first === last
					? formatDay(first)
					: `${formatDay(first)} bis ${formatDay(last)}`;
		const sessionId = request.claims.sessionId;
		const createdAt = core.now();
		const pdf = await renderPdf(
			{
				toolTitle: title.de,
				caseLabel: sessionId ? `Fall ${sessionId}` : 'Fall ohne Kennung',
				createdAt,
				period
			},
			core.timeZone,
			(writer) => tool.exportPdf(writer, { entries, options: optionsOf(settings, tool) })
		);
		await host.audit(request.claims, {
			action: 'tool.exported',
			appId: APP_ID,
			summary: { de: `Einträge aus „${title.de}“ als PDF exportiert`, en: `Exported “${title.en}” as PDF` },
			subject: 'asker'
		});
		const fileName = `${tool.id}${sessionId ? `-fall-${sessionId}` : ''}-${createdAt.toISOString().slice(0, 10)}.pdf`;
		return reply
			.header('Content-Type', 'application/pdf')
			.header('Content-Disposition', `attachment; filename="${fileName}"`)
			.send(pdf);
	});

	app.get('/api/counsellor/notification-prefs', async (request): Promise<NotificationPrefs> =>
		store.prefs(counsellor(request.claims).sub)
	);

	app.put('/api/counsellor/notification-prefs', async (request): Promise<NotificationPrefs> => {
		const { sub } = counsellor(request.claims);
		const prefs = prefsBody.parse(request.body);
		await store.setPrefs(sub, prefs, core.now());
		return prefs;
	});
};
