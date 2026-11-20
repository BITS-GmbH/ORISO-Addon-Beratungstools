import { tx } from '../address.ts';

export const MAX_ANSWER_LENGTH = 4000;

export interface GoalsStep {
	id: 'situation' | 'factors' | 'motivation' | 'resources' | 'goal';
	/** Overline of the step, e.g. "Aktuelle Situation". */
	section: string;
	title: (informal: boolean) => string;
	/** Explanations shown above the text field; bullet items start with "• ". */
	hint: (informal: boolean) => string[];
	/** Label of the answer in the summary and for counsellors. */
	summary: (informal: boolean) => string;
	counsellorLabel: string;
}

/**
 * The exercise after section 2.1 of delphi's tool description: four questions ("Frage 1 von 4" to
 * "Frage 4 von 4"), then the goal, then a summary.
 */
export const STEPS: GoalsStep[] = [
	{
		id: 'situation',
		section: 'Aktuelle Situation',
		title: (i) =>
			tx(
				i,
				'Frage 1 von 4: Wie ist Ihre aktuelle Situation?',
				'Frage 1 von 4: Wie ist deine aktuelle Situation?'
			),
		hint: (i) => [
			tx(i, 'Bitte beschreiben Sie kurz', 'Bitte beschreibe kurz'),
			tx(
				i,
				'• Ihr eigenes Konsum- oder Glücksspielverhalten bzw.',
				'• dein eigenes Konsum- oder Glücksspielverhalten bzw.'
			),
			'• die zentralen Themen oder Konflikte im Umgang mit konsumierenden / spielenden Angehörigen.'
		],
		summary: (i) => tx(i, 'Ihre aktuelle Situation', 'Deine aktuelle Situation'),
		counsellorLabel: 'Aktuelle Situation'
	},
	{
		id: 'factors',
		section: 'Aufrechterhaltende Faktoren',
		title: (i) =>
			tx(
				i,
				'Frage 2 von 4: Welche positiven Aspekte hat die aktuelle Situation?',
				'Frage 2 von 4: Welche positiven Aspekte hat die aktuelle Situation?'
			),
		hint: (i) => [
			tx(
				i,
				'Welche positiven Effekte hat der Substanzkonsum, das Glücksspielen oder der Medienkonsum für Sie? Was glauben Sie: Welche Motive spielen für Sie beim Konsumieren oder Spielen eine Rolle? Welche Gründe könnte es geben, an der aktuellen Situation nichts zu ändern?',
				'Welche positiven Effekte hat der Substanzkonsum, das Glücksspielen oder der Medienkonsum für dich? Was glaubst du: Welche Motive spielen für dich beim Konsumieren oder Spielen eine Rolle? Welche Gründe könnte es geben, an der aktuellen Situation nichts zu ändern?'
			)
		],
		summary: () => 'Faktoren, die eine Veränderung schwierig machen',
		counsellorLabel: 'Faktoren, die eine Veränderung schwierig machen'
	},
	{
		id: 'motivation',
		section: 'Änderungsmotivation',
		title: (i) =>
			tx(
				i,
				'Frage 3 von 4: Warum wollen Sie etwas an der aktuellen Situation ändern?',
				'Frage 3 von 4: Warum willst du etwas an der aktuellen Situation ändern?'
			),
		hint: (i) => [
			tx(
				i,
				'Was stört oder belastet Sie? Welche Dinge laufen nicht so, wie Sie sich das wünschen?',
				'Was stört oder belastet dich? Welche Dinge laufen nicht so, wie du dir das wünschst?'
			)
		],
		summary: () => 'Gründe und Motive für eine Veränderung der Situation',
		counsellorLabel: 'Gründe und Motive für eine Veränderung der Situation'
	},
	{
		id: 'resources',
		section: 'Individuelle Ressourcen',
		title: (i) =>
			tx(
				i,
				'Frage 4 von 4: Wer oder was könnte Ihnen bei Ihrem Vorhaben helfen?',
				'Frage 4 von 4: Wer oder was könnte dir bei deinem Vorhaben helfen?'
			),
		hint: (i) => [
			tx(
				i,
				'Haben Sie Hobbys, die Sie ablenken oder Freunde / Angehörige, von denen Sie Unterstützung erhalten können?',
				'Hast du Hobbys, die dich ablenken oder Freunde / Angehörige, von denen du Unterstützung erhalten kannst?'
			)
		],
		summary: (i) => tx(i, 'Ihre persönlichen Ressourcen', 'Deine persönlichen Ressourcen'),
		counsellorLabel: 'Persönliche Ressourcen'
	},
	{
		id: 'goal',
		section: 'Zielformulierung',
		title: () => 'Bevor es los geht: Ziel formulieren',
		hint: (i) => [
			tx(
				i,
				'Damit Sie in den kommenden Wochen zielstrebig an einer Verbesserung Ihrer Situation arbeiten können, ist es wichtig, Ihr persönliches Ziel möglichst genau zu benennen. Was möchten Sie in den kommenden Wochen erreichen? Wobei sollte Sie die Beratung unterstützen?',
				'Damit du in den kommenden Wochen zielstrebig an einer Verbesserung deiner Situation arbeiten kannst, ist es wichtig, dein persönliches Ziel möglichst genau zu benennen. Was möchtest du in den kommenden Wochen erreichen? Wobei sollte dich die Beratung unterstützen?'
			),
			tx(
				i,
				'Welches konkrete Ziel streben Sie an? (Sie können Ihre Angabe auch später noch ändern)',
				'Welches konkrete Ziel strebst du an? (Du kannst deine Angabe auch später noch ändern)'
			)
		],
		summary: (i) => tx(i, 'Ihr persönliches Ziel', 'Dein persönliches Ziel'),
		counsellorLabel: 'Persönliches Ziel'
	}
];

