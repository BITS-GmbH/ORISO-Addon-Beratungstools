import type { Schema, Translation } from '../types.ts';

export const trafficLight: Translation<Schema['trafficLight']> = {
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
	pdfLevelHeading: '{colour}: {danger} ({level})',
	demo: {
		red: 'Playing a computer game',
		yellow: 'Instagram',
		green: 'Writing emails'
	}
};
