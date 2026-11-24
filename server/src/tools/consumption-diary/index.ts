import { z } from 'zod';
import { ACTIVITY_TOOL } from '../../../../shared/activities.ts';
import { addDays, formatDayLong, isDay } from '../../../../shared/days.ts';
import {
	consumedOn,
	daySum,
	diaryOf,
	DRINK_IDS,
	GAME_IDS,
	gramsOf,
	isTopic,
	itemLabel,
	MAX_COUNT,
	MAX_ITEMS,
	MAX_MINUTES,
	MAX_PHASES,
	MAX_TEXT_LENGTH,
	MEDIA_IDS,
	PHASE_KIND,
	phasesOn,
	SUMMARY_KIND,
	summaryKey,
	timeRange,
	TOPIC_IDS,
	TOPICS_KEY,
	TOPICS_KIND,
	type TopicId
} from '../../../../shared/tools/consumption-diary.ts';
import type { SeedEntry, ServerTool } from '../types.ts';

const text = z
	.string()
	.trim()
	.max(MAX_TEXT_LENGTH)
	.optional()
	.transform((value) => value || undefined);
const time = z
	.union([z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), z.literal('')])
	.optional()
	.transform((value) => value || undefined);
const count = z.number().int().min(1).max(MAX_COUNT);
const minutes = z.number().int().min(1).max(MAX_MINUTES);
const base = { start: time, end: time, context: text, trigger: text };

const alcoholItem = z
	.object({ drink: z.enum(DRINK_IDS as [string, ...string[]]), size: z.string(), count })
	.refine((item) => gramsOf(item.drink, item.size) !== null, { message: 'unknown size' });
const cannabisItem = z
	.object({
		unit: z.enum(['joint', 'bong', 'other']),
		count,
		text: z.string().trim().max(200).optional()
	})
	.refine((item) => item.unit !== 'other' || Boolean(item.text), { message: 'describe the other kind' });
const durationItem = (ids: string[]) =>
	z.object({ activity: z.string().refine((id) => ids.includes(id), 'unknown activity'), minutes });

export const phaseSchema = z.discriminatedUnion('topic', [
	z.object({ topic: z.literal('alcohol'), items: z.array(alcoholItem).max(MAX_ITEMS), ...base }),
	z.object({ topic: z.literal('cannabis'), items: z.array(cannabisItem).max(MAX_ITEMS), ...base }),
	z.object({ topic: z.literal('gambling'), items: z.array(durationItem(GAME_IDS)).max(MAX_ITEMS), ...base }),
	z.object({
		topic: z.literal('media'),
		items: z.array(durationItem(MEDIA_IDS)).max(MAX_ITEMS),
		device: text,
		...base
	})
]);

export const summarySchema = z.object({
	topic: z.enum(TOPIC_IDS),
	consumed: z.boolean(),
	rating: text,
	plan: text
});

export const topicsSchema = z.object({
	topics: z
		.array(z.enum(TOPIC_IDS))
		.min(1)
		.transform((topics) => TOPIC_IDS.filter((id) => topics.includes(id)))
});

/** `2026-11-20_alcohol` */
export const isSummaryKey = (key: string): boolean => {
	const [day = '', topic = '', ...rest] = key.split('_');
	return rest.length === 0 && isDay(day) && isTopic(topic);
};

