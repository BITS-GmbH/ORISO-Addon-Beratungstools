import type { Entry } from '../api.ts';
import { localized, type Messages } from '../i18n/index.ts';

export const MAX_TEXT_LENGTH = 500;
export const MAX_NAME_LENGTH = 200;
export const MAX_LONG_TEXT_LENGTH = 2000;
export const MAX_ITEMS = 50;

export const TRUSTED_KIND = 'trusted';
export const SELF_HELP_KIND = 'self-help';
export const REQUEST_KIND = 'request';
export const RISK_PRINT_KIND = 'risk-print';
export const OTHER_STRATEGIES_KIND = 'other-strategies';
export const MAIN_KEY = 'main';
export const SELF_HELP_REQUEST_KEY = 'self-help-group';
export const NAKOS_URL = 'https://www.nakos.de/adressen/rot/';

export type ListKind = 'motivation' | 'strategy' | 'critical' | 'craving' | 'relapse';
export const LIST_KINDS: ListKind[] = ['motivation', 'strategy', 'critical', 'craving', 'relapse'];

export type SectionId = ListKind | 'support' | 'risks';

/** "Wie wichtig für mich?" of a motivation; labels in `emergencyKit.importance`. */
export const IMPORTANCE = [
	{ value: 1, key: 'veryImportant' },
	{ value: 2, key: 'important' }
] as const;

export const importanceLabel = (m: Messages, value: number): string => {
	const key = IMPORTANCE.find((i) => i.value === value)?.key;
	return key ? m.emergencyKit.importance[key] : '';
};

/** Number of each section on the overview; texts in `emergencyKit.sections.<id>`. */
export const SECTION_NUMBERS: Record<SectionId, number> = {
	motivation: 1,
	strategy: 2,
	support: 3,
	critical: 4,
	craving: 5,
	risks: 6,
	relapse: 7
};

/** The seven sections of the overview, in order. */
export const SECTION_ORDER: SectionId[] = [
	'motivation',
	'strategy',
	'support',
	'critical',
	'craving',
	'risks',
	'relapse'
];

/** The pre-written message to the counsellors when the client asks for a self-help group. */
export const selfHelpRequest = (username: string) => ({
	title: localized(({ m }) => m.emergencyKit.request.title),
	text: localized(({ m, t }) =>
		username ? t(m.emergencyKit.request.text, { name: username }) : m.emergencyKit.request.textUnnamed
	)
});

export interface ListItem {
	text: string;
	importance?: number;
}

export type Item = ListItem & { id: string; entry: Entry };

export const itemsOf = (entries: Entry[], kind: ListKind): Item[] =>
	entries.filter((e) => e.kind === kind).map((e) => ({ ...(e.data as ListItem), id: e.id, entry: e }));

export const trustedOf = (entries: Entry[]): Array<{ id: string; name: string; entry: Entry }> =>
	entries
		.filter((e) => e.kind === TRUSTED_KIND)
		.map((e) => ({ name: (e.data as { name: string }).name, id: e.id, entry: e }));

export const keyedOf = (entries: Entry[], kind: string, key = MAIN_KEY): Entry | undefined =>
	entries.find((e) => e.kind === kind && e.key === key);

export const keyedText = (entries: Entry[], kind: string): string =>
	(keyedOf(entries, kind)?.data as { text?: string } | undefined)?.text ?? '';

/** "Für Ausdruck übernehmen?": a risk situation goes into the PDFs unless the client said no. */
export const isPrinted = (entries: Entry[], situationId: string): boolean =>
	(keyedOf(entries, RISK_PRINT_KIND, situationId)?.data as { print?: boolean } | undefined)?.print !== false;

/** Sections with nothing in them, for the question before the PDF of the whole kit. */
export const emptySections = (
	entries: Entry[],
	agency: string,
	risks: Array<{ id: string }> | undefined
): SectionId[] =>
	SECTION_ORDER.filter((id) => {
		if (id === 'support') {
			return !agency && trustedOf(entries).length === 0 && !keyedText(entries, SELF_HELP_KIND);
		}
		if (id === 'risks') {
			return (
				risks !== undefined &&
				!keyedText(entries, OTHER_STRATEGIES_KIND) &&
				!risks.some((risk) => isPrinted(entries, risk.id))
			);
		}
		return itemsOf(entries, id).length === 0;
	});
