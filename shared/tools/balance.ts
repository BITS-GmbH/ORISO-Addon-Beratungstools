import { z } from 'zod';

export const MAX_TEXT_LENGTH = 500;
export const MAX_CONCLUSION_LENGTH = 4000;
export const MAX_ARGUMENTS = 200;

/** "Wie wichtig ist dieser Aspekt für Sie?" with the points of each answer. */
export const RATINGS = [
	{ value: 3, label: 'sehr wichtig' },
	{ value: 2, label: 'ziemlich wichtig' },
	{ value: 1, label: 'etwas wichtig' },
	{ value: 0, label: 'gar nicht wichtig' }
] as const;

export type CategoryId = 'A' | 'B' | 'C' | 'D';
export type Side = 'pro' | 'contra';

/**
 * A: advantages of the change (PRO), B: disadvantages of the change (CONTRA),
 * C: advantages of no change (CONTRA), D: disadvantages of no change (PRO).
 */
export const CATEGORIES: Record<
	CategoryId,
	{ side: Side; change: boolean; kind: 'advantage' | 'disadvantage'; title: string; long: string }
> = {
	A: {
		side: 'pro',
		change: true,
		kind: 'advantage',
		title: 'Vorteile',
		long: 'Vorteile der Verhaltensänderung'
	},
	B: {
		side: 'contra',
		change: true,
		kind: 'disadvantage',
		title: 'Nachteile',
		long: 'Nachteile der Verhaltensänderung'
	},
	C: {
		side: 'contra',
		change: false,
		kind: 'advantage',
		title: 'Vorteile',
		long: 'Vorteile, wenn sich nichts ändert'
	},
	D: {
		side: 'pro',
		change: false,
		kind: 'disadvantage',
		title: 'Nachteile',
		long: 'Nachteile, wenn sich nichts ändert'
	}
};

export const CATEGORY_IDS: CategoryId[] = ['A', 'B', 'C', 'D'];

export type Half = 'change' | 'keep';

export const HALVES: Record<Half, [CategoryId, CategoryId]> = { change: ['A', 'B'], keep: ['C', 'D'] };

export const HALF_TEXT: Record<Half, string> = {
	change: 'Wenn ich mein Ziel erreiche / mein Verhalten ändere, habe ich folgende …',
	keep: 'Wenn ich mein Verhalten nicht ändere / mein Ziel nicht erreiche, habe ich folgende …'
};

/** Pole labels (CONTRA / PRO); the tool description names three variants, the Träger picks one. */
export const POLE_VARIANTS = [
	'CONTRA Veränderung / PRO Veränderung',
	'keine Veränderung / Ich möchte etwas ändern!',
	'gut so, wie es ist / es muss sich was ändern!'
] as const;

export const polesOf = (variant: unknown): { contra: string; pro: string } => {
	const chosen = POLE_VARIANTS.find((v) => v === variant) ?? POLE_VARIANTS[0];
	const [contra = '', pro = ''] = chosen.split(' / ');
	return { contra, pro };
};

export const EXAMPLES: Record<CategoryId, string[]> = {
	A: [
		'Ich kriege wieder mehr auf die Reihe.',
		'Ich habe wieder Zeit für Hobbys.',
		'Ich kann wieder klar denken.',
		'Mehr Geld / weniger Schulden.',
		'Mein Körper wird nicht mehr so stark belastet.',
		'Ich fühle mich besser.',
		'Gutes Gefühl, weil ich das Problem angehe.',
		'Weniger Stress mit Freunden / Familie.',
		'Ich kann besser einschlafen.'
	],
	B: [
		'Es wird schwierig mit dem alten Freundeskreis.',
		'Der Rausch wird mir fehlen.',
		'Es könnte ganz schön langweilig werden.',
		'Vieles macht dann deutlich weniger Spaß.',
		'Der Entzug / Verzicht wird hart.',
		'Die Hoffnung auf den großen Gewinn fällt weg.'
	],
	C: [
		'Lustigeres Beisammensein mit Freunden.',
		'Beim Trinken / Spielen / Kiffen habe ich meine Ruhe.',
		'Ich kann mich auch mal richtig „wegschießen“ und alles um mich rum vergessen.',
		'Die Chance auf einen Gewinn bleibt.'
	],
	D: [
		'Ich tue kaum etwas anderes.',
		'Ich lasse viele andere Dinge schleifen.',
		'Ich ärgere mich immer mehr über mich selbst.',
		'Weiterhin Ärger und Streit mit meiner Familie.',
		'Ich komme morgens kaum aus dem Bett.',
		'Schulden bleiben / nehmen weiter zu.',
		'Es geht gesundheitlich weiter bergab.',
		'Mein Leben ist weiterhin auf ein Problem reduziert.'
	]
};

export const ARGUMENT_KIND = 'argument';
export const CONCLUSION_KIND = 'conclusion';
export const CONCLUSION_KEY = 'main';

export const argumentSchema = z.object({
	category: z.enum(['A', 'B', 'C', 'D']),
	text: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
	rating: z.number().int().min(0).max(3)
});

export const conclusionSchema = z.object({ text: z.string().trim().min(1).max(MAX_CONCLUSION_LENGTH) });

export type Argument = z.infer<typeof argumentSchema>;

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

/** The value as shown: one decimal, German comma, with a sign; '–' when inactive. */
export const formatValue = (value: number | null | undefined): string => {
	if (value === null || value === undefined) {
		return '–';
	}
	const rounded = Math.round(value * 10) / 10;
	const text = Math.abs(rounded).toFixed(1).replace('.', ',');
	return rounded > 0 ? `+${text}` : rounded < 0 ? `−${text}` : text;
};

/** A short reading of the value, as in the worked examples of section 2.4.5. */
export const tendency = (value: number | null | undefined): string => {
	if (value === null || value === undefined) {
		return 'Noch nicht berechenbar';
	}
	const size = Math.abs(value);
	const side = value > 0 ? 'PRO' : 'CONTRA';
	if (size < 0.5) {
		return 'Ausgeglichen';
	}
	if (size >= 10) {
		return `Maximale ${side}-Tendenz`;
	}
	return size >= 3 ? `${side}-Tendenz` : `Leichte ${side}-Tendenz`;
};

export const ratingLabel = (rating: number): string => RATINGS.find((r) => r.value === rating)?.label ?? '';
