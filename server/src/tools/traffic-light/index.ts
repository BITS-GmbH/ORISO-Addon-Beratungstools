import { z } from 'zod';
import type { Activity } from '../../../../shared/tools/traffic-light.ts';
import {
	ACTIVITY_KIND,
	LEVEL_VALUES,
	LEVELS,
	MAX_ACTIVITIES,
	MAX_ACTIVITY_LENGTH
} from '../../../../shared/tools/traffic-light.ts';
import type { ServerTool } from '../types.ts';

export const activitySchema = z.object({
	text: z.string().trim().min(1).max(MAX_ACTIVITY_LENGTH),
	level: z.union([z.literal(3), z.literal(2), z.literal(1)])
});

const PDF_COLOURS = { red: '#c62828', yellow: '#f2b600', green: '#2e7d32' } as const;

export const trafficLight: ServerTool = {
	id: 'traffic-light',
	kinds: {
		[ACTIVITY_KIND]: { schema: activitySchema, max: MAX_ACTIVITIES }
	},
	options: {
		intro: {
			type: 'string',
			title: 'Einleitung',
			description: 'Steht über der Anleitung. Leer lassen für den Standardtext.',
			maxLength: 1500,
			format: 'textarea',
			default: ''
		}
	},
	exportPdf(pdf, { entries }) {
		const activities = entries.filter((e) => e.kind === ACTIVITY_KIND).map((e) => e.data as Activity);
		if (activities.length === 0) {
			pdf.paragraph('Noch keine Aktivitäten eingetragen.', { muted: true });
			return;
		}
		for (const level of LEVEL_VALUES) {
			const { colour, colourName, danger } = LEVELS[level];
			pdf.drawing(20, (doc, { x, y }) => {
				doc.circle(x + 7, y + 8, 7).fill(PDF_COLOURS[colour]);
				doc
					.font('bold')
					.fontSize(11)
					.fillColor('#1a1c1e')
					.text(`${colourName}: ${danger} (${level})`, x + 22, y + 2);
			});
			const items = activities.filter((activity) => activity.level === level);
			if (items.length === 0) {
				pdf.paragraph('Keine Aktivitäten.', { muted: true });
			}
			for (const item of items) {
				pdf.item(item.text);
			}
			pdf.spacer(6);
		}
	},
	demo: () => [
		{ kind: ACTIVITY_KIND, data: { text: 'Ein Computerspiel spielen', level: 3 } },
		{ kind: ACTIVITY_KIND, data: { text: 'Instagram', level: 2 } },
		{ kind: ACTIVITY_KIND, data: { text: 'E-Mails schreiben', level: 1 } }
	]
};
