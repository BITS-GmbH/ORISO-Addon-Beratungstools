import type { Schema, Translation } from '../types.ts';

export const consumptionDiary: Translation<Schema['consumptionDiary']> = {
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
};
