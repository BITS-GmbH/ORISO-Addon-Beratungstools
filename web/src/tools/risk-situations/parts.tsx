import { difficultyOf, RELAPSE_ANSWERS, type Relapse } from '../../../../shared/tools/risk-situations.ts';
import { useI18n } from '../../host.ts';

/** The difficulty as text with one to four filled bars. */
export function DifficultyBadge({ value }: { value: string }) {
	const { m } = useI18n();
	const difficulty = difficultyOf(value);
	if (!difficulty) {
		return null;
	}
	return (
		<span className={`bt-level bt-level--${difficulty.level}`}>
			<span className="bt-level__bars" aria-hidden>
				{[1, 2, 3, 4].map((n) => (
					<span key={n} className={n <= difficulty.level ? 'is-on' : undefined} />
				))}
			</span>
			{m.riskSituations.difficulty[difficulty.value]}
		</span>
	);
}

export function RelapseDetails({ relapse }: { relapse: Relapse }) {
	const texts = useI18n().m.riskSituations;
	return (
		<dl className="bt-details bt-details--stacked">
			{RELAPSE_ANSWERS.map((id) => (
				<div key={id}>
					<dt>{texts.answers[id]}</dt>
					<dd className="bt-pre">{relapse[id] || texts.noAnswer}</dd>
				</div>
			))}
			<div>
				<dt>{texts.previousStrategy}</dt>
				<dd className="bt-pre">{relapse.previousStrategy || texts.noAnswer}</dd>
			</div>
			<div>
				<dt>{texts.newStrategy}</dt>
				<dd className="bt-pre">{relapse.newStrategy || texts.noAnswer}</dd>
			</div>
		</dl>
	);
}

/** A text with one `{title}` placeholder, the title shown in bold. */
export function WithTitle({ text, title }: { text: string; title: string }) {
	const [before, after = ''] = text.split('{title}');
	return (
		<>
			{before}
			<strong>{title}</strong>
			{after}
		</>
	);
}
