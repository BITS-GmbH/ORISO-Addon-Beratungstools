import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
const asker = tokens.asker('asker-eltern');
const counsellor = tokens.counsellor('asker-eltern');

beforeAll(async () => {
	t = await startApp();
});
afterAll(async () => {
	await t.close();
});

describe('Positives Wahrnehmen', () => {
	it('stores praiseworthy behaviours and lists them for counsellors when shared', async () => {
		await t.call('POST', '/api/case/tools/positive-perception/release', counsellor);
		const saved = await t.call('POST', '/api/me/tools/positive-perception/entries', asker, {
			kind: 'behaviour',
			data: { text: ' Hausaufgaben gemacht ' }
		});
		expect(saved.status).toBe(201);
		expect(saved.body.data).toEqual({ text: 'Hausaufgaben gemacht' });
		expect(
			(
				await t.call('POST', '/api/me/tools/positive-perception/entries', asker, {
					kind: 'behaviour',
					data: { text: ' ' }
				})
			).status
		).toBe(400);
		expect((await t.call('GET', '/api/case/tools/positive-perception/entries', counsellor)).status).toBe(403);

		await t.call('PUT', '/api/me/tools/positive-perception/share', asker, { shared: true });
		const shared = (await t.call('GET', '/api/case/tools/positive-perception/entries', counsellor)).body;
		expect(shared.entries.map((e: { data: { text: string } }) => e.data.text)).toEqual([
			'Hausaufgaben gemacht'
		]);
		expect((await t.call('GET', '/api/case/tools/positive-perception/export', counsellor)).status).toBe(200);
	});
});
