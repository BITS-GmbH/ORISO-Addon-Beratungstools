import type { Schema, Translation } from '../types.ts';

export const riskSituations: Translation<Schema['riskSituations']> = {
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
};
