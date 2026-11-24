import { describe, expect, it } from 'vitest';
import { i18n } from '../../shared/i18n/index.ts';
import { REMARKS } from '../../shared/tools/positive-perception.ts';
import { behaviourSchema, positivePerception } from '../src/tools/positive-perception/index.ts';
import { createWriter } from './pdfWriter.ts';

describe('Positives Wahrnehmen input', () => {
	it('keeps a trimmed behaviour', () => {
		expect(behaviourSchema.parse({ text: ' Hausaufgaben gemacht ', other: 1 })).toEqual({
			text: 'Hausaufgaben gemacht'
		});
	});

	it.each([{}, { text: '' }, { text: '   ' }, { text: 'x'.repeat(501) }])('rejects %o', (value) => {
		expect(behaviourSchema.safeParse(value).success).toBe(false);
	});

	it('has two negative and two positive remarks in the scheme', () => {
		expect(REMARKS.map((remark) => remark.tone)).toEqual(['negative', 'negative', 'positive', 'positive']);
	});

	it('seeds valid demo behaviours', () => {
		for (const seed of positivePerception.demo?.(i18n('de')) ?? []) {
			expect(positivePerception.kinds[seed.kind]?.schema.safeParse(seed.data).success).toBe(true);
		}
	});

	it('seeds the demo in the counsellor’s language', () => {
		expect(positivePerception.demo?.(i18n('en')).map((seed) => seed.data)).toEqual([
			{ text: 'Cleared the table without being asked.' },
			{ text: 'Went to football practice at the weekend.' }
		]);
	});

	it.each([
		['de', 'Verhaltensweisen und Aktivitäten, die gelobt werden sollen', 'Noch keine Einträge.'],
		['en', 'Behaviours and activities to praise', 'No entries yet.']
	] as const)('exports the behaviours in %s', (lang, heading, empty) => {
		const filled = createWriter();
		positivePerception.exportPdf(filled.writer, {
			entries: [
				{
					id: 'b1',
					kind: 'behaviour',
					key: null,
					day: null,
					data: { text: 'Hausaufgaben gemacht' },
					createdAt: '2026-11-20T09:00:00.000Z',
					updatedAt: '2026-11-20T09:00:00.000Z'
				}
			],
			options: {},
			linked: {},
			counsellors: [],
			i18n: i18n(lang)
		});
		expect(filled.text()).toBe(`# ${heading}\n- Hausaufgaben gemacht`);
		const blank = createWriter();
		positivePerception.exportPdf(blank.writer, {
			entries: [],
			options: {},
			linked: {},
			counsellors: [],
			i18n: i18n(lang)
		});
		expect(blank.text()).toBe(`# ${heading}\n${empty}`);
	});
});
