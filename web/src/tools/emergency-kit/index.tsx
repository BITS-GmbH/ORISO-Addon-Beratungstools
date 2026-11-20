import type { WebTool } from '../types.ts';
import { KitClient } from './KitClient.tsx';
import { KitCounsellor } from './KitCounsellor.tsx';

export const emergencyKit: WebTool = {
	id: 'emergency-kit',
	icon: (
		<>
			<rect x="3" y="7" width="18" height="13" rx="2" />
			<path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 10.5v6M9 13.5h6" />
		</>
	),
	ClientView: KitClient,
	CounsellorView: KitCounsellor
};
