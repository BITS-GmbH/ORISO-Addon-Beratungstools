import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { startApp, tokens, type TestContext } from './helpers.ts';

let t: TestContext;
const asker = tokens.asker('asker-kit');
const counsellor = tokens.counsellor('asker-kit');
const demo = tokens.counsellor(null, 'consultant-demo');
const kit = '/api/me/tools/emergency-kit';
const risks = '/api/me/tools/risk-situations';

beforeAll(async () => {
	t = await startApp();
	await t.call('POST', '/api/case/tools/emergency-kit/release', counsellor);
});
afterAll(async () => {
	await t.close();
});
beforeEach(() => {
	t.host.take();
});

describe('Notfallkoffer and Risikosituationen', () => {
	it('shows the risk situations in the kit only while that exercise is released', async () => {
		expect((await t.call('GET', kit, asker)).body.linked).toEqual({});
		await t.call('POST', '/api/case/tools/risk-situations/release', counsellor);
		const created = await t.call('POST', `${risks}/entries`, asker, {
			kind: 'situation',
			data: { situation: 'Feier', difficulty: 'hard', strategy: 'Früh gehen' }
		});
		expect(created.status).toBe(201);
		const linked = (await t.call('GET', kit, asker)).body.linked['risk-situations'];
		expect(linked.map((entry: { id: string }) => entry.id)).toEqual([created.body.id]);

		const print = await t.call('PUT', `${kit}/keyed/risk-print/${created.body.id}`, asker, {
			data: { print: false }
		});
		expect(print.status).toBe(200);
		expect(
			(await t.call('PUT', `${kit}/keyed/risk-print/not-an-id`, asker, { data: { print: false } })).status
		).toBe(400);
	});

	it('shows them to counsellors only while the client shares that exercise too', async () => {
		await t.call('PUT', `${kit}/share`, asker, { shared: true });
		const before = await t.call('GET', '/api/case/tools/emergency-kit/entries', counsellor);
		expect(before.body.linked).toEqual({});
		await t.call('PUT', `${risks}/share`, asker, { shared: true });
		const after = await t.call('GET', '/api/case/tools/emergency-kit/entries', counsellor);
		expect(after.body.linked['risk-situations']).toHaveLength(1);
		await t.call('PUT', `${risks}/share`, asker, { shared: false });
		expect((await t.call('GET', '/api/case/tools/emergency-kit/entries', counsellor)).body.linked).toEqual(
			{}
		);
	});

	it('notifies the counsellors once when the client asks for a self-help group', async () => {
		await t.call('PUT', `${kit}/share`, asker, { shared: false });
		t.host.take();
		const path = `${kit}/keyed/request/self-help-group`;
		expect((await t.call('PUT', path, asker, { data: { requested: true } })).status).toBe(200);
		const { notifications } = t.host.take();
		expect(notifications).toHaveLength(1);
		expect(notifications[0]?.body).toMatchObject({
			recipient: 'counsellors',
			important: true,
			target: { slot: 'consultant.session' },
			title: { de: 'Selbsthilfegruppe angefragt' }
		});
		expect(notifications[0]?.body.text.de).toMatch(/^user_asker-kit möchte eine Selbsthilfegruppe/);
		await t.call('PUT', path, asker, { data: { requested: true } });
		expect(t.host.take().notifications).toHaveLength(0);
	});

	it('names the counsellors of the client from the host context', async () => {
		t.host.contextValue = {
			sessions: [
				{ id: 1, agencyId: 10, consultantId: 'c-1' },
				{ id: 2, agencyId: 20, consultantId: 'c-2' }
			],
			consultants: [
				{ id: 'c-1', username: 'jane', displayName: 'Jane Doe' },
				{ id: 'c-2', username: 'kim', displayName: 'Kim Roe' }
			]
		};
		expect((await t.call('GET', kit, asker)).body.counsellors).toEqual(['Jane Doe', 'Kim Roe']);
		expect((await t.call('GET', kit, tokens.asker('asker-kit', { agencyId: 20 }))).body.counsellors).toEqual([
			'Kim Roe'
		]);
		expect((await t.call('GET', risks, asker)).body.counsellors).toEqual([]);
	});

	it('makes the client PDFs', async () => {
		for (const path of [`${kit}/export/kit`, `${kit}/export/card`, `${risks}/export/table`]) {
			const response = await t.call('GET', path, asker);
			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toBe('application/pdf');
			expect(response.raw.subarray(0, 5).toString()).toBe('%PDF-');
		}
		expect((await t.call('GET', `${kit}/export/table`, asker)).status).toBe(404);
		expect((await t.call('GET', `${kit}/export/toString`, asker)).status).toBe(404);
		expect((await t.call('GET', '/api/me/tools/goals/export/kit', asker)).status).toBe(403);
		expect((await t.call('GET', `${kit}/export/kit`, tokens.asker('stranger'))).status).toBe(403);
	});

	it('gives the demo the example risk situations and sends no notification', async () => {
		const tool = (await t.call('GET', '/api/demo/tools/emergency-kit', demo)).body;
		expect(tool.entries.length).toBeGreaterThan(0);
		expect(tool.linked['risk-situations'].length).toBe(2);
		expect(tool.counsellors).toEqual(['consultant-demo']);
		await t.call('PUT', '/api/demo/tools/emergency-kit/keyed/request/self-help-group', demo, {
			data: { requested: true }
		});
		expect(t.host.take().notifications).toHaveLength(0);
		expect((await t.call('GET', '/api/demo/tools/emergency-kit/export/card', demo)).status).toBe(200);
	});

	it('exports the risk situations with their relapses for counsellors', async () => {
		await t.call('PUT', `${risks}/share`, asker, { shared: true });
		const [situation] = (await t.call('GET', risks, asker)).body.entries;
		await t.call('POST', `${risks}/entries`, asker, {
			kind: 'relapse',
			data: {
				situationId: situation.id,
				circumstances: 'Geburtstag',
				feelings: '',
				mainReason: '',
				alternatives: '',
				previousStrategy: 'Früh gehen',
				newStrategy: 'Gar nicht hingehen'
			}
		});
		const response = await t.call('GET', '/api/case/tools/risk-situations/export', counsellor);
		expect(response.status).toBe(200);
		expect(response.raw.subarray(0, 5).toString()).toBe('%PDF-');
	});
});
