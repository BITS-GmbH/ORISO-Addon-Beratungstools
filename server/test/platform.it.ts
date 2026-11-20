import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
const asker = tokens.asker('asker-p');
const counsellor = tokens.counsellor('asker-p');

beforeAll(async () => {
	t = await startApp();
});
afterAll(async () => {
	await t.close();
});

describe('public files', () => {
	it('serve manifest and settings schema', async () => {
		const manifest = (await t.call('GET', '/.well-known/oriso-addon.json')).body;
		expect(manifest.name).toBe('beratungstools');
		expect(manifest.apps[0].id).toBe('tools');
		const schema = (await t.call('GET', '/schema/settings.json')).body;
		expect(schema.type).toBe('object');
		expect(schema.properties.goals.type).toBe('boolean');
	});
});

describe('the balance', () => {
	const argument = (category: string, text: string, rating: number) => ({
		kind: 'argument',
		data: { category, text, rating }
	});

	it('stores arguments and a conclusion, with the Träger’s poles', async () => {
		t.host.settingsValue = { balancePoles: 'keine Veränderung / Ich möchte etwas ändern!' };
		await t.call('POST', '/api/case/tools/balance/release', counsellor);
		const a = await t.call('POST', '/api/me/tools/balance/entries', asker, argument('A', 'Mehr Geld', 3));
		expect(a.status).toBe(201);
		t.clock.advance(1000);
		await t.call(
			'POST',
			'/api/me/tools/balance/entries',
			asker,
			argument('B', 'Der Rausch wird mir fehlen.', 1)
		);
		t.clock.advance(1000);
		expect(
			(await t.call('PUT', '/api/me/tools/balance/keyed/conclusion/main', asker, { data: { text: 'Fazit' } }))
				.status
		).toBe(200);
		expect(
			(await t.call('PUT', '/api/me/tools/balance/keyed/conclusion/other', asker, { data: { text: 'x' } }))
				.status
		).toBe(400);
		const tool = (await t.call('GET', '/api/me/tools/balance', asker)).body;
		expect(tool.options.poles).toBe('keine Veränderung / Ich möchte etwas ändern!');
		expect(tool.entries.map((e: { kind: string }) => e.kind)).toEqual(['argument', 'argument', 'conclusion']);
		t.host.settingsValue = {};
	});

	it('changes and deletes arguments of the client only', async () => {
		const [first] = (await t.call('GET', '/api/me/tools/balance', asker)).body.entries;
		const changed = await t.call('PUT', `/api/me/tools/balance/entries/${first.id}`, asker, {
			data: { category: 'D', text: 'Schulden bleiben.', rating: 2 }
		});
		expect(changed.body.data).toEqual({ category: 'D', text: 'Schulden bleiben.', rating: 2 });
		const other = tokens.asker('asker-q');
		await t.call('POST', '/api/case/tools/balance/release', tokens.counsellor('asker-q'));
		expect(
			(await t.call('PUT', `/api/me/tools/balance/entries/${first.id}`, other, { data: first.data })).status
		).toBe(404);
		expect((await t.call('DELETE', `/api/me/tools/balance/entries/${first.id}`, other)).status).toBe(404);
		expect((await t.call('DELETE', `/api/me/tools/balance/entries/${first.id}`, asker)).status).toBe(204);
	});

	it('rejects invalid arguments and more than 200', async () => {
		expect(
			(await t.call('POST', '/api/me/tools/balance/entries', asker, argument('A', 'ohne', 5))).status
		).toBe(400);
		expect((await t.call('POST', '/api/me/tools/balance/entries', asker, { kind: 'argument' })).status).toBe(
			400
		);
		const values = Array.from({ length: 199 }, (_, i) => [
			`id-${i}`,
			1,
			'asker-p',
			'balance',
			'argument',
			JSON.stringify({ category: 'A', text: `x${i}`, rating: 1 })
		]);
		await t.pool.batch(
			'INSERT INTO entries (id, tenant_id, owner_id, tool, kind, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(3), NOW(3))',
			values
		);
		expect(
			(await t.call('POST', '/api/me/tools/balance/entries', asker, argument('A', 'zu viel', 1))).status
		).toBe(409);
	});
});

