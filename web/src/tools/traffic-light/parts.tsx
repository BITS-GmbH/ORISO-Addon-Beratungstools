import { useId, type ReactNode } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	ACTIVITY_KIND,
	LEVEL_VALUES,
	LEVELS,
	type Activity,
	type Level
} from '../../../../shared/tools/traffic-light.ts';

export type Item = Activity & { id: string; entry: Entry };

export const activitiesOf = (entries: Entry[]): Item[] =>
	entries
		.filter((e) => e.kind === ACTIVITY_KIND)
		.map((e) => ({ ...(e.data as Activity), id: e.id, entry: e }));

export function Legend() {
	return (
		<ul className="bt-legend" aria-label="Legende">
			{LEVEL_VALUES.map((level) => (
				<li key={level}>
					<span className={`bt-lamp bt-lamp--${LEVELS[level].colour}`} aria-hidden />
					<span>
						<strong>{LEVELS[level].colourName}</strong> = {LEVELS[level].danger}
					</span>
				</li>
			))}
		</ul>
	);
}

/** The three fields of the light, top to bottom red, yellow, green; `renderItem` draws one activity. */
export function TrafficLight({
	items,
	renderItem
}: {
	items: Item[];
	renderItem: (item: Item) => ReactNode;
}) {
	const idPrefix = useId();
	return (
		<div className="bt-light-wrap">
			<Legend />
			<div className="bt-light" role="group" aria-label="Ampel">
				{LEVEL_VALUES.map((level: Level) => {
					const list = items.filter((item) => item.level === level);
					const { colour, colourName, danger } = LEVELS[level];
					const headingId = `${idPrefix}-${colour}`;
					return (
						<section
							key={level}
							className={`bt-light__field bt-light__field--${colour}`}
							aria-labelledby={headingId}
						>
							<h3 id={headingId} className="bt-light__head">
								<span className={`bt-lamp bt-lamp--${colour}`} aria-hidden />
								{colourName}: {danger}
								<span className="bt-light__count">
									{list.length === 1 ? '1 Aktivität' : `${list.length} Aktivitäten`}
								</span>
							</h3>
							{list.length === 0 ? (
								<p className="bt-muted bt-small">Keine Aktivitäten.</p>
							) : (
								<ul className="bt-light__list">
									{list.map((item) => (
										<li key={item.id}>{renderItem(item)}</li>
									))}
								</ul>
							)}
						</section>
					);
				})}
			</div>
		</div>
	);
}
