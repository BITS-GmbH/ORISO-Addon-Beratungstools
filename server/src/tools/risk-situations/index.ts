import { z } from 'zod';
import type { Entry } from '../../../../shared/api.ts';
import {
	DIFFICULTY_VALUES,
	difficultyOf,
	MAX_ANSWER_LENGTH,
	MAX_RELAPSES,
	MAX_SITUATION_LENGTH,
	MAX_SITUATIONS,
	MAX_STRATEGY_LENGTH,
	RELAPSE_KIND,
	RELAPSE_ANSWERS,
	relapsesOf,
	SITUATION_KIND,
	situationsOf,
	type Difficulty,
	type RelapseItem,
	type SituationItem
} from '../../../../shared/tools/risk-situations.ts';
import type { I18n } from '../../../../shared/i18n/index.ts';
import type { PdfWriter } from '../../core/pdf.ts';
import type { ServerTool } from '../types.ts';

const text = (max: number) => z.string().trim().max(max);

export const situationSchema = z.object({
	situation: text(MAX_SITUATION_LENGTH).min(1),
	difficulty: z.enum(DIFFICULTY_VALUES),
	strategy: text(MAX_STRATEGY_LENGTH)
});

export const relapseSchema = z.object({
	situationId: z.string().min(1).max(64),
	circumstances: text(MAX_ANSWER_LENGTH),
	feelings: text(MAX_ANSWER_LENGTH),
	mainReason: text(MAX_ANSWER_LENGTH),
	alternatives: text(MAX_ANSWER_LENGTH),
	previousStrategy: text(MAX_STRATEGY_LENGTH),
	newStrategy: text(MAX_STRATEGY_LENGTH)
});

const formatDay = (i18n: I18n, iso: string) => i18n.date(iso, { timeZone: 'Europe/Berlin' });

const difficultyLabel = (i18n: I18n, value: string) => {
	const difficulty = difficultyOf(value);
	return difficulty ? i18n.m.riskSituations.difficulty[difficulty.value] : '';
};

const relapseState = (i18n: I18n, relapses: RelapseItem[]) =>
	relapses[0]
		? i18n.t(i18n.m.riskSituations.relapseState, { date: formatDay(i18n, relapses[0].entry.createdAt) })
		: i18n.m.riskSituations.notEdited;

const writeTable = (pdf: PdfWriter, i18n: I18n, situations: SituationItem[], entries: Entry[]) => {
	const texts = i18n.m.riskSituations;
	pdf.table(
		[
			{ label: texts.columns.situation, width: 3 },
			{ label: texts.columns.difficulty, width: 1.2 },
			{ label: texts.columns.strategy, width: 3 },
			{ label: texts.columns.relapse, width: 1.5 }
		],
		situations.map((item) => [
			item.situation,
			difficultyLabel(i18n, item.difficulty),
			item.strategy || texts.noStrategy,
			relapseState(i18n, relapsesOf(entries, item.id))
		])
	);
};

const writeRelapse = (pdf: PdfWriter, i18n: I18n, relapse: RelapseItem) => {
	const texts = i18n.m.riskSituations;
	for (const id of RELAPSE_ANSWERS) {
		pdf.field(texts.answers[id], relapse[id] || texts.noAnswer);
	}
	pdf.field(texts.previousStrategy, relapse.previousStrategy || texts.noAnswer);
	pdf.field(texts.newStrategy, relapse.newStrategy || texts.noAnswer);
};

const DEMO_DIFFICULTIES: Difficulty[] = ['hard', 'medium'];

export const riskSituations: ServerTool = {
	id: 'risk-situations',
	kinds: {
		[SITUATION_KIND]: { schema: situationSchema, max: MAX_SITUATIONS },
		[RELAPSE_KIND]: { schema: relapseSchema, max: MAX_RELAPSES }
	},
	exportPdf(pdf, { entries, i18n }) {
		const texts = i18n.m.riskSituations;
		const situations = situationsOf(entries);
		if (situations.length === 0) {
			pdf.paragraph(texts.noSituations, { muted: true });
			return;
		}
		pdf.heading(i18n.m.catalog['risk-situations'].title);
		writeTable(pdf, i18n, situations, entries);
		for (const item of situations) {
			const relapses = relapsesOf(entries, item.id);
			if (relapses.length === 0) {
				continue;
			}
			pdf.heading(i18n.t(texts.pdfRelapses, { situation: item.situation }));
			for (const relapse of relapses) {
				pdf.subheading(i18n.t(texts.analysisOf, { date: formatDay(i18n, relapse.entry.createdAt) }));
				writeRelapse(pdf, i18n, relapse);
			}
		}
	},
	clientExports: {
		table: {
			title: ({ m }) => m.riskSituations.heading,
			write(pdf, { entries, i18n }) {
				const situations = situationsOf(entries);
				if (situations.length === 0) {
					pdf.paragraph(i18n.m.riskSituations.noSituations, { muted: true });
					return;
				}
				writeTable(pdf, i18n, situations, entries);
			}
		},
		relapse: {
			title: ({ m }) => m.riskSituations.analyseRelapse,
			write(pdf, { entries, params, i18n }) {
				const texts = i18n.m.riskSituations;
				const relapse = entries.find((e) => e.kind === RELAPSE_KIND && e.id === params.id);
				const data = relapse
					? relapsesOf([relapse], (relapse.data as { situationId: string }).situationId)[0]
					: undefined;
				if (!data) {
					pdf.paragraph(texts.analysisGone, { muted: true });
					return;
				}
				const situation = situationsOf(entries).find((item) => item.id === data.situationId);
				pdf.field(texts.mySituation, situation?.situation ?? texts.deleted);
				pdf.paragraph(i18n.t(texts.analysisOf, { date: formatDay(i18n, data.entry.createdAt) }), {
					muted: true
				});
				writeRelapse(pdf, i18n, data);
			}
		}
	},
	demo: ({ m }) =>
		m.riskSituations.demo.map((example, index) => ({
			kind: SITUATION_KIND,
			data: { ...example, difficulty: DEMO_DIFFICULTIES[index] ?? 'medium' }
		}))
};
