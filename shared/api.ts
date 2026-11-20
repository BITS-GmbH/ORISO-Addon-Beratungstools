import type { ToolId } from './catalog.ts';

/** One record of a tool, as the API returns it. `data` is checked by the tool's schema. */
export interface Entry<T = unknown> {
	id: string;
	kind: string;
	key: string | null;
	day: string | null;
	data: T;
	createdAt: string;
	updatedAt: string;
}

export type ToolOptions = Record<string, string | number | boolean>;

/** "Meine Tools": the tools released for the client. */
export interface ClientToolSummary {
	id: ToolId;
	releasedAt: string;
	opened: boolean;
	shared: boolean;
	hasEntries: boolean;
}

export interface ClientToolList {
	tools: ClientToolSummary[];
}

/** A released tool as the client (or a counsellor in demo mode) uses it. */
export interface ClientTool {
	id: ToolId;
	demo: boolean;
	shared: boolean;
	allowSharing: boolean;
	options: ToolOptions;
	entries: Entry[];
	/** Entries of other tools this tool shows, only for tools released to the client. */
	linked: Partial<Record<ToolId, Entry[]>>;
	/** Names of the client's counsellors, for tools that show them. */
	counsellors: string[];
}

/** One tile of the counsellor's overview. Content-related fields only with an effective share. */
export interface CaseTool {
	id: ToolId;
	released: boolean;
	releasedAt: string | null;
	hasEntries: boolean;
	shared: boolean;
	sharedSince: string | null;
	lastChangedAt: string | null;
	newCount: number;
	exportRange: boolean;
}

export interface CaseOverview {
	sessionId: number | null;
	tools: CaseTool[];
}

/** The shared entries of one tool, read only, for a counsellor. */
export interface CaseEntries {
	id: ToolId;
	options: ToolOptions;
	entries: Entry[];
	seenAt: string | null;
	sharedSince: string | null;
	exportRange: boolean;
	/** Entries of other tools this tool shows, only for tools the client shares as well. */
	linked: Partial<Record<ToolId, Entry[]>>;
}

export interface NotificationPrefs {
	firstShare: boolean;
	newEntry: boolean;
	changedEntry: boolean;
}

export const DEFAULT_PREFS: NotificationPrefs = { firstShare: true, newEntry: true, changedEntry: true };

/** Entries changed after the counsellor last looked (all of them before the first look). */
export const isNewSince = (
	changedAt: string | null | undefined,
	seenAt: string | null | undefined
): boolean => Boolean(changedAt) && (!seenAt || (changedAt as string) > seenAt);
