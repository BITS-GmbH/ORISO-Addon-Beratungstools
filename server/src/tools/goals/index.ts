import { z } from 'zod';
import type { Answer } from '../../../../shared/tools/goals.ts';
import { localized } from '../../../../shared/i18n/index.ts';
import { ANSWER_KIND, isStepId, MAX_ANSWER_LENGTH, STEP_IDS } from '../../../../shared/tools/goals.ts';
import type { ServerTool } from '../types.ts';

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
	exportPdf(pdf, { entries, i18n }) {
		const texts = i18n.m.goals;
		const answers = new Map(
			entries.filter((e) => e.kind === ANSWER_KIND).map((e) => [e.key, (e.data as Answer).text])
		);
		if (answers.size === 0) {
			pdf.paragraph(texts.noAnswers, { muted: true });
			return;
		}
		for (const id of STEP_IDS) {
			pdf.field(texts.steps[id].counsellorLabel, answers.get(id) ?? texts.noAnswer);
		}
	},
	demo: ({ m }) => [{ kind: ANSWER_KIND, key: 'situation', data: { text: m.goals.demoSituation } }],
	calendar({ releasedAt, shared, entries }) {
		const answered = new Set(entries.filter((e) => e.kind === ANSWER_KIND).map((e) => e.key));
		if (shared || STEP_IDS.every((id) => answered.has(id))) {
			return [];
		}
		return [
			{
				id: 'goals-fill-in',
				kind: 'reminder',
				title: localized(({ m }) => m.goals.reminder),
				start: new Date(Date.parse(releasedAt) + REMINDER_DELAY_MS).toISOString(),
				allDay: true
			}
		];
	}
};
