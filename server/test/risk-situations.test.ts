import { describe, expect, it } from 'vitest';
import type { Entry } from '../../shared/api.ts';
import { i18n } from '../../shared/i18n/index.ts';
import { riskSituations } from '../src/tools/risk-situations/index.ts';
import { createWriter } from './pdfWriter.ts';

const entry = (id: string, kind: string, data: unknown, createdAt = '2026-11-20T09:00:00.000Z'): Entry => ({
	id,
	kind,
	key: null,
	day: null,
	data,
	createdAt,
	updatedAt: createdAt
});

const situation = entry('s1', 'situation', {
	situation: 'Party',
	difficulty: 'very-hard',
	strategy: 'Leave early'
});
const relapse = entry('r1', 'relapse', {
	situationId: 's1',
	circumstances: 'Birthday',
	feelings: '',
	mainReason: 'Pressure',
	alternatives: '',
	previousStrategy: 'Leave early',
	newStrategy: 'Stay at home'
});

const input = (lang: 'de' | 'en', params: Record<string, string> = {}) => ({
	entries: [situation, relapse],
	options: {},
	linked: {},
	counsellors: [],
	i18n: i18n(lang),
	params
});

describe('Risikosituationen und Kontrollstrategien in other languages', () => {
	it('writes the table in English', () => {
		const { writer, text } = createWriter();
		riskSituations.clientExports?.table?.write(writer, input('en'));
		expect(text()).toBe(
			'Risk situation | Rating | Control strategy | Relapse\nParty | very hard | Leave early | As of 20/11/2026'
		);
		expect(riskSituations.clientExports?.table?.title(i18n('en'))).toBe(
			'My risk situations and control strategies'
		);
	});

	it('keeps the German table and relapse analysis', () => {
		const table = createWriter();
		riskSituations.clientExports?.table?.write(table.writer, input('de'));
		expect(table.text()).toBe(
			'Risikosituation | Bewertung | Kontrollstrategie | Rückfall\nParty | sehr schwer | Leave early | Stand 20.11.2026'
		);
		const analysis = createWriter();
		riskSituations.clientExports?.relapse?.write(analysis.writer, input('de', { id: 'r1' }));
		expect(analysis.text()).toContain('Analyse vom 20.11.2026\nUmstände und Begleiterscheinungen: Birthday');
		expect(analysis.text()).toContain('Gefühle und Gedanken: Keine Angabe');
		expect(riskSituations.clientExports?.relapse?.title(i18n('de'))).toBe('Rückfall analysieren');
	});

	it('writes the relapse analysis and the counsellor export in English', () => {
		const analysis = createWriter();
		riskSituations.clientExports?.relapse?.write(analysis.writer, input('en', { id: 'r1' }));
		expect(analysis.text()).toBe(
			[
				'My risk situation: Party',
				'Analysis from 20/11/2026',
				'Circumstances and surroundings: Birthday',
				'Feelings and thoughts: No answer',
				'Main reason: Pressure',
				'Alternatives: No answer',
				'Previous control strategy: Leave early',
				'New control strategy: Stay at home'
			].join('\n')
		);
		const gone = createWriter();
		riskSituations.clientExports?.relapse?.write(gone.writer, input('en', { id: 'gone' }));
		expect(gone.text()).toBe('This analysis no longer exists.');
		const counsellor = createWriter();
		riskSituations.exportPdf(counsellor.writer, input('en'));
		expect(counsellor.text()).toContain('# Risk situations and control strategies');
		expect(counsellor.text()).toContain('# Relapses: Party\n## Analysis from 20/11/2026');
	});

	it('seeds the demo in the counsellor’s language', () => {
		const [first] = riskSituations.demo?.(i18n('en')) ?? [];
		expect(first).toEqual({
			kind: 'situation',
			data: {
				situation: 'Friday evening after work, when my colleagues go out for a drink.',
				strategy: 'I arrange to do sport beforehand and go straight home.',
				difficulty: 'hard'
			}
		});
		expect(riskSituations.demo?.(i18n('de'))[1]?.data).toMatchObject({ difficulty: 'medium' });
	});
});
