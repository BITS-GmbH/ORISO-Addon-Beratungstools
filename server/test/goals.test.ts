import { describe, expect, it } from 'vitest';
import { answerSchema, isStepId, STEP_IDS, STEPS, startMessage } from '../../shared/tools/goals.ts';
import { goals } from '../src/tools/goals.ts';

describe('goals', () => {
	it('has four questions, then the goal, as in the tool description', () => {
		expect(STEP_IDS).toEqual(['situation', 'factors', 'motivation', 'resources', 'goal']);
		expect(STEPS.slice(0, 4).map((step) => step.title(false).slice(0, 12))).toEqual([
			'Frage 1 von ',
			'Frage 2 von ',
			'Frage 3 von ',
			'Frage 4 von '
		]);
	});

	it('addresses the client formally or informally', () => {
		expect(startMessage(false)).toContain('Bitte beschreiben Sie');
		expect(startMessage(true)).toContain('Bitte beschreibe');
		for (const step of STEPS) {
			expect(step.title(true)).not.toMatch(/\b(Sie|Ihre?|Ihnen)\b/);
			for (const line of step.hint(true)) {
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

	it('reminds a released client a week after the release until shared or complete', () => {
		const releasedAt = '2026-11-01T10:00:00.000Z';
		expect(goals.calendar?.({ releasedAt, shared: false, entries: [entry('situation')] })).toEqual([
			expect.objectContaining({ kind: 'reminder', start: '2026-11-08T10:00:00.000Z', allDay: true })
		]);
		expect(goals.calendar?.({ releasedAt, shared: true, entries: [] })).toEqual([]);
		expect(goals.calendar?.({ releasedAt, shared: false, entries: STEP_IDS.map(entry) })).toEqual([]);
	});
});
