import { describe, expect, it } from 'vitest';
import { i18n } from '../../shared/i18n/index.ts';
import { isStepId, STEP_IDS } from '../../shared/tools/goals.ts';
import { answerSchema, goals } from '../src/tools/goals/index.ts';

describe('goals', () => {
	it('has four questions, then the goal, as in the tool description', () => {
		expect(STEP_IDS).toEqual(['situation', 'factors', 'motivation', 'resources', 'goal']);
		const { steps } = i18n('de').m.goals;
		expect(STEP_IDS.slice(0, 4).map((id) => steps[id].title.slice(0, 12))).toEqual([
			'Frage 1 von ',
			'Frage 2 von ',
			'Frage 3 von ',
			'Frage 4 von '
		]);
	});

	it('addresses the client formally or informally', () => {
		expect(i18n('de', false).m.goals.start).toContain('Bitte beschreiben Sie');
		expect(i18n('de', true).m.goals.start).toContain('Bitte beschreibe');
		for (const step of Object.values(i18n('de', true).m.goals.steps)) {
			expect(step.title).not.toMatch(/\b(Sie|Ihre?|Ihnen)\b/);
			for (const line of step.hint) {
				expect(line).not.toMatch(/\b(Sie|Ihre?|Ihnen)\b/);
			}
		}
	});

	it('keeps known, non-empty text answers of bounded length', () => {
		expect(answerSchema.parse({ text: ' a ' })).toEqual({ text: 'a' });
		expect(answerSchema.safeParse({ text: ' ' }).success).toBe(false);
		expect(answerSchema.safeParse({ text: 5 }).success).toBe(false);
		expect(answerSchema.safeParse({ text: 'x'.repeat(4001) }).success).toBe(false);
		expect(isStepId('goal')).toBe(true);
		expect(isStepId('summary')).toBe(false);
	});

	const entry = (key: string) => ({
		id: key,
		kind: 'answer',
		key,
		day: null,
		data: { text: key },
		createdAt: '',
		updatedAt: ''
	});

	const calendarBase = { now: new Date('2026-11-20T09:00:00Z'), timeZone: 'Europe/Berlin' };

	it('reminds a released client a week after the release until shared or complete', () => {
		const releasedAt = '2026-11-01T10:00:00.000Z';
		expect(
			goals.calendar?.({ ...calendarBase, releasedAt, shared: false, entries: [entry('situation')] })
		).toEqual([
			expect.objectContaining({ kind: 'reminder', start: '2026-11-08T10:00:00.000Z', allDay: true })
		]);
		expect(goals.calendar?.({ ...calendarBase, releasedAt, shared: true, entries: [] })).toEqual([]);
		expect(
			goals.calendar?.({ ...calendarBase, releasedAt, shared: false, entries: STEP_IDS.map(entry) })
		).toEqual([]);
	});

	it('names the reminder in every language', () => {
		const [reminder] =
			goals.calendar?.({
				...calendarBase,
				releasedAt: '2026-11-01T10:00:00.000Z',
				shared: false,
				entries: []
			}) ?? [];
		expect(reminder?.title).toMatchObject({
			de: 'Ausgangssituation und Ziele ausfüllen',
			en: 'Fill in starting point and goals'
		});
	});
});
