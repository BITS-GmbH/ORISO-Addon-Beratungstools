/** Formal (Sie) or informal (du) text, as the host's form of address asks for. */
export const tx = (informal: boolean, sie: string, du: string): string => (informal ? du : sie);
