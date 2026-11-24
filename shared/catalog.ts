import type { Messages } from './i18n/types.ts';

export const TOOL_IDS = [
	'goals',
	'consumption-diary',
	'relatives-diary',
	'balance',
	'emergency-kit',
	'active',
	'risk-situations',
	'traffic-light',
	'positive-perception'
] as const;

export type ToolId = (typeof TOOL_IDS)[number];

export type Audience = 'affected' | 'relatives' | 'parents';

export interface ToolInfo {
	id: ToolId;
	audience: Audience[];
}

/**
 * All tools of the add-on in delphi's order of priority. Only tools with a module on both sides are
 * offered. Titles, tile texts and summaries are in the catalogue under `catalog.<id>`.
 */
export const CATALOG: ToolInfo[] = [
	{ id: 'goals', audience: ['affected', 'relatives'] },
	{ id: 'consumption-diary', audience: ['affected'] },
	{ id: 'relatives-diary', audience: ['relatives'] },
	{ id: 'balance', audience: ['affected'] },
	{ id: 'emergency-kit', audience: ['affected'] },
	{ id: 'active', audience: ['affected', 'relatives'] },
	{ id: 'risk-situations', audience: ['affected'] },
	{ id: 'traffic-light', audience: ['affected'] },
	{ id: 'positive-perception', audience: ['parents'] }
];

export const toolInfo = (id: string): ToolInfo | undefined => CATALOG.find((tool) => tool.id === id);

/** Title, summary and tile text of a tool in the language of `m`. */
export const toolTexts = (
	m: Messages,
	id: string
): { title: string; summary: string; description: string } =>
	isToolId(id) ? m.catalog[id] : { title: id, summary: '', description: '' };

export const isToolId = (id: string): id is ToolId => (TOOL_IDS as readonly string[]).includes(id);

/** Key of a tool in the flat settings object, e.g. `consumption-diary` → `consumptionDiary`. */
export const settingsKey = (id: ToolId): string =>
	id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
