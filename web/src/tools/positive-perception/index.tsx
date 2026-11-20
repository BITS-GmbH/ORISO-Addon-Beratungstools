import type { WebTool } from '../types.ts';
import { PositivePerceptionClient } from './PositivePerceptionClient.tsx';
import { PositivePerceptionCounsellor } from './PositivePerceptionCounsellor.tsx';

export const positivePerception: WebTool = {
	id: 'positive-perception',
	icon: (
		<>
			<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
			<path d="M12 3v1M5 4l.7.7M19 4l-.7.7" />
		</>
	),
	ClientView: PositivePerceptionClient,
	CounsellorView: PositivePerceptionCounsellor
};
