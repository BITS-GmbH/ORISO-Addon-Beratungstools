import type { Claims } from './auth.ts';

export interface Localized {
	de: string;
	en?: string;
}

export interface HostNotification {
	recipient: 'self' | 'asker' | 'counsellors';
	appId: string;
	important: boolean;
	title: Localized;
	text: Localized;
	target: { slot: string };
}

export interface HostAudit {
	action: string;
	appId?: string;
	summary: Localized;
	subject?: 'self' | 'asker';
}

export interface HostGates {
	dpa?: { newCounsellingAllowed?: boolean };
}

/** `GET /host/context`: the sessions of a person with their agency and counsellor. */
export interface HostContext {
	sessions?: Array<{ id?: number; agencyId?: number; consultantId?: string | null; status?: string }>;
	agencyIds?: number[];
	consultants?: Array<{ id?: string; username?: string; displayName?: string }>;
}

/** The AddonService host API (ADR-034, section 6), called with the token of the request being handled. */
export interface Host {
	settings(claims: Claims): Promise<Record<string, unknown> | null>;
	gates(claims: Claims): Promise<HostGates | null>;
	context(claims: Claims, subject: 'self' | 'asker'): Promise<HostContext | null>;
	notify(claims: Claims, notification: HostNotification): Promise<boolean>;
	audit(claims: Claims, entry: HostAudit): Promise<boolean>;
}

/**
 * Host client. Failing calls are logged and never fail the user's action; settings are cached
 * briefly per Träger and agency because `/visibility` has to answer within the registry's timeout.
 */
export const createHost = ({
	url,
	fetchImpl = fetch,
	timeoutMs = 2000,
	settingsTtlMs = 30_000,
	now = Date.now,
	log = console
}: {
	url: string;
	fetchImpl?: typeof fetch;
	timeoutMs?: number;
	settingsTtlMs?: number;
	now?: () => number;
	log?: Pick<Console, 'warn'>;
}): Host => {
	const settingsCache = new Map<string, { until: number; value: Record<string, unknown> }>();

	const request = (path: string, claims: Claims, init: RequestInit = {}) =>
		fetchImpl(`${url}${path}`, {
			...init,
			headers: { Authorization: `Bearer ${claims.token}`, ...init.headers },
			signal: AbortSignal.timeout(timeoutMs)
		});

	const getJson = async <T>(path: string, claims: Claims): Promise<T | null> => {
		try {
			const response = await request(path, claims);
			if (!response.ok) {
				log.warn(`host ${path} answered ${response.status}`);
				return null;
			}
			return (await response.json()) as T;
		} catch (error) {
			log.warn(`host ${path} failed: ${(error as Error).message}`);
			return null;
		}
	};

	const post = async (path: string, claims: Claims, body: unknown): Promise<boolean> => {
		try {
			const response = await request(path, claims, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!response.ok) {
				log.warn(`host ${path} answered ${response.status}`);
			}
			return response.ok;
		} catch (error) {
			log.warn(`host ${path} failed: ${(error as Error).message}`);
			return false;
		}
	};

	return {
		async settings(claims) {
			const key = `${claims.tenantId}:${claims.agencyId ?? ''}`;
			const cached = settingsCache.get(key);
			if (cached && cached.until > now()) {
				return cached.value;
			}
			const value = await getJson<Record<string, unknown>>('/settings', claims);
			if (value) {
				settingsCache.set(key, { until: now() + settingsTtlMs, value });
			}
			return value;
		},
		gates: (claims) => getJson<HostGates>('/gates', claims),
		context: (claims, subject) => getJson<HostContext>(`/context?subject=${subject}`, claims),
		notify: (claims, notification) => post('/notifications', claims, notification),
		audit: (claims, entry) => post('/audit', claims, entry)
	};
};
