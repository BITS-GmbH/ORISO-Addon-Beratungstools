import { useCallback, useMemo, useRef, useState } from 'react';
import type { Entry } from '../../../shared/api.ts';
import type { OwnerApi } from '../api.ts';
import type { SaveState } from '../ui.tsx';

export interface EntryStore {
	create(kind: string, data: unknown, day?: string): Promise<Entry | null>;
	update(id: string, data: unknown, day?: string): Promise<Entry | null>;
	remove(id: string): Promise<boolean>;
	/** Creates or changes the one entry of a keyed kind (e.g. the answer to a question). */
	putKeyed(kind: string, key: string, data: unknown, day?: string): Promise<Entry | null>;
	removeKeyed(kind: string, key: string): Promise<boolean>;
	saveState: SaveState;
}

const sameKey = (entry: Entry, kind: string, key: string) => entry.kind === kind && entry.key === key;

/**
 * Entries of one tool with saving: every change is sent right away (in order), the list is updated
 * from the server's answer, and `saveState` drives the autosave indicator. Failed saves are
 * reported through `onError` and leave the list as the server has it.
 */
export const useEntryStore = (api: OwnerApi, initial: Entry[], onError: (error: Error) => void) => {
	const [entries, setEntries] = useState<Entry[]>(initial);
	const [saveState, setSaveState] = useState<SaveState>('idle');
	const queue = useRef<Promise<unknown>>(Promise.resolve());
	const pending = useRef(0);

	const run = useCallback(
		<T>(task: () => Promise<T>, apply: (result: T) => void): Promise<T | null> => {
			pending.current += 1;
			setSaveState('saving');
			const result = queue.current.then(async () => {
				try {
					const value = await task();
					apply(value);
					return value;
				} catch (error) {
					onError(error as Error);
					setSaveState('error');
					return null;
				} finally {
					pending.current -= 1;
					if (pending.current === 0) {
						setSaveState((state) => (state === 'error' ? state : 'saved'));
					}
				}
			});
			queue.current = result;
			return result;
		},
		[onError]
	);

	const upsert = (entry: Entry) =>
		setEntries((list) =>
			list.some((e) => e.id === entry.id)
				? list.map((e) => (e.id === entry.id ? entry : e))
				: [...list, entry]
		);

	const store = useMemo<EntryStore>(
		() => ({
			saveState,
			create: (kind, data, day) => run(() => api.create(kind, data, day), upsert),
			update: (id, data, day) => run(() => api.update(id, data, day), upsert),
			putKeyed: (kind, key, data, day) => run(() => api.putKeyed(kind, key, data, day), upsert),
			remove: async (id) =>
				(await run(
					() => api.remove(id).then(() => true),
					() => setEntries((list) => list.filter((e) => e.id !== id))
				)) === true,
			removeKeyed: async (kind, key) =>
				(await run(
					() => api.removeKeyed(kind, key).then(() => true),
					() => setEntries((list) => list.filter((e) => !sameKey(e, kind, key)))
				)) === true
		}),
		[api, run, saveState]
	);

	return { entries, store };
};
