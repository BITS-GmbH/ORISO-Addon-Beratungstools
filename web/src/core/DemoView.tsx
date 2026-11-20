import { Button } from '@oriso/web-kit';
import { useMemo, useState } from 'react';
import { ownerApi } from '../api.ts';
import { useHost } from '../host.ts';
import { ToolPage } from './ToolPage.tsx';

/** "User-Vorschau": the client view of a tool on the counsellor's own test data. */
export function DemoView({ toolId, onClose }: { toolId: string; onClose: () => void }) {
	const host = useHost();
	const api = useMemo(() => ownerApi(host.api, '/demo', toolId), [host.api, toolId]);
	const [run, setRun] = useState(0);
	const [resetting, setResetting] = useState(false);

	const reset = async () => {
		setResetting(true);
		try {
			await api.reset();
			setRun((value) => value + 1);
		} catch {
			host.notify({ type: 'error', text: 'Die Demo konnte nicht zurückgesetzt werden.' });
		} finally {
			setResetting(false);
		}
	};

	return (
		<div className="bt-stack">
			<div className="bt-demo" role="status">
				<strong>User-Vorschau / Demo: keine Speicherung im realen Fall</strong>
				<p className="bt-small" style={{ margin: '4px 0 10px' }}>
					So sehen Ratsuchende das Tool. Ihre Eingaben hier sind Testdaten, getrennt von allen Fällen, und
					bleiben für Sie erhalten, bis Sie die Demo zurücksetzen.
				</p>
				<div className="bt-row">
					<Button variant="secondary" disabled={resetting} onClick={reset}>
						Demo zurücksetzen
					</Button>
					<Button variant="tertiary" onClick={onClose}>
						Vorschau beenden
					</Button>
				</div>
			</div>
			<ToolPage key={run} toolId={toolId} mode="demo" backLabel="Zur Übersicht" onBack={onClose} />
		</div>
	);
}
