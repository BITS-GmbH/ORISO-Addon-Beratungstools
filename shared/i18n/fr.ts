import type { Catalogue } from './types.ts';

export const fr: Catalogue = {
	common: {
		saving: 'Enregistrement …',
		saved: 'Enregistré automatiquement',
		notSaved: 'Non enregistré',
		weekBack: 'Semaine précédente',
		weekForward: 'Semaine suivante',
		tryLater: 'Veuillez réessayer plus tard.',
		tryAgain: 'Cela n’a pas fonctionné. Veuillez réessayer.',
		cancel: 'Annuler'
	},
	days: {
		period: 'du {from} au {to}',
		minutes: '{minutes} min',
		hours: '{hours} h',
		hoursMinutes: '{hours} h {minutes} min',
		time: '{time}',
		weekdays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
		weekdaysShort: ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'],
		months: [
			'janvier',
			'février',
			'mars',
			'avril',
			'mai',
			'juin',
			'juillet',
			'août',
			'septembre',
			'octobre',
			'novembre',
			'décembre'
		],
		weekdayDate: '{weekday} {date}',
		monthYear: '{month} {year}'
	},
	catalog: {
		goals: {
			title: 'Point de départ et objectifs',
			summary: 'Décrire la situation et fixer un objectif pour l’accompagnement',
			description:
				'Cet outil permet de décrire la situation actuelle avec ses propres mots et de formuler un objectif concret pour l’accompagnement. Nommer précisément son objectif personnel aide les personnes concernées à travailler à l’amélioration de leur situation. En même temps, la conseillère ou le conseiller dispose ainsi de plus de possibilités et de points d’appui pour adapter l’accompagnement. L’objectif personnel peut être ajusté au fil de l’accompagnement.'
		},
		'consumption-diary': {
			title: 'Journal de consommation',
			summary: 'Noter jour après jour sa consommation ou sa pratique des jeux d’argent',
			description:
				'Dans le journal de consommation, les personnes concernées peuvent noter leur consommation et/ou leur pratique des jeux d’argent et de hasard. Cela comprend la fréquence, la quantité et la durée de la consommation ou du jeu, mais aussi les pensées et les émotions liées au comportement addictif. Si elles souhaitent donner accès au journal à leur conseillère ou à leur conseiller, celle-ci ou celui-ci peut leur faire un retour sur les entrées.'
		},
		'relatives-diary': {
			title: 'Journal pour les proches',
			summary: 'Faire le point sur la journée avec trois questions et une humeur',
			description:
				'Grâce à ce journal, les proches ont la possibilité de revenir sur les événements de la journée à l’aide de trois questions. Ces questions les aident à mettre de l’ordre dans leurs pensées et leurs émotions liées au comportement addictif de leur proche et à les noter. Si les proches donnent accès au journal à leur conseillère ou à leur conseiller, celle-ci ou celui-ci peut leur faire un retour sur les entrées.'
		},
		balance: {
			title: 'Balance décisionnelle',
			summary: 'Peser les avantages et les inconvénients d’un changement',
			description:
				'La balance décisionnelle aide les personnes concernées à peser et à évaluer les avantages et les inconvénients d’un arrêt du comportement addictif. Cela permet de mettre au jour des incertitudes et des réticences et de prendre des décisions plus claires. Si elles le souhaitent, elles peuvent donner à leur conseillère ou à leur conseiller un aperçu de leurs notes, afin que celle-ci ou celui-ci puisse revenir de manière ciblée sur leurs réflexions personnelles.'
		},
		'emergency-kit': {
			title: 'Trousse d’urgence',
			summary: 'Stratégies et contacts pour les situations critiques',
			description:
				'Avec cet outil, les personnes concernées peuvent composer leur trousse d’urgence personnelle, qui les aide à éviter une rechute dans les situations particulièrement critiques. La trousse d’urgence peut contenir les coordonnées de conseillères et conseillers ou de proches, ainsi que des consignes concrètes et des phrases à retenir.'
		},
		active: {
			title: 'Être actif ou active',
			summary: 'Planifier des activités agréables, ponctuelles ou régulières',
			description:
				'Cet outil permet aux personnes concernées d’organiser leur quotidien de façon positive grâce à des activités agréables, afin d’améliorer leur qualité de vie et de réduire l’envie de consommer. Les activités peuvent être saisies librement ou choisies dans une liste de suggestions, et planifiées une seule fois ou de manière régulière.'
		},
		'risk-situations': {
			title: 'Situations à risque et stratégies de contrôle',
			summary: 'Noter les situations à risque, les stratégies et les rechutes',
			description:
				'Avec cet outil, les personnes concernées peuvent examiner de près leurs situations à risque personnelles et élaborer des stratégies de contrôle adaptées. Si des rechutes surviennent, elles peuvent être notées et les stratégies retravaillées. Si elles le souhaitent, les personnes concernées peuvent rendre leurs notes accessibles à leur conseillère ou à leur conseiller, afin que celle-ci ou celui-ci puisse revenir de manière ciblée sur les situations à risque et les stratégies de contrôle.'
		},
		'traffic-light': {
			title: 'Modèle des feux tricolores',
			summary: 'Classer les activités médiatiques selon leur risque',
			description:
				'Le modèle des feux tricolores aide les personnes concernées à évaluer le risque personnel de chacune de leurs activités médiatiques et à renforcer leur capacité à utiliser les médias de façon maîtrisée. Comme pour un feu de circulation, les activités médiatiques peuvent être classées en activités « vertes » (sans danger), « orange » (à risque) et « rouges » (très risquées).'
		},
		'positive-perception': {
			title: 'Voir le positif',
			summary: 'Pour les parents : voir le positif dans le comportement de l’enfant',
			description:
				'Cet outil aide les parents à percevoir plus consciemment les aspects positifs du comportement de leur enfant, afin d’améliorer les échanges et la communication avec lui. Il informe sur les risques d’une communication négative et sur l’influence du renforcement positif sur les émotions et le comportement de l’enfant. Les parents peuvent réfléchir à la manière dont ils utilisent les compliments et planifier une communication positive.'
		}
	},
	client: {
		myTools: 'Mes outils',
		intro:
			'Votre conseillère ou votre conseiller a activé ces exercices pour vous. Ce que vous y saisissez n’est visible pour elle ou lui que si vous le partagez.',
		loadError: 'Vos outils n’ont pas pu être chargés.',
		noneTitle: 'Aucun outil activé pour le moment',
		noneText:
			'Votre conseillère ou votre conseiller peut activer des outils pour vous. N’hésitez pas à lui en parler.',
		new: 'Nouveau',
		shared: 'Partagé avec le service de conseil',
		continue: 'Continuer',
		open: 'Ouvrir'
	},
	toolPage: {
		loadError: '« {title} » n’a pas pu être chargé.',
		notReleased: 'Cet outil n’est plus activé.',
		notReleasedNotSaved: 'Cet outil n’est plus activé. Votre saisie n’a pas été enregistrée.',
		saveFailed: 'L’enregistrement n’a pas fonctionné. Veuillez réessayer.',
		pdfFailed: 'Le PDF n’a pas pu être créé. Veuillez réessayer.',
		sharedNow: 'Votre conseillère ou votre conseiller peut désormais consulter ces contenus.',
		privateAgain: 'Les contenus sont de nouveau visibles uniquement par vous.',
		shareOverline: 'Visibilité pour la conseillère ou le conseiller',
		shareLabel: 'Partager avec ma conseillère ou mon conseiller',
		shareOn:
			'Votre conseillère ou votre conseiller peut consulter vos entrées et reçoit une notification en cas de nouvelles entrées.',
		shareOff: 'Vos entrées sont visibles uniquement par vous.',
		notAvailable: 'Cet outil n’est pas encore disponible.'
	},
	counsellor: {
		loadError: 'Les outils de ce dossier n’ont pas pu être chargés.',
		openFromCase: 'Veuillez ouvrir les outils depuis un dossier.',
		tools: 'Outils',
		released: 'Activé',
		releasedTools: 'Outils activés',
		notReleasedYet: 'Pas encore activé',
		notReleasedTools: 'Outils pas encore activés',
		noTools: 'Aucun outil n’est disponible pour ce service de consultation.',
		shared: 'Accès autorisé',
		entriesNotShared: 'Entrées existantes, accès non autorisé',
		noEntries: 'Pas encore d’entrées',
		newEntries: { one: '{count} nouvelle entrée', other: '{count} nouvelles entrées' },
		dpa: 'Activation impossible pour le moment : l’organisme gestionnaire n’a pas encore confirmé le contrat de sous-traitance des données en vigueur.',
		releasedOn: 'Activé le {date}',
		lastChangedOn: 'dernière modification le {date}',
		allTools: 'Tous les outils',
		notReleased: 'Non activé',
		release: 'Activer',
		releasedNotice: '« {title} » est activé. La personne accompagnée en sera informée.',
		viewEntries: 'Voir les entrées',
		preview: 'Aperçu utilisateur',
		withdraw: 'Désactiver',
		previewHint:
			'L’aperçu utilisateur montre l’outil tel que la personne accompagnée le voit, avec des données de test.',
		withdrawConfirm:
			'Désactiver l’outil ? L’outil disparaît pour la personne accompagnée et vous ne voyez plus aucun contenu. Les entrées restent enregistrées.',
		withdrawButton: 'Désactiver',
		withdrawn: 'L’outil est désactivé. Les entrées restent enregistrées.'
	},
	entries: {
		back: 'Retour à la vue d’ensemble',
		noAccess: 'Accès non autorisé',
		loadError: 'Les entrées n’ont pas pu être chargées.',
		revoked: 'La personne accompagnée a retiré l’accès ou l’outil n’est plus activé.',
		exportRevoked: 'La personne accompagnée a retiré l’accès. L’export n’est pas possible.',
		exportFailed: 'L’export n’a pas fonctionné. Veuillez réessayer.',
		readOnly: 'Entrées, en lecture seule',
		lastChangedOn: 'Dernière modification le {date}',
		noEntries: 'Pas encore d’entrées',
		sharedSince: 'Accès autorisé depuis le {date}',
		exporting: 'Création de l’export …',
		createExport: 'Créer un export',
		exportPdf: 'Exporter en PDF',
		noView: 'Il n’existe pas encore de vue pour cet outil.'
	},
	demo: {
		resetFailed: 'La démo n’a pas pu être réinitialisée.',
		banner: 'Aperçu utilisateur / démo : rien n’est enregistré dans un dossier réel',
		bannerText:
			'Voici comment les personnes accompagnées voient l’outil. Ce que vous saisissez ici sont des données de test, séparées de tous les dossiers, qui sont conservées pour vous jusqu’à ce que vous réinitialisiez la démo.',
		reset: 'Réinitialiser la démo',
		end: 'Quitter l’aperçu'
	},
	prefs: {
		button: 'Notifications',
		saved: 'Vos paramètres de notification sont enregistrés.',
		saveFailed: 'Les paramètres n’ont pas pu être enregistrés.',
		title: 'Paramètres de notification',
		intro:
			'Pour quels événements souhaitez-vous recevoir une notification lorsque des personnes accompagnées partagent leurs outils avec vous ? Cela s’applique à tous vos dossiers. Plusieurs modifications rapprochées sont regroupées.',
		firstShare: 'Premier partage de contenus d’un outil',
		newEntry: 'Nouvelles entrées dans les outils partagés',
		changedEntry: 'Modifications d’entrées existantes',
		save: 'Enregistrer les paramètres'
	},
	profile: {
		loadError: 'Les outils n’ont pas pu être chargés.',
		none: 'Aucun outil activé pour le moment.',
		newCount: '{count} nouveau(x)',
		shared: 'Accès autorisé',
		notShared: 'Accès non autorisé',
		open: 'Ouvrir les outils dans le dossier'
	},
	rangePicker: {
		label: 'Période',
		all: 'Toutes les entrées',
		from: 'à partir du {day}',
		until: 'jusqu’au {day}',
		choose: 'Choisir : {label}',
		quick: 'Sélection rapide',
		thisWeek: 'Cette semaine',
		lastFourWeeks: '4 dernières semaines',
		previousMonth: 'Mois précédent',
		nextMonth: 'Mois suivant',
		pickFirst: 'Choisissez le premier jour de la période.',
		pickLast: 'À partir du {day} : choisissez maintenant le dernier jour.'
	},
	planned: {
		title: 'Activités prévues cette semaine',
		none: 'Aucune activité n’est prévue pour cette semaine.',
		plan: 'Planifier des activités dans « Être actif ou active »',
		with: 'avec {name}'
	},
	pdf: {
		brand: 'Outils de conseil',
		case: 'Dossier',
		createdAt: 'Export créé le',
		period: 'Période des entrées',
		confidential:
			'Confidentiel. Contenus que la personne accompagnée a choisi de rendre accessibles, à utiliser uniquement dans le cadre de l’accompagnement.',
		personal: 'Document personnel issu des outils de conseil.',
		page: 'Page {page} sur {pages}',
		caseLabel: 'Dossier {id}',
		caseWithoutId: 'Dossier sans identifiant',
		noEntries: 'Aucune entrée',
		fileCase: 'dossier'
	},
	notifications: {
		someone: 'Une personne accompagnée',
		sharedTitle: 'Accès à un outil autorisé',
		entriesTitle: 'Nouvelles entrées dans un outil',
		shared: '{who} vous a donné accès à « {tool} ».',
		sharedAnd: '{who} vous a donné accès à « {tool} » et y a {what}.',
		changes: 'Dans « {tool} », {who} a {what}.',
		added: 'ajouté de nouvelles entrées',
		changed: 'modifié des entrées',
		addedAndChanged: 'ajouté de nouvelles entrées et modifié des entrées',
		releasedTitle: 'Nouvel outil activé',
		released: '« {tool} » est désormais disponible dans « Mes outils ».'
	},
	audit: {
		released: 'Outil « {tool} » activé',
		withdrawn: 'Outil « {tool} » désactivé',
		exported: 'Entrées de « {tool} » exportées en PDF',
		shared: 'Accès à « {tool} » autorisé',
		unshared: 'Accès à « {tool} » retiré'
	},
	manifest: {
		title: 'Outils',
		description:
			'Outils numériques de conseil : les conseillères et conseillers activent des exercices, les personnes accompagnées les remplissent et les partagent si elles le souhaitent.',
		screenshotOverview: 'Vue d’ensemble des outils dans le dossier',
		screenshotEntries: 'Entrées partagées, en lecture seule',
		screenshotBalance: 'Balance décisionnelle de la personne accompagnée',
		statReleased: '{tool} : activé',
		statStarted: '{tool} : rempli',
		statShared: '{tool} : partagé'
	},
	goals: {
		steps: {
			situation: {
				section: 'Situation actuelle',
				title: 'Question 1 sur 4 : quelle est votre situation actuelle ?',
				hint: [
					'Veuillez décrire brièvement',
					'• votre propre consommation ou pratique des jeux d’argent, ou',
					'• les principaux sujets ou conflits dans votre relation avec un ou une proche qui consomme ou qui joue.'
				],
				summary: 'Votre situation actuelle',
				counsellorLabel: 'Situation actuelle'
			},
			factors: {
				section: 'Facteurs de maintien',
				title: 'Question 2 sur 4 : quels sont les aspects positifs de la situation actuelle ?',
				hint: [
					'Quels effets positifs la consommation de substances, les jeux d’argent ou l’usage des médias ont-ils pour vous ? Selon vous, quelles motivations jouent un rôle pour vous lorsque vous consommez ou jouez ? Quelles raisons pourrait-il y avoir de ne rien changer à la situation actuelle ?'
				],
				summary: 'Facteurs qui rendent un changement difficile',
				counsellorLabel: 'Facteurs qui rendent un changement difficile'
			},
			motivation: {
				section: 'Motivation au changement',
				title: 'Question 3 sur 4 : pourquoi voulez-vous changer quelque chose à la situation actuelle ?',
				hint: [
					'Qu’est-ce qui vous dérange ou vous pèse ? Quelles choses ne se passent pas comme vous le souhaiteriez ?'
				],
				summary: 'Raisons et motivations pour changer la situation',
				counsellorLabel: 'Raisons et motivations pour changer la situation'
			},
			resources: {
				section: 'Ressources personnelles',
				title: 'Question 4 sur 4 : qui ou qu’est-ce qui pourrait vous aider dans votre projet ?',
				hint: [
					'Avez-vous des loisirs qui vous changent les idées, ou des amis ou des proches qui peuvent vous soutenir ?'
				],
				summary: 'Vos ressources personnelles',
				counsellorLabel: 'Ressources personnelles'
			},
			goal: {
				section: 'Formulation de l’objectif',
				title: 'Avant de commencer : formulez votre objectif',
				hint: [
					'Pour pouvoir travailler avec détermination à l’amélioration de votre situation au cours des prochaines semaines, il est important de nommer votre objectif personnel aussi précisément que possible. Que souhaitez-vous atteindre au cours des prochaines semaines ? Sur quoi l’accompagnement devrait-il vous soutenir ?',
					'Quel objectif concret visez-vous ? (Vous pourrez encore modifier votre réponse plus tard.)'
				],
				summary: 'Votre objectif personnel',
				counsellorLabel: 'Objectif personnel'
			}
		},
		start:
			'Veuillez décrire votre situation actuelle à l’aide des questions suivantes. Pensez à la raison pour laquelle vous avez sollicité un accompagnement. Vos réponses aident à évaluer quels exercices vous seront particulièrement utiles. Les retours de votre conseillère ou de votre conseiller pourront aussi mieux tenir compte de votre situation réelle.',
		startButton: 'C’est parti',
		summaryTitle: 'Récapitulatif',
		summaryText:
			'Vous avez examiné en détail votre situation actuelle et formulé un objectif concret. C’est une première étape importante pour améliorer la situation. Si besoin, vous pouvez modifier vos réponses à tout moment. Je vous accompagne volontiers dans cette démarche.',
		overview: 'Vos réponses en un coup d’œil :',
		edit: 'Modifier',
		editLabel: 'Modifier : {label}',
		empty: 'Pas encore de réponse',
		restart: 'Tout reprendre depuis le début',
		home: 'Ma page d’accueil',
		autosave: 'Vos réponses sont enregistrées automatiquement.',
		back: 'Retour',
		toSummary: 'Vers le récapitulatif',
		next: 'Suivant',
		new: 'Nouveau',
		lastChanged: 'Dernière modification le {date}',
		noAnswer: 'Pas de réponse',
		noAnswers: 'Pas encore de réponses.',
		reminder: 'Remplir « Point de départ et objectifs »',
		demoSituation:
			'Depuis quelques mois, je bois presque tous les soirs, le plus souvent deux ou trois bières.'
	},
	consumptionDiary: {
		intro:
			'Le journal sert à noter chaque jour tout ce qui est lié au changement de comportement que vous visez. Il est important de le tenir régulièrement et d’y noter en détail toutes les pensées et émotions importantes. Cela vous aide à atteindre votre objectif ! Plus votre conseillère ou votre conseiller peut se faire une idée précise de votre situation, mieux elle ou il peut vous accompagner. C’est pourquoi nous vous recommandons de rendre vos entrées visibles pour votre conseillère ou votre conseiller.',
		about: 'À propos du journal de consommation',
		nav: {
			label: 'Journal de consommation',
			week: 'Ma semaine',
			entry: 'Entrée du journal',
			settings: 'Paramètres'
		},
		settings: {
			title: 'Noter ces thèmes :',
			addTopic: 'Ajouter un autre thème',
			pickTopic: 'Veuillez choisir au moins un thème.',
			save: 'Enregistrer',
			start: 'Commencer le journal'
		},
		newEntry: {
			title: 'Entrée du journal',
			date: 'Date',
			add: 'Ajouter une entrée : {topic}'
		},
		week: {
			title: 'Ma semaine',
			cell: '{day} : {question}'
		},
		yes: 'oui',
		no: 'non',
		day: {
			back: 'Retour à la vue de la semaine',
			overline: 'Journal | {topic}',
			deleteAll: 'Supprimer les entrées',
			cancel: 'Annuler',
			moreAfterYes: 'Plus d’infos',
			moreAfterNo: 'Plus d’infos',
			logged: 'Noté pour ce jour :',
			noPhase: 'Pas encore d’entrée',
			delete: 'Supprimer',
			editTitle: 'Modifier',
			deleteTitle: 'Supprimer',
			summary: 'Bilan de la journée',
			ratingHint:
				'Qu’est-ce qui s’est bien passé pour vous aujourd’hui ? Qu’est-ce qui s’est moins bien passé ? Pensez à votre objectif personnel.',
			planQuestion: 'Que prévoyez-vous pour demain ?',
			done: 'Terminé',
			save: 'Enregistrer'
		},
		phase: {
			back: 'Retour à la vue du jour',
			date: 'Date',
			start: 'Heure (début)',
			end: 'Heure (fin)',
			nothingYet: 'Rien de saisi pour le moment.',
			deleteItem: 'Supprimer l’élément',
			deleteItemLabel: 'Supprimer l’élément : {item}',
			deviceQuestion:
				'Quel appareil avez-vous utilisé ? (par exemple ordinateur, smartphone, console de jeux ou console portable)',
			missingItem: 'Veuillez saisir au moins un élément et cliquer sur « Ajouter ».',
			choose: 'Veuillez choisir',
			group: '{group} :',
			drink: 'Boisson',
			size: 'Taille',
			count: 'Nombre',
			joints: 'Joints',
			bongs: 'Bangs',
			otherKind: 'Autre',
			gambling: 'Jeux d’argent',
			media: 'Médias',
			hours: 'Durée : heures',
			minutes: 'Minutes',
			add: 'Ajouter',
			cancel: 'Annuler',
			timeRange: 'de {start} à {end}',
			time: '{time}',
			when: '{time} :',
			noItems: 'Aucune indication sur la consommation'
		},
		topics: {
			alcohol: {
				label: 'Alcool',
				weekQuestion: 'Avez-vous bu de l’alcool ?',
				dayQuestion: 'Avez-vous bu de l’alcool aujourd’hui ?',
				pastDayQuestion: 'Avez-vous bu de l’alcool ce jour-là ?',
				ratingQuestion:
					'Comment évaluez-vous la journée d’aujourd’hui au regard de votre consommation d’alcool ?',
				pastRatingQuestion: 'Comment évaluez-vous cette journée au regard de votre consommation d’alcool ?',
				planHint:
					'Vous fixez-vous une tâche ou un petit objectif pour le lendemain ? (Par exemple : ne pas boire, accomplir une tâche, faire une sortie agréable, etc.)',
				yesIntro:
					'Notez ici votre consommation d’alcool. Veuillez faire une nouvelle entrée pour chaque situation ou phase de consommation.',
				yesMore:
					'Si, par exemple, vous avez bu à midi et le soir, faites deux entrées. Si vous avez bu plusieurs verres sur une même période, vous pouvez les saisir comme une seule phase de consommation. Le but du journal est que vous appreniez, avec votre conseillère ou votre conseiller, à comprendre votre consommation aussi précisément que possible, afin de pouvoir la changer avec succès.',
				noIntro:
					'Vous n’avez pas bu d’alcool aujourd’hui ? Formidable ! Notez absolument ce qui vous a aidé à rester sobre et comment vous l’avez vécu.',
				pastNoIntro:
					'Vous n’avez pas bu d’alcool ce jour-là ? Formidable ! Notez absolument ce qui vous a aidé à rester sobre et comment vous l’avez vécu.',
				noMore:
					'Peut-être avez-vous réussi à appliquer vos stratégies de contrôle ? Vos notes dans le journal vous aident, vous et votre conseillère ou votre conseiller, à repérer les stratégies particulièrement efficaces pour un changement de comportement durable et une vie sobre. Si vous ne souhaitez rien noter, cliquez simplement sur « Enregistrer ».',
				contextQuestion: 'Avec qui et où avez-vous bu ?',
				triggerQuestion: 'Pourquoi ? Quelle a été la raison ou le déclencheur de la consommation ?',
				phaseTitle: 'Alcool : saisir une phase de consommation',
				newPhase: 'Saisir une nouvelle phase de consommation',
				editPhase: 'Modifier la phase de consommation',
				deletePhase: 'Supprimer la phase de consommation',
				deletePhaseQuestion: 'Supprimer cette phase de consommation ?',
				deleteAllQuestion:
					'Toutes les phases de consommation saisies pour ce jour seront supprimées. Continuer quand même ?',
				saveLabel: 'Enregistrer la phase de consommation',
				loggedLabel: 'Boissons notées :'
			},
			cannabis: {
				label: 'Cannabis',
				weekQuestion: 'Avez-vous consommé du cannabis ?',
				dayQuestion: 'Avez-vous consommé du cannabis aujourd’hui ?',
				pastDayQuestion: 'Avez-vous consommé du cannabis ce jour-là ?',
				ratingQuestion:
					'Comment évaluez-vous la journée d’aujourd’hui au regard de votre consommation de cannabis ?',
				pastRatingQuestion:
					'Comment évaluez-vous cette journée au regard de votre consommation de cannabis ?',
				planHint:
					'Vous fixez-vous une tâche ou un petit objectif pour le lendemain ? (Par exemple : ne pas fumer de cannabis, accomplir une tâche, faire une sortie agréable, etc.)',
				yesIntro:
					'Notez ici votre consommation de cannabis. Veuillez faire une nouvelle entrée pour chaque situation ou phase de consommation.',
				yesMore:
					'Si, par exemple, vous avez fumé à midi et le soir, faites deux entrées. Si vous avez consommé plusieurs fois sur une même période, vous pouvez le saisir comme une seule phase de consommation. Le but du journal est que vous appreniez, avec votre conseillère ou votre conseiller, à comprendre votre consommation aussi précisément que possible, afin de pouvoir la changer avec succès.',
				noIntro:
					'Vous n’avez pas consommé aujourd’hui ? Formidable ! Notez absolument ce qui vous a aidé à rester sobre et comment vous l’avez vécu.',
				pastNoIntro:
					'Vous n’avez pas consommé ce jour-là ? Formidable ! Notez absolument ce qui vous a aidé à rester sobre et comment vous l’avez vécu.',
				noMore:
					'Peut-être avez-vous réussi à appliquer vos stratégies de contrôle ? Vos notes dans le journal vous aident, vous et votre conseillère ou votre conseiller, à repérer les stratégies particulièrement efficaces pour un changement de comportement durable et une vie sobre. Si vous ne souhaitez rien noter, cliquez simplement sur « Enregistrer ».',
				contextQuestion: 'Avec qui et où avez-vous fumé ?',
				triggerQuestion: 'Pourquoi ? Quelle a été la raison ou le déclencheur de la consommation ?',
				phaseTitle: 'Cannabis : saisir une consommation',
				newPhase: 'Saisir une nouvelle phase de consommation',
				editPhase: 'Modifier la phase de consommation',
				deletePhase: 'Supprimer la phase de consommation',
				deletePhaseQuestion: 'Supprimer cette phase de consommation ?',
				deleteAllQuestion:
					'Toutes les phases de consommation saisies pour ce jour seront supprimées. Continuer quand même ?',
				saveLabel: 'Enregistrer la phase de consommation',
				loggedLabel: 'Consommation notée :'
			},
			gambling: {
				label: 'Jeux d’argent',
				weekQuestion: 'Avez-vous joué à des jeux d’argent ?',
				dayQuestion: 'Avez-vous joué aujourd’hui ?',
				pastDayQuestion: 'Avez-vous joué ce jour-là ?',
				ratingQuestion:
					'Comment évaluez-vous la journée d’aujourd’hui au regard de votre pratique des jeux d’argent ?',
				pastRatingQuestion:
					'Comment évaluez-vous cette journée au regard de votre pratique des jeux d’argent ?',
				planHint:
					'Vous fixez-vous une tâche ou un petit objectif pour le lendemain ? (Par exemple : ne pas jouer, accomplir une tâche, faire une sortie agréable, etc.)',
				yesIntro:
					'Notez ici votre pratique des jeux d’argent. Veuillez faire une nouvelle entrée pour chaque phase pendant laquelle vous avez joué.',
				yesMore:
					'Si, par exemple, vous avez joué à midi et le soir, faites deux entrées. Si vous avez pratiqué plusieurs types de jeux d’argent sur une même période, vous pouvez les saisir dans une seule phase de jeu. Le but du journal est que vous appreniez, avec votre conseillère ou votre conseiller, à comprendre votre comportement aussi précisément que possible, afin de pouvoir le changer avec succès.',
				noIntro:
					'Vous n’avez pas joué à des jeux d’argent aujourd’hui ? Formidable ! Notez absolument ce qui vous a aidé à ne pas jouer et comment vous l’avez vécu.',
				pastNoIntro:
					'Vous n’avez pas joué à des jeux d’argent ce jour-là ? Formidable ! Notez absolument ce qui vous a aidé à ne pas jouer et comment vous l’avez vécu.',
				noMore:
					'Peut-être avez-vous réussi à appliquer vos stratégies de contrôle ? Vos notes dans le journal vous aident, vous et votre conseillère ou votre conseiller, à repérer les stratégies particulièrement efficaces pour un changement de comportement durable et une vie sans jeux d’argent. Si vous ne souhaitez rien noter, cliquez simplement sur « Enregistrer ».',
				contextQuestion: 'Où et avec qui avez-vous joué ?',
				triggerQuestion: 'Pourquoi ? Quelle a été la raison ou le déclencheur du jeu ?',
				phaseTitle: 'Saisir des jeux d’argent',
				newPhase: 'Saisir une nouvelle phase de jeu',
				editPhase: 'Modifier la phase de jeu',
				deletePhase: 'Supprimer la phase de jeu',
				deletePhaseQuestion: 'Supprimer cette phase de jeu ?',
				deleteAllQuestion:
					'Toutes les phases de jeu saisies pour ce jour seront supprimées. Continuer quand même ?',
				saveLabel: 'Enregistrer l’entrée',
				loggedLabel: 'Jeux d’argent notés :'
			},
			media: {
				label: 'Médias',
				weekQuestion: 'Avez-vous utilisé des médias ?',
				dayQuestion: 'Avez-vous utilisé des médias aujourd’hui ?',
				pastDayQuestion: 'Avez-vous utilisé des médias ce jour-là ?',
				ratingQuestion: 'Comment évaluez-vous la journée d’aujourd’hui au regard de votre usage des médias ?',
				pastRatingQuestion: 'Comment évaluez-vous cette journée au regard de votre usage des médias ?',
				planHint:
					'Vous fixez-vous une tâche ou un petit objectif pour le lendemain ? (Par exemple : ne pas jouer, accomplir une tâche, faire une sortie agréable, etc.)',
				yesIntro:
					'Notez ici votre usage des médias. Veuillez faire une nouvelle entrée pour chaque situation ou phase d’utilisation.',
				yesMore:
					'Si, par exemple, vous avez utilisé des médias à midi et le soir, faites deux entrées. Si vous avez utilisé plusieurs médias sur une même période, vous pouvez le saisir comme une seule phase. Le but du journal est que vous appreniez, avec votre conseillère ou votre conseiller, à comprendre votre usage des médias aussi précisément que possible, afin de pouvoir le changer avec succès.',
				noIntro:
					'Vous n’avez pas utilisé de médias aujourd’hui ? Formidable ! Notez absolument ce qui vous a aidé et comment vous l’avez vécu.',
				pastNoIntro:
					'Vous n’avez pas utilisé de médias ce jour-là ? Formidable ! Notez absolument ce qui vous a aidé et comment vous l’avez vécu.',
				noMore:
					'Peut-être avez-vous réussi à appliquer vos stratégies de contrôle ? Vos notes dans le journal vous aident, vous et votre conseillère ou votre conseiller, à repérer les stratégies particulièrement efficaces pour un changement de comportement durable. Si vous ne souhaitez rien noter, cliquez simplement sur « Enregistrer ».',
				contextQuestion: 'Où et avec qui avez-vous utilisé des médias ?',
				triggerQuestion: 'Pourquoi ? Quelle a été la raison ou le déclencheur de l’usage des médias ?',
				phaseTitle: 'Saisir un usage des médias',
				newPhase: 'Saisir une nouvelle phase d’usage des médias',
				editPhase: 'Modifier la phase d’usage des médias',
				deletePhase: 'Supprimer la phase d’usage des médias',
				deletePhaseQuestion: 'Supprimer cette phase d’usage des médias ?',
				deleteAllQuestion:
					'Toutes les phases d’usage des médias saisies pour ce jour seront supprimées. Continuer quand même ?',
				saveLabel: 'Enregistrer l’entrée',
				loggedLabel: 'Usage des médias noté :'
			}
		},
		drinks: {
			beer: 'Bière',
			wine: 'Vin / vin mousseux',
			spirits: 'Eau-de-vie / alcool fort',
			liqueur: 'Liqueur',
			'beer-mix': 'Boissons à base de bière',
			alcopop: 'Prémix (alcopops)'
		},
		cannabisUnits: {
			joint: 'joint',
			bong: 'bang'
		},
		gameGroups: {
			local: 'Jeux d’argent sur place',
			online: 'En ligne / sur Internet'
		},
		games: {
			'slot-arcade': 'Machines à sous dans les salles de jeux',
			'slot-gastro': 'Machines à sous dans les bars et restaurants',
			'casino-small': 'Machines à sous au casino',
			'casino-large': 'Jeux de table au casino',
			sports: 'Paris sportifs',
			horses: 'Paris hippiques',
			lottery: 'Loteries',
			'other-local': 'Autres jeux d’argent sur place',
			'online-slots': 'Machines à sous en ligne',
			'online-casino': 'Jeux de casino en ligne (jeux de table, à l’exception du poker)',
			'online-poker': 'Poker en ligne',
			'online-sports': 'Paris sportifs en ligne',
			'online-horses': 'Paris hippiques en ligne',
			'online-lottery': 'Loteries en ligne',
			'online-other': 'Autres jeux d’argent en ligne'
		},
		mediaGroups: {
			games: 'Jeux en ligne',
			communication: 'Communication par Internet',
			social: 'Réseaux sociaux (par exemple TikTok, Instagram, WhatsApp, Telegram, Facebook)',
			surfing: 'Navigation sur Internet',
			more: 'Autres activités médiatiques'
		},
		media: {
			action: 'Jeux d’action (par exemple jeux de plateforme, beat ’em up, action-aventure)',
			shooter: 'Jeux de tir à la première personne',
			rpg: 'Jeux de rôle (par exemple MMORPG, jeux de rôle en ligne et hors ligne)',
			strategy: 'Jeux de stratégie (par exemple stratégie en temps réel, jeux de construction)',
			'sports-games': 'Jeux de sport (par exemple jeux de gestion, simulations sportives)',
			simulation: 'Jeux de simulation (par exemple simulation de vol, de course automobile ou de vie)',
			'music-games': 'Jeux de musique et de danse (par exemple Just Dance Now, SingStar, Let’s Sing)',
			skill: 'Jeux d’adresse (par exemple Tetris)',
			chat: 'Discuter par messagerie (chat)',
			mail: 'Écrire des e-mails',
			'social-watch': 'Regarder des vidéos / des images',
			'social-talk': 'Échanger avec d’autres personnes',
			research: 'Recherches',
			shopping: 'Achats',
			magazines: 'Magazines en ligne',
			streaming: 'Streaming en ligne (par exemple Netflix, plateformes de replay, Amazon Prime)',
			porn: 'Sites pornographiques',
			device: 'Optimiser un ordinateur / un appareil',
			'other-media': 'Autre utilisation des médias électroniques'
		},
		items: {
			alcohol: '{count} x {drink} ({size})',
			cannabis: '{count} x {unit}',
			otherKind: 'Autre : {text}',
			otherKindCount: 'Autre : {count} x {text}',
			duration: '{activity}, {duration}'
		},
		sums: {
			phases: { one: '{count} phase', other: '{count} phases' },
			drinks: { one: '{count} boisson', other: '{count} boissons' },
			alcohol: '{drinks}, environ {grams} g d’alcool',
			joints: { one: '{count} joint', other: '{count} joints' },
			bongs: { one: '{count} bang', other: '{count} bangs' },
			otherKind: '{count} x autre'
		},
		counsellor: {
			noEntries: 'Pas encore d’entrées.',
			topics: 'Thèmes notés : {topics}',
			new: 'Nouveau',
			noDayEntries: 'Aucune entrée',
			tileTopic: '{topic} :',
			noConsumption: 'Aucune consommation saisie',
			entriesOf: 'Entrées du {day}',
			answerYes: '{topic} : oui',
			answerNo: '{topic} : non',
			device: 'Appareil',
			context: 'Où et avec qui',
			trigger: 'Raison ou déclencheur',
			rating: 'Évaluation de la journée',
			plan: 'Projet pour demain',
			summaryNew: 'Nouveau bilan'
		},
		pdf: {
			noEntries: 'Aucune entrée sur cette période.',
			topics: 'Thèmes notés : {topics}',
			answerYes: '{topic} : oui ({sum})',
			answerNo: '{topic} : non',
			device: 'Appareil : {device}',
			context: 'Où et avec qui : {context}',
			trigger: 'Raison ou déclencheur : {trigger}',
			rating: 'Évaluation de la journée',
			plan: 'Projet pour demain'
		},
		demo: {
			alcoholRating: 'Après la dispute, j’ai bu plus que prévu.',
			alcoholPlan: 'Rentrer directement à la maison après le travail.',
			alcoholContext: 'À la maison, seul',
			alcoholTrigger: 'Dispute au téléphone',
			gamblingRating: 'Je n’avais pas pris d’argent sur moi, cela m’a aidé.',
			soberRating: 'Fait du sport le soir au lieu de boire une bière.',
			soberPlan: 'Retourner au sport.',
			gamblingContext: 'Dans le bus et à la maison',
			gamblingTrigger: 'Ennui'
		}
	},
	relativesDiary: {
		title: 'Mon journal',
		intro: [
			'Le journal sert à noter les événements et les pensées de la journée, qu’ils soient émouvants, pesants ou agréables. Pour vos entrées, vous pouvez vous appuyer sur les trois questions affichées dans la vue du jour. Cliquez par exemple sur la journée d’aujourd’hui pour faire une entrée.',
			'Souvent, le simple fait d’écrire ses expériences et ses pensées, de les mettre en ordre et de « s’en libérer » apporte déjà un soulagement. Vos entrées dans le journal sont aussi importantes pour votre accompagnement personnel : plus votre conseillère ou votre conseiller peut se faire une idée précise de votre situation, mieux elle ou il peut vous accompagner. C’est pourquoi nous vous recommandons de rendre vos entrées visibles pour votre conseillère ou votre conseiller.'
		],
		questionsToday: [
			'Qu’est-ce qui a été important pour vous aujourd’hui ?',
			'Comment s’est passée la communication avec votre proche aujourd’hui ?',
			'Comment vous sentez-vous par rapport à cela ?'
		],
		questionsOtherDay: [
			'Qu’est-ce qui a été important pour vous ce jour-là ?',
			'Comment s’est passée la communication avec votre proche ce jour-là ?',
			'Comment vous sentez-vous par rapport à cela ?'
		],
		moodQuestionToday: 'Comment évaluez-vous la journée d’aujourd’hui ?',
		moodQuestionOtherDay: 'Comment évaluez-vous cette journée ?',
		moods: {
			'very-bad': 'très mauvaise',
			'rather-bad': 'plutôt mauvaise',
			average: 'moyenne',
			'rather-good': 'plutôt bonne',
			'very-good': 'très bonne'
		},
		noMood: 'non renseigné',
		weekEntriesHeading: 'Entrées du journal',
		weekMoodHeading: 'Humeur',
		openEntry: 'Ouvrir',
		openEntryLabel: 'Ouvrir l’entrée : {day}',
		createEntry: 'Créer une entrée',
		createEntryLabel: 'Créer une entrée : {day}',
		backToOverview: 'retour à la vue d’ensemble',
		entryLabel: 'Entrée du journal',
		emptyEntry: 'Veuillez écrire quelque chose ou évaluer la journée.',
		saveEntry: 'Enregistrer l’entrée',
		deleteEntry: 'Supprimer l’entrée',
		deleteConfirm: 'Supprimer cette entrée du journal ?',
		deleteButton: 'Supprimer',
		weekView: 'Vue de la semaine',
		allEntries: 'Toutes les entrées',
		new: 'Nouveau',
		noEntryForDay: 'Aucune entrée',
		noEntries: 'Pas encore d’entrées.',
		pdfNoEntries: 'Aucune entrée sur cette période.',
		pdfMood: 'Évaluation de la journée : {mood}',
		pdfNoText: 'Aucun texte saisi.',
		demoEntries: [
			'Ce soir, il y a encore eu une dispute quand il est rentré tard. J’ai essayé de rester calme et de ne pas lui faire de reproches. Après, j’étais épuisée, mais aussi un peu fière.',
			'Une journée calme. Nous sommes allés nous promener ensemble et avons parlé des vacances.'
		]
	},
	balance: {
		intro:
			'Changer ses propres habitudes est toujours un défi. Tout changement est exigeant, demande de l’énergie et de la persévérance. La balance décisionnelle vous aide à y voir clair sur les avantages et les inconvénients d’un arrêt du comportement addictif.',
		howItWorks: 'Comment fonctionne la balance décisionnelle',
		howItWorksStep: '{title} :',
		howItWorksSteps: [
			{
				title: 'Rassembler des arguments',
				text: 'Réfléchissez pour vous-même : quelles seront les conséquences si je change mon comportement, par exemple si j’arrête de boire, de jouer ou de fumer du cannabis ? Que se passera-t-il si je continue comme avant ? Soyez honnête avec vous-même !'
			},
			{
				title: 'Évaluer',
				text: 'Dans les deux cas, les effets d’un changement peuvent être positifs ou négatifs pour vous. Demandez-vous aussi si ces effets sont particulièrement importants pour vous ou plutôt moins importants.'
			},
			{
				title: 'Regarder le résultat',
				text: 'Lorsque vous avez saisi et évalué tous les avantages et inconvénients, la balance décisionnelle vous montre votre attitude intérieure actuelle vis-à-vis du thème choisi.'
			},
			{
				title: 'Tirer un bilan',
				text: 'Quel est votre bilan ? Comment évaluez-vous votre motivation actuelle ? Êtes-vous intérieurement prêt ou prête à changer votre comportement ? Ou avez-vous besoin d’autres arguments ?'
			}
		],
		howItWorksNote:
			'Vous pouvez reprendre l’exercice et le compléter à tout moment lorsque de nouveaux avantages ou inconvénients vous viennent à l’esprit. Si vous le souhaitez, votre conseillère ou votre conseiller peut consulter vos réponses et ainsi vous soutenir au mieux dans votre projet.',
		workOnExerciseFirst: 'Veuillez d’abord faire l’exercice.',
		sides: { pro: 'POUR', contra: 'CONTRE' },
		poles: [
			{ contra: 'CONTRE le changement', pro: 'POUR le changement' },
			{ contra: 'pas de changement', pro: 'Je veux changer quelque chose !' },
			{ contra: 'c’est bien comme c’est', pro: 'il faut que quelque chose change !' }
		],
		ratings: {
			very: 'très important',
			quite: 'assez important',
			some: 'un peu important',
			none: 'pas important du tout'
		},
		notImportant: 'pas important',
		ratingOption: '{label} ({stars})',
		ratingQuestion: 'Quelle importance cet aspect a-t-il pour vous ?',
		halves: {
			change: 'Si j’atteins mon objectif / si je change mon comportement, j’aurai les …',
			keep: 'Si je ne change pas mon comportement / si je n’atteins pas mon objectif, j’aurai les …'
		},
		categoryInHalf: '… {title}',
		categoryWithSide: '{category} ({side})',
		categories: {
			A: {
				title: 'avantages suivants',
				long: 'Avantages du changement de comportement',
				listTitle: 'Les avantages que vous avez saisis si vous atteignez votre objectif :'
			},
			B: {
				title: 'inconvénients suivants',
				long: 'Inconvénients du changement de comportement',
				listTitle: 'Les inconvénients que vous avez saisis si vous atteignez votre objectif :'
			},
			C: {
				title: 'avantages suivants',
				long: 'Avantages si rien ne change',
				listTitle: 'Les avantages que vous avez saisis si vous ne changez pas votre comportement :'
			},
			D: {
				title: 'inconvénients suivants',
				long: 'Inconvénients si rien ne change',
				listTitle: 'Les inconvénients que vous avez saisis si vous ne changez pas votre comportement :'
			}
		},
		argumentKinds: {
			advantage: {
				missing: 'Veuillez saisir un avantage.',
				add: 'Nouvel avantage',
				edit: 'Modifier l’avantage',
				placeholder: 'Saisissez un avantage ici. Faites une nouvelle entrée pour chaque avantage.'
			},
			disadvantage: {
				missing: 'Veuillez saisir un inconvénient.',
				add: 'Nouvel inconvénient',
				edit: 'Modifier l’inconvénient',
				placeholder: 'Saisissez un inconvénient ici. Faites une nouvelle entrée pour chaque inconvénient.'
			}
		},
		examples: {
			A: [
				'J’arrive de nouveau mieux à gérer mon quotidien.',
				'J’ai de nouveau du temps pour mes loisirs.',
				'Je peux de nouveau penser clairement.',
				'Plus d’argent / moins de dettes.',
				'Mon corps n’est plus autant mis à rude épreuve.',
				'Je me sens mieux.',
				'Un bon sentiment, parce que je m’attaque au problème.',
				'Moins de stress avec les amis / la famille.'
			],
			B: [
				'Ce sera difficile avec mon ancien cercle d’amis.',
				'L’ivresse va me manquer.',
				'Ça pourrait devenir assez ennuyeux.',
				'Beaucoup de choses seront nettement moins amusantes.',
				'Le sevrage / la privation sera dur.',
				'L’espoir du gros gain disparaît.'
			],
			C: [
				'Je m’endors plus facilement.',
				'Des moments plus drôles avec les amis.',
				'Quand je bois / je joue / je fume du cannabis, j’ai la paix.',
				'Je peux aussi parfois vraiment « me défoncer » et oublier tout ce qui m’entoure.',
				'La chance de gagner reste intacte.'
			],
			D: [
				'Je ne fais presque rien d’autre.',
				'Je néglige beaucoup d’autres choses.',
				'Je m’en veux de plus en plus.',
				'Toujours des tensions et des disputes avec ma famille.',
				'J’ai du mal à sortir du lit le matin.',
				'Les dettes restent / continuent d’augmenter.',
				'Ma santé continue de se dégrader.',
				'Ma vie reste réduite à un seul problème.'
			]
		},
		tendency: {
			pending: 'Pas encore calculable',
			balanced: 'Équilibrée',
			maximum: 'Tendance {side} maximale',
			clear: 'Tendance {side}',
			slight: 'Légère tendance {side}'
		},
		resultLabel: 'Résultat de la balance décisionnelle',
		scaleTitle: 'Balance décisionnelle : {value}, {tendency}',
		scaleInactiveTitle: 'Balance décisionnelle : pas encore active',
		allRatedZero:
			'Tous les arguments sont évalués comme « pas important du tout », c’est pourquoi la balance n’est pas encore active.',
		sidePoints: { one: '{side} {count} point', other: '{side} {count} points' },
		valueWithTendency: '{value}, {tendency}',
		miniInactive: 'Balance pas encore active',
		conclusionTitle: 'Mon bilan',
		conclusionPrompt:
			'Quelle image se dégage pour vous, maintenant que vous avez rassemblé tous les arguments ? Quelles conclusions en tirez-vous pour vous-même à ce stade ?',
		saveConclusion: 'Enregistrer le bilan',
		edit: 'Modifier',
		add: 'Ajouter',
		noEntriesYet: 'Pas encore d’entrées.',
		backToOverview: 'Retour à la vue d’ensemble de la balance décisionnelle',
		argumentType: 'Type d’argument',
		showExamples: 'Afficher des exemples',
		hideExamples: 'Masquer les exemples',
		allExamplesUsed: 'Tous les exemples ont déjà été ajoutés.',
		ratingMissing: 'Veuillez évaluer l’importance de cet aspect pour vous.',
		saveChange: 'Enregistrer la modification',
		addEntry: 'Ajouter une entrée',
		confirmDelete: 'Supprimer cette entrée ?',
		delete: 'Supprimer',
		editItem: 'Modifier : {text}',
		deleteItem: 'Supprimer : {text}',
		finish: 'Terminer',
		counsellor: {
			noArguments: 'Aucun argument saisi pour le moment.',
			conclusion: 'Bilan',
			new: 'Nouveau',
			noConclusion: 'Aucun bilan saisi pour le moment.',
			noEntries: 'Aucune entrée.',
			open: 'Ouvrir',
			close: 'Fermer',
			category: 'Catégorie',
			relevance: 'Importance',
			relevanceValue: { one: '{label} ({count} point)', other: '{label} ({count} points)' },
			lastChanged: 'Dernière modification'
		},
		pdf: {
			result: 'Résultat',
			inactive: 'La balance n’est pas encore active (aucun point d’importance).',
			summary: 'Score de motivation {value} ({tendency}), {pro}, {contra}, sur une échelle de −10 à +10.',
			conclusion: 'Bilan',
			noConclusion: 'Aucun bilan saisi.',
			arguments: 'Arguments',
			noEntries: 'Aucune entrée.',
			rating: '{label} ({count})'
		}
	},
	emergencyKit: {
		sections: {
			motivation: {
				title: 'Ma motivation : voilà pourquoi je tiens bon',
				listLabel: 'Voilà pourquoi je veux changer mon comportement / atteindre mon objectif :',
				fieldLabel: 'Voilà pourquoi je veux changer mon comportement / atteindre mon objectif',
				cardTitle: 'Voilà pourquoi je tiens bon',
				intro:
					'Il existe de nombreuses bonnes raisons pour lesquelles vous poursuivez votre objectif personnel. Notez ici les raisons qui sont les plus importantes pour vous personnellement. Cela vous aide à renforcer votre décision. Relisez régulièrement vos raisons pour les garder toujours à l’esprit. Nous avons rassemblé pour vous quelques exemples dont vous pouvez vous inspirer.',
				examples: [
					{
						label: 'Exemples',
						items: [
							'J’ai de nouveau du temps pour d’autres choses',
							'Enfin plus de sentiment de culpabilité',
							'Je veux que ma ou mon partenaire puisse de nouveau me faire confiance',
							'Je veux de nouveau me sentir moi-même',
							'Je n’ai pas envie de devoir y penser tout le temps',
							'Si je continue comme ça, c’en est fini de ma relation',
							'Enfin être libre à nouveau',
							'Je n’ai plus besoin de mentir à ma famille, à mes amis ou à mon employeur',
							'Plus de cachotteries, plus de double vie',
							'Je peux de nouveau regarder mes enfants dans les yeux',
							'Enfin de nouveau du temps et de l’énergie pour d’autres choses',
							'Plus d’activités illégales pour me procurer de l’argent',
							'Je peux de nouveau me regarder dans la glace',
							'Enfin plus de nouvelles dettes',
							'Si je continue comme ça, je m’enfonce de plus en plus dans les problèmes'
						]
					}
				]
			},
			strategy: {
				title: 'Mes stratégies pour le quotidien',
				listLabel: 'Voilà ce qui m’aide à atteindre mon objectif :',
				fieldLabel: 'Voilà ce qui m’aide au quotidien',
				cardTitle: 'Voilà ce qui m’aide au quotidien',
				intro:
					'Notez ici tout ce qui vous aide, dans la vie de tous les jours, à atteindre votre objectif. Les règles de conduite simples que vous vous fixez à vous-même sont particulièrement utiles. Mais les loisirs et les activités pratiqués régulièrement aident aussi à se détourner de l’envie de consommer, à réduire le stress et à atteindre votre objectif sur le long terme. Vous trouverez ci-dessous quelques exemples que vous pouvez utiliser.',
				examples: [
					{
						label: 'Général',
						items: [
							'Je continue à me faire aider',
							'Je vais régulièrement à mon groupe d’entraide',
							'J’entretiens mes amitiés',
							'Je veille à avoir des loisirs actifs',
							'Je ne garde pas ma colère et ma frustration pour moi',
							'Je ne prends pas de risques',
							'J’évite mes amis de jeu ou de boisson',
							'J’évite mon cercle d’amis qui consomme',
							'Je fais régulièrement du sport',
							'Je fais attention aux situations à risque et aux signaux d’alerte d’une éventuelle rechute',
							'Je travaille sans relâche à mon objectif de rester abstinent ou abstinente',
							'Je défends mes besoins',
							'Je me récompense de temps en temps',
							'Je m’offre quelque chose d’agréable',
							'J’affronte mes problèmes',
							'Je m’occupe de mes dettes'
						]
					},
					{
						label: 'Jeux d’argent',
						items: [
							'J’installe un programme qui bloque l’accès aux sites de jeux d’argent en ligne',
							'Je me tiens à l’écart des lieux de jeu',
							'Quand je vois une salle de jeux, je change de trottoir',
							'Je me fixe des limites claires sur l’argent que je dépense par jour / par semaine',
							'Je dépense consciemment mon argent pour des choses dont j’ai vraiment besoin',
							'Je fais attention à la somme d’argent liquide que j’emporte'
						]
					}
				]
			},
			support: {
				title: 'Voilà où je trouve du soutien'
			},
			critical: {
				title: 'Situations, humeurs et pensées critiques',
				listLabel:
					'« Situations à risque intérieures » : ici, je dois être particulièrement vigilant ou vigilante !',
				fieldLabel: 'Situations et humeurs dans lesquelles je dois faire attention',
				cardTitle: 'Ici, je dois faire attention',
				intro:
					'Dans cet exercice, vous apprenez à reconnaître les situations, les humeurs et les pensées dans lesquelles vous risquez de retomber dans d’anciens schémas de comportement. On parle aussi de « situations à risque intérieures ». Quelles pensées et quelles humeurs pourraient mettre en danger votre décision et votre objectif ? Dans quelles situations devriez-vous donc être particulièrement attentif ou attentive ? Regardez nos exemples. À première vue, beaucoup d’humeurs ou de pensées n’ont que peu de lien avec le comportement problématique lui-même. Quelles sont vos « situations à risque intérieures » bien à vous ?',
				examples: [
					{
						label: 'Général',
						items: [
							'Quand je pense au « bon vieux temps »',
							'Quand je me dis que tout n’était pas si mal',
							'Quand je me dis « une fois, ça ne compte pas »',
							'Quand je me retrouve avec d’anciennes connaissances',
							'Quand je ne vais pas bien et que j’ai besoin de quelque chose pour « redescendre »',
							'Quand je suis frustré ou frustrée au travail ou dans mon couple',
							'Quand rien ne se passe comme je l’imagine',
							'Quand je m’ennuie',
							'Quand je suis stressé ou stressée et que je veux me détendre',
							'Quand je me dis « de toute façon, maintenant, plus rien n’a d’importance »',
							'Quand je deviens imprudent ou imprudente parce que je pense avoir réussi',
							'Quand je me dis que je ne suis pas du tout dépendant ou dépendante',
							'Quand je me dispute de nouveau souvent avec ma ou mon partenaire'
						]
					},
					{
						label: 'Jeux d’argent',
						items: [
							'Quand je veux rejouer « juste par curiosité »',
							'Quand je veux me récompenser de ce que j’ai accompli en mettant « juste quelques pièces » dans une machine à sous',
							'Quand je pense pouvoir résoudre ainsi mes problèmes d’argent',
							'Quand j’ai trop d’argent sur moi',
							'Quand j’ai bu de l’alcool',
							'Quand je pense de nouveau plus souvent au jeu',
							'Quand je me dis « une fois au casino, ça ne peut pas faire de mal »'
						]
					},
					{
						label: 'Alcool',
						items: [
							'Quand je veux reboire « juste par curiosité »',
							'Quand je veux me récompenser de ce que j’ai accompli en buvant « juste une petite bière »'
						]
					},
					{
						label: 'Cannabis',
						items: [
							'Quand je veux refumer du cannabis « juste par curiosité »',
							'Quand je veux me récompenser de ce que j’ai accompli en tirant « juste une fois sur un joint »'
						]
					}
				]
			},
			craving: {
				title: 'Ce qui m’aide en cas de craving (envie irrépressible de consommer)',
				listLabel: 'Voilà ce qui m’aide quand j’ai une envie irrépressible de consommer (craving) :',
				fieldLabel: 'Voilà ce qui m’aide quand j’ai une envie irrépressible de consommer (craving)',
				cardTitle: 'En cas d’envie irrépressible',
				intro:
					'Lorsqu’on renonce à un comportement addictif, on ressent souvent, pendant une longue période, un désir intense et répété de reprendre l’ancien comportement. Ce phénomène est appelé « craving » (mot anglais qui signifie désir, avidité) ou envie irrépressible de consommer. En général, cette envie intense ne dure que peu de temps. De courtes « consignes d’urgence » peuvent vous aider, dans ces situations, à surmonter cette envie. Les consignes doivent être formulées de façon très directe et concrète (comme un ordre que l’on se donne à soi-même). Elles vous aident à garder la tête froide et à résister à l’envie. Veillez à formuler des phrases courtes et très claires.',
				examples: [
					{
						label: 'Exemples',
						items: [
							'Je me change immédiatement les idées avec d’autres activités (faire du sport, aller faire des courses, aller au cinéma)',
							'J’appelle immédiatement ma personne de confiance',
							'J’écris une entrée dans mon journal',
							'Je pense à tout ce que j’ai déjà accompli',
							'J’écris un message à ma conseillère ou à mon conseiller',
							'Je suis fier ou fière de mes succès jusqu’ici',
							'J’appelle un centre de consultation en addictologie',
							'Je vais dans un lieu sûr, je retrouve une personne de confiance',
							'Je ne mets pas en jeu ce que j’ai déjà accompli !',
							'Je pense au chemin parcouru !',
							'Je pense : « Ne laisse pas tomber ta famille ! »',
							'Je ne mets pas ma relation en jeu !',
							'Je me dis : « STOP ! Pars d’ici ! Tout de suite ! »'
						]
					}
				]
			},
			risks: {
				title: 'Mes principales situations à risque et stratégies de contrôle',
				cardTitle: 'Situations à risque et stratégies'
			},
			relapse: {
				title: 'Rechute : que faire ?',
				listLabel: 'Voilà ce que je fais en cas de rechute :',
				fieldLabel: 'Voilà ce que je fais en cas de rechute',
				cardTitle: 'En cas de rechute',
				intro:
					'Si une rechute devait se produire : pas de panique ! N’abandonnez pas votre projet. Vous pouvez tirer des leçons des rechutes et améliorer ensuite vos stratégies pour y faire face. Mais la consigne la plus importante est d’abord : STOP ! Quittez la situation concrète le plus vite possible, afin d’éviter ou de limiter d’autres dommages. Comment souhaitez-vous agir en cas de rechute ? Que pouvez-vous faire concrètement ? Formulez ici des consignes concrètes et utiles pour vous personnellement dans ce cas.',
				examples: [
					{
						label: 'Exemples',
						items: [
							'J’arrête IMMÉDIATEMENT de jouer/boire/fumer et j’accepte d’avoir perdu le contrôle !',
							'Je sors au plus vite et je m’en vais !',
							'Je ne cache pas la rechute, je me confie à ma famille',
							'Même si j’ai honte, j’appelle immédiatement ma personne de confiance',
							'Je me fais aider par …',
							'Je prends ma rechute au sérieux, mais je ne la vois pas comme une catastrophe',
							'Je profite de la situation pour continuer à travailler sur mon objectif',
							'J’utilise la rechute pour améliorer mes stratégies pour y faire face',
							'Je n’abandonne pas !'
						]
					}
				]
			}
		},
		importance: { veryImportant: 'très important', important: 'important' },
		start:
			'Il est difficile de se défaire de comportements, d’habitudes et de façons de penser bien ancrés. C’est particulièrement vrai pour les addictions. Il faut souvent un effort énorme pour résister à l’envie irrépressible de consommer (ce qu’on appelle le « craving »). Dans votre « trousse d’urgence » personnelle, vous rassemblez des informations importantes qui vous aident à éviter les rechutes et à être préparé ou préparée face aux difficultés.',
		more: 'Le risque de retomber dans d’anciennes habitudes est particulièrement élevé pendant les premiers jours, les premières semaines et les premiers mois. Le but de cet exercice est d’avoir sous la main des stratégies utiles dans les situations difficiles et de pouvoir réagir de manière adaptée à l’envie de consommer. Utilisez les questions et les suggestions de cet exercice pour préparer vos stratégies personnelles et composer votre « trousse d’urgence ». Si vous le souhaitez, votre conseillère ou votre conseiller vous aidera à l’élaborer.',
		showInfo: 'Afficher le texte d’information',
		hideInfo: 'Masquer le texte d’information',
		printTitle: 'Imprimer la trousse d’urgence',
		confirmLabel: 'Continuer quand même ?',
		confirmEmpty: 'Au moins une rubrique ne contient aucune entrée. Continuer quand même ?',
		proceed: 'Continuer',
		printKit: 'Télécharger toute la trousse d’urgence en PDF',
		printCard: 'Trousse d’urgence au format carte de visite',
		cardHint:
			'Une fois découpé, le format carte de visite tient dans n’importe quel portefeuille : vous avez ainsi toujours votre trousse d’urgence sur vous.',
		missingImportance: 'Veuillez indiquer pour chaque entrée quelle importance elle a pour vous.',
		backToKit: 'Retour à la trousse d’urgence',
		back: 'Retour',
		part: 'Trousse d’urgence, partie {number}',
		entryLabel: 'Entrée {number}',
		importanceQuestion: 'Quelle importance ?',
		choose: 'Veuillez choisir',
		deleteLabel: 'Supprimer : {text}',
		addEntry: '+ Nouvelle entrée',
		save: 'Enregistrer',
		showExamples: 'Afficher des exemples',
		hideExamples: 'Masquer les exemples',
		examplesByTopic: 'Exemples par thème',
		allExamplesUsed: 'Tous les exemples ont déjà été ajoutés.',
		pickExample: 'Cliquez sur un exemple pour l’ajouter comme entrée.',
		myTrusted: 'Ma ou mes personnes de confiance',
		change: 'Modifier',
		addTrusted: 'Ajouter une personne de confiance',
		myAgency: 'Mon service de consultation',
		showAgency: 'Afficher',
		counsellorsLine: 'Conseil : {names}',
		notStored: 'Pas encore renseigné',
		mySelfHelp: 'Mon groupe d’entraide',
		addSelfHelp: 'Ajouter un groupe d’entraide',
		requestedOn: 'Recommandation demandée le {date}',
		trustedIntro: [
			'Impliquer des personnes de votre entourage proche peut vous soulager énormément. Avez-vous déjà parlé du problème à certaines personnes ? Alors notez leur prénom et/ou leur rôle (par exemple amie, frère, mère, grand-père) sur votre liste de soutien.',
			'Si vous n’en avez encore parlé à personne, réfléchissez à qui vous pourriez à l’avenir impliquer comme personne de confiance. Pensez à vos amis, à votre famille, à vos voisins ou à d’autres personnes proches de votre entourage. Qui pourrait vous soutenir dans votre projet et vous aider dans les situations difficiles ?'
		],
		trustedField: 'Nom / rôle de la personne de confiance {number}',
		trustedPlaceholder: 'Saisir un nom',
		rowLabel: 'Ligne {number}',
		addRow: '+ Ajouter une ligne',
		saveEntries: 'Enregistrer les entrées',
		agencyIntro:
			'Votre conseillère ou votre conseiller est là pour vous non seulement en ligne, mais aussi sur place. Contactez-la ou contactez-le par téléphone, prenez rendez-vous pour un entretien sur place ou rendez-vous à la permanence sans rendez-vous.',
		yourAgency: 'Votre service de consultation :',
		agencyMissing:
			'Les coordonnées de votre service de consultation ne sont pas encore renseignées ici. Votre conseillère ou votre conseiller vous les communiquera volontiers.',
		yourCounsellor: 'Votre conseillère ou votre conseiller :',
		selfHelpIntro: [
			'Les groupes d’entraide permettent aux personnes concernées, ainsi qu’à leurs proches, d’échanger entre eux. Cela n’apporte pas seulement un soulagement émotionnel. Les membres du groupe profitent aussi de l’expérience des autres participantes et participants. Les groupes d’entraide sont organisés par des services de consultation ou des associations d’entraide.',
			'Votre conseillère ou votre conseiller vous aide à trouver des groupes adaptés près de chez vous ou en ligne.'
		],
		requestButton: 'J’aimerais qu’on me recommande un groupe d’entraide.',
		requestDone: 'J’aimerais qu’on me recommande un groupe d’entraide. (demandé le {date})',
		requestHint: 'Votre conseillère ou votre conseiller recevra alors un message.',
		nakosText:
			'Grâce au lien suivant, vous pouvez aussi rechercher par vous-même des informations sur les groupes d’entraide près de chez vous :',
		nakosLink:
			'NAKOS (service national allemand de contact et d’information pour la création et le soutien de groupes d’entraide, en allemand)',
		selfHelpField: 'Mon groupe d’entraide :',
		selfHelpPlaceholder:
			'Saisissez ici le nom du groupe, la ou les dates, la personne de contact et le numéro de téléphone',
		risksIntro:
			'Vous trouverez ici toutes les situations à risque et les stratégies de contrôle correspondantes que vous avez élaborées dans l’exercice « Situations à risque et stratégies de contrôle ». Si, au cours de l’accompagnement, vous avez appris d’autres astuces et stratégies pour bien gérer les situations à risque, vous pouvez les noter dans le champ de texte ci-dessous.',
		noRisks:
			'Vous n’avez pas encore saisi de situation à risque dans l’exercice « Situations à risque et stratégies de contrôle ».',
		riskSituation: 'Situation à risque',
		rating: 'Évaluation',
		controlStrategy: 'Stratégie de contrôle',
		noStrategy: 'Pas encore de stratégie de contrôle',
		printRisk: 'Inclure dans l’impression ?',
		otherStrategies: 'Autres stratégies que j’ai apprises et que je veux utiliser consciemment à l’avenir :',
		previewEmpty: 'Pas encore d’entrées',
		previewMore: 'et {count} de plus',
		selfHelpLine: 'Groupe d’entraide : {text}',
		new: 'Nouveau',
		noEntries: 'Aucune entrée.',
		trusted: 'Personne(s) de confiance',
		selfHelp: 'Groupe d’entraide',
		requestWanted: 'Recommandation souhaitée',
		requestSince: 'depuis le {date}',
		noPrintedRisks: 'Aucune situation à risque sélectionnée pour l’impression.',
		risksOnlyShared:
			'Les situations à risque ne sont visibles que tant que « Situations à risque et stratégies de contrôle » est également partagé.',
		pdf: {
			title: 'Ma trousse d’urgence',
			noAnswer: 'Non renseigné',
			agencyMissing: 'Les coordonnées de votre service de consultation ne sont pas encore renseignées ici.',
			myCounsellor: 'Ma conseillère ou mon conseiller',
			requested: 'Recommandation d’un groupe d’entraide demandée le {date}.',
			cardsTitle: 'Ma trousse d’urgence au format carte de visite',
			cardsHint: 'À découper le long des pointillés et à emporter avec soi.',
			cardsEmpty: 'Pas encore d’entrées.',
			cardRiskRated: '{situation} (évaluation : {rating})',
			cardRiskStrategy: '{situation} : {strategy}'
		},
		request: {
			title: 'Groupe d’entraide demandé',
			text: '{name} souhaite qu’on lui recommande un groupe d’entraide. Veuillez communiquer à {name} les informations utiles (nom du groupe, date(s), personne de contact, numéro de téléphone) à noter dans l’exercice « Trousse d’urgence », à la rubrique « Mon groupe d’entraide », et, si nécessaire, prenez contact via la messagerie pour convenir de la suite. Ceci est un message généré automatiquement par les outils de conseil.',
			textUnnamed:
				'Une personne accompagnée souhaite qu’on lui recommande un groupe d’entraide. Veuillez lui communiquer les informations utiles (nom du groupe, date(s), personne de contact, numéro de téléphone) à noter dans l’exercice « Trousse d’urgence », à la rubrique « Mon groupe d’entraide », et, si nécessaire, prenez contact via la messagerie pour convenir de la suite. Ceci est un message généré automatiquement par les outils de conseil.'
		},
		demo: {
			motivations: ['Enfin être libre à nouveau', 'Je peux de nouveau regarder mes enfants dans les yeux'],
			strategy: 'Je fais régulièrement du sport',
			trusted: 'Anna (sœur)',
			craving: 'J’appelle immédiatement ma personne de confiance',
			relapse: 'Je n’abandonne pas !'
		}
	},
	active: {
		intro: [
			'Prendre soin de soi contribue largement à une bonne qualité de vie. Une bonne qualité de vie aide à réduire le stress, à diminuer l’envie irrépressible de consommer (ce qu’on appelle le craving) chez les personnes concernées et à éviter les rechutes.',
			'Les activités sportives, créatives et sociales, en particulier, aident à améliorer nettement l’humeur ou à atténuer les symptômes de sevrage. D’autres activités positives, planifiées de manière fixe, aident aussi à surmonter d’anciennes habitudes ou d’anciens schémas de comportement, surtout si vous les intégrez régulièrement à votre quotidien. L’important est que vous vous y sentiez bien. Cet exercice vous aide à rendre votre quotidien actif et agréable. Utilisez nos suggestions ou saisissez vos propres idées d’activités.'
		],
		howToToggle: 'Comment procéder ?',
		howTo: [
			'Saisissez ci-dessous les activités que vous prévoyez. Cliquez sur « Ajouter l’activité » pour enregistrer l’entrée.',
			'Veillez à ce que vos projets soient réalisables. Réfléchissez aussi précisément que possible aux activités que vous pouvez réellement faire, et à quel moment.',
			'Si besoin, utilisez nos suggestions pour trouver une activité qui vous convient.',
			'Les activités prévues s’affichent automatiquement dans votre journal. Si vous le souhaitez, vous pouvez aussi reporter vos entrées dans votre agenda personnel.'
		],
		newTitle: 'Planifier une nouvelle activité',
		editTitle: 'Modifier l’activité',
		suggestionsButton: 'Idées d’activités',
		titleLabel: 'Saisir une activité',
		titlePlaceholder: 'Nom ou description de l’activité',
		dateLabel: 'Choisir une date (facultatif)',
		timeLabel: 'Choisir une heure (facultatif)',
		repeatLabel: 'Répéter l’activité ?',
		repeatOptions: {
			none: 'jamais',
			daily: 'tous les jours',
			weekly: 'toutes les semaines',
			custom: 'dates choisies'
		},
		furtherDateLabel: 'Autre date',
		addDate: 'Ajouter une date',
		furtherDatesLabel: 'Autres dates',
		removeDate: 'retirer',
		removeDateLabel: 'Retirer la date : {day}',
		companionLabel: 'Accompagnement (facultatif)',
		companionPlaceholder: 'Nom d’une personne qui vous accompagne',
		missingTitle: 'Veuillez saisir une activité.',
		missingDate: 'Pour indiquer une heure ou une répétition, veuillez aussi choisir une date.',
		add: 'Ajouter l’activité',
		saveChange: 'Enregistrer la modification',
		listTitle: 'Activités saisies',
		addToCalendar: 'Ajouter à mon agenda',
		calendarFileName: 'etre-actif.ics',
		empty: 'Aucune activité saisie pour le moment.',
		editLabel: 'Modifier : {title}',
		deleteTitle: 'Supprimer l’activité',
		deleteLabel: 'Supprimer : {title}',
		confirmDelete: 'Supprimer cette activité ?',
		delete: 'Supprimer',
		noDate: 'pas de date',
		noFurtherDate: 'pas d’autre date',
		dayAndTime: '{day}, {time}',
		nextLine: 'Prochaine date : {next}',
		nextLineWithRepeat: 'Prochaine date : {next} ({repeat})',
		repeatLine: 'Répétition : {repeat}',
		furtherDatesLine: 'Autres dates : {dates}',
		companionLine: 'Accompagnement : {companion}',
		noCompanion: 'non renseigné',
		counsellor: {
			next: 'Prochaine date',
			repeat: 'Répétition',
			repeatWithDates: '{repeat} : {dates}',
			companion: 'Accompagnement',
			lastChanged: 'Dernière modification',
			new: 'Nouveau'
		},
		backToPlanning: 'Retour à la planification',
		suggestionsTitle: 'Idées d’activités',
		suggestionsHint:
			'Utilisez nos suggestions comme source d’inspiration pour votre planification personnelle. Le mieux est de formuler votre projet de façon encore plus concrète.',
		suggestions: {
			sport: {
				title: 'Actif et sportif',
				items: [
					'Se promener',
					'Faire du jogging',
					'Jouer au football',
					'Jouer au badminton',
					'Jouer au tennis de table',
					'Aller à la salle de sport',
					'Danser',
					'Faire du vélo ou une balade à vélo',
					'Faire une excursion',
					'Faire de la randonnée',
					'Aller dans une salle d’escalade',
					'Faire de la boxe',
					'Nager',
					'Jouer au minigolf',
					'Aller au bowling'
				]
			},
			relaxation: {
				title: 'Détente',
				items: [
					'Aller au sauna',
					'Prendre un bain ou une douche',
					'Se faire masser',
					'Écouter de la musique',
					'Allumer des bougies',
					'Apprendre une technique de relaxation',
					'Méditer ou faire du yoga',
					'S’embrasser',
					'Flirter',
					'Faire des câlins',
					'Écouter une fiction audio'
				]
			},
			inspiration: {
				title: 'Inspiration',
				items: [
					'Lire un livre',
					'Lire un journal ou un magazine',
					'Lire des bandes dessinées',
					'Téléphoner',
					'Écrire des e-mails ou des lettres',
					'Aller au cinéma',
					'Organiser une soirée film',
					'Aller au théâtre',
					'Assister à une conférence',
					'Aller en club ou en discothèque',
					'Aller à un concert',
					'Partir en week-end',
					'Aller dans un parc de loisirs',
					'Visiter un musée ou une exposition',
					'Flâner dans les magasins et s’offrir un petit plaisir',
					'Partir en exploration, découvrir un endroit inconnu'
				]
			},
			treats: {
				title: 'Plaisirs gourmands',
				items: [
					'Manger une glace',
					'Manger une part de gâteau',
					'Commander une pizza',
					'Cuisiner ou faire de la pâtisserie',
					'Essayer de nouvelles recettes',
					'Suivre un cours de cuisine',
					'Cuisiner pour des amis',
					'Organiser un barbecue ou un pique-nique'
				]
			},
			creative: {
				title: 'Créatif',
				items: [
					'Peindre ou dessiner',
					'Faire de la poterie',
					'Coudre ou tricoter',
					'Bricoler',
					'Faire un puzzle ou des mots croisés',
					'Apprendre une nouvelle langue',
					'Faire de la photo',
					'Suivre un cours pour adultes (université populaire, cours du soir)',
					'Lire',
					'Écrire un poème',
					'Faire de la musique'
				]
			}
		},
		demo: {
			walk: 'Se promener au bord de la rivière',
			cinema: 'Aller au cinéma',
			book: 'Lire un livre'
		}
	},
	riskSituations: {
		start:
			'Dans cet exercice, vous examinez de près vos situations à risque et élaborez des stratégies de contrôle adaptées.',
		guideShow: 'Mode d’emploi',
		guideHide: 'Masquer le mode d’emploi',
		guideIntro:
			'Si vous partagez vos entrées, votre conseillère ou votre conseiller peut lire vos réponses et mieux vous soutenir. Vous pouvez bien sûr modifier ou supprimer vos entrées comme bon vous semble. Procédez étape par étape de la manière suivante :',
		guideSteps: {
			situation: {
				title: 'Saisir des situations à risque',
				text: '{title} : les situations dans lesquelles vous avez jusqu’ici consommé des substances ou adopté le comportement problématique.'
			},
			rating: {
				title: 'Évaluer',
				text: '{title} : certaines situations à risque sont plus difficiles à surmonter que d’autres. Évaluez chaque situation selon la difficulté que vous aurez probablement à tenir bon dans cette situation.'
			},
			strategies: {
				title: 'Élaborer des stratégies de contrôle',
				text: '{title} : réfléchissez aux possibilités que vous avez de garder le contrôle dans ces situations et de ne pas retomber dans d’anciens schémas de comportement. Il peut s’agir de certaines actions ou de certaines pensées qui vous changent les idées.'
			},
			relapse: {
				title: 'Améliorer après une rechute',
				text: '{title} : si vous deviez retomber dans d’anciens schémas de comportement et d’anciennes habitudes, utilisez ce que vous en apprenez comme une leçon importante ! Retravaillez votre stratégie de contrôle pour l’améliorer. Votre conseillère ou votre conseiller peut vous soutenir dans cette démarche.'
			}
		},
		heading: 'Mes situations à risque et stratégies de contrôle',
		empty: 'Vous n’avez pas encore saisi de situation à risque.',
		noSituations: 'Aucune situation à risque saisie pour le moment.',
		deleteQuestion: 'Supprimer cette situation à risque avec toutes ses analyses de rechute ?',
		delete: 'Supprimer',
		columns: {
			situation: 'Situation à risque',
			difficulty: 'Évaluation',
			strategy: 'Stratégie de contrôle',
			relapse: 'Rechute'
		},
		difficulty: { easy: 'facile', medium: 'moyen', hard: 'difficile', 'very-hard': 'très difficile' },
		analyseRelapse: 'Analyser une rechute',
		relapseState: 'État au {date}',
		notEdited: 'pas encore rempli',
		editLabel: 'Modifier : {situation}',
		deleteLabel: 'Supprimer : {situation}',
		add: 'Saisir une nouvelle situation à risque',
		tablePdf: 'Télécharger le tableau en PDF',
		noStrategy: 'Pas encore de stratégie',
		showMore: 'afficher plus',
		showLess: 'afficher moins',
		toOverview: 'Retour à la vue d’ensemble',
		createTitle: 'Créer une situation à risque',
		editTitle: 'Modifier la situation à risque',
		situationHint:
			'Décrivez une situation typique dans laquelle vous consommez des substances ou adoptez le comportement problématique, ou dans laquelle il vous serait difficile d’y renoncer.',
		difficultyQuestion: 'À quel point est-il difficile pour vous de tenir bon dans cette situation ?',
		choose: 'Veuillez choisir',
		strategyLabel: 'Stratégie de contrôle ou d’adaptation',
		strategyQuestion:
			'Comment pouvez-vous éviter de retomber dans d’anciennes habitudes dans cette situation ?',
		missingSituation: 'Veuillez décrire la situation à risque.',
		missingDifficulty: 'Veuillez choisir une évaluation.',
		save: 'Enregistrer',
		relapseOverline: 'Analyser les rechutes',
		relapseTitle: 'Affiner vos stratégies d’adaptation',
		relapseIntro:
			'Changer ses habitudes demande souvent un effort énorme et se fait rarement sans revers. Si vous êtes retombé ou retombée dans d’anciens schémas de comportement, par exemple si vous avez bu, fumé du cannabis ou joué alors que vous ne le vouliez pas vraiment, ne vous laissez pas décourager ! Utilisez plutôt cette expérience concrète pour mieux vous préparer aux défis à venir. Analysez la situation concrète à l’aide des questions suivantes, afin d’en tirer des leçons pour l’avenir. Votre conseillère ou votre conseiller peut vous soutenir dans l’analyse des revers et dans l’élaboration de stratégies d’adaptation.',
		mySituation: 'Ma situation à risque',
		editingAnalysis: 'Vous modifiez l’analyse du {date}.',
		questions: {
			circumstances:
				'1. Quelles circonstances et quels éléments (lieu, événement, personnes présentes) ont joué un rôle dans la rechute ?',
			feelings:
				'2. Quels sentiments ou quelles pensées ont influencé votre décision et déclenché la rechute ?',
			mainReason: '3. Selon vous, quelle a été la raison principale qui a conduit à la rechute ?',
			alternatives:
				'4. Quelles autres possibilités auriez-vous eues dans cette situation ? (Qu’auriez-vous pu faire concrètement autrement ? Quelles pensées auraient pu vous aider ? Qui ou qu’est-ce qui aurait pu vous soutenir ?)',
			newStrategy:
				'5. Comment pourriez-vous faire face à cette situation à l’avenir ? (Votre réponse est automatiquement reprise comme nouvelle stratégie de contrôle pour cette situation à risque.)'
		},
		previousStrategyOverline: 'Ma stratégie de contrôle saisie précédemment :',
		noPreviousStrategy: 'Aucune stratégie saisie pour le moment.',
		newStrategyPlaceholder: 'Décrivez aussi précisément que possible votre nouvelle stratégie de contrôle',
		missingAnswer: 'Veuillez répondre à au moins une des questions.',
		newAnalysis: 'Analyser une autre rechute',
		deleteAnalysisQuestion: 'Supprimer cette analyse de rechute ?',
		pagePdf: 'Télécharger la page en PDF',
		allRelapses: 'Toutes les rechutes',
		analysisOf: 'Analyse du {date}',
		open: 'Ouvrir',
		close: 'Fermer',
		edit: 'Modifier',
		answers: {
			circumstances: 'Circonstances et éléments',
			feelings: 'Sentiments et pensées',
			mainReason: 'Raison principale',
			alternatives: 'Autres possibilités'
		},
		previousStrategy: 'Stratégie de contrôle précédente',
		newStrategy: 'Nouvelle stratégie de contrôle',
		noAnswer: 'Pas de réponse',
		new: 'Nouveau',
		lastChanged: 'Dernière modification le {date}',
		pages: 'Pages',
		previousPage: 'Précédent',
		nextPage: 'Suivant',
		pageOf: 'Page {page} sur {pages}',
		noRelapse: 'Aucune rechute notée.',
		lastRelapse: 'Dernière rechute, analysée le {date}',
		showAllRelapses: 'Toutes les rechutes ({count})',
		hideEarlierRelapses: 'Masquer les rechutes précédentes',
		analysedOn: 'Analysée le {date}',
		pdfRelapses: 'Rechutes : {situation}',
		analysisGone: 'Cette analyse n’existe plus.',
		deleted: 'Supprimée',
		demo: [
			{
				situation: 'Le vendredi soir après le travail, quand les collègues vont encore boire un verre.',
				strategy:
					'Je prévois à l’avance une séance de sport avec quelqu’un et je rentre directement à la maison.'
			},
			{
				situation: 'Quand je suis seul à la maison et que je m’ennuie.',
				strategy: 'J’appelle quelqu’un ou je vais faire un tour.'
			}
		]
	},
	trafficLight: {
		levels: {
			red: {
				colourName: 'Rouge',
				danger: 'danger élevé',
				explanation:
					'Pas touche, risque d’addiction ! Avec cette activité médiatique, il est extrêmement probable de se perdre dans l’addiction.'
			},
			yellow: {
				colourName: 'Orange',
				danger: 'danger possible',
				explanation:
					'Attention ! Cette activité médiatique pourrait devenir dangereuse. Vous devriez bien surveiller votre usage pour éviter une addiction.'
			},
			green: {
				colourName: 'Vert',
				danger: 'aucun danger',
				explanation: 'Vous pouvez pratiquer cette activité médiatique sans problème.'
			}
		},
		levelLabel: '{colour} : {danger}',
		levelOption: '{danger} ({colour})',
		intro:
			'Cet exercice vous aide à évaluer la dangerosité de chaque activité médiatique pour vous personnellement, et ainsi à renforcer votre capacité à gérer votre usage des médias. Avec le modèle des feux tricolores, vous pouvez classer les activités médiatiques dans les catégories « sans danger », « à risque » et « à éviter absolument ». Le feu n’est pas figé : il devrait être ajusté régulièrement au cours de l’accompagnement. Le but est que vous appreniez, avec votre conseillère ou votre conseiller, à comprendre aussi précisément que possible le potentiel addictif personnel de chaque activité.',
		instructionsTitle: 'Mode d’emploi :',
		instructions: [
			'Saisissez une activité médiatique.',
			'Évaluez son risque d’addiction en lui attribuant une couleur.',
			'Cliquez sur une entrée pour la modifier ou la supprimer.'
		],
		explanationsTitle: 'Signification des couleurs :',
		legendLabel: 'Légende',
		lightLabel: 'Feu tricolore',
		activityCount: { one: '{count} activité', other: '{count} activités' },
		noActivities: 'Aucune activité.',
		editActivityLabel: '{text}, {danger} : modifier ou supprimer',
		add: '+ Saisir une nouvelle activité',
		newTitle: 'Saisissez une nouvelle activité médiatique',
		editTitle: 'Modifier l’activité',
		activityLabel: 'Activité médiatique',
		examplesLabel: 'Exemples :',
		examples: [
			'Jouer à un jeu vidéo',
			'Écrire des e-mails',
			'Regarder un film',
			'Faire des opérations bancaires en ligne',
			'Instagram'
		],
		dangerQuestion: 'Quel est le risque que cette activité mène à une addiction ?',
		missingActivity: 'Veuillez saisir une activité médiatique.',
		missingLevel: 'Veuillez indiquer le niveau de danger.',
		cancel: 'Annuler',
		save: 'Enregistrer',
		delete: 'Supprimer',
		confirmDeleteLabel: 'Confirmer la suppression',
		confirmDelete: 'Supprimer cette activité ?',
		empty: 'Aucune activité saisie pour le moment.',
		new: 'Nouveau',
		pdfLevelHeading: {
			one: '{colour} : {danger} ({count} activité)',
			other: '{colour} : {danger} ({count} activités)'
		},
		demo: {
			red: 'Jouer à un jeu vidéo',
			yellow: 'Instagram',
			green: 'Écrire des e-mails'
		}
	},
	positivePerception: {
		pages: [
			'Introduction',
			'Faire des compliments',
			'Faire des compliments',
			'Percevoir les aspects positifs'
		],
		pageOf: 'Page {page} sur {count}',
		back: 'Retour',
		next: 'Suivant',
		intro: [
			'Même si les conflits et les disputes font partie de toute relation saine, les affrontements au sein de la famille peuvent, à la longue, peser lourdement sur la relation entre les parents et leurs enfants. C’est le cas, au plus tard, lorsque l’on n’accorde plus que peu, voire plus du tout, d’attention aux choses positives. Souvent, on ne fait alors plus que se plaindre des aspects négatifs au sein de la famille, et les moments positifs semblent pratiquement ne plus exister.',
			'Une « attention négative » peut nous amener à ne plus percevoir que les aspects négatifs du comportement de nos enfants : quand quelque chose ne va pas, on le critique aussitôt, alors que ce qui fonctionne bien est souvent considéré comme allant de soi. Tandis que nous remarquons immédiatement les aspects négatifs et que nous y réagissons, il se peut que nous ne percevions même plus les aspects positifs.'
		],
		schemeIntro: [
			'Il est pourtant utile de garder un œil sur ce qui fonctionne bien. Porter attention au positif renforce la confiance en soi des enfants et des adolescents et les aide à se protéger. Et de petits changements dans la manière d’être ensemble peuvent déjà avoir un grand effet sur la relation. L’ambiance familiale peut s’améliorer nettement lorsque l’on se concentre sur les aspects positifs.',
			'Le schéma ci-dessous explique ce que les commentaires négatifs et positifs peuvent provoquer chez votre enfant. Cliquez sur les commentaires pour voir la réaction de l’enfant.'
		],
		remarksLabel: 'Remarque des parents',
		quotedRemark: '« {remark} »',
		tones: {
			negative: 'négatif',
			positive: 'positif'
		},
		remarks: {
			clumsy: {
				remark: 'Tu t’y prends encore vraiment comme un idiot.',
				selfImage: 'je suis bête',
				feeling: 'négatif, mal',
				behaviour: 'en colère, pénible'
			},
			forgetful: {
				remark: 'C’était évident que tu allais encore oublier.',
				selfImage: 'on ne peut pas compter sur moi',
				feeling: 'insatisfait, honte',
				behaviour: 'triste, toujours peu fiable'
			},
			kind: {
				remark: 'C’est super que tu aies fait ça.',
				selfImage: 'je suis gentil',
				feeling: 'content',
				behaviour: 'gentil, aimable'
			},
			skilful: {
				remark: 'Comme tu es habile avec ça.',
				selfImage: 'je sais faire des choses',
				feeling: 'content',
				behaviour: 'aimable'
			}
		},
		selfImageLabel: 'Image que l’enfant a de lui-même',
		feelingLabel: 'Ressenti de l’enfant',
		behaviourLabel: 'Comportement possible de l’enfant',
		chooseRemark: 'Choisissez une remarque à gauche.',
		explanationPoints: [
			'Une « attention négative » peut peser lourdement sur le climat familial.',
			'Les commentaires négatifs peuvent avoir des conséquences négatives sur l’image que votre enfant a de lui-même et sur son comportement.',
			'Les commentaires positifs et les compliments renforcent au contraire la confiance en soi de votre enfant.'
		],
		explanationClosing:
			'Dans le cadre de cet outil, ces aspects positifs doivent donc être remis au premier plan. Le but est d’améliorer le contact et les échanges avec votre enfant grâce aux compliments et à la reconnaissance.',
		aspectsIntro:
			'La façon la plus simple de faire un retour positif à votre enfant est de le féliciter ou de lui faire un compliment. Chaque fois que vous félicitez votre enfant ou lui faites un compliment, votre propre attention se porte aussi sur ce qu’il fait de positif. Commencez donc par réfléchir aux comportements de votre enfant qui sont réjouissants et positifs. Quel comportement, quelle activité de votre enfant pourriez-vous féliciter ?',
		hideHint: 'Masquer le conseil',
		showHint: 'Afficher le conseil',
		aspectsHint:
			'Gardez à l’esprit qu’un compliment porte sur un comportement concret de votre enfant et non sur toute sa personnalité. Il s’agit peut-être de choses simples et quotidiennes, voire de choses qui, du moins à vos yeux, vont de soi. Vous pouvez bien sûr aussi féliciter un comportement ou une activité qui fait plaisir à votre enfant. En effet, il est très utile d’encourager ce genre d’activités, pour les développer et créer ainsi une alternative possible au comportement problématique (par exemple les jeux vidéo, la consommation de cannabis ou d’alcool, etc.).',
		examplesTitle: 'Voici des exemples de comportements positifs :',
		examples: [
			'Aider à la maison (par exemple faire la vaisselle)',
			'S’occuper de petites choses (par exemple faire une course)',
			'Avoir fait du sport (ou faire du sport régulièrement)',
			'Rentrer à l’heure à la maison',
			'Faire ses devoirs',
			'Avoir une bonne note (ou ne pas avoir eu de mauvaise note)',
			'Penser à un anniversaire'
		],
		inputLabel:
			'Veuillez noter ici les comportements et les activités de votre enfant que vous souhaitez féliciter :',
		emptyInput: 'Veuillez d’abord saisir quelque chose.',
		characterCount: '{length} / {max}',
		save: 'Enregistrer',
		saveChange: 'Enregistrer la modification',
		cancel: 'Annuler',
		savedTitle: 'Vos comportements enregistrés',
		noEntries: 'Pas encore d’entrées.',
		confirmDelete: 'Supprimer cette entrée ?',
		delete: 'Supprimer',
		edit: 'Modifier',
		editLabel: 'Modifier : {text}',
		deleteLabel: 'Supprimer : {text}',
		counsellorTitle: 'Comportements et activités à féliciter',
		new: 'Nouveau',
		lastChanged: 'Dernière modification le {date}',
		demoBehaviours: [
			'A débarrassé la table sans qu’on le lui demande.',
			'Est allé à l’entraînement de football ce week-end.'
		]
	}
};
