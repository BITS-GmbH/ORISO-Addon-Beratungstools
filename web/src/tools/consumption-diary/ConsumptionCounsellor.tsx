import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	addDays,
	formatDayLong,
	formatDayShort,
	formatWeek,
	localToday,
	weekDays,
	weekStart
} from '../../../../shared/days.ts';
import {
	consumedOn,
	daySum,
	diaryOf,
	phasesOn,
	summaryKey,
	TOPICS,
	type DiaryData
} from '../../../../shared/tools/consumption-diary.ts';
import { PlannedActivities } from '../../core/PlannedActivities.tsx';
import { Pill, WeekNav } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { PhaseSnippet } from './parts.tsx';

const entriesOn = (diary: DiaryData, day: string): Entry[] => [
	...diary.phases.filter((phase) => phase.day === day),
	...[...diary.summaries.values()].filter((summary) => summary.day === day)
];

/**
 * Read only (section 2.2, counsellors): a week of day tiles from Monday to Sunday with the sums
 * per topic, and the details of a chosen day below.
 */
export function ConsumptionCounsellor({ entries, linked, isNew }: CounsellorViewProps) {
	const diary = diaryOf(entries);
	const today = localToday();
	const days = [...diary.phases.map((e) => e.day), ...[...diary.summaries.values()].map((e) => e.day)]
		.filter((day): day is string => Boolean(day))
		.sort();
	const [monday, setMonday] = useState(() => weekStart(days[days.length - 1] ?? today));
	const [selected, setSelected] = useState<string | null>(null);

	if (diary.topics.length === 0) {
		return <p className="bt-muted">Noch keine Einträge.</p>;
	}

	return (
		<div className="bt-stack">
			<p className="bt-muted bt-small">
				Dokumentierte Themen:{' '}
				{(diary.chosen.length ? diary.chosen : diary.topics).map((id) => TOPICS[id].label).join(', ')}
			</p>
			<WeekNav
				label={formatWeek(monday)}
				onPrevious={() => {
					setMonday(addDays(monday, -7));
					setSelected(null);
				}}
				onNext={() => {
					setMonday(addDays(monday, 7));
					setSelected(null);
				}}
				nextDisabled={addDays(monday, 7) > today}
			/>
			<div className="bt-daytiles">
				{weekDays(monday).map((day) => {
					const fresh = entriesOn(diary, day).some(isNew);
					const answered = diary.topics.filter((topic) => consumedOn(diary, day, topic) !== null);
					return (
						<button
							key={day}
							type="button"
							className={`bt-daytile${answered.length ? '' : ' bt-daytile--empty'}${fresh ? ' bt-daytile--new' : ''}`}
							aria-pressed={selected === day}
							disabled={answered.length === 0}
							onClick={() => setSelected(selected === day ? null : day)}
						>
							<span className="bt-row bt-row--between">
								<strong>{formatDayShort(day)}</strong>
								{fresh && <Pill tone="new">Neu</Pill>}
							</span>
							{answered.length === 0 ? (
								<span className="bt-muted bt-small">Keine Einträge</span>
							) : (
								diary.topics.map((topic) => {
									const consumed = consumedOn(diary, day, topic);
									return (
										<span key={topic} className="bt-small">
											<strong>{TOPICS[topic].label}:</strong>{' '}
											{consumed === null
												? '–'
												: consumed
													? daySum(
															topic,
															phasesOn(diary, day, topic).map((phase) => phase.data)
														)
													: 'Kein Konsum eingetragen'}
										</span>
									);
								})
							)}
						</button>
					);
				})}
			</div>
			{selected && <DayDetails diary={diary} day={selected} isNew={isNew} />}
			<PlannedActivities linked={linked} monday={monday} />
		</div>
	);
}

function DayDetails({
	diary,
	day,
	isNew
}: {
	diary: DiaryData;
	day: string;
	isNew: (entry: Entry) => boolean;
}) {
	return (
		<section className="bt-entry bt-stack" aria-label={`Einträge vom ${formatDayLong(day)}`}>
			<h3 className="bt-title">{formatDayLong(day)}</h3>
			{diary.topics.map((topic) => {
				const consumed = consumedOn(diary, day, topic);
				if (consumed === null) {
					return null;
				}
				const phases = phasesOn(diary, day, topic);
				const summary = diary.summaries.get(summaryKey(day, topic));
				return (
					<div key={topic} className="bt-answer">
						<strong>
							{TOPICS[topic].label}: {consumed ? 'ja' : 'nein'}
						</strong>
						{phases.map((phase) => (
							<div key={phase.id} className="bt-stack bt-stack--tight" style={{ paddingLeft: 12 }}>
								<div
									className="bt-row bt-row--between"
									style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}
								>
									<PhaseSnippet phase={phase} />
									{isNew(phase) && <Pill tone="new">Neu</Pill>}
								</div>
								<dl className="bt-details">
									{phase.data.topic === 'media' && phase.data.device && (
										<>
											<dt>Endgerät</dt>
											<dd>{phase.data.device}</dd>
										</>
									)}
									<dt>Wo und mit wem</dt>
									<dd>{phase.data.context ?? '–'}</dd>
									<dt>Grund/Auslöser</dt>
									<dd>{phase.data.trigger ?? '–'}</dd>
								</dl>
							</div>
						))}
						{summary && (summary.data.rating || summary.data.plan) && (
							<dl className="bt-details">
								<dt>Bewertung des Tages</dt>
								<dd className="bt-pre">{summary.data.rating ?? '–'}</dd>
								<dt>Vorhaben für morgen</dt>
								<dd className="bt-pre">{summary.data.plan ?? '–'}</dd>
							</dl>
						)}
						{summary && isNew(summary) && (
							<div>
								<Pill tone="new">Resümee neu</Pill>
							</div>
						)}
					</div>
				);
			})}
		</section>
	);
}
