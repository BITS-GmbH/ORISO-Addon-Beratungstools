import type { Entry } from '../api.ts';
import { tx } from '../address.ts';

export const MAX_SITUATION_LENGTH = 1000;
export const MAX_STRATEGY_LENGTH = 2000;
export const MAX_ANSWER_LENGTH = 2000;
export const MAX_SITUATIONS = 100;
export const MAX_RELAPSES = 500;

export const SITUATION_KIND = 'situation';
export const RELAPSE_KIND = 'relapse';

export const DIFFICULTIES = [
	{ value: 'easy', label: 'leicht', level: 1 },
	{ value: 'medium', label: 'mittel', level: 2 },
	{ value: 'hard', label: 'schwer', level: 3 },
	{ value: 'very-hard', label: 'sehr schwer', level: 4 }
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number]['value'];

export const DIFFICULTY_VALUES = DIFFICULTIES.map((d) => d.value) as [Difficulty, ...Difficulty[]];

export const difficultyOf = (value: string) => DIFFICULTIES.find((d) => d.value === value);

export interface Situation {
	situation: string;
	difficulty: Difficulty;
	strategy: string;
}

/** One analysed relapse in a risk situation; `previousStrategy` keeps the strategy as it was before. */
export interface Relapse {
	situationId: string;
	circumstances: string;
	feelings: string;
	mainReason: string;
	alternatives: string;
	previousStrategy: string;
	newStrategy: string;
}

export type RelapseAnswer = 'circumstances' | 'feelings' | 'mainReason' | 'alternatives';

export const RELAPSE_QUESTIONS: Array<{
	id: RelapseAnswer;
	question: (informal: boolean) => string;
	counsellorLabel: string;
}> = [
	{
		id: 'circumstances',
		question: () =>
			'1. Welche Umstände und Begleiterscheinungen (Ort, Ereignis, anwesende Personen) waren bei dem Rückfall beteiligt?',
		counsellorLabel: 'Umstände und Begleiterscheinungen'
	},
	{
		id: 'feelings',
		question: (i) =>
			tx(
				i,
				'2. Welche Gefühle oder Gedanken haben Ihre Entscheidung beeinflusst und den Rückfall ausgelöst?',
				'2. Welche Gefühle oder Gedanken haben deine Entscheidung beeinflusst und den Rückfall ausgelöst?'
			),
		counsellorLabel: 'Gefühle und Gedanken'
	},
	{
		id: 'mainReason',
		question: (i) =>
			tx(
				i,
				'3. Was denken Sie war der Hauptgrund, der zu dem Rückfall geführt hat?',
				'3. Was denkst du war der Hauptgrund, der zu dem Rückfall geführt hat?'
			),
		counsellorLabel: 'Hauptgrund'
	},
	{
		id: 'alternatives',
		question: (i) =>
			tx(
				i,
				'4. Welche Alternativen hätten in dieser Situation bestanden? (Was hätten Sie konkret anders machen können? Welche Gedanken hätten helfen können? Wer oder was hätte Sie unterstützen können?)',
				'4. Welche Alternativen hätten in dieser Situation bestanden? (Was hättest du konkret anders machen können? Welche Gedanken hätten helfen können? Wer oder was hätte dich unterstützen können?)'
			),
		counsellorLabel: 'Alternativen'
	}
];

export const NEW_STRATEGY_QUESTION = (informal: boolean): string =>
	tx(
		informal,
		'5. Wie könnten Sie die Situation in Zukunft meistern? (Ihre Eingabe wird automatisch als neue Kontrollstrategie für diese Risikosituation übernommen.)',
		'5. Wie könntest du die Situation in Zukunft meistern? (Deine Eingabe wird automatisch als neue Kontrollstrategie für diese Risikosituation übernommen.)'
	);

export const startText = (informal: boolean): string =>
	tx(
		informal,
		'In dieser Übung setzen Sie sich gezielt mit Ihren Risikosituationen auseinander und entwickeln passende Kontrollstrategien.',
		'In dieser Übung setzt du dich gezielt mit deinen Risikosituationen auseinander und entwickelst passende Kontrollstrategien.'
	);

export const guideIntro = (informal: boolean): string =>
	tx(
		informal,
		'Wenn Sie Ihre Einträge freigeben, kann Ihre Beraterin / Ihr Berater Ihre Angaben lesen und Sie besser unterstützen. Sie können die Einträge selbstverständlich nach Ihrem Ermessen verändern oder löschen. Gehen Sie Schritt-für-Schritt folgendermaßen vor:',
		'Wenn du deine Einträge freigibst, kann deine Beraterin / dein Berater deine Angaben lesen und dich besser unterstützen. Du kannst die Einträge selbstverständlich nach deinem Ermessen verändern oder löschen. Geh Schritt-für-Schritt folgendermaßen vor:'
	);

