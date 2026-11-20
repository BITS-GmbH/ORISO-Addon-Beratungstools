import { activitiesOf, REPEAT_LABELS } from '../../../../shared/activities.ts';
import { formatDayLong, localToday } from '../../../../shared/days.ts';
import { nextLabel } from '../../../../shared/tools/active.ts';
import { formatDate, Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';

/** Read only: the planned activities with their next date, repetition and companion. */
export function ActiveCounsellor({ entries, isNew, locale }: CounsellorViewProps) {
	const activities = activitiesOf(entries);
	const today = localToday();
	if (activities.length === 0) {
		return <p className="bt-muted">Noch keine Aktivitäten eingetragen.</p>;
	}
	return (
		<ul className="bt-list" aria-label="Eingetragene Aktivitäten">
			{activities.map((entry) => {
				const { data } = entry;
				const fresh = isNew(entry);
				return (
					<li key={entry.id} className={`bt-entry${fresh ? ' bt-entry--new' : ''}`}>
						<div className="bt-row bt-row--between" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
							<strong className="bt-item__text">{data.title}</strong>
							{fresh && <Pill tone="new">Neu</Pill>}
						</div>
						<dl className="bt-details">
							<dt>Nächster Termin</dt>
							<dd>{nextLabel(data, today)}</dd>
							<dt>Wiederholung</dt>
							<dd>
								{REPEAT_LABELS[data.repeat]}
								{data.repeat === 'custom' && data.dates?.length
									? `: ${[data.date, ...data.dates]
											.filter((day): day is string => Boolean(day))
											.map(formatDayLong)
											.join('; ')}`
									: ''}
							</dd>
							<dt>Begleitung</dt>
							<dd>{data.companion ?? '–'}</dd>
							<dt>Zuletzt geändert</dt>
							<dd>{formatDate(entry.updatedAt, locale, true)}</dd>
						</dl>
					</li>
				);
			})}
		</ul>
	);
}
