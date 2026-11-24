import type { Entry } from '../api.ts';

export const MAX_SITUATION_LENGTH = 1000;
export const MAX_STRATEGY_LENGTH = 2000;
export const MAX_ANSWER_LENGTH = 2000;
export const MAX_SITUATIONS = 100;
export const MAX_RELAPSES = 500;

export const SITUATION_KIND = 'situation';
export const RELAPSE_KIND = 'relapse';

export const DIFFICULTIES = [
	{ value: 'easy', level: 1 },
	{ value: 'medium', level: 2 },
	{ value: 'hard', level: 3 },
	{ value: 'very-hard', level: 4 }
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

/** The four questions of a relapse analysis before the new strategy (question 5). */
export const RELAPSE_ANSWERS: RelapseAnswer[] = ['circumstances', 'feelings', 'mainReason', 'alternatives'];

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
