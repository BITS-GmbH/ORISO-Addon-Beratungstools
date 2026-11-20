import type {
	CaseEntries,
	CaseOverview,
	ClientTool,
	ClientToolList,
	Entry,
	NotificationPrefs
} from '../../shared/api.ts';
import type { HostProps } from './host.ts';

export class ApiError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

type Call = HostProps['api'];

const request = async <T>(api: Call, path: string, method = 'GET', body?: unknown): Promise<T> => {
	const response = await api(path, {
		method,
		...(body === undefined
			? {}
			: { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
	});
	if (!response.ok) {
		const detail = await response.json().catch(() => ({}) as { error?: string });
		throw new ApiError(response.status, detail.error ?? `HTTP ${response.status}`);
	}
	return (response.status === 204 ? undefined : await response.json()) as T;
};

/** The routes a tool uses as its user: `/me` for the client, `/demo` for a counsellor's demo. */
export const ownerApi = (api: Call, base: '/me' | '/demo', tool: string) => {
	const root = `${base}/tools/${encodeURIComponent(tool)}`;
	const keyed = (kind: string, key: string) =>
		`${root}/keyed/${encodeURIComponent(kind)}/${encodeURIComponent(key)}`;
	return {
		load: () => request<ClientTool>(api, root),
		create: (kind: string, data: unknown, day?: string) =>
			request<Entry>(api, `${root}/entries`, 'POST', { kind, data, day }),
		update: (id: string, data: unknown, day?: string) =>
			request<Entry>(api, `${root}/entries/${encodeURIComponent(id)}`, 'PUT', { data, day }),
		remove: (id: string) => request<void>(api, `${root}/entries/${encodeURIComponent(id)}`, 'DELETE'),
		putKeyed: (kind: string, key: string, data: unknown, day?: string) =>
			request<Entry>(api, keyed(kind, key), 'PUT', { data, day }),
		removeKeyed: (kind: string, key: string) => request<void>(api, keyed(kind, key), 'DELETE'),
		share: (shared: boolean) => request<{ shared: boolean }>(api, `${root}/share`, 'PUT', { shared }),
		reset: () => request<void>(api, `${root}/reset`, 'POST')
	};
};

export type OwnerApi = ReturnType<typeof ownerApi>;

export const clientTools = (api: Call) => request<ClientToolList>(api, '/me/tools');

export const caseApi = (api: Call) => ({
	overview: () => request<CaseOverview>(api, '/case/tools'),
	release: (tool: string) => request<{ released: boolean }>(api, `/case/tools/${tool}/release`, 'POST'),
	withdraw: (tool: string) => request<{ released: boolean }>(api, `/case/tools/${tool}/release`, 'DELETE'),
	entries: (tool: string) => request<CaseEntries>(api, `/case/tools/${tool}/entries`),
	seen: (tool: string, until?: string) =>
		request<{ seenAt: string }>(api, `/case/tools/${tool}/seen`, 'POST', { until }),
	async exportPdf(
		tool: string,
		range: { from?: string; to?: string } = {}
	): Promise<{ blob: Blob; fileName: string }> {
		const query = new URLSearchParams(
			Object.entries(range).filter(([, value]) => value) as Array<[string, string]>
		);
		const response = await api(`/case/tools/${tool}/export${query.size ? `?${query}` : ''}`);
		if (!response.ok) {
			throw new ApiError(response.status, `HTTP ${response.status}`);
		}
		const disposition = response.headers.get('Content-Disposition') ?? '';
		const fileName = /filename="([^"]+)"/.exec(disposition)?.[1] ?? `${tool}.pdf`;
		return { blob: await response.blob(), fileName };
	},
	prefs: () => request<NotificationPrefs>(api, '/counsellor/notification-prefs'),
	savePrefs: (prefs: NotificationPrefs) =>
		request<NotificationPrefs>(api, '/counsellor/notification-prefs', 'PUT', prefs)
});
