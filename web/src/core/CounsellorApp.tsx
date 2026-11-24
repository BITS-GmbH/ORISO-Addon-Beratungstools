import { Button, Headline, Notice, Spinner } from '@oriso/web-kit';
import { useMemo, useState } from 'react';
import type { CaseTool } from '../../../shared/api.ts';
import { toolTexts } from '../../../shared/catalog.ts';
import type { I18n } from '../../../shared/i18n/index.ts';
import { ApiError, caseApi } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { Pill, useLoad } from '../ui.tsx';
import { DemoView } from './DemoView.tsx';
import { EntriesView } from './EntriesView.tsx';
import { NotificationPrefsButton, NotificationPrefsPanel } from './NotificationPrefs.tsx';
import { ToolIcon } from './ToolIcon.tsx';

type View =
	| { type: 'overview' }
	| { type: 'detail'; tool: string }
	| { type: 'entries'; tool: string }
	| { type: 'demo'; tool: string };

/** The tools of a case (slot `consultant.session`): release, read shared entries, try the demo. */
export function CounsellorApp() {
	const host = useHost();
	const { m } = useI18n();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [view, setView] = useState<View>({ type: 'overview' });
	const [prefsOpen, setPrefsOpen] = useState(false);
	const overview = useLoad(api.overview, [api]);
	const show = (next: View) => {
		setView(next);
		if (next.type === 'overview' || next.type === 'detail') {
			void overview.reload();
		}
	};

	if (view.type === 'demo') {
		return (
			<DemoView
				key={view.tool}
				toolId={view.tool}
				onClose={() => show({ type: 'detail', tool: view.tool })}
				onOpenTool={(tool) => show({ type: 'demo', tool })}
			/>
		);
	}
	if (view.type === 'entries') {
		return <EntriesView toolId={view.tool} onBack={() => show({ type: 'detail', tool: view.tool })} />;
	}
	if (overview.error && !overview.data) {
		return (
			<Notice type="error" title={m.counsellor.loadError}>
				{overview.error instanceof ApiError && overview.error.status === 400
					? m.counsellor.openFromCase
					: m.common.tryLater}
			</Notice>
		);
	}
	if (!overview.data) {
		return <Spinner />;
	}

	const { tools } = overview.data;
	if (view.type === 'detail') {
		const tool = tools.find((candidate) => candidate.id === view.tool);
		if (tool) {
			return (
				<ToolDetail
					tool={tool}
					onBack={() => show({ type: 'overview' })}
					onChanged={overview.reload}
					onEntries={() => show({ type: 'entries', tool: tool.id })}
					onDemo={() => show({ type: 'demo', tool: tool.id })}
				/>
			);
		}
	}

	const released = tools.filter((tool) => tool.released);
	const notReleased = tools.filter((tool) => !tool.released);
	const row = (tool: CaseTool) => (
		<li key={tool.id}>
			<ToolRow tool={tool} onOpen={() => show({ type: 'detail', tool: tool.id })} />
		</li>
	);

	return (
		<div className="bt-stack">
			<div className="bt-row bt-row--between">
				<Headline level={2}>{m.counsellor.tools}</Headline>
				<NotificationPrefsButton open={prefsOpen} onToggle={() => setPrefsOpen(!prefsOpen)} />
			</div>
			{prefsOpen && <NotificationPrefsPanel onClose={() => setPrefsOpen(false)} />}
			{released.length > 0 && (
				<section className="bt-stack bt-stack--tight" aria-label={m.counsellor.releasedTools}>
					<Headline level={3}>{m.counsellor.released}</Headline>
					<ul className="bt-toollist">{released.map(row)}</ul>
				</section>
			)}
			{notReleased.length > 0 && (
				<section className="bt-stack bt-stack--tight" aria-label={m.counsellor.notReleasedTools}>
					<Headline level={3}>{m.counsellor.notReleasedYet}</Headline>
					<ul className="bt-toollist">{notReleased.map(row)}</ul>
				</section>
			)}
			{tools.length === 0 && <Notice type="info" title={m.counsellor.noTools} />}
		</div>
	);
}

function stateOf(tool: CaseTool, { m }: I18n) {
	if (!tool.released) {
		return null;
	}
	if (tool.shared) {
		return <Pill tone="shared">{m.counsellor.shared}</Pill>;
	}
	return (
		<Pill tone="neutral">{tool.hasEntries ? m.counsellor.entriesNotShared : m.counsellor.noEntries}</Pill>
	);
}

