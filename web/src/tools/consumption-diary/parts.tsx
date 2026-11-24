import type { Entry } from '../../../../shared/api.ts';
import { itemLabel, timeRange, type Phase } from '../../../../shared/tools/consumption-diary.ts';
import { useI18n } from '../../host.ts';

/** "nein / ja" as two radio buttons, compact enough for the week grid. */
export function YesNo({
	label,
	value,
	onChange,
	disabled
}: {
	label: string;
	value: boolean | null;
	onChange: (value: boolean) => void;
	disabled?: boolean;
}) {
	const { m } = useI18n();
	return (
		<span className="bt-yesno" role="radiogroup" aria-label={label}>
			{(
				[
					[false, m.consumptionDiary.no],
					[true, m.consumptionDiary.yes]
				] as const
			).map(([option, text]) => (
				<button
					key={String(option)}
					type="button"
					role="radio"
					aria-checked={value === option}
					disabled={disabled}
					onClick={() => onChange(option)}
				>
					{text}
				</button>
			))}
		</span>
	);
}

/** One phase in a few words: time and what was consumed. */
export function PhaseSnippet({ phase }: { phase: Entry<Phase> }) {
	const i18n = useI18n();
	const texts = i18n.m.consumptionDiary.phase;
	const { data } = phase;
	const when = timeRange(data, i18n);
	return (
		<span className="bt-item__text">
			{when && <strong>{i18n.t(texts.when, { time: when })} </strong>}
			{data.items.map((item) => itemLabel(data.topic, item, i18n)).join('; ') || texts.noItems}
		</span>
	);
}
