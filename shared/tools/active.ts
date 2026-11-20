import { tx } from '../address.ts';
import { nextOccurrence, occurrenceDays, type Activity } from '../activities.ts';
import { addDays, formatDayLong } from '../days.ts';

export const MAX_ACTIVITIES = 200;
export const MAX_TITLE_LENGTH = 200;
export const MAX_COMPANION_LENGTH = 200;
export const MAX_CUSTOM_DATES = 50;

export const intro = (informal: boolean): string[] => [
	'Die eigene Fürsorge trägt maßgeblich zu einer guten Lebensqualität bei. Eine gute Lebensqualität hilft dabei, Stress abzubauen, den Suchtdruck (das sogenannte Craving) bei Betroffenen zu verringern und Rückfälle zu vermeiden.',
	tx(
		informal,
		'Insbesondere sportliche, kreative und soziale Aktivitäten helfen, die eigene Stimmung deutlich zu verbessern oder Entzugserscheinungen zu verringern. Auch andere positive, fest eingeplante Aktivitäten helfen dabei, alte Gewohnheiten oder Verhaltensmuster zu überwinden. Besonders, wenn Sie sie regelmäßig in Ihren Alltag einbauen. Wichtig ist, dass Sie sich dabei gut fühlen. Diese Übung unterstützt Sie dabei, Ihren Alltag aktiv und angenehm zu gestalten. Nutzen Sie unsere Vorschläge oder tragen Sie Ihre eigenen Ideen für Aktivitäten ein.',
		'Insbesondere sportliche, kreative und soziale Aktivitäten helfen, die eigene Stimmung deutlich zu verbessern oder Entzugserscheinungen zu verringern. Auch andere positive, fest eingeplante Aktivitäten helfen dabei, alte Gewohnheiten oder Verhaltensmuster zu überwinden. Besonders, wenn du sie regelmäßig in deinen Alltag einbaust. Wichtig ist, dass du dich dabei gut fühlst. Diese Übung unterstützt dich dabei, deinen Alltag aktiv und angenehm zu gestalten. Nutze unsere Vorschläge oder trage deine eigenen Ideen für Aktivitäten ein.'
	)
];

export const howTo = (informal: boolean): string[] => [
	tx(
		informal,
		'Tragen Sie unten Ihre geplanten Aktivitäten ein. Mit einem Klick auf „Aktivität hinzufügen“ wird der Eintrag übernommen.',
		'Trage unten deine geplanten Aktivitäten ein. Mit einem Klick auf „Aktivität hinzufügen“ wird der Eintrag übernommen.'
	),
	tx(
		informal,
		'Achten Sie auf die Umsetzbarkeit Ihrer Pläne. Überlegen Sie möglichst genau, welche Aktivitäten Sie wann realistisch umsetzen können.',
		'Achte auf die Umsetzbarkeit deiner Pläne. Überlege möglichst genau, welche Aktivitäten du wann realistisch umsetzen kannst.'
	),
	tx(
		informal,
		'Nutzen Sie ggf. unsere Vorschläge, um eine passende Aktivität zu finden.',
		'Nutze ggf. unsere Vorschläge, um eine passende Aktivität zu finden.'
	),
	tx(
		informal,
		'Geplante Aktivitäten werden automatisch in Ihrem Tagebuch angezeigt. Wenn Sie möchten, können Sie Ihre Einträge auch in Ihren persönlichen Terminkalender übernehmen.',
		'Geplante Aktivitäten werden automatisch in deinem Tagebuch angezeigt. Wenn du möchtest, kannst du deine Einträge auch in deinen persönlichen Terminkalender übernehmen.'
	)
];

export const suggestionsHint = (informal: boolean): string =>
	tx(
		informal,
		'Nutzen Sie unsere Vorschläge als Anregung für Ihre individuelle Planung. Formulieren Sie Ihr Vorhaben am besten noch konkreter aus.',
		'Nutze unsere Vorschläge als Anregung für deine individuelle Planung. Formuliere dein Vorhaben am besten noch konkreter aus.'
	);

export interface SuggestionCategory {
	title: string;
	items: string[];
}

export const SUGGESTIONS: SuggestionCategory[] = [
	{
		title: 'Aktiv und sportlich',
		items: [
			'Spazieren gehen',
			'Joggen',
			'Fußball spielen',
			'Badminton spielen',
			'Tischtennis spielen',
			'Fitnessstudio',
			'Tanzen',
			'Radfahren oder eine Fahrradtour machen',
			'Einen Ausflug machen',
			'Wandern',
			'In die Kletterhalle gehen',
			'Boxen',
			'Schwimmen',
			'Minigolf spielen',
			'Bowling'
		]
	},
	{
		title: 'Entspannung',
		items: [
			'In die Sauna gehen',
			'Ein Bad nehmen oder duschen',
			'Sich massieren lassen',
			'Musik hören',
			'Kerzen anmachen',
			'Ein Entspannungsverfahren lernen',
			'Meditieren oder Yoga machen',
			'Küssen',
			'Flirten',
			'Kuscheln',
			'Ein Hörspiel hören'
		]
	},
	{
		title: 'Inspiration',
		items: [
			'Ein Buch lesen',
			'Eine Zeitung oder Zeitschrift lesen',
			'Cartoons oder Comics lesen',
			'Telefonieren',
			'E-Mails oder Briefe schreiben',
			'Ins Kino gehen',
			'Einen Filmabend machen',
			'Ins Theater gehen',
			'Zu einem Vortrag gehen',
			'In einen Club, Disko gehen',
			'Zu einem Konzert gehen',
			'Eine Wochenendreise machen',
			'In einen Freizeitpark gehen',
			'Ins Museum oder eine Ausstellung gehen',
			'Durch Läden schlendern und sich eine nette Kleinigkeit kaufen',
			'Erkundigungsgang machen, unbekannte Gegend erforschen'
		]
	},
	{
		title: 'Genuss',
		items: [
			'Ein Eis essen',
			'Ein Stück Kuchen essen',
			'Pizza bestellen',
			'Kochen oder Backen',
			'Neue Rezepte ausprobieren',
			'Einen Kochkurs belegen',
			'Für Freunde kochen',
			'Einen Grillabend oder ein Picknick organisieren'
		]
	},
	{
		title: 'Kreativ',
		items: [
			'Malen oder Zeichnen',
			'Töpfern',
			'Nähen oder Stricken',
			'Basteln',
			'Puzzle oder Kreuzworträtsel lösen',
			'Eine neue Sprache lernen',
			'Fotografieren',
			'Einen Volkshochschulkurs machen',
			'Lesen',
			'Ein Gedicht schreiben',
			'Musik machen'
		]
	}
];

/** "Nächster Termin": "Montag, 17.05.2021, 18:00 Uhr". */
export const nextLabel = (activity: Activity, today: string): string => {
	if (!activity.date) {
		return 'kein Termin';
	}
	const next = nextOccurrence(activity, today);
	if (!next) {
		return 'kein weiterer Termin';
	}
	return `${formatDayLong(next)}${activity.time ? `, ${activity.time} Uhr` : ''}`;
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
 * The dated activities as an iCalendar file for the client's own calendar. Times are local
 * ("floating"), as the client entered them; activities without a time are all-day events.
 */
export const toIcs = (activities: Array<{ id: string; data: Activity }>, now: Date): string => {
	const stamp = `${now.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//ORISO//Beratungstools Aktiv sein//DE',
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
			lines.push(`DESCRIPTION:${icsText(`Begleitung: ${data.companion}`)}`);
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
