import { z } from 'zod';
import {
	importanceLabel,
	isPrinted,
	itemsOf,
	keyedOf,
	keyedText,
	LIST_KINDS,
	MAIN_KEY,
	MAX_ITEMS,
	MAX_LONG_TEXT_LENGTH,
	MAX_NAME_LENGTH,
	MAX_TEXT_LENGTH,
	OTHER_STRATEGIES_KIND,
	REQUEST_KIND,
	RISK_PRINT_KIND,
	SECTION_NUMBERS,
	SELF_HELP_KIND,
	SELF_HELP_REQUEST_KEY,
	selfHelpRequest,
	TRUSTED_KIND,
	trustedOf,
	type Item,
	type ListKind,
	type SectionId
} from '../../../../shared/tools/emergency-kit.ts';
import type { I18n } from '../../../../shared/i18n/index.ts';
import { difficultyOf, situationsOf } from '../../../../shared/tools/risk-situations.ts';
import type { PdfWriter } from '../../core/pdf.ts';
import type { EntryKind, ExportInput, ServerTool } from '../types.ts';

const text = (max: number) => z.object({ text: z.string().trim().min(1).max(max) });

export const motivationSchema = z.object({
	text: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
	importance: z.union([z.literal(1), z.literal(2)])
});

const isEntryId = (key: string) => /^[0-9a-f-]{36}$/.test(key);

const listKinds = Object.fromEntries(
	LIST_KINDS.map((kind): [ListKind, EntryKind] => [
		kind,
		{ schema: kind === 'motivation' ? motivationSchema : text(MAX_TEXT_LENGTH), max: MAX_ITEMS }
	])
);

const agencyLines = ({ options, counsellors }: Pick<ExportInput, 'options' | 'counsellors'>) => {
	const agency = typeof options.agency === 'string' ? options.agency.trim() : '';
	return { agency, counsellors: counsellors.join(', ') };
};

const printedRisks = ({ entries, linked }: Pick<ExportInput, 'entries' | 'linked'>) =>
	linked['risk-situations'] === undefined
		? undefined
		: situationsOf(linked['risk-situations']).filter((risk) => isPrinted(entries, risk.id));

const ratingOf = ({ m }: I18n, value: string): string => {
	const difficulty = difficultyOf(value);
	return difficulty ? m.riskSituations.difficulty[difficulty.value] : '';
};

const writeItems = (pdf: PdfWriter, { m }: I18n, items: Item[], withImportance: boolean) => {
	if (items.length === 0) {
		pdf.paragraph(m.emergencyKit.noEntries, { muted: true });
	}
	for (const item of items) {
		pdf.item(item.text, withImportance && item.importance ? importanceLabel(m, item.importance) : undefined);
	}
};

/** The whole Notfallkoffer: the seven sections in order, as in the client's overview. */
const writeKit = (pdf: PdfWriter, input: ExportInput) => {
	const { entries, i18n } = input;
	const { m, t } = i18n;
	const texts = m.emergencyKit;
	const heading = (id: SectionId) => pdf.heading(`${SECTION_NUMBERS[id]}. ${texts.sections[id].title}`);
	const listSection = (kind: ListKind) => {
		heading(kind);
		pdf.subheading(texts.sections[kind].listLabel);
		writeItems(pdf, i18n, itemsOf(entries, kind), kind === 'motivation');
	};
	listSection('motivation');
	listSection('strategy');

	heading('support');
	const trusted = trustedOf(entries);
	pdf.subheading(texts.myTrusted);
	if (trusted.length === 0) {
		pdf.paragraph(texts.pdf.noAnswer, { muted: true });
	}
	for (const person of trusted) {
		pdf.item(person.name);
	}
	const { agency, counsellors } = agencyLines(input);
	pdf.field(texts.myAgency, agency || texts.pdf.agencyMissing);
	if (counsellors) {
		pdf.field(texts.pdf.myCounsellor, counsellors);
	}
	const request = keyedOf(entries, REQUEST_KIND, SELF_HELP_REQUEST_KEY);
	pdf.field(texts.mySelfHelp, keyedText(entries, SELF_HELP_KIND) || texts.pdf.noAnswer);
	if (request) {
		const date = i18n.date(request.createdAt, { timeZone: 'Europe/Berlin' });
		pdf.paragraph(t(texts.pdf.requested, { date }), { muted: true });
	}

	listSection('critical');
	listSection('craving');

	const risks = printedRisks(input);
	const other = keyedText(entries, OTHER_STRATEGIES_KIND);
	if (risks !== undefined || other) {
		heading('risks');
		if (risks && risks.length > 0) {
			pdf.table(
				[
					{ label: texts.riskSituation, width: 3 },
					{ label: texts.rating, width: 1.2 },
					{ label: texts.controlStrategy, width: 3 }
				],
				risks.map((risk) => [risk.situation, ratingOf(i18n, risk.difficulty), risk.strategy])
			);
		}
		pdf.field(texts.otherStrategies, other || texts.pdf.noAnswer);
	}

	listSection('relapse');
};

