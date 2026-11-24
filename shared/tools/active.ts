import { nextOccurrence, occurrenceDays, type Activity } from '../activities.ts';
import { addDays, formatDayLong } from '../days.ts';
import type { I18n } from '../i18n/index.ts';

export const MAX_ACTIVITIES = 200;
export const MAX_TITLE_LENGTH = 200;
export const MAX_COMPANION_LENGTH = 200;
export const MAX_CUSTOM_DATES = 50;

/** The categories of suggestions; their titles and items are `active.suggestions.<id>` in the catalogue. */
export const SUGGESTION_CATEGORIES = ['sport', 'relaxation', 'inspiration', 'treats', 'creative'] as const;

export type SuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number];

/** The next date, e.g. "Montag, 17.05.2021, 18:00 Uhr" in German. */
export const nextLabel = (activity: Activity, today: string, { lang, m, t }: I18n): string => {
	if (!activity.date) {
		return m.active.noDate;
	}
	const next = nextOccurrence(activity, today);
	if (!next) {
		return m.active.noFurtherDate;
	}
	const day = formatDayLong(next, lang);
	return activity.time ? t(m.active.dayAndTime, { day, time: t(m.days.time, { time: activity.time }) }) : day;
};

/** The days of an activity from `from` on, for lists and the calendar, at most `limit`. */
export const upcomingDays = (activity: Activity, from: string, days: number, limit = 100): string[] =>
	occurrenceDays(activity, from, addDays(from, days)).slice(0, limit);

const icsDate = (day: string) => day.replaceAll('-', '');
const icsDateTime = (day: string, time: string) => `${icsDate(day)}T${time.replace(':', '')}00`;
const icsText = (value: string) =>
	value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Lines longer than 75 octets are folded, as RFC 5545 asks. */
const fold = (line: string): string => {
	const bytes = new TextEncoder().encode(line);
	if (bytes.length <= 75) {
		return line;
	}
	const parts: string[] = [];
	let current = '';
	let size = 0;
	for (const char of line) {
		const length = new TextEncoder().encode(char).length;
		if (size + length > (parts.length ? 74 : 75)) {
			parts.push(current);
			current = '';
			size = 0;
		}
		current += char;
		size += length;
	}
	parts.push(current);
	return parts.join('\r\n ');
};

/**
 * The dated activities as an iCalendar file for the client's own calendar, its fixed texts in the
 * language of `i18n`. Times are local
 * ("floating"), as the client entered them; activities without a time are all-day events.
 */
export const toIcs = (
	activities: Array<{ id: string; data: Activity }>,
	now: Date,
	{ lang, m, t }: I18n
): string => {
	const stamp = `${now.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		`PRODID:-//ORISO//Beratungstools Aktiv sein//${lang.toUpperCase()}`,
		'CALSCALE:GREGORIAN'
	];
	for (const { id, data } of activities) {
		if (!data.date) {
			continue;
		}
		const start = (day: string) => (data.time ? icsDateTime(day, data.time) : icsDate(day));
		const valueType = data.time ? '' : ';VALUE=DATE';
		lines.push('BEGIN:VEVENT', `UID:${id}@beratungstools`, `DTSTAMP:${stamp}`);
		lines.push(`DTSTART${valueType}:${start(data.date)}`);
		lines.push(data.time ? 'DURATION:PT1H' : 'DURATION:P1D');
		lines.push(`SUMMARY:${icsText(data.title)}`);
		if (data.companion) {
			lines.push(`DESCRIPTION:${icsText(t(m.active.companionLine, { companion: data.companion }))}`);
		}
		if (data.repeat === 'daily' || data.repeat === 'weekly') {
			lines.push(`RRULE:FREQ=${data.repeat === 'daily' ? 'DAILY' : 'WEEKLY'}`);
		}
		const further = (data.repeat === 'custom' ? (data.dates ?? []) : []).filter((day) => day !== data.date);
		if (further.length) {
			lines.push(`RDATE${valueType}:${further.map(start).join(',')}`);
		}
		lines.push('END:VEVENT');
	}
	lines.push('END:VCALENDAR');
	return `${lines.map(fold).join('\r\n')}\r\n`;
};
