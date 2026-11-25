import { createPublicKey, verify as verifySignature, type JsonWebKey, type KeyObject } from 'node:crypto';

/** Claims of the AddonService's add-on token (ADR-034, section 3), plus the raw token. */
export interface Claims {
	sub: string;
	username?: string;
	roles: string[];
	tenantId: number;
	agencyId?: number;
	sessionId?: number;
	askerId?: string;
	/** The audience the token was accepted for: this add-on, or a trusted reader (`TRUSTED_READERS`). */
	audience: string;
	token: string;
}

export type Verify = (authorization: string | undefined) => Promise<Claims | null>;

const decodePart = (part: string): Record<string, unknown> =>
	JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<string, unknown>;

const optionalNumber = (value: unknown): number | undefined =>
	typeof value === 'number' ? value : undefined;

/**
 * Verifies AddonService tokens (RS256) against its JWKS; keys are cached and reloaded for unknown ids.
 * Accepts this add-on's audience and the audiences of trusted readers; which one matched is in the claims.
 */
export const createVerifier = ({
	jwksUrl,
	issuer,
	audience,
	trustedReaders = [],
	fetchImpl = fetch,
	now = Date.now
}: {
	jwksUrl: string;
	issuer: string;
	audience: string;
	trustedReaders?: string[];
	fetchImpl?: typeof fetch;
	now?: () => number;
}): Verify => {
	let keys = new Map<string, KeyObject>();
	let loadedAt = 0;

	const loadKeys = async (force: boolean) => {
		if (!force && keys.size > 0 && now() - loadedAt < 5 * 60_000) {
			return keys;
		}
		const response = await fetchImpl(jwksUrl, { signal: AbortSignal.timeout(3000) });
		if (!response.ok) {
			throw new Error(`JWKS ${response.status}`);
		}
		const { keys: jwks } = (await response.json()) as { keys: Array<JsonWebKey & { kid: string }> };
		keys = new Map(jwks.map((jwk) => [jwk.kid, createPublicKey({ key: jwk, format: 'jwk' })]));
		loadedAt = now();
		return keys;
	};

	return async (authorization) => {
		const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
		const parts = token?.split('.');
		if (!token || !parts || parts.length !== 3) {
			return null;
		}
		const [head = '', body = '', signature = ''] = parts;
		let header: Record<string, unknown>;
		let claims: Record<string, unknown>;
		try {
			header = decodePart(head);
			claims = decodePart(body);
		} catch {
			return null;
		}
		if (header.alg !== 'RS256' || typeof header.kid !== 'string') {
			return null;
		}
		const key = (await loadKeys(false)).get(header.kid) ?? (await loadKeys(true)).get(header.kid);
		if (
			!key ||
			!verifySignature('sha256', Buffer.from(`${head}.${body}`), key, Buffer.from(signature, 'base64url'))
		) {
			return null;
		}
		const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
		const matched = [audience, ...trustedReaders].find((candidate) => audiences.includes(candidate));
		const exp = optionalNumber(claims.exp) ?? 0;
		if (claims.iss !== issuer || !matched || exp <= Math.floor(now() / 1000)) {
			return null;
		}
		const tenantId = optionalNumber(claims.tenantId);
		if (typeof claims.sub !== 'string' || tenantId === undefined) {
			return null;
		}
		return {
			sub: claims.sub,
			username: typeof claims.username === 'string' ? claims.username : undefined,
			roles: Array.isArray(claims.roles)
				? claims.roles.filter((role): role is string => typeof role === 'string')
				: [],
			tenantId,
			agencyId: optionalNumber(claims.agencyId),
			sessionId: optionalNumber(claims.sessionId),
			askerId: typeof claims.askerId === 'string' && claims.askerId ? claims.askerId : undefined,
			audience: matched,
			token
		};
	};
};

export const SERVICE_ROLE = 'addon-service';

export const hasRole = (claims: Claims, role: string): boolean => claims.roles.includes(role);

export const isCounsellor = (claims: Claims): boolean => hasRole(claims, 'consultant');

export const isAsker = (claims: Claims): boolean => hasRole(claims, 'user') && !isCounsellor(claims);
