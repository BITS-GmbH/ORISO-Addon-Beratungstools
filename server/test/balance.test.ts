import { describe, expect, it } from 'vitest';
import type { Entry } from '../../shared/api.ts';
import { i18n } from '../../shared/i18n/index.ts';
import type { CategoryId } from '../../shared/tools/balance.ts';
import { calculate, formatValue, polesOf, tendency } from '../../shared/tools/balance.ts';
import { argumentSchema, balance, conclusionSchema } from '../src/tools/balance/index.ts';
import { createWriter } from './pdfWriter.ts';

const de = i18n('de');
const en = i18n('en');

/** Arguments giving the wanted PRO and CONTRA sums (ratings of 3, then the rest). */
const withSums = (pro: number, contra: number) => {
	const args: Array<{ category: CategoryId; rating: number }> = [];
	const add = (category: CategoryId, points: number) => {
		for (; points > 0; points -= Math.min(3, points)) {
			args.push({ category, rating: Math.min(3, points) });
		}
	};
	add('A', pro);
	add('B', contra);
	return args;
};

describe('calculation (tool description 2.4.5)', () => {
	it.each([
		[12, 0, '+10,0', 'Maximale PRO-Tendenz'],
		[15, 5, '+5,0', 'PRO-Tendenz'],
		[20, 15, '+1,4', 'Leichte PRO-Tendenz'],
		[10, 10, '0,0', 'Ausgeglichen'],
		[5, 15, '−5,0', 'CONTRA-Tendenz'],
		[0, 12, '−10,0', 'Maximale CONTRA-Tendenz']
	])('PRO %i and CONTRA %i give %s', (pro, contra, shown, reading) => {
		const result = calculate(withSums(pro, contra));
		expect(result.pro).toBe(pro);
		expect(result.contra).toBe(contra);
		expect(formatValue(result.value, de)).toBe(shown);
		expect(tendency(result.value, de)).toBe(reading);
	});

	it('uses the ratio, not the number of arguments', () => {
		expect(calculate(withSums(3, 1)).value).toBe(calculate(withSums(30, 10)).value);
		expect(calculate(withSums(3, 1)).value).toBe(5);
	});

	it('counts disadvantages of no change as PRO and advantages of no change as CONTRA', () => {
		expect(
			calculate([
				{ category: 'A', rating: 1 },
				{ category: 'B', rating: 2 },
				{ category: 'C', rating: 3 },
				{ category: 'D', rating: 2 }
			])
		).toEqual({ pro: 3, contra: 5, raw: -2, value: -2.5 });
	});

	it('stays inactive without points, also when all arguments are rated 0', () => {
		expect(calculate([]).value).toBeNull();
		expect(
			calculate([
				{ category: 'A', rating: 0 },
				{ category: 'C', rating: 0 }
			]).value
		).toBeNull();
		expect(formatValue(null, de)).toBe('–');
		expect(tendency(null, de)).toBe('Noch nicht berechenbar');
	});

	it('rounds only for display', () => {
		expect(Math.abs((calculate(withSums(20, 15)).value ?? 0) - 10 / 7)).toBeLessThan(1e-12);
	});
});

describe('input', () => {
	it('keeps known fields and trims texts', () => {
		expect(argumentSchema.parse({ category: 'A', text: '  Mehr Geld ', rating: 3, extra: 1 })).toEqual({
			category: 'A',
			text: 'Mehr Geld',
			rating: 3
		});
		expect(conclusionSchema.parse({ text: ' Fazit ' })).toEqual({ text: 'Fazit' });
	});

	it.each([
		{ category: 'E', text: 'x', rating: 1 },
		{ category: 'A', text: 'x' },
		{ category: 'A', text: 'x', rating: 4 },
		{ category: 'A', text: 'x', rating: 1.5 },
		{ category: 'A', text: '  ', rating: 1 },
		{ category: 'A', text: 'x'.repeat(501), rating: 1 }
	])('rejects %o', (argument) => {
		expect(argumentSchema.safeParse(argument).success).toBe(false);
	});

	it('falls back to the first pole variant', () => {
		expect(polesOf('unbekannt', de.m)).toEqual({ contra: 'CONTRA Veränderung', pro: 'PRO Veränderung' });
		expect(polesOf('gut so, wie es ist / es muss sich was ändern!', de.m)).toEqual({
			contra: 'gut so, wie es ist',
			pro: 'es muss sich was ändern!'
		});
	});

	it('keeps the German variants as the stored setting and shows them translated', () => {
		expect(balance.options?.poles?.enum).toContain('keine Veränderung / Ich möchte etwas ändern!');
		expect(polesOf('keine Veränderung / Ich möchte etwas ändern!', en.m)).toEqual({
			contra: 'No change',
			pro: 'I want to change something!'
		});
	});
});

describe('in English', () => {
	it('formats the value with a point and reads the tendency', () => {
		expect(formatValue(calculate(withSums(20, 15)).value, en)).toBe('+1.4');
		expect(formatValue(calculate(withSums(5, 15)).value, en)).toBe('−5.0');
		expect(tendency(calculate(withSums(20, 15)).value, en)).toBe('Slight PRO tendency');
		expect(tendency(calculate(withSums(0, 12)).value, en)).toBe('Maximum CON tendency');
		expect(tendency(null, en)).toBe('Cannot be calculated yet');
	});

	it('writes the PDF in the language of the export', () => {
		const entry = (kind: string, data: unknown) => ({ kind, data }) as Entry;
		const input = {
			entries: [
				entry('argument', { category: 'A', text: 'More money', rating: 3 }),
				entry('argument', { category: 'C', text: 'Peace', rating: 1 })
			],
			options: { poles: 'CONTRA Veränderung / PRO Veränderung' },
			linked: {},
			counsellors: []
		};
		const english = createWriter();
		balance.exportPdf(english.writer, { ...input, i18n: en });
		expect(english.text()).toContain('# Result');
		expect(english.text()).toContain(
			'Motivation score +5.0 (PRO tendency), PRO 3 points, CON 1 point, on a scale from −10 to +10.'
		);
		expect(english.text()).toContain('## Advantages if nothing changes (CON)');
		expect(english.text()).toContain('- More money (very important (3))');
		expect(english.text()).toContain('No conclusion entered.');

		const german = createWriter();
		balance.exportPdf(german.writer, { ...input, i18n: de });
		expect(german.text()).toContain(
			'Motivationswert +5,0 (PRO-Tendenz), PRO 3 Punkte, CONTRA 1 Punkt, Skala von −10 bis +10.'
		);
		expect(german.text()).toContain('## Vorteile, wenn sich nichts ändert (CONTRA)');
		expect(german.text()).toContain('- More money (sehr wichtig (3))');
	});
});
