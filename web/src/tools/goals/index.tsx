import type { WebTool } from '../types.ts';
import { GoalsClient } from './GoalsClient.tsx';
import { GoalsCounsellor } from './GoalsCounsellor.tsx';

export const goals: WebTool = {
	id: 'goals',
	icon: (
		<>
			<circle cx="12" cy="12" r="9" />
			<circle cx="12" cy="12" r="5" />
			<circle cx="12" cy="12" r="1.5" />
		</>
	),
	ClientView: GoalsClient,
	CounsellorView: GoalsCounsellor
};
