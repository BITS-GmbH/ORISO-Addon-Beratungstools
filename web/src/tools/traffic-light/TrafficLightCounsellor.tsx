import { useI18n } from '../../host.ts';
import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { activitiesOf, TrafficLight } from './parts.tsx';

export function TrafficLightCounsellor({ entries, isNew }: CounsellorViewProps) {
	const { m } = useI18n();
	const items = activitiesOf(entries);
	return (
		<div className="bt-stack">
			{items.length === 0 && <p className="bt-muted">{m.trafficLight.empty}</p>}
			<TrafficLight
				items={items}
				renderItem={(item) => (
					<span className={`bt-activity${isNew(item.entry) ? ' bt-activity--new' : ''}`}>
						<span className="bt-item__text">{item.text}</span>
						{isNew(item.entry) && <Pill tone="new">{m.trafficLight.new}</Pill>}
					</span>
				)}
			/>
		</div>
	);
}