export const guideSteps = (informal: boolean): Array<[string, string]> => [
	[
		'Risikosituation eintragen',
		tx(
			informal,
			'in denen Sie den Substanzkonsum bzw. das problematische Verhalten bisher gezeigt haben.',
			'in denen du den Substanzkonsum bzw. das problematische Verhalten bisher gezeigt hast.'
		)
	],
	[
		'Bewertung vornehmen',
		tx(
			informal,
			'Risikosituationen können unterschiedlich schwer zu bewältigen sein. Bewerten Sie jede Situation danach, wie schwer es Ihnen vermutlich fallen wird, in der Situation standhaft zu bleiben.',
			'Risikosituationen können unterschiedlich schwer zu bewältigen sein. Bewerte jede Situation danach, wie schwer es dir vermutlich fallen wird, in der Situation standhaft zu bleiben.'
		)
	],
	[
		'Kontrollstrategien entwickeln',
		tx(
			informal,
			'Überlegen Sie, welche Möglichkeiten Sie haben, um in diesen Situationen die Kontrolle zu behalten und nicht in alte Verhaltensmuster zu verfallen. Dies können bestimmte Handlungen oder Gedanken sein, die Sie ablenken.',
			'Überlege, welche Möglichkeiten du hast, um in diesen Situationen die Kontrolle zu behalten und nicht in alte Verhaltensmuster zu verfallen. Dies können bestimmte Handlungen oder Gedanken sein, die dich ablenken.'
		)
	],
	[
		'Optimierung bei Rückfall',
		tx(
			informal,
			'Wenn Sie wieder in alte Verhaltensmuster und Gewohnheiten zurückfallen sollten, nutzen Sie die Erkenntnisse als wichtige Lektion! Bearbeiten Sie Ihre Kontrollstrategie, um sie zu optimieren. Ihre Beraterin / Ihr Berater kann Sie hierbei unterstützen.',
			'Wenn du wieder in alte Verhaltensmuster und Gewohnheiten zurückfallen solltest, nutze die Erkenntnisse als wichtige Lektion! Bearbeite deine Kontrollstrategie, um sie zu optimieren. Deine Beraterin / dein Berater kann dich hierbei unterstützen.'
		)
	]
];

export const situationHint = (informal: boolean): string =>
	tx(
		informal,
		'Beschreiben Sie eine typische Situation, in der Sie den Substanzkonsum bzw. das problematische Verhalten zeigen oder in denen Ihnen der Verzicht schwerfallen würde.',
		'Beschreibe eine typische Situation, in der du den Substanzkonsum bzw. das problematische Verhalten zeigst oder in denen dir der Verzicht schwerfallen würde.'
	);

export const difficultyQuestion = (informal: boolean): string =>
	tx(
		informal,
		'Wie schwierig ist es für Sie, in dieser Situation standhaft zu bleiben?',
		'Wie schwierig ist es für dich, in dieser Situation standhaft zu bleiben?'
	);

export const strategyQuestion = (informal: boolean): string =>
	tx(
		informal,
		'Wie können Sie in dieser Situation vermeiden, in alte Gewohnheiten zu verfallen?',
		'Wie kannst du in dieser Situation vermeiden, in alte Gewohnheiten zu verfallen?'
	);

export const relapseIntro = (informal: boolean): string =>
	tx(
		informal,
		'Die Veränderung von Gewohnheiten erfordert häufig eine enorme Anstrengung und funktioniert nur selten ohne Rückschläge. Wenn Sie in alte Verhaltensmuster zurückgefallen sind, also bspw. getrunken, gekifft oder gespielt haben, obwohl Sie dies eigentlich nicht wollten, lassen Sie sich davon nicht demotivieren! Nutzen Sie stattdessen die konkrete Erfahrung, um sich auf zukünftige Herausforderungen besser vorzubereiten. Analysieren Sie mit Hilfe der folgenden Fragen die konkrete Situation, um für die Zukunft zu lernen. Ihre Beraterin / Ihr Berater kann Sie bei der Analyse von Rückschlägen und der Erarbeitung von Bewältigungsstrategien unterstützen.',
		'Die Veränderung von Gewohnheiten erfordert häufig eine enorme Anstrengung und funktioniert nur selten ohne Rückschläge. Wenn du in alte Verhaltensmuster zurückgefallen bist, also bspw. getrunken, gekifft oder gespielt hast, obwohl du dies eigentlich nicht wolltest, lass dich davon nicht demotivieren! Nutze stattdessen die konkrete Erfahrung, um dich auf zukünftige Herausforderungen besser vorzubereiten. Analysiere mit Hilfe der folgenden Fragen die konkrete Situation, um für die Zukunft zu lernen. Deine Beraterin / dein Berater kann dich bei der Analyse von Rückschlägen und der Erarbeitung von Bewältigungsstrategien unterstützen.'
	);

export type SituationItem = Situation & { id: string; entry: Entry };
export type RelapseItem = Relapse & { id: string; entry: Entry };

/**
 * The risk situations in the order they were entered. Also the accessor for tools that show them
 * (the Notfallkoffer reads them through the core's `linked`).
 */
export const situationsOf = (entries: Entry[] | undefined): SituationItem[] =>
	(entries ?? [])
		.filter((e) => e.kind === SITUATION_KIND)
		.map((e) => ({ ...(e.data as Situation), id: e.id, entry: e }));

/** The analysed relapses of one situation, newest first. */
export const relapsesOf = (entries: Entry[] | undefined, situationId: string): RelapseItem[] =>
	(entries ?? [])
		.filter((e) => e.kind === RELAPSE_KIND && (e.data as Relapse).situationId === situationId)
		.map((e) => ({ ...(e.data as Relapse), id: e.id, entry: e }))
		.sort((a, b) => b.entry.createdAt.localeCompare(a.entry.createdAt));