const CARD = { width: 241, height: 153, gap: 12, padding: 10, footer: 14 };
const CARD_TEXT = { title: 9, line: 7.5, lineGap: 1, footer: 6.5 };
const CARD_WIDTH = CARD.width - 2 * CARD.padding;
const CARD_HEIGHT = CARD.height - 2 * CARD.padding - CARD.footer;

interface Card {
	title: string;
	lines: string[];
}

/** What a card side holds: section titles and their lines, in order. */
export type CardSide = Array<{ title: string; lines: string[] }>;

/**
 * The business cards: the sections for the critical moment first (craving, relapse), then whom to
 * call, the reasons to hold on and the risk situations picked for the printout.
 */
export const cardsOf = (input: ExportInput): Card[] => {
	const { entries, i18n } = input;
	const { m, t } = i18n;
	const texts = m.emergencyKit;
	const list = (kind: ListKind): Card => {
		const items = itemsOf(entries, kind);
		const ordered =
			kind === 'motivation' ? [...items].sort((a, b) => (a.importance ?? 2) - (b.importance ?? 2)) : items;
		return { title: texts.sections[kind].cardTitle, lines: ordered.map((item) => item.text) };
	};
	const { agency, counsellors } = agencyLines(input);
	const selfHelp = keyedText(entries, SELF_HELP_KIND);
	const support: Card = {
		title: texts.sections.support.title,
		lines: [
			...trustedOf(entries).map((person) => person.name),
			...(agency ? [agency.replace(/\s*\n\s*/g, ', ')] : []),
			...(counsellors ? [t(texts.counsellorsLine, { names: counsellors })] : []),
			...(selfHelp ? [t(texts.selfHelpLine, { text: selfHelp })] : [])
		]
	};
	const risks: Card = {
		title: texts.sections.risks.cardTitle,
		lines: [
			...(printedRisks(input) ?? []).map((risk) => {
				const rating = ratingOf(i18n, risk.difficulty);
				const situation = rating
					? t(texts.pdf.cardRiskRated, { situation: risk.situation, rating })
					: risk.situation;
				return risk.strategy
					? t(texts.pdf.cardRiskStrategy, { situation, strategy: risk.strategy })
					: situation;
			}),
			...(keyedText(entries, OTHER_STRATEGIES_KIND) ? [keyedText(entries, OTHER_STRATEGIES_KIND)] : [])
		]
	};
	return [list('craving'), list('relapse'), support, list('motivation'), risks].filter(
		(card) => card.lines.length > 0
	);
};

/**
 * Flows the sections over as many card sides as they need. A section that does not fit goes on with
 * its title marked as continued; a single line taller than a side is cut by the drawing.
 */
export const layoutCards = (
	cards: Card[],
	measure: (text: string, kind: 'title' | 'line') => number,
	continued: (title: string) => string,
	height = CARD_HEIGHT
): CardSide[] => {
	const sides: CardSide[] = [];
	let side: CardSide = [];
	let used = 0;
	for (const card of cards) {
		let section: CardSide[number] | null = null;
		let started = false;
		for (const line of card.lines) {
			const lineHeight = measure(`• ${line}`, 'line');
			const title = started ? continued(card.title) : card.title;
			const titleHeight = section ? 0 : measure(title, 'title');
			if (used > 0 && used + titleHeight + lineHeight > height) {
				sides.push(side);
				side = [];
				used = 0;
				section = null;
			}
			if (!section) {
				const sectionTitle = started ? continued(card.title) : card.title;
				section = { title: sectionTitle, lines: [] };
				side.push(section);
				used += measure(sectionTitle, 'title');
				started = true;
			}
			section.lines.push(line);
			used += lineHeight;
		}
	}
	if (side.length > 0) {
		sides.push(side);
	}
	return sides;
};

