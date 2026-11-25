import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Store } from '../src/store.ts';
import { signToken, startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
let store: Store;
const asker = tokens.asker();
const counsellor = tokens.counsellor();
const reader = signToken({
	aud: ['dokumentation'],
	sub: 'consultant-1',
	roles: ['consultant'],
	askerId: 'asker-1',
	sessionId: 4711,
	agencyId: 10
});

beforeAll(async () => {
	t = await startApp(['dokumentation']);
	store = new Store(t.pool);
});
afterAll(async () => {
	await t.close();
});

describe('settings snapshots', () => {
	it('fall back from the agency to the Träger', async () => {
		const now = new Date(t.clock.now);
		expect(await store.settingsSnapshot(7, 3)).toBeNull();
		await store.saveSettingsSnapshot(7, 0, { goals: false }, now);
		expect(await store.settingsSnapshot(7, 3)).toEqual({ goals: false });
		expect(await store.settingsSnapshot(7)).toEqual({ goals: false });
		await store.saveSettingsSnapshot(7, 3, { goals: true }, now);
		await store.saveSettingsSnapshot(7, 3, { goals: true, balance: false }, now);
		expect(await store.settingsSnapshot(7, 3)).toEqual({ goals: true, balance: false });
		expect(await store.settingsSnapshot(7, 4)).toEqual({ goals: false });
	});
});

describe('internal reads', () => {
	it('read the shared tool of a case as text with the snapshot of a regular request', async () => {
		t.host.settingsValue = { goalsIntro: 'Hallo' };
		await t.call('POST', '/api/case/tools/goals/release', counsellor);
		await t.call('PUT', '/api/me/tools/goals/keyed/answer/situation', asker, {
			data: { text: 'Viel Stress' }
		});
		await t.call('PUT', '/api/me/tools/goals/share', asker, { shared: true });
		await vi.waitFor(async () =>
			expect(await store.settingsSnapshot(1, 10)).toEqual({ goalsIntro: 'Hallo' })
		);

		expect((await t.call('GET', '/api/case/tools', reader)).status).toBe(403);
		const tools = await t.call('GET', '/internal/case/tools', reader);
		expect(tools.body.tools).toEqual([
			{ id: 'goals', title: 'Ausgangssituation und Ziele', lastChangedAt: expect.any(String) }
		]);
		const text = await t.call('GET', '/internal/case/tools/goals/text', reader);
		expect(text.body.text).toContain('Aktuelle Situation: Viel Stress');
		expect((await t.call('GET', '/api/case/tools', counsellor)).body.tools[0].newCount).toBe(1);
	});
});
