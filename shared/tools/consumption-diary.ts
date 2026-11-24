import type { Entry } from '../api.ts';
import { formatMinutes } from '../days.ts';
import type { I18n, Messages } from '../i18n/index.ts';

export const TOPIC_IDS = ['alcohol', 'cannabis', 'gambling', 'media'] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

/** Kinds: the chosen topics (one keyed record), a yes/no answer with the day's summary per day and topic, and phases. */
export const TOPICS_KIND = 'topics';
export const TOPICS_KEY = 'main';
export const SUMMARY_KIND = 'day-summary';
export const PHASE_KIND = 'phase';

export const MAX_TEXT_LENGTH = 2000;
export const MAX_ITEMS = 30;
export const MAX_PHASES = 3000;
export const MAX_COUNT = 99;
export const MAX_MINUTES = 24 * 60;

export const summaryKey = (day: string, topic: TopicId): string => `${day}_${topic}`;

export const isTopic = (value: string): value is TopicId => (TOPIC_IDS as readonly string[]).includes(value);

export interface Topics {
	topics: TopicId[];
}

export interface DaySummary {
	topic: TopicId;
	consumed: boolean;
	/** "Wie bewerten Sie den heutigen Tag …?" */
	rating?: string;
	/** "Was nehmen Sie sich für morgen vor?" */
	plan?: string;
}

export interface AlcoholItem {
	drink: DrinkId;
	size: string;
	count: number;
}

export interface CannabisItem {
	unit: 'joint' | 'bong' | 'other';
	count: number;
	text?: string;
}

/** Gambling and media: what and for how long. */
export interface DurationItem {
	activity: string;
	minutes: number;
}

interface PhaseBase {
	start?: string;
	end?: string;
	context?: string;
	trigger?: string;
}

export type Phase =
	| (PhaseBase & { topic: 'alcohol'; items: AlcoholItem[] })
	| (PhaseBase & { topic: 'cannabis'; items: CannabisItem[] })
	| (PhaseBase & { topic: 'gambling'; items: DurationItem[] })
	| (PhaseBase & { topic: 'media'; items: DurationItem[]; device?: string });

// Table 1 of the tool description: drinks, sizes and grams of alcohol. Sizes are stored as written
// here (German decimal comma); `sizeLabel` shows them for the language.
export const DRINKS = [
	{
		id: 'beer',
		percent: '4,8',
		sizes: [
			['0,2 l', 8],
			['0,33 l', 13],
			['0,5 l', 19],
			['1,0 l', 38]
		]
	},
	{
		id: 'wine',
		percent: '11',
		sizes: [
			['0,1 l', 9],
			['0,2 l', 18],
			['0,375 l', 34],
			['0,75 l', 68]
		]
	},
	{
		id: 'spirits',
		percent: '38',
		sizes: [
			['0,02 l / 2 cl', 6],
			['0,04 l / 4 cl', 12],
			['0,1 l', 30],
			['0,2 l', 60],
			['0,35 l', 105],
			['0,5 l', 150],
			['0,7 l', 210],
			['1,0 l', 300]
		]
	},
	{
		id: 'liqueur',
		percent: '20',
		sizes: [
			['0,02 l / 2 cl', 3],
			['0,04 l / 4 cl', 6],
			['0,1 l', 15],
			['0,2 l', 30],
			['0,35 l', 53],
			['0,5 l', 75],
			['0,7 l', 105],
			['1,0 l', 150]
		]
	},
	{
		id: 'beer-mix',
		percent: '2,5',
		sizes: [
			['0,33 l', 7],
			['0,5 l', 14]
		]
	},
	{ id: 'alcopop', percent: '5,6', sizes: [['0,275 l', 12]] }
] as const satisfies ReadonlyArray<{
	id: string;
	percent: string;
	sizes: ReadonlyArray<readonly [string, number]>;
}>;

export type DrinkId = (typeof DRINKS)[number]['id'];

export const DRINK_IDS = DRINKS.map((drink) => drink.id) as DrinkId[];

