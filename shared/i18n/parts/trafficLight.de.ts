export const trafficLight = {
	levels: {
		red: {
			colourName: 'Rot',
			danger: 'große Gefahr',
			explanation:
				'Finger weg, Suchtgefahr! Bei dieser Medienaktivität ist das Verlieren in der Sucht extrem wahrscheinlich.'
		},
		yellow: {
			colourName: 'Gelb',
			danger: 'mögliche Gefahr',
			explanation: {
				formal:
					'Aufpassen! Diese Medienaktivität könnte gefährlich werden. Sie sollten den Konsum gut beobachten, um eine Sucht zu vermeiden.',
				informal:
					'Aufpassen! Diese Medienaktivität könnte gefährlich werden. Du solltest den Konsum gut beobachten, um eine Sucht zu vermeiden.'
			}
		},
		green: {
			colourName: 'Grün',
			danger: 'keine Gefahr',
			explanation: {
				formal: 'Diese Medienaktivität können Sie ohne Probleme anwenden.',
				informal: 'Diese Medienaktivität kannst du ohne Probleme anwenden.'
			}
		}
	},
	levelLabel: '{colour}: {danger}',
	levelOption: '{danger} ({colour})',
	intro: {
		formal:
			'Diese Übung hilft Ihnen dabei, die Gefährlichkeit einzelner Medienaktivitäten für Sie persönlich einzuschätzen und somit Ihre Konsumkompetenz zu stärken. Mit dem Ampelmodell können Sie Medienaktivitäten in die Kategorien „unbedenklich“, „riskant“ und „keinesfalls zu konsumieren“ einordnen. Die Ampel ist nicht starr, sondern sollte im Verlauf der Beratung immer wieder angepasst werden. Ziel ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, die persönlichen Suchtpotentiale einzelner Aktivitäten möglichst genau verstehen lernen.',
		informal:
			'Diese Übung hilft dir dabei, die Gefährlichkeit einzelner Medienaktivitäten für dich persönlich einzuschätzen und somit deine Konsumkompetenz zu stärken. Mit dem Ampelmodell kannst du Medienaktivitäten in die Kategorien „unbedenklich“, „riskant“ und „keinesfalls zu konsumieren“ einordnen. Die Ampel ist nicht starr, sondern sollte im Verlauf der Beratung immer wieder angepasst werden. Ziel ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, die persönlichen Suchtpotentiale einzelner Aktivitäten möglichst genau verstehen lernst.'
	},
	instructionsTitle: 'Anleitung zum Ausfüllen:',
	instructions: [
		{ formal: 'Tragen Sie eine Medienaktivität ein.', informal: 'Trage eine Medienaktivität ein.' },
		{
			formal: 'Bewerten Sie diese in Bezug auf ihre Suchtgefahr, indem Sie ihr eine Farbe zuordnen.',
			informal: 'Bewerte diese in Bezug auf ihre Suchtgefahr, indem du ihr eine Farbe zuordnest.'
		},
		{
			formal: 'Klicken Sie einen Eintrag an, um diesen zu bearbeiten oder zu löschen.',
			informal: 'Klicke einen Eintrag an, um diesen zu bearbeiten oder zu löschen.'
		}
	],
	explanationsTitle: 'Farberläuterungen:',
	legendLabel: 'Legende',
	lightLabel: 'Ampel',
	activityCount: { one: '{count} Aktivität', other: '{count} Aktivitäten' },
	noActivities: 'Keine Aktivitäten.',
	editActivityLabel: '{text}, {danger}: bearbeiten oder löschen',
	add: '+ Neue Aktivität eintragen',
	newTitle: {
		formal: 'Geben Sie eine neue Medienaktivität ein',
		informal: 'Gib eine neue Medienaktivität ein'
	},
	editTitle: 'Aktivität bearbeiten',
	activityLabel: 'Medienaktivität',
	examplesLabel: 'Beispiele:',
	examples: [
		'Ein Computerspiel spielen',
		'E-Mails schreiben',
		'Einen Film gucken',
		'Online-Banking durchführen',
		'Instagram'
	],
	dangerQuestion: 'Wie hoch ist die Gefahr, dass diese Aktivität zur Sucht führt?',
	missingActivity: {
		formal: 'Bitte tragen Sie eine Medienaktivität ein.',
		informal: 'Bitte trage eine Medienaktivität ein.'
	},
	missingLevel: {
		formal: 'Bitte wählen Sie aus, wie hoch die Gefahr ist.',
		informal: 'Bitte wähle aus, wie hoch die Gefahr ist.'
	},
	cancel: 'Abbrechen',
	save: 'Speichern',
	delete: 'Löschen',
	confirmDeleteLabel: 'Löschen bestätigen',
	confirmDelete: 'Diese Aktivität löschen?',
	empty: 'Noch keine Aktivitäten eingetragen.',
	new: 'Neu',
	pdfLevelHeading: '{colour}: {danger} ({level})',
	demo: {
		red: 'Ein Computerspiel spielen',
		yellow: 'Instagram',
		green: 'E-Mails schreiben'
	}
};
