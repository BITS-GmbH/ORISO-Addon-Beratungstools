import { z } from 'zod';
import {
	importanceLabel,
	isPrinted,
	itemsOf,
	keyedOf,
	keyedText,
	LIST_KINDS,
	LIST_SECTIONS,
	MAIN_KEY,
	MAX_ITEMS,
	MAX_LONG_TEXT_LENGTH,
	MAX_NAME_LENGTH,
	MAX_TEXT_LENGTH,
	OTHER_STRATEGIES_KIND,
	OTHER_STRATEGIES_LABEL,
	REQUEST_KIND,
	RISK_PRINT_KIND,
	RISKS_TITLE,
	SELF_HELP_KIND,
	SELF_HELP_REQUEST_KEY,
	selfHelpRequest,
	SUPPORT_TITLE,
	TRUSTED_KIND,
	trustedOf,
	type Item,
	type ListKind
} from '../../../../shared/tools/emergency-kit.ts';
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

const formatDay = (iso: string) =>
	new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeZone: 'Europe/Berlin' }).format(new Date(iso));

const AGENCY_FALLBACK = 'Die Kontaktdaten Ihrer Beratungsstelle sind hier noch nicht hinterlegt.';

const agencyLines = ({ options, counsellors }: Pick<ExportInput, 'options' | 'counsellors'>) => {
	const agency = typeof options.agency === 'string' ? options.agency.trim() : '';
	return { agency, counsellors: counsellors.join(', ') };
};

const printedRisks = ({ entries, linked }: Pick<ExportInput, 'entries' | 'linked'>) =>
	linked['risk-situations'] === undefined
		? undefined
		: situationsOf(linked['risk-situations']).filter((risk) => isPrinted(entries, risk.id));

const writeItems = (pdf: PdfWriter, items: Item[], withImportance: boolean) => {
	if (items.length === 0) {
		pdf.paragraph('Keine Einträge.', { muted: true });
	}
	for (const item of items) {
		pdf.item(item.text, withImportance && item.importance ? importanceLabel(item.importance) : undefined);
	}
};

/** The whole Notfallkoffer: the seven sections in order, as in the client's overview. */
const writeKit = (pdf: PdfWriter, input: ExportInput) => {
	const { entries } = input;
	const listSection = (kind: ListKind) => {
		const section = LIST_SECTIONS[kind];
		pdf.heading(`${section.number}. ${section.title}`);
		pdf.subheading(section.listLabel);
		writeItems(pdf, itemsOf(entries, kind), kind === 'motivation');
	};
	listSection('motivation');
	listSection('strategy');

	pdf.heading(`3. ${SUPPORT_TITLE}`);
	const trusted = trustedOf(entries);
	pdf.subheading('Meine Vertrauensperson(en)');
	if (trusted.length === 0) {
		pdf.paragraph('Keine Angabe', { muted: true });
	}
	for (const person of trusted) {
		pdf.item(person.name);
	}
	const { agency, counsellors } = agencyLines(input);
	pdf.field('Meine Beratungsstelle', agency || AGENCY_FALLBACK);
	if (counsellors) {
		pdf.field('Meine Beraterin / mein Berater', counsellors);
	}
	const request = keyedOf(entries, REQUEST_KIND, SELF_HELP_REQUEST_KEY);
	pdf.field('Meine Selbsthilfegruppe', keyedText(entries, SELF_HELP_KIND) || 'Keine Angabe');
	if (request) {
		pdf.paragraph(`Empfehlung einer Selbsthilfegruppe angefragt am ${formatDay(request.createdAt)}.`, {
			muted: true
		});
	}

	listSection('critical');
	listSection('craving');

	const risks = printedRisks(input);
	const other = keyedText(entries, OTHER_STRATEGIES_KIND);
	if (risks !== undefined || other) {
		pdf.heading(`6. ${RISKS_TITLE}`);
		if (risks && risks.length > 0) {
			pdf.table(
				[
					{ label: 'Risikosituation', width: 3 },
					{ label: 'Bewertung', width: 1.2 },
					{ label: 'Kontrollstrategie', width: 3 }
				],
				risks.map((risk) => [risk.situation, difficultyOf(risk.difficulty)?.label ?? '', risk.strategy])
			);
		}
		pdf.field(OTHER_STRATEGIES_LABEL, other || 'Keine Angabe');
	}

	listSection('relapse');
};

