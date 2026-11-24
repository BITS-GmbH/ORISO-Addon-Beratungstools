export const goals = {
	steps: {
		situation: {
			section: 'Aktuelle Situation',
			title: {
				formal: 'Frage 1 von 4: Wie ist Ihre aktuelle Situation?',
				informal: 'Frage 1 von 4: Wie ist deine aktuelle Situation?'
			},
			hint: [
				{ formal: 'Bitte beschreiben Sie kurz', informal: 'Bitte beschreibe kurz' },
				{
					formal: '• Ihr eigenes Konsum- oder Glücksspielverhalten bzw.',
					informal: '• dein eigenes Konsum- oder Glücksspielverhalten bzw.'
				},
				'• die zentralen Themen oder Konflikte im Umgang mit konsumierenden / spielenden Angehörigen.'
			],
			summary: { formal: 'Ihre aktuelle Situation', informal: 'Deine aktuelle Situation' },
			counsellorLabel: 'Aktuelle Situation'
		},
		factors: {
			section: 'Aufrechterhaltende Faktoren',
			title: 'Frage 2 von 4: Welche positiven Aspekte hat die aktuelle Situation?',
			hint: [
				{
					formal:
						'Welche positiven Effekte hat der Substanzkonsum, das Glücksspielen oder der Medienkonsum für Sie? Was glauben Sie: Welche Motive spielen für Sie beim Konsumieren oder Spielen eine Rolle? Welche Gründe könnte es geben, an der aktuellen Situation nichts zu ändern?',
					informal:
						'Welche positiven Effekte hat der Substanzkonsum, das Glücksspielen oder der Medienkonsum für dich? Was glaubst du: Welche Motive spielen für dich beim Konsumieren oder Spielen eine Rolle? Welche Gründe könnte es geben, an der aktuellen Situation nichts zu ändern?'
				}
			],
			summary: 'Faktoren, die eine Veränderung schwierig machen',
			counsellorLabel: 'Faktoren, die eine Veränderung schwierig machen'
		},
		motivation: {
			section: 'Änderungsmotivation',
			title: {
				formal: 'Frage 3 von 4: Warum wollen Sie etwas an der aktuellen Situation ändern?',
				informal: 'Frage 3 von 4: Warum willst du etwas an der aktuellen Situation ändern?'
			},
			hint: [
				{
					formal: 'Was stört oder belastet Sie? Welche Dinge laufen nicht so, wie Sie sich das wünschen?',
					informal: 'Was stört oder belastet dich? Welche Dinge laufen nicht so, wie du dir das wünschst?'
				}
			],
			summary: 'Gründe und Motive für eine Veränderung der Situation',
			counsellorLabel: 'Gründe und Motive für eine Veränderung der Situation'
		},
		resources: {
			section: 'Individuelle Ressourcen',
			title: {
				formal: 'Frage 4 von 4: Wer oder was könnte Ihnen bei Ihrem Vorhaben helfen?',
				informal: 'Frage 4 von 4: Wer oder was könnte dir bei deinem Vorhaben helfen?'
			},
			hint: [
				{
					formal:
						'Haben Sie Hobbys, die Sie ablenken oder Freunde / Angehörige, von denen Sie Unterstützung erhalten können?',
					informal:
						'Hast du Hobbys, die dich ablenken oder Freunde / Angehörige, von denen du Unterstützung erhalten kannst?'
				}
			],
			summary: { formal: 'Ihre persönlichen Ressourcen', informal: 'Deine persönlichen Ressourcen' },
			counsellorLabel: 'Persönliche Ressourcen'
		},
		goal: {
			section: 'Zielformulierung',
			title: 'Bevor es los geht: Ziel formulieren',
			hint: [
				{
					formal:
						'Damit Sie in den kommenden Wochen zielstrebig an einer Verbesserung Ihrer Situation arbeiten können, ist es wichtig, Ihr persönliches Ziel möglichst genau zu benennen. Was möchten Sie in den kommenden Wochen erreichen? Wobei sollte Sie die Beratung unterstützen?',
					informal:
						'Damit du in den kommenden Wochen zielstrebig an einer Verbesserung deiner Situation arbeiten kannst, ist es wichtig, dein persönliches Ziel möglichst genau zu benennen. Was möchtest du in den kommenden Wochen erreichen? Wobei sollte dich die Beratung unterstützen?'
				},
				{
					formal: 'Welches konkrete Ziel streben Sie an? (Sie können Ihre Angabe auch später noch ändern)',
					informal: 'Welches konkrete Ziel strebst du an? (Du kannst deine Angabe auch später noch ändern)'
				}
			],
			summary: { formal: 'Ihr persönliches Ziel', informal: 'Dein persönliches Ziel' },
			counsellorLabel: 'Persönliches Ziel'
		}
	},
	start: {
		formal:
			'Bitte beschreiben Sie anhand der folgenden Fragen Ihre aktuelle Situation. Denken Sie dabei an den Grund für Ihre Beratung. Ihre Antworten helfen bei der Einschätzung, welche Übungen für Sie besonders hilfreich sind. Auch die Rückmeldungen Ihrer Beraterin / Ihres Beraters können dann noch besser auf Ihre tatsächliche Situation eingehen.',
		informal:
			'Bitte beschreibe anhand der folgenden Fragen deine aktuelle Situation. Denk dabei an den Grund für deine Beratung. Deine Antworten helfen bei der Einschätzung, welche Übungen für dich besonders hilfreich sind. Auch die Rückmeldungen deiner Beraterin / deines Beraters können dann noch besser auf deine tatsächliche Situation eingehen.'
	},
	startButton: 'Los geht’s',
	summaryTitle: 'Zusammenfassung',
	summaryText: {
		formal:
			'Sie haben sich detailliert mit Ihrer aktuellen Situation auseinandergesetzt und haben ein konkretes Ziel formuliert. Das ist ein erster wichtiger Schritt, um eine Verbesserung der Situation zu erreichen. Bei Bedarf können Sie Ihre Angaben jederzeit überarbeiten. Dabei unterstütze ich Sie gerne.',
		informal:
			'Du hast dich detailliert mit deiner aktuellen Situation auseinandergesetzt und hast ein konkretes Ziel formuliert. Das ist ein erster wichtiger Schritt, um eine Verbesserung der Situation zu erreichen. Bei Bedarf kannst du deine Angaben jederzeit überarbeiten. Dabei unterstütze ich dich gerne.'
	},
	overview: { formal: 'Ihre Angaben im Überblick:', informal: 'Deine Angaben im Überblick:' },
	edit: 'Bearbeiten',
	editLabel: 'Bearbeiten: {label}',
	empty: 'Noch keine Angabe',
	restart: 'Von vorn durchgehen',
	home: 'Meine Startseite',
	autosave: {
		formal: 'Ihre Angaben werden automatisch gespeichert.',
		informal: 'Deine Angaben werden automatisch gespeichert.'
	},
	back: 'Zurück',
	toSummary: 'Zur Zusammenfassung',
	next: 'Weiter',
	new: 'Neu',
	lastChanged: 'Zuletzt geändert am {date}',
	noAnswer: 'Keine Angabe',
	noAnswers: 'Noch keine Antworten.',
	reminder: 'Ausgangssituation und Ziele ausfüllen',
	demoSituation: 'Ich trinke seit einigen Monaten fast jeden Abend, meistens zwei bis drei Bier.'
};
