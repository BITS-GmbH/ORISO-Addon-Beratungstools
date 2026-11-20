import type { Entry } from '../../../../shared/api.ts';
import {
	importanceLabel,
	isPrinted,
	itemsOf,
	keyedText,
	OTHER_STRATEGIES_KIND,
	SELF_HELP_KIND,
	trustedOf,
	type SectionId
} from '../../../../shared/tools/emergency-kit.ts';
import type { SituationItem } from '../../../../shared/tools/risk-situations.ts';

const PREVIEW = 3;

export const ImportanceLabel = ({ value }: { value?: number }) =>
	value ? (
		<span className={`bt-pill bt-pill--${value === 1 ? 'shared' : 'neutral'}`}>{importanceLabel(value)}</span>
	) : null;

const linesOf = (
	section: SectionId,
	entries: Entry[],
	risks: SituationItem[] | undefined,
	agency: string
): string[] => {
	if (section === 'support') {
		const selfHelp = keyedText(entries, SELF_HELP_KIND);
		return [
			...trustedOf(entries).map((person) => person.name),
			...(agency ? [agency.split('\n')[0] ?? ''] : []),
			...(selfHelp ? [`Selbsthilfegruppe: ${selfHelp}`] : [])
		];
	}
	if (section === 'risks') {
		const other = keyedText(entries, OTHER_STRATEGIES_KIND);
		return [
			...(risks ?? []).filter((risk) => isPrinted(entries, risk.id)).map((risk) => risk.situation),
			...(other ? [other] : [])
		];
	}
	return itemsOf(entries, section).map((item) => item.text);
};

/** The first entries of a section on its tile. */
export function SectionPreview({
	section,
	entries,
	risks,
	agency
}: {
	section: SectionId;
	entries: Entry[];
	risks: SituationItem[] | undefined;
	agency: string;
}) {
	const lines = linesOf(section, entries, risks, agency);
	if (lines.length === 0) {
		return <span className="bt-kit-tile__empty">Noch keine Einträge</span>;
	}
	return (
		<span className="bt-kit-tile__lines">
			{lines.slice(0, PREVIEW).map((line, index) => (
				<span key={index} className="bt-kit-tile__line">
					{line}
				</span>
			))}
			{lines.length > PREVIEW && (
				<span className="bt-kit-tile__more">und {lines.length - PREVIEW} weitere</span>
			)}
		</span>
	);
}
