import type { WebTool } from '../types.ts';
import { BalanceClient } from './BalanceClient.tsx';
import { BalanceCounsellor } from './BalanceCounsellor.tsx';

export const balance: WebTool = {
	id: 'balance',
	icon: (
		<>
			<path d="M12 3v18M7 21h10M4 7h16" />
			<path d="M4 7l-2.5 6a3 3 0 0 0 5 0z" />
			<path d="M20 7l-2.5 6a3 3 0 0 0 5 0z" />
		</>
	),
	ClientView: BalanceClient,
	CounsellorView: BalanceCounsellor
};
