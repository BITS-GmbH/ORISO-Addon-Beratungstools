import type { z } from 'zod';
import type { Entry, ToolOptions } from '../../../shared/api.ts';
import type { ToolId } from '../../../shared/catalog.ts';
import type { I18n } from '../../../shared/i18n/index.ts';
import type { PdfWriter } from '../core/pdf.ts';
import type { Localized } from '../host.ts';

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
	/**
	 * A request to the counsellors: creating an entry of this kind notifies them at once through the
	 * host (not in demo mode), whether or not the tool is shared. The text must not carry tool content.
	 */
	announce?: (username: string) => { title: Localized; text: Localized };
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
	/** Entries of the tools in `reads` the reader may see right now; absent tools are not available. */
	linked: LinkedEntries;
	/** Display names of the client's counsellors, when the tool asks for them. */
	counsellors: string[];
	/** The language of the PDF (formal address); dates via `formatDay(day, i18n.lang)`. */
	i18n: I18n;
}

export type LinkedEntries = Partial<Record<ToolId, Entry[]>>;

/** A PDF the client makes of their own entries, e.g. the Notfallkoffer as business cards. */
export interface ClientExport {
	/** Title on top of the PDF. */
	title: (i18n: I18n) => string;
	/** Without the common header, for formats with their own layout. */
	bare?: boolean;
	write(pdf: PdfWriter, input: ExportInput & { params: Record<string, string> }): void;
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
	title: Localized;
	start: string;
	end?: string;
	allDay?: boolean;
}

export interface CalendarInput {
	releasedAt: string;
	shared: boolean;
	entries: Entry[];
	now: Date;
	/** For entries with a local time of day. */
	timeZone: string;
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
	/** PDFs for the client, `GET /api/me/tools/<tool>/export/<format>`. */
	clientExports?: Record<string, ClientExport>;
	/**
	 * Other tools whose entries this tool shows (read only): for the client while that tool is
	 * released, for counsellors while it is shared. The core hands them over as `linked`.
	 */
	reads?: ToolId[];
	/** The client's counsellors by name (from the host context), handed over as `counsellors`. */
	counsellorNames?: boolean;
	/** Example entries for the counsellor's demo in their language, applied on first use and on reset. */
	demo?(i18n: I18n): SeedEntry[];
	/** Dated reminders for the client's calendar (ADR-034, section 6). */
	calendar?(input: CalendarInput): CalendarEntry[];
}
