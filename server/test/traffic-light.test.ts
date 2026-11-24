import { describe, expect, it } from 'vitest';
import { i18n } from '../../shared/i18n/index.ts';
import { levelLabel } from '../../shared/tools/traffic-light.ts';
import { trafficLight, activitySchema } from '../src/tools/traffic-light/index.ts';
import { createWriter } from './pdfWriter.ts';

const exportText = (lang: 'de' | 'en', entries: Array<{ kind: string; data: unknown }>) => {
	const { writer, text } = createWriter();
	const drawn: string[] = [];
	const doc = new Proxy(
		{},
		{
			get: (_, name) =>
				name === 'text'
					? (line: string) => {
							drawn.push(`# ${line}`);
							return doc;
						}
					: () => doc
		}
	) as PDFKit.PDFDocument;
	trafficLight.exportPdf({ ...writer, drawing: (_, draw) => draw(doc, { x: 0, y: 0, width: 100 }) }, {
		entries,
		options: {},
		linked: {},
		counsellors: {},
		i18n: i18n(lang)
	} as never);
	return [...drawn, text()].filter(Boolean).join('\n');
};

describe('Ampelmodell input', () => {
	it('keeps the activity and its danger level, trimmed', () => {
		expect(activitySchema.parse({ text: '  Instagram ', level: 2, extra: true })).toEqual({
			text: 'Instagram',
			level: 2
		});
	});

	it.each([
		{ text: 'x', level: 0 },
		{ text: 'x', level: 4 },
		{ text: 'x', level: '3' },
		{ text: 'x' },
		{ text: '  ', level: 1 },
		{ text: 'x'.repeat(201), level: 1 }
	])('rejects %o', (activity) => {
		expect(activitySchema.safeParse(activity).success).toBe(false);
	});

	it('codes red, yellow and green as 3, 2 and 1', () => {
		expect([3, 2, 1].map((level) => levelLabel(i18n('de'), level as 3 | 2 | 1))).toEqual([
			'Rot: große Gefahr',
			'Gelb: mögliche Gefahr',
			'Grün: keine Gefahr'
		]);
	});

	it('names the levels in English', () => {
		expect(levelLabel(i18n('en'), 3)).toBe('Red: great danger');
	});

	it('seeds valid demo activities in the counsellor’s language', () => {
		for (const seed of trafficLight.demo?.(i18n('de')) ?? []) {
			expect(trafficLight.kinds[seed.kind]?.schema.safeParse(seed.data).success).toBe(true);
		}
		expect(trafficLight.demo?.(i18n('de')).map((seed) => seed.data)).toEqual([
			{ text: 'Ein Computerspiel spielen', level: 3 },
			{ text: 'Instagram', level: 2 },
			{ text: 'E-Mails schreiben', level: 1 }
		]);
		expect(trafficLight.demo?.(i18n('en'))[0]?.data).toEqual({ text: 'Playing a computer game', level: 3 });
	});
});

describe('Ampelmodell export', () => {
	const entries = [{ kind: 'activity', data: { text: 'Instagram', level: 2 } }];

	it('writes the levels with their activities in German', () => {
		const text = exportText('de', entries);
		expect(text).toContain('# Gelb: mögliche Gefahr (1 Aktivität)');
		expect(text).toContain('# Rot: große Gefahr (0 Aktivitäten)');
		expect(text).toContain('- Instagram');
		expect(text).toContain('Keine Aktivitäten.');
		expect(exportText('de', [])).toBe('Noch keine Aktivitäten eingetragen.');
	});

	it('writes the export in English', () => {
		const text = exportText('en', entries);
		expect(text).toContain('# Red: great danger (0 activities)');
		expect(text).toContain('# Yellow: possible danger (1 activity)');
		expect(text).toContain('No activities.');
		expect(exportText('en', [])).toContain('No activities entered yet.');
	});
});
