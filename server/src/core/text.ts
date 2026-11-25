import type { PdfWriter } from './pdf.ts';

const oneLine = (value: string) => value.replace(/\s*\n\s*/g, ' ').trim();

/**
 * A PdfWriter that renders a tool's export as plain text: headings marked with `#`, list items with
 * `- `, tables as one row per line with ` | ` between the cells. Drawings have no text and are left out.
 */
export const createTextWriter = () => {
	const lines: string[] = [];
	const writer: PdfWriter = {
		heading: (text) => {
			if (lines.length > 0) {
				lines.push('');
			}
			lines.push(`# ${text}`);
		},
		subheading: (text) => lines.push(`## ${text}`),
		paragraph: (text) => lines.push(text),
		field: (label, text) => lines.push(`${label}: ${text}`),
		item: (text, note) => lines.push(`- ${text}${note ? ` (${note})` : ''}`),
		table: (columns, rows) =>
			lines.push(
				columns.map((column) => oneLine(column.label)).join(' | '),
				...rows.map((row) => row.map(oneLine).join(' | '))
			),
		spacer: () => undefined,
		drawing: () => undefined
	};
	return { writer, text: () => lines.join('\n') };
};
