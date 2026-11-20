import { createRequire } from 'node:module';
import PDFDocument from 'pdfkit';

const require = createRequire(import.meta.url);
const FONT = require.resolve('dejavu-fonts-ttf/ttf/DejaVuSans.ttf');
const FONT_BOLD = require.resolve('dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf');

const COLORS = { text: '#1a1c1e', muted: '#545f63', rule: '#d6dcde', accent: '#225e65' };
const MARGIN = 50;

export interface Box {
	x: number;
	y: number;
	width: number;
}

/** What a tool writes into its export, below the common header. Texts are always plain text. */
export interface PdfWriter {
	heading(text: string): void;
	subheading(text: string): void;
	paragraph(text: string, options?: { muted?: boolean }): void;
	/** A label in bold with its text below. */
	field(label: string, text: string): void;
	/** A list item with an optional note on the right, e.g. a rating. */
	item(text: string, note?: string): void;
	spacer(height?: number): void;
	/** Reserves `height` points and lets the tool draw into them with pdfkit. */
	drawing(height: number, draw: (doc: PDFKit.PDFDocument, box: Box) => void): void;
}

export interface ExportHeader {
	toolTitle: string;
	caseLabel: string;
	createdAt: Date;
	period: string;
}

const createWriter = (doc: PDFKit.PDFDocument): PdfWriter => {
	const width = () => doc.page.width - 2 * MARGIN;
	const ensureSpace = (height: number) => {
		if (doc.y + height > doc.page.height - MARGIN - 30) {
			doc.addPage();
		}
	};
	const text = (value: string, font: string, size: number, color: string, gapAfter: number) => {
		doc.font(font).fontSize(size).fillColor(color);
		ensureSpace(Math.min(doc.heightOfString(value || ' ', { width: width() }), size * 4));
		doc.text(value, MARGIN, doc.y, { width: width() });
		doc.moveDown(gapAfter);
	};
	return {
		heading: (value) => {
			ensureSpace(60);
			doc.moveDown(0.6);
			text(value, 'bold', 13, COLORS.accent, 0.3);
		},
		subheading: (value) => {
			ensureSpace(40);
			text(value, 'bold', 11, COLORS.text, 0.2);
		},
		paragraph: (value, options = {}) =>
			text(value, 'regular', 10, options.muted ? COLORS.muted : COLORS.text, 0.5),
		field: (label, value) => {
			ensureSpace(40);
			text(label, 'bold', 10, COLORS.text, 0.15);
			text(value, 'regular', 10, COLORS.text, 0.6);
		},
		item: (value, note) => {
			doc.font('regular').fontSize(10);
			const noteWidth = note ? 110 : 0;
			const textWidth = width() - noteWidth - 14;
			const height = doc.heightOfString(value, { width: textWidth });
			ensureSpace(height + 8);
			const top = doc.y;
			doc.fillColor(COLORS.muted).text('•', MARGIN, top, { width: 10 });
			doc.fillColor(COLORS.text).text(value, MARGIN + 14, top, { width: textWidth });
			if (note) {
				doc
					.fontSize(9)
					.fillColor(COLORS.muted)
					.text(note, MARGIN + width() - noteWidth, top, { width: noteWidth, align: 'right' });
			}
			doc.y = top + height + 5;
			doc.x = MARGIN;
		},
		spacer: (height = 8) => {
			doc.y += height;
		},
		drawing: (height, draw) => {
			ensureSpace(height);
			const box = { x: MARGIN, y: doc.y, width: width() };
			doc.save();
			draw(doc, box);
			doc.restore();
			doc.font('regular').fontSize(10).fillColor(COLORS.text);
			doc.x = MARGIN;
			doc.y = box.y + height;
		}
	};
};

const formatDateTime = (date: Date, timeZone: string) =>
	new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(date);

/**
 * The export of one tool as PDF: the common header (tool, case, creation date, period of the
 * entries) and the tool's content, with a confidentiality note in every page's footer.
 */
export const renderPdf = (
	header: ExportHeader,
	timeZone: string,
	write: (pdf: PdfWriter) => void
): Promise<Buffer> =>
	new Promise((resolve, reject) => {
		const doc = new PDFDocument({
			size: 'A4',
			margin: MARGIN,
			bufferPages: true,
			info: { Title: `${header.toolTitle} (${header.caseLabel})`, Creator: 'ORISO Beratungstools' }
		});
		doc.registerFont('regular', FONT);
		doc.registerFont('bold', FONT_BOLD);
		const chunks: Buffer[] = [];
		doc.on('data', (chunk: Buffer) => chunks.push(chunk));
		doc.on('end', () => resolve(Buffer.concat(chunks)));
		doc.on('error', reject);

		doc.font('regular').fontSize(9).fillColor(COLORS.muted).text('Beratungstools', MARGIN, MARGIN);
		doc.font('bold').fontSize(20).fillColor(COLORS.accent).text(header.toolTitle);
		doc.moveDown(0.4);
		const rows: Array<[string, string]> = [
			['Fall', header.caseLabel],
			['Export erstellt am', formatDateTime(header.createdAt, timeZone)],
			['Zeitraum der Einträge', header.period]
		];
		for (const [label, value] of rows) {
			const top = doc.y;
			doc.font('bold').fontSize(9.5).fillColor(COLORS.muted).text(label, MARGIN, top, { width: 140 });
			doc
				.font('regular')
				.fillColor(COLORS.text)
				.text(value, MARGIN + 140, top, { width: doc.page.width - 2 * MARGIN - 140 });
			doc.moveDown(0.15);
		}
		doc.moveDown(0.4);
		doc
			.moveTo(MARGIN, doc.y)
			.lineTo(doc.page.width - MARGIN, doc.y)
			.strokeColor(COLORS.rule)
			.lineWidth(1)
			.stroke();
		doc.moveDown(0.6);
		doc.x = MARGIN;

		try {
			write(createWriter(doc));
		} catch (error) {
			reject(error);
			return;
		}

		const range = doc.bufferedPageRange();
		for (let index = range.start; index < range.start + range.count; index++) {
			doc.switchToPage(index);
			const bottom = doc.page.height - MARGIN + 10;
			doc.page.margins.bottom = 0;
			doc
				.font('regular')
				.fontSize(8)
				.fillColor(COLORS.muted)
				.text(
					`Vertraulich. Von der ratsuchenden Person zur Einsicht freigegebene Inhalte, nur zur Verwendung im Beratungskontext. Seite ${index + 1} von ${range.count}`,
					MARGIN,
					bottom,
					{ width: doc.page.width - 2 * MARGIN, align: 'center', lineBreak: false }
				);
		}
		doc.end();
	});
