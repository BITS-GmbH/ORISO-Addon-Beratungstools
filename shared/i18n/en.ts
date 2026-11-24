import type { Complete } from './types.ts';

export const en: Complete = {
	common: {
		saving: 'Saving …',
		saved: 'Saved automatically',
		notSaved: 'Not saved',
		weekBack: 'Previous week',
		weekForward: 'Next week',
		tryLater: 'Please try again later.',
		tryAgain: 'That did not work. Please try again.',
		cancel: 'Cancel'
	},
	days: {
		period: '{from} to {to}',
		minutes: '{minutes} min',
		hours: '{hours} h',
		hoursMinutes: '{hours} h {minutes} min',
		time: '{time}',
		weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		months: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		],
		weekdayDate: '{weekday}, {date}',
		monthYear: '{month} {year}'
	},
	catalog: {
		goals: {
			title: 'Starting point and goals',
			summary: 'Describe the situation and set a goal for the counselling',
			description:
				'This tool lets you describe the current situation in your own words and name a clear goal for the counselling. Naming a personal goal precisely helps people work on improving their situation. At the same time, it gives the counsellor more options and starting points to shape the counselling well. The personal goal can be adjusted during the counselling.'
		},
		'consumption-diary': {
			title: 'Consumption diary',
			summary: 'Record use or gambling day by day',
			description:
				'In the consumption diary, people can record their substance use and/or gambling. This includes how often, how much and how long they use or gamble, but also the thoughts and feelings connected with the addictive behaviour. If they decide to share the diary with their counsellor, the counsellor can give feedback on the entries.'
		},
		'relatives-diary': {
			title: 'Diary for relatives',
			summary: 'Reflect on the day with three questions and a mood',
			description:
				'With this diary, relatives can reflect on the events of the day with the help of three questions. The questions help them sort out and write down their own thoughts and feelings about their family member’s addictive behaviour. If relatives share the diary with their counsellor, the counsellor can give feedback on the entries.'
		},
		balance: {
			title: 'Decisional balance',
			summary: 'Weigh up the pros and cons of a change',
			description:
				'The decisional balance helps people weigh up the pros and cons of overcoming their addictive behaviour. This can bring doubts and worries to light and make decisions clearer. If they want to, they can let their counsellor see their notes, so the counsellor can respond to their personal considerations.'
		},
		'emergency-kit': {
			title: 'Emergency kit',
			summary: 'Strategies and contacts for difficult situations',
			description:
				'With this tool, people can put together their personal emergency kit, which helps them avoid a relapse in especially difficult situations. The emergency kit can hold contact details of counsellors or family members as well as concrete steps to take and sayings to remember.'
		},
		active: {
			title: 'Being active',
			summary: 'Plan pleasant activities, also regularly',
			description:
				'This tool helps people make their everyday life more positive with pleasant activities, to improve their quality of life and reduce cravings. Activities can be entered freely or chosen from a list of suggestions, and planned once or on a regular basis.'
		},
		'risk-situations': {
			title: 'Risk situations and control strategies',
			summary: 'Record risk situations, strategies and relapses',
			description:
				'With this tool, people can look closely at their personal risk situations and work out suitable control strategies. If relapses happen, they can be recorded and the strategies revised. If they want to, they can make their notes available to their counsellor, so the counsellor can respond to the risk situations and control strategies.'
		},
		'traffic-light': {
			title: 'Traffic light model',
			summary: 'Sort media activities by their risk',
			description:
				'The traffic light model helps people assess the personal risk of individual media activities and strengthen their ability to use media in a healthy way. Like a traffic light, media activities can be sorted into “green” (safe), “yellow” (risky) and “red” (very risky) activities.'
		},
		'positive-perception': {
			title: 'Seeing the positive',
			summary: 'For parents: see the positive in the child’s behaviour',
			description:
				'This tool helps parents notice the positive sides of their child’s behaviour more consciously, to improve how they interact and talk with their child. It explains the risks of negative communication and how positive reinforcement affects the child’s feelings and behaviour. Parents can reflect on how they use praise and plan positive communication.'
		}
	},
	client: {
		myTools: 'My tools',
		intro:
			'Your counsellor has unlocked these exercises for you. Your counsellor only sees what you enter if you share it.',
		loadError: 'Your tools could not be loaded.',
		noneTitle: 'No tools unlocked yet',
		noneText: 'Your counsellor can unlock tools for you. Feel free to ask them about it.',
		new: 'New',
		shared: 'Shared with your counsellor',
		continue: 'Continue',
		open: 'Open'
	},
	toolPage: {
		loadError: '“{title}” could not be loaded.',
		notReleased: 'This tool is no longer unlocked.',
		notReleasedNotSaved: 'This tool is no longer unlocked. Your input was not saved.',
		saveFailed: 'Saving did not work. Please try again.',
		pdfFailed: 'The PDF could not be created. Please try again.',
		sharedNow: 'Your counsellor can now see this content.',
		privateAgain: 'The content is now only visible to you again.',
		shareOverline: 'Visible to your counsellor',
		shareLabel: 'Share with my counsellor',
		shareOn: 'Your counsellor can see your entries and is told about new entries.',
		shareOff: 'Your entries are only visible to you.',
		notAvailable: 'This tool is not available yet.'
	},
	counsellor: {
		loadError: 'The tools of this case could not be loaded.',
		openFromCase: 'Please open the tools from within a case.',
		tools: 'Tools',
		released: 'Unlocked',
		releasedTools: 'Unlocked tools',
		notReleasedYet: 'Not unlocked yet',
		notReleasedTools: 'Tools not unlocked yet',
		noTools: 'No tools are switched on for this counselling centre.',
		shared: 'Shared with you',
		entriesNotShared: 'Has entries, not shared',
		noEntries: 'No entries yet',
		newEntries: { one: '{count} new entry', other: '{count} new entries' },
		dpa: 'Unlocking is not possible right now: the organisation has not yet confirmed the current data processing agreement.',
		releasedOn: 'Unlocked on {date}',
		lastChangedOn: 'last edited on {date}',
		allTools: 'All tools',
		notReleased: 'Not unlocked',
		release: 'Unlock',
		releasedNotice: '“{title}” is unlocked. The client will be notified.',
		viewEntries: 'View entries',
		preview: 'User preview',
		withdraw: 'Lock again',
		previewHint: 'The user preview shows the tool as the client sees it, with test data.',
		withdrawConfirm:
			'Lock this tool again? The tool disappears for the client and you no longer see any content. The entries stay saved.',
		withdrawButton: 'Lock',
		withdrawn: 'The tool is locked again. The entries stay saved.'
	},
	entries: {
		back: 'Back to overview',
		noAccess: 'Not shared',
		loadError: 'The entries could not be loaded.',
		revoked: 'The client has stopped sharing, or the tool is no longer unlocked.',
		exportRevoked: 'The client has stopped sharing. Exporting is not possible.',
		exportFailed: 'The export did not work. Please try again.',
		readOnly: 'Entries, read only',
		lastChangedOn: 'Last edited on {date}',
		noEntries: 'No entries yet',
		sharedSince: 'shared since {date}',
		exporting: 'Creating export …',
		createExport: 'Create export',
		exportPdf: 'Export as PDF',
		noView: 'There is no view for this tool yet.'
	},
	demo: {
		resetFailed: 'The demo could not be reset.',
		banner: 'User preview / demo: nothing is saved in a real case',
		bannerText:
			'This is how clients see the tool. What you enter here is test data, separate from all cases, and stays for you until you reset the demo.',
		reset: 'Reset demo',
		end: 'End preview'
	},
	prefs: {
		button: 'Notifications',
		saved: 'Your notification settings have been saved.',
		saveFailed: 'The settings could not be saved.',
		title: 'Notification settings',
		intro:
			'What would you like to be told about when clients share their tools with you? This applies to all your cases. Several changes made shortly after one another are combined.',
		firstShare: 'Tool content shared for the first time',
		newEntry: 'New entries in shared tools',
		changedEntry: 'Changes to existing entries',
		save: 'Save settings'
	},
	profile: {
		loadError: 'The tools could not be loaded.',
		none: 'No tools unlocked yet.',
		newCount: '{count} new',
		shared: 'Shared with you',
		notShared: 'Not shared',
		open: 'Open tools in the case'
	},
	rangePicker: {
		label: 'Period',
		all: 'All entries',
		from: 'from {day}',
		until: 'until {day}',
		choose: 'Choose {label}',
		quick: 'Quick choice',
		thisWeek: 'This week',
		lastFourWeeks: 'Last 4 weeks',
		previousMonth: 'Previous month',
		nextMonth: 'Next month',
		pickFirst: 'Choose the first day of the period.',
		pickLast: 'From {day}: now choose the last day.'
	},
	planned: {
		title: 'Planned activities this week',
		none: 'No activities are planned for this week.',
		plan: 'Plan activities in “Being active”',
		with: 'with {name}'
	},
	pdf: {
		brand: 'Counselling tools',
		case: 'Case',
		createdAt: 'Export created on',
		period: 'Period of the entries',
		confidential:
			'Confidential. Content the client has chosen to share, for use in the counselling context only.',
		personal: 'Personal document from the counselling tools.',
		page: 'Page {page} of {pages}',
		caseLabel: 'Case {id}',
		caseWithoutId: 'Case without ID',
		noEntries: 'No entries',
		fileCase: 'case'
	},
	notifications: {
		someone: 'A client',
		sharedTitle: 'Tool shared with you',
		entriesTitle: 'New entries in a tool',
		changedTitle: 'Entries changed in a tool',
		addedAndChangedTitle: 'New and changed entries in a tool',
		shared: '{who} shared “{tool}” with you.',
		sharedAnd: '{who} shared “{tool}” with you and {what}.',
		changes: '{who} {what} in “{tool}”.',
		added: 'added entries',
		changed: 'changed entries',
		addedAndChanged: 'added and changed entries',
		releasedTitle: 'New tool unlocked',
		released: '“{tool}” is now available in “My tools”.'
	},
	audit: {
		released: 'Released tool “{tool}”',
		withdrawn: 'Withdrew tool “{tool}”',
		exported: 'Exported “{tool}” as PDF',
		shared: 'Shared “{tool}” with the counsellor',
		unshared: 'Stopped sharing “{tool}”'
	},
	manifest: {
		title: 'Tools',
		description:
			'Digital counselling tools: counsellors release exercises, clients work on them and may share them with their counsellor.',
		screenshotOverview: 'Tools of a case',
		screenshotEntries: 'Shared entries, read only',
		screenshotBalance: 'The client’s decisional balance',
		statReleased: '{tool}: released',
		statStarted: '{tool}: started',
		statShared: '{tool}: shared'
	},
	goals: {
		steps: {
			situation: {
				section: 'Current situation',
				title: 'Question 1 of 4: What is your current situation?',
				hint: [
					'Please briefly describe',
					'• your own substance use or gambling, or',
					'• the main issues or conflicts in dealing with a family member who uses substances or gambles.'
				],
				summary: 'Your current situation',
				counsellorLabel: 'Current situation'
			},
			factors: {
				section: 'What keeps things as they are',
				title: 'Question 2 of 4: What are the positive sides of the current situation?',
				hint: [
					'What positive effects does substance use, gambling or media use have for you? What do you think: which reasons play a part for you when you use or gamble? What reasons might there be to leave the current situation as it is?'
				],
				summary: 'Things that make a change difficult',
				counsellorLabel: 'Things that make a change difficult'
			},
			motivation: {
				section: 'Motivation to change',
				title: 'Question 3 of 4: Why do you want to change something about the current situation?',
				hint: ['What bothers you or weighs on you? Which things are not going the way you would like?'],
				summary: 'Reasons for changing the situation',
				counsellorLabel: 'Reasons for changing the situation'
			},
			resources: {
				section: 'Personal strengths',
				title: 'Question 4 of 4: Who or what could help you with your plan?',
				hint: [
					'Do you have hobbies that take your mind off things, or friends or family who can support you?'
				],
				summary: 'Your personal strengths',
				counsellorLabel: 'Personal strengths'
			},
			goal: {
				section: 'Setting a goal',
				title: 'Before you start: set your goal',
				hint: [
					'To work steadily on improving your situation over the coming weeks, it is important to name your personal goal as precisely as possible. What would you like to achieve in the coming weeks? What should the counselling help you with?',
					'What concrete goal are you aiming for? (You can change your answer later.)'
				],
				summary: 'Your personal goal',
				counsellorLabel: 'Personal goal'
			}
		},
		start:
			'Please use the following questions to describe your current situation. Think about the reason you came to counselling. Your answers help to judge which exercises will be most helpful for you. Your counsellor’s feedback can then also respond better to your actual situation.',
		startButton: 'Let’s start',
		summaryTitle: 'Summary',
		summaryText:
			'You have looked closely at your current situation and set a concrete goal. This is an important first step towards improving the situation. You can revise your answers at any time if you need to. I am happy to support you with this.',
		overview: 'Your answers at a glance:',
		edit: 'Edit',
		editLabel: 'Edit: {label}',
		empty: 'No answer yet',
		restart: 'Go through it again',
		home: 'My start page',
		autosave: 'Your answers are saved automatically.',
		back: 'Back',
		toSummary: 'Go to summary',
		next: 'Next',
		new: 'New',
		lastChanged: 'Last changed on {date}',
		noAnswer: 'No answer',
		noAnswers: 'No answers yet.',
		reminder: 'Fill in starting point and goals',
		demoSituation: 'For a few months I have been drinking almost every evening, usually two or three beers.'
	},
	consumptionDiary: {
		intro:
			'The diary is for writing down every day everything connected with the change you are aiming for. It is important to keep at it and to record all relevant thoughts and feelings in detail. This helps you reach your goal! The clearer the picture your counsellor has of your situation, the better the counselling can support you. That is why we recommend sharing your entries with your counsellor.',
		about: 'About the consumption diary',
		nav: {
			label: 'Consumption diary',
			week: 'My week',
			entry: 'Diary entry',
			settings: 'Settings'
		},
		settings: {
			title: 'Record these topics:',
			addTopic: 'Add another topic',
			pickTopic: 'Please choose at least one topic.',
			save: 'Save',
			start: 'Start diary'
		},
		newEntry: {
			title: 'Diary entry',
			date: 'Date',
			add: 'Add entry: {topic}'
		},
		week: {
			title: 'My week',
			cell: '{day}: {question}'
		},
		yes: 'yes',
		no: 'no',
		day: {
			back: 'Back to the week',
			overline: 'Diary | {topic}',
			deleteAll: 'Delete entries',
			cancel: 'Cancel',
			moreAfterYes: 'More info',
			moreAfterNo: 'More info',
			logged: 'Recorded for this day:',
			noPhase: 'No entry yet',
			delete: 'Delete',
			editTitle: 'Edit',
			deleteTitle: 'Delete',
			summary: 'Review of the day',
			ratingHint: 'What went well for you today? What did not go so well? Think about your personal goal.',
			planQuestion: 'What do you plan for tomorrow?',
			done: 'Done',
			save: 'Save'
		},
		phase: {
			back: 'Back to the day',
			date: 'Date',
			start: 'Time (start)',
			end: 'Time (end)',
			nothingYet: 'Nothing added yet.',
			deleteItem: 'Delete item',
			deleteItemLabel: 'Delete item: {item}',
			deviceQuestion:
				'Which device did you use? (for example computer, smartphone, games console or handheld games device)',
			missingItem: 'Please fill in at least one item and click “Add”.',
			choose: 'Please choose',
			group: '{group}:',
			drink: 'Drink',
			size: 'Size',
			count: 'Number',
			joints: 'Joints',
			bongs: 'Bongs',
			otherKind: 'Other',
			gambling: 'Gambling',
			media: 'Media',
			hours: 'Duration: hours',
			minutes: 'Minutes',
			add: 'Add',
			cancel: 'Cancel',
			timeRange: '{start} to {end}',
			time: '{time}',
			when: '{time}:',
			noItems: 'No details about use'
		},
		topics: {
			alcohol: {
				label: 'Alcohol',
				weekQuestion: 'Did you drink alcohol?',
				dayQuestion: 'Did you drink alcohol today?',
				pastDayQuestion: 'Did you drink alcohol on this day?',
				ratingQuestion: 'How would you rate today with regard to your drinking?',
				pastRatingQuestion: 'How would you rate this day with regard to your drinking?',
				planHint:
					'Will you set yourself a task or a small goal for the next day? (For example: not drinking, getting a task done, doing something nice, etc.)',
				yesIntro:
					'Record your drinking here. Please make a new entry for each situation or phase in which you drank.',
				yesMore:
					'For example, if you drank at lunchtime and in the evening, make two entries. If you had several drinks within one period of time, you can enter this as one phase. The aim of the diary is for you and your counsellor to understand your drinking as precisely as possible, so that you can change it successfully.',
				noIntro:
					'You didn’t drink any alcohol today? Wonderful! Be sure to write down what helped you stay sober and how you felt about it.',
				pastNoIntro:
					'You didn’t drink any alcohol on this day? Wonderful! Be sure to write down what helped you stay sober and how you felt about it.',
				noMore:
					'Maybe you were able to use your control strategies successfully? Your notes in the diary help you and your counsellor to recognise strategies that work especially well for a lasting change in behaviour and a sober life. If you don’t want to write anything, just click save.',
				contextQuestion: 'Who were you with and where did you drink?',
				triggerQuestion: 'Why? What was the reason or trigger for using?',
				phaseTitle: 'Alcohol: add a phase of drinking',
				newPhase: 'Add a new phase',
				editPhase: 'Edit phase',
				deletePhase: 'Delete phase',
				deletePhaseQuestion: 'Delete this phase?',
				deleteAllQuestion: 'All phases entered for this day will be deleted. Continue anyway?',
				saveLabel: 'Save phase',
				loggedLabel: 'Drinks recorded:'
			},
			cannabis: {
				label: 'Cannabis',
				weekQuestion: 'Did you use cannabis?',
				dayQuestion: 'Did you use cannabis today?',
				pastDayQuestion: 'Did you use cannabis on this day?',
				ratingQuestion: 'How would you rate today with regard to your cannabis use?',
				pastRatingQuestion: 'How would you rate this day with regard to your cannabis use?',
				planHint:
					'Will you set yourself a task or a small goal for the next day? (For example: not smoking weed, getting a task done, doing something nice, etc.)',
				yesIntro:
					'Record your cannabis use here. Please make a new entry for each situation or phase in which you used.',
				yesMore:
					'For example, if you smoked at lunchtime and in the evening, make two entries. If you used several times within one period of time, you can enter this as one phase. The aim of the diary is for you and your counsellor to understand your use as precisely as possible, so that you can change it successfully.',
				noIntro:
					'You didn’t use today? Wonderful! Be sure to write down what helped you stay sober and how you felt about it.',
				pastNoIntro:
					'You didn’t use on this day? Wonderful! Be sure to write down what helped you stay sober and how you felt about it.',
				noMore:
					'Maybe you were able to use your control strategies successfully? Your notes in the diary help you and your counsellor to recognise strategies that work especially well for a lasting change in behaviour and a sober life. If you don’t want to write anything, just click save.',
				contextQuestion: 'Who were you with and where did you smoke?',
				triggerQuestion: 'Why? What was the reason or trigger for using?',
				phaseTitle: 'Cannabis: add your use',
				newPhase: 'Add a new phase',
				editPhase: 'Edit phase',
				deletePhase: 'Delete phase',
				deletePhaseQuestion: 'Delete this phase?',
				deleteAllQuestion: 'All phases entered for this day will be deleted. Continue anyway?',
				saveLabel: 'Save phase',
				loggedLabel: 'Use recorded:'
			},
			gambling: {
				label: 'Gambling',
				weekQuestion: 'Did you gamble?',
				dayQuestion: 'Did you gamble today?',
				pastDayQuestion: 'Did you gamble on this day?',
				ratingQuestion: 'How would you rate today with regard to your gambling?',
				pastRatingQuestion: 'How would you rate this day with regard to your gambling?',
				planHint:
					'Will you set yourself a task or a small goal for the next day? (For example: not gambling, getting a task done, doing something nice, etc.)',
				yesIntro: 'Record your gambling here. Please make a new entry for each period in which you gambled.',
				yesMore:
					'For example, if you gambled at lunchtime and in the evening, make two entries. If you played several kinds of games within one period of time, you can enter them as one gambling session. The aim of the diary is for you and your counsellor to understand your behaviour as precisely as possible, so that you can change it successfully.',
				noIntro:
					'You didn’t gamble today? Wonderful! Be sure to write down what helped you stay gambling-free and how you felt about it.',
				pastNoIntro:
					'You didn’t gamble on this day? Wonderful! Be sure to write down what helped you stay gambling-free and how you felt about it.',
				noMore:
					'Maybe you were able to use your control strategies successfully? Your notes in the diary help you and your counsellor to recognise strategies that work especially well for a lasting change in behaviour and a gambling-free life. If you don’t want to write anything, just click save.',
				contextQuestion: 'Where and with whom did you gamble?',
				triggerQuestion: 'Why? What was the reason or trigger for gambling?',
				phaseTitle: 'Add gambling',
				newPhase: 'Add a new gambling session',
				editPhase: 'Edit gambling session',
				deletePhase: 'Delete gambling session',
				deletePhaseQuestion: 'Delete this gambling session?',
				deleteAllQuestion: 'All gambling sessions entered for this day will be deleted. Continue anyway?',
				saveLabel: 'Save entry',
				loggedLabel: 'Gambling recorded:'
			},
			media: {
				label: 'Media',
				weekQuestion: 'Did you use media?',
				dayQuestion: 'Did you use media today?',
				pastDayQuestion: 'Did you use media on this day?',
				ratingQuestion: 'How would you rate today with regard to your media use?',
				pastRatingQuestion: 'How would you rate this day with regard to your media use?',
				planHint:
					'Will you set yourself a task or a small goal for the next day? (For example: not gaming, getting a task done, doing something nice, etc.)',
				yesIntro: 'Record your media use here. Please make a new entry for each situation or phase of use.',
				yesMore:
					'For example, if you used media at lunchtime and in the evening, make two entries. If you used several media within one period of time, you can enter this as one phase. The aim of the diary is for you and your counsellor to understand your media use as precisely as possible, so that you can change it successfully.',
				noIntro:
					'You didn’t use any media today? Wonderful! Be sure to write down what helped you and how you felt about it.',
				pastNoIntro:
					'You didn’t use any media on this day? Wonderful! Be sure to write down what helped you and how you felt about it.',
				noMore:
					'Maybe you were able to use your control strategies successfully? Your notes in the diary help you and your counsellor to recognise strategies that work especially well for a lasting change in behaviour. If you don’t want to write anything, just click save.',
				contextQuestion: 'Where and with whom did you use media?',
				triggerQuestion: 'Why? What was the reason or trigger for using media?',
				phaseTitle: 'Add media use',
				newPhase: 'Add a new media session',
				editPhase: 'Edit media session',
				deletePhase: 'Delete media session',
				deletePhaseQuestion: 'Delete this media session?',
				deleteAllQuestion: 'All media sessions entered for this day will be deleted. Continue anyway?',
				saveLabel: 'Save entry',
				loggedLabel: 'Media use recorded:'
			}
		},
		drinks: {
			beer: 'Beer',
			wine: 'Wine / sparkling wine',
			spirits: 'Spirits',
			liqueur: 'Liqueur',
			'beer-mix': 'Beer mixed drinks',
			alcopop: 'Alcopops'
		},
		cannabisUnits: {
			joint: 'joint',
			bong: 'bong'
		},
		gameGroups: {
			local: 'Gambling in person',
			online: 'Online / on the internet'
		},
		games: {
			'slot-arcade': 'Slot machines in amusement arcades',
			'slot-gastro': 'Slot machines in bars and restaurants',
			'casino-small': 'Slot machines in a casino',
			'casino-large': 'Table games in a casino',
			sports: 'Sports betting',
			horses: 'Horse race betting',
			lottery: 'Lotteries',
			'other-local': 'Other gambling in person',
			'online-slots': 'Online slot machines',
			'online-casino': 'Online casino games (casino table games, except poker)',
			'online-poker': 'Online poker',
			'online-sports': 'Online sports betting',
			'online-horses': 'Online horse race betting',
			'online-lottery': 'Online lotteries',
			'online-other': 'Other online gambling'
		},
		mediaGroups: {
			games: 'Online games',
			communication: 'Communicating over the internet',
			social: 'Social networks (for example TikTok, Instagram, WhatsApp, Telegram, Facebook)',
			surfing: 'Surfing the internet',
			more: 'Other media activities'
		},
		media: {
			action: 'Action games (for example jump ’n’ run, beat ’em ups, action adventures)',
			shooter: 'First-person shooters',
			rpg: 'Role-playing games (for example MMORPGs, online and offline role-playing games)',
			strategy: 'Strategy games (for example real-time strategy, building games)',
			'sports-games': 'Sports games (for example manager games, sports simulations)',
			simulation: 'Simulation games (for example flight, racing or life simulations)',
			'music-games': 'Music and dance games (for example Just Dance Now, SingStar, Let’s Sing)',
			skill: 'Skill games (for example Tetris)',
			chat: 'Chatting',
			mail: 'Writing emails',
			'social-watch': 'Watching videos / looking at pictures',
			'social-talk': 'Talking with other people',
			research: 'Research',
			shopping: 'Shopping',
			magazines: 'Online magazines',
			streaming: 'Online streaming (for example Netflix, TV channel apps, Amazon Prime)',
			porn: 'Porn websites',
			device: 'Optimising a computer / device',
			'other-media': 'Other use of electronic media'
		},
		items: {
			alcohol: '{count}x {size} {drink}',
			cannabis: '{count}x {unit}',
			otherKind: 'Other: {text}',
			otherKindCount: 'Other: {count}x {text}',
			duration: '{activity}, {duration}'
		},
		sums: {
			phases: { one: '{count} phase', other: '{count} phases' },
			drinks: { one: '{count} drink', other: '{count} drinks' },
			alcohol: '{drinks}, about {grams} g of alcohol',
			joints: { one: '{count} joint', other: '{count} joints' },
			bongs: { one: '{count} bong', other: '{count} bongs' },
			otherKind: '{count}x other'
		},
		counsellor: {
			noEntries: 'No entries yet.',
			topics: 'Topics recorded: {topics}',
			new: 'New',
			noDayEntries: 'No entries',
			tileTopic: '{topic}:',
			noConsumption: 'No use recorded',
			entriesOf: 'Entries from {day}',
			answerYes: '{topic}: yes',
			answerNo: '{topic}: no',
			device: 'Device',
			context: 'Where and with whom',
			trigger: 'Reason or trigger',
			rating: 'Rating of the day',
			plan: 'Plan for tomorrow',
			summaryNew: 'Review new'
		},
		pdf: {
			noEntries: 'No entries in this period.',
			topics: 'Topics recorded: {topics}',
			answerYes: '{topic}: yes ({sum})',
			answerNo: '{topic}: no',
			device: 'Device: {device}',
			context: 'Where and with whom: {context}',
			trigger: 'Reason or trigger: {trigger}',
			rating: 'Rating of the day',
			plan: 'Plan for tomorrow'
		},
		demo: {
			alcoholRating: 'After the argument I drank more than I had planned.',
			alcoholPlan: 'Go straight home after work.',
			alcoholContext: 'At home, alone',
			alcoholTrigger: 'Argument on the phone',
			gamblingRating: 'I didn’t take any money with me, that helped.',
			soberRating: 'Did sport in the evening instead of having a beer.',
			soberPlan: 'Go to sport again.',
			gamblingContext: 'On the bus and at home',
			gamblingTrigger: 'Boredom'
		}
	},
	relativesDiary: {
		title: 'My diary',
		intro: [
			'The diary is a place to write down the moving, difficult or happy events and thoughts of your day. For your entries, you can use the three questions shown in the day view as a guide. For example, click on today to make an entry.',
			'Writing down experiences and thoughts, sorting them and “getting them off your chest” is often a relief in itself. Your diary entries are also important for your personal counselling: the better your counsellor understands your situation, the better they can support you. That is why we recommend making your entries visible to your counsellor.'
		],
		questionsToday: [
			'What was important to you today?',
			'How did communication with your relative go today?',
			'How do you feel about it?'
		],
		questionsOtherDay: [
			'What was important to you on this day?',
			'How did communication with your relative go on this day?',
			'How do you feel about it?'
		],
		moodQuestionToday: 'How would you rate today?',
		moodQuestionOtherDay: 'How would you rate this day?',
		moods: {
			'very-bad': 'very bad',
			'rather-bad': 'quite bad',
			average: 'okay',
			'rather-good': 'quite good',
			'very-good': 'very good'
		},
		noMood: 'not given',
		weekEntriesHeading: 'Diary entries',
		weekMoodHeading: 'Mood',
		openEntry: 'Open',
		openEntryLabel: 'Open entry: {day}',
		createEntry: 'Create entry',
		createEntryLabel: 'Create entry: {day}',
		backToOverview: 'back to the overview',
		entryLabel: 'Diary entry',
		emptyEntry: 'Please write something down or rate the day.',
		saveEntry: 'Save entry',
		deleteEntry: 'Delete entry',
		deleteConfirm: 'Delete this diary entry?',
		deleteButton: 'Delete',
		weekView: 'Week view',
		allEntries: 'All entries',
		new: 'New',
		noEntryForDay: 'No entry',
		noEntries: 'No entries yet.',
		pdfNoEntries: 'No entries in this period.',
		pdfMood: 'Rating of the day: {mood}',
		pdfNoText: 'No text entered.',
		demoEntries: [
			'Tonight there was another argument when he came home late. I tried to stay calm and not to blame him. Afterwards I was exhausted, but also a little proud.',
			'A quiet day. We went for a walk together and talked about our holiday.'
		]
	},
	balance: {
		intro:
			'Changing your own habits is always a challenge. Every change takes effort, costs energy and needs staying power. The decisional balance helps you to get clear about the advantages and disadvantages of overcoming your addictive behaviour.',
		howItWorks: 'How the decisional balance works',
		howItWorksStep: '{title}:',
		howItWorksSteps: [
			{
				title: 'Collect arguments',
				text: 'Think about it for yourself: what will happen if I change my behaviour, for example if I stop drinking, gambling or smoking cannabis? What will happen if I carry on as before? Be honest with yourself!'
			},
			{
				title: 'Rate them',
				text: 'In both cases, the effects of a change can be positive or negative for you. Also think about whether these effects are especially important to you or less important.'
			},
			{
				title: 'Look at the result',
				text: 'Once you have entered and rated all the advantages and disadvantages, the decisional balance shows you your current inner attitude towards the chosen topic.'
			},
			{
				title: 'Draw a conclusion',
				text: 'What is your conclusion? How would you rate your current motivation? Are you ready inside to change your behaviour? Or do you need more arguments?'
			}
		],
		howItWorksNote:
			'You can work on the exercise again and add to it at any time when you think of new advantages and disadvantages. If you like, your counsellor can see your answers and so support you as well as possible with your plan.',
		workOnExerciseFirst: 'Please work through the exercise first.',
		sides: { pro: 'PRO', contra: 'CON' },
		poles: [
			{ contra: 'Against change', pro: 'For change' },
			{ contra: 'No change', pro: 'I want to change something!' },
			{ contra: 'Fine the way it is', pro: 'Something has to change!' }
		],
		ratings: {
			very: 'very important',
			quite: 'quite important',
			some: 'a little important',
			none: 'not important at all'
		},
		notImportant: 'not important',
		ratingOption: '{label} ({stars})',
		ratingQuestion: 'How important is this to you?',
		halves: {
			change: 'If I reach my goal / change my behaviour, I will have the following …',
			keep: 'If I do not change my behaviour / do not reach my goal, I will have the following …'
		},
		categoryInHalf: '… {title}',
		categoryWithSide: '{category} ({side})',
		categories: {
			A: {
				title: 'advantages',
				long: 'Advantages of changing my behaviour',
				listTitle: 'The advantages you entered if you reach your goal:'
			},
			B: {
				title: 'disadvantages',
				long: 'Disadvantages of changing my behaviour',
				listTitle: 'The disadvantages you entered if you reach your goal:'
			},
			C: {
				title: 'advantages',
				long: 'Advantages if nothing changes',
				listTitle: 'The advantages you entered if you do not change your behaviour:'
			},
			D: {
				title: 'disadvantages',
				long: 'Disadvantages if nothing changes',
				listTitle: 'The disadvantages you entered if you do not change your behaviour:'
			}
		},
		argumentKinds: {
			advantage: {
				missing: 'Please enter an advantage.',
				add: 'New advantage',
				edit: 'Edit advantage',
				placeholder: 'Enter an advantage here. Use a new entry for each advantage.'
			},
			disadvantage: {
				missing: 'Please enter a disadvantage.',
				add: 'New disadvantage',
				edit: 'Edit disadvantage',
				placeholder: 'Enter a disadvantage here. Use a new entry for each disadvantage.'
			}
		},
		examples: {
			A: [
				'I get more done again.',
				'I have time for hobbies again.',
				'I can think clearly again.',
				'More money / less debt.',
				'My body is not under so much strain any more.',
				'I feel better.',
				'A good feeling because I am tackling the problem.',
				'Less stress with friends / family.'
			],
			B: [
				'It will be difficult with my old group of friends.',
				'I will miss the high.',
				'It could get pretty boring.',
				'A lot of things will be much less fun.',
				'Withdrawal / going without will be hard.',
				'The hope of a big win is gone.'
			],
			C: [
				'I can fall asleep more easily.',
				'More fun when I am with friends.',
				'When I drink / gamble / smoke cannabis, I get some peace.',
				'I can really get “wasted” sometimes and forget everything around me.',
				'The chance of a win remains.'
			],
			D: [
				'I hardly do anything else.',
				'I let a lot of other things slide.',
				'I get more and more annoyed with myself.',
				'More trouble and arguments with my family.',
				'I can hardly get out of bed in the morning.',
				'My debts stay / keep growing.',
				'My health keeps getting worse.',
				'My life is still reduced to one problem.'
			]
		},
		tendency: {
			pending: 'Cannot be calculated yet',
			balanced: 'Balanced',
			maximum: 'Maximum {side} tendency',
			clear: '{side} tendency',
			slight: 'Slight {side} tendency'
		},
		resultLabel: 'Result of the decisional balance',
		scaleTitle: 'Decisional balance: {value}, {tendency}',
		scaleInactiveTitle: 'Decisional balance: not active yet',
		allRatedZero: 'All arguments are rated “not important at all”, so the scale is not active yet.',
		sidePoints: { one: '{side} {count} point', other: '{side} {count} points' },
		valueWithTendency: '{value}, {tendency}',
		miniInactive: 'Scale not active yet',
		conclusionTitle: 'My conclusion',
		conclusionPrompt:
			'What picture do you get after collecting all the arguments? What conclusions do you draw for yourself at the moment?',
		saveConclusion: 'Save conclusion',
		edit: 'Edit',
		add: 'Add',
		noEntriesYet: 'No entries yet.',
		backToOverview: 'Back to the decisional balance overview',
		argumentType: 'Type of argument',
		showExamples: 'Show examples',
		hideExamples: 'Hide examples',
		allExamplesUsed: 'All examples have already been entered.',
		ratingMissing: 'Please rate how important this is to you.',
		saveChange: 'Save change',
		addEntry: 'Add entry',
		confirmDelete: 'Delete this entry?',
		delete: 'Delete',
		editItem: 'Edit: {text}',
		deleteItem: 'Delete: {text}',
		finish: 'Finish',
		counsellor: {
			noArguments: 'No arguments entered yet.',
			conclusion: 'Conclusion',
			new: 'New',
			noConclusion: 'No conclusion entered yet.',
			noEntries: 'No entries.',
			open: 'Open',
			close: 'Close',
			category: 'Category',
			relevance: 'Importance',
			relevanceValue: { one: '{label} ({count} point)', other: '{label} ({count} points)' },
			lastChanged: 'Last changed'
		},
		pdf: {
			result: 'Result',
			inactive: 'The scale is not active yet (no importance points).',
			summary: 'Motivation score {value} ({tendency}), {pro}, {contra}, on a scale from −10 to +10.',
			conclusion: 'Conclusion',
			noConclusion: 'No conclusion entered.',
			arguments: 'Arguments',
			noEntries: 'No entries.',
			rating: '{label} ({count})'
		}
	},
	emergencyKit: {
		sections: {
			motivation: {
				title: 'My motivation: why I am sticking with it',
				listLabel: 'This is why I want to change my behaviour / reach my goal:',
				fieldLabel: 'This is why I want to change my behaviour / reach my goal',
				cardTitle: 'Why I am sticking with it',
				intro:
					'There are many good reasons why you are working towards your personal goal. Write down the reasons that matter most to you personally. This helps you to make your decision even firmer. Read your reasons again and again so that you always keep them in mind. We have collected some examples for you that you can use as a guide.',
				examples: [
					{
						label: 'Examples',
						items: [
							'I have time for other things again',
							'Finally no more feelings of guilt',
							'I want my partner to be able to trust me again',
							'I want to feel myself again',
							'I don’t want to have to think about it all the time',
							'If I carry on like this, my relationship will be over',
							'Finally being free again',
							'I no longer have to lie to my family, my friends or my employer',
							'No more secrets, no more double life',
							'I can look my children in the eye again',
							'Finally time and energy for other things again',
							'No more criminal activities to get money',
							'I can look myself in the eye again',
							'Finally no more new debts',
							'If I carry on like this, I will get deeper and deeper into trouble'
						]
					}
				]
			},
			strategy: {
				title: 'My strategies for everyday life',
				listLabel: 'This helps me reach my goal:',
				fieldLabel: 'This helps me in everyday life',
				cardTitle: 'This helps me in everyday life',
				intro:
					'Write down everything that helps you reach your goal in everyday life. Simple rules of behaviour that you set for yourself are especially helpful. But hobbies and activities that you do regularly also help to take your mind off cravings, reduce stress and reach your goal in the long term. Below are some examples that you can use.',
				examples: [
					{
						label: 'General',
						items: [
							'I keep getting help',
							'I go to my self-help group regularly',
							'I look after my friendships',
							'I make sure I do active things in my free time',
							'I don’t bottle up anger and frustration',
							'I play it safe',
							'I avoid my gambling or drinking friends',
							'I avoid friends who use substances',
							'I do sport regularly',
							'I pay attention to risk situations and early warning signs of a possible relapse',
							'I keep working on my goal of staying abstinent',
							'I stand up for my needs',
							'I reward myself now and then',
							'I treat myself to something nice',
							'I face my problems',
							'I take care of my debts'
						]
					},
					{
						label: 'Gambling',
						items: [
							'I install a program that blocks access to online gambling sites',
							'I stay away from places where people gamble',
							'When I see an amusement arcade, I cross to the other side of the street',
							'I set myself clear limits on how much money I spend each day / each week',
							'I spend my money consciously on things I really need',
							'I pay attention to how much cash I take with me'
						]
					}
				]
			},
			support: {
				title: 'This is where I get support'
			},
			critical: {
				title: 'Critical situations, moods and thoughts',
				listLabel: '“Inner risk situations”: I have to be especially careful here!',
				fieldLabel: 'Situations and moods in which I have to be careful',
				cardTitle: 'I have to be careful here',
				intro:
					'In this exercise you learn to recognise the situations, moods and thoughts in which you are at risk of falling back into old patterns of behaviour. These are also called “inner risk situations”. Which thoughts and moods could put your decision and your goal at risk? So in which situations should you be especially careful? Have a look at our examples. At first glance, many moods or thoughts seem to have little to do with the actual problem behaviour. What are your very own “inner risk situations”?',
				examples: [
					{
						label: 'General',
						items: [
							'When I think about the “good old days”',
							'When I think that not everything was so bad',
							'When I think “once doesn’t count”',
							'When I am with old acquaintances again',
							'When I am in a bad mood and need something to “calm down”',
							'When I am frustrated at work or in my relationship',
							'When things are not going the way I want them to',
							'When I am bored',
							'When I am stressed and want to relax',
							'When I think “nothing matters anyway now”',
							'When I get careless because I think I have made it',
							'When I think that I am not addicted at all',
							'When I am arguing a lot with my partner again'
						]
					},
					{
						label: 'Gambling',
						items: [
							'When I want to gamble again “just out of curiosity”',
							'When I want to reward myself for what I have achieved by putting “just a few coins” into a slot machine',
							'When I think I can solve my money problems that way',
							'When I am carrying too much money',
							'When I have been drinking alcohol',
							'When I think about gambling more often again',
							'When I think “one trip to the casino won’t hurt”'
						]
					},
					{
						label: 'Alcohol',
						items: [
							'When I want to drink again “just out of curiosity”',
							'When I want to reward myself for what I have achieved by drinking “just a small beer”'
						]
					},
					{
						label: 'Cannabis',
						items: [
							'When I want to smoke weed again “just out of curiosity”',
							'When I want to reward myself for what I have achieved by taking “just one drag on a joint”'
						]
					}
				]
			},
			craving: {
				title: 'What helps me with cravings',
				listLabel: 'This helps me when I have cravings:',
				fieldLabel: 'This helps me when I have cravings',
				cardTitle: 'When I have cravings',
				intro:
					'People who give up an addictive behaviour often feel a strong urge to go back to the old behaviour again and again over a long period of time. This is called “craving”. An intense craving usually only lasts a short time. Short “emergency instructions” can help you to get through the craving in such situations. The instructions should be very direct and concrete, like an order to yourself. They help you to keep a cool head and resist the craving. Make sure you keep the sentences short and very clear.',
				examples: [
					{
						label: 'Examples',
						items: [
							'I take my mind off it straight away with other activities (do sport, go shopping, go to the cinema)',
							'I call my trusted person straight away',
							'I write an entry in my diary',
							'I think about how much I have achieved so far',
							'I send a message to my counsellor',
							'I am proud of what I have achieved so far',
							'I call an addiction counselling service',
							'I go to a safe place and meet a trusted person',
							'I won’t risk what I have achieved so far!',
							'I think about how far I have come!',
							'I think: “Don’t let your family down!”',
							'I won’t put my relationship at risk!',
							'I tell myself: “STOP! Get out of here! Now!”'
						]
					}
				]
			},
			risks: {
				title: 'My most important risk situations and control strategies',
				cardTitle: 'Risk situations and strategies'
			},
			relapse: {
				title: 'Relapse: what to do?',
				listLabel: 'This is what I do if I relapse:',
				fieldLabel: 'This is what I do if I relapse',
				cardTitle: 'If I relapse',
				intro:
					'If you do relapse: don’t panic! Don’t give up on your plan. You can learn from relapses and improve your coping strategies later. But the most important command at first is STOP! Leave the situation as quickly as possible to avoid or limit further harm. How do you want to act if you relapse? What exactly can you do? Write down concrete instructions here that will help you personally in this case.',
				examples: [
					{
						label: 'Examples',
						items: [
							'I stop gambling/drinking/smoking weed STRAIGHT AWAY and accept that I lost control!',
							'I get out as fast as I can and leave!',
							'I don’t hide the relapse, I confide in my family',
							'Even if I feel ashamed, I call my trusted person straight away',
							'I get support from …',
							'I take my relapse seriously, but I don’t see it as a disaster',
							'I use the situation as a reason to keep working on my goal',
							'I use the relapse to improve my coping strategies',
							'I won’t give up!'
						]
					}
				]
			}
		},
		importance: { veryImportant: 'very important', important: 'important' },
		start:
			'Habits, routines and ways of thinking that have become fixed are hard to give up. This is especially true for addictions. It often takes a huge effort to resist cravings. In your personal “emergency kit” you collect important information that helps you to avoid relapses and be prepared for challenges.',
		more: 'The risk of falling back into old habits is especially high in the first days, weeks and months. The aim of this exercise is to have helpful strategies ready for difficult situations and to be able to respond well to cravings. Use the questions and suggestions in this exercise to prepare your personal strategies and put together your “emergency kit”. If you like, your counsellor will support you with this.',
		showInfo: 'Show more information',
		hideInfo: 'Hide more information',
		printTitle: 'Print your emergency kit',
		confirmLabel: 'Continue anyway?',
		confirmEmpty: 'At least one section has no entries. Continue anyway?',
		proceed: 'Continue',
		printKit: 'Download the whole emergency kit as a PDF',
		printCard: 'Emergency kit in business card format',
		cardHint:
			'Cut out, the business card format fits into any wallet, so you always have your emergency kit with you.',
		missingImportance: 'Please choose for each entry how important it is to you.',
		backToKit: 'Back to the emergency kit',
		back: 'Back',
		part: 'Emergency kit, part {number}',
		entryLabel: 'Entry {number}',
		importanceQuestion: 'How important?',
		choose: 'Please choose',
		deleteLabel: 'Delete: {text}',
		addEntry: '+ New entry',
		save: 'Save',
		showExamples: 'Show examples',
		hideExamples: 'Hide examples',
		examplesByTopic: 'Examples by topic',
		allExamplesUsed: 'All examples have already been added.',
		pickExample: 'Click on an example to add it as an entry.',
		myTrusted: 'My trusted person(s)',
		change: 'Change',
		addTrusted: 'Add a trusted person',
		myAgency: 'My counselling service',
		showAgency: 'Show',
		counsellorsLine: 'Counselling: {names}',
		notStored: 'Not added yet',
		mySelfHelp: 'My self-help group',
		addSelfHelp: 'Add a self-help group',
		requestedOn: 'Recommendation requested on {date}',
		trustedIntro: [
			'Involving people who are close to you in your private life can take a lot of weight off your shoulders. Have you already told anyone about the problem? Then add their first names and/or their role (for example friend, brother, mother, grandad) to your support list.',
			'If you have not told anyone so far, think about who you could involve as a trusted person in the future. Think of your friends, your family, your neighbours or other people close to you in your private life. Who could support you with your plan and help you in difficult situations?'
		],
		trustedField: 'Name / role of trusted person {number}',
		trustedPlaceholder: 'Enter a name',
		rowLabel: 'Row {number}',
		addRow: '+ Add a row',
		saveEntries: 'Save entries',
		agencyIntro:
			'Your counsellor is there for you not only online, but also in person. Give them a call, make an appointment for counselling in person or go to the open consultation hours.',
		yourAgency: 'Your counselling service:',
		agencyMissing:
			'The contact details of your counselling service have not been added here yet. Your counsellor will be happy to give them to you.',
		yourCounsellor: 'Your counsellor:',
		selfHelpIntro: [
			'Self-help groups make it possible for people affected and their family members to talk with each other. This does not only bring emotional relief. Members of the group also benefit from the experiences of the other participants. Self-help groups are organised through counselling services or self-help organisations.',
			'Your counsellor will help you look for suitable groups near you or online.'
		],
		requestButton: 'I would like a self-help group to be recommended to me.',
		requestDone: 'I would like a self-help group to be recommended to me. (requested on {date})',
		requestHint: 'Your counsellor will then get a message.',
		nakosText:
			'You can also use the following link to look for information about self-help groups near you yourself:',
		nakosLink:
			'NAKOS (National Contact and Information Centre for the Encouragement and Support of Self-Help Groups, in German)',
		selfHelpField: 'My self-help group:',
		selfHelpPlaceholder: 'Enter the name of the group, date(s), contact person and phone number here',
		risksIntro:
			'Here you can find all the risk situations and control strategies that you worked out in the exercise “Risk situations and control strategies”. If you have learned other tips and strategies during counselling for dealing well with risk situations, you can write them in the text field below.',
		noRisks:
			'You have not added any risk situations in the exercise “Risk situations and control strategies” yet.',
		riskSituation: 'Risk situation',
		rating: 'Rating',
		controlStrategy: 'Control strategy',
		noStrategy: 'No control strategy yet',
		printRisk: 'Include in the printout?',
		otherStrategies: 'Other strategies that I have learned and want to use consciously in the future:',
		previewEmpty: 'No entries yet',
		previewMore: 'and {count} more',
		selfHelpLine: 'Self-help group: {text}',
		new: 'New',
		noEntries: 'No entries.',
		trusted: 'Trusted person(s)',
		selfHelp: 'Self-help group',
		requestWanted: 'Recommendation wanted',
		requestSince: 'since {date}',
		noPrintedRisks: 'No risk situations selected for the printout.',
		risksOnlyShared:
			'The risk situations are only visible as long as “Risk situations and control strategies” is shared too.',
		pdf: {
			title: 'My emergency kit',
			noAnswer: 'Not given',
			agencyMissing: 'The contact details of your counselling service have not been added here yet.',
			myCounsellor: 'My counsellor',
			requested: 'Recommendation of a self-help group requested on {date}.',
			cardsTitle: 'My emergency kit in business card format',
			cardsHint: 'Cut out along the dashed lines and take with you.',
			cardsEmpty: 'No entries yet.',
			cardRiskRated: '{situation} (rating: {rating})',
			cardRiskStrategy: '{situation}: {strategy}'
		},
		request: {
			title: 'Self-help group requested',
			text: '{name} would like a self-help group to be recommended to them. Please give {name} suitable details (name of the group, date(s), contact person, phone number) to add to the exercise “Emergency kit” under “My self-help group”, and get in touch through the messages if you need to arrange anything further. This is an automatically generated message from the counselling tools.',
			textUnnamed:
				'A client would like a self-help group to be recommended to them. Please give the client suitable details (name of the group, date(s), contact person, phone number) to add to the exercise “Emergency kit” under “My self-help group”, and get in touch through the messages if you need to arrange anything further. This is an automatically generated message from the counselling tools.'
		},
		demo: {
			motivations: ['Finally being free again', 'I can look my children in the eye again'],
			strategy: 'I do sport regularly',
			trusted: 'Anna (sister)',
			craving: 'I call my trusted person straight away',
			relapse: 'I won’t give up!'
		}
	},
	active: {
		intro: [
			'Taking care of yourself plays a big part in a good quality of life. A good quality of life helps to reduce stress, to lessen cravings and to prevent relapses.',
			'Sports, creative and social activities in particular can clearly lift your mood or ease withdrawal symptoms. Other positive activities that you plan firmly also help you to leave old habits and patterns behind, especially if you make them a regular part of your everyday life. What matters is that you feel good doing them. This exercise helps you to make your everyday life active and pleasant. Use our suggestions or enter your own ideas for activities.'
		],
		howToToggle: 'How does it work?',
		howTo: [
			'Enter your planned activities below. Click “Add activity” to save the entry.',
			'Make sure your plans are doable. Think as precisely as you can about which activities you can realistically do and when.',
			'If you like, use our suggestions to find an activity that suits you.',
			'Planned activities are shown in your diary automatically. If you like, you can also add your entries to your personal calendar.'
		],
		newTitle: 'Plan a new activity',
		editTitle: 'Edit activity',
		suggestionsButton: 'Ideas for activities',
		titleLabel: 'Enter an activity',
		titlePlaceholder: 'Name or description of the activity',
		dateLabel: 'Choose a date (optional)',
		timeLabel: 'Choose a time (optional)',
		repeatLabel: 'Repeat the activity?',
		repeatOptions: {
			none: 'never',
			daily: 'daily',
			weekly: 'weekly',
			custom: 'on chosen dates'
		},
		furtherDateLabel: 'Another date',
		addDate: 'Add date',
		furtherDatesLabel: 'Other dates',
		removeDate: 'remove',
		removeDateLabel: 'Remove date: {day}',
		companionLabel: 'Company (optional)',
		companionPlaceholder: 'Name of a person who joins you',
		missingTitle: 'Please enter an activity.',
		missingDate: 'Please also choose a date if you want to set a time or a repetition.',
		add: 'Add activity',
		saveChange: 'Save changes',
		listTitle: 'Your activities',
		addToCalendar: 'Add to my calendar',
		calendarFileName: 'being-active.ics',
		empty: 'No activities entered yet.',
		editLabel: 'Edit: {title}',
		deleteTitle: 'Delete activity',
		deleteLabel: 'Delete: {title}',
		confirmDelete: 'Delete this activity?',
		delete: 'Delete',
		noDate: 'no date',
		noFurtherDate: 'no more dates',
		dayAndTime: '{day}, {time}',
		nextLine: 'Next date: {next}',
		nextLineWithRepeat: 'Next date: {next} ({repeat})',
		repeatLine: 'Repeats: {repeat}',
		furtherDatesLine: 'Other dates: {dates}',
		companionLine: 'Company: {companion}',
		noCompanion: 'not given',
		counsellor: {
			next: 'Next date',
			repeat: 'Repeats',
			repeatWithDates: '{repeat}: {dates}',
			companion: 'Company',
			lastChanged: 'Last changed',
			new: 'New'
		},
		backToPlanning: 'Back to planning',
		suggestionsTitle: 'Ideas for activities',
		suggestionsHint:
			'Use our suggestions as ideas for your own planning. It helps to describe your plan in even more detail.',
		suggestions: {
			sport: {
				title: 'Active and sporty',
				items: [
					'Go for a walk',
					'Go jogging',
					'Play football',
					'Play badminton',
					'Play table tennis',
					'Go to the gym',
					'Dance',
					'Cycle or go on a bike tour',
					'Go on a day trip',
					'Go hiking',
					'Go to a climbing gym',
					'Boxing',
					'Go swimming',
					'Play mini golf',
					'Go bowling'
				]
			},
			relaxation: {
				title: 'Relaxation',
				items: [
					'Go to the sauna',
					'Take a bath or a shower',
					'Get a massage',
					'Listen to music',
					'Light some candles',
					'Learn a relaxation technique',
					'Meditate or do yoga',
					'Kiss',
					'Flirt',
					'Cuddle',
					'Listen to an audio drama'
				]
			},
			inspiration: {
				title: 'Inspiration',
				items: [
					'Read a book',
					'Read a newspaper or magazine',
					'Read cartoons or comics',
					'Make a phone call',
					'Write emails or letters',
					'Go to the cinema',
					'Have a film night',
					'Go to the theatre',
					'Go to a talk',
					'Go to a club or disco',
					'Go to a concert',
					'Go away for the weekend',
					'Go to an amusement park',
					'Visit a museum or an exhibition',
					'Stroll through shops and buy yourself a little treat',
					'Go exploring somewhere you do not know yet'
				]
			},
			treats: {
				title: 'Treats',
				items: [
					'Have an ice cream',
					'Have a piece of cake',
					'Order a pizza',
					'Cook or bake',
					'Try new recipes',
					'Take a cooking class',
					'Cook for friends',
					'Organise a barbecue or a picnic'
				]
			},
			creative: {
				title: 'Creative',
				items: [
					'Paint or draw',
					'Do pottery',
					'Sew or knit',
					'Do crafts',
					'Do a puzzle or a crossword',
					'Learn a new language',
					'Take photos',
					'Take an adult education class',
					'Read',
					'Write a poem',
					'Make music'
				]
			}
		},
		demo: {
			walk: 'Walk by the river',
			cinema: 'Go to the cinema',
			book: 'Read a book'
		}
	},
	riskSituations: {
		start:
			'In this exercise you take a close look at your risk situations and develop suitable control strategies.',
		guideShow: 'How to fill this in',
		guideHide: 'Hide instructions',
		guideIntro:
			'If you share your entries, your counsellor can read them and support you better. Of course you can change or delete your entries whenever you like. Go through it step by step like this:',
		guideSteps: {
			situation: {
				title: 'Enter risk situations',
				text: '{title} in which you have used substances or shown the problematic behaviour so far.'
			},
			rating: {
				title: 'Rate them',
				text: '{title}: Some risk situations are harder to cope with than others. Rate each situation by how hard you think it will be for you to stay strong in it.'
			},
			strategies: {
				title: 'Develop control strategies',
				text: '{title}: Think about what you can do to stay in control in these situations and not fall back into old patterns. These can be certain actions or thoughts that take your mind off things.'
			},
			relapse: {
				title: 'Improve after a relapse',
				text: '{title}: If you fall back into old patterns and habits, use what you learn from it as an important lesson! Edit your control strategy to make it better. Your counsellor can support you with this.'
			}
		},
		heading: 'My risk situations and control strategies',
		empty: 'You have not entered a risk situation yet.',
		noSituations: 'No risk situations entered yet.',
		deleteQuestion: 'Delete this risk situation with all its relapse analyses?',
		delete: 'Delete',
		columns: {
			situation: 'Risk situation',
			difficulty: 'Rating',
			strategy: 'Control strategy',
			relapse: 'Relapse'
		},
		difficulty: { easy: 'easy', medium: 'medium', hard: 'hard', 'very-hard': 'very hard' },
		analyseRelapse: 'Analyse a relapse',
		relapseState: 'As of {date}',
		notEdited: 'not done yet',
		editLabel: 'Edit: {situation}',
		deleteLabel: 'Delete: {situation}',
		add: 'Enter a new risk situation',
		tablePdf: 'Save table as PDF',
		noStrategy: 'No strategy yet',
		showMore: 'show more',
		showLess: 'show less',
		toOverview: 'Back to overview',
		createTitle: 'Create a risk situation',
		editTitle: 'Edit risk situation',
		situationHint:
			'Describe a typical situation in which you use substances or show the problematic behaviour, or in which it would be hard for you to do without.',
		difficultyQuestion: 'How difficult is it for you to stay strong in this situation?',
		choose: 'Please choose',
		strategyLabel: 'Control or coping strategy',
		strategyQuestion: 'How can you avoid falling back into old habits in this situation?',
		missingSituation: 'Please describe the risk situation.',
		missingDifficulty: 'Please choose a rating.',
		save: 'Save',
		relapseOverline: 'Analyse relapses',
		relapseTitle: 'Improve your coping strategies',
		relapseIntro:
			'Changing habits often takes a huge effort and rarely works without setbacks. If you have fallen back into old patterns, for example by drinking, smoking cannabis or gambling although you did not really want to, do not let this discourage you! Instead, use this concrete experience to prepare better for future challenges. Use the following questions to analyse the situation and learn for the future. Your counsellor can support you in analysing setbacks and working out coping strategies.',
		mySituation: 'My risk situation',
		editingAnalysis: 'You are editing the analysis from {date}.',
		questions: {
			circumstances:
				'1. What circumstances and surroundings (place, event, people present) were part of the relapse?',
			feelings: '2. What feelings or thoughts influenced your decision and triggered the relapse?',
			mainReason: '3. What do you think was the main reason that led to the relapse?',
			alternatives:
				'4. What alternatives were there in this situation? (What exactly could you have done differently? Which thoughts could have helped? Who or what could have supported you?)',
			newStrategy:
				'5. How could you master the situation in the future? (Your answer is automatically used as the new control strategy for this risk situation.)'
		},
		previousStrategyOverline: 'My previous control strategy:',
		noPreviousStrategy: 'No strategy entered yet.',
		newStrategyPlaceholder: 'Describe your new control strategy as precisely as you can',
		missingAnswer: 'Please answer at least one of the questions.',
		newAnalysis: 'Analyse another relapse',
		deleteAnalysisQuestion: 'Delete this relapse analysis?',
		pagePdf: 'Save page as PDF',
		allRelapses: 'All relapses',
		analysisOf: 'Analysis from {date}',
		open: 'Open',
		close: 'Close',
		edit: 'Edit',
		answers: {
			circumstances: 'Circumstances and surroundings',
			feelings: 'Feelings and thoughts',
			mainReason: 'Main reason',
			alternatives: 'Alternatives'
		},
		previousStrategy: 'Previous control strategy',
		newStrategy: 'New control strategy',
		noAnswer: 'No answer',
		new: 'New',
		lastChanged: 'Last changed on {date}',
		pages: 'Pages',
		previousPage: 'Back',
		nextPage: 'Next',
		pageOf: 'Page {page} of {pages}',
		noRelapse: 'No relapse recorded.',
		lastRelapse: 'Last relapse, analysed on {date}',
		showAllRelapses: 'All relapses ({count})',
		hideEarlierRelapses: 'Hide earlier relapses',
		analysedOn: 'Analysed on {date}',
		pdfRelapses: 'Relapses: {situation}',
		analysisGone: 'This analysis no longer exists.',
		deleted: 'Deleted',
		demo: [
			{
				situation: 'Friday evening after work, when my colleagues go out for a drink.',
				strategy: 'I arrange to do sport beforehand and go straight home.'
			},
			{
				situation: 'When I am home alone and bored.',
				strategy: 'I call someone or go for a walk.'
			}
		]
	},
	trafficLight: {
		levels: {
			red: {
				colourName: 'Red',
				danger: 'great danger',
				explanation:
					'Hands off, risk of addiction! With this media activity, it is extremely likely that you will lose yourself in addiction.'
			},
			yellow: {
				colourName: 'Yellow',
				danger: 'possible danger',
				explanation:
					'Be careful! This media activity could become dangerous. You should keep a close eye on your use to avoid addiction.'
			},
			green: {
				colourName: 'Green',
				danger: 'no danger',
				explanation: 'You can use this media activity without any problems.'
			}
		},
		levelLabel: '{colour}: {danger}',
		levelOption: '{danger} ({colour})',
		intro:
			'This exercise helps you to judge how dangerous individual media activities are for you personally, and so to strengthen your ability to handle media use. With the traffic light model, you can sort media activities into the categories “harmless”, “risky” and “not to be used under any circumstances”. The traffic light is not fixed: it should be adjusted again and again during counselling. The aim is for you and your counsellor to understand as precisely as possible how addictive individual activities can be for you.',
		instructionsTitle: 'How to fill it in:',
		instructions: [
			'Enter a media activity.',
			'Rate how likely it is to lead to addiction by giving it a colour.',
			'Click an entry to edit or delete it.'
		],
		explanationsTitle: 'What the colours mean:',
		legendLabel: 'Legend',
		lightLabel: 'Traffic light',
		activityCount: { one: '{count} activity', other: '{count} activities' },
		noActivities: 'No activities.',
		editActivityLabel: '{text}, {danger}: edit or delete',
		add: '+ Add a new activity',
		newTitle: 'Enter a new media activity',
		editTitle: 'Edit activity',
		activityLabel: 'Media activity',
		examplesLabel: 'Examples:',
		examples: ['Playing a computer game', 'Writing emails', 'Watching a film', 'Online banking', 'Instagram'],
		dangerQuestion: 'How great is the danger that this activity leads to addiction?',
		missingActivity: 'Please enter a media activity.',
		missingLevel: 'Please choose how great the danger is.',
		cancel: 'Cancel',
		save: 'Save',
		delete: 'Delete',
		confirmDeleteLabel: 'Confirm deletion',
		confirmDelete: 'Delete this activity?',
		empty: 'No activities entered yet.',
		new: 'New',
		pdfLevelHeading: {
			one: '{colour}: {danger} ({count} activity)',
			other: '{colour}: {danger} ({count} activities)'
		},
		demo: {
			red: 'Playing a computer game',
			yellow: 'Instagram',
			green: 'Writing emails'
		}
	},
	positivePerception: {
		pages: ['Introduction', 'Giving compliments', 'Giving compliments', 'Noticing the positive'],
		pageOf: 'Page {page} of {count}',
		back: 'Back',
		next: 'Next',
		intro: [
			'Conflicts and arguments are part of every healthy relationship. Still, constant disputes in a family can put a lot of strain on the relationship between parents and their children over time. This happens at the latest when little or no attention is paid to the good things any more. Often the family then only complains about what goes wrong, and positive moments hardly seem to exist at all.',
			'This kind of “negative attention” can mean that we only notice the negative sides of our children’s behaviour. When something does not work, we criticise it straight away. What goes well, on the other hand, we often take for granted. We notice the negative things at once and react to them, while we may no longer notice the positive things at all.'
		],
		schemeIntro: [
			'That is why it helps to keep an eye on the things that go well. Paying attention to the positive builds self-confidence in children and young people and helps them protect themselves. Even small changes in how you treat each other can make a big difference to your relationship. Focusing on the positive can greatly improve the atmosphere in the family.',
			'The diagram below shows what negative and positive comments can trigger in your child. Click on a comment to see how the child might react.'
		],
		remarksLabel: 'What the parent says',
		quotedRemark: '“{remark}”',
		tones: {
			negative: 'negative',
			positive: 'positive'
		},
		remarks: {
			clumsy: {
				remark: 'You’re being totally stupid again.',
				selfImage: 'I am stupid',
				feeling: 'negative, bad',
				behaviour: 'angry, difficult'
			},
			forgetful: {
				remark: 'I knew you’d forget that again.',
				selfImage: 'I am unreliable',
				feeling: 'unhappy, ashamed',
				behaviour: 'sad, still unreliable'
			},
			kind: {
				remark: 'How lovely that you did that.',
				selfImage: 'I am kind',
				feeling: 'content',
				behaviour: 'kind, friendly'
			},
			skilful: {
				remark: 'You’re so good at that.',
				selfImage: 'I can do things',
				feeling: 'content',
				behaviour: 'friendly'
			}
		},
		selfImageLabel: 'How the child sees themselves',
		feelingLabel: 'How the child feels',
		behaviourLabel: 'How the child might behave',
		chooseRemark: 'Choose a comment on the left.',
		explanationPoints: [
			'“Negative attention” can put a heavy strain on the atmosphere in the family.',
			'Negative comments can harm how your child sees themselves and how they behave.',
			'Positive comments and praise, on the other hand, build your child’s self-confidence.'
		],
		explanationClosing:
			'This tool is here to bring these positive things back into focus. The aim is to improve your contact and your everyday life with your child through praise and appreciation.',
		aspectsIntro:
			'The easiest way to give your child positive feedback is with praise or a compliment. Every time you praise your child or pay them a compliment, your own attention also turns to the good things your child does. So first, think about which of your child’s behaviours are pleasing and positive. What behaviour or activity of your child could you praise?',
		hideHint: 'Hide tip',
		showHint: 'Show tip',
		aspectsHint:
			'Keep in mind: a compliment is about something specific your child did, not about their whole personality. These may be simple, everyday things, or even things you take for granted. You can of course also praise a behaviour or an activity that your child enjoys. In fact, it is very worthwhile to encourage such activities so they can grow and become a possible alternative to the problem behaviour (for example gaming, smoking cannabis or drinking alcohol).',
		examplesTitle: 'Positive behaviours could be:',
		examples: [
			'Helping at home (for example doing the washing-up)',
			'Taking care of small tasks (for example running an errand)',
			'Doing sport (or doing sport regularly)',
			'Coming home on time',
			'Doing their homework',
			'Getting a good mark (or not getting a bad mark)',
			'Remembering someone’s birthday'
		],
		inputLabel: 'What would you like to praise?',
		inputHint: 'A behaviour or activity of your child that you would like to praise.',
		emptyInput: 'Please write something first.',
		characterCount: '{length} / {max}',
		save: 'Save',
		saveChange: 'Save changes',
		cancel: 'Cancel',
		savedTitle: 'Your saved behaviours',
		noEntries: 'No entries yet.',
		confirmDelete: 'Delete this entry?',
		delete: 'Delete',
		edit: 'Edit',
		editLabel: 'Edit: {text}',
		deleteLabel: 'Delete: {text}',
		counsellorTitle: 'Behaviours and activities to praise',
		new: 'New',
		lastChanged: 'Last changed on {date}',
		demoBehaviours: ['Cleared the table without being asked.', 'Went to football practice at the weekend.']
	}
};
