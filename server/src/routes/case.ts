import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { CaseEntries, CaseOverview, CaseTool, NotificationPrefs } from '../../../shared/api.ts';
import { toolTexts } from '../../../shared/catalog.ts';
import { formatPeriod } from '../../../shared/days.ts';
import { i18n, langOf, localized } from '../../../shared/i18n/index.ts';
import { HttpError, type Core } from '../app.ts';
import { isCounsellor, type Claims } from '../auth.ts';
import { isActive, isReadable } from '../core/access.ts';
import { counsellorNames, readLinked } from '../core/links.ts';
import { APP_ID, SLOTS } from '../core/manifest.ts';
import { renderPdf, type PdfWriter } from '../core/pdf.ts';
import { isOffered, optionsOf, type Settings } from '../core/settings.ts';
import type { ServerTool } from '../tools/types.ts';

const prefsBody = z.object({ firstShare: z.boolean(), newEntry: z.boolean(), changedEntry: z.boolean() });
const seenBody = z.object({ until: z.iso.datetime().optional() });
const DAY = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const exportQuery = z.object({
	from: DAY.optional(),
	to: DAY.optional(),
	lang: z.string().max(20).optional()
});

/** Access to a case for the counsellor in the token; shared by the case routes and the internal reads. */
export const caseReader = (core: Core) => {
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
	const readable = async (claims: Claims, toolId: string) => {
		const target = inCase(claims);
		const tool = core.tool(toolId);
		const [settings, release, share] = await Promise.all([
			core.settings(claims),
			store.releaseOf(target.tenantId, target.askerId, tool.id),
			store.shareOf(target.tenantId, target.askerId, tool.id)
		]);
		if (!isReadable(settings, tool, release, share)) {
			throw new HttpError(403, 'not shared');
		}
		return { ...target, tool, settings, share };
	};

	/** Linked tools are shown to counsellors only while the client shares them as well. */
	const linkedOf = (tenantId: number, askerId: string, tool: ServerTool, settings: Settings) =>
		readLinked(
			core.tools,
			tool,
			settings,
			async (other) => {
				const [release, share] = await Promise.all([
					store.releaseOf(tenantId, askerId, other.id),
					store.shareOf(tenantId, askerId, other.id)
				]);
				return isReadable(settings, other, release, share);
			},
			(other) => store.entries(tenantId, askerId, other.id)
		);

	/** The counsellor export of a readable tool: its language, the period of the entries and the content. */
	const exportOf = async (claims: Claims, toolId: string, query: unknown) => {
		const { tenantId, askerId, tool, settings } = await readable(claims, toolId);
		const { lang, ...dates } = exportQuery.parse(query);
		const range = tool.exportRange ? dates : {};
		const language = i18n(langOf(lang));
		const [entries, linked, context] = await Promise.all([
			store.entries(tenantId, askerId, tool.id, range),
			linkedOf(tenantId, askerId, tool, settings),
			tool.counsellorNames ? host.context(claims, 'asker') : null
		]);
		const days = entries.map((entry) => entry.day ?? entry.updatedAt.slice(0, 10)).sort();
		const first = range.from ?? days[0];
		const last = range.to ?? days[days.length - 1];
		return {
			tool,
			language,
			title: toolTexts(language.m, tool.id).title,
			period: !first || !last ? language.m.pdf.noEntries : formatPeriod(first, last, language.lang),
			write: (writer: PdfWriter) =>
				tool.exportPdf(writer, {
					entries,
					options: optionsOf(settings, tool),
					linked,
					counsellors: counsellorNames(context, claims.agencyId),
					i18n: language
				})
		};
	};

	return { counsellor, inCase, readable, linkedOf, exportOf };
};

/**
 * The counsellor's side of a case. The client comes from the token's `askerId`, which the
 * AddonService only sets for a counsellor with access to the session.
 */
export const registerCaseRoutes = (app: FastifyInstance, core: Core): void => {
	const { store, host } = core;
	const reader = caseReader(core);
	const { counsellor, inCase, linkedOf, exportOf } = reader;
	const readable = (request: FastifyRequest) =>
		reader.readable(request.claims, (request.params as { tool: string }).tool);

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
			await Promise.all([
				host.audit(request.claims, {
					action: 'tool.released',
					appId: APP_ID,
					summary: localized(({ m, t }) => t(m.audit.released, { tool: toolTexts(m, tool.id).title })),
					subject: 'asker'
				}),
				host.notify(request.claims, {
					recipient: 'asker',
					appId: APP_ID,
					important: true,
					title: localized(({ m }) => m.notifications.releasedTitle),
					text: localized(({ m, t }) => t(m.notifications.released, { tool: toolTexts(m, tool.id).title })),
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
			await host.audit(request.claims, {
				action: 'tool.withdrawn',
				appId: APP_ID,
				summary: localized(({ m, t }) => t(m.audit.withdrawn, { tool: toolTexts(m, tool.id).title })),
				subject: 'asker'
			});
		}
		return { released: false };
	});

	app.get('/api/case/tools/:tool/entries', async (request): Promise<CaseEntries> => {
		const { tenantId, askerId, counsellorId, tool, settings, share } = await readable(request);
		const [entries, seenAt, linked] = await Promise.all([
			store.entries(tenantId, askerId, tool.id),
			store.seenAt(tenantId, counsellorId, askerId, tool.id),
			linkedOf(tenantId, askerId, tool, settings)
		]);
		return {
			id: tool.id,
			options: optionsOf(settings, tool),
			entries,
			seenAt: seenAt?.toISOString() ?? null,
			sharedSince: share?.sharedSince?.toISOString() ?? null,
			exportRange: Boolean(tool.exportRange),
			linked
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
		const { tool, language, title, period, write } = await exportOf(
			request.claims,
			(request.params as { tool: string }).tool,
			request.query
		);
		const { m, t } = language;
		const sessionId = request.claims.sessionId;
		const createdAt = core.now();
		const pdf = await renderPdf(
			{
				toolTitle: title,
				caseLabel: sessionId ? t(m.pdf.caseLabel, { id: String(sessionId) }) : m.pdf.caseWithoutId,
				createdAt,
				period
			},
			core.timeZone,
			language,
			write
		);
		await host.audit(request.claims, {
			action: 'tool.exported',
			appId: APP_ID,
			summary: localized(({ m: texts, t: format }) =>
				format(texts.audit.exported, { tool: toolTexts(texts, tool.id).title })
			),
			subject: 'asker'
		});
		const fileName = `${tool.id}${sessionId ? `-${m.pdf.fileCase}-${sessionId}` : ''}-${createdAt.toISOString().slice(0, 10)}.pdf`;
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