function newEntries(tool: CaseTool, { m, t }: I18n) {
	if (tool.newCount <= 0) {
		return null;
	}
	return <Pill tone="new">{t(m.counsellor.newEntries, { count: tool.newCount })}</Pill>;
}

function ToolRow({ tool, onOpen }: { tool: CaseTool; onOpen: () => void }) {
	const i18n = useI18n();
	const info = toolTexts(i18n.m, tool.id);
	return (
		<button type="button" className="bt-toolrow" onClick={onOpen}>
			<ToolIcon icon={webTool(tool.id)?.icon} />
			<span className="bt-toolrow__text">
				<span className="bt-toolrow__title">
					<span className="bt-title">{info.title}</span>
					{newEntries(tool, i18n)}
				</span>
				<span className="bt-muted bt-small">{info.summary}</span>
			</span>
			<span className="bt-toolrow__chevron" aria-hidden="true">
				›
			</span>
		</button>
	);
}

interface DetailProps {
	tool: CaseTool;
	onBack: () => void;
	onChanged: () => Promise<void>;
	onEntries: () => void;
	onDemo: () => void;
}

function ToolDetail({ tool, onBack, onChanged, onEntries, onDemo }: DetailProps) {
	const host = useHost();
	const i18n = useI18n();
	const { m, t } = i18n;
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [busy, setBusy] = useState(false);
	const [confirmWithdraw, setConfirmWithdraw] = useState(false);
	const info = toolTexts(m, tool.id);
	const { title } = info;

	const act = async (action: () => Promise<unknown>, success: string) => {
		setBusy(true);
		try {
			await action();
			host.notify({ type: 'success', text: success });
		} catch (error) {
			host.notify({
				type: error instanceof ApiError && error.status === 409 ? 'warning' : 'error',
				text: error instanceof ApiError && error.status === 409 ? m.counsellor.dpa : m.common.tryAgain
			});
		} finally {
			setBusy(false);
			setConfirmWithdraw(false);
			await onChanged();
		}
	};

	const dates = [
		tool.released && tool.releasedAt
			? t(m.counsellor.releasedOn, { date: i18n.date(tool.releasedAt) })
			: null,
		tool.lastChangedAt
			? t(m.counsellor.lastChangedOn, { date: i18n.date(tool.lastChangedAt, { withTime: true }) })
			: null
	].filter(Boolean);

	return (
		<div className="bt-stack">
			<button type="button" className="bt-linkbtn" onClick={onBack}>
				‹ {m.counsellor.allTools}
			</button>
			<div className="bt-tile__head">
				<ToolIcon icon={webTool(tool.id)?.icon} />
				<div className="bt-stack bt-stack--tight">
					<Headline level={2}>{title}</Headline>
					<div className="bt-row">
						<Pill tone={tool.released ? 'on' : 'off'}>
							{tool.released ? m.counsellor.released : m.counsellor.notReleased}
						</Pill>
						{stateOf(tool, i18n)}
						{newEntries(tool, i18n)}
					</div>
				</div>
			</div>
			{dates.length > 0 && <p className="bt-muted bt-small">{dates.join(', ')}</p>}
			<p>{info.description}</p>
			<div className="bt-tile__actions">
				{!tool.released && (
					<Button
						disabled={busy}
						onClick={() => act(() => api.release(tool.id), t(m.counsellor.releasedNotice, { title }))}
					>
						{m.counsellor.release}
					</Button>
				)}
				{tool.released && tool.shared && (
					<Button disabled={busy} onClick={onEntries}>
						{m.counsellor.viewEntries}
					</Button>
				)}
				<Button variant="secondary" onClick={onDemo}>
					{m.counsellor.preview}
				</Button>
				{tool.released && !confirmWithdraw && (
					<Button variant="secondary" disabled={busy} onClick={() => setConfirmWithdraw(true)}>
						{m.counsellor.withdraw}
					</Button>
				)}
			</div>
			<p className="bt-muted bt-small">{m.counsellor.previewHint}</p>
			{confirmWithdraw && (
				<div className="bt-confirm" role="group" aria-label={m.counsellor.withdraw}>
					<span style={{ flex: '1 1 220px' }}>{m.counsellor.withdrawConfirm}</span>
					<Button disabled={busy} onClick={() => act(() => api.withdraw(tool.id), m.counsellor.withdrawn)}>
						{m.counsellor.withdrawButton}
					</Button>
					<Button variant="secondary" onClick={() => setConfirmWithdraw(false)}>
						{m.common.cancel}
					</Button>
				</div>
			)}
		</div>
	);
}
