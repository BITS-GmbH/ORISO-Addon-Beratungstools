export const balance = {
	intro: {
		formal:
			'Die eigenen Gewohnheiten zu ändern ist immer eine herausfordernde Aufgabe. Jede Veränderung ist anstrengend, kostet Kraft und braucht Durchhaltevermögen. Die Motivationswaage hilft Ihnen dabei, sich über die Vor- und Nachteile einer Überwindung des Suchtverhaltens im Klaren zu sein.',
		informal:
			'Die eigenen Gewohnheiten zu ändern ist immer eine herausfordernde Aufgabe. Jede Veränderung ist anstrengend, kostet Kraft und braucht Durchhaltevermögen. Die Motivationswaage hilft dir dabei, dir über die Vor- und Nachteile einer Überwindung des Suchtverhaltens im Klaren zu sein.'
	},
	howItWorks: 'So funktioniert die Motivationswaage',
	howItWorksStep: '{title}:',
	howItWorksSteps: [
		{
			title: 'Argumente sammeln',
			text: {
				formal:
					'Überlegen Sie für sich persönlich: Welche Folgen hat es, wenn ich mein Verhalten ändere, also bspw. mit dem Trinken, Spielen oder Kiffen aufhöre? Was passiert, wenn ich weitermache wie bisher? Seien Sie dabei ehrlich zu sich selbst!',
				informal:
					'Überlege für dich persönlich: Welche Folgen hat es, wenn ich mein Verhalten ändere, also bspw. mit dem Trinken, Spielen oder Kiffen aufhöre? Was passiert, wenn ich weitermache wie bisher? Sei dabei ehrlich zu dir selbst!'
			}
		},
		{
			title: 'Bewerten',
			text: {
				formal:
					'In beiden Fällen können die Auswirkungen einer Veränderung für Sie positiv oder negativ sein. Überlegen Sie auch, ob diese Auswirkungen für Sie besonders wichtig oder eher weniger wichtig sind.',
				informal:
					'In beiden Fällen können die Auswirkungen einer Veränderung für dich positiv oder negativ sein. Überlege auch, ob diese Auswirkungen für dich besonders wichtig oder eher weniger wichtig sind.'
			}
		},
		{
			title: 'Ergebnis ansehen',
			text: {
				formal:
					'Wenn Sie alle Vor- und Nachteile eingetragen und bewertet haben, zeigt Ihnen die Motivationswaage Ihre aktuelle innere Haltung zu dem ausgewählten Thema an.',
				informal:
					'Wenn du alle Vor- und Nachteile eingetragen und bewertet hast, zeigt dir die Motivationswaage deine aktuelle innere Haltung zu dem ausgewählten Thema an.'
			}
		},
		{
			title: 'Fazit ziehen',
			text: {
				formal:
					'Was ist Ihr Fazit? Wie schätzen Sie Ihre aktuelle Motivation ein? Sind Sie innerlich bereit, Ihr Verhalten zu verändern? Oder brauchen Sie weitere Argumente?',
				informal:
					'Was ist dein Fazit? Wie schätzt du deine aktuelle Motivation ein? Bist du innerlich bereit, dein Verhalten zu verändern? Oder brauchst du weitere Argumente?'
			}
		}
	],
	howItWorksNote: {
		formal:
			'Sie können die Übung jederzeit erneut bearbeiten und ergänzen, wenn Ihnen neue Vor- und Nachteile einfallen. Wenn Sie möchten, kann Ihre Beraterin / Ihr Berater Ihre Angaben einsehen und Sie so bei Ihrem Vorhaben optimal unterstützen.',
		informal:
			'Du kannst die Übung jederzeit erneut bearbeiten und ergänzen, wenn dir neue Vor- und Nachteile einfallen. Wenn du möchtest, kann deine Beraterin / dein Berater deine Angaben einsehen und dich so bei deinem Vorhaben optimal unterstützen.'
	},
	workOnExerciseFirst: {
		formal: 'Bitte bearbeiten Sie zunächst die Übung.',
		informal: 'Bitte bearbeite zunächst die Übung.'
	},
	sides: { pro: 'PRO', contra: 'CONTRA' },
	poles: [
		{ contra: 'CONTRA Veränderung', pro: 'PRO Veränderung' },
		{ contra: 'keine Veränderung', pro: 'Ich möchte etwas ändern!' },
		{ contra: 'gut so, wie es ist', pro: 'es muss sich was ändern!' }
	],
	ratings: {
		very: 'sehr wichtig',
		quite: 'ziemlich wichtig',
		some: 'etwas wichtig',
		none: 'gar nicht wichtig'
	},
	notImportant: 'nicht wichtig',
	ratingOption: '{label} ({stars})',
	ratingQuestion: {
		formal: 'Wie wichtig ist dieser Aspekt für Sie?',
		informal: 'Wie wichtig ist dieser Aspekt für dich?'
	},
	halves: {
		change: 'Wenn ich mein Ziel erreiche / mein Verhalten ändere, habe ich folgende …',
		keep: 'Wenn ich mein Verhalten nicht ändere / mein Ziel nicht erreiche, habe ich folgende …'
	},
	categoryInHalf: '… {title}',
	categoryWithSide: '{category} ({side})',
	categories: {
		A: {
			title: 'Vorteile',
			long: 'Vorteile der Verhaltensänderung',
			listTitle: {
				formal: 'Ihre eingetragenen Vorteile, wenn Sie Ihr Ziel erreichen:',
				informal: 'Deine eingetragenen Vorteile, wenn du dein Ziel erreichst:'
			}
		},
		B: {
			title: 'Nachteile',
			long: 'Nachteile der Verhaltensänderung',
			listTitle: {
				formal: 'Ihre eingetragenen Nachteile, wenn Sie Ihr Ziel erreichen:',
				informal: 'Deine eingetragenen Nachteile, wenn du dein Ziel erreichst:'
			}
		},
		C: {
			title: 'Vorteile',
			long: 'Vorteile, wenn sich nichts ändert',
			listTitle: {
				formal: 'Ihre eingetragenen Vorteile, wenn Sie Ihr Verhalten nicht ändern:',
				informal: 'Deine eingetragenen Vorteile, wenn du dein Verhalten nicht änderst:'
			}
		},
		D: {
			title: 'Nachteile',
			long: 'Nachteile, wenn sich nichts ändert',
			listTitle: {
				formal: 'Ihre eingetragenen Nachteile, wenn Sie Ihr Verhalten nicht ändern:',
				informal: 'Deine eingetragenen Nachteile, wenn du dein Verhalten nicht änderst:'
			}
		}
	},
	argumentKinds: {
		advantage: {
			missing: { formal: 'Bitte tragen Sie einen Vorteil ein.', informal: 'Bitte trage einen Vorteil ein.' },
			add: 'Neuer Vorteil',
			edit: 'Vorteil bearbeiten',
			placeholder: {
				formal: 'Vorteil hier eintragen. Nutzen Sie für jeden Vorteil einen neuen Eintrag.',
				informal: 'Vorteil hier eintragen. Nutze für jeden Vorteil einen neuen Eintrag.'
			}
		},
		disadvantage: {
			missing: {
				formal: 'Bitte tragen Sie einen Nachteil ein.',
				informal: 'Bitte trage einen Nachteil ein.'
			},
			add: 'Neuer Nachteil',
			edit: 'Nachteil bearbeiten',
			placeholder: {
				formal: 'Nachteil hier eintragen. Nutzen Sie für jeden Nachteil einen neuen Eintrag.',
				informal: 'Nachteil hier eintragen. Nutze für jeden Nachteil einen neuen Eintrag.'
			}
		}
	},
	examples: {
		A: [
			'Ich kriege wieder mehr auf die Reihe.',
			'Ich habe wieder Zeit für Hobbys.',
			'Ich kann wieder klar denken.',
			'Mehr Geld / weniger Schulden.',
			'Mein Körper wird nicht mehr so stark belastet.',
			'Ich fühle mich besser.',
			'Gutes Gefühl, weil ich das Problem angehe.',
			'Weniger Stress mit Freunden / Familie.',
			'Ich kann besser einschlafen.'
		],
		B: [
			'Es wird schwierig mit dem alten Freundeskreis.',
			'Der Rausch wird mir fehlen.',
			'Es könnte ganz schön langweilig werden.',
			'Vieles macht dann deutlich weniger Spaß.',
			'Der Entzug / Verzicht wird hart.',
			'Die Hoffnung auf den großen Gewinn fällt weg.'
		],
		C: [
			'Lustigeres Beisammensein mit Freunden.',
			'Beim Trinken / Spielen / Kiffen habe ich meine Ruhe.',
			'Ich kann mich auch mal richtig „wegschießen“ und alles um mich rum vergessen.',
			'Die Chance auf einen Gewinn bleibt.'
		],
		D: [
			'Ich tue kaum etwas anderes.',
			'Ich lasse viele andere Dinge schleifen.',
			'Ich ärgere mich immer mehr über mich selbst.',
			'Weiterhin Ärger und Streit mit meiner Familie.',
			'Ich komme morgens kaum aus dem Bett.',
			'Schulden bleiben / nehmen weiter zu.',
			'Es geht gesundheitlich weiter bergab.',
			'Mein Leben ist weiterhin auf ein Problem reduziert.'
		]
	},
	tendency: {
		pending: 'Noch nicht berechenbar',
		balanced: 'Ausgeglichen',
		maximum: 'Maximale {side}-Tendenz',
		clear: '{side}-Tendenz',
		slight: 'Leichte {side}-Tendenz'
	},
	resultLabel: 'Ergebnis der Motivationswaage',
	scaleTitle: 'Motivationswaage: {value}, {tendency}',
	scaleInactiveTitle: 'Motivationswaage: noch inaktiv',
	allRatedZero:
		'Alle Argumente sind mit „gar nicht wichtig“ bewertet, die Waage bleibt deshalb noch inaktiv.',
	sidePoints: { one: '{side} {count} Punkt', other: '{side} {count} Punkte' },
	valueWithTendency: '{value}, {tendency}',
	miniInactive: 'Waage noch inaktiv',
	conclusionTitle: 'Mein Fazit',
	conclusionPrompt: {
		formal:
			'Welches Bild ergibt sich für Sie, nachdem Sie alle Argumente gesammelt haben? Welche Schlussfolgerungen ziehen Sie für sich zum momentanen Zeitpunkt?',
		informal:
			'Welches Bild ergibt sich für dich, nachdem du alle Argumente gesammelt hast? Welche Schlussfolgerungen ziehst du für dich zum momentanen Zeitpunkt?'
	},
	saveConclusion: 'Fazit speichern',
	edit: 'Bearbeiten',
	add: 'Hinzufügen',
	noEntriesYet: 'Noch keine Einträge.',
	backToOverview: 'Zur Übersicht der Motivationswaage',
	argumentType: 'Art des Arguments',
	showExamples: 'Beispiele anzeigen',
	hideExamples: 'Beispiele ausblenden',
	allExamplesUsed: 'Alle Beispiele sind schon eingetragen.',
	ratingMissing: {
		formal: 'Bitte bewerten Sie, wie wichtig dieser Aspekt für Sie ist.',
		informal: 'Bitte bewerte, wie wichtig dieser Aspekt für dich ist.'
	},
	saveChange: 'Änderung speichern',
	addEntry: 'Eintrag hinzufügen',
	confirmDelete: 'Diesen Eintrag löschen?',
	delete: 'Löschen',
	editItem: 'Bearbeiten: {text}',
	deleteItem: 'Löschen: {text}',
	finish: 'Beenden',
	counsellor: {
		noArguments: 'Noch keine Argumente eingetragen.',
		conclusion: 'Fazit',
		new: 'Neu',
		noConclusion: 'Noch kein Fazit eingetragen.',
		noEntries: 'Keine Einträge.',
		open: 'Öffnen',
		close: 'Schließen',
		category: 'Kategorie',
		relevance: 'Relevanz',
		relevanceValue: { one: '{label} ({count} Punkt)', other: '{label} ({count} Punkte)' },
		lastChanged: 'Zuletzt geändert'
	},
	pdf: {
		result: 'Ergebnis',
		inactive: 'Die Waage ist noch inaktiv (keine Relevanzpunkte).',
		summary: 'Motivationswert {value} ({tendency}), {pro}, {contra}, Skala von −10 bis +10.',
		conclusion: 'Fazit',
		noConclusion: 'Kein Fazit eingetragen.',
		arguments: 'Argumente',
		noEntries: 'Keine Einträge.',
		rating: '{label} ({count})'
	}
};
