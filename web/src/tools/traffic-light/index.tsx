import type { WebTool } from '../types.ts';
import { TrafficLightClient } from './TrafficLightClient.tsx';
import { TrafficLightCounsellor } from './TrafficLightCounsellor.tsx';

export const trafficLight: WebTool = {
	id: 'traffic-light',
	icon: (
		<>
			<rect x="7" y="2" width="10" height="20" rx="3" />
			<circle cx="12" cy="7" r="1.8" />
			<circle cx="12" cy="12" r="1.8" />
			<circle cx="12" cy="17" r="1.8" />
		</>
	),
	ClientView: TrafficLightClient,
	CounsellorView: TrafficLightCounsellor
};
