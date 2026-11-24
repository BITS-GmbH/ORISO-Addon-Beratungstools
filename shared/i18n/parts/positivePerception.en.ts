import type { Schema, Translation } from '../types.ts';

export const positivePerception: Translation<Schema['positivePerception']> = {
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
	inputLabel: 'Please write down behaviours and activities of your child that you would like to praise:',
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
};
