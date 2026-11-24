import PDFDocument from 'pdfkit';
import { describe, expect, it, vi } from 'vitest';
import { i18n, LANGS } from '../../shared/i18n/index.ts';
import type { Entry } from '../../shared/api.ts';
import { renderPdf } from '../src/core/pdf.ts';
import { TOOLS } from '../src/tools/index.ts';

const entry = (kind: string, data: unknown, key: string | null = null): Entry => ({
	id: Math.random().toString(36),
	kind,
	key,
	day: null,
	data,
	createdAt: '2026-11-20T09:00:00.000Z',
	updatedAt: '2026-11-20T09:00:00.000Z'
});

const header = {
	toolTitle: 'Test',
	caseLabel: 'Fall 1',
	createdAt: new Date('2026-11-20T10:00:00Z'),
	period: '20.11.2026'
};

const SITUATION_ID = '00000000-0000-4000-8000-000000000001';

const SAMPLES: Record<string, Entry[]> = {
	'risk-situations': [
		{
			...entry('situation', { situation: 'Freitagabend', difficulty: 'hard', strategy: 'Nach Hause gehen' }),
			id: SITUATION_ID
		},
		entry('relapse', {
			situationId: SITUATION_ID,
			circumstances: 'Feier',
			feelings: 'Druck',
			mainReason: '',
			alternatives: '',
			previousStrategy: 'Nach Hause gehen',
			newStrategy: 'Vorher Bescheid sagen'
		})
	],
	'emergency-kit': [
		entry('motivation', { text: 'Frei sein', importance: 1 }),
		entry('trusted', { name: 'Anna' }),
		entry('relapse', { text: 'Ich gebe nicht auf!' })
	],
	goals: [
		entry('answer', { text: 'Ich trinke zu viel – und „zu oft“ 🙂' }, 'situation'),
		entry('answer', { text: 'Weniger' }, 'goal')
	],
	balance: [
		entry('argument', { category: 'A', text: 'Mehr Geld', rating: 3 }),
		entry('argument', { category: 'C', text: 'Ruhe', rating: 1 }),
		entry('conclusion', { text: 'Ich will es versuchen.' }, 'main')
	],
	'traffic-light': [
		entry('activity', { text: 'Ein Computerspiel spielen', level: 3 }),
		entry('activity', { text: 'E-Mails schreiben', level: 1 })
	],
	'positive-perception': [entry('behaviour', { text: 'Hat den Abwasch erledigt.' })],
	'relatives-diary': [
		{ ...entry('entry', { text: 'Ein Tag – mit Umlauten äöü', mood: 3 }, '2026-11-20'), day: '2026-11-20' }
	],
	'consumption-diary': [
		entry('topics', { topics: ['alcohol', 'media'] }, 'main'),
		{
			...entry('day-summary', { topic: 'alcohol', consumed: true, rating: 'Geht so' }, '2026-11-20_alcohol'),
			day: '2026-11-20'
		},
		{
			...entry('phase', {
				topic: 'alcohol',
				start: '19:00',
				items: [{ drink: 'beer', size: '0,5 l', count: 2 }]
			}),
			day: '2026-11-20'
		},
		{
			...entry('phase', { topic: 'media', items: [{ activity: 'chat', minutes: 75 }], device: 'Smartphone' }),
			day: '2026-11-21'
		}
	],
	active: [
		entry('activity', {
			title: 'Joggen',
			date: '2026-11-21',
			time: '07:00',
			repeat: 'weekly',
			companion: 'Marie'
		}),
		entry('activity', { title: 'Lesen', repeat: 'none' })
	]
};

describe('export', () => {
	it.each(TOOLS.map((tool) => [tool.id, tool] as const))(
		'renders %s, also without entries',
		async (id, tool) => {
			for (const entries of [SAMPLES[id] ?? [], []]) {
				const pdf = await renderPdf(header, 'Europe/Berlin', i18n('de'), (writer) =>
					tool.exportPdf(writer, { entries, options: {}, linked: {}, counsellors: [], i18n: i18n('de') })
				);
				expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
				expect(pdf.length).toBeGreaterThan(1000);
			}
		}
	);

	it('breaks long content onto further pages', async () => {
		const tool = TOOLS.find((candidate) => candidate.id === 'balance')!;
		const many = Array.from({ length: 150 }, (_, index) =>
			entry('argument', { category: 'B', text: `Argument ${index} `.repeat(8), rating: 2 })
		);
		const pdf = await renderPdf(header, 'Europe/Berlin', i18n('de'), (writer) =>
			tool.exportPdf(writer, { entries: many, options: {}, linked: {}, counsellors: [], i18n: i18n('de') })
		);
		expect((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length).toBeGreaterThan(3);
	});

	it.each(LANGS)('keeps the page number on one line next to the note in the footer (%s)', async (lang) => {
		const language = i18n(lang);
		const drawn: Array<{ text: string; x: number; y: number; width: number; fits: boolean }> = [];
		const original = PDFDocument.prototype.text;
		const spy = vi.spyOn(PDFDocument.prototype, 'text').mockImplementation(function (
			this: PDFKit.PDFDocument,
			...args: any[]
		) {
			const [text, x, y, options] = args;
			if (typeof x === 'number' && options?.width) {
				drawn.push({ text, x, y, width: options.width, fits: this.widthOfString(text) <= options.width });
			}
			return original.apply(this, args as never);
		});
		try {
			await renderPdf(header, 'Europe/Berlin', language, () => undefined);
		} finally {
			spy.mockRestore();
		}
		const pageNumber = drawn.find(
			(call) => call.text === language.t(language.m.pdf.page, { page: 1, pages: 1 })
		);
		const note = drawn.find((call) => call.text === language.m.pdf.confidential);
		expect(pageNumber?.fits).toBe(true);
		expect(note && pageNumber && note.x + note.width).toBeLessThan(pageNumber!.x);
		expect(note!.y).toBeLessThanOrEqual(pageNumber!.y);
	});
});
