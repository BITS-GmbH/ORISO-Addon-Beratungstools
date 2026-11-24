import { Button, Notice, Spinner } from '@oriso/web-kit';
import { useMemo } from 'react';
import { toolTexts } from '../../../shared/catalog.ts';
import { caseApi } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { Pill, useLoad } from '../ui.tsx';

const CASE_VIEW = '/sessions/consultant/sessionView/session';

/** The tile in the client's profile (slot `consultant.asker-profile`): the state per tool. */
export function ProfileTile() {
	const host = useHost();
	const { m, t } = useI18n();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const { data, error } = useLoad(api.overview, [api]);

	if (error && !data) {
		return <Notice type="error" title={m.profile.loadError} />;
	}
	if (!data) {
		return <Spinner />;
	}
	const released = data.tools.filter((tool) => tool.released);
	return (
		<div className="bt-stack bt-stack--tight">
			{released.length === 0 ? (
				<p className="bt-muted">{m.profile.none}</p>
			) : (
				<ul className="bt-list">
					{released.map((tool) => (
						<li key={tool.id} className="bt-row bt-row--between">
							<span>{toolTexts(m, tool.id).title}</span>
							<span className="bt-row">
								{tool.newCount > 0 && (
									<Pill tone="new">{t(m.profile.newCount, { count: tool.newCount })}</Pill>
								)}
								<Pill tone={tool.shared ? 'shared' : 'neutral'}>
									{tool.shared ? m.profile.shared : m.profile.notShared}
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
						{m.profile.open}
					</Button>
				</div>
			)}
		</div>
	);
}
