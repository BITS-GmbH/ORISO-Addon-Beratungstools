/** Calendar days as `YYYY-MM-DD`, computed in UTC so that no time zone shifts a day. */
import { DEFAULT_LANG, i18n, intlLocales, type Lang } from './i18n/index.ts';

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

const formatter = (lang: Lang, options: Intl.DateTimeFormatOptions) =>
	new Intl.DateTimeFormat(intlLocales(lang), { ...options, timeZone: 'UTC' });

/** "Mo., 09.08." */
export const formatDayShort = (day: string, lang: Lang = DEFAULT_LANG): string =>
	formatter(lang, { weekday: 'short', day: '2-digit', month: '2-digit' }).format(parse(day));

/** "Montag, 17.05.2021" */
export const formatDayLong = (day: string, lang: Lang = DEFAULT_LANG): string =>
	formatter(lang, { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(parse(day));

/** "17.05.2021" */
export const formatDay = (day: string, lang: Lang = DEFAULT_LANG): string =>
	formatter(lang, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parse(day));

/** "09.08." */
export const formatDayMonth = (day: string, lang: Lang = DEFAULT_LANG): string =>
	formatter(lang, { day: '2-digit', month: '2-digit' }).format(parse(day));

/** "Mai 2021" for the month that holds `day`. */
export const formatMonth = (day: string, lang: Lang = DEFAULT_LANG): string =>
	formatter(lang, { month: 'long', year: 'numeric' }).format(parse(day));

/** Short and long names of Monday to Sunday, e.g. `['Mo', 'Montag']`. */
export const weekdayNames = (lang: Lang = DEFAULT_LANG): Array<[string, string]> =>
	weekDays('2021-05-17').map((day) => [
		formatter(lang, { weekday: 'short' }).format(parse(day)).replace(/\.$/, ''),
		formatter(lang, { weekday: 'long' }).format(parse(day))
	]);

/** "17.05.2021 bis 23.05.2021", or one day when both are the same. */
export const formatPeriod = (from: string, to: string, lang: Lang = DEFAULT_LANG): string => {
	const { m, t } = i18n(lang);
	return from === to
		? formatDay(from, lang)
		: t(m.days.period, { from: formatDay(from, lang), to: formatDay(to, lang) });
};

/** "09.08. bis 15.08.2021", the label of a week. */
export const formatWeek = (monday: string, lang: Lang = DEFAULT_LANG): string => {
	const { m, t } = i18n(lang);
	return t(m.days.period, { from: formatDayMonth(monday, lang), to: formatDay(addDays(monday, 6), lang) });
};

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
