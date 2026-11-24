import { LANGS } from '../../shared/i18n/index.ts';
import { describe, expect, it } from 'vitest';
import { manifest } from '../src/core/manifest.ts';
import { counsellorNotification } from '../src/core/notifications.ts';
import { optionsOf, settingsSchema, withDefaults } from '../src/core/settings.ts';
import { TOOLS } from '../src/tools/index.ts';

describe('manifest', () => {
	const value = manifest(TOOLS);

	it('declares one dynamic app in the four slots', () => {
		expect(value).toMatchObject({
			name: 'beratungstools',
			contract: 'oriso-addon/v1',
			events: ['user.deleted']
		});
		expect(value.ui).toMatch(/^\/ui\/[A-Za-z0-9._-]+\/entry\.js$/);
		expect(value.ui).toBe(`/ui/${value.version}/entry.js`);
		expect(value.apps).toHaveLength(1);
		expect(value.apps[0]).toMatchObject({ id: 'tools', visibility: 'dynamic', icon: '/ui/icons/tools.svg' });
		expect(value.apps[0]?.slots).toEqual([
			'asker.navigation',
			'asker.session-menu',
			'consultant.session',
			'consultant.asker-profile'
		]);
		for (const [language, text] of Object.entries(value.apps[0]?.description ?? {})) {
			expect(text.length, `description ${language}`).toBeLessThanOrEqual(200);
		}
	});

	it('has statistics per tool', () => {
		expect(value.stats.map((stat) => stat.id)).toEqual([
			'goals.released',
			'goals.started',
			'goals.shared',
			'consumption-diary.released',
			'consumption-diary.started',
			'consumption-diary.shared',
			'relatives-diary.released',
			'relatives-diary.started',
			'relatives-diary.shared',
			'balance.released',
			'balance.started',
			'balance.shared',
			'emergency-kit.released',
			'emergency-kit.started',
			'emergency-kit.shared',
			'active.released',
			'active.started',
			'active.shared',
			'risk-situations.released',
			'risk-situations.started',
			'risk-situations.shared',
			'traffic-light.released',
			'traffic-light.started',
			'traffic-light.shared',
			'positive-perception.released',
			'positive-perception.started',
			'positive-perception.shared'
		]);
	});
});

describe('settings', () => {
	const schema = settingsSchema(TOOLS);

	it('has a switch per tool followed by its options, in the subset ORISO-Admin renders', () => {
		expect(Object.keys(schema.properties)).toEqual([
			'allowSharing',
			'goals',
			'goalsIntro',
			'consumptionDiary',
			'consumptionDiaryIntro',
			'relativesDiary',
			'relativesDiaryIntro',
			'balance',
			'balanceIntro',
			'balancePoles',
			'emergencyKit',
			'emergencyKitAgency',
			'active',
			'activeIntro',
			'riskSituations',
			'trafficLight',
			'trafficLightIntro',
			'positivePerception',
			'positivePerceptionIntro'
		]);
		for (const property of Object.values(schema.properties)) {
			expect(['string', 'boolean', 'number', 'integer']).toContain(property.type);
			expect(property.default).toBeDefined();
		}
		expect(schema.properties.balancePoles?.enum).toHaveLength(3);
	});

	it('gives each tool its options without the prefix, with defaults for missing or wrong values', () => {
		const settings = withDefaults(schema, {
			balancePoles: 'keine Veränderung / Ich möchte etwas ändern!',
			goalsIntro: 5
		});
		const goals = TOOLS.find((tool) => tool.id === 'goals');
		const balance = TOOLS.find((tool) => tool.id === 'balance');
		expect(optionsOf(settings, balance!)).toEqual({
			intro: '',
			poles: 'keine Veränderung / Ich möchte etwas ändern!'
		});
		expect(optionsOf(settings, goals!)).toEqual({ intro: '' });
	});
});

describe('counsellor notifications', () => {
	it('name the client, the tool and what happened, without content', () => {
		expect(counsellorNotification('Lorenz_02', 'balance', ['newEntry']).text.de).toBe(
			'Lorenz_02 hat in „Motivationswaage“ neue Einträge vorgenommen.'
		);
		expect(counsellorNotification('Lorenz_02', 'balance', ['newEntry', 'changedEntry']).text.de).toBe(
			'Lorenz_02 hat in „Motivationswaage“ neue Einträge vorgenommen und Einträge geändert.'
		);
		expect(counsellorNotification(undefined, 'goals', ['firstShare', 'changedEntry']).text.de).toBe(
			'Eine ratsuchende Person hat „Ausgangssituation und Ziele“ zur Einsicht freigegeben und darin Einträge geändert.'
		);
		expect(counsellorNotification('x', 'goals', ['firstShare'])).toMatchObject({
			recipient: 'counsellors',
			important: false,
			target: { slot: 'consultant.session' }
		});
	});

	it('have a title that matches the bundled events, in every language', () => {
		const titles = (kinds: Parameters<typeof counsellorNotification>[2]) =>
			counsellorNotification('x', 'goals', kinds).title;
		expect(titles(['newEntry']).de).toBe('Neue Einträge in einem Tool');
		expect(titles(['changedEntry']).de).toBe('Einträge in einem Tool geändert');
		expect(titles(['newEntry', 'changedEntry']).de).toBe('Neue und geänderte Einträge in einem Tool');
		expect(titles(['firstShare', 'changedEntry']).de).toBe('Tool zur Einsicht freigegeben');
		expect(titles(['changedEntry']).en).toBe('Entries changed in a tool');
		for (const lang of LANGS) {
			const distinct = new Set(
				[['newEntry'], ['changedEntry'], ['newEntry', 'changedEntry'], ['firstShare']].map(
					(kinds) => titles(kinds as never)[lang]
				)
			);
			expect(distinct.size).toBe(4);
		}
	});
});
