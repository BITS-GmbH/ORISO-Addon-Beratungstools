import { useState } from 'react';
import {
	addDays,
	formatDayLong,
	formatDayShort,
	formatWeek,
	localToday,
	weekDays,
	weekStart
} from '../../../../shared/days.ts';
import { useI18n } from '../../host.ts';
import { PlannedActivities } from '../../core/PlannedActivities.tsx';
import { Pill, WeekNav } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { MoodIndicator } from './Mood.tsx';
import { entriesByDay } from './RelativesClient.tsx';

type Mode = 'week' | 'all';

/** Read only: "Wochenansicht" with navigation between weeks, or "Alle Einträge", newest first. */
export function RelativesCounsellor({ entries, linked, isNew }: CounsellorViewProps) {
	const { m, lang } = useI18n();
	const texts = m.relativesDiary;
	const byDay = entriesByDay(entries);
	const days = [...byDay.keys()].sort();
	const today = localToday();
	const [mode, setMode] = useState<Mode>('week');
	const [monday, setMonday] = useState(() => weekStart(days[days.length - 1] ?? today));

	return (
		<div className="bt-stack">
			<div className="bt-navtabs" role="tablist">
				{(
					[
						['week', texts.weekView],
						['all', texts.allEntries]
					] as const
				).map(([value, label]) => (
					<button
						key={value}
						type="button"
						role="tab"
						className="bt-navtab"
						aria-selected={mode === value}
						onClick={() => setMode(value)}
					>
						{label}
					</button>
				))}
			</div>
			{mode === 'week' ? (
				<>
					<WeekNav
						label={formatWeek(monday, lang)}
						onPrevious={() => setMonday(addDays(monday, -7))}
						onNext={() => setMonday(addDays(monday, 7))}
						nextDisabled={addDays(monday, 7) > today}
					/>
					<div className="bt-stack bt-stack--tight">
						{weekDays(monday).map((day) => {
							const entry = byDay.get(day);
							const fresh = entry ? isNew(entry) : false;
							return (
								<div
									key={day}
									className={`bt-daytile${entry ? '' : ' bt-daytile--empty'}${fresh ? ' bt-daytile--new' : ''}`}
								>
									<div className="bt-row bt-row--between">
										<strong>{formatDayShort(day, lang)}</strong>
										<span className="bt-row">
											<MoodIndicator mood={entry?.data.mood} />
											{fresh && <Pill tone="new">{texts.new}</Pill>}
										</span>
									</div>
									{entry ? (
										entry.data.text && <p className="bt-pre">{entry.data.text}</p>
									) : (
										<span className="bt-muted bt-small">{texts.noEntryForDay}</span>
									)}
								</div>
							);
						})}
					</div>
					<PlannedActivities linked={linked} monday={monday} />
				</>
			) : days.length === 0 ? (
				<p className="bt-muted">{texts.noEntries}</p>
			) : (
				<ul className="bt-list">
					{[...days].reverse().map((day) => {
						const entry = byDay.get(day)!;
						const fresh = isNew(entry);
						return (
							<li key={day} className={`bt-entry${fresh ? ' bt-entry--new' : ''}`}>
								<div className="bt-stack bt-stack--tight">
									<div className="bt-row bt-row--between">
										<strong>{formatDayLong(day, lang)}</strong>
										<span className="bt-row">
											<MoodIndicator mood={entry.data.mood} />
											{fresh && <Pill tone="new">{texts.new}</Pill>}
										</span>
									</div>
									{entry.data.text && <p className="bt-pre">{entry.data.text}</p>}
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
