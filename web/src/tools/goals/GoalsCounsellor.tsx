import { ANSWER_KIND, STEP_IDS, type Answer } from '../../../../shared/tools/goals.ts';
import { useI18n } from '../../host.ts';
import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';

export function GoalsCounsellor({ entries, isNew }: CounsellorViewProps) {
	const i18n = useI18n();
	const texts = i18n.m.goals;
	const answers = new Map(entries.filter((e) => e.kind === ANSWER_KIND).map((e) => [e.key, e]));
	return (
		<div className="bt-entry">
			{STEP_IDS.map((id) => {
				const entry = answers.get(id);
				return (
					<div key={id} className="bt-answer">
						<div className="bt-row bt-row--between">
							<strong>{texts.steps[id].counsellorLabel}</strong>
							{entry && isNew(entry) && <Pill tone="new">{texts.new}</Pill>}
						</div>
						{entry ? (
							<>
								<p className="bt-pre">{(entry.data as Answer).text}</p>
								<p className="bt-muted bt-small">
									{i18n.t(texts.lastChanged, { date: i18n.date(entry.updatedAt, { withTime: true }) })}
								</p>
							</>
						) : (
							<p className="bt-muted">{texts.noAnswer}</p>
						)}
					</div>
				);
			})}
		</div>
	);
}
