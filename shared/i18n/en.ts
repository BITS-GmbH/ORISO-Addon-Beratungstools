import { active } from './parts/active.en.ts';
import { balance } from './parts/balance.en.ts';
import { consumptionDiary } from './parts/consumptionDiary.en.ts';
import { emergencyKit } from './parts/emergencyKit.en.ts';
import { goals } from './parts/goals.en.ts';
import { positivePerception } from './parts/positivePerception.en.ts';
import { relativesDiary } from './parts/relativesDiary.en.ts';
import { riskSituations } from './parts/riskSituations.en.ts';
import { trafficLight } from './parts/trafficLight.en.ts';
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
		time: '{time}'
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
	goals,
	consumptionDiary,
	relativesDiary,
	balance,
	emergencyKit,
	active,
	riskSituations,
	trafficLight,
	positivePerception
};