/** Strips of front and back (85 × 54 mm each) on A4: cut along the outline, fold at the dashed line. */
const writeCards = (pdf: PdfWriter, input: ExportInput) => {
	const cards = cardsOf(input);
	const { m, t } = input.i18n;
	const texts = m.emergencyKit.pdf;
	pdf.subheading(texts.cardsTitle);
	pdf.paragraph(texts.cardsHint, { muted: true });
	if (cards.length === 0) {
		pdf.paragraph(texts.cardsEmpty, { muted: true });
		return;
	}
	let sides: CardSide[] = [];
	pdf.drawing(0, (doc) => {
		sides = layoutCards(
			cards,
			(text, kind) =>
				kind === 'title'
					? doc.font('bold').fontSize(CARD_TEXT.title).heightOfString(text, { width: CARD_WIDTH }) + 3
					: doc
							.font('regular')
							.fontSize(CARD_TEXT.line)
							.heightOfString(text, { width: CARD_WIDTH, lineGap: CARD_TEXT.lineGap }) + 1,
			(title) => t(texts.cardContinued, { title })
		);
	});
	const total = Math.ceil(sides.length / 2);
	for (let index = 0; index < total; index += 1) {
		const pair = [sides[2 * index], sides[2 * index + 1]];
		pdf.drawing(CARD.height + CARD.gap, (doc, box) => {
			const x0 = box.x;
			const y0 = box.y;
			doc.save();
			doc
				.roundedRect(x0, y0, 2 * CARD.width, CARD.height, 6)
				.lineWidth(0.6)
				.strokeColor('#8a9599')
				.stroke();
			doc
				.moveTo(x0 + CARD.width, y0 + 4)
				.lineTo(x0 + CARD.width, y0 + CARD.height - 4)
				.dash(3, { space: 3 })
				.lineWidth(0.6)
				.strokeColor('#8a9599')
				.stroke();
			doc.restore();
			pair.forEach((side, column) => {
				if (!side) {
					return;
				}
				const x = x0 + column * CARD.width + CARD.padding;
				let y = y0 + CARD.padding;
				const bottom = y0 + CARD.padding + CARD_HEIGHT;
				for (const part of side) {
					doc.font('bold').fontSize(CARD_TEXT.title).fillColor('#225e65');
					doc.text(part.title, x, y, { width: CARD_WIDTH });
					y = doc.y + 2;
					doc.font('regular').fontSize(CARD_TEXT.line).fillColor('#1a1c1e');
					for (const line of part.lines) {
						doc.text(`• ${line}`, x, y, {
							width: CARD_WIDTH,
							height: Math.max(bottom - y, CARD_TEXT.line),
							ellipsis: true,
							lineGap: CARD_TEXT.lineGap
						});
						y = doc.y + 1;
					}
					y += 2;
				}
				doc
					.font('regular')
					.fontSize(CARD_TEXT.footer)
					.fillColor('#8a9599')
					.text(t(texts.cardNumber, { n: index + 1, total }), x, y0 + CARD.height - CARD.padding - 8, {
						width: CARD_WIDTH,
						align: 'right',
						lineBreak: false
					});
			});
		});
	}
};

export const emergencyKit: ServerTool = {
	id: 'emergency-kit',
	kinds: {
		...listKinds,
		[TRUSTED_KIND]: {
			schema: z.object({ name: z.string().trim().min(1).max(MAX_NAME_LENGTH) }),
			max: MAX_ITEMS
		},
		[SELF_HELP_KIND]: { schema: text(MAX_LONG_TEXT_LENGTH), keys: (key) => key === MAIN_KEY },
		[OTHER_STRATEGIES_KIND]: { schema: text(MAX_LONG_TEXT_LENGTH), keys: (key) => key === MAIN_KEY },
		[RISK_PRINT_KIND]: { schema: z.object({ print: z.boolean() }), keys: isEntryId },
		[REQUEST_KIND]: {
			schema: z.object({ requested: z.literal(true) }),
			keys: (key) => key === SELF_HELP_REQUEST_KEY,
			announce: selfHelpRequest
		}
	},
	reads: ['risk-situations'],
	counsellorNames: true,
	options: {
		agency: {
			type: 'string',
			title: 'Kontaktdaten der Beratungsstelle',
			description:
				'Name, Adresse, Telefonnummer, Webseite und Sprechzeiten; erscheinen im Notfallkoffer unter „Meine Beratungsstelle“. Am besten je Beratungsstelle eintragen.',
			maxLength: 1000,
			format: 'textarea',
			default: ''
		}
	},
	exportPdf: writeKit,
	clientExports: {
		kit: { title: ({ m }) => m.emergencyKit.pdf.title, write: writeKit },
		card: { title: ({ m }) => m.emergencyKit.pdf.title, bare: true, write: writeCards }
	},
	demo: ({ m }) => {
		const demo = m.emergencyKit.demo;
		return [
			...demo.motivations.map((text) => ({ kind: 'motivation', data: { text, importance: 1 } })),
			{ kind: 'strategy', data: { text: demo.strategy } },
			{ kind: TRUSTED_KIND, data: { name: demo.trusted } },
			{ kind: 'craving', data: { text: demo.craving } },
			{ kind: 'relapse', data: { text: demo.relapse } }
		];
	}
};
