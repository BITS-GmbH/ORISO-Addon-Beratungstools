import packageJson from '../../../package.json' with { type: 'json' };
import { toolTexts } from '../../../shared/catalog.ts';
import { localized } from '../../../shared/i18n/index.ts';
import type { ServerTool } from '../tools/types.ts';

export const NAME = 'beratungstools';
/** Set per image build; part of the bundle path, so every deploy gets a URL no cache has seen. */
export const VERSION = (process.env.ADDON_VERSION || packageJson.version).replace(/[^A-Za-z0-9._-]/g, '-');
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
	version: VERSION,
	contract: 'oriso-addon/v1',
	react: '^19',
	readme: `${DOCS}/README.md`,
	ui: `/ui/${VERSION}/entry.js`,
	settings: '/schema/settings.json',
	calendar: '/calendar',
	events: ['user.deleted'],
	stats: tools.flatMap((tool) =>
		(
			[
				['released', 'statReleased'],
				['started', 'statStarted'],
				['shared', 'statShared']
			] as const
		).map(([stat, label]) => ({
			id: `${tool.id}.${stat}`,
			label: localized(({ m, t }) => t(m.manifest[label], { tool: toolTexts(m, tool.id).title })),
			type: 'count'
		}))
	),
	apps: [
		{
			id: APP_ID,
			title: localized(({ m }) => m.manifest.title),
			description: localized(({ m }) => m.manifest.description),
			icon: '/ui/icons/tools.svg',
			slots: Object.values(SLOTS),
			visibility: 'dynamic',
			screenshots: (
				[
					[SLOTS.consultantSession, 'uebersicht.png', 'screenshotOverview'],
					[SLOTS.consultantSession, 'einsicht.png', 'screenshotEntries'],
					[SLOTS.askerNavigation, 'motivationswaage.png', 'screenshotBalance']
				] as const
			).map(([slot, file, caption]) => ({
				slot,
				url: `${DOCS}/img/${file}`,
				caption: localized(({ m }) => m.manifest[caption])
			}))
		}
	],
	health: '/health'
});
