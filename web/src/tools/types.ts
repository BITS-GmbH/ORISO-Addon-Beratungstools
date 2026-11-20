import type { ComponentType, ReactNode } from 'react';
import type { ClientTool, Entry, ToolOptions } from '../../../shared/api.ts';
import type { ToolId } from '../../../shared/catalog.ts';
import type { EntryStore } from '../core/entryStore.ts';

export interface ClientViewProps {
	tool: ClientTool;
	/** The current entries; changes go through `store`, which saves them and updates this list. */
	entries: Entry[];
	store: EntryStore;
	informal: boolean;
	locale: string;
	/** Back to "Meine Tools". */
	onDone: () => void;
	/** Makes one of the tool's client PDFs (`clientExports` on the server) and downloads it. */
	download: (format: string, params?: Record<string, string>) => Promise<void>;
}

export interface CounsellorViewProps {
	entries: Entry[];
	options: ToolOptions;
	/** Changed since the counsellor last looked (marked "neu"). */
	isNew: (entry: Entry) => boolean;
	locale: string;
	/** Entries of the tools this tool reads, present only while the client shares them too. */
	linked: Partial<Record<ToolId, Entry[]>>;
}

/** The web side of a tool. Register it in `tools/index.ts`; the core never names a tool. */
export interface WebTool {
	id: ToolId;
	/** Children of a 24×24 outline SVG (stroke, no fill) for the tiles. */
	icon?: ReactNode;
	ClientView: ComponentType<ClientViewProps>;
	CounsellorView: ComponentType<CounsellorViewProps>;
}
