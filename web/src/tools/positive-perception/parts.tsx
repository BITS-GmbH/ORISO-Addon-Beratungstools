import type { Entry } from '../../../../shared/api.ts';
import { BEHAVIOUR_KIND, type Behaviour } from '../../../../shared/tools/positive-perception.ts';

export type Item = Behaviour & { id: string; entry: Entry };

export const behavioursOf = (entries: Entry[]): Item[] =>
	entries
		.filter((e) => e.kind === BEHAVIOUR_KIND)
		.map((e) => ({ ...(e.data as Behaviour), id: e.id, entry: e }));
