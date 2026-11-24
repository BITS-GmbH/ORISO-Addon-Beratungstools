import { useId, type ReactNode } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	ACTIVITY_KIND,
	LEVEL_COLOURS,
	LEVEL_VALUES,
	levelLabel,
	type Activity,
	type Level
} from '../../../../shared/tools/traffic-light.ts';
import { useI18n } from '../../host.ts';

export type Item = Activity & { id: string; entry: Entry };

export const activitiesOf = (entries: Entry[]): Item[] =>
	entries
		.filter((e) => e.kind === ACTIVITY_KIND)
		.map((e) => ({ ...(e.data as Activity), id: e.id, entry: e }));

export function Legend() {
	const { m } = useI18n();
	const texts = m.trafficLight;
	return (
		<ul className="bt-legend" aria-label={texts.legendLabel}>
			{LEVEL_VALUES.map((level) => {
				const colour = LEVEL_COLOURS[level];
				return (
					<li key={level}>
						<span className={`bt-lamp bt-lamp--${colour}`} aria-hidden />
						<span>
							<strong>{texts.levels[colour].colourName}</strong> = {texts.levels[colour].danger}
						</span>
					</li>
				);
			})}
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
	const i18n = useI18n();
	const texts = i18n.m.trafficLight;
	const idPrefix = useId();
	return (
		<div className="bt-light-wrap">
			<Legend />
			<div className="bt-light" role="group" aria-label={texts.lightLabel}>
				{LEVEL_VALUES.map((level: Level) => {
					const list = items.filter((item) => item.level === level);
					const colour = LEVEL_COLOURS[level];
					const headingId = `${idPrefix}-${colour}`;
					return (
						<section
							key={level}
							className={`bt-light__field bt-light__field--${colour}`}
							aria-labelledby={headingId}
						>
							<h3 id={headingId} className="bt-light__head">
								<span className={`bt-lamp bt-lamp--${colour}`} aria-hidden />
								{levelLabel(i18n, level)}
								<span className="bt-light__count">{i18n.t(texts.activityCount, { count: list.length })}</span>
							</h3>
							{list.length === 0 ? (
								<p className="bt-muted bt-small">{texts.noActivities}</p>
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
