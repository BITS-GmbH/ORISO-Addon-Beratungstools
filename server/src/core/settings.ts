import type { ToolOptions } from '../../../shared/api.ts';
import { settingsKey, toolInfo } from '../../../shared/catalog.ts';
import type { ServerTool, SettingProperty } from '../tools/types.ts';

export interface SettingsSchema {
	type: 'object';
	properties: Record<string, SettingProperty>;
}

const optionKey = (tool: ServerTool, option: string) =>
	`${settingsKey(tool.id)}${option.charAt(0).toUpperCase()}${option.slice(1)}`;

/**
 * The settings for ORISO-Admin, per Träger and agency (ADR-034, section 5): whether clients may
 * share at all, and per tool a switch followed by the tool's own options.
 */
export const settingsSchema = (tools: ServerTool[]): SettingsSchema => {
	const properties: Record<string, SettingProperty> = {
		allowSharing: {
			type: 'boolean',
			title: 'Ratsuchende können Inhalte mit der Beratung teilen',
			description: 'Ausgeschaltet bleiben alle Einträge nur für die ratsuchende Person sichtbar.',
			default: true
		}
	};
	for (const tool of tools) {
		const title = toolInfo(tool.id)?.title.de ?? tool.id;
		properties[settingsKey(tool.id)] = {
			type: 'boolean',
			title: `${title} anbieten`,
			description: 'Ausgeschaltet kann das Tool nicht freigeschaltet werden und ist für niemanden sichtbar.',
			default: true
		};
		for (const [option, property] of Object.entries(tool.options ?? {})) {
			properties[optionKey(tool, option)] = { ...property, title: `${title}: ${property.title}` };
		}
	}
	return { type: 'object', properties };
};

export type Settings = Record<string, unknown>;

export const withDefaults = (schema: SettingsSchema, values: Settings | null): Settings => ({
	...Object.fromEntries(Object.entries(schema.properties).map(([key, property]) => [key, property.default])),
	...(values ?? {})
});

export const isOffered = (settings: Settings, tool: ServerTool): boolean =>
	settings[settingsKey(tool.id)] !== false;

export const allowsSharing = (settings: Settings): boolean => settings.allowSharing !== false;

export const optionsOf = (settings: Settings, tool: ServerTool): ToolOptions =>
	Object.fromEntries(
		Object.entries(tool.options ?? {}).map(([option, property]) => {
			const value = settings[optionKey(tool, option)];
			return [
				option,
				typeof value === typeof property.default ? (value as string | number | boolean) : property.default
			];
		})
	);
