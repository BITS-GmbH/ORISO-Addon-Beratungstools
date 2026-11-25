import { describe, expect, it, vi } from 'vitest';
import type { Claims } from '../src/auth.ts';
import { createHost } from '../src/host.ts';

const claims = (tenantId = 1, agencyId?: number): Claims => ({
	sub: 'u',
	roles: ['user'],
	tenantId,
	agencyId,
	audience: 'beratungstools',
	token: 'tok'
});
const quiet = { warn: () => undefined };

describe('host client', () => {
	it('calls the host API with the request token', async () => {
		const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ id: 1 }), { status: 202 }));
		const host = createHost({
			url: 'http://as/addons/host',
			fetchImpl: fetchImpl as typeof fetch,
			log: quiet
		});
		expect(await host.audit(claims(), { action: 'tool.released', summary: { de: 'x' } })).toBe(true);
		const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe('http://as/addons/host/audit');
		expect(init.method).toBe('POST');
		expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
	});

	it('never throws: failures and timeouts are false or null', async () => {
		const failing = createHost({
			url: 'http://as',
			fetchImpl: (async () => new Response('', { status: 502 })) as typeof fetch,
			log: quiet
		});
		expect(await failing.notify(claims(), {} as never)).toBe(false);
		expect(await failing.gates(claims())).toBeNull();
		const hanging = createHost({
			url: 'http://as',
			timeoutMs: 20,
			fetchImpl: ((_url: string, init: RequestInit) =>
				new Promise((_, reject) =>
					init.signal?.addEventListener('abort', () => reject(new Error('timeout')))
				)) as typeof fetch,
			log: quiet
		});
		expect(await hanging.context(claims(), 'self')).toBeNull();
	});

	it('caches settings briefly per Träger and agency', async () => {
		let now = 0;
		const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ allowSharing: false })));
		const host = createHost({
			url: 'http://as',
			fetchImpl: fetchImpl as typeof fetch,
			now: () => now,
			settingsTtlMs: 1000,
			log: quiet
		});
		await host.settings(claims());
		await host.settings(claims());
		expect(fetchImpl).toHaveBeenCalledTimes(1);
		await host.settings(claims(1, 7));
		expect(fetchImpl).toHaveBeenCalledTimes(2);
		now = 1001;
		expect(await host.settings(claims())).toEqual({ allowSharing: false });
		expect(fetchImpl).toHaveBeenCalledTimes(3);
	});
});
