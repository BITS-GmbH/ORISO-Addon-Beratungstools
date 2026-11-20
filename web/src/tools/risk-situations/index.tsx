import type { WebTool } from '../types.ts';
import { RiskClient } from './RiskClient.tsx';
import { RiskCounsellor } from './RiskCounsellor.tsx';

export const riskSituations: WebTool = {
	id: 'risk-situations',
	icon: (
		<>
			<path d="M12 3 2.5 20h19z" />
			<path d="M12 10v4M12 17h.01" />
		</>
	),
	ClientView: RiskClient,
	CounsellorView: RiskCounsellor
};
