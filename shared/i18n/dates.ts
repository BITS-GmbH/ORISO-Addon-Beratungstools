/** Formatting of dates for one language: `Intl` where the runtime knows the language, else the catalogue's names. */

export type DateStyle =
	/** 23.11.2026 */
	| 'date'
	/** 23.11.2026, 14:05 */
	| 'dateTime'
	/** 23.11. */
	| 'dayMonth'
	/** Mo., 23.11. */
	| 'weekdayDayMonth'
	/** Montag, 23.11.2026 */
	| 'weekdayDate'
	/** November 2026 */
	| 'monthYear'
	/** Mo */
	| 'weekdayShort'
	/** Montag */
	| 'weekdayLong';

export interface DateNames {
	/** Monday to Sunday. */
	weekdays: readonly string[];
	weekdaysShort: readonly string[];
	/** January to December. */
	months: readonly string[];
	/** `{weekday}` and `{date}`, for languages without `Intl` data. */
	weekdayDate: string;
	/** `{month}` and `{year}`, for languages without `Intl` data. */
	monthYear: string;
}

const OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
	date: { day: '2-digit', month: '2-digit', year: 'numeric' },
	dateTime: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
	dayMonth: { day: '2-digit', month: '2-digit' },
	weekdayDayMonth: { weekday: 'short', day: '2-digit', month: '2-digit' },
	weekdayDate: { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' },
	monthYear: { month: 'long', year: 'numeric' },
	weekdayShort: { weekday: 'short' },
	weekdayLong: { weekday: 'long' }
};

const fill = (template: string, vars: Record<string, string>) =>
	template.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);

/** Whether the runtime has date data for the language (browsers often lack Tigrinya). */
export const intlKnows = (lang: string, locale: string): boolean =>
	new Intl.DateTimeFormat(locale).resolvedOptions().locale.toLowerCase().split('-')[0] === lang;

/** The separator between day and month in a full date, e.g. `.` for German. */
const daySeparator = (parts: Intl.DateTimeFormatPart[]): string | undefined => {
	const day = parts.findIndex((part) => part.type === 'day');
	const between = parts[day + 1];
	return day >= 0 && between?.type === 'literal' && parts[day + 2]?.type === 'month'
		? between.value
		: undefined;
};

export const dateFormatter = (lang: string, locales: string[], names: DateNames) => {
	const known = intlKnows(lang, locales[0] ?? lang);
	const cache = new Map<string, Intl.DateTimeFormat>();
	const intl = (options: Intl.DateTimeFormatOptions, timeZone?: string) => {
		const key = `${JSON.stringify(options)}:${timeZone ?? ''}`;
		let formatter = cache.get(key);
		if (!formatter) {
			formatter = new Intl.DateTimeFormat(locales, { ...options, ...(timeZone ? { timeZone } : {}) });
			cache.set(key, formatter);
		}
		return formatter;
	};

	/**
	 * Some locales use another separator for day and month alone than in a full date (Turkish:
	 * 23/11 next to 23.11.2026); the full date's separator wins, so that ranges read alike.
	 */
	const withDateSeparator = (parts: Intl.DateTimeFormatPart[], date: Date, timeZone?: string) => {
		const wanted = daySeparator(intl(OPTIONS.date, timeZone).formatToParts(date));
		const day = parts.findIndex((part) => part.type === 'day');
		return parts
			.map((part, index) =>
				wanted !== undefined &&
				index === day + 1 &&
				part.type === 'literal' &&
				parts[index + 1]?.type === 'month'
					? wanted
					: part.value
			)
			.join('');
	};

	const calendarParts = (date: Date, timeZone?: string) => {
		const parts = intl({ year: 'numeric', month: 'numeric', day: 'numeric', calendar: 'gregory' }, timeZone)
			.formatToParts(date)
			.reduce<Record<string, number>>((all, part) => ({ ...all, [part.type]: Number(part.value) }), {});
		const weekday = (new Date(Date.UTC(parts.year!, parts.month! - 1, parts.day!)).getUTCDay() + 6) % 7;
		return { year: parts.year!, month: parts.month! - 1, weekday };
	};

	const fromCatalogue = (date: Date, style: DateStyle, timeZone?: string): string => {
		const { year, month, weekday } = calendarParts(date, timeZone);
		switch (style) {
			case 'weekdayShort':
				return names.weekdaysShort[weekday] ?? '';
			case 'weekdayLong':
				return names.weekdays[weekday] ?? '';
			case 'monthYear':
				return fill(names.monthYear, { month: names.months[month] ?? '', year: String(year) });
			case 'weekdayDayMonth':
				return fill(names.weekdayDate, {
					weekday: names.weekdaysShort[weekday] ?? '',
					date: format(date, 'dayMonth', timeZone)
				});
			case 'weekdayDate':
				return fill(names.weekdayDate, {
					weekday: names.weekdays[weekday] ?? '',
					date: format(date, 'date', timeZone)
				});
			default:
				return format(date, style, timeZone);
		}
	};

	const format = (date: Date, style: DateStyle, timeZone?: string): string => {
		const numeric = style === 'date' || style === 'dateTime' || style === 'dayMonth';
		if (!known && !numeric) {
			return fromCatalogue(date, style, timeZone);
		}
		const parts = intl(OPTIONS[style], timeZone).formatToParts(date);
		return style === 'dayMonth' || style === 'weekdayDayMonth'
			? withDateSeparator(parts, date, timeZone)
			: parts.map((part) => part.value).join('');
	};

	return format;
};
