import { describe, expect, it } from 'vitest';
import type { Entry } from '../../shared/api.ts';
import { emptySections, isPrinted, selfHelpRequest } from '../../shared/tools/emergency-kit.ts';
import { relapsesOf, situationsOf } from '../../shared/tools/risk-situations.ts';
import { renderPdf } from '../src/core/pdf.ts';
import { createWriter } from './pdfWriter.ts';
import { cardsOf, emergencyKit, motivationSchema } from '../src/tools/emergency-kit/index.ts';
import { relapseSchema, riskSituations, situationSchema } from '../src/tools/risk-situations/index.ts';

let counter = 0;
const entry = (
	kind: string,
	data: unknown,
	key: string | null = null,
	createdAt = '2026-11-20T09:00:00.000Z'
): Entry => ({
	id: `00000000-0000-4000-8000-${String((counter += 1)).padStart(12, '0')}`,
	kind,
	key,
	day: null,
	data,
	createdAt,
	updatedAt: createdAt
});

const pdfText = async (write: Parameters<typeof renderPdf>[2], bare = false) =>
	(
		await renderPdf(
			{ toolTitle: 'Test', createdAt: new Date('2026-11-20T10:00:00Z'), bare },
			'Europe/Berlin',
			write
		)
	).subarray(0, 5);

describe('Risikosituationen und Kontrollstrategien', () => {
	it('needs a situation and one of the four difficulties', () => {
		expect(situationSchema.safeParse({ situation: ' ', difficulty: 'easy', strategy: '' }).success).toBe(
			false
		);
		expect(
			situationSchema.safeParse({ situation: 'Feier', difficulty: 'extreme', strategy: '' }).success
		).toBe(false);
		expect(situationSchema.parse({ situation: ' Feier ', difficulty: 'very-hard', strategy: '' })).toEqual({
			situation: 'Feier',
			difficulty: 'very-hard',
			strategy: ''
		});
	});

	it('keeps relapses per situation, newest first', () => {
		const situation = entry('situation', { situation: 'Feier', difficulty: 'hard', strategy: 'Gehen' });
		const relapse = (createdAt: string) =>
			entry(
				'relapse',
				relapseSchema.parse({
					situationId: situation.id,
					circumstances: 'a',
					feelings: '',
					mainReason: '',
					alternatives: '',
					previousStrategy: 'Gehen',
					newStrategy: 'Früher gehen'
				}),
				null,
				createdAt
			);
		const entries = [situation, relapse('2026-11-01T10:00:00Z'), relapse('2026-11-10T10:00:00Z')];
		expect(situationsOf(entries).map((item) => item.situation)).toEqual(['Feier']);
		expect(relapsesOf(entries, situation.id).map((item) => item.entry.createdAt)).toEqual([
			'2026-11-10T10:00:00Z',
			'2026-11-01T10:00:00Z'
		]);
		expect(relapsesOf(entries, 'other')).toEqual([]);
	});

	it('renders the table and one relapse analysis for the client', async () => {
		const situation = entry('situation', { situation: 'Feier', difficulty: 'hard', strategy: 'Gehen' });
		const relapse = entry('relapse', {
			situationId: situation.id,
			circumstances: 'Geburtstag',
			feelings: '',
			mainReason: '',
			alternatives: '',
			previousStrategy: '',
			newStrategy: ''
		});
		const input = { entries: [situation, relapse], options: {}, linked: {}, counsellors: [] };
		for (const [name, params] of [
			['table', {}],
			['relapse', { id: relapse.id }],
			['relapse', { id: 'gone' }]
		] as const) {
			const format = riskSituations.clientExports?.[name];
			expect(await pdfText((pdf) => format?.write(pdf, { ...input, params }))).toEqual(Buffer.from('%PDF-'));
		}
	});
});

describe('Notfallkoffer', () => {
	it('asks how important a motivation is (1 or 2)', () => {
		expect(motivationSchema.safeParse({ text: 'Frei sein' }).success).toBe(false);
		expect(motivationSchema.safeParse({ text: 'Frei sein', importance: 3 }).success).toBe(false);
		expect(motivationSchema.parse({ text: 'Frei sein', importance: 1 })).toEqual({
			text: 'Frei sein',
			importance: 1
		});
	});

	it('takes over the risk situations for printing unless the client says no', () => {
		const kept = entry('risk-print', { print: true }, 'a');
		const dropped = entry('risk-print', { print: false }, 'b');
		expect(isPrinted([kept, dropped], 'a')).toBe(true);
		expect(isPrinted([kept, dropped], 'b')).toBe(false);
		expect(isPrinted([], 'c')).toBe(true);
	});

	it('names the empty sections before the PDF, section 6 only when the exercise is released', () => {
		const filled = [entry('motivation', { text: 'x', importance: 1 }), entry('trusted', { name: 'Anna' })];
		expect(emptySections(filled, '', undefined)).toEqual(['strategy', 'critical', 'craving', 'relapse']);
		expect(emptySections(filled, '', [])).toContain('risks');
	});

	it('words the self-help request without tool content', () => {
		const { title, text } = selfHelpRequest('Testuser_02');
		expect(title.de).toBe('Selbsthilfegruppe angefragt');
		expect(text.de).toMatch(/^Testuser_02 möchte eine Selbsthilfegruppe empfohlen bekommen\./);
		expect(emergencyKit.kinds.request?.announce).toBe(selfHelpRequest);
	});

	it('renders the whole kit and the business cards', async () => {
		const situation = entry('situation', { situation: 'Feier', difficulty: 'hard', strategy: 'Gehen' });
		const input = {
			entries: [
				entry('motivation', { text: 'Frei sein', importance: 1 }),
				entry('craving', { text: 'STOP!' }),
				entry('trusted', { name: 'Anna' }),
				entry('self-help', { text: 'Gruppe am Montag' }, 'main'),
				entry('request', { requested: true }, 'self-help-group'),
				entry('other-strategies', { text: 'Atmen' }, 'main')
			],
			options: { agency: 'Suchtberatung\nMusterstraße 1' },
			linked: { 'risk-situations': [situation] },
			counsellors: ['Maria Beispiel'],
			params: {}
		};
		const unrated = entry('situation', { situation: 'Streit', strategy: 'Spazieren' });
		const kit = createWriter();
		emergencyKit.clientExports?.kit?.write(kit.writer, {
			...input,
			linked: { 'risk-situations': [situation, unrated] }
		});
		expect(kit.text()).toContain(
			'Risikosituation | Bewertung | Kontrollstrategie\nFeier | schwer | Gehen\nStreit |  | Spazieren'
		);
		const card = cardsOf({ ...input, linked: { 'risk-situations': [situation, unrated] } }).find(
			(candidate) => candidate.title === 'Risikosituationen & Strategien'
		);
		expect(card?.lines).toEqual(['Feier (Bewertung: schwer): Gehen', 'Streit: Spazieren', 'Atmen']);
		expect(await pdfText((pdf) => emergencyKit.clientExports?.kit?.write(pdf, input))).toEqual(
			Buffer.from('%PDF-')
		);
		expect(await pdfText((pdf) => emergencyKit.clientExports?.card?.write(pdf, input), true)).toEqual(
			Buffer.from('%PDF-')
		);
		expect(
			await pdfText(
				(pdf) => emergencyKit.clientExports?.card?.write(pdf, { ...input, entries: [], linked: {} }),
				true
			)
		).toEqual(Buffer.from('%PDF-'));
	});
});
