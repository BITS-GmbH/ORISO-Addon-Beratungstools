import type { I18n, Messages } from '../i18n/index.ts';

export const MAX_TEXT_LENGTH = 500;
export const MAX_CONCLUSION_LENGTH = 4000;
export const MAX_ARGUMENTS = 200;

/** "Wie wichtig ist dieser Aspekt für Sie?" with the points of each answer; labels: `balance.ratings`. */
export const RATINGS = [
	{ value: 3, id: 'very' },
	{ value: 2, id: 'quite' },
	{ value: 1, id: 'some' },
	{ value: 0, id: 'none' }
] as const;

export type CategoryId = 'A' | 'B' | 'C' | 'D';
export type Side = 'pro' | 'contra';

/**
 * A: advantages of the change (PRO), B: disadvantages of the change (CONTRA),
 * C: advantages of no change (CONTRA), D: disadvantages of no change (PRO).
 */
export const CATEGORIES: Record<
	CategoryId,
	{ side: Side; change: boolean; kind: 'advantage' | 'disadvantage' }
> = {
	A: {
		side: 'pro',
		change: true,
		kind: 'advantage'
	},
	B: {
		side: 'contra',
		change: true,
		kind: 'disadvantage'
	},
	C: {
		side: 'contra',
		change: false,
		kind: 'advantage'
	},
	D: {
		side: 'pro',
		change: false,
		kind: 'disadvantage'
	}
};

export const CATEGORY_IDS: CategoryId[] = ['A', 'B', 'C', 'D'];

export type Half = 'change' | 'keep';

export const HALVES: Record<Half, [CategoryId, CategoryId]> = { change: ['A', 'B'], keep: ['C', 'D'] };

/**
 * Pole labels (CONTRA / PRO); the tool description names three variants, the Träger picks one.
 * The German texts are the stored setting; `balance.poles` holds the labels per variant index.
 */
export const POLE_VARIANTS = [
	'CONTRA Veränderung / PRO Veränderung',
	'keine Veränderung / Ich möchte etwas ändern!',
	'gut so, wie es ist / es muss sich was ändern!'
] as const;

/** The labels of the chosen variant (stored as its German text) in the catalogue's language. */
export const polesOf = (variant: unknown, m: Messages): { contra: string; pro: string } => {
	const poles = m.balance.poles;
	return poles[POLE_VARIANTS.findIndex((v) => v === variant)] ?? poles[0] ?? { contra: '', pro: '' };
};

export const ARGUMENT_KIND = 'argument';
export const CONCLUSION_KIND = 'conclusion';
export const CONCLUSION_KEY = 'main';

export interface Argument {
	category: CategoryId;
	text: string;
	rating: number;
}

export interface BalanceResult {
	pro: number;
	contra: number;
	raw: number;
	/** −10 … +10, or null while there are no points (the scale stays inactive). */
	value: number | null;
}

/**
 * PRO = Σ rating(A) + Σ rating(D), CONTRA = Σ rating(B) + Σ rating(C),
 * value = 10 × (PRO − CONTRA) / (PRO + CONTRA), only when PRO + CONTRA > 0 (section 2.4.5).
 */
export const calculate = (args: ReadonlyArray<Pick<Argument, 'category' | 'rating'>>): BalanceResult => {
	let pro = 0;
	let contra = 0;
	for (const { category, rating } of args) {
		if (CATEGORIES[category]?.side === 'pro') {
			pro += rating;
		} else if (CATEGORIES[category]?.side === 'contra') {
			contra += rating;
		}
	}
	const total = pro + contra;
	return { pro, contra, raw: pro - contra, value: total > 0 ? (10 * (pro - contra)) / total : null };
};

/** The value as shown: one decimal for the language, with a sign; '–' when inactive. */
export const formatValue = (value: number | null | undefined, i18n: I18n): string => {
	if (value === null || value === undefined) {
		return '–';
	}
	const rounded = Math.round(value * 10) / 10;
	const text = i18n.number(Math.abs(rounded), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
	return rounded > 0 ? `+${text}` : rounded < 0 ? `−${text}` : text;
};

/** A short reading of the value, as in the worked examples of section 2.4.5. */
export const tendency = (value: number | null | undefined, i18n: I18n): string => {
	const texts = i18n.m.balance.tendency;
	if (value === null || value === undefined) {
		return texts.pending;
	}
	const size = Math.abs(value);
	if (size < 0.5) {
		return texts.balanced;
	}
	const side = i18n.m.balance.sides[value > 0 ? 'pro' : 'contra'];
	const text = size >= 10 ? texts.maximum : size >= 3 ? texts.clear : texts.slight;
	return i18n.t(text, { side });
};

export const ratingLabel = (rating: number, m: Messages): string => {
	const id = RATINGS.find((r) => r.value === rating)?.id;
	return id ? m.balance.ratings[id] : '';
};
