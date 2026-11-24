import { Button } from '@oriso/web-kit';
import { useMemo, useState } from 'react';
import type { ToolId } from '../../../shared/catalog.ts';
import { ownerApi } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { ToolPage } from './ToolPage.tsx';

/** "User-Vorschau": the client view of a tool on the counsellor's own test data. */
export function DemoView({
	toolId,
	onClose,
	onOpenTool
}: {
	toolId: string;
	onClose: () => void;
	onOpenTool?: (id: ToolId) => void;
}) {
	const host = useHost();
	const { m, lang } = useI18n();
	const api = useMemo(() => ownerApi(host.api, '/demo', toolId, lang), [host.api, toolId, lang]);
	const [run, setRun] = useState(0);
	const [resetting, setResetting] = useState(false);

	const reset = async () => {
		setResetting(true);
		try {
			await api.reset();
			setRun((value) => value + 1);
		} catch {
			host.notify({ type: 'error', text: m.demo.resetFailed });
		} finally {
			setResetting(false);
		}
	};

	return (
		<div className="bt-stack">
			<div className="bt-demo" role="status">
				<strong>{m.demo.banner}</strong>
				<p className="bt-small" style={{ margin: '4px 0 10px' }}>
					{m.demo.bannerText}
				</p>
				<div className="bt-row">
					<Button variant="secondary" disabled={resetting} onClick={reset}>
						{m.demo.reset}
					</Button>
					<Button variant="tertiary" onClick={onClose}>
						{m.demo.end}
					</Button>
				</div>
			</div>
			<ToolPage
				key={`${toolId}:${run}`}
				toolId={toolId}
				mode="demo"
				backLabel={m.entries.back}
				onBack={onClose}
				onOpenTool={onOpenTool}
			/>
		</div>
	);
}
