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
import type { I18n } from '../../../../shared/i18n/index.ts';
import type { SituationItem } from '../../../../shared/tools/risk-situations.ts';
import { useI18n } from '../../host.ts';

const PREVIEW = 3;

export function ImportanceLabel({ value }: { value?: number }) {
	const { m } = useI18n();
	return value ? (
		<span className={`bt-pill bt-pill--${value === 1 ? 'shared' : 'neutral'}`}>
			{importanceLabel(m, value)}
		</span>
	) : null;
}

const linesOf = (
	{ m, t }: I18n,
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
			...(selfHelp ? [t(m.emergencyKit.selfHelpLine, { text: selfHelp })] : [])
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
	const i18n = useI18n();
	const { m, t } = i18n;
	const lines = linesOf(i18n, section, entries, risks, agency);
	if (lines.length === 0) {
		return <span className="bt-kit-tile__empty">{m.emergencyKit.previewEmpty}</span>;
	}
	return (
		<span className="bt-kit-tile__lines">
			{lines.slice(0, PREVIEW).map((line, index) => (
				<span key={index} className="bt-kit-tile__line">
					{line}
				</span>
			))}
			{lines.length > PREVIEW && (
				<span className="bt-kit-tile__more">
					{t(m.emergencyKit.previewMore, { count: lines.length - PREVIEW })}
				</span>
			)}
		</span>
	);
}
