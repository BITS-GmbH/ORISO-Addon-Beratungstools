import type { Schema, Translation } from '../types.ts';

export const goals: Translation<Schema['goals']> = {
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
			hint: ['Do you have hobbies that take your mind off things, or friends or family who can support you?'],
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
};
