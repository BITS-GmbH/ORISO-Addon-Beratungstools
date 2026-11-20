import type { Entry } from '../../../shared/api.ts';
import type { HostContext } from '../host.ts';
import type { LinkedEntries, ServerTool } from '../tools/types.ts';
import { isOffered, type Settings } from './settings.ts';

/**
 * The entries of the tools `tool` reads (`reads`), for those the reader may see right now. Tools
 * never import each other; this is the only way one shows the entries of another.
 */
export const readLinked = async (
	tools: ServerTool[],
	tool: ServerTool,
	settings: Settings,
	allowed: (other: ServerTool) => Promise<boolean>,
	load: (other: ServerTool) => Promise<Entry[]>
): Promise<LinkedEntries> => {
	const linked: LinkedEntries = {};
	for (const id of tool.reads ?? []) {
		const other = tools.find((candidate) => candidate.id === id);
		if (other && isOffered(settings, other) && (await allowed(other))) {
			linked[id] = await load(other);
		}
	}
	return linked;
};

/** Display names of the counsellors of the client's sessions, within one agency when given. */
export const counsellorNames = (context: HostContext | null, agencyId?: number): string[] => {
	const ids = new Set(
		(context?.sessions ?? [])
			.filter(
				(session) => agencyId === undefined || session.agencyId === undefined || session.agencyId === agencyId
			)
			.map((session) => session.consultantId)
			.filter((id): id is string => Boolean(id))
	);
	const names = (context?.consultants ?? [])
		.filter((consultant) => consultant.id && ids.has(consultant.id))
		.map((consultant) => consultant.displayName || consultant.username || '')
		.filter(Boolean);
	return [...new Set(names)];
};
