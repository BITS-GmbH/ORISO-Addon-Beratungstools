import type { Schema, Translation } from '../types.ts';

export const emergencyKit: Translation<Schema['emergencyKit']> = {
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
};
