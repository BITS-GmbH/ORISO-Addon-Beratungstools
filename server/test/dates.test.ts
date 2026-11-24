import { describe, expect, it } from 'vitest';
import {
	formatDay,
	formatDayLong,
	formatDayShort,
	formatMonth,
	formatPeriod,
	formatWeek,
	weekdayNames
} from '../../shared/days.ts';
import { dateFormatter } from '../../shared/i18n/dates.ts';
import { i18n, LANGS } from '../../shared/i18n/index.ts';

const monday = '2026-11-23';

describe('dates', () => {
	it('formats days and weeks per language', () => {
		expect(LANGS.map((lang) => formatWeek(monday, lang))).toEqual([
			'23.11. bis 29.11.2026',
			'23/11 to 29/11/2026',
			'du 23/11 au 29/11/2026',
			'с 23.11 по 29.11.2026',
			'23/11 ክሳብ 29/11/2026',
			'23.11 – 29.11.2026'
		]);
		expect(formatDayShort(monday, 'tr')).toBe('23.11 Pzt');
		expect(formatDayLong(monday, 'tr')).toBe('23.11.2026 Pazartesi');
		expect(formatDayLong(monday, 'de')).toBe('Montag, 23.11.2026');
	});

	it('writes a period across a year with both years', () => {
		expect(formatPeriod('2026-12-28', '2027-01-03', 'de')).toBe('28.12.2026 bis 03.01.2027');
		expect(formatPeriod(monday, monday, 'tr')).toBe('23.11.2026');
	});

	it('names weekdays and months in Tigrinya', () => {
		expect(formatDayShort(monday, 'ti')).toBe('ሰኑ፣ 23/11');
		expect(formatDayLong(monday, 'ti')).toBe('ሰኑይ፣ 23/11/2026');
		expect(formatMonth(monday, 'ti')).toBe('ሕዳር 2026');
		expect(weekdayNames('ti')[0]).toEqual(['ሰኑ', 'ሰኑይ']);
	});

	it('takes the names from the catalogue where the runtime has no data for the language', () => {
		const format = dateFormatter('ti', ['qq-unknown', 'en-GB'], i18n('ti').m.days);
		const day = new Date(`${monday}T00:00:00Z`);
		expect(format(day, 'weekdayDayMonth', 'UTC')).toBe('ሰኑ፣ 23/11');
		expect(format(day, 'weekdayDate', 'UTC')).toBe('ሰኑይ፣ 23/11/2026');
		expect(format(day, 'monthYear', 'UTC')).toBe('ሕዳር 2026');
		expect(format(new Date('2026-11-29T00:00:00Z'), 'weekdayLong', 'UTC')).toBe('ሰንበት');
		expect(format(day, 'dateTime', 'Europe/Berlin')).toBe('23/11/2026, 01:00');
	});

	it('formats timestamps in the given time zone', () => {
		expect(i18n('tr').date('2026-11-23T16:05:00Z', { withTime: true, timeZone: 'Europe/Berlin' })).toBe(
			'23.11.2026 17:05'
		);
		expect(formatDay(monday, 'ru')).toBe('23.11.2026');
	});
});
