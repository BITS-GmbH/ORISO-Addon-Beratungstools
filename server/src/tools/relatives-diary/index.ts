import { z } from 'zod';
import { ACTIVITY_TOOL } from '../../../../shared/activities.ts';
import { addDays, formatDayLong, isDay } from '../../../../shared/days.ts';
import {
	ENTRY_KIND,
	MAX_TEXT_LENGTH,
	moodLabel,
	type DiaryEntry
} from '../../../../shared/tools/relatives-diary.ts';
import type { ServerTool } from '../types.ts';

export const entrySchema = z
	.object({
		text: z
			.string()
			.trim()
			.max(MAX_TEXT_LENGTH)
			.optional()
			.transform((value) => value || undefined),
		mood: z.number().int().min(1).max(5).optional()
	})
	.refine((entry) => entry.text || entry.mood, { message: 'text or mood is required' });

export const relativesDiary: ServerTool = {
	id: 'relatives-diary',
	kinds: {
		[ENTRY_KIND]: { schema: entrySchema, keys: isDay, dated: true }
	},
	reads: [ACTIVITY_TOOL],
	exportRange: true,
	options: {
		intro: {
			type: 'string',
			title: 'Einleitung',
			description: 'Steht über der Wochenansicht. Leer lassen für den Standardtext.',
			maxLength: 2000,
			format: 'textarea',
			default: ''
		}
	},
	exportPdf(pdf, { entries }) {
		const days = entries
			.filter((e) => e.kind === ENTRY_KIND && e.day)
			.sort((a, b) => (a.day as string).localeCompare(b.day as string));
		if (days.length === 0) {
			pdf.paragraph('Keine Einträge in diesem Zeitraum.', { muted: true });
			return;
		}
		for (const entry of days) {
			const data = entry.data as DiaryEntry;
			pdf.subheading(formatDayLong(entry.day as string));
			pdf.paragraph(`Bewertung des Tages: ${moodLabel(data.mood)}`, { muted: !data.mood });
			pdf.paragraph(data.text ?? 'Kein Text eingetragen.', { muted: !data.text });
			pdf.spacer(4);
		}
	},
	demo: () => {
		const today = new Date().toISOString().slice(0, 10);
		const seed = (offset: number, data: DiaryEntry) => {
			const day = addDays(today, offset);
			return { kind: ENTRY_KIND, key: day, day, data };
		};
		return [
			seed(-1, {
				text: 'Heute Abend gab es wieder Streit, als er spät nach Hause kam. Ich habe versucht, ruhig zu bleiben und nichts vorzuwerfen. Danach war ich erschöpft, aber auch ein bisschen stolz.',
				mood: 2
			}),
			seed(-3, {
				text: 'Ein ruhiger Tag. Wir waren zusammen spazieren und haben über den Urlaub gesprochen.',
				mood: 4
			})
		];
	}
};
