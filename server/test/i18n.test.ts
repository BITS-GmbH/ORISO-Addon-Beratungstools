import { describe, expect, it } from 'vitest';
import { de } from '../../shared/i18n/de.ts';
import {
	CATALOGUES,
	i18n,
	i18nFor,
	intlLocales,
	isPlural,
	LANGS,
	langOf,
	localized
} from '../../shared/i18n/index.ts';

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const isFormality = (value: unknown): value is { formal: unknown; informal: unknown } =>
	isRecord(value) && Object.keys(value).length === 2 && 'formal' in value && 'informal' in value;

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

const textsOf = (value: unknown): string[] =>
	typeof value === 'string' ? [value] : isPlural(value) ? Object.values(value) : [];

/** Plural forms a language uses for whole numbers. */
const pluralForms = (lang: string) => {
	const rules = new Intl.PluralRules(intlLocales(lang as never));
	return [...new Set(Array.from({ length: 200 }, (_, n) => rules.select(n)))];
};

/** Everything a translation lacks or gets wrong compared with the German source. */
const problemsOf = (lang: string, source: unknown, target: unknown, path: string): string[] => {
	const shape = isFormality(source) ? source.formal : source;
	if (typeof shape === 'string' || isPlural(shape)) {
		const expected = [...new Set(textsOf(shape).flatMap(placeholders))].sort();
		if (target === undefined) {
			return [`${path}: missing`];
		}
		if (
			typeof shape === 'string' ? typeof target !== 'string' : !isPlural(target) && typeof target !== 'string'
		) {
			return [`${path}: should be ${typeof shape === 'string' ? 'a text' : 'a plural'}`];
		}
		const problems: string[] = [];
		if (isPlural(target)) {
			const absent = pluralForms(lang).filter((form) => !(form in target));
			if (absent.length > 0) {
				problems.push(`${path}: plural forms missing: ${absent.join(', ')}`);
			}
		}
		for (const text of textsOf(target)) {
			const used = placeholders(text).filter((name) => name !== 'count' || expected.includes('count'));
			const unknown = used.filter((name) => !expected.includes(name));
			if (unknown.length > 0) {
				problems.push(`${path}: unknown placeholders ${unknown.map((name) => `{${name}}`).join(', ')}`);
			}
		}
		return problems;
	}
	if (Array.isArray(shape)) {
		if (!Array.isArray(target)) {
			return [`${path}: missing`];
		}
		if (target.length !== shape.length) {
			return [`${path}: ${target.length} items instead of ${shape.length}`];
		}
		return shape.flatMap((item, index) => problemsOf(lang, item, target[index], `${path}[${index}]`));
	}
	if (isRecord(shape)) {
		if (!isRecord(target)) {
			return [`${path}: missing`];
		}
		return Object.entries(shape).flatMap(([key, value]) =>
			problemsOf(lang, value, target[key], path ? `${path}.${key}` : key)
		);
	}
	return [];
};

const formalityProblems = (value: unknown, path: string): string[] => {
	if (isFormality(value)) {
		const formal = textsOf(value.formal).flatMap(placeholders).sort().join();
		const informal = textsOf(value.informal).flatMap(placeholders).sort().join();
		return formal === informal ? [] : [`${path}: formal and informal use different placeholders`];
	}
	if (Array.isArray(value)) {
		return value.flatMap((item, index) => formalityProblems(item, `${path}[${index}]`));
	}
	if (isRecord(value) && !isPlural(value)) {
		return Object.entries(value).flatMap(([key, item]) =>
			formalityProblems(item, path ? `${path}.${key}` : key)
		);
	}
	return [];
};

const allTexts = (value: unknown): string[] =>
	typeof value === 'string'
		? [value]
		: Array.isArray(value)
			? value.flatMap(allTexts)
			: isRecord(value)
				? Object.values(value).flatMap(allTexts)
				: [];

describe('catalogues', () => {
	it('use the same placeholders in the formal and informal German texts', () => {
		expect(formalityProblems(de, '')).toEqual([]);
	});

	for (const lang of LANGS.filter((lang) => lang !== 'de')) {
		it(`${lang} has every key of the German source, with its placeholders and plural forms`, () => {
			expect(problemsOf(lang, de, CATALOGUES[lang], '')).toEqual([]);
		});
	}

	for (const lang of LANGS) {
		it(`${lang} has no em dashes`, () => {
			expect(allTexts(CATALOGUES[lang]).filter((text) => text.includes(String.fromCharCode(0x2014)))).toEqual(
				[]
			);
		});
	}
});

describe('i18n', () => {
	it('maps ORISO locales to a language and falls back to German', () => {
		expect(langOf('de@informal')).toBe('de');
		expect(langOf('en')).toBe('en');
		expect(langOf('tr-TR')).toBe('tr');
		expect(langOf('ar')).toBe('de');
		expect(langOf(undefined)).toBe('de');
		expect(i18nFor('de@informal').informal).toBe(true);
	});

	it('picks the form of address in German only', () => {
		expect(i18n('de', false).m.client.loadError).toBe('Ihre Tools konnten nicht geladen werden.');
		expect(i18n('de', true).m.client.loadError).toBe('Deine Tools konnten nicht geladen werden.');
		expect(i18n('en', true).m.client.loadError).toBe('Your tools could not be loaded.');
	});

	it('fills placeholders and picks plural forms by count', () => {
		const { m, t } = i18n('de');
		expect(t(m.counsellor.newEntries, { count: 1 })).toBe('1 neuer Eintrag');
		expect(t(m.counsellor.newEntries, { count: 3 })).toBe('3 neue Einträge');
		expect(t(m.toolPage.loadError, { title: 'Ampelmodell' })).toBe(
			'„Ampelmodell“ konnte nicht geladen werden.'
		);
		expect(i18n('en').t(i18n('en').m.counsellor.newEntries, { count: 2 })).toBe('2 new entries');
	});

	it('falls back to English, then German, for keys a language does not have yet', () => {
		const fr = CATALOGUES.fr as { client?: { myTools?: string } };
		const expected = fr.client?.myTools ?? 'My tools';
		expect(i18n('fr').m.client.myTools).toBe(expected);
	});

	it('gives texts for the host in every language', () => {
		const texts = localized(({ m }) => m.manifest.title);
		expect(Object.keys(texts)).toEqual([...LANGS]);
		expect(texts.de).toBe('Tools');
	});
});
