import type { WebTool } from '../types.ts';
import { ActiveClient } from './ActiveClient.tsx';
import { ActiveCounsellor } from './ActiveCounsellor.tsx';

export const active: WebTool = {
	id: 'active',
	icon: (
		<>
			<circle cx="14" cy="4.5" r="2" />
			<path d="M9 21l2.5-6 3 2.5V22" />
			<path d="M7 11.5l3-3.5 4 1 2 3.5 3 1" />
			<path d="M11.5 15l1.5-6" />
		</>
	),
	ClientView: ActiveClient,
	CounsellorView: ActiveCounsellor
};
