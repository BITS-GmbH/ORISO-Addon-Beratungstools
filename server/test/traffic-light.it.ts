import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
const asker = tokens.asker('asker-ampel');
const counsellor = tokens.counsellor('asker-ampel');
const activity = (text: string, level: unknown) => ({ kind: 'activity', data: { text, level } });

beforeAll(async () => {
	t = await startApp();
});
afterAll(async () => {
	await t.close();
});

describe('Ampelmodell', () => {
	it('stores, changes and deletes activities, and shows them to counsellors only when shared', async () => {
		await t.call('POST', '/api/case/tools/traffic-light/release', counsellor);
		const red = await t.call(
			'POST',
			'/api/me/tools/traffic-light/entries',
			asker,
			activity('Ein Computerspiel spielen', 3)
		);
		expect(red.status).toBe(201);
		expect(
			(await t.call('POST', '/api/me/tools/traffic-light/entries', asker, activity('Instagram', 4))).status
		).toBe(400);
		const changed = await t.call('PUT', `/api/me/tools/traffic-light/entries/${red.body.id}`, asker, {
			data: { text: 'Ein Computerspiel spielen', level: 2 }
		});
		expect(changed.body.data.level).toBe(2);
		expect((await t.call('GET', '/api/case/tools/traffic-light/entries', counsellor)).status).toBe(403);

		await t.call('PUT', '/api/me/tools/traffic-light/share', asker, { shared: true });
		const shared = (await t.call('GET', '/api/case/tools/traffic-light/entries', counsellor)).body;
		expect(shared.entries.map((e: { data: unknown }) => e.data)).toEqual([
			{ text: 'Ein Computerspiel spielen', level: 2 }
		]);
		const exported = await t.call('GET', '/api/case/tools/traffic-light/export', counsellor);
		expect(exported.status).toBe(200);
		expect(exported.raw.subarray(0, 5).toString()).toBe('%PDF-');

		expect((await t.call('DELETE', `/api/me/tools/traffic-light/entries/${red.body.id}`, asker)).status).toBe(
			204
		);
	});

	it('seeds the counsellor’s demo with example activities', async () => {
		const demo = (await t.call('GET', '/api/demo/tools/traffic-light', tokens.counsellor(null))).body;
		expect(demo.demo).toBe(true);
		expect(demo.entries.map((e: { data: { level: number } }) => e.data.level).sort()).toEqual([1, 2, 3]);
	});
});
