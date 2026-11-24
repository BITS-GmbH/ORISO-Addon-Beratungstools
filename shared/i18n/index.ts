import { de } from './de.ts';
import { en } from './en.ts';
import { fr } from './fr.ts';
import { ru } from './ru.ts';
import { ti } from './ti.ts';
import { tr } from './tr.ts';
import type { Messages, Plural } from './types.ts';

export type { Catalogue, Complete, Messages, Plural, Schema } from './types.ts';

/** ORISO's languages; German also has the informal form ("de@informal"). */
export const LANGS = ['de', 'en', 'fr', 'ru', 'ti', 'tr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'de';

export const CATALOGUES: Record<Lang, unknown> = { de, en, fr, ru, ti, tr };

/** Locales for `Intl`; Tigrinya falls back to English where a runtime lacks its data. */
const INTL_LOCALES: Record<Lang, string[]> = {
	de: ['de-DE'],
	en: ['en-GB'],
	fr: ['fr-FR'],
	ru: ['ru-RU'],
	ti: ['ti', 'en-GB'],
	tr: ['tr-TR']
};

export const isLang = (value: unknown): value is Lang => (LANGS as readonly unknown[]).includes(value);

/** The language of an ORISO locale such as `de`, `de@informal`, `en-GB`; German when unknown. */
export const langOf = (locale: string | null | undefined): Lang => {
	const base = (locale ?? '').toLowerCase().split(/[@_-]/)[0];
	return isLang(base) ? base : DEFAULT_LANG;
};

export const isInformalLocale = (locale: string | null | undefined): boolean =>
	/@informal$/i.test(locale ?? '');

export const intlLocales = (lang: Lang): string[] => INTL_LOCALES[lang];

const PLURAL_CATEGORIES = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

export const isPlural = (value: unknown): value is Plural =>
	isRecord(value) &&
	typeof value.other === 'string' &&
	Object.keys(value).every((key) => PLURAL_CATEGORIES.has(key));

const isFormality = (value: unknown): value is { formal: unknown; informal: unknown } =>
	isRecord(value) && Object.keys(value).length === 2 && 'formal' in value && 'informal' in value;

/**
 * The value at one place of the German source, taken from the first layer that has it in the same
 * shape (the language, then English, then German); forms of address are resolved on the way.
 */
const resolve = (source: unknown, layers: unknown[], informal: boolean): unknown => {
	const pick = (value: unknown) => (isFormality(value) ? (informal ? value.informal : value.formal) : value);
	const shape = pick(source);
	const candidates = layers.map(pick);
	if (typeof shape === 'string') {
		return candidates.find((value) => typeof value === 'string') ?? shape;
	}
	if (isPlural(shape)) {
		const found = candidates.find((value) => isPlural(value) || typeof value === 'string');
		return typeof found === 'string' ? { other: found } : (found ?? shape);
	}
	if (Array.isArray(shape)) {
		const sameLength = candidates.map((value) =>
			Array.isArray(value) && value.length === shape.length ? value : undefined
		);
		return shape.map((item, index) =>
			resolve(
				item,
				sameLength.map((value) => value?.[index]),
				informal
			)
		);
	}
	if (isRecord(shape)) {
		return Object.fromEntries(
			Object.entries(shape).map(([key, value]) => [
				key,
				resolve(
					value,
					candidates.map((layer) => (isRecord(layer) ? layer[key] : undefined)),
					informal
				)
			])
		);
	}
	return shape;
};

const messagesCache = new Map<string, Messages>();

/** The catalogue of a language with English, then German, filling in what it does not have yet. */
export const messages = (lang: Lang, informal = false): Messages => {
	const cacheKey = `${lang}:${informal && lang === 'de'}`;
	let cached = messagesCache.get(cacheKey);
	if (!cached) {
		const layers = lang === 'de' ? [de] : lang === 'en' ? [en, de] : [CATALOGUES[lang], en, de];
		cached = resolve(de, layers, informal && lang === 'de') as Messages;
		messagesCache.set(cacheKey, cached);
	}
	return cached;
};

export type Vars = Record<string, string | number>;

export interface I18n {
	lang: Lang;
	informal: boolean;
	/** Locales for `Intl`, e.g. `['de-DE']`. */
	locales: string[];
	m: Messages;
	/**
	 * Fills `{name}` placeholders; numbers are formatted for the language. A plural text picks its
	 * form by `count`.
	 */
	t: (text: string | Plural, vars?: Vars) => string;
	number: (value: number, options?: Intl.NumberFormatOptions) => string;
	/** Date (and time) of an ISO timestamp; empty for none. */
	date: (
		iso: string | Date | null | undefined,
		options?: { withTime?: boolean; timeZone?: string }
	) => string;
}

const i18nCache = new Map<string, I18n>();

export const i18n = (lang: Lang = DEFAULT_LANG, informal = false): I18n => {
	const cacheKey = `${lang}:${informal}`;
	const cached = i18nCache.get(cacheKey);
	if (cached) {
		return cached;
	}
	const locales = intlLocales(lang);
	const plurals = new Intl.PluralRules(locales);
	const numbers = new Intl.NumberFormat(locales);
	const number = (value: number, options?: Intl.NumberFormatOptions) =>
		options ? new Intl.NumberFormat(locales, options).format(value) : numbers.format(value);
	const t = (text: string | Plural, vars: Vars = {}) => {
		const template =
			typeof text === 'string' ? text : (text[plurals.select(Number(vars.count ?? 0))] ?? text.other);
		return template.replace(/\{(\w+)\}/g, (match, name: string) => {
			const value = vars[name];
			return value === undefined ? match : typeof value === 'number' ? number(value) : value;
		});
	};
	const date: I18n['date'] = (iso, { withTime = false, timeZone } = {}) =>
		iso
			? new Intl.DateTimeFormat(locales, {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
					...(timeZone ? { timeZone } : {})
				}).format(typeof iso === 'string' ? new Date(iso) : iso)
			: '';
	const created: I18n = { lang, informal, locales, m: messages(lang, informal), t, number, date };
	i18nCache.set(cacheKey, created);
	return created;
};

/** The I18n of an ORISO locale and the host's form of address. */
export const i18nFor = (locale: string | null | undefined, informal = false): I18n =>
	i18n(langOf(locale), informal || isInformalLocale(locale));

/** A text in every language, for what the host shows to others (notifications, calendar, audit). */
export const localized = (text: (i18n: I18n) => string): Record<Lang, string> =>
	Object.fromEntries(LANGS.map((lang) => [lang, text(i18n(lang))])) as Record<Lang, string>;
