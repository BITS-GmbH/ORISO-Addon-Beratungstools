import type { ReactNode } from 'react';

const FALLBACK = (
	<>
		<rect x="4" y="4" width="16" height="16" rx="3" />
		<path d="M8 12h8M12 8v8" />
	</>
);

export const ToolIcon = ({ icon }: { icon?: ReactNode }) => (
	<span className="bt-tile__icon" aria-hidden>
		<svg viewBox="0 0 24 24">{icon ?? FALLBACK}</svg>
	</span>
);
