import { Button, Headline, Notice, Spinner } from '@oriso/web-kit';
import { useMemo, useState } from 'react';
import type { CaseTool } from '../../../shared/api.ts';
import { toolInfo } from '../../../shared/catalog.ts';
import { ApiError, caseApi } from '../api.ts';
import { useHost } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { formatDate, Pill, useLoad } from '../ui.tsx';
import { DemoView } from './DemoView.tsx';
import { EntriesView } from './EntriesView.tsx';
import { NotificationPrefsPanel } from './NotificationPrefs.tsx';
import { ToolIcon } from './ToolIcon.tsx';

type View =
	| { type: 'overview' }
	| { type: 'detail'; tool: string }
	| { type: 'entries'; tool: string }
	| { type: 'demo'; tool: string };

/** The tools of a case (slot `consultant.session`): release, read shared entries, try the demo. */
export function CounsellorApp() {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [view, setView] = useState<View>({ type: 'overview' });
	const overview = useLoad(api.overview);
	const show = (next: View) => {
		setView(next);
		if (next.type === 'overview' || next.type === 'detail') {
			void overview.reload();
		}
	};

	if (view.type === 'demo') {
		return <DemoView toolId={view.tool} onClose={() => show({ type: 'detail', tool: view.tool })} />;
	}
	if (view.type === 'entries') {
		return <EntriesView toolId={view.tool} onBack={() => show({ type: 'detail', tool: view.tool })} />;
	}
	if (overview.error && !overview.data) {
		return (
			<Notice type="error" title="Die Tools des Falls konnten nicht geladen werden.">
				{overview.error instanceof ApiError && overview.error.status === 400
					? 'Bitte öffnen Sie die Tools aus einem Fall heraus.'
					: 'Bitte versuchen Sie es später noch einmal.'}
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
			<Headline level={2}>Tools</Headline>
			{released.length > 0 && (
				<section className="bt-stack bt-stack--tight" aria-label="Freigeschaltete Tools">
					<Headline level={3}>Freigeschaltet</Headline>
					<ul className="bt-toollist">{released.map(row)}</ul>
				</section>
			)}
			{notReleased.length > 0 && (
				<section className="bt-stack bt-stack--tight" aria-label="Noch nicht freigeschaltete Tools">
					<Headline level={3}>Noch nicht freigeschaltet</Headline>
					<ul className="bt-toollist">{notReleased.map(row)}</ul>
				</section>
			)}
			{tools.length === 0 && (
				<Notice type="info" title="Für diese Beratungsstelle sind keine Tools eingeschaltet." />
			)}
			<NotificationPrefsPanel />
		</div>
	);
}

function stateOf(tool: CaseTool) {
	if (!tool.released) {
		return null;
	}
	if (tool.shared) {
		return <Pill tone="shared">Einsicht freigegeben</Pill>;
	}
	return tool.hasEntries ? (
		<Pill tone="neutral">Einträge vorhanden, keine Einsicht</Pill>
	) : (
		<Pill tone="neutral">Noch keine Einträge</Pill>
	);
}

function newEntries(tool: CaseTool) {
	if (tool.newCount <= 0) {
		return null;
	}
	return <Pill tone="new">{tool.newCount === 1 ? '1 neuer Eintrag' : `${tool.newCount} neue Einträge`}</Pill>;
}

function ToolRow({ tool, onOpen }: { tool: CaseTool; onOpen: () => void }) {
	const info = toolInfo(tool.id);
	return (
		<button type="button" className="bt-toolrow" onClick={onOpen}>
			<ToolIcon icon={webTool(tool.id)?.icon} />
			<span className="bt-toolrow__text">
				<span className="bt-toolrow__title">
					<span className="bt-title">{info?.title.de ?? tool.id}</span>
					{newEntries(tool)}
				</span>
				<span className="bt-muted bt-small">{info?.summary}</span>
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
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [busy, setBusy] = useState(false);
	const [confirmWithdraw, setConfirmWithdraw] = useState(false);
	const info = toolInfo(tool.id);
	const title = info?.title.de ?? tool.id;

	const act = async (action: () => Promise<unknown>, success: string) => {
		setBusy(true);
		try {
			await action();
			host.notify({ type: 'success', text: success });
		} catch (error) {
			host.notify({
				type: error instanceof ApiError && error.status === 409 ? 'warning' : 'error',
				text:
					error instanceof ApiError && error.status === 409
						? 'Freischalten gerade nicht möglich: Der Träger hat den aktuellen Auftragsverarbeitungsvertrag noch nicht bestätigt.'
						: 'Das hat nicht geklappt. Bitte versuchen Sie es noch einmal.'
			});
		} finally {
			setBusy(false);
			setConfirmWithdraw(false);
			await onChanged();
		}
	};

	const dates = [
		tool.released && tool.releasedAt ? `Freigeschaltet am ${formatDate(tool.releasedAt, host.locale)}` : null,
		tool.lastChangedAt ? `zuletzt bearbeitet am ${formatDate(tool.lastChangedAt, host.locale, true)}` : null
	].filter(Boolean);

	return (
		<div className="bt-stack">
			<button type="button" className="bt-linkbtn" onClick={onBack}>
				‹ Alle Tools
			</button>
			<div className="bt-tile__head">
				<ToolIcon icon={webTool(tool.id)?.icon} />
				<div className="bt-stack bt-stack--tight">
					<Headline level={2}>{title}</Headline>
					<div className="bt-row">
						<Pill tone={tool.released ? 'on' : 'off'}>
							{tool.released ? 'Freigeschaltet' : 'Nicht freigeschaltet'}
						</Pill>
						{stateOf(tool)}
						{newEntries(tool)}
					</div>
				</div>
			</div>
			{dates.length > 0 && <p className="bt-muted bt-small">{dates.join(', ')}</p>}
			<p>{info?.description}</p>
			<div className="bt-tile__actions">
				{!tool.released && (
					<Button
						disabled={busy}
						onClick={() =>
							act(
								() => api.release(tool.id),
								`„${title}“ ist freigeschaltet. Die ratsuchende Person wird benachrichtigt.`
							)
						}
					>
						Freischalten
					</Button>
				)}
				{tool.released && tool.shared && (
					<Button disabled={busy} onClick={onEntries}>
						Einträge ansehen
					</Button>
				)}
				<Button variant="secondary" onClick={onDemo}>
					User-Vorschau
				</Button>
				{tool.released && !confirmWithdraw && (
					<Button variant="tertiary" disabled={busy} onClick={() => setConfirmWithdraw(true)}>
						Freischaltung aufheben
					</Button>
				)}
			</div>
			<p className="bt-muted bt-small">
				Die User-Vorschau zeigt das Tool so, wie die ratsuchende Person es sieht, mit Testdaten.
			</p>
			{confirmWithdraw && (
				<div className="bt-confirm" role="group" aria-label="Freischaltung aufheben">
					<span style={{ flex: '1 1 220px' }}>
						Freischaltung aufheben? Das Tool verschwindet für die ratsuchende Person, Sie sehen keine Inhalte
						mehr. Die Einträge bleiben gespeichert.
					</span>
					<Button
						disabled={busy}
						onClick={() =>
							act(
								() => api.withdraw(tool.id),
								'Die Freischaltung ist aufgehoben. Die Einträge bleiben gespeichert.'
							)
						}
					>
						Aufheben
					</Button>
					<Button variant="tertiary" onClick={() => setConfirmWithdraw(false)}>
						Abbrechen
					</Button>
				</div>
			)}
		</div>
	);
}
