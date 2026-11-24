import { describe, expect, it } from 'vitest';
import { i18n } from '../../shared/i18n/index.ts';
import { nextOccurrence, occurrenceDays, occurrencesBetween } from '../../shared/activities.ts';
import { nextLabel, SUGGESTIONS, toIcs } from '../../shared/tools/active.ts';
import { active, activitySchema, zonedIso } from '../src/tools/active/index.ts';
import { createWriter } from './pdfWriter.ts';

const entry = (id: string, data: unknown) => ({
	id,
	kind: 'activity',
	key: null,
	day: null,
	data,
	createdAt: '',
	updatedAt: ''
});

describe('active', () => {
	it('accepts activities with and without a date and drops empty fields', () => {
		expect(activitySchema.parse({ title: ' Joggen ', date: '', time: '', companion: ' ' })).toEqual({
			title: 'Joggen',
			repeat: 'none'
		});
		expect(
			activitySchema.parse({
				title: 'Kino',
				date: '2026-11-24',
				time: '20:00',
				repeat: 'custom',
				dates: ['2026-12-01', '2026-11-24', '2026-12-01'],
				companion: 'Peter'
			})
		).toEqual({
			title: 'Kino',
			date: '2026-11-24',
			time: '20:00',
			repeat: 'custom',
			dates: ['2026-12-01'],
			companion: 'Peter'
		});
		expect(
			activitySchema.parse({ title: 'Lesen', date: '2026-11-24', repeat: 'weekly', dates: ['2026-12-01'] })
		).toEqual({ title: 'Lesen', date: '2026-11-24', repeat: 'weekly' });
	});

	it('rejects a repetition or time without a date and invalid values', () => {
		expect(activitySchema.safeParse({ title: 'x', repeat: 'daily' }).success).toBe(false);
		expect(activitySchema.safeParse({ title: 'x', time: '10:00' }).success).toBe(false);
		expect(activitySchema.safeParse({ title: ' ' }).success).toBe(false);
		expect(activitySchema.safeParse({ title: 'x', date: '2026-02-30' }).success).toBe(false);
		expect(activitySchema.safeParse({ title: 'x', date: '2026-11-24', time: '24:00' }).success).toBe(false);
	});

	it('expands repetitions into the days of a period', () => {
		const weekly = { title: 'Sport', date: '2026-11-03', repeat: 'weekly' as const };
		expect(occurrenceDays(weekly, '2026-11-16', '2026-11-30')).toEqual(['2026-11-17', '2026-11-24']);
		expect(occurrenceDays({ ...weekly, repeat: 'daily' }, '2026-11-01', '2026-11-04')).toEqual([
			'2026-11-03',
			'2026-11-04'
		]);
		expect(occurrenceDays({ ...weekly, repeat: 'none' }, '2026-11-04', '2026-11-30')).toEqual([]);
		expect(
			occurrenceDays(
				{ ...weekly, repeat: 'custom', dates: ['2026-11-20', '2026-12-24'] },
				'2026-11-01',
				'2026-11-30'
			)
		).toEqual(['2026-11-03', '2026-11-20']);
		expect(occurrenceDays({ title: 'Lesen', repeat: 'none' }, '2026-11-01', '2026-11-30')).toEqual([]);
	});

	it('names the next date', () => {
		const weekly = { title: 'Sport', date: '2026-11-03', time: '18:00', repeat: 'weekly' as const };
		expect(nextOccurrence(weekly, '2026-11-20')).toBe('2026-11-24');
		expect(nextLabel(weekly, '2026-11-20')).toBe('Dienstag, 24.11.2026, 18:00 Uhr');
		expect(nextLabel({ ...weekly, repeat: 'none' }, '2026-11-20')).toBe('kein weiterer Termin');
		expect(nextLabel({ ...weekly, date: '2027-01-05', repeat: 'none' }, '2026-11-20')).toBe(
			'Dienstag, 05.01.2027, 18:00 Uhr'
		);
		expect(nextLabel({ title: 'Lesen', repeat: 'none' }, '2026-11-20')).toBe('kein Termin');
	});

	it('lists the occurrences of a week in order, for the diaries', () => {
		const entries = [
			entry('a', { title: 'Kino', date: '2026-11-19', time: '20:00', repeat: 'none' }),
			entry('b', { title: 'Laufen', date: '2026-11-10', time: '07:00', repeat: 'weekly' }),
			entry('c', { title: 'Lesen', repeat: 'none' })
		];
		expect(
			occurrencesBetween(entries, '2026-11-16', '2026-11-22').map((o) => [o.day, o.activity.title])
		).toEqual([
			['2026-11-17', 'Laufen'],
			['2026-11-19', 'Kino']
		]);
	});

	it('writes an iCalendar file with repetitions', () => {
		const ics = toIcs(
			[
				{
					id: 'a',
					data: {
						title: 'Kino, mit Popcorn',
						date: '2026-11-24',
						time: '20:00',
						repeat: 'none',
						companion: 'Peter'
					}
				},
				{ id: 'b', data: { title: 'Laufen', date: '2026-11-25', repeat: 'weekly' } },
				{ id: 'c', data: { title: 'Lesen', repeat: 'none' } },
				{
					id: 'd',
					data: { title: 'Kurs', date: '2026-11-26', time: '09:30', repeat: 'custom', dates: ['2026-12-03'] }
				}
			],
			new Date('2026-11-20T09:00:00Z')
		);
		const lines = ics.split('\r\n');
		expect(lines[0]).toBe('BEGIN:VCALENDAR');
		expect(lines.filter((line) => line === 'BEGIN:VEVENT')).toHaveLength(3);
		expect(lines).toContain('DTSTART:20261124T200000');
		expect(lines).toContain('SUMMARY:Kino\\, mit Popcorn');
		expect(lines).toContain('DESCRIPTION:Begleitung: Peter');
		expect(lines).toContain('DTSTART;VALUE=DATE:20261125');
		expect(lines).toContain('RRULE:FREQ=WEEKLY');
		expect(lines).toContain('RDATE:20261203T093000');
		expect(lines).toContain('DTSTAMP:20261120T090000Z');
		expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
	});

	it('folds long lines', () => {
		const ics = toIcs(
			[{ id: 'a', data: { title: 'ä'.repeat(60), date: '2026-11-24', repeat: 'none' } }],
			new Date()
		);
		for (const line of ics.split('\r\n')) {
			expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
		}
	});

	it('converts local times to instants', () => {
		expect(zonedIso('2026-11-24', '20:00', 'Europe/Berlin')).toBe('2026-11-24T19:00:00.000Z');
		expect(zonedIso('2026-07-01', '08:30', 'Europe/Berlin')).toBe('2026-07-01T06:30:00.000Z');
	});

	it('puts the coming occurrences into the client calendar', () => {
		const result = active.calendar?.({
			releasedAt: '2026-11-01T00:00:00Z',
			shared: false,
			now: new Date('2026-11-20T09:00:00Z'),
			timeZone: 'Europe/Berlin',
			entries: [
				entry('a', { title: 'Kino', date: '2026-11-24', time: '20:00', repeat: 'none' }),
				entry('b', { title: 'Laufen', date: '2026-11-01', repeat: 'weekly' }),
				entry('c', { title: 'Lesen', repeat: 'none' })
			]
		});
		expect(result?.find((e) => e.id === 'active-a-2026-11-24')).toEqual({
			id: 'active-a-2026-11-24',
			kind: 'reminder',
			title: { de: 'Kino' },
			start: '2026-11-24T19:00:00.000Z',
			allDay: false
		});
		const runs = result?.filter((e) => e.id.startsWith('active-b-')) ?? [];
		expect(runs[0]?.start).toBe('2026-11-15T00:00:00.000Z');
		expect(runs.every((e) => e.allDay)).toBe(true);
		expect(result?.some((e) => e.id.startsWith('active-c'))).toBe(false);
	});

	it('has the suggestions of the tool description, without duplicates', () => {
		expect(SUGGESTIONS.map((c) => c.title)).toEqual([
			'Aktiv und sportlich',
			'Entspannung',
			'Inspiration',
			'Genuss',
			'Kreativ'
		]);
		for (const category of SUGGESTIONS) {
			expect(new Set(category.items).size).toBe(category.items.length);
		}
	});

	it('exports the activities and seeds a valid demo', () => {
		const demo = active.demo?.(i18n('de')) ?? [];
		expect(demo.length).toBeGreaterThan(0);
		for (const seed of demo) {
			expect(activitySchema.safeParse(seed.data).success).toBe(true);
		}
		const { writer, text } = createWriter();
		active.exportPdf(writer, {
			entries: demo.map((seed, i) => entry(String(i), seed.data)),
			options: {},
			linked: {},
			counsellors: [],
			i18n: i18n('de')
		});
		expect(text()).toContain('Ins Kino gehen');
		expect(text()).toContain('Begleitung: Peter, Marie');
	});
});
