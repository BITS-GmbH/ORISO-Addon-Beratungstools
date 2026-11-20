import type { z } from 'zod';
import type { Entry, ToolOptions } from '../../../shared/api.ts';
import type { ToolId } from '../../../shared/catalog.ts';
import type { PdfWriter } from '../core/pdf.ts';

/** One record type of a tool. The core stores, lists and checks it; the tool only describes it. */
export interface EntryKind {
	/** Validates (and may normalise) `data` on every write. */
	schema: z.ZodType;
	/**
	 * Keyed kinds hold at most one entry per key and are written with
	 * `PUT /api/me/tools/<tool>/keyed/<kind>/<key>`; the function says which keys exist.
	 * Unkeyed kinds are created with `POST .../entries` and get an id.
	 */
	keys?: (key: string) => boolean;
	/** Most entries of this kind one client may have. */
	max?: number;
	/** Dated kinds need `day` (YYYY-MM-DD), so diaries and calendars can ask for ranges. */
	dated?: boolean;
}

/** A setting of the tool for ORISO-Admin, in the JSON Schema subset of ADR-034 section 5. */
export interface SettingProperty {
	type: 'string' | 'boolean' | 'number' | 'integer';
	title: string;
	description?: string;
	default: string | number | boolean;
	enum?: readonly string[];
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	format?: 'textarea';
}

export interface ExportInput {
	entries: Entry[];
	options: ToolOptions;
}

export interface SeedEntry {
	kind: string;
	key?: string;
	day?: string;
	data: unknown;
}

export interface CalendarEntry {
	id: string;
	kind: 'appointment' | 'deadline' | 'reminder';
	title: { de: string; en?: string };
	start: string;
	end?: string;
	allDay?: boolean;
}

export interface CalendarInput {
	releasedAt: string;
	shared: boolean;
	entries: Entry[];
}

/** The server side of a tool. Register it in `tools/index.ts`; the core never names a tool. */
export interface ServerTool {
	id: ToolId;
	kinds: Record<string, EntryKind>;
	/** Options per Träger and agency; the core prefixes the keys with the tool, e.g. `balancePoles`. */
	options?: Record<string, SettingProperty>;
	/** Diaries: the counsellor picks a period before the export. */
	exportRange?: boolean;
	/** Writes the tool's part of the PDF below the common header. */
	exportPdf(pdf: PdfWriter, input: ExportInput): void;
	/** Example entries for the counsellor's demo, applied on first use and on reset. */
	demo?(): SeedEntry[];
	/** Dated reminders for the client's calendar (ADR-034, section 6). */
	calendar?(input: CalendarInput): CalendarEntry[];
}
