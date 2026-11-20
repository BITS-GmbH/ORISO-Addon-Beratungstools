import { balance } from './balance.ts';
import { goals } from './goals.ts';
import type { ServerTool } from './types.ts';

/** The tools this add-on offers, in delphi's order; a tool not listed here is not available yet. */
export const TOOLS: ServerTool[] = [goals, balance];
