export const consumptionDiary = {
	intro: {
		formal:
			'Das Tagebuch dient dazu, alle Aspekte im Zusammenhang mit der angezielten Verhaltensänderung täglich zu notieren. Wichtig ist es, kontinuierlich dabei zu bleiben und alle relevanten Gedanken und Gefühle ausführlich im Tagebuch zu dokumentieren. Das hilft Ihnen, Ihr Ziel zu erreichen! Je genauer Ihre Beraterin / Ihr Berater sich ein Bild von Ihrer Situation machen kann, desto besser können Sie beraten werden. Deshalb empfehlen wir Ihnen, Ihre Einträge für Ihre Beraterin / Ihren Berater sichtbar zu machen.',
		informal:
			'Das Tagebuch dient dazu, alle Aspekte im Zusammenhang mit der angezielten Verhaltensänderung täglich zu notieren. Wichtig ist es, kontinuierlich dabei zu bleiben und alle relevanten Gedanken und Gefühle ausführlich im Tagebuch zu dokumentieren. Das hilft dir, dein Ziel zu erreichen! Je genauer deine Beraterin / dein Berater sich ein Bild von deiner Situation machen kann, desto besser kannst du beraten werden. Deshalb empfehlen wir dir, deine Einträge für deine Beraterin / deinen Berater sichtbar zu machen.'
	},
	about: 'Über das Konsumtagebuch',
	nav: {
		label: 'Konsumtagebuch',
		week: 'Meine Woche',
		entry: 'Tagebucheintrag',
		settings: 'Einstellungen'
	},
	settings: {
		title: 'Diese Themen dokumentieren:',
		addTopic: 'weiteres Thema hinzufügen',
		pickTopic: {
			formal: 'Bitte wählen Sie mindestens ein Thema.',
			informal: 'Bitte wähle mindestens ein Thema.'
		},
		save: 'Speichern',
		start: 'Tagebuch starten'
	},
	newEntry: {
		title: 'Tagebucheintrag',
		date: 'Datum',
		add: '{topic} Eintrag hinzufügen'
	},
	week: {
		title: 'Meine Woche',
		cell: '{day}: {question}'
	},
	yes: 'ja',
	no: 'nein',
	day: {
		back: 'Zur Wochenübersicht',
		overline: 'Tagebuch | {topic}',
		deleteAll: 'Einträge löschen',
		cancel: 'Abbrechen',
		moreAfterYes: 'mehr Info',
		moreAfterNo: 'Mehr Infos',
		logged: 'Für diesen Tag protokolliert:',
		noPhase: 'bisher kein Eintrag',
		delete: 'Löschen',
		editTitle: 'bearbeiten',
		deleteTitle: 'löschen',
		summary: 'Resümee des Tages',
		ratingHint: {
			formal:
				'Was ist Ihnen heute gut gelungen? Was lief nicht so optimal? Denken Sie dabei an Ihr persönliches Ziel.',
			informal:
				'Was ist dir heute gut gelungen? Was lief nicht so optimal? Denk dabei an dein persönliches Ziel.'
		},
		planQuestion: {
			formal: 'Was nehmen Sie sich für morgen vor?',
			informal: 'Was nimmst du dir für morgen vor?'
		},
		done: 'Fertig',
		save: 'speichern'
	},
	phase: {
		back: 'Zurück zur Tagesübersicht',
		date: 'Datum',
		start: 'Uhrzeit (Beginn)',
		end: 'Uhrzeit (Ende)',
		nothingYet: 'Noch nichts eingetragen.',
		deleteItem: 'Eintrag löschen',
		deleteItemLabel: 'Eintrag löschen: {item}',
		deviceQuestion: {
			formal:
				'Welches Endgerät haben Sie genutzt? (z. B. Computer, Smartphone, Computerspielkonsole/tragbares Computerspielgerät)',
			informal:
				'Welches Endgerät hast du genutzt? (z. B. Computer, Smartphone, Computerspielkonsole/tragbares Computerspielgerät)'
		},
		missingItem: {
			formal: 'Bitte tragen Sie mindestens eine Angabe ein und klicken Sie auf „eintragen“.',
			informal: 'Bitte trage mindestens eine Angabe ein und klicke auf „eintragen“.'
		},
		choose: 'Bitte auswählen',
		group: '{group}:',
		drink: 'Getränk',
		size: 'Größe',
		count: 'Anzahl',
		joints: 'Joints',
		bongs: 'Bongs',
		otherKind: 'Anderes',
		gambling: 'Glücksspiel',
		media: 'Medien',
		hours: 'Dauer: Stunden',
		minutes: 'Minuten',
		add: 'eintragen',
		cancel: 'Abbrechen',
		timeRange: '{start} bis {end} Uhr',
		time: '{time} Uhr',
		when: '{time}:',
		noItems: 'Keine Angaben zum Konsum'
	},
	topics: {
		alcohol: {
			label: 'Alkohol',
			weekQuestion: {
				formal: 'Haben Sie Alkohol getrunken?',
				informal: 'Hast du Alkohol getrunken?'
			},
			dayQuestion: {
				formal: 'Haben Sie heute Alkohol getrunken?',
				informal: 'Hast du heute Alkohol getrunken?'
			},
			pastDayQuestion: {
				formal: 'Haben Sie an diesem Tag Alkohol getrunken?',
				informal: 'Hast du an diesem Tag Alkohol getrunken?'
			},
			ratingQuestion: {
				formal: 'Wie bewerten Sie den heutigen Tag im Hinblick auf Ihren Alkoholkonsum?',
				informal: 'Wie bewertest du den heutigen Tag im Hinblick auf deinen Alkoholkonsum?'
			},
			pastRatingQuestion: {
				formal: 'Wie bewerten Sie diesen Tag im Hinblick auf Ihren Alkoholkonsum?',
				informal: 'Wie bewertest du diesen Tag im Hinblick auf deinen Alkoholkonsum?'
			},
			planHint: {
				formal:
					'Setzen Sie sich für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht trinken, eine Aufgabe erledigen, eine schöne Unternehmung etc.)',
				informal:
					'Setzt du dir für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht trinken, eine Aufgabe erledigen, eine schöne Unternehmung etc.)'
			},
			yesIntro: {
				formal:
					'Protokollieren Sie hier Ihren Alkoholkonsum. Bitte nutzen Sie für jede Konsumsituation/Konsumphase einen neuen Eintrag.',
				informal:
					'Protokolliere hier deinen Alkoholkonsum. Bitte nutze für jede Konsumsituation/Konsumphase einen neuen Eintrag.'
			},
			yesMore: {
				formal:
					'Wenn Sie zum Beispiel mittags und abends getrunken haben, machen Sie zwei Einträge. Wenn Sie in einem Zeitraum mehrere Getränke konsumiert haben, können Sie dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, Ihr Konsumverhalten möglichst genau verstehen lernen, um es erfolgreich zu verändern.',
				informal:
					'Wenn du zum Beispiel mittags und abends getrunken hast, mach zwei Einträge. Wenn du in einem Zeitraum mehrere Getränke konsumiert hast, kannst du dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, dein Konsumverhalten möglichst genau verstehen lernst, um es erfolgreich zu verändern.'
			},
			noIntro: {
				formal:
					'Sie haben heute keinen Alkohol getrunken? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen geholfen hat, nüchtern zu bleiben und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast heute keinen Alkohol getrunken? Wunderbar! Schreib unbedingt auf, was dir geholfen hat, nüchtern zu bleiben und wie es dir dabei ergangen ist.'
			},
			pastNoIntro: {
				formal:
					'Sie haben an diesem Tag keinen Alkohol getrunken? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen geholfen hat, nüchtern zu bleiben und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast an diesem Tag keinen Alkohol getrunken? Wunderbar! Schreib unbedingt auf, was dir geholfen hat, nüchtern zu bleiben und wie es dir dabei ergangen ist.'
			},
			noMore: {
				formal:
					'Vielleicht konnten Sie erfolgreich Ihre Kontrollstrategien anwenden? Ihre Notizen im Tagebuch helfen Ihnen und Ihrer Beraterin / Ihrem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung und ein nüchternes Leben zu erkennen. Wenn Sie nichts eintragen wollen, klicken Sie einfach auf speichern.',
				informal:
					'Vielleicht konntest du erfolgreich deine Kontrollstrategien anwenden? Deine Notizen im Tagebuch helfen dir und deiner Beraterin / deinem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung und ein nüchternes Leben zu erkennen. Wenn du nichts eintragen willst, klick einfach auf speichern.'
			},
			contextQuestion: {
				formal: 'Mit wem und wo haben Sie getrunken?',
				informal: 'Mit wem und wo hast du getrunken?'
			},
			triggerQuestion: 'Warum? Was war der Grund/Auslöser des Konsums?',
			phaseTitle: 'Alkohol: Konsumphase eintragen',
			newPhase: 'neue Konsumphase eintragen',
			editPhase: 'Konsumphase bearbeiten',
			deletePhase: 'Konsumphase löschen',
			deletePhaseQuestion: 'Diese Konsumphase löschen?',
			deleteAllQuestion:
				'Alle für diesen Tag eingetragenen Konsumphasen werden gelöscht. Trotzdem fortfahren?',
			saveLabel: 'Konsumphase speichern',
			loggedLabel: 'Protokollierte Getränke:'
		},
		cannabis: {
			label: 'Cannabis',
			weekQuestion: {
				formal: 'Haben Sie Cannabis konsumiert?',
				informal: 'Hast du Cannabis konsumiert?'
			},
			dayQuestion: {
				formal: 'Haben Sie heute Cannabis konsumiert?',
				informal: 'Hast du heute Cannabis konsumiert?'
			},
			pastDayQuestion: {
				formal: 'Haben Sie an diesem Tag Cannabis konsumiert?',
				informal: 'Hast du an diesem Tag Cannabis konsumiert?'
			},
			ratingQuestion: {
				formal: 'Wie bewerten Sie den heutigen Tag im Hinblick auf Ihren Cannabiskonsum?',
				informal: 'Wie bewertest du den heutigen Tag im Hinblick auf deinen Cannabiskonsum?'
			},
			pastRatingQuestion: {
				formal: 'Wie bewerten Sie diesen Tag im Hinblick auf Ihren Cannabiskonsum?',
				informal: 'Wie bewertest du diesen Tag im Hinblick auf deinen Cannabiskonsum?'
			},
			planHint: {
				formal:
					'Setzen Sie sich für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht kiffen, eine Aufgabe erledigen, eine schöne Unternehmung etc.)',
				informal:
					'Setzt du dir für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht kiffen, eine Aufgabe erledigen, eine schöne Unternehmung etc.)'
			},
			yesIntro: {
				formal:
					'Protokollieren Sie hier Ihren Cannabiskonsum. Bitte nutzen Sie für jede Konsumsituation/Konsumphase einen neuen Eintrag.',
				informal:
					'Protokolliere hier deinen Cannabiskonsum. Bitte nutze für jede Konsumsituation/Konsumphase einen neuen Eintrag.'
			},
			yesMore: {
				formal:
					'Wenn Sie zum Beispiel mittags und abends gekifft haben, machen Sie zwei Einträge. Wenn Sie in einem Zeitraum mehrfach konsumiert haben, können Sie dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, Ihr Konsumverhalten möglichst genau verstehen lernen, um es erfolgreich zu verändern.',
				informal:
					'Wenn du zum Beispiel mittags und abends gekifft hast, mach zwei Einträge. Wenn du in einem Zeitraum mehrfach konsumiert hast, kannst du dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, dein Konsumverhalten möglichst genau verstehen lernst, um es erfolgreich zu verändern.'
			},
			noIntro: {
				formal:
					'Sie haben heute nicht konsumiert? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen geholfen hat, nüchtern zu bleiben und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast heute nicht konsumiert? Wunderbar! Schreib unbedingt auf, was dir geholfen hat, nüchtern zu bleiben und wie es dir dabei ergangen ist.'
			},
			pastNoIntro: {
				formal:
					'Sie haben an diesem Tag nicht konsumiert? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen geholfen hat, nüchtern zu bleiben und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast an diesem Tag nicht konsumiert? Wunderbar! Schreib unbedingt auf, was dir geholfen hat, nüchtern zu bleiben und wie es dir dabei ergangen ist.'
			},
			noMore: {
				formal:
					'Vielleicht konnten Sie erfolgreich Ihre Kontrollstrategien anwenden? Ihre Notizen im Tagebuch helfen Ihnen und Ihrer Beraterin / Ihrem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung und ein nüchternes Leben zu erkennen. Wenn Sie nichts eintragen wollen, klicken Sie einfach auf speichern.',
				informal:
					'Vielleicht konntest du erfolgreich deine Kontrollstrategien anwenden? Deine Notizen im Tagebuch helfen dir und deiner Beraterin / deinem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung und ein nüchternes Leben zu erkennen. Wenn du nichts eintragen willst, klick einfach auf speichern.'
			},
			contextQuestion: {
				formal: 'Mit wem und wo haben Sie gekifft?',
				informal: 'Mit wem und wo hast du gekifft?'
			},
			triggerQuestion: 'Warum? Was war der Grund/Auslöser des Konsums?',
			phaseTitle: 'Cannabis: Konsum eintragen',
			newPhase: 'neue Konsumphase eintragen',
			editPhase: 'Konsumphase bearbeiten',
			deletePhase: 'Konsumphase löschen',
			deletePhaseQuestion: 'Diese Konsumphase löschen?',
			deleteAllQuestion:
				'Alle für diesen Tag eingetragenen Konsumphasen werden gelöscht. Trotzdem fortfahren?',
			saveLabel: 'Konsumphase speichern',
			loggedLabel: 'Protokollierter Konsum:'
		},
		gambling: {
			label: 'Glücksspiel',
			weekQuestion: {
				formal: 'Haben Sie Glücksspiele gespielt?',
				informal: 'Hast du Glücksspiele gespielt?'
			},
			dayQuestion: {
				formal: 'Haben Sie heute gespielt?',
				informal: 'Hast du heute gespielt?'
			},
			pastDayQuestion: {
				formal: 'Haben Sie an diesem Tag gespielt?',
				informal: 'Hast du an diesem Tag gespielt?'
			},
			ratingQuestion: {
				formal: 'Wie bewerten Sie den heutigen Tag im Hinblick auf Ihr Glücksspielverhalten?',
				informal: 'Wie bewertest du den heutigen Tag im Hinblick auf dein Glücksspielverhalten?'
			},
			pastRatingQuestion: {
				formal: 'Wie bewerten Sie diesen Tag im Hinblick auf Ihr Glücksspielverhalten?',
				informal: 'Wie bewertest du diesen Tag im Hinblick auf dein Glücksspielverhalten?'
			},
			planHint: {
				formal:
					'Setzen Sie sich für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht spielen, eine Aufgabe erledigen, eine schöne Unternehmung etc.)',
				informal:
					'Setzt du dir für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht spielen, eine Aufgabe erledigen, eine schöne Unternehmung etc.)'
			},
			yesIntro: {
				formal:
					'Protokollieren Sie hier Ihr Glücksspielverhalten. Bitte nutzen Sie für jede Phase in der Sie gespielt haben einen neuen Eintrag.',
				informal:
					'Protokolliere hier dein Glücksspielverhalten. Bitte nutze für jede Phase, in der du gespielt hast, einen neuen Eintrag.'
			},
			yesMore: {
				formal:
					'Wenn Sie zum Beispiel mittags und abends gespielt haben, machen Sie zwei Einträge. Wenn Sie in einem Zeitraum mehrere Glücksspielarten genutzt haben, können Sie diese in einer Spielphase eintragen. Das Ziel des Tagebuchs ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, Ihr Konsumverhalten möglichst genau verstehen lernen, um es erfolgreich zu verändern.',
				informal:
					'Wenn du zum Beispiel mittags und abends gespielt hast, mach zwei Einträge. Wenn du in einem Zeitraum mehrere Glücksspielarten genutzt hast, kannst du diese in einer Spielphase eintragen. Das Ziel des Tagebuchs ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, dein Konsumverhalten möglichst genau verstehen lernst, um es erfolgreich zu verändern.'
			},
			noIntro: {
				formal:
					'Sie haben heute keine Glücksspiele gespielt? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen geholfen hat, spielfrei zu bleiben und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast heute keine Glücksspiele gespielt? Wunderbar! Schreib unbedingt auf, was dir geholfen hat, spielfrei zu bleiben und wie es dir dabei ergangen ist.'
			},
			pastNoIntro: {
				formal:
					'Sie haben an diesem Tag keine Glücksspiele gespielt? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen geholfen hat, spielfrei zu bleiben und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast an diesem Tag keine Glücksspiele gespielt? Wunderbar! Schreib unbedingt auf, was dir geholfen hat, spielfrei zu bleiben und wie es dir dabei ergangen ist.'
			},
			noMore: {
				formal:
					'Vielleicht konnten Sie erfolgreich Ihre Kontrollstrategien anwenden? Ihre Notizen im Tagebuch helfen Ihnen und Ihrer Beraterin / Ihrem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung und ein spielfreies Leben zu erkennen. Wenn Sie nichts eintragen wollen, klicken Sie einfach auf speichern.',
				informal:
					'Vielleicht konntest du erfolgreich deine Kontrollstrategien anwenden? Deine Notizen im Tagebuch helfen dir und deiner Beraterin / deinem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung und ein spielfreies Leben zu erkennen. Wenn du nichts eintragen willst, klick einfach auf speichern.'
			},
			contextQuestion: {
				formal: 'Wo und mit wem haben Sie gespielt?',
				informal: 'Wo und mit wem hast du gespielt?'
			},
			triggerQuestion: 'Warum? Was war der Grund/Auslöser für das Glücksspielen?',
			phaseTitle: 'Glücksspiele eintragen',
			newPhase: 'neue Spielphase eintragen',
			editPhase: 'Spielphase bearbeiten',
			deletePhase: 'Spielphase löschen',
			deletePhaseQuestion: 'Diese Spielphase löschen?',
			deleteAllQuestion:
				'Alle für diesen Tag eingetragenen Spielphasen werden gelöscht. Trotzdem fortfahren?',
			saveLabel: 'Eintrag speichern',
			loggedLabel: 'Protokollierte Glücksspiele:'
		},
		media: {
			label: 'Medien',
			weekQuestion: {
				formal: 'Haben Sie Medien genutzt?',
				informal: 'Hast du Medien genutzt?'
			},
			dayQuestion: {
				formal: 'Haben Sie heute Medien genutzt?',
				informal: 'Hast du heute Medien genutzt?'
			},
			pastDayQuestion: {
				formal: 'Haben Sie an diesem Tag Medien genutzt?',
				informal: 'Hast du an diesem Tag Medien genutzt?'
			},
			ratingQuestion: {
				formal: 'Wie bewerten Sie den heutigen Tag im Hinblick auf Ihren Medienkonsum?',
				informal: 'Wie bewertest du den heutigen Tag im Hinblick auf deinen Medienkonsum?'
			},
			pastRatingQuestion: {
				formal: 'Wie bewerten Sie diesen Tag im Hinblick auf Ihren Medienkonsum?',
				informal: 'Wie bewertest du diesen Tag im Hinblick auf deinen Medienkonsum?'
			},
			planHint: {
				formal:
					'Setzen Sie sich für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht spielen, eine Aufgabe erledigen, eine schöne Unternehmung etc.)',
				informal:
					'Setzt du dir für den nächsten Tag eine Aufgabe bzw. ein Kleinziel? (Beispiel: nicht spielen, eine Aufgabe erledigen, eine schöne Unternehmung etc.)'
			},
			yesIntro: {
				formal:
					'Protokollieren Sie hier Ihren Medienkonsum. Bitte nutzen Sie für jede Konsumsituation/Konsumphase einen neuen Eintrag.',
				informal:
					'Protokolliere hier deinen Medienkonsum. Bitte nutze für jede Konsumsituation/Konsumphase einen neuen Eintrag.'
			},
			yesMore: {
				formal:
					'Wenn Sie zum Beispiel mittags und abends Medien genutzt haben, machen Sie zwei Einträge. Wenn Sie in einem Zeitraum mehrere Medien konsumiert haben, können Sie dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, Ihr Mediennutzungsverhalten möglichst genau verstehen lernen, um es erfolgreich zu verändern.',
				informal:
					'Wenn du zum Beispiel mittags und abends Medien genutzt hast, mach zwei Einträge. Wenn du in einem Zeitraum mehrere Medien konsumiert hast, kannst du dies als eine Konsumphase eintragen. Das Ziel des Tagebuchs ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, dein Mediennutzungsverhalten möglichst genau verstehen lernst, um es erfolgreich zu verändern.'
			},
			noIntro: {
				formal:
					'Sie haben heute keine Medien genutzt? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen dabei geholfen hat und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast heute keine Medien genutzt? Wunderbar! Schreib unbedingt auf, was dir dabei geholfen hat und wie es dir dabei ergangen ist.'
			},
			pastNoIntro: {
				formal:
					'Sie haben an diesem Tag keine Medien genutzt? Wunderbar! Schreiben Sie unbedingt auf, was Ihnen dabei geholfen hat und wie es Ihnen dabei ergangen ist.',
				informal:
					'Du hast an diesem Tag keine Medien genutzt? Wunderbar! Schreib unbedingt auf, was dir dabei geholfen hat und wie es dir dabei ergangen ist.'
			},
			noMore: {
				formal:
					'Vielleicht konnten Sie erfolgreich Ihre Kontrollstrategien anwenden? Ihre Notizen im Tagebuch helfen Ihnen und Ihrer Beraterin / Ihrem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung zu erkennen. Wenn Sie nichts eintragen wollen, klicken Sie einfach auf speichern.',
				informal:
					'Vielleicht konntest du erfolgreich deine Kontrollstrategien anwenden? Deine Notizen im Tagebuch helfen dir und deiner Beraterin / deinem Berater, besonders erfolgreiche Strategien für eine nachhaltige Verhaltensänderung zu erkennen. Wenn du nichts eintragen willst, klick einfach auf speichern.'
			},
			contextQuestion: {
				formal: 'Wo und mit wem haben Sie Medien genutzt?',
				informal: 'Wo und mit wem hast du Medien genutzt?'
			},
			triggerQuestion: 'Warum? Was war der Grund/Auslöser für die Mediennutzung?',
			phaseTitle: 'Medienkonsum eintragen',
			newPhase: 'neue Medienphase eintragen',
			editPhase: 'Medienphase bearbeiten',
			deletePhase: 'Medienphase löschen',
			deletePhaseQuestion: 'Diese Medienphase löschen?',
			deleteAllQuestion:
				'Alle für diesen Tag eingetragenen Medienphasen werden gelöscht. Trotzdem fortfahren?',
			saveLabel: 'Eintrag speichern',
			loggedLabel: 'Protokollierter Konsum von Medien:'
		}
	},
	drinks: {
		beer: 'Bier',
		wine: 'Wein / Sekt',
		spirits: 'Schnaps',
		liqueur: 'Likör',
		'beer-mix': 'Biermixgetränke',
		alcopop: 'Alkopops'
	},
	cannabisUnits: {
		joint: 'Joint',
		bong: 'Bong'
	},
	gameGroups: {
		local: 'Glücksspiele vor Ort',
		online: 'Online / über das Internet'
	},
	games: {
		'slot-arcade': 'Geldspielautomaten in Spielhallen',
		'slot-gastro': 'Geldspielautomaten in der Gastronomie',
		'casino-small': 'Kleines Spiel in der Spielbank',
		'casino-large': 'Großes Spiel in der Spielbank',
		sports: 'Sportwetten',
		horses: 'Pferdewetten',
		lottery: 'Lotterien',
		'other-local': 'Andere Glücksspiele vor Ort',
		'online-slots': 'Online-Automatenspiel (Geld-/Glücksspielautomaten)',
		'online-casino': 'Online-Casinospiele (großes Spiel in der Spielbank, mit Ausnahme von Poker)',
		'online-poker': 'Online-Poker',
		'online-sports': 'Online-Sportwetten',
		'online-horses': 'Online-Pferdewetten',
		'online-lottery': 'Online-Lotterien',
		'online-other': 'Andere Onlineglücksspiele'
	},
	mediaGroups: {
		games: 'Onlinespiele',
		communication: 'Kommunikation übers Internet',
		social: 'Soziale Netzwerke (z. B. TikTok, Instagram, WhatsApp, Telegram, Facebook)',
		surfing: 'Surfen im Internet',
		more: 'Weitere Medienaktivitäten'
	},
	media: {
		action: 'Actionspiele (z. B. Jump ’n’ Run, Beat’em ups, Action-Adventure)',
		shooter: 'Ego-Shooter',
		rpg: 'Rollenspiele (z. B. MMORPGs, Online- und Offline-Rollenspiele)',
		strategy: 'Strategiespiele (z. B. Echtzeit-Strategiespiele, Aufbauspiele)',
		'sports-games': 'Sportspiele (z. B. Managerspiele, Sportsimulation)',
		simulation: 'Simulationsspiele (z. B. Flugsimulation, Autorennsimulation, Lebenssimulation)',
		'music-games': 'Musik- und Tanzspiele (z. B. Just Dance Now, SingStar, Let’s Sing)',
		skill: 'Geschicklichkeitsspiele (z. B. Tetris)',
		chat: 'Chatten',
		mail: 'Emails schreiben',
		'social-watch': 'Videos / Bilder angucken',
		'social-talk': 'Austausch mit anderen Personen',
		research: 'Recherche',
		shopping: 'Einkaufen',
		magazines: 'Online-Magazine',
		streaming: 'Online-Streaming (z. B. Netflix, Mediatheken, Amazon Prime)',
		porn: 'Porno-Websites',
		device: 'Computer / Gerät optimieren',
		'other-media': 'andere Nutzung elektronischer Medien'
	},
	items: {
		alcohol: '{count}x {size} {drink}',
		cannabis: '{count}x {unit}',
		otherKind: 'Anderes: {text}',
		otherKindCount: 'Anderes: {count}x {text}',
		duration: '{activity}, {duration}'
	},
	sums: {
		phases: {
			one: '{count} Phase',
			other: '{count} Phasen'
		},
		drinks: {
			one: '{count} Getränk',
			other: '{count} Getränke'
		},
		alcohol: '{drinks}, ca. {grams} g Alkohol',
		joints: {
			one: '{count} Joint',
			other: '{count} Joints'
		},
		bongs: {
			one: '{count} Bong',
			other: '{count} Bongs'
		},
		otherKind: '{count}x Anderes'
	},
	counsellor: {
		noEntries: 'Noch keine Einträge.',
		topics: 'Dokumentierte Themen: {topics}',
		new: 'Neu',
		noDayEntries: 'Keine Einträge',
		tileTopic: '{topic}:',
		noConsumption: 'Kein Konsum eingetragen',
		entriesOf: 'Einträge vom {day}',
		answerYes: '{topic}: ja',
		answerNo: '{topic}: nein',
		device: 'Endgerät',
		context: 'Wo und mit wem',
		trigger: 'Grund/Auslöser',
		rating: 'Bewertung des Tages',
		plan: 'Vorhaben für morgen',
		summaryNew: 'Resümee neu'
	},
	pdf: {
		noEntries: 'Keine Einträge in diesem Zeitraum.',
		topics: 'Dokumentierte Themen: {topics}',
		answerYes: '{topic}: ja ({sum})',
		answerNo: '{topic}: nein',
		device: 'Endgerät: {device}',
		context: 'Wo und mit wem: {context}',
		trigger: 'Grund/Auslöser: {trigger}',
		rating: 'Bewertung des Tages',
		plan: 'Vorhaben für morgen'
	},
	demo: {
		alcoholRating: 'Nach dem Streit habe ich mehr getrunken als geplant.',
		alcoholPlan: 'Nach der Arbeit direkt nach Hause gehen.',
		alcoholContext: 'Zu Hause, allein',
		alcoholTrigger: 'Streit am Telefon',
		gamblingRating: 'Kein Geld eingesteckt, das hat geholfen.',
		soberRating: 'Abends Sport gemacht statt Bier.',
		soberPlan: 'Wieder zum Sport gehen.',
		gamblingContext: 'Im Bus und zu Hause',
		gamblingTrigger: 'Langeweile'
	}
};
