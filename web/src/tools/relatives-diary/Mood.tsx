import { moodLabel, MOODS } from '../../../../shared/tools/relatives-diary.ts';

const MOUTHS: Record<number, string> = {
	1: 'M8 17c1.2-2.2 6.8-2.2 8 0',
	2: 'M8.5 16.2c1.4-1 5.6-1 7 0',
	3: 'M8.5 15.5h7',
	4: 'M8.5 14.8c1.4 1 5.6 1 7 0',
	5: 'M8 14c1.2 2.6 6.8 2.6 8 0'
};

const COLORS: Record<number, string> = {
	1: '#b3261e',
	2: '#c25e22',
	3: '#8a7a00',
	4: '#4f7f2a',
	5: '#1e6b2b'
};

export const MoodFace = ({ mood }: { mood: number }) => (
	<svg
		viewBox="0 0 24 24"
		aria-hidden
		fill="none"
		stroke={COLORS[mood]}
		strokeWidth={1.8}
		strokeLinecap="round"
	>
		<circle cx="12" cy="12" r="9.5" />
		<circle cx="9" cy="10" r="0.9" fill={COLORS[mood]} />
		<circle cx="15" cy="10" r="0.9" fill={COLORS[mood]} />
		<path d={MOUTHS[mood]} />
	</svg>
);

/** The mood of a day as a face with its label, or nothing. */
export const MoodIndicator = ({
	mood,
	withLabel = true
}: {
	mood: number | undefined;
	withLabel?: boolean;
}) =>
	mood ? (
		<span className="bt-mood" title={moodLabel(mood)}>
			<MoodFace mood={mood} />
			{withLabel ? moodLabel(mood) : <span className="bt-visually-hidden">{moodLabel(mood)}</span>}
		</span>
	) : null;

/** Five faces from "sehr schlecht" to "sehr gut" as radio buttons. */
export function MoodPicker({
	legend,
	value,
	onChange,
	name
}: {
	legend: string;
	value: number | undefined;
	onChange: (mood: number | undefined) => void;
	name: string;
}) {
	return (
		<fieldset className="bt-moods">
			<legend>{legend}</legend>
			{MOODS.map((option) => {
				const id = `${name}-${option.value}`;
				return (
					<span key={option.value}>
						<input
							type="radio"
							id={id}
							name={name}
							value={option.value}
							checked={value === option.value}
							onChange={() => onChange(option.value)}
							onClick={() => value === option.value && onChange(undefined)}
						/>
						<label htmlFor={id}>
							<MoodFace mood={option.value} />
							{option.label}
						</label>
					</span>
				);
			})}
		</fieldset>
	);
}
