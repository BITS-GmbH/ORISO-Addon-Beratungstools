import type { PdfWriter } from '../src/core/pdf.ts';

/** A PdfWriter that records the text a tool writes, to check export content without parsing PDFs. */
export const createWriter = () => {
	const lines: string[] = [];
	const writer: PdfWriter = {
		heading: (text) => lines.push(`# ${text}`),
		subheading: (text) => lines.push(`## ${text}`),
		paragraph: (text) => lines.push(text),
		field: (label, text) => lines.push(`${label}: ${text}`),
		item: (text, note) => lines.push(`- ${text}${note ? ` (${note})` : ''}`),
		table: (columns, rows) =>
			lines.push(columns.map((c) => c.label).join(' | '), ...rows.map((row) => row.join(' | '))),
		spacer: () => undefined,
		drawing: () => undefined
	};
	return { writer, text: () => lines.join('\n') };
};