export const consumptionDiary: ServerTool = {
	id: 'consumption-diary',
	kinds: {
		[TOPICS_KIND]: { schema: topicsSchema, keys: (key) => key === TOPICS_KEY },
		[SUMMARY_KIND]: { schema: summarySchema, keys: isSummaryKey, dated: true },
		[PHASE_KIND]: { schema: phaseSchema, dated: true, max: MAX_PHASES }
	},
	reads: [ACTIVITY_TOOL],
	exportRange: true,
	options: {
		intro: {
			type: 'string',
			title: 'Einleitung',
			description: 'Ersetzt den Text „Über das Konsumtagebuch“. Leer lassen für den Standardtext.',
			maxLength: 2000,
			format: 'textarea',
			default: ''
		}
	},
	exportPdf(pdf, { entries, i18n }) {
		const { m, t, lang } = i18n;
		const texts = m.consumptionDiary;
		const diary = diaryOf(entries);
		const days = [
			...new Set([...[...diary.summaries.values()].map((e) => e.day), ...diary.phases.map((e) => e.day)])
		]
			.filter((day): day is string => Boolean(day))
			.sort();
		if (days.length === 0) {
			pdf.paragraph(texts.pdf.noEntries, { muted: true });
			return;
		}
		if (diary.chosen.length) {
			pdf.paragraph(
				t(texts.pdf.topics, { topics: diary.chosen.map((id) => texts.topics[id].label).join(', ') }),
				{ muted: true }
			);
		}
		for (const day of days) {
			pdf.heading(formatDayLong(day, lang));
			for (const topic of diary.topics) {
				const consumed = consumedOn(diary, day, topic);
				if (consumed === null) {
					continue;
				}
				const phases = phasesOn(diary, day, topic);
				const label = texts.topics[topic].label;
				pdf.subheading(
					consumed
						? t(texts.pdf.answerYes, {
								topic: label,
								sum: daySum(
									topic,
									phases.map((p) => p.data),
									i18n
								)
							})
						: t(texts.pdf.answerNo, { topic: label })
				);
				for (const { data: phase } of phases) {
					const when = timeRange(phase, i18n);
					pdf.item(
						phase.items.map((item) => itemLabel(topic, item, i18n)).join('; ') || texts.phase.noItems,
						when || undefined
					);
					const details = [
						phase.topic === 'media' && phase.device ? t(texts.pdf.device, { device: phase.device }) : '',
						phase.context ? t(texts.pdf.context, { context: phase.context }) : '',
						phase.trigger ? t(texts.pdf.trigger, { trigger: phase.trigger }) : ''
					].filter(Boolean);
					if (details.length) {
						pdf.paragraph(details.join('\n'));
					}
				}
				const summary = diary.summaries.get(summaryKey(day, topic))?.data;
				if (summary?.rating) {
					pdf.field(texts.pdf.rating, summary.rating);
				}
				if (summary?.plan) {
					pdf.field(texts.pdf.plan, summary.plan);
				}
			}
		}
	},
	demo: ({ m }) => {
		const texts = m.consumptionDiary.demo;
		const today = new Date().toISOString().slice(0, 10);
		const summary = (offset: number, topic: TopicId, consumed: boolean, rating?: string, plan?: string) => {
			const day = addDays(today, offset);
			return {
				kind: SUMMARY_KIND,
				key: summaryKey(day, topic),
				day,
				data: { topic, consumed, ...(rating ? { rating } : {}), ...(plan ? { plan } : {}) }
			};
		};
		const seeds: SeedEntry[] = [
			{ kind: TOPICS_KIND, key: TOPICS_KEY, data: { topics: ['alcohol', 'gambling'] } },
			summary(-1, 'alcohol', true, texts.alcoholRating, texts.alcoholPlan),
			{
				kind: PHASE_KIND,
				day: addDays(today, -1),
				data: {
					topic: 'alcohol',
					start: '19:00',
					end: '22:30',
					items: [
						{ drink: 'beer', size: '0,5 l', count: 3 },
						{ drink: 'spirits', size: '0,02 l / 2 cl', count: 1 }
					],
					context: texts.alcoholContext,
					trigger: texts.alcoholTrigger
				}
			},
			summary(-1, 'gambling', false, texts.gamblingRating),
			summary(-2, 'alcohol', false, texts.soberRating, texts.soberPlan),
			summary(-2, 'gambling', true),
			{
				kind: PHASE_KIND,
				day: addDays(today, -2),
				data: {
					topic: 'gambling',
					start: '17:30',
					end: '19:00',
					items: [{ activity: 'online-sports', minutes: 90 }],
					context: texts.gamblingContext,
					trigger: texts.gamblingTrigger
				}
			}
		];
		return seeds;
	}
};
