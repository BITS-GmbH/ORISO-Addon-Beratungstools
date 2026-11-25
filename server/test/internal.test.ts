import { describe, expect, it, vi } from 'vitest';
import type { Entry } from '../../shared/api.ts';
import { buildApp } from '../src/app.ts';
import type { Release, Share, Store } from '../src/store.ts';
import { TOOLS } from '../src/tools/index.ts';
import { FakeHost, signToken, testVerifier, tokens } from './helpers.ts';

const released: Release = {
	releasedBy: 'consultant-1',
	releasedAt: new Date('2026-11-01T10:00:00Z'),
	withdrawnAt: null,
	openedAt: null
};
const shared: Share = { shared: true, sharedSince: new Date('2026-11-02T10:00:00Z'), changedAt: new Date() };

const answer = (key: string, text: string): Entry => ({
	id: key,
	kind: 'answer',
	key,
	day: null,
	data: { text },
	createdAt: '2026-11-03T10:00:00.000Z',
	updatedAt: '2026-11-03T10:00:00.000Z'
});

/** A store with `goals` released and shared, `balance` released only, and a settings snapshot. */
class FakeStore {
	snapshot: Record<string, unknown> | null = null;
	snapshotQueries: Array<[number, number | undefined]> = [];
	saved: Array<{ tenantId: number; agencyId: number; value: Record<string, unknown> }> = [];
	seen = vi.fn();
	releases = new Map([
		['goals', released],
		['balance', released]
	]);
	shares = new Map([['goals', shared]]);

	async releasesOf() {
		return this.releases;
	}
	async releaseOf(_tenantId: number, _askerId: string, tool: string) {
		return this.releases.get(tool) ?? null;
	}
	async sharesOf() {
		return this.shares;
	}
	async shareOf(_tenantId: number, _askerId: string, tool: string) {
		return this.shares.get(tool) ?? null;
	}
	async entries(_tenantId: number, _askerId: string, tool: string) {
		return tool === 'goals'
			? [answer('situation', 'Viel Stress im Job'), answer('goal', 'Weniger trinken')]
			: [];
	}
	async entrySummaries() {
		return new Map([['goals', { total: 2, lastChangedAt: new Date('2026-11-03T10:00:00Z'), unseen: 2 }]]);
	}
	async markSeen() {
		this.seen();
	}
	async settingsSnapshot(tenantId: number, agencyId?: number) {
		this.snapshotQueries.push([tenantId, agencyId]);
		return this.snapshot;
	}
	async saveSettingsSnapshot(tenantId: number, agencyId: number, value: Record<string, unknown>) {
		this.saved.push({ tenantId, agencyId, value });
	}
}

const dokumentation = (extra: Record<string, unknown> = {}) =>
	signToken({
		aud: ['dokumentation'],
		sub: 'consultant-1',
		roles: ['consultant'],
		askerId: 'asker-1',
		sessionId: 4711,
		agencyId: 10,
		...extra
	});

const setup = (trustedReaders = ['dokumentation']) => {
	const store = new FakeStore();
	const host = new FakeHost();
	const { app } = buildApp({
		store: store as unknown as Store,
		verify: testVerifier(trustedReaders),
		host,
		tools: TOOLS,
		trustedReaders
	});
	const get = async (url: string, token: string) => {
		const response = await app.inject({ url, headers: { authorization: `Bearer ${token}` } });
		return { status: response.statusCode, body: response.json() };
	};
	return { store, host, get };
};

describe('internal reads for trusted add-ons', () => {
	it('keeps a trusted reader out of the regular routes', async () => {
		const { get } = setup();
		for (const url of ['/api/case/tools', '/api/case/tools/goals/entries', '/visibility']) {
			expect((await get(url, dokumentation())).status).toBe(403);
		}
	});

	it('lists the readable tools for a trusted reader', async () => {
		const { get } = setup();
		const response = await get('/internal/case/tools?lang=en', dokumentation());
		expect(response).toEqual({
			status: 200,
			body: {
				tools: [{ id: 'goals', title: 'Starting point and goals', lastChangedAt: '2026-11-03T10:00:00.000Z' }]
			}
		});
	});

	it('rejects the add-on token and readers that are not trusted', async () => {
		expect((await setup().get('/internal/case/tools', tokens.counsellor())).status).toBe(403);
		expect((await setup([]).get('/internal/case/tools', dokumentation())).status).toBe(401);
		expect((await setup(['other']).get('/internal/case/tools', dokumentation())).status).toBe(401);
	});

	it('needs a counsellor in a case', async () => {
		const { get } = setup();
		expect((await get('/internal/case/tools', dokumentation({ askerId: undefined }))).status).toBe(400);
		expect((await get('/internal/case/tools', dokumentation({ roles: ['user'] }))).status).toBe(403);
	});

	it('returns the counsellor export of a shared tool as text, without marking it as seen', async () => {
		const { store, host, get } = setup();
		const response = await get('/internal/case/tools/goals/text', dokumentation());
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({ id: 'goals', title: 'Ausgangssituation und Ziele' });
		expect(response.body.text).toMatch(/^Zeitraum der Einträge: 03.11.2026\n\n/);
		expect(response.body.text).toContain('Viel Stress im Job');
		expect(response.body.text).toContain('Weniger trinken');
		expect(store.seen).not.toHaveBeenCalled();
		expect(host.take()).toEqual({ notifications: [], audits: [] });
	});

	it('refuses tools that are not readable', async () => {
		const { get } = setup();
		expect((await get('/internal/case/tools/balance/text', dokumentation())).status).toBe(403);
		expect((await get('/internal/case/tools/active/text', dokumentation())).status).toBe(403);
	});

	it('uses the settings snapshot of the agency, not the host settings of the reader', async () => {
		const { store, host, get } = setup();
		host.settingsValue = { allowSharing: false };
		store.snapshot = { goals: false };
		expect((await get('/internal/case/tools', dokumentation())).body).toEqual({ tools: [] });
		expect((await get('/internal/case/tools/goals/text', dokumentation())).status).toBe(403);
		expect(store.snapshotQueries[0]).toEqual([1, 10]);
		store.snapshot = null;
		expect((await get('/internal/case/tools', dokumentation())).body.tools).toHaveLength(1);
	});

	it('keeps a snapshot of the settings from regular requests, written again only when changed', async () => {
		const { store, host, get } = setup();
		host.settingsValue = { goalsIntro: 'Hallo' };
		await get('/api/case/tools', tokens.counsellor());
		await get('/api/case/tools', tokens.counsellor());
		await get('/visibility', tokens.asker());
		host.settingsValue = { goalsIntro: 'Neu' };
		await get('/api/case/tools', tokens.counsellor());
		await vi.waitFor(() => expect(store.saved).toHaveLength(3));
		expect(store.saved).toEqual([
			{ tenantId: 1, agencyId: 10, value: { goalsIntro: 'Hallo' } },
			{ tenantId: 1, agencyId: 0, value: { goalsIntro: 'Hallo' } },
			{ tenantId: 1, agencyId: 10, value: { goalsIntro: 'Neu' } }
		]);
	});

	it('does not keep a snapshot when the host has no settings', async () => {
		const { store, host, get } = setup();
		host.settingsValue = null;
		await get('/api/case/tools', tokens.counsellor());
		expect(store.saved).toEqual([]);
	});
});