export const drinkOf = (id: string) => DRINKS.find((drink) => drink.id === id);

/** Grams of alcohol of one drink, or null for an unknown drink or size. */
export const gramsOf = (drink: string, size: string): number | null =>
	(drinkOf(drink)?.sizes as ReadonlyArray<readonly [string, number]> | undefined)?.find(
		([label]) => label === size
	)?.[1] ?? null;

/** A stored size such as "0,5 l" with the decimals of the language ("0.5 l" in English). */
export const sizeLabel = (size: string, { number }: I18n): string =>
	size.replace(/\d+(?:,\d+)?/g, (digits) =>
		number(Number(digits.replace(',', '.')), {
			minimumFractionDigits: digits.split(',')[1]?.length ?? 0
		})
	);

export interface ChoiceGroup<Group extends string = string> {
	id: Group;
	options: string[];
}

// Table 2 of the tool description; labels in `consumptionDiary.gameGroups` and `.games`.
export const GAMES = [
	{
		id: 'local',
		options: [
			'slot-arcade',
			'slot-gastro',
			'casino-small',
			'casino-large',
			'sports',
			'horses',
			'lottery',
			'other-local'
		]
	},
	{
		id: 'online',
		options: [
			'online-slots',
			'online-casino',
			'online-poker',
			'online-sports',
			'online-horses',
			'online-lottery',
			'online-other'
		]
	}
] as const satisfies ReadonlyArray<ChoiceGroup<keyof Messages['consumptionDiary']['gameGroups']>>;

// Labels in `consumptionDiary.mediaGroups` and `.media`.
export const MEDIA = [
	{
		id: 'games',
		options: ['action', 'shooter', 'rpg', 'strategy', 'sports-games', 'simulation', 'music-games', 'skill']
	},
	{ id: 'communication', options: ['chat', 'mail'] },
	{ id: 'social', options: ['social-watch', 'social-talk'] },
	{ id: 'surfing', options: ['research', 'shopping', 'magazines'] },
	{ id: 'more', options: ['streaming', 'porn', 'device', 'other-media'] }
] as const satisfies ReadonlyArray<ChoiceGroup<keyof Messages['consumptionDiary']['mediaGroups']>>;

export const GAME_IDS: string[] = GAMES.flatMap((group) => group.options);
export const MEDIA_IDS: string[] = MEDIA.flatMap((group) => group.options);

/** The label of a game or media activity; the id for an unknown one. */
export const activityLabel = (topic: 'gambling' | 'media', id: string, m: Messages): string => {
	const labels: Record<string, string> =
		topic === 'gambling' ? m.consumptionDiary.games : m.consumptionDiary.media;
	return labels[id] ?? id;
};

/** "5x 0,5 l Bier", "2x Joint", "Spielhalle, 1 Std. 30 Min." */
export const itemLabel = (
	topic: TopicId,
	item: AlcoholItem | CannabisItem | DurationItem,
	i18n: I18n
): string => {
	const { m, t, lang } = i18n;
	const texts = m.consumptionDiary;
	if (topic === 'alcohol') {
		const { drink, size, count } = item as AlcoholItem;
		const drinks: Record<string, string> = texts.drinks;
		return t(texts.items.alcohol, { count, size: sizeLabel(size, i18n), drink: drinks[drink] ?? drink });
	}
	if (topic === 'cannabis') {
		const { unit, count, text = '' } = item as CannabisItem;
		if (unit === 'other') {
			return (
				count > 1 ? t(texts.items.otherKindCount, { count, text }) : t(texts.items.otherKind, { text })
			).trim();
		}
		return t(texts.items.cannabis, { count, unit: texts.cannabisUnits[unit] });
	}
	const { activity, minutes } = item as DurationItem;
	return t(texts.items.duration, {
		activity: activityLabel(topic, activity, m),
		duration: formatMinutes(minutes, lang)
	});
};

export const phaseGrams = (phase: Phase): number =>
	phase.topic === 'alcohol'
		? phase.items.reduce((sum, item) => sum + (gramsOf(item.drink, item.size) ?? 0) * item.count, 0)
		: 0;

