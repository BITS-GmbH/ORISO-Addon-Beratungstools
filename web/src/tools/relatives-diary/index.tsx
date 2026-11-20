import type { WebTool } from '../types.ts';
import { RelativesClient } from './RelativesClient.tsx';
import { RelativesCounsellor } from './RelativesCounsellor.tsx';

export const relativesDiary: WebTool = {
	id: 'relatives-diary',
	icon: (
		<>
			<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v16H6.5A1.5 1.5 0 0 0 5 20.5z" />
			<path d="M5 20.5A1.5 1.5 0 0 0 6.5 22H19v-3" />
			<path d="M12 13.5s-3-1.8-3-3.6a1.5 1.5 0 0 1 3-.4 1.5 1.5 0 0 1 3 .4c0 1.8-3 3.6-3 3.6z" />
		</>
	),
	ClientView: RelativesClient,
	CounsellorView: RelativesCounsellor
};
