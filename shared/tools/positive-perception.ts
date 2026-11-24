export const MAX_BEHAVIOUR_LENGTH = 500;
export const MAX_BEHAVIOURS = 200;
export const BEHAVIOUR_KIND = 'behaviour';

export interface Behaviour {
	text: string;
}

export type RemarkId = 'clumsy' | 'forgetful' | 'kind' | 'skilful';

export interface Remark {
	id: RemarkId;
	tone: 'negative' | 'positive';
}

/** The parents' remarks of the scheme; their texts and the child's reactions are in the catalogue. */
export const REMARKS: Remark[] = [
	{ id: 'clumsy', tone: 'negative' },
	{ id: 'forgetful', tone: 'negative' },
	{ id: 'kind', tone: 'positive' },
	{ id: 'skilful', tone: 'positive' }
];
