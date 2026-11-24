import type { I18n } from '../i18n/index.ts';

export const MAX_ACTIVITY_LENGTH = 200;
export const MAX_ACTIVITIES = 100;
export const ACTIVITY_KIND = 'activity';

/** The danger level as coded in the tool description: 3 red, 2 yellow, 1 green. */
export type Level = 3 | 2 | 1;

export const LEVEL_VALUES: Level[] = [3, 2, 1];

export type Colour = 'red' | 'yellow' | 'green';

/** Texts per level: `trafficLight.levels.<colour>` in the catalogue. */
export const LEVEL_COLOURS: Record<Level, Colour> = { 3: 'red', 2: 'yellow', 1: 'green' };

export interface Activity {
	text: string;
	level: Level;
}

/** E.g. "Rot: große Gefahr". */
export const levelLabel = ({ m, t }: I18n, level: Level): string => {
	const { colourName, danger } = m.trafficLight.levels[LEVEL_COLOURS[level]];
	return t(m.trafficLight.levelLabel, { colour: colourName, danger });
};
