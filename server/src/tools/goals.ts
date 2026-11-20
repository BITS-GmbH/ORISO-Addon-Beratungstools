import { z } from 'zod';
import type { Answer } from '../../../shared/tools/goals.ts';
import { ANSWER_KIND, isStepId, MAX_ANSWER_LENGTH, STEPS } from '../../../shared/tools/goals.ts';
import type { ServerTool } from './types.ts';

export const answerSchema = z.object({ text: z.string().trim().min(1).max(MAX_ANSWER_LENGTH) });

const REMINDER_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

export const goals: ServerTool = {
	id: 'goals',
	kinds: {
		[ANSWER_KIND]: { schema: answerSchema, keys: isStepId }
	},
	options: {
		intro: {
			type: 'string',
			title: 'Einleitung',
			description: 'Steht über den Fragen. Leer lassen für den Standardtext.',
			maxLength: 1500,
			format: 'textarea',
			default: ''
		}
	},
	exportPdf(pdf, { entries }) {
		const answers = new Map(
			entries.filter((e) => e.kind === ANSWER_KIND).map((e) => [e.key, (e.data as Answer).text])
		);
		if (answers.size === 0) {
			pdf.paragraph('Noch keine Antworten.', { muted: true });
			return;
		}
		for (const step of STEPS) {
			pdf.field(step.counsellorLabel, answers.get(step.id) ?? 'Keine Angabe');
		}
	},
	demo: () => [
		{
			kind: ANSWER_KIND,
			key: 'situation',
			data: { text: 'Ich trinke seit einigen Monaten fast jeden Abend, meistens zwei bis drei Bier.' }
		}
	],
	calendar({ releasedAt, shared, entries }) {
		const answered = new Set(entries.filter((e) => e.kind === ANSWER_KIND).map((e) => e.key));
		if (shared || STEPS.every((step) => answered.has(step.id))) {
			return [];
		}
		return [
			{
				id: 'goals-fill-in',
				kind: 'reminder',
				title: { de: 'Ausgangssituation und Ziele ausfüllen', en: 'Fill in starting point and goals' },
				start: new Date(Date.parse(releasedAt) + REMINDER_DELAY_MS).toISOString(),
				allDay: true
			}
		];
	}
};
