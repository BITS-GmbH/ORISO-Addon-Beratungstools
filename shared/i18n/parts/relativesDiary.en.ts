import type { Schema, Translation } from '../types.ts';

export const relativesDiary: Translation<Schema['relativesDiary']> = {
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
};