describe('statistics', () => {
	it('count per tool for the service token of the Träger only', async () => {
		expect((await t.call('GET', '/stats?tenantId=1', asker)).status).toBe(403);
		expect((await t.call('GET', '/stats?tenantId=2', tokens.service(1))).status).toBe(403);
		await t.call('GET', '/api/demo/tools/goals', tokens.counsellor(null));
		await t.call('PUT', '/api/me/tools/balance/share', asker, { shared: true });
		const stats = await t.call('GET', '/stats?tenantId=1', tokens.service(1));
		expect(stats.body.values).toEqual({
			'goals.released': 0,
			'goals.started': 0,
			'goals.shared': 0,
			'relatives-diary.released': 0,
			'relatives-diary.started': 0,
			'relatives-diary.shared': 0,
			'balance.released': 2,
			'balance.started': 1,
			'balance.shared': 1,
			'emergency-kit.released': 0,
			'emergency-kit.started': 0,
			'emergency-kit.shared': 0,
			'active.released': 0,
			'active.started': 0,
			'active.shared': 0,
			'risk-situations.released': 0,
			'risk-situations.started': 0,
			'risk-situations.shared': 0,
			'traffic-light.released': 0,
			'traffic-light.started': 0,
			'traffic-light.shared': 0,
			'positive-perception.released': 0,
			'positive-perception.started': 0,
			'positive-perception.shared': 0
		});
	});
});

describe('calendar', () => {
	it('reminds the client of an unfinished goals tool a week after the release', async () => {
		await t.call('POST', '/api/case/tools/goals/release', counsellor);
		const all = (await t.call('GET', '/calendar', asker)).body.entries;
		expect(all).toEqual([
			expect.objectContaining({
				id: 'goals-fill-in',
				appId: 'tools',
				kind: 'reminder',
				start: '2026-11-27T09:00:02.000Z',
				link: { slot: 'asker.navigation' }
			})
		]);
		expect(
			(await t.call('GET', '/calendar?from=2026-12-01T00:00:00Z&to=2026-12-31T00:00:00Z', asker)).body.entries
		).toEqual([]);
		expect((await t.call('GET', '/calendar', counsellor)).body.entries).toEqual([]);
		expect((await t.call('GET', '/calendar?from=yesterday', asker)).status).toBe(400);
	});
});

describe('lifecycle events', () => {
	it('accept the service token only', async () => {
		expect(
			(await t.call('POST', '/events', asker, { id: 'e1', type: 'user.deleted', userId: 'asker-p' })).status
		).toBe(403);
	});

	it('delete everything of a deleted client, also when the event comes twice', async () => {
		for (const id of ['e2', 'e2']) {
			const deleted = await t.call('POST', '/events', tokens.service(1), {
				id,
				type: 'user.deleted',
				userId: 'asker-p',
				role: 'asker'
			});
			expect(deleted.status).toBe(204);
		}
		expect((await t.call('GET', '/api/me/tools', asker)).body.tools).toEqual([]);
		const tile = (await t.call('GET', '/api/case/tools', counsellor)).body.tools.find(
			(tool: { id: string }) => tool.id === 'balance'
		);
		expect(tile).toMatchObject({ released: false, hasEntries: false });
		expect((await t.call('GET', '/api/me/tools', tokens.asker('asker-q'))).body.tools).toHaveLength(1);
	});

	it('remove a deleted counsellor’s own data and keep the releases they made', async () => {
		await t.call('PUT', '/api/counsellor/notification-prefs', tokens.counsellor(null), {
			firstShare: false,
			newEntry: false,
			changedEntry: false
		});
		await t.call('POST', '/events', tokens.service(1), {
			id: 'e3',
			type: 'user.deleted',
			userId: 'consultant-1',
			role: 'consultant'
		});
		expect(
			(await t.call('GET', '/api/counsellor/notification-prefs', tokens.counsellor(null))).body.newEntry
		).toBe(true);
		const [release] = await t.pool.query("SELECT released_by FROM releases WHERE asker_id = 'asker-q'");
		expect(release.released_by).toBe('deleted');
		const [demo] = await t.pool.query(
			"SELECT COUNT(*) AS n FROM entries WHERE owner_id = 'demo:consultant-1'"
		);
		expect(Number(demo.n)).toBe(0);
		expect((await t.call('GET', '/api/me/tools', tokens.asker('asker-q'))).body.tools).toHaveLength(1);
	});

	it('ignore other and unknown events', async () => {
		expect(
			(
				await t.call('POST', '/events', tokens.service(1), {
					id: 'e4',
					type: 'session.deleted',
					sessionId: 1
				})
			).status
		).toBe(204);
		expect(
			(
				await t.call('POST', '/events', tokens.service(1), {
					id: 'e5',
					type: 'user.deleted',
					userId: 'nobody'
				})
			).status
		).toBe(204);
	});
});
