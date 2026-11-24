/** Calendar days as `YYYY-MM-DD`, computed in UTC so that no time zone shifts a day. */
import { DEFAULT_LANG, type DateStyle, i18n, type Lang } from './i18n/index.ts';

export const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parse = (day: string) => new Date(`${day}T00:00:00Z`);
const format = (date: Date) => date.toISOString().slice(0, 10);

export const isDay = (value: string): boolean => DAY_PATTERN.test(value) && format(parse(value)) === value;

/** Today in the user's local time. */
export const localToday = (now = new Date()): string => {
	const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
	return format(local);
};

export const addDays = (day: string, days: number): string => {
	const date = parse(day);
	date.setUTCDate(date.getUTCDate() + days);
	return format(date);
};

/** 0 = Sunday … 6 = Saturday. */
export const weekday = (day: string): number => parse(day).getUTCDay();

/** The Monday of the week that holds `day`. */
export const weekStart = (day: string): string => addDays(day, -((weekday(day) + 6) % 7));

/** Monday to Sunday of the week that starts on `monday`. */
export const weekDays = (monday: string): string[] => Array.from({ length: 7 }, (_, i) => addDays(monday, i));

export const daysBetween = (from: string, to: string): number =>
	Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);

const formatAs =
	(style: DateStyle) =>
	(day: string, lang: Lang = DEFAULT_LANG) =>
		i18n(lang).formatDate(parse(day), style, 'UTC');

/** "Mo., 09.08." */
export const formatDayShort = formatAs('weekdayDayMonth');

/** "Montag, 17.05.2021" */
export const formatDayLong = formatAs('weekdayDate');

/** "17.05.2021" */
export const formatDay = formatAs('date');

/** "09.08." */
export const formatDayMonth = formatAs('dayMonth');

/** "Mai 2021" for the month that holds `day`. */
export const formatMonth = formatAs('monthYear');

/** Short and long names of Monday to Sunday, e.g. `['Mo', 'Montag']`. */
export const weekdayNames = (lang: Lang = DEFAULT_LANG): Array<[string, string]> =>
	weekDays('2021-05-17').map((day) => [
		formatAs('weekdayShort')(day, lang).replace(/\.$/, ''),
		formatAs('weekdayLong')(day, lang)
	]);

/** "09.08. bis 15.08.2021", or "28.12.2026 bis 03.01.2027" across a year; one day when both are the same. */
export const formatPeriod = (from: string, to: string, lang: Lang = DEFAULT_LANG): string => {
	const { m, t } = i18n(lang);
	if (from === to) {
		return formatDay(from, lang);
	}
	const start = from.slice(0, 4) === to.slice(0, 4) ? formatDayMonth(from, lang) : formatDay(from, lang);
	return t(m.days.period, { from: start, to: formatDay(to, lang) });
};

/** The label of the week that starts on `monday`. */
export const formatWeek = (monday: string, lang: Lang = DEFAULT_LANG): string =>
	formatPeriod(monday, addDays(monday, 6), lang);

/** "1 Std. 30 Min.", "45 Min." */
export const formatMinutes = (minutes: number, lang: Lang = DEFAULT_LANG): string => {
	const { m, t } = i18n(lang);
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours === 0) {
		return t(m.days.minutes, { minutes: rest });
	}
	return rest === 0 ? t(m.days.hours, { hours }) : t(m.days.hoursMinutes, { hours, minutes: rest });
};
