import { difficultyOf, RELAPSE_QUESTIONS, type Relapse } from '../../../../shared/tools/risk-situations.ts';

/** The difficulty as text with one to four filled bars. */
export function DifficultyBadge({ value }: { value: string }) {
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
			{difficulty.label}
		</span>
	);
}

export function RelapseDetails({ relapse }: { relapse: Relapse }) {
	return (
		<dl className="bt-details bt-details--stacked">
			{RELAPSE_QUESTIONS.map((question) => (
				<div key={question.id}>
					<dt>{question.counsellorLabel}</dt>
					<dd className="bt-pre">{relapse[question.id] || 'Keine Angabe'}</dd>
				</div>
			))}
			<div>
				<dt>Zuvor eingetragene Kontrollstrategie</dt>
				<dd className="bt-pre">{relapse.previousStrategy || 'Keine Angabe'}</dd>
			</div>
			<div>
				<dt>Neue Kontrollstrategie</dt>
				<dd className="bt-pre">{relapse.newStrategy || 'Keine Angabe'}</dd>
			</div>
		</dl>
	);
}
