import type { WebTool } from '../types.ts';
import { ConsumptionClient } from './ConsumptionClient.tsx';
import { ConsumptionCounsellor } from './ConsumptionCounsellor.tsx';

export const consumptionDiary: WebTool = {
	id: 'consumption-diary',
	icon: (
		<>
			<rect x="4" y="4" width="16" height="17" rx="2" />
			<path d="M8 2.5v3M16 2.5v3M4 9h16" />
			<path d="M8.5 15l2 2 4.5-4.5" />
		</>
	),
	ClientView: ConsumptionClient,
	CounsellorView: ConsumptionCounsellor
};
