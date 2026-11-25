import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { toolTexts } from '../../../shared/catalog.ts';
import { i18n, langOf } from '../../../shared/i18n/index.ts';
import type { Core } from '../app.ts';
import { isReadable } from '../core/access.ts';
import { createTextWriter } from '../core/text.ts';
import { caseReader } from './case.ts';

const langQuery = z.object({ lang: z.string().max(20).optional() });

export interface InternalCaseTools {
	tools: Array<{ id: string; title: string; lastChangedAt: string | null }>;
}

export interface InternalCaseText {
	id: string;
	title: string;
	text: string;
}

/**
 * Reads for trusted add-ons inside the cluster (`TRUSTED_READERS`), with the add-on token the
 * AddonService issued to them for a counsellor in a case. They neither mark entries as seen nor
 * notify nor audit; settings come from the snapshot (see `Core.settings`).
 */
export const registerInternalRoutes = (app: FastifyInstance, core: Core): void => {
	const { store } = core;
	const reader = caseReader(core);

	app.get('/internal/case/tools', async (request): Promise<InternalCaseTools> => {
		const { tenantId, askerId } = reader.inCase(request.claims);
		const { m } = i18n(langOf(langQuery.parse(request.query).lang));
		const [settings, releases, shares, summaries] = await Promise.all([
			core.settings(request.claims),
			store.releasesOf(tenantId, askerId),
			store.sharesOf(tenantId, askerId),
			store.entrySummaries(tenantId, askerId)
		]);
		return {
			tools: core.tools
				.filter((tool) => isReadable(settings, tool, releases.get(tool.id), shares.get(tool.id)))
				.map((tool) => ({
					id: tool.id,
					title: toolTexts(m, tool.id).title,
					lastChangedAt: summaries.get(tool.id)?.lastChangedAt?.toISOString() ?? null
				}))
		};
	});

	app.get('/internal/case/tools/:tool/text', async (request): Promise<InternalCaseText> => {
		const { tool, language, title, period, write } = await reader.exportOf(
			request.claims,
			(request.params as { tool: string }).tool,
			request.query
		);
		const { writer, text } = createTextWriter();
		write(writer);
		return { id: tool.id, title, text: `${language.m.pdf.period}: ${period}\n\n${text()}` };
	});
};
