import { active } from './active/index.tsx';
import { balance } from './balance/index.tsx';
import { emergencyKit } from './emergency-kit/index.tsx';
import { goals } from './goals/index.tsx';
import { positivePerception } from './positive-perception/index.tsx';
import { riskSituations } from './risk-situations/index.tsx';
import { trafficLight } from './traffic-light/index.tsx';
import type { WebTool } from './types.ts';

/** The tools with a web side; must match the server's list (server/src/tools/index.ts). */
export const WEB_TOOLS: WebTool[] = [
	goals,
	balance,
	emergencyKit,
	active,
	riskSituations,
	trafficLight,
	positivePerception
];

export const webTool = (id: string): WebTool | undefined => WEB_TOOLS.find((tool) => tool.id === id);
