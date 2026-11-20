import { describe, expect, it } from 'vitest';
import {
	consumedOn,
	daySum,
	diaryOf,
	gramsOf,
	itemLabel,
	ratingQuestion,
	TOPICS,
	type Phase
} from '../../shared/tools/consumption-diary.ts';
import {
	consumptionDiary,
	isSummaryKey,
	phaseSchema,
	summarySchema,
	topicsSchema
} from '../src/tools/consumption-diary/index.ts';
import { createWriter } from './pdfWriter.ts';

const entry = (kind: string, data: unknown, day: string | null = null, key: string | null = null) => ({
	id: `${kind}-${Math.random().toString(36).slice(2)}`,
	kind,
	key,
	day,
	data,
	createdAt: '2026-11-20T09:00:00.000Z',
	updatedAt: '2026-11-20T09:00:00.000Z'
});

describe('consumption-diary', () => {
	it('knows the grams of alcohol of table 1', () => {
		expect(gramsOf('beer', '0,5 l')).toBe(19);
		expect(gramsOf('spirits', '0,02 l / 2 cl')).toBe(6);
		expect(gramsOf('alcopop', '0,275 l')).toBe(12);
		expect(gramsOf('beer', '0,7 l')).toBeNull();
	});

	it('validates phases per topic', () => {
		expect(
			phaseSchema.parse({
				topic: 'alcohol',
				start: '19:00',
				end: '',
				items: [{ drink: 'beer', size: '0,5 l', count: 3 }],
				context: ' zu Hause ',
				trigger: ''
			})
		).toEqual({
			topic: 'alcohol',
			start: '19:00',
			items: [{ drink: 'beer', size: '0,5 l', count: 3 }],
			context: 'zu Hause'
		});
		expect(
			phaseSchema.safeParse({ topic: 'alcohol', items: [{ drink: 'beer', size: '2 l', count: 1 }] }).success
		).toBe(false);
		expect(phaseSchema.safeParse({ topic: 'cannabis', items: [{ unit: 'other', count: 1 }] }).success).toBe(
			false
		);
		expect(
			phaseSchema.safeParse({ topic: 'gambling', items: [{ activity: 'online-poker', minutes: 90 }] }).success
		).toBe(true);
		expect(
			phaseSchema.safeParse({ topic: 'gambling', items: [{ activity: 'chat', minutes: 90 }] }).success
		).toBe(false);
		expect(
			phaseSchema.parse({ topic: 'media', items: [{ activity: 'chat', minutes: 30 }], device: 'Smartphone' })
		).toMatchObject({ device: 'Smartphone' });
		expect(phaseSchema.safeParse({ topic: 'tobacco', items: [] }).success).toBe(false);
	});

	it('keys summaries by day and topic and needs at least one topic', () => {
		expect(isSummaryKey('2026-11-20_alcohol')).toBe(true);
		expect(isSummaryKey('2026-11-20_tobacco')).toBe(false);
		expect(isSummaryKey('2026-11-20')).toBe(false);
		expect(summarySchema.parse({ topic: 'media', consumed: false, rating: ' ', plan: 'Sport' })).toEqual({
			topic: 'media',
			consumed: false,
			plan: 'Sport'
		});
		expect(topicsSchema.parse({ topics: ['media', 'alcohol', 'media'] })).toEqual({
			topics: ['alcohol', 'media']
		});
		expect(topicsSchema.safeParse({ topics: [] }).success).toBe(false);
	});

	it('sums a day per topic for the counsellor week grid', () => {
		const phases: Phase[] = [
			{ topic: 'alcohol', items: [{ drink: 'beer', size: '0,5 l', count: 3 }] },
			{ topic: 'alcohol', items: [{ drink: 'wine', size: '0,2 l', count: 1 }] },
			{
				topic: 'cannabis',
				items: [
					{ unit: 'joint', count: 2 },
					{ unit: 'bong', count: 1 }
				]
			},
			{
				topic: 'gambling',
				items: [
					{ activity: 'sports', minutes: 45 },
					{ activity: 'lottery', minutes: 30 }
				]
			}
		];
		expect(daySum('alcohol', phases)).toBe('4 Getränke, ca. 75 g Alkohol');
		expect(daySum('cannabis', phases)).toBe('2 Joints, 1 Bong');
		expect(daySum('gambling', phases)).toBe('1 Std. 15 Min.');
		expect(itemLabel('alcohol', { drink: 'beer', size: '0,5 l', count: 5 })).toBe('5x 0,5 l Bier');
		expect(itemLabel('cannabis', { unit: 'other', count: 1, text: 'Kekse' })).toBe('Anderes: Kekse');
	});

	it('reads yes from phases when the day has no answer', () => {
		const diary = diaryOf([
			entry('topics', { topics: ['alcohol'] }, null, 'main'),
			entry('phase', { topic: 'gambling', items: [] }, '2026-11-19'),
			entry('day-summary', { topic: 'alcohol', consumed: false }, '2026-11-19', '2026-11-19_alcohol')
		]);
		expect(diary.chosen).toEqual(['alcohol']);
		expect(diary.topics).toEqual(['alcohol', 'gambling']);
		expect(consumedOn(diary, '2026-11-19', 'alcohol')).toBe(false);
		expect(consumedOn(diary, '2026-11-19', 'gambling')).toBe(true);
		expect(consumedOn(diary, '2026-11-18', 'alcohol')).toBeNull();
	});

	it('addresses the client formally or informally', () => {
		expect(ratingQuestion('alcohol', false)).toBe(
			'Wie bewerten Sie den heutigen Tag im Hinblick auf Ihren Alkoholkonsum?'
		);
		expect(ratingQuestion('cannabis', true)).toBe(
			'Wie bewertest du den heutigen Tag im Hinblick auf deinen Cannabiskonsum?'
		);
		for (const topic of Object.values(TOPICS)) {
			for (const text of [
				topic.yesIntro(true),
				topic.yesMore(true),
				topic.noIntro(true),
				topic.noMore(true)
			]) {
				expect(text).not.toMatch(/\b(Sie|Ihre?[nm]?|Ihnen)\b/);
			}
		}
	});

	it('exports days with answers, phases and summary, and seeds a valid demo', () => {
		const demo = consumptionDiary.demo?.() ?? [];
		for (const seed of demo) {
			expect(consumptionDiary.kinds[seed.kind]?.schema.safeParse(seed.data).success).toBe(true);
			if (seed.key && seed.kind !== 'topics') {
				expect(consumptionDiary.kinds[seed.kind]?.keys?.(seed.key)).toBe(true);
			}
		}
		const { writer, text } = createWriter();
		consumptionDiary.exportPdf(writer, {
			entries: demo.map((seed) => entry(seed.kind, seed.data, seed.day ?? null, seed.key ?? null)),
			options: {},
			linked: {},
			counsellors: []
		});
		const out = text();
		expect(out).toContain('Dokumentierte Themen: Alkohol, Glücksspiel');
		expect(out).toContain('## Alkohol: ja (4 Getränke, ca. 63 g Alkohol)');
		expect(out).toContain('- 3x 0,5 l Bier; 1x 0,02 l / 2 cl Schnaps (19:00 bis 22:30 Uhr)');
		expect(out).toContain('## Glücksspiel: nein');
		expect(out).toContain('Vorhaben für morgen: Wieder zum Sport gehen.');
		expect(out.indexOf('## Glücksspiel: ja')).toBeLessThan(out.indexOf('## Alkohol: ja'));
	});
});
