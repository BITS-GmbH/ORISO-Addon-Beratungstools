import { describe, expect, it } from 'vitest';
import type { Entry } from '../../shared/api.ts';
import { i18n } from '../../shared/i18n/index.ts';
import { selfHelpRequest } from '../../shared/tools/emergency-kit.ts';
import { cardsOf, emergencyKit, layoutCards } from '../src/tools/emergency-kit/index.ts';
import { createWriter } from './pdfWriter.ts';

let counter = 0;
const entry = (kind: string, data: unknown, key: string | null = null): Entry => ({
	id: `00000000-0000-4000-9000-${String((counter += 1)).padStart(12, '0')}`,
	kind,
	key,
	day: null,
	data,
	createdAt: '2026-11-20T09:00:00.000Z',
	updatedAt: '2026-11-20T09:00:00.000Z'
});

const situation = entry('situation', {
	situation: 'Party',
	difficulty: 'very-hard',
	strategy: 'Leave early'
});

const input = (lang: 'de' | 'en') => ({
	entries: [
		entry('motivation', { text: 'Being free', importance: 1 }),
		entry('trusted', { name: 'Anna' }),
		entry('self-help', { text: 'Monday group' }, 'main'),
		entry('request', { requested: true }, 'self-help-group')
	],
	options: { agency: '' },
	linked: { 'risk-situations': [situation] },
	counsellors: ['Maria Beispiel'],
	i18n: i18n(lang),
	params: {}
});

describe('Notfallkoffer in other languages', () => {
	it('writes the whole kit in English', () => {
		const { writer, text } = createWriter();
		emergencyKit.clientExports?.kit?.write(writer, input('en'));
		const pdf = text();
		expect(pdf).toContain('# 1. My motivation: why I am sticking with it');
		expect(pdf).toContain('- Being free (very important)');
		expect(pdf).toContain('# 3. This is where I get support');
		expect(pdf).toContain('My counselling service: The contact details of your counselling service');
		expect(pdf).toContain('Recommendation of a self-help group requested on 20/11/2026.');
		expect(pdf).toContain('Risk situation | Rating | Control strategy\nParty | very hard | Leave early');
		expect(pdf).toContain('# 7. Relapse: what to do?\n## This is what I do if I relapse:\nNo entries.');
		expect(pdf).not.toMatch(/[äöüß]|Keine|Meine/);
		expect(emergencyKit.clientExports?.kit?.title(i18n('en'))).toBe('My emergency kit');
		expect(emergencyKit.clientExports?.card?.title(i18n('de'))).toBe('Mein Notfallkoffer');
	});

	it('keeps the German kit as before', () => {
		const { writer, text } = createWriter();
		emergencyKit.clientExports?.kit?.write(writer, input('de'));
		expect(text()).toContain('Empfehlung einer Selbsthilfegruppe angefragt am 20.11.2026.');
		expect(text()).toContain('- Being free (sehr wichtig)');
	});

	it('titles the business cards in English', () => {
		const cards = cardsOf(input('en'));
		expect(cards.map((card) => card.title)).toEqual([
			'This is where I get support',
			'Why I am sticking with it',
			'Risk situations and strategies'
		]);
		expect(cards[0]?.lines).toEqual(['Anna', 'Counselling: Maria Beispiel', 'Self-help group: Monday group']);
		expect(cards[2]?.lines).toEqual(['Party (rating: very hard): Leave early']);
		const { writer, text } = createWriter();
		emergencyKit.clientExports?.card?.write(writer, {
			...input('en'),
			entries: [],
			linked: {},
			counsellors: []
		});
		expect(text()).toBe(
			'## My emergency kit in business card format\nCut along the solid line and fold along the dashed line: each strip becomes one card with a front and a back.\nNo entries yet.'
		);
	});

	it('asks the counsellors for a self-help group in every language', () => {
		const named = selfHelpRequest('Testuser_02');
		expect(named.title).toMatchObject({ de: 'Selbsthilfegruppe angefragt', en: 'Self-help group requested' });
		expect(named.text.en).toMatch(/^Testuser_02 would like a self-help group to be recommended to them\./);
		expect(named.text.en).toContain('Please give Testuser_02 suitable details');
		const unnamed = selfHelpRequest('');
		expect(unnamed.text.de).toMatch(/^Eine ratsuchende Person möchte .* Bitte nennen Sie der Person /);
		expect(unnamed.text.en).toMatch(/^A client would like/);
	});

	it('seeds the demo in the counsellor’s language', () => {
		const english = emergencyKit.demo?.(i18n('en')) ?? [];
		expect(english).toContainEqual({ kind: 'trusted', data: { name: 'Anna (sister)' } });
		expect(english).toContainEqual({
			kind: 'motivation',
			data: { text: 'Finally being free again', importance: 1 }
		});
		expect(emergencyKit.demo?.(i18n('de'))).toContainEqual({
			kind: 'relapse',
			data: { text: 'Ich gebe nicht auf!' }
		});
	});

	it('continues a section on further card sides instead of cutting it', () => {
		const lines = (n: number, word: string) => Array.from({ length: n }, (_, i) => `${word} ${i + 1}`);
		const sides = layoutCards(
			[
				{ title: 'Bei Suchtdruck', lines: lines(5, 'Befehl') },
				{ title: 'Bei einem Rückfall', lines: lines(2, 'Schritt') }
			],
			(_, kind) => (kind === 'title' ? 12 : 10),
			(title) => `${title} (Fortsetzung)`,
			50
		);
		expect(sides).toEqual([
			[{ title: 'Bei Suchtdruck', lines: ['Befehl 1', 'Befehl 2', 'Befehl 3'] }],
			[{ title: 'Bei Suchtdruck (Fortsetzung)', lines: ['Befehl 4', 'Befehl 5'] }],
			[{ title: 'Bei einem Rückfall', lines: ['Schritt 1', 'Schritt 2'] }]
		]);
	});
});
