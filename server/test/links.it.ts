import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
const asker = tokens.asker('asker-links');
const counsellor = tokens.counsellor('asker-links');
const demo = tokens.counsellor(null, 'consultant-demo');
const activity = {
	kind: 'activity',
	data: { title: 'Joggen', date: '2026-11-21', time: '07:00', repeat: 'weekly' }
};

beforeAll(async () => {
	t = await startApp();
});
afterAll(async () => {
	await t.close();
});

describe('planned activities in the diaries', () => {
	it('are not handed over while "Aktiv sein" is not released', async () => {
		await t.call('POST', '/api/case/tools/relatives-diary/release', counsellor);
		const diary = await t.call('GET', '/api/me/tools/relatives-diary', asker);
		expect(diary.status).toBe(200);
		expect(diary.body.linked).toEqual({});
	});

	it('come from the same records once "Aktiv sein" is released, also after changes', async () => {
		await t.call('POST', '/api/case/tools/active/release', counsellor);
		const created = await t.call('POST', '/api/me/tools/active/entries', asker, activity);
		expect(created.status).toBe(201);
		let diary = await t.call('GET', '/api/me/tools/relatives-diary', asker);
		expect(diary.body.linked.active).toEqual([created.body]);
		await t.call('PUT', `/api/me/tools/active/entries/${created.body.id}`, asker, {
			data: { ...activity.data, title: 'Laufen' }
		});
		diary = await t.call('GET', '/api/me/tools/relatives-diary', asker);
		expect(diary.body.linked.active[0].data.title).toBe('Laufen');
		await t.call('POST', '/api/case/tools/consumption-diary/release', counsellor);
		expect((await t.call('GET', '/api/me/tools/consumption-diary', asker)).body.linked.active).toHaveLength(
			1
		);
		expect((await t.call('GET', '/api/me/tools/active', asker)).body.linked).toEqual({});
	});

	it('reach counsellors only while "Aktiv sein" is shared, too', async () => {
		await t.call('PUT', '/api/me/tools/relatives-diary/share', asker, { shared: true });
		expect((await t.call('GET', '/api/case/tools/relatives-diary/entries', counsellor)).body.linked).toEqual(
			{}
		);
		await t.call('PUT', '/api/me/tools/active/share', asker, { shared: true });
		const shared = await t.call('GET', '/api/case/tools/relatives-diary/entries', counsellor);
		expect(shared.body.linked.active).toHaveLength(1);
		await t.call('DELETE', '/api/case/tools/active/release', counsellor);
		expect((await t.call('GET', '/api/case/tools/relatives-diary/entries', counsellor)).body.linked).toEqual(
			{}
		);
		expect((await t.call('GET', '/api/me/tools/relatives-diary', asker)).body.linked).toEqual({});
	});

	it('use the demo data of "Aktiv sein" in the demo', async () => {
		const diary = await t.call('GET', '/api/demo/tools/consumption-diary', demo);
		expect(diary.body.demo).toBe(true);
		expect(diary.body.entries.length).toBeGreaterThan(0);
		expect(diary.body.linked.active.length).toBeGreaterThan(0);
		expect((await t.call('GET', '/api/demo/tools/active', demo)).body.entries).toEqual(
			diary.body.linked.active
		);
	});
});

describe('diaries', () => {
	it('store one entry per day and export a chosen period', async () => {
		const put = (day: string, text: string) =>
			t.call('PUT', `/api/me/tools/relatives-diary/keyed/entry/${day}`, asker, {
				day,
				data: { text, mood: 3 }
			});
		expect((await put('2026-11-18', 'Erster Tag')).status).toBe(200);
		expect((await put('2026-11-19', 'Zweiter Tag')).status).toBe(200);
		expect((await put('2026-11-19', 'Zweiter Tag, geändert')).status).toBe(200);
		expect(
			(
				await t.call('PUT', '/api/me/tools/relatives-diary/keyed/entry/2026-11-19', asker, {
					data: { text: 'x' }
				})
			).status
		).toBe(400);
		expect(
			(
				await t.call('PUT', '/api/me/tools/relatives-diary/keyed/entry/heute', asker, {
					day: '2026-11-19',
					data: { text: 'x' }
				})
			).status
		).toBe(400);
		const entries = (await t.call('GET', '/api/me/tools/relatives-diary', asker)).body.entries;
		expect(entries.map((e: { day: string; data: { text: string } }) => [e.day, e.data.text])).toEqual([
			['2026-11-18', 'Erster Tag'],
			['2026-11-19', 'Zweiter Tag, geändert']
		]);
		const pdf = await t.call(
			'GET',
			'/api/case/tools/relatives-diary/export?from=2026-11-19&to=2026-11-19',
			counsellor
		);
		expect(pdf.status).toBe(200);
		expect(pdf.headers['content-type']).toBe('application/pdf');
	});

	it('keep the consumption diary per day and topic', async () => {
		await t.call('PUT', '/api/me/tools/consumption-diary/keyed/topics/main', asker, {
			data: { topics: ['alcohol'] }
		});
		const day = '2026-11-19';
		expect(
			(
				await t.call('PUT', `/api/me/tools/consumption-diary/keyed/day-summary/${day}_alcohol`, asker, {
					day,
					data: { topic: 'alcohol', consumed: true }
				})
			).status
		).toBe(200);
		const phase = await t.call('POST', '/api/me/tools/consumption-diary/entries', asker, {
			kind: 'phase',
			day,
			data: { topic: 'alcohol', items: [{ drink: 'wine', size: '0,2 l', count: 2 }] }
		});
		expect(phase.status).toBe(201);
		expect(phase.body.day).toBe(day);
		expect(
			(
				await t.call('POST', '/api/me/tools/consumption-diary/entries', asker, {
					kind: 'phase',
					data: { topic: 'alcohol', items: [] }
				})
			).status
		).toBe(400);
	});
});
