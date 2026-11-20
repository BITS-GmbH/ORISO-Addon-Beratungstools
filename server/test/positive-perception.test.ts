import { describe, expect, it } from 'vitest';
import { REMARKS } from '../../shared/tools/positive-perception.ts';
import { behaviourSchema, positivePerception } from '../src/tools/positive-perception/index.ts';

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
		for (const seed of positivePerception.demo?.() ?? []) {
			expect(positivePerception.kinds[seed.kind]?.schema.safeParse(seed.data).success).toBe(true);
		}
	});
});