export const STEP_IDS = STEPS.map((step) => step.id);

export const startMessage = (informal: boolean): string =>
	tx(
		informal,
		'Bitte beschreiben Sie anhand der folgenden Fragen Ihre aktuelle Situation. Denken Sie dabei an den Grund für Ihre Beratung. Ihre Antworten helfen bei der Einschätzung, welche Übungen für Sie besonders hilfreich sind. Auch die Rückmeldungen Ihrer Beraterin / Ihres Beraters können dann noch besser auf Ihre tatsächliche Situation eingehen.',
		'Bitte beschreibe anhand der folgenden Fragen deine aktuelle Situation. Denk dabei an den Grund für deine Beratung. Deine Antworten helfen bei der Einschätzung, welche Übungen für dich besonders hilfreich sind. Auch die Rückmeldungen deiner Beraterin / deines Beraters können dann noch besser auf deine tatsächliche Situation eingehen.'
	);

export const summaryMessage = (informal: boolean): string =>
	tx(
		informal,
		'Sie haben sich detailliert mit Ihrer aktuellen Situation auseinandergesetzt und haben ein konkretes Ziel formuliert. Das ist ein erster wichtiger Schritt, um eine Verbesserung der Situation zu erreichen. Bei Bedarf können Sie Ihre Angaben jederzeit überarbeiten. Dabei unterstütze ich Sie gerne.',
		'Du hast dich detailliert mit deiner aktuellen Situation auseinandergesetzt und hast ein konkretes Ziel formuliert. Das ist ein erster wichtiger Schritt, um eine Verbesserung der Situation zu erreichen. Bei Bedarf kannst du deine Angaben jederzeit überarbeiten. Dabei unterstütze ich dich gerne.'
	);

/** Each answer is one entry of kind `answer`, keyed by its step. */
export const ANSWER_KIND = 'answer';

export interface Answer {
	text: string;
}

export const isStepId = (key: string): key is GoalsStep['id'] => (STEP_IDS as string[]).includes(key);
