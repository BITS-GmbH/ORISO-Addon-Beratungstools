import { describe, expect, it } from 'vitest';
import { i18n } from '../../shared/i18n/index.ts';
import { snippet } from '../../shared/tools/relatives-diary.ts';
import { entrySchema, relativesDiary } from '../src/tools/relatives-diary/index.ts';
import { createWriter } from './pdfWriter.ts';

describe('relatives-diary', () => {
	it('keeps a text, a mood or both', () => {
		expect(entrySchema.parse({ text: ' Heute ', mood: 3 })).toEqual({ text: 'Heute', mood: 3 });
		expect(entrySchema.parse({ text: '', mood: 1 })).toEqual({ mood: 1 });
		expect(entrySchema.safeParse({ text: ' ' }).success).toBe(false);
		expect(entrySchema.safeParse({ mood: 6 }).success).toBe(false);
		expect(entrySchema.safeParse({ text: 'x'.repeat(10001) }).success).toBe(false);
	});

	it('keys entries by day and links to the planned activities', () => {
		const kind = relativesDiary.kinds.entry!;
		expect(kind.dated).toBe(true);
		expect(kind.keys?.('2026-11-20')).toBe(true);
		expect(kind.keys?.('2026-11-31')).toBe(false);
		expect(relativesDiary.reads).toEqual(['active']);
		expect(relativesDiary.exportRange).toBe(true);
	});

	it('shortens long entries at a word for the week view', () => {
		expect(snippet('kurz')).toBe('kurz');
		const cut = snippet('Wort '.repeat(40));
		expect(cut.endsWith(' …')).toBe(true);
		expect(cut.length).toBeLessThanOrEqual(102);
	});

	it('exports the days in order with mood and text', () => {
		const { writer, text } = createWriter();
		const entry = (day: string, data: unknown) => ({
			id: day,
			kind: 'entry',
			key: day,
			day,
			data,
			createdAt: '',
			updatedAt: ''
		});
		relativesDiary.exportPdf(writer, {
			entries: [entry('2026-11-20', { text: 'Später' }), entry('2026-11-18', { text: 'Früher', mood: 2 })],
			options: {},
			linked: {},
			counsellors: [],
			i18n: i18n('de')
		});
		expect(text()).toBe(
			'## Mittwoch, 18.11.2026\nBewertung des Tages: eher schlecht\nFrüher\n## Freitag, 20.11.2026\nBewertung des Tages: keine Angabe\nSpäter'
		);
	});
});
