import { describe, expect, it } from 'vitest';
import { isAsker, isCounsellor } from '../src/auth.ts';
import { signToken, testVerifier } from './helpers.ts';

const verify = testVerifier();

describe('token verification', () => {
	it('accepts AddonService tokens and reads the claims', async () => {
		const claims = await verify(
			`Bearer ${signToken({ sub: 'c1', username: 'berater', roles: ['consultant'], askerId: 'a1', sessionId: 5, agencyId: 3 })}`
		);
		expect(claims).toMatchObject({
			sub: 'c1',
			username: 'berater',
			tenantId: 1,
			askerId: 'a1',
			sessionId: 5,
			agencyId: 3
		});
		expect(claims && isCounsellor(claims)).toBe(true);
		expect(claims && isAsker(claims)).toBe(false);
	});

	it.each([
		['no header', undefined],
		['not a bearer', 'Basic abc'],
		['garbage', 'Bearer a.b.c'],
		['another audience', `Bearer ${signToken({ sub: 'x', roles: [], aud: ['other'] })}`],
		['another issuer', `Bearer ${signToken({ sub: 'x', roles: [], iss: 'keycloak' })}`],
		['expired', `Bearer ${signToken({ sub: 'x', roles: [], exp: Math.floor(Date.now() / 1000) - 1 })}`],
		['no Träger', `Bearer ${signToken({ sub: 'x', roles: [], tenantId: undefined })}`],
		['unknown key', `Bearer ${signToken({ sub: 'x', roles: [] }, { kid: 'other' })}`],
		['another algorithm', `Bearer ${signToken({ sub: 'x', roles: [] }, { alg: 'HS256' })}`]
	])('rejects %s', async (_, header) => {
		expect(await verify(header)).toBeNull();
	});

	it('accepts trusted readers and tells which audience matched', async () => {
		const trusting = testVerifier(['dokumentation']);
		const reader = signToken({ sub: 'c1', roles: ['consultant'], aud: ['dokumentation'] });
		expect(await trusting(`Bearer ${reader}`)).toMatchObject({ audience: 'dokumentation' });
		expect(await trusting(`Bearer ${signToken({ sub: 'c1', roles: [] })}`)).toMatchObject({
			audience: 'beratungstools'
		});
		expect(await verify(`Bearer ${reader}`)).toBeNull();
	});

	it('rejects a changed payload', async () => {
		const [head, , signature] = signToken({ sub: 'x', roles: ['user'] }).split('.');
		const forged = Buffer.from(JSON.stringify({ sub: 'y', roles: ['consultant'], tenantId: 1 })).toString(
			'base64url'
		);
		expect(await verify(`Bearer ${head}.${forged}.${signature}`)).toBeNull();
	});
});
