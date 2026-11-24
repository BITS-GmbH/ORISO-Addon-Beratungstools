import { active } from './parts/active.de.ts';
import { balance } from './parts/balance.de.ts';
import { consumptionDiary } from './parts/consumptionDiary.de.ts';
import { emergencyKit } from './parts/emergencyKit.de.ts';
import { goals } from './parts/goals.de.ts';
import { positivePerception } from './parts/positivePerception.de.ts';
import { relativesDiary } from './parts/relativesDiary.de.ts';
import { riskSituations } from './parts/riskSituations.de.ts';
import { trafficLight } from './parts/trafficLight.de.ts';

export const de = {
	common: {
		saving: 'Wird gespeichert …',
		saved: 'Automatisch gespeichert',
		notSaved: 'Nicht gespeichert',
		weekBack: 'Woche zurück',
		weekForward: 'Woche vor',
		tryLater: {
			formal: 'Bitte versuchen Sie es später noch einmal.',
			informal: 'Bitte versuch es später noch einmal.'
		},
		tryAgain: {
			formal: 'Das hat nicht geklappt. Bitte versuchen Sie es noch einmal.',
			informal: 'Das hat nicht geklappt. Bitte versuch es noch einmal.'
		},
		cancel: 'Abbrechen'
	},
	days: {
		period: '{from} bis {to}',
		minutes: '{minutes} Min.',
		hours: '{hours} Std.',
		hoursMinutes: '{hours} Std. {minutes} Min.',
		time: '{time} Uhr'
	},
	catalog: {
		goals: {
			title: 'Ausgangssituation und Ziele',
			summary: 'Situation beschreiben und ein Ziel für die Beratung festlegen',
			description:
				'Dieses Tool ermöglicht es, die aktuelle Situation in eigenen Worten zu beschreiben und ein konkretes Ziel für die Beratung zu benennen. Die genaue Benennung des persönlichen Ziels hilft Betroffenen dabei, an einer Verbesserung ihrer Situation zu arbeiten. Gleichzeitig bekommt die Beraterin / der Berater mehr Möglichkeiten und Ansatzpunkte, um den Beratungsprozess angemessen zu gestalten. Das persönliche Ziel kann im Laufe der Beratung angepasst werden.'
		},
		'consumption-diary': {
			title: 'Konsumtagebuch',
			summary: 'Konsum oder Glücksspiel Tag für Tag festhalten',
			description:
				'Im Konsumtagebuch können Betroffene ihr Konsum- und/oder Glücksspielverhalten dokumentieren. Dazu gehören Häufigkeit, Menge und Dauer des Konsums oder Glücksspielens, aber auch Gedanken und Gefühle, die mit dem Suchtverhalten zusammenhängen. Wenn Betroffene das Tagebuch ihrer Beraterin / ihrem Berater freischalten wollen, können diese Rückmeldungen zu den Einträgen geben.'
		},
		'relatives-diary': {
			title: 'Tagebuch für Angehörige',
			summary: 'Den Tag mit drei Fragen und einer Stimmung reflektieren',
			description:
				'Mit diesem Tagebuch haben Angehörige die Möglichkeit, die Erlebnisse des Tages anhand von drei Fragen zu reflektieren. Die Fragen helfen dabei, die eigenen Gedanken und Gefühle in Bezug auf das Suchtverhalten des Angehörigen einzuordnen und zu dokumentieren. Sofern Angehörige das Tagebuch ihrem Berater / ihrer Beraterin freischalten, können diese Rückmeldungen zu den Einträgen geben.'
		},
		balance: {
			title: 'Motivationswaage',
			summary: 'Vor- und Nachteile einer Veränderung abwägen',
			description:
				'Die Motivationswaage hilft Betroffenen, Vor- und Nachteile der Überwindung des Suchtverhaltens abzuwägen und zu gewichten. Damit können Unsicherheiten und Bedenken aufgedeckt und klarere Entscheidungen getroffen werden. Sofern Betroffene wollen, können sie ihrer Beraterin / ihrem Berater Einblick in ihre Notizen geben, sodass diese gezielt auf die individuellen Abwägungen eingehen können.'
		},
		'emergency-kit': {
			title: 'Notfallkoffer',
			summary: 'Strategien und Kontakte für kritische Situationen',
			description:
				'Mit diesem Tool können Betroffene ihren persönlichen Notfallkoffer zusammenstellen, der ihnen dabei hilft, in besonders kritischen Situationen einen Rückfall zu vermeiden. Im Notfallkoffer können Kontaktadressen von Berater:innen oder Angehörigen sowie konkrete Handlungsanweisungen und Merksätze hinterlegt werden.'
		},
		active: {
			title: 'Aktiv sein',
			summary: 'Angenehme Aktivitäten planen, auch regelmäßig',
			description:
				'Dieses Tool ermöglicht es Betroffenen, ihren Alltag mit Hilfe von angenehmen Aktivitäten positiv zu gestalten, um die Lebensqualität zu verbessern und den Suchtdruck zu verringern. Aktivitäten können selbst eingetragen oder aus einer Liste mit Vorschlägen gewählt und sowohl einmalig als auch regelmäßig geplant werden.'
		},
		'risk-situations': {
			title: 'Risikosituationen und Kontrollstrategien',
			summary: 'Risikosituationen, Strategien und Rückfälle festhalten',
			description:
				'Mit diesem Tool können sich Betroffene gezielt mit ihren persönlichen Risikosituationen auseinandersetzen und geeignete Kontrollstrategien erarbeiten. Sollten Rückfälle passieren, können diese dokumentiert und die Strategien überarbeitet werden. Sofern Betroffene wollen, können sie ihre Notizen ihrer Beraterin / ihrem Berater zugänglich machen, sodass diese gezielt auf die Risikosituationen und Kontrollstrategien eingehen können.'
		},
		'traffic-light': {
			title: 'Ampelmodell',
			summary: 'Medienaktivitäten nach ihrer Gefahr einordnen',
			description:
				'Das Ampelmodell hilft Betroffenen dabei, die persönliche Gefahr einzelner Medienaktivitäten einzuschätzen und ihre Konsumkompetenz zu stärken. Einzelne Medienaktivitäten können, analog zu einer Ampel, in „grüne“ (unbedenkliche), „gelbe“ (riskante) und „rote“ (sehr riskante) Aktivitäten eingeordnet werden.'
		},
		'positive-perception': {
			title: 'Positives Wahrnehmen',
			summary: 'Für Eltern: Positives im Verhalten des Kindes sehen',
			description:
				'Dieses Tool hilft Eltern, positive Aspekte im Verhalten ihres Kindes bewusster wahrzunehmen, um die Interaktion und Kommunikation mit ihrem Kind zu verbessern. Es informiert über Risiken negativer Kommunikation und über den Einfluss von positiven Verstärkern auf die Gefühle und das Verhalten des Kindes. Eltern können den eigenen Einsatz von Lob reflektieren und positive Kommunikation planen.'
		}
	},
	client: {
		myTools: 'Meine Tools',
		intro: {
			formal:
				'Diese Übungen hat Ihre Beratung für Sie freigeschaltet. Was Sie eintragen, sieht Ihre Beratung nur, wenn Sie es teilen.',
			informal:
				'Diese Übungen hat deine Beratung für dich freigeschaltet. Was du einträgst, sieht deine Beratung nur, wenn du es teilst.'
		},
		loadError: {
			formal: 'Ihre Tools konnten nicht geladen werden.',
			informal: 'Deine Tools konnten nicht geladen werden.'
		},
		noneTitle: 'Noch keine Tools freigeschaltet',
		noneText: {
			formal:
				'Ihre Beraterin oder Ihr Berater kann Ihnen Tools freischalten. Sprechen Sie sie oder ihn gern darauf an.',
			informal:
				'Deine Beraterin oder dein Berater kann dir Tools freischalten. Sprich sie oder ihn gern darauf an.'
		},
		new: 'Neu',
		shared: 'Mit der Beratung geteilt',
		continue: 'Weiter bearbeiten',
		open: 'Öffnen'
	},
	toolPage: {
		loadError: '„{title}“ konnte nicht geladen werden.',
		notReleased: 'Das Tool ist nicht mehr freigeschaltet.',
		notReleasedNotSaved: {
			formal: 'Das Tool ist nicht mehr freigeschaltet. Ihre Eingabe wurde nicht gespeichert.',
			informal: 'Das Tool ist nicht mehr freigeschaltet. Deine Eingabe wurde nicht gespeichert.'
		},
		saveFailed: {
			formal: 'Speichern hat nicht geklappt. Bitte versuchen Sie es noch einmal.',
			informal: 'Speichern hat nicht geklappt. Bitte versuch es noch einmal.'
		},
		pdfFailed: {
			formal: 'Das PDF konnte nicht erstellt werden. Bitte versuchen Sie es noch einmal.',
			informal: 'Das PDF konnte nicht erstellt werden. Bitte versuch es noch einmal.'
		},
		sharedNow: {
			formal: 'Ihre Beratung kann diese Inhalte jetzt einsehen.',
			informal: 'Deine Beratung kann diese Inhalte jetzt einsehen.'
		},
		privateAgain: {
			formal: 'Die Inhalte sind wieder nur für Sie sichtbar.',
			informal: 'Die Inhalte sind wieder nur für dich sichtbar.'
		},
		shareOverline: 'Sichtbarkeit für Berater/in',
		shareLabel: 'Mit meiner Beraterin / meinem Berater teilen',
		shareOn: {
			formal:
				'Ihre Beraterin / Ihr Berater kann Ihre Einträge einsehen und wird über neue Einträge informiert.',
			informal:
				'Deine Beraterin / dein Berater kann deine Einträge einsehen und wird über neue Einträge informiert.'
		},
		shareOff: {
			formal: 'Ihre Einträge sind nur für Sie sichtbar.',
			informal: 'Deine Einträge sind nur für dich sichtbar.'
		},
		notAvailable: 'Dieses Tool ist noch nicht verfügbar.'
	},
	counsellor: {
		loadError: 'Die Tools des Falls konnten nicht geladen werden.',
		openFromCase: 'Bitte öffnen Sie die Tools aus einem Fall heraus.',
		tools: 'Tools',
		released: 'Freigeschaltet',
		releasedTools: 'Freigeschaltete Tools',
		notReleasedYet: 'Noch nicht freigeschaltet',
		notReleasedTools: 'Noch nicht freigeschaltete Tools',
		noTools: 'Für diese Beratungsstelle sind keine Tools eingeschaltet.',
		shared: 'Einsicht freigegeben',
		entriesNotShared: 'Einträge vorhanden, keine Einsicht',
		noEntries: 'Noch keine Einträge',
		newEntries: { one: '{count} neuer Eintrag', other: '{count} neue Einträge' },
		dpa: 'Freischalten gerade nicht möglich: Der Träger hat den aktuellen Auftragsverarbeitungsvertrag noch nicht bestätigt.',
		releasedOn: 'Freigeschaltet am {date}',
		lastChangedOn: 'zuletzt bearbeitet am {date}',
		allTools: 'Alle Tools',
		notReleased: 'Nicht freigeschaltet',
		release: 'Freischalten',
		releasedNotice: '„{title}“ ist freigeschaltet. Die ratsuchende Person wird benachrichtigt.',
		viewEntries: 'Einträge ansehen',
		preview: 'User-Vorschau',
		withdraw: 'Freischaltung aufheben',
		previewHint: 'Die User-Vorschau zeigt das Tool so, wie die ratsuchende Person es sieht, mit Testdaten.',
		withdrawConfirm:
			'Freischaltung aufheben? Das Tool verschwindet für die ratsuchende Person, Sie sehen keine Inhalte mehr. Die Einträge bleiben gespeichert.',
		withdrawButton: 'Aufheben',
		withdrawn: 'Die Freischaltung ist aufgehoben. Die Einträge bleiben gespeichert.'
	},
	entries: {
		back: 'Zur Übersicht',
		noAccess: 'Keine Einsicht',
		loadError: 'Die Einträge konnten nicht geladen werden.',
		revoked:
			'Die ratsuchende Person hat die Einsicht zurückgenommen oder das Tool ist nicht mehr freigeschaltet.',
		exportRevoked: 'Die ratsuchende Person hat die Einsicht zurückgenommen. Ein Export ist nicht möglich.',
		exportFailed: 'Der Export hat nicht geklappt. Bitte versuchen Sie es noch einmal.',
		readOnly: 'Einträge, schreibgeschützt',
		lastChangedOn: 'Zuletzt bearbeitet am {date}',
		noEntries: 'Noch keine Einträge',
		sharedSince: 'Einsicht freigegeben seit {date}',
		exporting: 'Export wird erstellt …',
		createExport: 'Export erstellen',
		exportPdf: 'Als PDF exportieren',
		noView: 'Für dieses Tool gibt es noch keine Ansicht.'
	},
	demo: {
		resetFailed: 'Die Demo konnte nicht zurückgesetzt werden.',
		banner: 'User-Vorschau / Demo: keine Speicherung im realen Fall',
		bannerText:
			'So sehen Ratsuchende das Tool. Ihre Eingaben hier sind Testdaten, getrennt von allen Fällen, und bleiben für Sie erhalten, bis Sie die Demo zurücksetzen.',
		reset: 'Demo zurücksetzen',
		end: 'Vorschau beenden'
	},
	prefs: {
		button: 'Benachrichtigungen',
		saved: 'Ihre Benachrichtigungseinstellungen sind gespeichert.',
		saveFailed: 'Die Einstellungen konnten nicht gespeichert werden.',
		title: 'Benachrichtigungseinstellungen',
		intro:
			'Worüber möchten Sie informiert werden, wenn Ratsuchende ihre Tools mit Ihnen teilen? Gilt für alle Ihre Fälle. Mehrere Änderungen kurz hintereinander werden zusammengefasst.',
		firstShare: 'Erstmalige Freigabe von Tool-Inhalten',
		newEntry: 'Neue Einträge in freigegebenen Tools',
		changedEntry: 'Änderungen an bestehenden Einträgen',
		save: 'Einstellungen speichern'
	},
	profile: {
		loadError: 'Die Tools konnten nicht geladen werden.',
		none: 'Noch keine Tools freigeschaltet.',
		newCount: '{count} neu',
		shared: 'Einsicht freigegeben',
		notShared: 'Keine Einsicht',
		open: 'Tools im Fall öffnen'
	},
	rangePicker: {
		label: 'Zeitraum',
		all: 'Alle Einträge',
		from: 'ab {day}',
		until: 'bis {day}',
		choose: '{label} wählen',
		quick: 'Schnellauswahl',
		thisWeek: 'Diese Woche',
		lastFourWeeks: 'Letzte 4 Wochen',
		previousMonth: 'Vorheriger Monat',
		nextMonth: 'Nächster Monat',
		pickFirst: 'Ersten Tag des Zeitraums wählen.',
		pickLast: 'Ab {day}: jetzt den letzten Tag wählen.'
	},
	planned: {
		title: 'Geplante Aktivitäten diese Woche',
		none: 'Für diese Woche sind keine Aktivitäten geplant.',
		plan: 'Aktivitäten in „Aktiv sein“ planen',
		with: 'mit {name}'
	},
	pdf: {
		brand: 'Beratungstools',
		case: 'Fall',
		createdAt: 'Export erstellt am',
		period: 'Zeitraum der Einträge',
		confidential:
			'Vertraulich. Von der ratsuchenden Person zur Einsicht freigegebene Inhalte, nur zur Verwendung im Beratungskontext.',
		personal: 'Persönliche Unterlage aus den Beratungstools.',
		page: 'Seite {page} von {pages}',
		caseLabel: 'Fall {id}',
		caseWithoutId: 'Fall ohne Kennung',
		noEntries: 'Keine Einträge',
		fileCase: 'fall'
	},
	notifications: {
		someone: 'Eine ratsuchende Person',
		sharedTitle: 'Tool zur Einsicht freigegeben',
		entriesTitle: 'Neue Einträge in einem Tool',
		shared: '{who} hat „{tool}“ zur Einsicht freigegeben.',
		sharedAnd: '{who} hat „{tool}“ zur Einsicht freigegeben und darin {what}.',
		changes: '{who} hat in „{tool}“ {what}.',
		added: 'neue Einträge vorgenommen',
		changed: 'Einträge geändert',
		addedAndChanged: 'neue Einträge vorgenommen und Einträge geändert',
		releasedTitle: 'Neues Tool freigeschaltet',
		released: '„{tool}“ steht ab jetzt unter „Meine Tools“ bereit.'
	},
	audit: {
		released: 'Tool „{tool}“ freigeschaltet',
		withdrawn: 'Freischaltung „{tool}“ aufgehoben',
		exported: 'Einträge aus „{tool}“ als PDF exportiert',
		shared: 'Einsicht in „{tool}“ freigegeben',
		unshared: 'Einsicht in „{tool}“ zurückgenommen'
	},
	manifest: {
		title: 'Tools',
		description:
			'Digitale Beratungstools: Beratende schalten Übungen frei, Ratsuchende bearbeiten sie und teilen sie auf Wunsch mit der Beratung.',
		screenshotOverview: 'Tool-Übersicht im Fall',
		screenshotEntries: 'Geteilte Einträge, schreibgeschützt',
		screenshotBalance: 'Motivationswaage der ratsuchenden Person',
		statReleased: '{tool}: freigeschaltet',
		statStarted: '{tool}: bearbeitet',
		statShared: '{tool}: geteilt'
	},
	goals,
	consumptionDiary,
	relativesDiary,
	balance,
	emergencyKit,
	active,
	riskSituations,
	trafficLight,
	positivePerception
};
