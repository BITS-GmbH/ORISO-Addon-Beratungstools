import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi } from 'vitest';
import { HostContext, type HostProps } from '../src/host.ts';

export type Handler = (body: any, url: URL) => unknown;

/** A host whose `api` answers from a table of `METHOD /path` handlers and records every call. */
export const fakeHost = (routes: Record<string, Handler>, overrides: Partial<HostProps> = {}) => {
	const calls: Array<{ method: string; path: string; body: any }> = [];
	const api = vi.fn(async (path: string, init: RequestInit = {}) => {
		const method = init.method ?? 'GET';
		const url = new URL(path, 'http://addon');
		const body = typeof init.body === 'string' ? JSON.parse(init.body) : undefined;
		calls.push({ method, path: url.pathname, body });
		const handler = routes[`${method} ${url.pathname}`];
		if (!handler) {
			return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
		}
		try {
			const result = handler(body, url);
			return result === undefined
				? new Response(null, { status: 204 })
				: new Response(JSON.stringify(result), { status: 200 });
		} catch (error) {
			return new Response(JSON.stringify({ error: 'refused' }), {
				status: (error as { status?: number }).status ?? 500
			});
		}
	});
	const host: HostProps = {
		contract: 'oriso-addon/v1',
		domElement: document.createElement('div'),
		slot: 'asker.navigation',
		user: { id: 'u', username: 'u', roles: ['user'] },
		tenant: { id: 1 },
		locale: 'de',
		informal: false,
		api,
		navigate: vi.fn(),
		notify: vi.fn(),
		...overrides
	};
	return { host, calls };
};

export const renderWith = (host: HostProps, children: ReactNode) =>
	render(
		<HostContext.Provider value={host}>
			<div className="bt">{children}</div>
		</HostContext.Provider>
	);

export const entry = (
	kind: string,
	data: unknown,
	key: string | null = null,
	updatedAt = '2026-11-20T09:00:00.000Z'
) => ({
	id: `${kind}-${key ?? Math.random().toString(36).slice(2)}`,
	kind,
	key,
	day: null,
	data,
	createdAt: updatedAt,
	updatedAt
});
