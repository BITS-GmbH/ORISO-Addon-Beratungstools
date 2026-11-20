/** Calendar days as `YYYY-MM-DD`, computed in UTC so that no time zone shifts a day. */

export const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const WEEKDAYS_SHORT = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
const WEEKDAYS_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

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

/** "Mo., 09.08." */
export const formatDayShort = (day: string): string => {
	const [, month, date] = day.split('-');
	return `${WEEKDAYS_SHORT[weekday(day)]}, ${date}.${month}.`;
};

/** "Montag, 17.05.2021" */
export const formatDayLong = (day: string): string => `${WEEKDAYS_LONG[weekday(day)]}, ${formatDay(day)}`;

/** "17.05.2021" */
export const formatDay = (day: string): string => {
	const [year, month, date] = day.split('-');
	return `${date}.${month}.${year}`;
};

/** "09.08. bis 15.08.2021", the label of a week. */
export const formatWeek = (monday: string): string => {
	const sunday = addDays(monday, 6);
	const [, month, date] = monday.split('-');
	return `${date}.${month}. bis ${formatDay(sunday)}`;
};

/** "1 Std. 30 Min.", "45 Min." */
export const formatMinutes = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours === 0) {
		return `${rest} Min.`;
	}
	return rest === 0 ? `${hours} Std.` : `${hours} Std. ${rest} Min.`;
};
