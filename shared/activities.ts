import type { Entry } from './api.ts';
import type { ToolId } from './catalog.ts';
import { addDays, daysBetween } from './days.ts';

/**
 * Planned activities belong to the tool `active`; both diaries show them. They read the same
 * records through the core (`linked` in the tool's answer), so this module is the one place that
 * knows their shape, for the owning tool and for the readers.
 */
export const ACTIVITY_TOOL: ToolId = 'active';
export const ACTIVITY_KIND = 'activity';

export const REPEATS = ['none', 'daily', 'weekly', 'custom'] as const;
export type Repeat = (typeof REPEATS)[number];

export const REPEAT_LABELS: Record<Repeat, string> = {
	none: 'keine',
	daily: 'täglich',
	weekly: 'wöchentlich',
	custom: 'individueller Termin'
};

export interface Activity {
	title: string;
	/** First (or only) day, `YYYY-MM-DD`; activities may have no date at all. */
	date?: string;
	/** `HH:MM` */
	time?: string;
	repeat: Repeat;
	/** With `custom`: the further days besides `date`. */
	dates?: string[];
	companion?: string;
}

export interface Occurrence {
	day: string;
	time?: string;
	activity: Activity;
	id: string;
}

const customDays = (activity: Activity): string[] =>
	[...new Set([activity.date, ...(activity.dates ?? [])].filter((d): d is string => Boolean(d)))].sort();

/** The days in `[from, to]` on which the activity takes place. */
export const occurrenceDays = (activity: Activity, from: string, to: string): string[] => {
	const { date } = activity;
	if (activity.repeat === 'custom') {
		return customDays(activity).filter((day) => day >= from && day <= to);
	}
	if (!date || date > to) {
		return [];
	}
	if (activity.repeat === 'none') {
		return date >= from ? [date] : [];
	}
	const step = activity.repeat === 'daily' ? 1 : 7;
	const offset = Math.max(0, Math.ceil(daysBetween(date, from) / step)) * step;
	const days: string[] = [];
	for (let day = addDays(date, offset); day <= to; day = addDays(day, step)) {
		days.push(day);
	}
	return days;
};

/** The next day (from `today` on) the activity takes place, or null. */
export const nextOccurrence = (activity: Activity, today: string): string | null => {
	if (activity.repeat === 'custom') {
		return customDays(activity).find((day) => day >= today) ?? null;
	}
	return (
		occurrenceDays(activity, today, addDays(today, 7))[0] ??
		(activity.date && activity.date >= today ? activity.date : null)
	);
};

export const activitiesOf = (entries: Entry[] | undefined): Array<Entry<Activity>> =>
	(entries ?? []).filter((e): e is Entry<Activity> => e.kind === ACTIVITY_KIND);

/** All occurrences of the activities in `[from, to]`, by day and time. */
export const occurrencesBetween = (entries: Entry[] | undefined, from: string, to: string): Occurrence[] =>
	activitiesOf(entries)
		.flatMap((entry) =>
			occurrenceDays(entry.data, from, to).map((day) => ({
				day,
				time: entry.data.time,
				activity: entry.data,
				id: `${entry.id}:${day}`
			}))
		)
		.sort((a, b) => (a.day + (a.time ?? '')).localeCompare(b.day + (b.time ?? '')));
