import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import type { Pool, SqlError } from 'mariadb';
import type { Entry, NotificationPrefs } from '../../shared/api.ts';
import { DEFAULT_PREFS } from '../../shared/api.ts';

export interface Release {
	releasedBy: string;
	releasedAt: Date;
	withdrawnAt: Date | null;
	openedAt: Date | null;
}

export interface Share {
	shared: boolean;
	sharedSince: Date | null;
	changedAt: Date;
}

export interface EntrySummary {
	total: number;
	lastChangedAt: Date | null;
	/** Entries changed after the counsellor's seen marker (all without a marker). */
	unseen: number;
}

export interface OutboxRow {
	tenantId: number;
	askerId: string;
	tool: string;
	pending: number;
	version: number;
}

export interface EntryWrite {
	kind: string;
	key?: string | null;
	day?: string | null;
	data: unknown;
}

export type EntryChange = 'created' | 'changed' | 'unchanged';

type Row = Record<string, unknown>;

const date = (value: unknown): Date | null =>
	value instanceof Date ? value : value ? new Date(String(value)) : null;

const dayText = (value: unknown): string | null => {
	if (!value) {
		return null;
	}
	if (value instanceof Date) {
		// The driver builds DATE values at local midnight; UTC would shift them by a day east of Greenwich.
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
	}
	return String(value).slice(0, 10);
};

const toEntry = (row: Row): Entry => ({
	id: String(row.id),
	kind: String(row.kind),
	key: row.entry_key === null ? null : String(row.entry_key),
	day: dayText(row.day),
	data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
	createdAt: (date(row.created_at) as Date).toISOString(),
	updatedAt: (date(row.updated_at) as Date).toISOString()
});

const isDuplicate = (error: unknown) => (error as SqlError)?.errno === 1062;

/** All SQL of the add-on. Every query is scoped to a Träger and an owner, except the lifecycle deletes. */
export class Store {
	readonly pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	private async rows(sql: string, params: unknown[] = []): Promise<Row[]> {
		return (await this.pool.query({ sql, dateStrings: false }, params)) as Row[];
	}

	private async execute(sql: string, params: unknown[] = []): Promise<number> {
		const result = (await this.pool.query(sql, params)) as { affectedRows: number };
		return result.affectedRows;
	}

	// Releases

	async releasesOf(tenantId: number, askerId: string): Promise<Map<string, Release>> {
		const rows = await this.rows(
			'SELECT tool, released_by, released_at, withdrawn_at, opened_at FROM releases WHERE tenant_id = ? AND asker_id = ?',
			[tenantId, askerId]
		);
		return new Map(
			rows.map((row) => [
				String(row.tool),
				{
					releasedBy: String(row.released_by),
					releasedAt: date(row.released_at) as Date,
					withdrawnAt: date(row.withdrawn_at),
					openedAt: date(row.opened_at)
				}
			])
		);
	}

	async releaseOf(tenantId: number, askerId: string, tool: string): Promise<Release | null> {
		return (await this.releasesOf(tenantId, askerId)).get(tool) ?? null;
	}

	/** Releases the tool; a withdrawn release starts anew. Returns false when it was already active. */
	async release(tenantId: number, askerId: string, tool: string, by: string, now: Date): Promise<boolean> {
		const existing = await this.releaseOf(tenantId, askerId, tool);
		if (existing && !existing.withdrawnAt) {
			return false;
		}
		await this.execute(
			`INSERT INTO releases (tenant_id, asker_id, tool, released_by, released_at) VALUES (?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE released_by = VALUES(released_by), released_at = VALUES(released_at),
				opened_at = NULL, withdrawn_at = NULL`,
			[tenantId, askerId, tool, by, now]
		);
		return true;
	}

	async withdraw(tenantId: number, askerId: string, tool: string, now: Date): Promise<boolean> {
		return (
			(await this.execute(
				'UPDATE releases SET withdrawn_at = ? WHERE tenant_id = ? AND asker_id = ? AND tool = ? AND withdrawn_at IS NULL',
				[now, tenantId, askerId, tool]
			)) > 0
		);
	}

