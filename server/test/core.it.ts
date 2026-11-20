import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { migrate } from '../src/db/migrate.ts';
import { startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
const asker = tokens.asker();
const counsellor = tokens.counsellor();
const answer = (text: string) => ({ data: { text } });

beforeAll(async () => {
	t = await startApp();
});
afterAll(async () => {
	await t.close();
});
beforeEach(() => {
	t.host.take();
});

describe('migrations', () => {
	it('apply once', async () => {
		expect(await migrate(t.pool, () => undefined)).toEqual([]);
	});
});

describe('access', () => {
	it('needs a valid token for everything but the public files', async () => {
		expect((await t.call('GET', '/api/me/tools')).status).toBe(401);
		expect((await t.call('GET', '/visibility')).status).toBe(401);
		expect((await t.call('GET', '/.well-known/oriso-addon.json')).status).toBe(200);
		expect((await t.call('GET', '/health')).body).toEqual({ status: 'UP' });
	});

	it('keeps roles apart', async () => {
		expect((await t.call('GET', '/api/me/tools', counsellor)).status).toBe(403);
		expect((await t.call('GET', '/api/case/tools', asker)).status).toBe(403);
		expect((await t.call('GET', '/api/case/tools', tokens.counsellor(null))).status).toBe(400);
		expect((await t.call('GET', '/api/demo/tools/goals', asker)).status).toBe(403);
		expect((await t.call('GET', '/stats?tenantId=1', asker)).status).toBe(403);
	});

	it('knows only registered tools', async () => {
		expect((await t.call('GET', '/api/me/tools/active', asker)).status).toBe(404);
		expect((await t.call('POST', '/api/case/tools/unknown/release', counsellor)).status).toBe(404);
	});
});

describe('release', () => {
	it('keeps a tool closed and invisible until a counsellor releases it', async () => {
		expect((await t.call('GET', '/visibility', asker)).body).toEqual({ apps: { tools: { visible: false } } });
		expect((await t.call('GET', '/api/me/tools', asker)).body).toEqual({ tools: [] });
		expect((await t.call('GET', '/api/me/tools/goals', asker)).status).toBe(403);
		expect(
			(await t.call('PUT', '/api/me/tools/goals/keyed/answer/situation', asker, answer('x'))).status
		).toBe(403);
	});

	it('releases once, with an audit entry and a notification to the client', async () => {
		const released = await t.call('POST', '/api/case/tools/goals/release', counsellor);
		expect(released.status).toBe(200);
		expect(released.body.released).toBe(true);
		const { notifications, audits } = t.host.take();
		expect(audits.map((a) => a.body.action)).toEqual(['tool.released']);
		expect(audits[0]?.body.subject).toBe('asker');
		expect(notifications).toHaveLength(1);
		expect(notifications[0]?.body).toMatchObject({
			recipient: 'asker',
			appId: 'tools',
			important: true,
			target: { slot: 'asker.navigation' }
		});
		expect(notifications[0]?.body.text.de).toContain('Ausgangssituation und Ziele');

		await t.call('POST', '/api/case/tools/goals/release', counsellor);
		expect(t.host.take().notifications).toHaveLength(0);
	});

	it('shows the client the released tool with a badge until opened', async () => {
		expect((await t.call('GET', '/visibility', asker)).body.apps.tools).toEqual({ visible: true, badge: 1 });
		const list = (await t.call('GET', '/api/me/tools', asker)).body;
		expect(list.tools).toMatchObject([{ id: 'goals', opened: false, shared: false, hasEntries: false }]);
		const tool = await t.call('GET', '/api/me/tools/goals', asker);
		expect(tool.status).toBe(200);
		expect(tool.body).toMatchObject({
			id: 'goals',
			demo: false,
			shared: false,
			allowSharing: true,
			entries: [],
			options: { intro: '' }
		});
		expect((await t.call('GET', '/visibility', asker)).body.apps.tools).toEqual({ visible: true });
		expect(
			(await t.call('GET', '/api/me/tools', tokens.asker('asker-1', { tenantId: 2 }))).body.tools
		).toEqual([]);
	});

	it('refuses a new release while the DPA does not allow new counselling, and goes ahead when the host cannot tell', async () => {
		t.host.gatesValue = { dpa: { newCounsellingAllowed: false } };
		expect((await t.call('POST', '/api/case/tools/balance/release', counsellor)).status).toBe(409);
		expect((await t.call('POST', '/api/case/tools/goals/release', counsellor)).status).toBe(200);
		t.host.gatesValue = null;
		expect((await t.call('POST', '/api/case/tools/balance/release', counsellor)).status).toBe(200);
		t.host.gatesValue = { dpa: { newCounsellingAllowed: true } };
	});

	it('does not offer a tool the Träger switched off', async () => {
		t.host.settingsValue = { balance: false };
		const overview = (await t.call('GET', '/api/case/tools', counsellor)).body;
		const ids = overview.tools.map((tool: { id: string }) => tool.id);
		expect(ids).toContain('goals');
		expect(ids).not.toContain('balance');
		expect((await t.call('GET', '/api/me/tools/balance', asker)).status).toBe(404);
		expect((await t.call('POST', '/api/case/tools/balance/release', counsellor)).status).toBe(404);
		t.host.settingsValue = {};
	});
});

describe('entries and share', () => {
	it('stores entries without showing them to counsellors', async () => {
		const saved = await t.call(
			'PUT',
			'/api/me/tools/goals/keyed/answer/situation',
			asker,
			answer(' Viel Stress. ')
		);
		expect(saved.status).toBe(200);
		expect(saved.body).toMatchObject({ kind: 'answer', key: 'situation', data: { text: 'Viel Stress.' } });
		expect(t.host.take().notifications).toHaveLength(0);

		const overview = (await t.call('GET', '/api/case/tools', counsellor)).body;
		expect(overview.sessionId).toBe(4711);
		expect(overview.tools[0]).toMatchObject({
			id: 'goals',
			released: true,
			hasEntries: true,
			shared: false,
			newCount: 0,
			lastChangedAt: null
		});
		expect((await t.call('GET', '/api/case/tools/goals/entries', counsellor)).status).toBe(403);
		expect((await t.call('GET', '/api/case/tools/goals/export', counsellor)).status).toBe(403);
		expect((await t.call('POST', '/api/case/tools/goals/seen', counsellor, {})).status).toBe(403);
	});

	it('validates kinds, keys and data', async () => {
		expect((await t.call('PUT', '/api/me/tools/goals/keyed/answer/unknown', asker, answer('x'))).status).toBe(
			400
		);
		expect(
			(await t.call('PUT', '/api/me/tools/goals/keyed/other/situation', asker, answer('x'))).status
		).toBe(400);
		expect((await t.call('PUT', '/api/me/tools/goals/keyed/answer/goal', asker, answer('  '))).status).toBe(
			400
		);
		expect(
			(await t.call('PUT', '/api/me/tools/goals/keyed/answer/goal', asker, answer('x'.repeat(4001)))).status
		).toBe(400);
		expect(
			(await t.call('POST', '/api/me/tools/goals/entries', asker, { kind: 'answer', data: { text: 'x' } }))
				.status
		).toBe(400);
	});

	it('shares with an audit entry, a notification and all entries readable as new', async () => {
		const shared = await t.call('PUT', '/api/me/tools/goals/share', asker, { shared: true });
		expect(shared.body).toEqual({ shared: true });
		const { notifications, audits } = t.host.take();
		expect(audits.map((a) => a.body.action)).toEqual(['tool.shared']);
		expect(notifications).toHaveLength(1);
		expect(notifications[0]?.body).toMatchObject({
			recipient: 'counsellors',
			target: { slot: 'consultant.session' }
		});
		expect(notifications[0]?.body.text.de).toBe(
			'user_asker-1 hat „Ausgangssituation und Ziele“ zur Einsicht freigegeben.'
		);
		expect(notifications[0]?.token).toBe(asker);

		const overview = (await t.call('GET', '/api/case/tools', counsellor)).body;
		expect(overview.tools[0]).toMatchObject({ shared: true, newCount: 1 });
		expect((await t.call('GET', '/visibility', counsellor)).body.apps.tools).toEqual({
			visible: true,
			badge: 1
		});
		const read = (await t.call('GET', '/api/case/tools/goals/entries', counsellor)).body;
		expect(read.seenAt).toBeNull();
		expect(read.entries.map((e: { data: { text: string } }) => e.data.text)).toEqual(['Viel Stress.']);
	});

	it('marks entries as seen per counsellor', async () => {
		const seen = await t.call('POST', '/api/case/tools/goals/seen', counsellor, {});
		expect(seen.status).toBe(200);
		expect((await t.call('GET', '/api/case/tools', counsellor)).body.tools[0].newCount).toBe(0);
		expect((await t.call('GET', '/visibility', counsellor)).body.apps.tools).toEqual({ visible: true });
		const other = tokens.counsellor('asker-1', 'consultant-2');
		expect((await t.call('GET', '/api/case/tools', other)).body.tools[0].newCount).toBe(1);

		t.clock.advance(60_000);
		await t.call('PUT', '/api/me/tools/goals/keyed/answer/goal', asker, answer('Weniger trinken'));
		const read = (await t.call('GET', '/api/case/tools/goals/entries', counsellor)).body;
		const goal = read.entries.find((e: { key: string }) => e.key === 'goal');
		expect(goal.updatedAt > read.seenAt).toBe(true);
		expect((await t.call('GET', '/api/case/tools', counsellor)).body.tools[0].newCount).toBe(1);
	});

	it('does not mark more as seen than the counsellor was shown', async () => {
		const read = (await t.call('GET', '/api/case/tools/goals/entries', counsellor)).body;
		const shownUntil = '2026-11-20T08:00:00.000Z';
		await t.call('POST', '/api/case/tools/goals/seen', counsellor, { until: shownUntil });
		expect((await t.call('GET', '/api/case/tools/goals/entries', counsellor)).body.seenAt).toBe(read.seenAt);
	});

	it('exports shared entries as PDF with an audit entry', async () => {
		const exported = await t.call('GET', '/api/case/tools/goals/export', counsellor);
		expect(exported.status).toBe(200);
		expect(exported.headers['content-type']).toBe('application/pdf');
		expect(String(exported.headers['content-disposition'])).toContain('goals-fall-4711-2026-11-20.pdf');
		expect(exported.raw.subarray(0, 5).toString()).toBe('%PDF-');
		expect(t.host.take().audits.map((a) => a.body.action)).toEqual(['tool.exported']);
	});

	it('closes the content again when the client stops sharing', async () => {
		await t.call('PUT', '/api/me/tools/goals/share', asker, { shared: false });
		expect(t.host.take().audits.map((a) => a.body.action)).toEqual(['tool.unshared']);
		expect((await t.call('GET', '/api/case/tools/goals/entries', counsellor)).status).toBe(403);
		expect((await t.call('GET', '/api/case/tools', counsellor)).body.tools[0]).toMatchObject({
			shared: false,
			newCount: 0
		});
	});

	it('does not let clients share when the Träger switched sharing off', async () => {
		t.host.settingsValue = { allowSharing: false };
		expect((await t.call('PUT', '/api/me/tools/goals/share', asker, { shared: true })).status).toBe(403);
		expect((await t.call('GET', '/api/me/tools/goals', asker)).body.allowSharing).toBe(false);
		t.host.settingsValue = {};
	});

	it('withdraws a release: tool hidden, content closed, entries kept for a new release', async () => {
		await t.call('PUT', '/api/me/tools/goals/share', asker, { shared: true });
		t.host.take();
		expect((await t.call('DELETE', '/api/case/tools/goals/release', counsellor)).body).toEqual({
			released: false
		});
		expect(t.host.take().audits.map((a) => a.body.action)).toEqual(['tool.withdrawn']);
		expect((await t.call('GET', '/api/me/tools/goals', asker)).status).toBe(403);
		expect((await t.call('GET', '/api/case/tools/goals/entries', counsellor)).status).toBe(403);
		const tile = (await t.call('GET', '/api/case/tools', counsellor)).body.tools[0];
		expect(tile).toMatchObject({ released: false, shared: false, hasEntries: true });

		await t.call('POST', '/api/case/tools/goals/release', counsellor);
		const back = (await t.call('GET', '/api/me/tools/goals', asker)).body;
		expect(back.entries).toHaveLength(2);
		expect(back.shared).toBe(true);
	});
});

describe('demo', () => {
	const demo = tokens.counsellor(null, 'consultant-1');

	it('seeds separate data on first use and never touches the case', async () => {
		const first = await t.call('GET', '/api/demo/tools/goals', demo);
		expect(first.body.demo).toBe(true);
		expect(first.body.entries.map((e: { key: string }) => e.key)).toEqual(['situation']);
		await t.call('PUT', '/api/demo/tools/goals/keyed/answer/goal', demo, answer('Demo-Ziel'));
		await t.call('PUT', '/api/demo/tools/goals/share', demo, { shared: true });
		const { notifications, audits } = t.host.take();
		expect(notifications).toHaveLength(0);
		expect(audits).toHaveLength(0);
		expect((await t.call('GET', '/api/demo/tools/goals', demo)).body.entries).toHaveLength(2);
		const real = (await t.call('GET', '/api/me/tools/goals', asker)).body.entries;
		expect(real.map((e: { data: { text: string } }) => e.data.text)).not.toContain('Demo-Ziel');
	});

	it('resets to the starting state', async () => {
		expect((await t.call('POST', '/api/demo/tools/goals/reset', demo)).status).toBe(204);
		const after = (await t.call('GET', '/api/demo/tools/goals', demo)).body;
		expect(after.entries.map((e: { key: string }) => e.key)).toEqual(['situation']);
		expect(after.shared).toBe(false);
	});

	it('works for tools that are not released for anyone', async () => {
		const tool = await t.call('GET', '/api/demo/tools/balance', demo);
		expect(tool.status).toBe(200);
		expect(tool.body.entries).toEqual([]);
	});
});

describe('notification preferences', () => {
	it('default to everything and are stored per counsellor', async () => {
		expect((await t.call('GET', '/api/counsellor/notification-prefs', counsellor)).body).toEqual({
			firstShare: true,
			newEntry: true,
			changedEntry: true
		});
		const prefs = { firstShare: true, newEntry: false, changedEntry: false };
		expect((await t.call('PUT', '/api/counsellor/notification-prefs', counsellor, prefs)).body).toEqual(
			prefs
		);
		expect((await t.call('GET', '/api/counsellor/notification-prefs', counsellor)).body).toEqual(prefs);
		expect(
			(await t.call('GET', '/api/counsellor/notification-prefs', tokens.counsellor(null, 'consultant-2')))
				.body.newEntry
		).toBe(true);
		expect(
			(await t.call('PUT', '/api/counsellor/notification-prefs', counsellor, { firstShare: 1 })).status
		).toBe(400);
		expect((await t.call('GET', '/api/counsellor/notification-prefs', asker)).status).toBe(403);
	});
});
