import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Pool } from 'mariadb';
import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.ts';
import { VERSION } from '../src/core/manifest.ts';
import { Store } from '../src/store.ts';
import { TOOLS } from '../src/tools/index.ts';
import { FakeHost, testVerifier, tokens } from './helpers.ts';

const appWith = (verify: Parameters<typeof buildApp>[0]['verify']) =>
	buildApp({ store: new Store({} as Pool), verify, host: new FakeHost(), tools: TOOLS }).app;

describe('authentication', () => {
	it('answers 401 without a valid token and 503 when the AddonService keys cannot be loaded', async () => {
		expect((await appWith(async () => null).inject({ url: '/api/me/tools' })).statusCode).toBe(401);
		const failing = appWith(async () => {
			throw new Error('JWKS 502');
		});
		const response = await failing.inject({
			url: '/api/me/tools',
			headers: { authorization: 'Bearer a.b.c' }
		});
		expect(response.statusCode).toBe(503);
	});

	it('serves the public files without a token', async () => {
		const app = appWith(async () => null);
		expect((await app.inject({ url: '/health' })).json()).toEqual({ status: 'UP' });
		expect((await app.inject({ url: '/schema/settings.json' })).statusCode).toBe(200);
	});
});

describe('request bodies', () => {
	const app = appWith(testVerifier());
	const counsellor = tokens.counsellor();

	it('accepts an empty chunked body without a content type, as the AddonService gateway sends it', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/api/case/tools/unknown/release',
			headers: { authorization: `Bearer ${counsellor}`, 'transfer-encoding': 'chunked' },
			payload: ''
		});
		expect(response.statusCode).toBe(404);
	});

	it('still rejects a non-empty body of an unknown type', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/api/case/tools/unknown/release',
			headers: { authorization: `Bearer ${counsellor}`, 'content-type': 'application/xml' },
			payload: 'hello'
		});
		expect(response.statusCode).toBe(415);
	});
});

describe('UI bundle', () => {
	const uiDir = mkdtempSync(join(tmpdir(), 'bt-ui-'));
	writeFileSync(join(uiDir, 'entry.js'), 'export const mount = () => {};');
	const app = buildApp({
		store: new Store({} as Pool),
		verify: testVerifier(),
		host: new FakeHost(),
		tools: TOOLS,
		uiDir
	}).app;

	it('serves the bundle under its version for good, so a new deploy is a new URL', async () => {
		const response = await app.inject({ url: `/ui/${VERSION}/entry.js` });
		expect(response.statusCode).toBe(200);
		expect(response.headers['cache-control']).toBe('public, max-age=31536000, immutable');
		expect(response.headers['content-type']).toContain('javascript');
		expect(response.body).toContain('mount');
	});

	it('serves an outdated version path without caching it', async () => {
		const response = await app.inject({ url: '/ui/0.0.0-old/entry.js' });
		expect(response.statusCode).toBe(200);
		expect(response.headers['cache-control']).toBe('no-cache');
	});
});
