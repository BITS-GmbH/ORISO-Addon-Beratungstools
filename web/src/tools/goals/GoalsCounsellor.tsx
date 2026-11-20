import { ANSWER_KIND, STEPS, type Answer } from '../../../../shared/tools/goals.ts';
import { formatDate, Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';

export function GoalsCounsellor({ entries, isNew, locale }: CounsellorViewProps) {
	const answers = new Map(entries.filter((e) => e.kind === ANSWER_KIND).map((e) => [e.key, e]));
	return (
		<div className="bt-entry">
			{STEPS.map((step) => {
				const entry = answers.get(step.id);
				return (
					<div key={step.id} className="bt-answer">
						<div className="bt-row bt-row--between">
							<strong>{step.counsellorLabel}</strong>
							{entry && isNew(entry) && <Pill tone="new">Neu</Pill>}
						</div>
						{entry ? (
							<>
								<p className="bt-pre">{(entry.data as Answer).text}</p>
								<p className="bt-muted bt-small">
									Zuletzt geändert am {formatDate(entry.updatedAt, locale, true)}
								</p>
							</>
						) : (
							<p className="bt-muted">Keine Angabe</p>
						)}
					</div>
				);
			})}
		</div>
	);
}
