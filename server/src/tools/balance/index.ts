import { z } from 'zod';
import type { Argument } from '../../../../shared/tools/balance.ts';
import {
	ARGUMENT_KIND,
	calculate,
	CATEGORIES,
	CATEGORY_IDS,
	CONCLUSION_KEY,
	CONCLUSION_KIND,
	formatValue,
	MAX_ARGUMENTS,
	MAX_CONCLUSION_LENGTH,
	MAX_TEXT_LENGTH,
	POLE_VARIANTS,
	polesOf,
	ratingLabel,
	tendency
} from '../../../../shared/tools/balance.ts';
import type { ServerTool } from '../types.ts';

export const argumentSchema = z.object({
	category: z.enum(['A', 'B', 'C', 'D']),
	text: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
	rating: z.number().int().min(0).max(3)
});

export const conclusionSchema = z.object({ text: z.string().trim().min(1).max(MAX_CONCLUSION_LENGTH) });

const PRO_COLOR = '#225e65';
const CONTRA_COLOR = '#c25e22';

const withSide = (label: string, side: string) => (label.includes(side) ? label : `${label} (${side})`);

export const balance: ServerTool = {
	id: 'balance',
	kinds: {
		[ARGUMENT_KIND]: { schema: argumentSchema, max: MAX_ARGUMENTS },
		[CONCLUSION_KIND]: { schema: conclusionSchema, keys: (key) => key === CONCLUSION_KEY }
	},
	options: {
		intro: {
			type: 'string',
			title: 'Einleitung',
			description: 'Steht auf der Startseite der Übung. Leer lassen für den Standardtext.',
			maxLength: 1500,
			format: 'textarea',
			default: ''
		},
		poles: {
			type: 'string',
			title: 'Beschriftung der Waage',
			description: 'Die Varianten aus der Tool-Beschreibung (CONTRA / PRO).',
			enum: POLE_VARIANTS,
			default: POLE_VARIANTS[0]
		}
	},
	exportPdf(pdf, { entries, options, i18n }) {
		const { m, t } = i18n;
		const texts = m.balance;
		const args = entries.filter((e) => e.kind === ARGUMENT_KIND).map((e) => e.data as Argument);
		const conclusion = entries.find((e) => e.kind === CONCLUSION_KIND)?.data as { text: string } | undefined;
		const result = calculate(args);
		const poles = polesOf(options.poles, m);

		pdf.heading(texts.pdf.result);
		pdf.drawing(64, (doc, { x, y, width }) => {
			const barY = y + 22;
			const gradient = doc.linearGradient(x, 0, x + width, 0);
			gradient.stop(0, PRO_COLOR).stop(0.5, '#e7eaec').stop(1, CONTRA_COLOR);
			doc.roundedRect(x, barY, width, 8, 4).fill(gradient);
			doc
				.font('bold')
				.fontSize(9)
				.fillColor(PRO_COLOR)
				.text(withSide(poles.pro, texts.sides.pro), x, y, { width: width / 2 });
			doc.fillColor(CONTRA_COLOR).text(withSide(poles.contra, texts.sides.contra), x + width / 2, y, {
				width: width / 2,
				align: 'right'
			});
			doc.font('regular').fontSize(8).fillColor('#545f63');
			doc.text('+10', x, barY + 14, { width: 40 });
			doc.text('0', x + width / 2 - 20, barY + 14, { width: 40, align: 'center' });
			doc.text('−10', x + width - 40, barY + 14, { width: 40, align: 'right' });
			if (result.value !== null) {
				const markerX = x + ((10 - result.value) / 20) * width;
				doc
					.circle(markerX, barY + 4, 8)
					.lineWidth(3)
					.fillAndStroke('#ffffff', '#1a1c1e');
			}
		});
		pdf.paragraph(
			result.value === null
				? texts.pdf.inactive
				: t(texts.pdf.summary, {
						value: formatValue(result.value, i18n),
						tendency: tendency(result.value, i18n),
						pro: t(texts.sidePoints, { side: texts.sides.pro, count: result.pro }),
						contra: t(texts.sidePoints, { side: texts.sides.contra, count: result.contra })
					})
		);

		pdf.heading(texts.pdf.conclusion);
		pdf.paragraph(conclusion?.text ?? texts.pdf.noConclusion, { muted: !conclusion });

		pdf.heading(texts.pdf.arguments);
		for (const category of CATEGORY_IDS) {
			pdf.subheading(
				t(texts.categoryWithSide, {
					category: texts.categories[category].long,
					side: texts.sides[CATEGORIES[category].side]
				})
			);
			const items = args.filter((arg) => arg.category === category);
			if (items.length === 0) {
				pdf.paragraph(texts.pdf.noEntries, { muted: true });
			}
			for (const item of items) {
				pdf.item(item.text, t(texts.pdf.rating, { label: ratingLabel(item.rating, m), count: item.rating }));
			}
			pdf.spacer(4);
		}
	}
};
