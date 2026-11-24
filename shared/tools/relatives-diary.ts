import type { Messages } from '../i18n/index.ts';

/** One entry per day, keyed by the day (`YYYY-MM-DD`). */
export const ENTRY_KIND = 'entry';
export const MAX_TEXT_LENGTH = 10000;
export const SNIPPET_LENGTH = 100;

export interface DiaryEntry {
	text?: string;
	/** 1 = sehr schlecht … 5 = sehr gut */
	mood?: number;
}

/** The stored mood value and the id of its label in `relativesDiary.moods`. */
export const MOODS = [
	{ value: 1, id: 'very-bad' },
	{ value: 2, id: 'rather-bad' },
	{ value: 3, id: 'average' },
	{ value: 4, id: 'rather-good' },
	{ value: 5, id: 'very-good' }
] as const;

export const moodLabel = (m: Messages, mood: number | undefined): string => {
	const option = MOODS.find((candidate) => candidate.value === mood);
	return option ? m.relativesDiary.moods[option.id] : m.relativesDiary.noMood;
};

/** The three questions and the mood question; past days are not asked about "heute". */
export const dayQuestions = (m: Messages, isToday: boolean) => {
	const texts = m.relativesDiary;
	return isToday
		? { questions: texts.questionsToday, mood: texts.moodQuestionToday }
		: { questions: texts.questionsOtherDay, mood: texts.moodQuestionOtherDay };
};

/** The first characters of an entry for the week view, cut at a word. */
export const snippet = (text: string | undefined, length = SNIPPET_LENGTH): string => {
	const flat = (text ?? '').replace(/\s+/g, ' ').trim();
	if (flat.length <= length) {
		return flat;
	}
	const cut = flat.slice(0, length);
	const space = cut.lastIndexOf(' ');
	return `${(space > length * 0.6 ? cut.slice(0, space) : cut).trimEnd()} …`;
};
