import { active } from './active/index.ts';
import { balance } from './balance/index.ts';
import { emergencyKit } from './emergency-kit/index.ts';
import { goals } from './goals/index.ts';
import { positivePerception } from './positive-perception/index.ts';
import { riskSituations } from './risk-situations/index.ts';
import { trafficLight } from './traffic-light/index.ts';
import type { ServerTool } from './types.ts';

/** The tools this add-on offers, in delphi's order; a tool not listed here is not available yet. */
export const TOOLS: ServerTool[] = [
	goals,
	balance,
	emergencyKit,
	active,
	riskSituations,
	trafficLight,
	positivePerception
];
