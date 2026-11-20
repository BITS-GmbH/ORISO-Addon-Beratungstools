import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Store } from '../src/store.ts';
import { startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
const MINUTE = 60_000;
const asker = tokens.asker('asker-n');
const counsellor = tokens.counsellor('asker-n');
const argument = (text: string, rating = 2) => ({ kind: 'argument', data: { category: 'A', text, rating } });

const texts = () => t.host.take().notifications.map((n) => n.body.text.de);

beforeAll(async () => {
	t = await startApp();
	await t.call('POST', '/api/case/tools/balance/release', counsellor);
	await t.call('POST', '/api/me/tools/balance/entries', asker, argument('vor dem Teilen'));
});
afterAll(async () => {
	await t.close();
});
beforeEach(() => {
	t.host.take();
});

describe('notifications to counsellors', () => {
	it('are not sent while the tool is not shared', async () => {
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('privat'));
		expect(texts()).toEqual([]);
	});

	it('go out at once on sharing, then bundle what happens within 15 minutes into one', async () => {
		await t.call('PUT', '/api/me/tools/balance/share', asker, { shared: true });
		expect(texts()).toEqual(['user_asker-n hat „Motivationswaage“ zur Einsicht freigegeben.']);

		t.clock.advance(2 * MINUTE);
		const created = await t.call('POST', '/api/me/tools/balance/entries', asker, argument('neu'));
		t.clock.advance(2 * MINUTE);
		await t.call('PUT', `/api/me/tools/balance/entries/${created.body.id}`, asker, {
			data: { category: 'A', text: 'neu', rating: 3 }
		});
		expect(texts(), 'within the window').toEqual([]);

		t.clock.advance(12 * MINUTE);
		await t.call('GET', '/api/me/tools', asker);
		await t.core.notifier.settled();
		expect(texts()).toEqual([
			'user_asker-n hat in „Motivationswaage“ neue Einträge vorgenommen und Einträge geändert.'
		]);
	});

	it('are sent from the registry visibility check too, and only once', async () => {
		t.clock.advance(16 * MINUTE);
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('noch eins'));
		expect(texts()).toHaveLength(1);
		t.clock.advance(MINUTE);
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('und noch eins'));
		t.clock.advance(15 * MINUTE);
		await t.call('GET', '/visibility', asker);
		await t.call('GET', '/visibility', asker);
		await t.core.notifier.settled();
		expect(texts()).toEqual(['user_asker-n hat in „Motivationswaage“ neue Einträge vorgenommen.']);
	});

	it('leave out unchanged saves and deletions', async () => {
		t.clock.advance(16 * MINUTE);
		const list = (await t.call('GET', '/api/me/tools/balance', asker)).body.entries;
		const first = list[0];
		await t.call('PUT', `/api/me/tools/balance/entries/${first.id}`, asker, { data: first.data });
		await t.call('DELETE', `/api/me/tools/balance/entries/${list[1].id}`, asker);
		expect(texts()).toEqual([]);
	});

	it('follow the counsellors’ preferences: sent if at least one counsellor of the client wants the kind', async () => {
		t.host.contextValue = {
			sessions: [
				{ id: 1, consultantId: 'consultant-1' },
				{ id: 2, consultantId: 'consultant-2' }
			]
		};
		const off = { firstShare: true, newEntry: false, changedEntry: false };
		await t.call('PUT', '/api/counsellor/notification-prefs', tokens.counsellor(null, 'consultant-1'), off);
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('a'));
		expect(texts(), 'consultant-2 still wants new entries').toHaveLength(1);

		await t.call('PUT', '/api/counsellor/notification-prefs', tokens.counsellor(null, 'consultant-2'), off);
		t.clock.advance(16 * MINUTE);
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('b'));
		expect(texts(), 'nobody wants new entries').toEqual([]);

		t.clock.advance(MINUTE);
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('c'));
		expect(texts(), 'no window was opened by the dropped one').toEqual([]);
		t.host.contextValue = { sessions: [{ id: 4711, consultantId: 'consultant-1' }] };
		await t.call('PUT', '/api/counsellor/notification-prefs', tokens.counsellor(null, 'consultant-1'), {
			firstShare: true,
			newEntry: true,
			changedEntry: true
		});
	});

	it('are kept and tried again when the host fails', async () => {
		t.clock.advance(16 * MINUTE);
		t.host.notifyOk = false;
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('d'));
		expect(texts()).toHaveLength(1);
		t.host.notifyOk = true;
		t.clock.advance(30_000);
		await t.call('GET', '/api/me/tools', asker);
		await t.core.notifier.settled();
		expect(texts(), 'retry waits a minute').toEqual([]);
		t.clock.advance(31_000);
		await t.call('GET', '/api/me/tools', asker);
		await t.core.notifier.settled();
		expect(texts()).toEqual(['user_asker-n hat in „Motivationswaage“ neue Einträge vorgenommen.']);
	});

	it('are dropped when the client stopped sharing in the meantime', async () => {
		t.clock.advance(MINUTE);
		await t.call('POST', '/api/me/tools/balance/entries', asker, argument('e'));
		await t.call('PUT', '/api/me/tools/balance/share', asker, { shared: false });
		t.clock.advance(16 * MINUTE);
		await t.call('GET', '/api/me/tools', asker);
		await t.core.notifier.settled();
		expect(texts()).toEqual([]);
	});
});

describe('outbox claims', () => {
	it('let only one of several replicas send a due notification', async () => {
		const store = new Store(t.pool);
		const now = new Date(t.clock.now);
		await store.recordEvent(1, 'asker-x', 'balance', 2, now, 15 * MINUTE);
		const claims = await Promise.all(
			Array.from({ length: 5 }, () => store.claimDue(1, 'asker-x', now, 5 * MINUTE))
		);
		expect(claims.map((claim) => claim.rows.length).sort()).toEqual([0, 0, 0, 0, 1]);
	});

	it('let a stale claim of a crashed replica be taken over', async () => {
		const store = new Store(t.pool);
		const later = new Date(t.clock.now + 6 * MINUTE);
		expect((await store.claimDue(1, 'asker-x', later, 5 * MINUTE)).rows).toHaveLength(1);
	});

	it('keep events that arrive during a claim', async () => {
		const store = new Store(t.pool);
		const now = new Date(t.clock.now + 20 * MINUTE);
		await store.recordEvent(1, 'asker-y', 'goals', 1, now, 15 * MINUTE);
		const { claimId, rows } = await store.claimDue(1, 'asker-y', now, 5 * MINUTE);
		await store.recordEvent(1, 'asker-y', 'goals', 4, now, 15 * MINUTE);
		await store.completeClaim(rows[0]!, claimId, 'sent', now, 15 * MINUTE);
		expect((await store.claimDue(1, 'asker-y', now, 5 * MINUTE)).rows).toHaveLength(0);
		const later = await store.claimDue(1, 'asker-y', new Date(now.getTime() + 15 * MINUTE), 5 * MINUTE);
		expect(later.rows.map((row) => row.pending)).toEqual([5]);
	});
});
