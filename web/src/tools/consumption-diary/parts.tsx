import type { Entry } from '../../../../shared/api.ts';
import { itemLabel, type Phase, type TopicId } from '../../../../shared/tools/consumption-diary.ts';

export const PHASE_TITLES: Record<TopicId, string> = {
	alcohol: 'Alkohol: Konsumphase eintragen',
	cannabis: 'Cannabis: Konsum eintragen',
	gambling: 'Glücksspiele eintragen',
	media: 'Medienkonsum eintragen'
};

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
	return (
		<span className="bt-yesno" role="radiogroup" aria-label={label}>
			{(
				[
					[false, 'nein'],
					[true, 'ja']
				] as const
			).map(([option, text]) => (
				<button
					key={text}
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

/** "19:00 bis 22:30 Uhr" or nothing. */
export const timeRange = (phase: Phase): string => {
	const range = [phase.start, phase.end].filter(Boolean).join(' bis ');
	return range ? `${range} Uhr` : '';
};

/** One phase in a few words: time and what was consumed. */
export function PhaseSnippet({ phase }: { phase: Entry<Phase> }) {
	const { data } = phase;
	const when = timeRange(data);
	return (
		<span className="bt-item__text">
			{when && <strong>{when}: </strong>}
			{data.items.map((item) => itemLabel(data.topic, item)).join('; ') || 'Keine Angaben zum Konsum'}
		</span>
	);
}
