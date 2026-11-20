import { z } from 'zod';
import type { Behaviour } from '../../../../shared/tools/positive-perception.ts';
import {
	BEHAVIOUR_KIND,
	MAX_BEHAVIOUR_LENGTH,
	MAX_BEHAVIOURS
} from '../../../../shared/tools/positive-perception.ts';
import type { ServerTool } from '../types.ts';

export const behaviourSchema = z.object({ text: z.string().trim().min(1).max(MAX_BEHAVIOUR_LENGTH) });

export const positivePerception: ServerTool = {
	id: 'positive-perception',
	kinds: {
		[BEHAVIOUR_KIND]: { schema: behaviourSchema, max: MAX_BEHAVIOURS }
	},
	options: {
		intro: {
			type: 'string',
			title: 'Einführung',
			description: 'Ersetzt den Einführungstext der ersten Seite. Leer lassen für den Standardtext.',
			maxLength: 2000,
			format: 'textarea',
			default: ''
		}
	},
	exportPdf(pdf, { entries }) {
		const behaviours = entries.filter((e) => e.kind === BEHAVIOUR_KIND).map((e) => e.data as Behaviour);
		pdf.heading('Verhaltensweisen und Aktivitäten, die gelobt werden sollen');
		if (behaviours.length === 0) {
			pdf.paragraph('Noch keine Einträge.', { muted: true });
		}
		for (const behaviour of behaviours) {
			pdf.item(behaviour.text);
		}
	},
	demo: () => [
		{ kind: BEHAVIOUR_KIND, data: { text: 'Hat ohne Aufforderung den Tisch abgeräumt.' } },
		{ kind: BEHAVIOUR_KIND, data: { text: 'War am Wochenende beim Fußballtraining.' } }
	]
};
