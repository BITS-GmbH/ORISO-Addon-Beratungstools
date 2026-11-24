import type { de } from './de.ts';

export type PluralCategory = Intl.LDMLPluralRule;

/** A text with forms per plural category of the language; `{count}` selects the form. */
export type Plural = { [Category in Exclude<PluralCategory, 'other'>]?: string } & { other: string };

/** German only: the formal ("Sie") and informal ("du") form of a text. */
export interface Formality<T> {
	formal: T;
	informal: T;
}

/** The German catalogue is the source: its shape defines every key. */
export type Schema = typeof de;

/** What another language provides for a value of the German catalogue: no informal variants. */
export type Translation<T> = T extends string
	? string
	: T extends { formal: infer F; informal: unknown }
		? Translation<F>
		: T extends { other: string }
			? Plural
			: T extends readonly (infer E)[]
				? Translation<E>[]
				: { [K in keyof T]: Translation<T[K]> };

type DeepPartial<T> = T extends string | Plural | readonly unknown[]
	? T
	: { [K in keyof T]?: DeepPartial<T[K]> };

/** A complete catalogue (English): a missing key is a type error. */
export type Complete = Translation<Schema>;

/** A catalogue that may still miss keys; the tests list them, the runtime falls back to English. */
export type Catalogue = DeepPartial<Complete>;

/** The catalogue as views use it: one language, forms of address resolved, fallbacks applied. */
export type Messages = Complete;
