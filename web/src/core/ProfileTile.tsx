import { Button, Notice, Spinner } from '@oriso/web-kit';
import { useEffect, useMemo, useState } from 'react';
import { isNewSince, type CaseTool } from '../../../shared/api.ts';
import { toolTexts } from '../../../shared/catalog.ts';
import { caseApi } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { Pill, useLoad } from '../ui.tsx';

const CASE_VIEW = '/sessions/consultant/sessionView/session';

const firstToShow = (tools: CaseTool[]) =>
	(tools.find((tool) => tool.shared && tool.newCount > 0) ?? tools.find((tool) => tool.shared) ?? tools[0])
		?.id;

/** The tile in the client's profile (slot `consultant.asker-profile`): one tab per released tool. */
export function ProfileTile() {
	const host = useHost();
	const { m, t } = useI18n();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const { data, error } = useLoad(api.overview, [api]);
	const [selected, setSelected] = useState<string>();

	if (error && !data) {
		return <Notice type="error" title={m.profile.loadError} />;
	}
	if (!data) {
		return <Spinner />;
	}
	const released = data.tools.filter((tool) => tool.released);
	const tool =
		released.find((candidate) => candidate.id === selected) ??
		released.find((candidate) => candidate.id === firstToShow(released));
	return (
		<div className="bt-stack bt-stack--tight">
			{released.length === 0 || !tool ? (
				<p className="bt-muted">{m.profile.none}</p>
			) : (
				<>
					<div className="bt-tabs" role="group" aria-label={m.counsellor.releasedTools}>
						{released.map((candidate) => (
							<button
								key={candidate.id}
								type="button"
								className="bt-tab"
								aria-pressed={candidate.id === tool.id}
								onClick={() => setSelected(candidate.id)}
							>
								{toolTexts(m, candidate.id).title}
								{candidate.newCount > 0 && (
									<span
										className="bt-tab__dot"
										aria-label={t(m.profile.newCount, { count: candidate.newCount })}
									/>
								)}
							</button>
						))}
					</div>
					<div className="bt-row">
						<Pill tone={tool.shared ? 'shared' : 'neutral'}>
							{tool.shared
								? m.profile.shared
								: tool.hasEntries
									? m.counsellor.entriesNotShared
									: m.counsellor.noEntries}
						</Pill>
						{tool.newCount > 0 && <Pill tone="new">{t(m.profile.newCount, { count: tool.newCount })}</Pill>}
					</div>
					{tool.shared && <SharedEntries key={tool.id} toolId={tool.id} />}
				</>
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

function SharedEntries({ toolId }: { toolId: string }) {
	const host = useHost();
	const { m } = useI18n();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const { data, error } = useLoad(() => api.entries(toolId), [api, toolId]);
	const module = webTool(toolId);

	useEffect(() => {
		const last = data?.entries.reduce<string | undefined>(
			(max, entry) => (!max || entry.updatedAt > max ? entry.updatedAt : max),
			undefined
		);
		if (last) {
			void api.seen(toolId, last).catch(() => undefined);
		}
	}, [api, toolId, data]);

	if (error && !data) {
		return <Notice type="warning" title={m.entries.loadError} />;
	}
	if (!data) {
		return <Spinner />;
	}
	if (!module) {
		return <Notice type="info" title={m.entries.noView} />;
	}
	return (
		<div className="bt-profile-entries">
			<module.CounsellorView
				entries={data.entries}
				options={data.options}
				locale={host.locale}
				isNew={(entry) => isNewSince(entry.updatedAt, data.seenAt)}
				linked={data.linked ?? {}}
			/>
		</div>
	);
}
