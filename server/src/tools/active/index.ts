import { z } from 'zod';
import type { Activity } from '../../../../shared/activities.ts';
import { ACTIVITY_KIND, activitiesOf, REPEAT_LABELS, REPEATS } from '../../../../shared/activities.ts';
import { addDays, formatDayLong, isDay } from '../../../../shared/days.ts';
import {
	MAX_ACTIVITIES,
	MAX_COMPANION_LENGTH,
	MAX_CUSTOM_DATES,
	MAX_TITLE_LENGTH,
	nextLabel,
	upcomingDays
} from '../../../../shared/tools/active.ts';
import type { CalendarEntry, ServerTool } from '../types.ts';

const day = z.string().refine(isDay, 'invalid day');
const optionalText = (max: number) =>
	z
		.string()
		.trim()
		.max(max)
		.optional()
		.transform((value) => value || undefined);

export const activitySchema = z
	.object({
		title: z.string().trim().min(1).max(MAX_TITLE_LENGTH),
		date: z
			.union([day, z.literal('')])
			.optional()
			.transform((value) => value || undefined),
		time: z
			.union([z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), z.literal('')])
			.optional()
			.transform((value) => value || undefined),
		repeat: z.enum(REPEATS).default('none'),
		dates: z.array(day).max(MAX_CUSTOM_DATES).optional(),
		companion: optionalText(MAX_COMPANION_LENGTH)
	})
	.refine((activity) => activity.date || (activity.repeat === 'none' && !activity.time), {
		message: 'a time or a repetition needs a date'
	})
	.transform(({ dates, ...activity }): Activity => {
		const further =
			activity.repeat === 'custom' ? [...new Set(dates ?? [])].filter((d) => d !== activity.date).sort() : [];
		return further.length ? { ...activity, dates: further } : activity;
	});

const offsetMinutes = (date: Date, timeZone: string) => {
	const parts: Record<string, number> = Object.fromEntries(
		new Intl.DateTimeFormat('en-US', {
			timeZone,
			hourCycle: 'h23',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		})
			.formatToParts(date)
			.map((part) => [part.type, Number(part.value)])
	);
	return (
		(Date.UTC(parts.year ?? 0, (parts.month ?? 1) - 1, parts.day, parts.hour, parts.minute) -
			date.getTime()) /
		60_000
	);
};

/** A local day and time in `timeZone` as an ISO instant. */
export const zonedIso = (dayText: string, time: string, timeZone: string): string => {
	const naive = Date.parse(`${dayText}T${time}:00Z`);
	const shifted = naive - offsetMinutes(new Date(naive), timeZone) * 60_000;
	return new Date(naive - offsetMinutes(new Date(shifted), timeZone) * 60_000).toISOString();
};

const CALENDAR_PAST_DAYS = 7;
const CALENDAR_FUTURE_DAYS = 90;

const todayIn = (now: Date, timeZone: string) =>
	new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
		now
	);

export const active: ServerTool = {
	id: 'active',
	kinds: {
		[ACTIVITY_KIND]: { schema: activitySchema, max: MAX_ACTIVITIES }
	},
	options: {
		intro: {
			type: 'string',
			title: 'Einleitung',
			description: 'Steht auf der Startseite der Übung. Leer lassen für den Standardtext.',
			maxLength: 2000,
			format: 'textarea',
			default: ''
		}
	},
	exportPdf(pdf, { entries }) {
		const activities = activitiesOf(entries);
		if (activities.length === 0) {
			pdf.paragraph('Noch keine Aktivitäten eingetragen.', { muted: true });
			return;
		}
		const today = new Date().toISOString().slice(0, 10);
		pdf.heading('Eingetragene Aktivitäten');
		for (const { data } of activities) {
			pdf.subheading(data.title);
			const details = [
				`Nächster Termin: ${nextLabel(data, today)}`,
				`Wiederholung: ${REPEAT_LABELS[data.repeat]}`,
				...(data.repeat === 'custom' && data.dates?.length
					? [`Weitere Termine: ${data.dates.map(formatDayLong).join('; ')}`]
					: []),
				`Begleitung: ${data.companion ?? 'keine Angabe'}`
			];
			pdf.paragraph(details.join('\n'));
		}
	},
	demo: () => {
		const today = new Date().toISOString().slice(0, 10);
		return [
			{
				kind: ACTIVITY_KIND,
				data: {
					title: 'Spazieren gehen am Fluss',
					date: addDays(today, 1),
					time: '18:00',
					repeat: 'weekly',
					companion: 'Marie'
				}
			},
			{
				kind: ACTIVITY_KIND,
				data: {
					title: 'Ins Kino gehen',
					date: addDays(today, 3),
					time: '20:00',
					repeat: 'none',
					companion: 'Peter, Marie'
				}
			},
			{ kind: ACTIVITY_KIND, data: { title: 'Ein Buch lesen', repeat: 'none' } }
		];
	},
	calendar({ entries, now, timeZone }) {
		const from = addDays(todayIn(now, timeZone), -CALENDAR_PAST_DAYS);
		const result: CalendarEntry[] = [];
		for (const entry of activitiesOf(entries)) {
			const { data } = entry;
			for (const occurrence of upcomingDays(data, from, CALENDAR_PAST_DAYS + CALENDAR_FUTURE_DAYS)) {
				result.push({
					id: `active-${entry.id}-${occurrence}`,
					kind: 'reminder',
					title: { de: data.title },
					...(data.time
						? { start: zonedIso(occurrence, data.time, timeZone), allDay: false }
						: { start: `${occurrence}T00:00:00.000Z`, allDay: true })
				});
			}
		}
		return result;
	}
};