	async markOpened(tenantId: number, askerId: string, tool: string, now: Date): Promise<void> {
		await this.execute(
			'UPDATE releases SET opened_at = ? WHERE tenant_id = ? AND asker_id = ? AND tool = ? AND opened_at IS NULL AND withdrawn_at IS NULL',
			[now, tenantId, askerId, tool]
		);
	}

	// Shares

	async sharesOf(tenantId: number, ownerId: string): Promise<Map<string, Share>> {
		const rows = await this.rows(
			'SELECT tool, shared, shared_since, changed_at FROM shares WHERE tenant_id = ? AND asker_id = ?',
			[tenantId, ownerId]
		);
		return new Map(
			rows.map((row) => [
				String(row.tool),
				{
					shared: Boolean(row.shared),
					sharedSince: date(row.shared_since),
					changedAt: date(row.changed_at) as Date
				}
			])
		);
	}

	async shareOf(tenantId: number, ownerId: string, tool: string): Promise<Share | null> {
		return (await this.sharesOf(tenantId, ownerId)).get(tool) ?? null;
	}

	/** Stores the share switch; returns whether it was on before. */
	async setShare(
		tenantId: number,
		ownerId: string,
		tool: string,
		shared: boolean,
		now: Date
	): Promise<boolean> {
		const before = await this.shareOf(tenantId, ownerId, tool);
		await this.execute(
			`INSERT INTO shares (tenant_id, asker_id, tool, shared, shared_since, changed_at) VALUES (?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE
				shared_since = IF(VALUES(shared) = 1, IF(shared = 1, shared_since, VALUES(changed_at)), NULL),
				shared = VALUES(shared),
				changed_at = VALUES(changed_at)`,
			[tenantId, ownerId, tool, shared ? 1 : 0, shared ? now : null, now]
		);
		return before?.shared ?? false;
	}

	// Entries

	async entries(
		tenantId: number,
		ownerId: string,
		tool: string,
		range: { from?: string; to?: string } = {}
	): Promise<Entry[]> {
		const conditions = ['tenant_id = ?', 'owner_id = ?', 'tool = ?'];
		const params: unknown[] = [tenantId, ownerId, tool];
		if (range.from) {
			conditions.push('(day IS NULL OR day >= ?)');
			params.push(range.from);
		}
		if (range.to) {
			conditions.push('(day IS NULL OR day <= ?)');
			params.push(range.to);
		}
		const rows = await this.rows(
			`SELECT * FROM entries WHERE ${conditions.join(' AND ')} ORDER BY day IS NULL, day, created_at, id`,
			params
		);
		return rows.map(toEntry);
	}

	async entry(tenantId: number, ownerId: string, tool: string, id: string): Promise<Entry | null> {
		const [row] = await this.rows(
			'SELECT * FROM entries WHERE id = ? AND tenant_id = ? AND owner_id = ? AND tool = ?',
			[id, tenantId, ownerId, tool]
		);
		return row ? toEntry(row) : null;
	}

	private async keyedEntry(tenantId: number, ownerId: string, tool: string, kind: string, key: string) {
		const [row] = await this.rows(
			'SELECT * FROM entries WHERE tenant_id = ? AND owner_id = ? AND tool = ? AND kind = ? AND entry_key = ?',
			[tenantId, ownerId, tool, kind, key]
		);
		return row ? toEntry(row) : null;
	}

	async countKind(tenantId: number, ownerId: string, tool: string, kind: string): Promise<number> {
		const [row] = await this.rows(
			'SELECT COUNT(*) AS n FROM entries WHERE tenant_id = ? AND owner_id = ? AND tool = ? AND kind = ?',
			[tenantId, ownerId, tool, kind]
		);
		return Number(row?.n ?? 0);
	}

