import type { ReactNode } from 'react';
import { toolTexts } from '../../../shared/catalog.ts';
import { useI18n } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { ToolIcon } from './ToolIcon.tsx';

/** One tool in a list: icon, title with its badges and the one-line summary. */
export function ToolRow({
	toolId,
	badges,
	onOpen
}: {
	toolId: string;
	badges?: ReactNode;
	onOpen: () => void;
}) {
	const { m } = useI18n();
	const info = toolTexts(m, toolId);
	return (
		<button type="button" className="bt-toolrow" onClick={onOpen}>
			<ToolIcon icon={webTool(toolId)?.icon} />
			<span className="bt-toolrow__text">
				<span className="bt-toolrow__title">
					<span className="bt-title">{info.title}</span>
					{badges}
				</span>
				<span className="bt-muted bt-small">{info.summary}</span>
			</span>
			<span className="bt-toolrow__chevron" aria-hidden="true">
				›
			</span>
		</button>
	);
}
