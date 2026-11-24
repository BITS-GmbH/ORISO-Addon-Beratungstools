import type { Schema, Translation } from '../types.ts';

export const active: Translation<Schema['active']> = {
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
};
