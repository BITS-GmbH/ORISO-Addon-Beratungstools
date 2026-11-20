import { describe, expect, it } from 'vitest';
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

const SAMPLES: Record<string, Entry[]> = {
	goals: [
		entry('answer', { text: 'Ich trinke zu viel – und „zu oft“ 🙂' }, 'situation'),
		entry('answer', { text: 'Weniger' }, 'goal')
	],
	balance: [
		entry('argument', { category: 'A', text: 'Mehr Geld', rating: 3 }),
		entry('argument', { category: 'C', text: 'Ruhe', rating: 1 }),
		entry('conclusion', { text: 'Ich will es versuchen.' }, 'main')
	]
};

describe('export', () => {
	it.each(TOOLS.map((tool) => [tool.id, tool] as const))(
		'renders %s, also without entries',
		async (id, tool) => {
			for (const entries of [SAMPLES[id] ?? [], []]) {
				const pdf = await renderPdf(header, 'Europe/Berlin', (writer) =>
					tool.exportPdf(writer, { entries, options: {} })
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
		const pdf = await renderPdf(header, 'Europe/Berlin', (writer) =>
			tool.exportPdf(writer, { entries: many, options: {} })
		);
		expect((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length).toBeGreaterThan(3);
	});
});
