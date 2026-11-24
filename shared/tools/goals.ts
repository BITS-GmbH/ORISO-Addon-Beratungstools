export const MAX_ANSWER_LENGTH = 4000;

/**
 * The exercise after section 2.1 of delphi's tool description: four questions ("Frage 1 von 4" to
 * "Frage 4 von 4"), then the goal, then a summary. Texts per step: `goals.steps.<id>` in the catalogue.
 */
export const STEP_IDS = ['situation', 'factors', 'motivation', 'resources', 'goal'] as const;

export type StepId = (typeof STEP_IDS)[number];

/** Each answer is one entry of kind `answer`, keyed by its step. */
export const ANSWER_KIND = 'answer';

export interface Answer {
	text: string;
}

export const isStepId = (key: string): key is StepId => (STEP_IDS as readonly string[]).includes(key);
