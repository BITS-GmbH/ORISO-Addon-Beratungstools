import { describe, expect, it } from 'vitest';
import { i18n } from '../../shared/i18n/index.ts';
import {
	consumedOn,
	daySum,
	diaryOf,
	gramsOf,
	itemLabel,
	sizeLabel,
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
		const de = i18n('de');
		expect(daySum('alcohol', phases, de)).toBe('4 Getränke, ca. 75 g Alkohol');
		expect(daySum('cannabis', phases, de)).toBe('2 Joints, 1 Bong');
		expect(daySum('gambling', phases, de)).toBe('1 Std. 15 Min.');
		expect(itemLabel('alcohol', { drink: 'beer', size: '0,5 l', count: 5 }, de)).toBe('5x 0,5 l Bier');
		expect(itemLabel('cannabis', { unit: 'other', count: 1, text: 'Kekse' }, de)).toBe('Anderes: Kekse');
		const en = i18n('en');
		expect(daySum('alcohol', phases, en)).toBe('4 drinks, about 75 g of alcohol');
		expect(daySum('cannabis', phases, en)).toBe('2 joints, 1 bong');
		expect(itemLabel('alcohol', { drink: 'spirits', size: '0,02 l / 2 cl', count: 1 }, en)).toBe(
			'1x 0.02 l / 2 cl Spirits'
		);
		expect(itemLabel('gambling', { activity: 'sports', minutes: 45 }, en)).toMatch(/^Sports betting, /);
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

	it('formats sizes for the language', () => {
		expect(sizeLabel('0,375 l', i18n('de'))).toBe('0,375 l');
		expect(sizeLabel('1,0 l', i18n('de'))).toBe('1,0 l');
		expect(sizeLabel('0,375 l', i18n('en'))).toBe('0.375 l');
		expect(sizeLabel('1,0 l', i18n('en'))).toBe('1.0 l');
	});

	it('addresses the client formally or informally', () => {
		expect(i18n('de').m.consumptionDiary.topics.alcohol.ratingQuestion).toBe(
			'Wie bewerten Sie den heutigen Tag im Hinblick auf Ihren Alkoholkonsum?'
		);
		expect(i18n('de', true).m.consumptionDiary.topics.cannabis.ratingQuestion).toBe(
			'Wie bewertest du den heutigen Tag im Hinblick auf deinen Cannabiskonsum?'
		);
		for (const topic of Object.values(i18n('de', true).m.consumptionDiary.topics)) {
			for (const text of [topic.yesIntro, topic.yesMore, topic.noIntro, topic.pastNoIntro, topic.noMore]) {
				expect(text).not.toMatch(/\b(Sie|Ihre?[nm]?|Ihnen)\b/);
			}
		}
	});

	it('exports days with answers, phases and summary, and seeds a valid demo', () => {
		const demo = consumptionDiary.demo?.(i18n('de')) ?? [];
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
			counsellors: [],
			i18n: i18n('de')
		});
		const out = text();
		expect(out).toContain('Dokumentierte Themen: Alkohol, Glücksspiel');
		expect(out).toContain('## Alkohol: ja (4 Getränke, ca. 63 g Alkohol)');
		expect(out).toContain('- 3x 0,5 l Bier; 1x 0,02 l / 2 cl Schnaps (19:00 bis 22:30 Uhr)');
		expect(out).toContain('## Glücksspiel: nein');
		expect(out).toContain('Vorhaben für morgen: Wieder zum Sport gehen.');
		expect(out.indexOf('## Glücksspiel: ja')).toBeLessThan(out.indexOf('## Alkohol: ja'));
	});

	it('writes the export in English', () => {
		const en = i18n('en');
		const demo = consumptionDiary.demo?.(en) ?? [];
		const { writer, text } = createWriter();
		consumptionDiary.exportPdf(writer, {
			entries: demo.map((seed) => entry(seed.kind, seed.data, seed.day ?? null, seed.key ?? null)),
			options: {},
			linked: {},
			counsellors: [],
			i18n: en
		});
		const out = text();
		expect(out).toContain('Topics recorded: Alcohol, Gambling');
		expect(out).toContain('## Alcohol: yes (4 drinks, about 63 g of alcohol)');
		expect(out).toContain('- 3x 0.5 l Beer; 1x 0.02 l / 2 cl Spirits (19:00 to 22:30)');
		expect(out).toContain('## Gambling: no');
		expect(out).toContain('Plan for tomorrow: Go to sport again.');
		expect(out).toContain('Reason or trigger: Argument on the phone');
		expect(out).not.toMatch(/[äöüß]|Uhr\b/);
	});
});