const CARD = { width: 241, height: 153, gap: 12 };

interface Card {
	title: string;
	lines: string[];
}

export const cardsOf = (input: ExportInput): Card[] => {
	const { entries } = input;
	const list = (kind: ListKind): Card => {
		const items = itemsOf(entries, kind);
		const ordered =
			kind === 'motivation' ? [...items].sort((a, b) => (a.importance ?? 2) - (b.importance ?? 2)) : items;
		return { title: LIST_SECTIONS[kind].cardTitle, lines: ordered.map((item) => item.text) };
	};
	const { agency, counsellors } = agencyLines(input);
	const selfHelp = keyedText(entries, SELF_HELP_KIND);
	const support: Card = {
		title: 'Hier bekomme ich Unterstützung',
		lines: [
			...trustedOf(entries).map((person) => person.name),
			...(agency ? [agency.replace(/\s*\n\s*/g, ', ')] : []),
			...(counsellors ? [`Beratung: ${counsellors}`] : []),
			...(selfHelp ? [`Selbsthilfegruppe: ${selfHelp}`] : [])
		]
	};
	const risks: Card = {
		title: 'Risikosituationen & Strategien',
		lines: [
			...(printedRisks(input) ?? []).map((risk) => {
				const rating = difficultyOf(risk.difficulty)?.label;
				const situation = rating ? `${risk.situation} (Bewertung: ${rating})` : risk.situation;
				return risk.strategy ? `${situation}: ${risk.strategy}` : situation;
			}),
			...(keyedText(entries, OTHER_STRATEGIES_KIND) ? [keyedText(entries, OTHER_STRATEGIES_KIND)] : [])
		]
	};
	return [
		list('motivation'),
		list('craving'),
		support,
		list('relapse'),
		list('critical'),
		list('strategy'),
		risks
	].filter((card) => card.lines.length > 0);
};

/** Cards of 85 × 54 mm on A4 with dashed cut lines, one per section with entries. */
const writeCards = (pdf: PdfWriter, input: ExportInput) => {
	const cards = cardsOf(input);
	pdf.subheading('Mein Notfallkoffer im Visitenkartenformat');
	pdf.paragraph('Zum Ausschneiden an den gestrichelten Linien und zum Mitnehmen.', { muted: true });
	if (cards.length === 0) {
		pdf.paragraph('Noch keine Einträge.', { muted: true });
		return;
	}
	for (let index = 0; index < cards.length; index += 2) {
		const row = cards.slice(index, index + 2);
		pdf.drawing(CARD.height + CARD.gap, (doc, box) => {
			row.forEach((card, column) => {
				const x = box.x + column * (CARD.width + CARD.gap);
				const y = box.y;
				doc.save();
				doc
					.roundedRect(x, y, CARD.width, CARD.height, 6)
					.dash(3, { space: 3 })
					.lineWidth(0.6)
					.strokeColor('#8a9599')
					.stroke();
				doc.restore();
				doc
					.font('bold')
					.fontSize(9)
					.fillColor('#225e65')
					.text(card.title, x + 10, y + 9, { width: CARD.width - 20, lineBreak: false, ellipsis: true });
				doc
					.font('regular')
					.fontSize(7.5)
					.fillColor('#1a1c1e')
					.text(card.lines.map((line) => `• ${line}`).join('\n'), x + 10, y + 24, {
						width: CARD.width - 20,
						height: CARD.height - 32,
						ellipsis: true,
						lineGap: 1
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
		kit: { title: () => 'Mein Notfallkoffer', write: writeKit },
		card: { title: () => 'Mein Notfallkoffer', bare: true, write: writeCards }
	},
	demo: () => [
		{ kind: 'motivation', data: { text: 'Endlich wieder frei sein', importance: 1 } },
		{
			kind: 'motivation',
			data: { text: 'Ich kann meinen Kindern wieder in die Augen sehen', importance: 1 }
		},
		{ kind: 'strategy', data: { text: 'Ich treibe regelmäßig Sport' } },
		{ kind: TRUSTED_KIND, data: { name: 'Anna (Schwester)' } },
		{ kind: 'craving', data: { text: 'Ich rufe sofort meine Vertrauensperson an' } },
		{ kind: 'relapse', data: { text: 'Ich gebe nicht auf!' } }
	]
};
