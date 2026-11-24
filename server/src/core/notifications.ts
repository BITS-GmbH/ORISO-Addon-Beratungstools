import type { NotificationPrefs } from '../../../shared/api.ts';
import { DEFAULT_PREFS } from '../../../shared/api.ts';
import { toolTexts } from '../../../shared/catalog.ts';
import { localized } from '../../../shared/i18n/index.ts';
import type { Claims } from '../auth.ts';
import type { Host, HostNotification } from '../host.ts';
import type { OutboxRow, Store } from '../store.ts';
import { APP_ID, SLOTS } from './manifest.ts';

export type EventKind = 'firstShare' | 'newEntry' | 'changedEntry';

const BITS: Record<EventKind, number> = { firstShare: 1, newEntry: 2, changedEntry: 4 };

const kindsOf = (bits: number): EventKind[] =>
	(Object.keys(BITS) as EventKind[]).filter((kind) => bits & BITS[kind]);

/** The text for the client's counsellors: who, which tool, what happened; never any content. */
export const counsellorNotification = (
	username: string | undefined,
	tool: string,
	kinds: EventKind[]
): HostNotification => {
	const shared = kinds.includes('firstShare');
	const added = kinds.includes('newEntry');
	const changed = kinds.includes('changedEntry');
	return {
		recipient: 'counsellors',
		appId: APP_ID,
		important: false,
		title: localized(({ m }) => (shared ? m.notifications.sharedTitle : m.notifications.entriesTitle)),
		text: localized(({ m, t }) => {
			const what =
				added && changed
					? m.notifications.addedAndChanged
					: added
						? m.notifications.added
						: changed
							? m.notifications.changed
							: '';
			const vars = { who: username ?? m.notifications.someone, tool: toolTexts(m, tool).title, what };
			return t(
				shared ? (what ? m.notifications.sharedAnd : m.notifications.shared) : m.notifications.changes,
				vars
			);
		}),
		target: { slot: SLOTS.consultantSession }
	};
};

const wanted = (kind: EventKind, prefs: NotificationPrefs) => prefs[kind];

export interface NotifierOptions {
	store: Store;
	host: Host;
	now: () => Date;
	windowMs: number;
	/** Whether the tool is still released and effectively shared, checked again before sending. */
	stillShared: (claims: Claims, tool: string) => Promise<boolean>;
	log?: Pick<Console, 'warn'>;
}

/**
 * Notifications to the client's counsellors, bundled per client and tool: the first event goes out
 * at once and opens a window (15 minutes by default); what happens within the window goes out as
 * one notification when it has passed.
 *
 * The host API only sends notifications with a user token (2 minutes valid), so pending
 * notifications are sent from the client's own requests (API calls and the registry's
 * `/visibility` checks), never from a background job. See ARCHITECTURE.md, Notifications.
 */
export const createNotifier = ({
	store,
	host,
	now,
	windowMs,
	stillShared,
	log = console
}: NotifierOptions) => {
	const running = new Set<Promise<void>>();

	const recipientsWant = async (claims: Claims): Promise<(kind: EventKind) => boolean> => {
		const context = await host.context(claims, 'self');
		const ids = [
			...new Set(
				(context?.sessions ?? []).map((s) => s.consultantId).filter((id): id is string => Boolean(id))
			)
		];
		if (ids.length === 0) {
			return () => true;
		}
		const prefs = await store.prefsOf(ids);
		return (kind) => ids.some((id) => wanted(kind, prefs.get(id) ?? DEFAULT_PREFS));
	};

	const send = async (claims: Claims, row: OutboxRow, claimId: string) => {
		const at = now();
		try {
			if (!(await stillShared(claims, row.tool))) {
				await store.completeClaim(row, claimId, 'dropped', at, windowMs);
				return;
			}
			const want = await recipientsWant(claims);
			const kinds = kindsOf(row.pending).filter(want);
			if (kinds.length === 0) {
				await store.completeClaim(row, claimId, 'dropped', at, windowMs);
				return;
			}
			const ok = await host.notify(claims, counsellorNotification(claims.username, row.tool, kinds));
			await store.completeClaim(row, claimId, ok ? 'sent' : 'failed', at, windowMs);
		} catch (error) {
			log.warn(`notification for ${row.tool} failed: ${(error as Error).message}`);
			await store.completeClaim(row, claimId, 'failed', at, windowMs).catch(() => undefined);
		}
	};

	/** Sends what is due for the client of these claims. */
	const flush = async (claims: Claims): Promise<void> => {
		const { claimId, rows } = await store.claimDue(claims.tenantId, claims.sub, now(), 5 * 60_000);
		for (const row of rows) {
			await send(claims, row, claimId);
		}
	};

	return {
		/** Records an event of the client and sends right away if no window is open. */
		async record(claims: Claims, tool: string, kind: EventKind): Promise<void> {
			await store.recordEvent(claims.tenantId, claims.sub, tool, BITS[kind], now(), windowMs);
			await flush(claims);
		},
		flush,
		/** Flushes without making the request wait. */
		flushInBackground(claims: Claims): void {
			const task = flush(claims)
				.catch((error: Error) => log.warn(`notification flush failed: ${error.message}`))
				.finally(() => running.delete(task));
			running.add(task);
		},
		async settled(): Promise<void> {
			await Promise.all([...running]);
		}
	};
};

export type Notifier = ReturnType<typeof createNotifier>;
