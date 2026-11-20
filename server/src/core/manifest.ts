import packageJson from '../../../package.json' with { type: 'json' };
import { toolInfo } from '../../../shared/catalog.ts';
import type { ServerTool } from '../tools/types.ts';

export const NAME = 'beratungstools';
const DOCS = 'https://raw.githubusercontent.com/BITS-GmbH/ORISO-Addon-Beratungstools/main/docs';
export const APP_ID = 'tools';

export const SLOTS = {
	askerNavigation: 'asker.navigation',
	askerSessionMenu: 'asker.session-menu',
	consultantSession: 'consultant.session',
	consultantProfile: 'consultant.asker-profile'
} as const;

/** The manifest (contract `oriso-addon/v1`, ADR-034 section 1). */
export const manifest = (tools: ServerTool[]) => ({
	name: NAME,
	version: packageJson.version,
	contract: 'oriso-addon/v1',
	react: '^19',
	readme: `${DOCS}/README.md`,
	ui: '/ui/entry.js',
	settings: '/schema/settings.json',
	calendar: '/calendar',
	events: ['user.deleted'],
	stats: tools.flatMap((tool) => {
		const title = toolInfo(tool.id)?.title ?? { de: tool.id, en: tool.id };
		return [
			{
				id: `${tool.id}.released`,
				label: { de: `${title.de}: freigeschaltet`, en: `${title.en}: released` },
				type: 'count'
			},
			{
				id: `${tool.id}.started`,
				label: { de: `${title.de}: bearbeitet`, en: `${title.en}: started` },
				type: 'count'
			},
			{
				id: `${tool.id}.shared`,
				label: { de: `${title.de}: geteilt`, en: `${title.en}: shared` },
				type: 'count'
			}
		];
	}),
	apps: [
		{
			id: APP_ID,
			title: { de: 'Tools', en: 'Tools' },
			description: {
				de: 'Digitale Beratungstools: Beratende schalten Übungen frei, Ratsuchende bearbeiten sie und teilen sie auf Wunsch mit der Beratung.',
				en: 'Digital counselling tools: counsellors release exercises, clients work on them and may share them with their counsellor.'
			},
			icon: '/ui/icons/tools.svg',
			slots: Object.values(SLOTS),
			visibility: 'dynamic',
			screenshots: [
				{
					slot: SLOTS.consultantSession,
					file: 'uebersicht.png',
					de: 'Tool-Übersicht im Fall',
					en: 'Tools of a case'
				},
				{
					slot: SLOTS.consultantSession,
					file: 'einsicht.png',
					de: 'Geteilte Einträge, schreibgeschützt',
					en: 'Shared entries, read only'
				},
				{
					slot: SLOTS.askerNavigation,
					file: 'motivationswaage.png',
					de: 'Motivationswaage der ratsuchenden Person',
					en: 'The client’s decisional balance'
				}
			].map(({ slot, file, de, en }) => ({ slot, url: `${DOCS}/img/${file}`, caption: { de, en } }))
		}
	],
	health: '/health'
});
