import { activitiesOf } from '../../../../shared/activities.ts';
import { formatDayLong, localToday } from '../../../../shared/days.ts';
import { nextLabel } from '../../../../shared/tools/active.ts';
import { useI18n } from '../../host.ts';
import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';

/** Read only: the planned activities with their next date, repetition and companion. */
export function ActiveCounsellor({ entries, isNew }: CounsellorViewProps) {
	const i18n = useI18n();
	const { lang, t } = i18n;
	const texts = i18n.m.active;
	const labels = texts.counsellor;
	const activities = activitiesOf(entries);
	const today = localToday();
	if (activities.length === 0) {
		return <p className="bt-muted">{texts.empty}</p>;
	}
	return (
		<ul className="bt-list" aria-label={texts.listTitle}>
			{activities.map((entry) => {
				const { data } = entry;
				const fresh = isNew(entry);
				return (
					<li key={entry.id} className={`bt-entry${fresh ? ' bt-entry--new' : ''}`}>
						<div className="bt-row bt-row--between" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
							<strong className="bt-item__text">{data.title}</strong>
							{fresh && <Pill tone="new">{labels.new}</Pill>}
						</div>
						<dl className="bt-details">
							<dt>{labels.next}</dt>
							<dd>{nextLabel(data, today, i18n)}</dd>
							<dt>{labels.repeat}</dt>
							<dd>
								{data.repeat === 'custom' && data.dates?.length
									? t(labels.repeatWithDates, {
											repeat: texts.repeatOptions[data.repeat],
											dates: [data.date, ...data.dates]
												.filter((day): day is string => Boolean(day))
												.map((day) => formatDayLong(day, lang))
												.join('; ')
										})
									: texts.repeatOptions[data.repeat]}
							</dd>
							<dt>{labels.companion}</dt>
							<dd>{data.companion ?? '–'}</dd>
							<dt>{labels.lastChanged}</dt>
							<dd>{i18n.date(entry.updatedAt, { withTime: true })}</dd>
						</dl>
					</li>
				);
			})}
		</ul>
	);
}
