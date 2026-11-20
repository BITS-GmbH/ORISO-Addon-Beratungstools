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
	TOPIC_IDS,
	TOPICS,
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
	exportPdf(pdf, { entries }) {
		const diary = diaryOf(entries);
		const days = [
			...new Set([...[...diary.summaries.values()].map((e) => e.day), ...diary.phases.map((e) => e.day)])
		]
			.filter((day): day is string => Boolean(day))
			.sort();
		if (days.length === 0) {
			pdf.paragraph('Keine Einträge in diesem Zeitraum.', { muted: true });
			return;
		}
		if (diary.chosen.length) {
			pdf.paragraph(`Dokumentierte Themen: ${diary.chosen.map((id) => TOPICS[id].label).join(', ')}`, {
				muted: true
			});
		}
		for (const day of days) {
			pdf.heading(formatDayLong(day));
			for (const topic of diary.topics) {
				const consumed = consumedOn(diary, day, topic);
				if (consumed === null) {
					continue;
				}
				const phases = phasesOn(diary, day, topic);
				pdf.subheading(
					`${TOPICS[topic].label}: ${
						consumed
							? `ja (${daySum(
									topic,
									phases.map((p) => p.data)
								)})`
							: 'nein'
					}`
				);
				for (const { data: phase } of phases) {
					const when = [phase.start, phase.end].filter(Boolean).join(' bis ');
					pdf.item(
						phase.items.map((item) => itemLabel(topic, item)).join('; ') || 'Keine Angaben zum Konsum',
						when ? `${when} Uhr` : undefined
					);
					const details = [
						phase.topic === 'media' && phase.device ? `Endgerät: ${phase.device}` : '',
						phase.context ? `Wo und mit wem: ${phase.context}` : '',
						phase.trigger ? `Grund/Auslöser: ${phase.trigger}` : ''
					].filter(Boolean);
					if (details.length) {
						pdf.paragraph(details.join('\n'));
					}
				}
				const summary = diary.summaries.get(summaryKey(day, topic))?.data;
				if (summary?.rating) {
					pdf.field('Bewertung des Tages', summary.rating);
				}
				if (summary?.plan) {
					pdf.field('Vorhaben für morgen', summary.plan);
				}
			}
		}
	},
	demo: () => {
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
			summary(
				-1,
				'alcohol',
				true,
				'Nach dem Streit habe ich mehr getrunken als geplant.',
				'Nach der Arbeit direkt nach Hause gehen.'
			),
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
					context: 'Zu Hause, allein',
					trigger: 'Streit am Telefon'
				}
			},
			summary(-1, 'gambling', false, 'Kein Geld eingesteckt, das hat geholfen.'),
			summary(-2, 'alcohol', false, 'Abends Sport gemacht statt Bier.', 'Wieder zum Sport gehen.'),
			summary(-2, 'gambling', true),
			{
				kind: PHASE_KIND,
				day: addDays(today, -2),
				data: {
					topic: 'gambling',
					start: '17:30',
					end: '19:00',
					items: [{ activity: 'online-sports', minutes: 90 }],
					context: 'Im Bus und zu Hause',
					trigger: 'Langeweile'
				}
			}
		];
		return seeds;
	}
};