	async createEntry(
		tenantId: number,
		ownerId: string,
		tool: string,
		write: EntryWrite,
		now: Date
	): Promise<Entry> {
		const id = randomUUID();
		await this.execute(
			'INSERT INTO entries (id, tenant_id, owner_id, tool, kind, entry_key, day, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id,
				tenantId,
				ownerId,
				tool,
				write.kind,
				write.key ?? null,
				write.day ?? null,
				JSON.stringify(write.data),
				now,
				now
			]
		);
		return (await this.entry(tenantId, ownerId, tool, id)) as Entry;
	}

	/** Changes data and day of an entry; an identical write keeps the entry (and its timestamp) as it is. */
	async updateEntry(
		tenantId: number,
		ownerId: string,
		tool: string,
		id: string,
		write: Pick<EntryWrite, 'data' | 'day'>,
		now: Date
	): Promise<{ entry: Entry; change: EntryChange } | null> {
		const existing = await this.entry(tenantId, ownerId, tool, id);
		if (!existing) {
			return null;
		}
		const day = write.day === undefined ? existing.day : write.day;
		if (isDeepStrictEqual(existing.data, write.data) && day === existing.day) {
			return { entry: existing, change: 'unchanged' };
		}
		await this.execute(
			'UPDATE entries SET data = ?, day = ?, updated_at = ? WHERE id = ? AND tenant_id = ? AND owner_id = ?',
			[JSON.stringify(write.data), day, now, id, tenantId, ownerId]
		);
		return { entry: (await this.entry(tenantId, ownerId, tool, id)) as Entry, change: 'changed' };
	}

	/** Creates or changes the one entry of a keyed kind. */
	async putKeyed(
		tenantId: number,
		ownerId: string,
		tool: string,
		write: EntryWrite & { key: string },
		now: Date
	): Promise<{ entry: Entry; change: EntryChange }> {
		const existing = await this.keyedEntry(tenantId, ownerId, tool, write.kind, write.key);
		if (!existing) {
			try {
				return { entry: await this.createEntry(tenantId, ownerId, tool, write, now), change: 'created' };
			} catch (error) {
				if (!isDuplicate(error)) {
					throw error;
				}
			}
		}
		const current = existing ?? (await this.keyedEntry(tenantId, ownerId, tool, write.kind, write.key));
		return (await this.updateEntry(tenantId, ownerId, tool, (current as Entry).id, write, now)) as {
			entry: Entry;
			change: EntryChange;
		};
	}

	async deleteEntry(tenantId: number, ownerId: string, tool: string, id: string): Promise<boolean> {
		return (
			(await this.execute(
				'DELETE FROM entries WHERE id = ? AND tenant_id = ? AND owner_id = ? AND tool = ?',
				[id, tenantId, ownerId, tool]
			)) > 0
		);
	}

	async deleteKeyed(
		tenantId: number,
		ownerId: string,
		tool: string,
		kind: string,
		key: string
	): Promise<boolean> {
		return (
			(await this.execute(
				'DELETE FROM entries WHERE tenant_id = ? AND owner_id = ? AND tool = ? AND kind = ? AND entry_key = ?',
				[tenantId, ownerId, tool, kind, key]
			)) > 0
		);
	}

	/** Everything of one owner in one tool: the demo reset. */
	async clearTool(tenantId: number, ownerId: string, tool: string): Promise<void> {
		await this.execute('DELETE FROM entries WHERE tenant_id = ? AND owner_id = ? AND tool = ?', [
			tenantId,
			ownerId,
			tool
		]);
		await this.execute('DELETE FROM shares WHERE tenant_id = ? AND asker_id = ? AND tool = ?', [
			tenantId,
			ownerId,
			tool
		]);
	}

	/** Per tool: number of entries, last change and, for a counsellor, what is new to them. */
	async entrySummaries(
		tenantId: number,
		ownerId: string,
		counsellorId = ''
	): Promise<Map<string, EntrySummary>> {
		const rows = await this.rows(
			`SELECT e.tool, COUNT(*) AS total, MAX(e.updated_at) AS last_changed,
				SUM(s.seen_at IS NULL OR e.updated_at > s.seen_at) AS unseen
			FROM entries e
			LEFT JOIN seen s ON s.tenant_id = e.tenant_id AND s.asker_id = e.owner_id AND s.tool = e.tool AND s.counsellor_id = ?
			WHERE e.tenant_id = ? AND e.owner_id = ?
			GROUP BY e.tool`,
			[counsellorId, tenantId, ownerId]
		);
		return new Map(
			rows.map((row) => [
				String(row.tool),
				{ total: Number(row.total), lastChangedAt: date(row.last_changed), unseen: Number(row.unseen ?? 0) }
			])
		);
	}

	// Seen markers

	async seenAt(tenantId: number, counsellorId: string, askerId: string, tool: string): Promise<Date | null> {
		const [row] = await this.rows(
			'SELECT seen_at FROM seen WHERE tenant_id = ? AND counsellor_id = ? AND asker_id = ? AND tool = ?',
			[tenantId, counsellorId, askerId, tool]
		);
		return row ? date(row.seen_at) : null;
	}

	async markSeen(
		tenantId: number,
		counsellorId: string,
		askerId: string,
		tool: string,
		at: Date
	): Promise<void> {
		await this.execute(
			`INSERT INTO seen (tenant_id, counsellor_id, asker_id, tool, seen_at) VALUES (?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE seen_at = GREATEST(seen_at, VALUES(seen_at))`,
			[tenantId, counsellorId, askerId, tool, at]
		);
	}

	// Notification preferences

	async prefs(counsellorId: string): Promise<NotificationPrefs> {
		return (await this.prefsOf([counsellorId])).get(counsellorId) ?? DEFAULT_PREFS;
	}

	async prefsOf(counsellorIds: string[]): Promise<Map<string, NotificationPrefs>> {
		if (counsellorIds.length === 0) {
			return new Map();
		}
		const rows = await this.rows(
			`SELECT counsellor_id, first_share, new_entry, changed_entry FROM notification_prefs WHERE counsellor_id IN (${counsellorIds.map(() => '?').join(', ')})`,
			counsellorIds
		);
		return new Map(
			rows.map((row) => [
				String(row.counsellor_id),
				{
					firstShare: Boolean(row.first_share),
					newEntry: Boolean(row.new_entry),
					changedEntry: Boolean(row.changed_entry)
				}
			])
		);
	}

	async setPrefs(counsellorId: string, prefs: NotificationPrefs, now: Date): Promise<void> {
		await this.execute(
			`INSERT INTO notification_prefs (counsellor_id, first_share, new_entry, changed_entry, updated_at) VALUES (?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE first_share = VALUES(first_share), new_entry = VALUES(new_entry),
				changed_entry = VALUES(changed_entry), updated_at = VALUES(updated_at)`,
			[counsellorId, prefs.firstShare ? 1 : 0, prefs.newEntry ? 1 : 0, prefs.changedEntry ? 1 : 0, now]
		);
	}

	// Notification outbox

	/**
	 * Adds an event kind (bit) to the client's pending notification for a tool. Outside a bundling
	 * window it is due at once; within one (after a notification went out) at the window's end.
	 */
	async recordEvent(
		tenantId: number,
		askerId: string,
		tool: string,
		bit: number,
		now: Date,
		windowMs: number
	): Promise<void> {
		const windowStart = new Date(now.getTime() - windowMs);
		await this.execute(
			`INSERT INTO notification_outbox (tenant_id, asker_id, tool, pending, version, due_at) VALUES (?, ?, ?, ?, 1, ?)
			ON DUPLICATE KEY UPDATE
				pending = pending | VALUES(pending),
				version = version + 1,
				due_at = IF(last_sent_at IS NULL OR last_sent_at <= ?, VALUES(due_at), DATE_ADD(last_sent_at, INTERVAL ? MICROSECOND))`,
			[tenantId, askerId, tool, bit, now, windowStart, windowMs * 1000]
		);
	}

	/**
	 * Claims the client's due notifications with a conditional update, so that with several replicas
	 * only one sends each; a claim older than `staleMs` (a crashed replica) can be taken over.
	 */
	async claimDue(
		tenantId: number,
		askerId: string,
		now: Date,
		staleMs: number
	): Promise<{ claimId: string; rows: OutboxRow[] }> {
		const claimId = randomUUID();
		await this.execute(
			`UPDATE notification_outbox SET claim_id = ?, claimed_at = ?
			WHERE tenant_id = ? AND asker_id = ? AND pending <> 0 AND due_at <= ?
				AND (claim_id IS NULL OR claimed_at < ?)`,
			[claimId, now, tenantId, askerId, now, new Date(now.getTime() - staleMs)]
		);
		const rows = await this.rows(
			'SELECT tenant_id, asker_id, tool, pending, version FROM notification_outbox WHERE claim_id = ?',
			[claimId]
		);
		return {
			claimId,
			rows: rows.map((row) => ({
				tenantId: Number(row.tenant_id),
				askerId: String(row.asker_id),
				tool: String(row.tool),
				pending: Number(row.pending),
				version: Number(row.version)
			}))
		};
	}

	/**
	 * Ends a claim. `sent` starts a bundling window, `dropped` clears without one (nobody to tell),
	 * `failed` keeps the events for another try. Events recorded during the claim stay pending.
	 */
	async completeClaim(
		row: OutboxRow,
		claimId: string,
		outcome: 'sent' | 'dropped' | 'failed',
		now: Date,
		windowMs: number
	): Promise<void> {
		const key = [row.tenantId, row.askerId, row.tool, claimId];
		if (outcome === 'failed') {
			await this.execute(
				'UPDATE notification_outbox SET claim_id = NULL, claimed_at = NULL, due_at = ? WHERE tenant_id = ? AND asker_id = ? AND tool = ? AND claim_id = ?',
				[new Date(now.getTime() + 60_000), ...key]
			);
			return;
		}
		const nextDue = new Date(now.getTime() + (outcome === 'sent' ? windowMs : 0));
		await this.execute(
			`UPDATE notification_outbox SET
				pending = IF(version = ?, 0, pending),
				due_at = IF(version = ?, NULL, ?),
				last_sent_at = IF(?, ?, last_sent_at),
				claim_id = NULL, claimed_at = NULL
			WHERE tenant_id = ? AND asker_id = ? AND tool = ? AND claim_id = ?`,
			[row.version, row.version, nextDue, outcome === 'sent' ? 1 : 0, now, ...key]
		);
	}

	// Statistics and lifecycle

	async statistics(
		tenantId: number
	): Promise<Map<string, { released: number; started: number; shared: number }>> {
		const stats = new Map<string, { released: number; started: number; shared: number }>();
		const of = (tool: string) => {
			let value = stats.get(tool);
			if (!value) {
				value = { released: 0, started: 0, shared: 0 };
				stats.set(tool, value);
			}
			return value;
		};
		for (const row of await this.rows(
			'SELECT tool, COUNT(*) AS n FROM releases WHERE tenant_id = ? AND withdrawn_at IS NULL GROUP BY tool',
			[tenantId]
		)) {
			of(String(row.tool)).released = Number(row.n);
		}
		for (const row of await this.rows(
			"SELECT tool, COUNT(DISTINCT owner_id) AS n FROM entries WHERE tenant_id = ? AND owner_id NOT LIKE 'demo:%' GROUP BY tool",
			[tenantId]
		)) {
			of(String(row.tool)).started = Number(row.n);
		}
		for (const row of await this.rows(
			"SELECT tool, COUNT(*) AS n FROM shares WHERE tenant_id = ? AND shared = 1 AND asker_id NOT LIKE 'demo:%' GROUP BY tool",
			[tenantId]
		)) {
			of(String(row.tool)).shared = Number(row.n);
		}
		return stats;
	}

	/**
	 * `user.deleted`: everything of a client, and a counsellor's own data (demo, seen markers,
	 * preferences). Releases a deleted counsellor made stay with the client, without the name.
	 */
	async deleteUser(userId: string): Promise<number> {
		const demo = `demo:${userId}`;
		let removed = 0;
		for (const [sql, params] of [
			['DELETE FROM entries WHERE owner_id IN (?, ?)', [userId, demo]],
			['DELETE FROM shares WHERE asker_id IN (?, ?)', [userId, demo]],
			['DELETE FROM releases WHERE asker_id = ?', [userId]],
			['DELETE FROM seen WHERE asker_id = ? OR counsellor_id = ?', [userId, userId]],
			['DELETE FROM notification_outbox WHERE asker_id = ?', [userId]],
			['DELETE FROM notification_prefs WHERE counsellor_id = ?', [userId]],
			["UPDATE releases SET released_by = 'deleted' WHERE released_by = ?", [userId]]
		] as Array<[string, unknown[]]>) {
			removed += await this.execute(sql, params);
		}
		return removed;
	}
}
