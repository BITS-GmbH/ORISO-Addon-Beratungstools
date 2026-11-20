import { describe, expect, it } from 'vitest';
import type { CategoryId } from '../../shared/tools/balance.ts';
import {
	argumentSchema,
	calculate,
	conclusionSchema,
	formatValue,
	polesOf,
	tendency
} from '../../shared/tools/balance.ts';

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
		expect(formatValue(result.value)).toBe(shown);
		expect(tendency(result.value)).toBe(reading);
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
		expect(formatValue(null)).toBe('–');
		expect(tendency(null)).toBe('Noch nicht berechenbar');
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
		expect(polesOf('unbekannt')).toEqual({ contra: 'CONTRA Veränderung', pro: 'PRO Veränderung' });
		expect(polesOf('gut so, wie es ist / es muss sich was ändern!')).toEqual({
			contra: 'gut so, wie es ist',
			pro: 'es muss sich was ändern!'
		});
	});
});
