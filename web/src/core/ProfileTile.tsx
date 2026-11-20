import { Button, Notice, Spinner } from '@oriso/web-kit';
import { useMemo } from 'react';
import { toolInfo } from '../../../shared/catalog.ts';
import { caseApi } from '../api.ts';
import { useHost } from '../host.ts';
import { Pill, useLoad } from '../ui.tsx';

const CASE_VIEW = '/sessions/consultant/sessionView/session';

/** The tile in the client's profile (slot `consultant.asker-profile`): the state per tool. */
export function ProfileTile() {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const { data, error } = useLoad(api.overview);

	if (error && !data) {
		return <Notice type="error" title="Die Tools konnten nicht geladen werden." />;
	}
	if (!data) {
		return <Spinner />;
	}
	const released = data.tools.filter((tool) => tool.released);
	return (
		<div className="bt-stack bt-stack--tight">
			{released.length === 0 ? (
				<p className="bt-muted">Noch keine Tools freigeschaltet.</p>
			) : (
				<ul className="bt-list">
					{released.map((tool) => (
						<li key={tool.id} className="bt-row bt-row--between">
							<span>{toolInfo(tool.id)?.title.de ?? tool.id}</span>
							<span className="bt-row">
								{tool.newCount > 0 && <Pill tone="new">{tool.newCount} neu</Pill>}
								<Pill tone={tool.shared ? 'shared' : 'neutral'}>
									{tool.shared ? 'Einsicht freigegeben' : 'Keine Einsicht'}
								</Pill>
							</span>
						</li>
					))}
				</ul>
			)}
			{host.sessionId != null && (
				<div>
					<Button
						variant="secondary"
						onClick={() =>
							host.navigate(
								`${CASE_VIEW}/${host.sessionId}?${new URLSearchParams({ addon: 'beratungstools/tools/consultant.session' })}`
							)
						}
					>
						Tools im Fall öffnen
					</Button>
				</div>
			)}
		</div>
	);
}
