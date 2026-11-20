import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { activitiesOf, TrafficLight } from './parts.tsx';

export function TrafficLightCounsellor({ entries, isNew }: CounsellorViewProps) {
	const items = activitiesOf(entries);
	return (
		<div className="bt-stack">
			{items.length === 0 && <p className="bt-muted">Noch keine Aktivitäten eingetragen.</p>}
			<TrafficLight
				items={items}
				renderItem={(item) => (
					<span className={`bt-activity${isNew(item.entry) ? ' bt-activity--new' : ''}`}>
						<span className="bt-item__text">{item.text}</span>
						{isNew(item.entry) && <Pill tone="new">Neu</Pill>}
					</span>
				)}
			/>
		</div>
	);
}
