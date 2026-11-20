import { tx } from '../address.ts';

export const MAX_ACTIVITY_LENGTH = 200;
export const MAX_ACTIVITIES = 100;
export const ACTIVITY_KIND = 'activity';

/** The danger level as coded in the tool description: 3 red, 2 yellow, 1 green. */
export type Level = 3 | 2 | 1;

export const LEVEL_VALUES: Level[] = [3, 2, 1];

export interface LevelInfo {
	colour: 'red' | 'yellow' | 'green';
	colourName: string;
	danger: string;
	explanation: (informal: boolean) => string;
}

export const LEVELS: Record<Level, LevelInfo> = {
	3: {
		colour: 'red',
		colourName: 'Rot',
		danger: 'große Gefahr',
		explanation: () =>
			'Finger weg, Suchtgefahr! Bei dieser Medienaktivität ist das Verlieren in der Sucht extrem wahrscheinlich.'
	},
	2: {
		colour: 'yellow',
		colourName: 'Gelb',
		danger: 'mögliche Gefahr',
		explanation: (i) =>
			tx(
				i,
				'Aufpassen! Diese Medienaktivität könnte gefährlich werden. Sie sollten den Konsum gut beobachten, um eine Sucht zu vermeiden.',
				'Aufpassen! Diese Medienaktivität könnte gefährlich werden. Du solltest den Konsum gut beobachten, um eine Sucht zu vermeiden.'
			)
	},
	1: {
		colour: 'green',
		colourName: 'Grün',
		danger: 'keine Gefahr',
		explanation: (i) =>
			tx(
				i,
				'Diese Medienaktivität können Sie ohne Probleme anwenden.',
				'Diese Medienaktivität kannst du ohne Probleme anwenden.'
			)
	}
};

export const EXAMPLES = [
	'Ein Computerspiel spielen',
	'E-Mails schreiben',
	'Einen Film gucken',
	'Online-Banking durchführen',
	'Instagram'
];

export interface Activity {
	text: string;
	level: Level;
}

export const introText = (informal: boolean): string =>
	tx(
		informal,
		'Diese Übung hilft Ihnen dabei, die Gefährlichkeit einzelner Medienaktivitäten für Sie persönlich einzuschätzen und somit Ihre Konsumkompetenz zu stärken. Mit dem Ampelmodell können Sie Medienaktivitäten in die Kategorien „unbedenklich“, „riskant“ und „keinesfalls zu konsumieren“ einordnen. Die Ampel ist nicht starr, sondern sollte im Verlauf der Beratung immer wieder angepasst werden. Ziel ist es, dass Sie, gemeinsam mit Ihrer Beraterin / Ihrem Berater, die persönlichen Suchtpotentiale einzelner Aktivitäten möglichst genau verstehen lernen.',
		'Diese Übung hilft dir dabei, die Gefährlichkeit einzelner Medienaktivitäten für dich persönlich einzuschätzen und somit deine Konsumkompetenz zu stärken. Mit dem Ampelmodell kannst du Medienaktivitäten in die Kategorien „unbedenklich“, „riskant“ und „keinesfalls zu konsumieren“ einordnen. Die Ampel ist nicht starr, sondern sollte im Verlauf der Beratung immer wieder angepasst werden. Ziel ist es, dass du, gemeinsam mit deiner Beraterin / deinem Berater, die persönlichen Suchtpotentiale einzelner Aktivitäten möglichst genau verstehen lernst.'
	);

export const instructions = (informal: boolean): string[] =>
	informal
		? [
				'Trage eine Medienaktivität ein.',
				'Bewerte diese in Bezug auf ihre Suchtgefahr, indem du ihr eine Farbe zuordnest.',
				'Klicke einen Eintrag an, um diesen zu bearbeiten oder zu löschen.'
			]
		: [
				'Tragen Sie eine Medienaktivität ein.',
				'Bewerten Sie diese in Bezug auf ihre Suchtgefahr, indem Sie ihr eine Farbe zuordnen.',
				'Klicken Sie einen Eintrag an, um diesen zu bearbeiten oder zu löschen.'
			];

export const levelLabel = (level: Level): string => `${LEVELS[level].colourName}: ${LEVELS[level].danger}`;
