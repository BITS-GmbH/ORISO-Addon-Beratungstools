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
	exportPdf(pdf, { entries, i18n }) {
		const { m, t, lang } = i18n;
		const texts = m.relativesDiary;
		const days = entries
			.filter((e) => e.kind === ENTRY_KIND && e.day)
			.sort((a, b) => (a.day as string).localeCompare(b.day as string));
		if (days.length === 0) {
			pdf.paragraph(texts.pdfNoEntries, { muted: true });
			return;
		}
		for (const entry of days) {
			const data = entry.data as DiaryEntry;
			pdf.subheading(formatDayLong(entry.day as string, lang));
			pdf.paragraph(t(texts.pdfMood, { mood: moodLabel(m, data.mood) }), { muted: !data.mood });
			pdf.paragraph(data.text ?? texts.pdfNoText, { muted: !data.text });
			pdf.spacer(4);
		}
	},
	demo: ({ m }) => {
		const [yesterday, earlier] = m.relativesDiary.demoEntries;
		const today = new Date().toISOString().slice(0, 10);
		const seed = (offset: number, data: DiaryEntry) => {
			const day = addDays(today, offset);
			return { kind: ENTRY_KIND, key: day, day, data };
		};
		return [seed(-1, { text: yesterday, mood: 2 }), seed(-3, { text: earlier, mood: 4 })];
	}
};
