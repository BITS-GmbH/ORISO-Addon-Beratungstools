import type { Entry } from '../../../shared/api.ts';
import type { ToolId } from '../../../shared/catalog.ts';
import { ACTIVITY_TOOL, occurrencesBetween } from '../../../shared/activities.ts';
import { addDays, formatDayShort } from '../../../shared/days.ts';

/**
 * "Geplante Aktivitäten diese Woche" in the diaries: the activities of "Aktiv sein" that take place
 * in the week, from the same records. Hidden while that tool is not released (nothing linked).
 */
export function PlannedActivities({
	linked,
	monday
}: {
	linked: Partial<Record<ToolId, Entry[]>>;
	monday: string;
}) {
	const entries = linked[ACTIVITY_TOOL];
	if (!entries) {
		return null;
	}
	const occurrences = occurrencesBetween(entries, monday, addDays(monday, 6));
	return (
		<section className="bt-stack bt-stack--tight" aria-label="Geplante Aktivitäten diese Woche">
			<h3 className="bt-title">Geplante Aktivitäten diese Woche</h3>
			{occurrences.length === 0 ? (
				<p className="bt-muted bt-small">Für diese Woche sind keine Aktivitäten geplant.</p>
			) : (
				<ul className="bt-list">
					{occurrences.map(({ id, day, time, activity }) => (
						<li key={id} className="bt-item" style={{ flexWrap: 'wrap' }}>
							<span className="bt-planned__when">
								{formatDayShort(day)}
								{time ? `, ${time} Uhr` : ''}
							</span>
							<span className="bt-item__text">
								{activity.title}
								{activity.companion ? ` (mit ${activity.companion})` : ''}
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
