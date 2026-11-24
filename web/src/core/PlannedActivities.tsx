import type { Entry } from '../../../shared/api.ts';
import type { ToolId } from '../../../shared/catalog.ts';
import { ACTIVITY_TOOL, occurrencesBetween } from '../../../shared/activities.ts';
import { addDays, formatDayShort } from '../../../shared/days.ts';
import { useI18n } from '../host.ts';

/**
 * "Geplante Aktivitäten diese Woche" in the diaries: the activities of "Aktiv sein" that take place
 * in the week, from the same records. Hidden while that tool is not released (nothing linked).
 */
export function PlannedActivities({
	linked,
	monday,
	onPlan
}: {
	linked: Partial<Record<ToolId, Entry[]>>;
	monday: string;
	/** Opens "Aktiv sein"; only the client gets it. */
	onPlan?: () => void;
}) {
	const { m, t, lang } = useI18n();
	const entries = linked[ACTIVITY_TOOL];
	if (!entries) {
		return null;
	}
	const occurrences = occurrencesBetween(entries, monday, addDays(monday, 6));
	return (
		<section className="bt-stack bt-stack--tight" aria-label={m.planned.title}>
			<h3 className="bt-title">{m.planned.title}</h3>
			{occurrences.length === 0 ? (
				<p className="bt-muted bt-small">
					{m.planned.none}
					{onPlan && (
						<>
							{' '}
							<button type="button" className="bt-linkbtn bt-small" onClick={onPlan}>
								{m.planned.plan}
							</button>
						</>
					)}
				</p>
			) : (
				<ul className="bt-list">
					{occurrences.map(({ id, day, time, activity }) => (
						<li key={id} className="bt-item" style={{ flexWrap: 'wrap' }}>
							<span className="bt-planned__when">
								{formatDayShort(day, lang)}
								{time ? `, ${t(m.days.time, { time })}` : ''}
							</span>
							<span className="bt-item__text">
								{activity.title}
								{activity.companion ? ` (${t(m.planned.with, { name: activity.companion })})` : ''}
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