/** "19:00 bis 22:30 Uhr" or nothing. */
export const timeRange = (phase: Phase, { m, t }: I18n): string => {
	const texts = m.consumptionDiary.phase;
	const { start, end } = phase;
	if (start && end) {
		return t(texts.timeRange, { start, end });
	}
	const time = start || end;
	return time ? t(texts.time, { time }) : '';
};

/** The day's sum for one topic, as counsellors see it in the week grid. */
export const daySum = (topic: TopicId, phases: Phase[], i18n: I18n): string => {
	const { m, t, number, lang } = i18n;
	const sums = m.consumptionDiary.sums;
	const items = phases
		.filter((phase) => phase.topic === topic)
		.flatMap((phase): Array<AlcoholItem | CannabisItem | DurationItem> => phase.items);
	if (items.length === 0) {
		return t(sums.phases, { count: phases.filter((phase) => phase.topic === topic).length });
	}
	if (topic === 'alcohol') {
		const drinks = (items as AlcoholItem[]).reduce((sum, item) => sum + item.count, 0);
		const grams = phases.reduce((sum, phase) => sum + (phase.topic === topic ? phaseGrams(phase) : 0), 0);
		return t(sums.alcohol, {
			drinks: t(sums.drinks, { count: drinks }),
			grams: number(grams, { useGrouping: false })
		});
	}
	if (topic === 'cannabis') {
		const count = (unit: CannabisItem['unit']) =>
			(items as CannabisItem[])
				.filter((item) => item.unit === unit)
				.reduce((sum, item) => sum + item.count, 0);
		return [
			count('joint') && t(sums.joints, { count: count('joint') }),
			count('bong') && t(sums.bongs, { count: count('bong') }),
			count('other') && t(sums.otherKind, { count: count('other') })
		]
			.filter(Boolean)
			.join(', ');
	}
	const minutes = (items as DurationItem[]).reduce((sum, item) => sum + item.minutes, 0);
	return formatMinutes(minutes, lang);
};

/** The client's diary, grouped for the views and the export. */
export interface DiaryData {
	/** The topics the client chose (empty before the first start). */
	chosen: TopicId[];
	/** Chosen topics and those with entries, for counsellors and the export. */
	topics: TopicId[];
	summaries: Map<string, Entry<DaySummary>>;
	phases: Array<Entry<Phase>>;
}

export const diaryOf = (entries: Entry[]): DiaryData => {
	const chosen = (entries.find((e) => e.kind === TOPICS_KIND)?.data as Topics | undefined)?.topics ?? [];
	const summaries = new Map(
		entries
			.filter((e): e is Entry<DaySummary> => e.kind === SUMMARY_KIND && Boolean(e.day))
			.map((e) => [summaryKey(e.day as string, e.data.topic), e])
	);
	const phases = entries
		.filter((e): e is Entry<Phase> => e.kind === PHASE_KIND && Boolean(e.day))
		.sort((a, b) =>
			`${a.day}${a.data.start ?? ''}${a.createdAt}`.localeCompare(
				`${b.day}${b.data.start ?? ''}${b.createdAt}`
			)
		);
	const used = new Set<TopicId>([
		...chosen,
		...[...summaries.values()].map((e) => e.data.topic),
		...phases.map((e) => e.data.topic)
	]);
	return {
		chosen: TOPIC_IDS.filter((id) => chosen.includes(id)),
		topics: TOPIC_IDS.filter((id) => used.has(id)),
		summaries,
		phases
	};
};

export const phasesOn = (diary: DiaryData, day: string, topic: TopicId): Array<Entry<Phase>> =>
	diary.phases.filter((e) => e.day === day && e.data.topic === topic);

/** Yes, no, or not answered: the answer, or yes when phases exist without one. */
export const consumedOn = (diary: DiaryData, day: string, topic: TopicId): boolean | null =>
	diary.summaries.get(summaryKey(day, topic))?.data.consumed ??
	(phasesOn(diary, day, topic).length > 0 ? true : null);
