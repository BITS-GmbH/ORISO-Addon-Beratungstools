import { tx } from '../address.ts';

/** One entry per day, keyed by the day (`YYYY-MM-DD`). */
export const ENTRY_KIND = 'entry';
export const MAX_TEXT_LENGTH = 10000;
export const SNIPPET_LENGTH = 100;

export interface DiaryEntry {
	text?: string;
	/** 1 = sehr schlecht … 5 = sehr gut */
	mood?: number;
}

export const MOODS = [
	{ value: 1, label: 'sehr schlecht' },
	{ value: 2, label: 'eher schlecht' },
	{ value: 3, label: 'mittelmäßig' },
	{ value: 4, label: 'eher gut' },
	{ value: 5, label: 'sehr gut' }
] as const;

export const moodLabel = (mood: number | undefined): string =>
	MOODS.find((option) => option.value === mood)?.label ?? 'keine Angabe';

export const intro = (informal: boolean): string[] => [
	tx(
		informal,
		'Das Tagebuch dient dazu, bewegende, belastende oder auch schöne Ereignisse und Gedanken des Tages festzuhalten. Sie können sich bei Ihren Einträgen an den drei Fragen orientieren, die Ihnen in der Tagesansicht gezeigt werden. Klicken Sie z.B. auf den heutigen Tag, um einen Eintrag vorzunehmen.',
		'Das Tagebuch dient dazu, bewegende, belastende oder auch schöne Ereignisse und Gedanken des Tages festzuhalten. Du kannst dich bei deinen Einträgen an den drei Fragen orientieren, die dir in der Tagesansicht gezeigt werden. Klicke z.B. auf den heutigen Tag, um einen Eintrag vorzunehmen.'
	),
	tx(
		informal,
		'Häufig ist es bereits eine Erleichterung, Erlebnisse und Gedanken aufzuschreiben, sie dabei zu sortieren und „loszuwerden“. Ihre Eintragungen in das Tagebuch sind aber auch wichtig für Ihre persönliche Beratung: Je genauer Ihre Beraterin / Ihr Berater sich ein Bild von Ihrer Situation machen kann, desto besser können Sie beraten werden. Deshalb empfehlen wir Ihnen, Ihre Einträge für Ihre Beraterin / Ihren Berater sichtbar zu machen.',
		'Häufig ist es bereits eine Erleichterung, Erlebnisse und Gedanken aufzuschreiben, sie dabei zu sortieren und „loszuwerden“. Deine Eintragungen in das Tagebuch sind aber auch wichtig für deine persönliche Beratung: Je genauer deine Beraterin / dein Berater sich ein Bild von deiner Situation machen kann, desto besser kannst du beraten werden. Deshalb empfehlen wir dir, deine Einträge für deine Beraterin / deinen Berater sichtbar zu machen.'
	)
];

export const questions = (informal: boolean): string[] => [
	tx(informal, 'Was war heute für Sie wichtig?', 'Was war heute für dich wichtig?'),
	tx(
		informal,
		'Wie lief heute die Kommunikation mit Ihrer / Ihrem Angehörigen?',
		'Wie lief heute die Kommunikation mit deiner / deinem Angehörigen?'
	),
	tx(informal, 'Wie geht es Ihnen damit?', 'Wie geht es dir damit?')
];

export const moodQuestion = (informal: boolean): string =>
	tx(informal, 'Wie bewerten Sie den heutigen Tag?', 'Wie bewertest du den heutigen Tag?');

/** The first characters of an entry for the week view, cut at a word. */
export const snippet = (text: string | undefined, length = SNIPPET_LENGTH): string => {
	const flat = (text ?? '').replace(/\s+/g, ' ').trim();
	if (flat.length <= length) {
		return flat;
	}
	const cut = flat.slice(0, length);
	const space = cut.lastIndexOf(' ');
	return `${(space > length * 0.6 ? cut.slice(0, space) : cut).trimEnd()} …`;
};
