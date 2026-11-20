import { tx } from '../address.ts';
import type { Entry } from '../api.ts';
import { formatMinutes } from '../days.ts';

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

// Table 1 of the tool description: drinks, sizes and grams of alcohol.
export const DRINKS = [
	{
		id: 'beer',
		label: 'Bier',
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
		label: 'Wein / Sekt',
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
		label: 'Schnaps',
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
		label: 'Likör',
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
		label: 'Biermixgetränke',
		percent: '2,5',
		sizes: [
			['0,33 l', 7],
			['0,5 l', 14]
		]
	},
	{ id: 'alcopop', label: 'Alkopops', percent: '5,6', sizes: [['0,275 l', 12]] }
] as const satisfies ReadonlyArray<{
	id: string;
	label: string;
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

export interface ChoiceGroup {
	title: string;
	options: Array<{ id: string; label: string }>;
}

// Table 2 of the tool description.
export const GAMES: ChoiceGroup[] = [
	{
		title: 'Glücksspiele vor Ort',
		options: [
			{ id: 'slot-arcade', label: 'Geldspielautomaten in Spielhallen' },
			{ id: 'slot-gastro', label: 'Geldspielautomaten in der Gastronomie' },
			{ id: 'casino-small', label: 'Kleines Spiel in der Spielbank' },
			{ id: 'casino-large', label: 'Großes Spiel in der Spielbank' },
			{ id: 'sports', label: 'Sportwetten' },
			{ id: 'horses', label: 'Pferdewetten' },
			{ id: 'lottery', label: 'Lotterien' },
			{ id: 'other-local', label: 'Andere Glücksspiele vor Ort' }
		]
	},
	{
		title: 'Online / über das Internet',
		options: [
			{ id: 'online-slots', label: 'Online-Automatenspiel (Geld-/Glücksspielautomaten)' },
			{
				id: 'online-casino',
				label: 'Online-Casinospiele (großes Spiel in der Spielbank, mit Ausnahme von Poker)'
			},
			{ id: 'online-poker', label: 'Online-Poker' },
			{ id: 'online-sports', label: 'Online-Sportwetten' },
			{ id: 'online-horses', label: 'Online-Pferdewetten' },
			{ id: 'online-lottery', label: 'Online-Lotterien' },
			{ id: 'online-other', label: 'Andere Onlineglücksspiele' }
		]
	}
];

export const MEDIA: ChoiceGroup[] = [
	{
		title: 'Onlinespiele',
		options: [
			{ id: 'action', label: 'Actionspiele (z. B. Jump ’n’ Run, Beat’em ups, Action-Adventure)' },
			{ id: 'shooter', label: 'Ego-Shooter' },
			{ id: 'rpg', label: 'Rollenspiele (z. B. MMORPGs, Online- und Offline-Rollenspiele)' },
			{ id: 'strategy', label: 'Strategiespiele (z. B. Echtzeit-Strategiespiele, Aufbauspiele)' },
			{ id: 'sports-games', label: 'Sportspiele (z. B. Managerspiele, Sportsimulation)' },
			{
				id: 'simulation',
				label: 'Simulationsspiele (z. B. Flugsimulation, Autorennsimulation, Lebenssimulation)'
			},
			{ id: 'music-games', label: 'Musik- und Tanzspiele (z. B. Just Dance Now, SingStar, Let’s Sing)' },
			{ id: 'skill', label: 'Geschicklichkeitsspiele (z. B. Tetris)' }
		]
	},
	{
		title: 'Kommunikation übers Internet',
		options: [
			{ id: 'chat', label: 'Chatten' },
			{ id: 'mail', label: 'Emails schreiben' }
		]
	},
	{
		title: 'Soziale Netzwerke (z. B. TikTok, Instagram, WhatsApp, Telegram, Facebook)',
		options: [
			{ id: 'social-watch', label: 'Videos / Bilder angucken' },
			{ id: 'social-talk', label: 'Austausch mit anderen Personen' }
		]
	},
	{
		title: 'Surfen im Internet',
		options: [
			{ id: 'research', label: 'Recherche' },
			{ id: 'shopping', label: 'Einkaufen' },
			{ id: 'magazines', label: 'Online-Magazine' }
		]
	},
	{
		title: 'Weitere Medienaktivitäten',
		options: [
			{ id: 'streaming', label: 'Online-Streaming (z. B. Netflix, Mediatheken, Amazon Prime)' },
			{ id: 'porn', label: 'Porno-Websites' },
			{ id: 'device', label: 'Computer / Gerät optimieren' },
			{ id: 'other-media', label: 'andere Nutzung elektronischer Medien' }
		]
	}
];

const choiceIds = (groups: ChoiceGroup[]) => groups.flatMap((group) => group.options.map((o) => o.id));
export const GAME_IDS = choiceIds(GAMES);
export const MEDIA_IDS = choiceIds(MEDIA);

const choiceLabel = (groups: ChoiceGroup[], id: string) =>
	groups.flatMap((group) => group.options).find((option) => option.id === id)?.label ?? id;

export const CANNABIS_UNITS = {
	joint: ['Joint', 'Joints'],
	bong: ['Bong', 'Bongs'],
	other: ['Anderes', 'Anderes']
};

/** "5x 0,5 l Bier", "2x Joint", "Spielhalle, 1 Std. 30 Min." */
export const itemLabel = (topic: TopicId, item: AlcoholItem | CannabisItem | DurationItem): string => {
	if (topic === 'alcohol') {
		const { drink, size, count } = item as AlcoholItem;
		return `${count}x ${size} ${drinkOf(drink)?.label ?? drink}`;
	}
	if (topic === 'cannabis') {
		const { unit, count, text } = item as CannabisItem;
		return unit === 'other'
			? `Anderes: ${count > 1 ? `${count}x ` : ''}${text ?? ''}`.trim()
			: `${count}x ${CANNABIS_UNITS[unit][0]}`;
	}
	const { activity, minutes } = item as DurationItem;
	return `${choiceLabel(topic === 'gambling' ? GAMES : MEDIA, activity)}, ${formatMinutes(minutes)}`;
};

export const phaseGrams = (phase: Phase): number =>
	phase.topic === 'alcohol'
		? phase.items.reduce((sum, item) => sum + (gramsOf(item.drink, item.size) ?? 0) * item.count, 0)
		: 0;

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** The day's sum for one topic, as counsellors see it in the week grid. */
export const daySum = (topic: TopicId, phases: Phase[]): string => {
	const items = phases
		.filter((phase) => phase.topic === topic)
		.flatMap((phase): Array<AlcoholItem | CannabisItem | DurationItem> => phase.items);
	if (items.length === 0) {
		return plural(phases.filter((phase) => phase.topic === topic).length, 'Phase', 'Phasen');
	}
	if (topic === 'alcohol') {
		const drinks = (items as AlcoholItem[]).reduce((sum, item) => sum + item.count, 0);
		const grams = phases.reduce((sum, phase) => sum + (phase.topic === topic ? phaseGrams(phase) : 0), 0);
		return `${plural(drinks, 'Getränk', 'Getränke')}, ca. ${grams} g Alkohol`;
	}
	if (topic === 'cannabis') {
		const count = (unit: CannabisItem['unit']) =>
			(items as CannabisItem[])
				.filter((item) => item.unit === unit)
				.reduce((sum, item) => sum + item.count, 0);
		return [
			count('joint') && plural(count('joint'), 'Joint', 'Joints'),
			count('bong') && plural(count('bong'), 'Bong', 'Bongs'),
			count('other') && `${count('other')}x Anderes`
		]
			.filter(Boolean)
			.join(', ');
	}
	const minutes = (items as DurationItem[]).reduce((sum, item) => sum + item.minutes, 0);
	return formatMinutes(minutes);
};

interface TopicText {
	label: string;
	/** Column of the week view. */
	weekQuestion: (informal: boolean) => string;
	dayQuestion: (informal: boolean) => string;
	phaseName: string;
	/** In the summary: "im Hinblick auf Ihren Alkoholkonsum". */
	regarding: (informal: boolean) => string;
	planExample: string;
	yesIntro: (informal: boolean) => string;
	yesMore: (informal: boolean) => string;
	noIntro: (informal: boolean) => string;
	noMore: (informal: boolean) => string;
	contextQuestion: (informal: boolean) => string;
	triggerQuestion: string;
	saveLabel: string;
	loggedLabel: string;
}

const yesMore = (i: boolean, example: string, several: string) =>
	tx(
		i,
		`Wenn Sie zum Beispiel mittags und abends ${example}, machen Sie zwei Einträge. ${several} Das Ziel des Tagebuchs ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, Ihr Konsumverhalten möglichst genau verstehen lernen, um es erfolgreich zu verändern.`,
		`Wenn du zum Beispiel mittags und abends ${example}, mach zwei Einträge. ${several} Das Ziel des Tagebuchs ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, dein Konsumverhalten möglichst genau verstehen lernst, um es erfolgreich zu verändern.`
	);

const noIntro = (i: boolean, what: string, stay: string) =>
	tx(
		i,
		`Sie haben heute ${what}? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen geholfen hat, ${stay} und wie es Ihnen dabei ergangen ist.`,
		`Du hast heute ${what}? Wunderbar! Schreib unbedingt auf, was dir geholfen hat, ${stay} und wie es dir dabei ergangen ist.`
	);

const noMore = (i: boolean, life: string) =>
	tx(
		i,
		`Vielleicht konnten Sie erfolgreich Ihre Kontrollstrategien anwenden? Ihre Notizen im Tagebuch helfen Ihnen und Ihrer Beraterin / Ihrem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung${life} zu erkennen. Wenn Sie nichts eintragen wollen, klicken Sie einfach auf speichern.`,
		`Vielleicht konntest du erfolgreich deine Kontrollstrategien anwenden? Deine Notizen im Tagebuch helfen dir und deiner Beraterin / deinem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung${life} zu erkennen. Wenn du nichts eintragen willst, klick einfach auf speichern.`
	);

const consumptionTrigger = 'Warum? Was war der Grund/Auslöser des Konsums?';

export const TOPICS: Record<TopicId, TopicText> = {
	alcohol: {
		label: 'Alkohol',
		weekQuestion: (i) => tx(i, 'Haben Sie Alkohol getrunken?', 'Hast du Alkohol getrunken?'),
		dayQuestion: (i) => tx(i, 'Haben Sie heute Alkohol getrunken?', 'Hast du heute Alkohol getrunken?'),
		phaseName: 'Konsumphase',
		regarding: (i) => tx(i, 'Ihren Alkoholkonsum', 'deinen Alkoholkonsum'),
		planExample: 'nicht trinken',
		yesIntro: (i) =>
			tx(
				i,
				'Protokollieren Sie hier Ihren Alkoholkonsum. Bitte nutzen Sie für jede Konsumsituation/Konsumphase einen neuen Eintrag.',
				'Protokolliere hier deinen Alkoholkonsum. Bitte nutze für jede Konsumsituation/Konsumphase einen neuen Eintrag.'
			),
		yesMore: (i) =>
			yesMore(
				i,
				tx(i, 'getrunken haben', 'getrunken hast'),
				tx(
					i,
					'Wenn Sie in einem Zeitraum mehrere Getränke konsumiert haben, können Sie dies als eine Konsumphase eintragen.',
					'Wenn du in einem Zeitraum mehrere Getränke konsumiert hast, kannst du dies als eine Konsumphase eintragen.'
				)
			),
		noIntro: (i) =>
			noIntro(i, tx(i, 'keinen Alkohol getrunken', 'keinen Alkohol getrunken'), 'nüchtern zu bleiben'),
		noMore: (i) => noMore(i, ' und ein nüchternes Leben'),
		contextQuestion: (i) => tx(i, 'Mit wem und wo haben Sie getrunken?', 'Mit wem und wo hast du getrunken?'),
		triggerQuestion: consumptionTrigger,
		saveLabel: 'Konsumphase speichern',
		loggedLabel: 'Protokollierte Getränke'
	},
	cannabis: {
		label: 'Cannabis',
		weekQuestion: (i) => tx(i, 'Haben Sie Cannabis konsumiert?', 'Hast du Cannabis konsumiert?'),
		dayQuestion: (i) => tx(i, 'Haben Sie heute Cannabis konsumiert?', 'Hast du heute Cannabis konsumiert?'),
		phaseName: 'Konsumphase',
		regarding: (i) => tx(i, 'Ihren Cannabiskonsum', 'deinen Cannabiskonsum'),
		planExample: 'nicht kiffen',
		yesIntro: (i) =>
			tx(
				i,
				'Protokollieren Sie hier Ihren Cannabiskonsum. Bitte nutzen Sie für jede Konsumsituation/Konsumphase einen neuen Eintrag.',
				'Protokolliere hier deinen Cannabiskonsum. Bitte nutze für jede Konsumsituation/Konsumphase einen neuen Eintrag.'
			),
		yesMore: (i) =>
			yesMore(
				i,
				tx(i, 'gekifft haben', 'gekifft hast'),
				tx(
					i,
					'Wenn Sie in einem Zeitraum mehrfach konsumiert haben, können Sie dies als eine Konsumphase eintragen.',
					'Wenn du in einem Zeitraum mehrfach konsumiert hast, kannst du dies als eine Konsumphase eintragen.'
				)
			),
		noIntro: (i) => noIntro(i, 'nicht konsumiert', 'nüchtern zu bleiben'),
		noMore: (i) => noMore(i, ' und ein nüchternes Leben'),
		contextQuestion: (i) => tx(i, 'Mit wem und wo haben Sie gekifft?', 'Mit wem und wo hast du gekifft?'),
		triggerQuestion: consumptionTrigger,
		saveLabel: 'Konsumphase speichern',
		loggedLabel: 'Protokollierter Konsum'
	},
	gambling: {
		label: 'Glücksspiel',
		weekQuestion: (i) => tx(i, 'Haben Sie Glücksspiele gespielt?', 'Hast du Glücksspiele gespielt?'),
		dayQuestion: (i) => tx(i, 'Haben Sie heute gespielt?', 'Hast du heute gespielt?'),
		phaseName: 'Spielphase',
		regarding: (i) => tx(i, 'Ihr Glücksspielverhalten', 'dein Glücksspielverhalten'),
		planExample: 'nicht spielen',
		yesIntro: (i) =>
			tx(
				i,
				'Protokollieren Sie hier Ihr Glücksspielverhalten. Bitte nutzen Sie für jede Phase in der Sie gespielt haben einen neuen Eintrag.',
				'Protokolliere hier dein Glücksspielverhalten. Bitte nutze für jede Phase, in der du gespielt hast, einen neuen Eintrag.'
			),
		yesMore: (i) =>
			yesMore(
				i,
				tx(i, 'gespielt haben', 'gespielt hast'),
				tx(
					i,
					'Wenn Sie in einem Zeitraum mehrere Glücksspielarten genutzt haben, können Sie diese in einer Spielphase eintragen.',
					'Wenn du in einem Zeitraum mehrere Glücksspielarten genutzt hast, kannst du diese in einer Spielphase eintragen.'
				)
			),
		noIntro: (i) => noIntro(i, 'keine Glücksspiele gespielt', 'spielfrei zu bleiben'),
		noMore: (i) => noMore(i, ' und ein spielfreies Leben'),
		contextQuestion: (i) => tx(i, 'Wo und mit wem haben Sie gespielt?', 'Wo und mit wem hast du gespielt?'),
		triggerQuestion: 'Warum? Was war der Grund/Auslöser für das Glücksspielen?',
		saveLabel: 'Eintrag speichern',
		loggedLabel: 'Protokollierte Glücksspiele'
	},
	media: {
		label: 'Medien',
		weekQuestion: (i) => tx(i, 'Haben Sie Medien genutzt?', 'Hast du Medien genutzt?'),
		dayQuestion: (i) => tx(i, 'Haben Sie heute Medien genutzt?', 'Hast du heute Medien genutzt?'),
		phaseName: 'Medienphase',
		regarding: (i) => tx(i, 'Ihren Medienkonsum', 'deinen Medienkonsum'),
		planExample: 'nicht spielen',
		yesIntro: (i) =>
			tx(
				i,
				'Protokollieren Sie hier Ihren Medienkonsum. Bitte nutzen Sie für jede Konsumsituation/Konsumphase einen neuen Eintrag.',
				'Protokolliere hier deinen Medienkonsum. Bitte nutze für jede Konsumsituation/Konsumphase einen neuen Eintrag.'
			),
		yesMore: (i) =>
			tx(
				i,
				'Wenn Sie zum Beispiel mittags und abends Medien genutzt haben, machen Sie zwei Einträge. Wenn Sie in einem Zeitraum mehrere Medien konsumiert haben, können Sie dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, Ihr Mediennutzungsverhalten möglichst genau verstehen lernen, um es erfolgreich zu verändern.',
				'Wenn du zum Beispiel mittags und abends Medien genutzt hast, mach zwei Einträge. Wenn du in einem Zeitraum mehrere Medien konsumiert hast, kannst du dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, dein Mediennutzungsverhalten möglichst genau verstehen lernst, um es erfolgreich zu verändern.'
			),
		noIntro: (i) =>
			tx(
				i,
				'Sie haben heute keine Medien genutzt? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen dabei geholfen hat und wie es Ihnen dabei ergangen ist.',
				'Du hast heute keine Medien genutzt? Wunderbar! Schreib unbedingt auf, was dir dabei geholfen hat und wie es dir dabei ergangen ist.'
			),
		noMore: (i) => noMore(i, ''),
		contextQuestion: (i) =>
			tx(i, 'Wo und mit wem haben Sie Medien genutzt?', 'Wo und mit wem hast du Medien genutzt?'),
		triggerQuestion: 'Warum? Was war der Grund/Auslöser für die Mediennutzung?',
		saveLabel: 'Eintrag speichern',
		loggedLabel: 'Protokollierter Konsum von Medien'
	}
};

export const deviceQuestion = (informal: boolean): string =>
	tx(
		informal,
		'Welches Endgerät haben Sie genutzt? (z. B. Computer, Smartphone, Computerspielkonsole/tragbares Computerspielgerät)',
		'Welches Endgerät hast du genutzt? (z. B. Computer, Smartphone, Computerspielkonsole/tragbares Computerspielgerät)'
	);

export const ratingQuestion = (topic: TopicId, informal: boolean): string =>
	tx(
		informal,
		`Wie bewerten Sie den heutigen Tag im Hinblick auf ${TOPICS[topic].regarding(informal)}?`,
		`Wie bewertest du den heutigen Tag im Hinblick auf ${TOPICS[topic].regarding(informal)}?`
	);

export const ratingHint = (informal: boolean): string =>
	tx(
		informal,
		'Was ist Ihnen heute gut gelungen? Was lief nicht so optimal? Denken Sie dabei an Ihr persönliches Ziel.',
		'Was ist dir heute gut gelungen? Was lief nicht so optimal? Denk dabei an dein persönliches Ziel.'
	);

export const planQuestion = (informal: boolean): string =>
	tx(informal, 'Was nehmen Sie sich für morgen vor?', 'Was nimmst du dir für morgen vor?');

export const planHint = (topic: TopicId, informal: boolean): string =>
	tx(
		informal,
		`Setzen Sie sich für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: ${TOPICS[topic].planExample}, eine Aufgabe erledigen, eine schöne Unternehmung etc.)`,
		`Setzt du dir für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: ${TOPICS[topic].planExample}, eine Aufgabe erledigen, eine schöne Unternehmung etc.)`
	);

export const deleteQuestion = (topic: TopicId): string =>
	`Alle für diesen Tag eingetragenen ${TOPICS[topic].phaseName === 'Spielphase' ? 'Spielphasen' : TOPICS[topic].phaseName === 'Medienphase' ? 'Medienphasen' : 'Konsumphasen'} werden gelöscht. Trotzdem fortfahren?`;

export const startMessage = (informal: boolean): string =>
	tx(
		informal,
		'Das Tagebuch dient dazu, alle Aspekte im Zusammenhang mit der angezielten Verhaltensänderung täglich zu notieren. Wichtig ist es, kontinuierlich dabei zu bleiben und alle relevanten Gedanken und Gefühle ausführlich im Tagebuch zu dokumentieren. Das hilft Ihnen, Ihr Ziel zu erreichen! Je genauer Ihre Beraterin / Ihr Berater sich ein Bild von Ihrer Situation machen kann, desto besser können Sie beraten werden. Deshalb empfehlen wir Ihnen, Ihre Einträge für Ihre Beraterin / Ihren Berater sichtbar zu machen.',
		'Das Tagebuch dient dazu, alle Aspekte im Zusammenhang mit der angezielten Verhaltensänderung täglich zu notieren. Wichtig ist es, kontinuierlich dabei zu bleiben und alle relevanten Gedanken und Gefühle ausführlich im Tagebuch zu dokumentieren. Das hilft dir, dein Ziel zu erreichen! Je genauer deine Beraterin / dein Berater sich ein Bild von deiner Situation machen kann, desto besser kannst du beraten werden. Deshalb empfehlen wir dir, deine Einträge für deine Beraterin / deinen Berater sichtbar zu machen.'
	);

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
