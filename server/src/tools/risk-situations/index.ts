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
	RELAPSE_QUESTIONS,
	relapsesOf,
	SITUATION_KIND,
	situationsOf,
	type RelapseItem,
	type SituationItem
} from '../../../../shared/tools/risk-situations.ts';
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

const formatDay = (iso: string) =>
	new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeZone: 'Europe/Berlin' }).format(new Date(iso));

const difficultyLabel = (value: string) => difficultyOf(value)?.label ?? '';

const relapseState = (relapses: RelapseItem[]) =>
	relapses[0] ? `Stand ${formatDay(relapses[0].entry.createdAt)}` : 'noch nicht bearbeitet';

const writeTable = (pdf: PdfWriter, situations: SituationItem[], entries: Entry[]) =>
	pdf.table(
		[
			{ label: 'Risikosituation', width: 3 },
			{ label: 'Bewertung', width: 1.2 },
			{ label: 'Kontrollstrategie', width: 3 },
			{ label: 'Rückfall', width: 1.5 }
		],
		situations.map((item) => [
			item.situation,
			difficultyLabel(item.difficulty),
			item.strategy || 'Noch keine Strategie',
			relapseState(relapsesOf(entries, item.id))
		])
	);

const writeRelapse = (pdf: PdfWriter, relapse: RelapseItem) => {
	for (const question of RELAPSE_QUESTIONS) {
		pdf.field(question.counsellorLabel, relapse[question.id] || 'Keine Angabe');
	}
	pdf.field('Zuvor eingetragene Kontrollstrategie', relapse.previousStrategy || 'Keine Angabe');
	pdf.field('Neue Kontrollstrategie', relapse.newStrategy || 'Keine Angabe');
};

export const riskSituations: ServerTool = {
	id: 'risk-situations',
	kinds: {
		[SITUATION_KIND]: { schema: situationSchema, max: MAX_SITUATIONS },
		[RELAPSE_KIND]: { schema: relapseSchema, max: MAX_RELAPSES }
	},
	exportPdf(pdf, { entries }) {
		const situations = situationsOf(entries);
		if (situations.length === 0) {
			pdf.paragraph('Noch keine Risikosituationen eingetragen.', { muted: true });
			return;
		}
		pdf.heading('Risikosituationen und Kontrollstrategien');
		writeTable(pdf, situations, entries);
		for (const item of situations) {
			const relapses = relapsesOf(entries, item.id);
			if (relapses.length === 0) {
				continue;
			}
			pdf.heading(`Rückfälle: ${item.situation}`);
			for (const relapse of relapses) {
				pdf.subheading(`Analyse vom ${formatDay(relapse.entry.createdAt)}`);
				writeRelapse(pdf, relapse);
			}
		}
	},
	clientExports: {
		table: {
			title: 'Meine Risikosituationen und Kontrollstrategien',
			write(pdf, { entries }) {
				const situations = situationsOf(entries);
				if (situations.length === 0) {
					pdf.paragraph('Noch keine Risikosituationen eingetragen.', { muted: true });
					return;
				}
				writeTable(pdf, situations, entries);
			}
		},
		relapse: {
			title: 'Rückfall analysieren',
			write(pdf, { entries, params }) {
				const relapse = entries.find((e) => e.kind === RELAPSE_KIND && e.id === params.id);
				const data = relapse
					? relapsesOf([relapse], (relapse.data as { situationId: string }).situationId)[0]
					: undefined;
				if (!data) {
					pdf.paragraph('Diese Analyse ist nicht mehr vorhanden.', { muted: true });
					return;
				}
				const situation = situationsOf(entries).find((item) => item.id === data.situationId);
				pdf.field('Meine Risikosituation', situation?.situation ?? 'Gelöscht');
				pdf.paragraph(`Analyse vom ${formatDay(data.entry.createdAt)}`, { muted: true });
				writeRelapse(pdf, data);
			}
		}
	},
	demo: () => [
		{
			kind: SITUATION_KIND,
			data: {
				situation: 'Freitagabend nach der Arbeit, wenn die Kollegen noch etwas trinken gehen.',
				difficulty: 'hard',
				strategy: 'Ich verabrede mich vorher zum Sport und gehe direkt nach Hause.'
			}
		},
		{
			kind: SITUATION_KIND,
			data: {
				situation: 'Wenn ich allein zu Hause bin und mich langweile.',
				difficulty: 'medium',
				strategy: 'Ich rufe jemanden an oder gehe eine Runde spazieren.'
			}
		}
	]
};
