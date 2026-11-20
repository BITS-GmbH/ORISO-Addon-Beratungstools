import { describe, expect, it } from 'vitest';
import { levelLabel } from '../../shared/tools/traffic-light.ts';
import { trafficLight, activitySchema } from '../src/tools/traffic-light/index.ts';

describe('Ampelmodell input', () => {
	it('keeps the activity and its danger level, trimmed', () => {
		expect(activitySchema.parse({ text: '  Instagram ', level: 2, extra: true })).toEqual({
			text: 'Instagram',
			level: 2
		});
	});

	it.each([
		{ text: 'x', level: 0 },
		{ text: 'x', level: 4 },
		{ text: 'x', level: '3' },
		{ text: 'x' },
		{ text: '  ', level: 1 },
		{ text: 'x'.repeat(201), level: 1 }
	])('rejects %o', (activity) => {
		expect(activitySchema.safeParse(activity).success).toBe(false);
	});

	it('codes red, yellow and green as 3, 2 and 1', () => {
		expect([3, 2, 1].map((level) => levelLabel(level as 3 | 2 | 1))).toEqual([
			'Rot: große Gefahr',
			'Gelb: mögliche Gefahr',
			'Grün: keine Gefahr'
		]);
	});

	it('seeds valid demo activities', () => {
		for (const seed of trafficLight.demo?.() ?? []) {
			expect(trafficLight.kinds[seed.kind]?.schema.safeParse(seed.data).success).toBe(true);
		}
	});
});
