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
			ui: '/ui/entry.js',
			events: ['user.deleted']
		});
		expect(value.apps).toHaveLength(1);
		expect(value.apps[0]).toMatchObject({ id: 'tools', visibility: 'dynamic', icon: '/ui/icons/tools.svg' });
		expect(value.apps[0]?.slots).toEqual([
			'asker.navigation',
			'asker.session-menu',
			'consultant.session',
			'consultant.asker-profile'
		]);
		expect(value.apps[0]?.description.de.length).toBeLessThanOrEqual(200);
		expect(value.apps[0]?.description.en.length).toBeLessThanOrEqual(200);
	});

	it('has statistics per tool', () => {
		expect(value.stats.map((stat) => stat.id)).toEqual([
			'goals.released',
			'goals.started',
			'goals.shared',
			'balance.released',
			'balance.started',
			'balance.shared',
			'emergency-kit.released',
			'emergency-kit.started',
			'emergency-kit.shared',
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
			'balance',
			'balanceIntro',
			'balancePoles',
			'emergencyKit',
			'emergencyKitAgency',
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
		const [goals, balance] = TOOLS;
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
});
