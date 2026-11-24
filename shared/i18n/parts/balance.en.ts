import type { Schema, Translation } from '../types.ts';

export const balance: Translation<Schema['balance']> = {
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
			'Less stress with friends / family.',
			'I can fall asleep more easily.'
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
};
