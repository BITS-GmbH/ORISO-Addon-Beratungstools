import { Button, Card, Headline, Notice, Spinner } from '@oriso/web-kit';
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

type View = { type: 'overview' } | { type: 'entries'; tool: string } | { type: 'demo'; tool: string };

/** The tools of a case (slot `consultant.session`): release, read shared entries, try the demo. */
export function CounsellorApp() {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [view, setView] = useState<View>({ type: 'overview' });
	const overview = useLoad(api.overview);
	const back = () => {
		setView({ type: 'overview' });
		void overview.reload();
	};

	if (view.type === 'demo') {
		return <DemoView toolId={view.tool} onClose={back} />;
	}
	if (view.type === 'entries') {
		return <EntriesView toolId={view.tool} onBack={back} />;
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

	const { tools, sessionId } = overview.data;
	const released = tools.filter((tool) => tool.released);
	const notReleased = tools.filter((tool) => !tool.released);
	const tile = (tool: CaseTool) => (
		<ToolTile
			key={tool.id}
			tool={tool}
			sessionId={sessionId}
			onChanged={overview.reload}
			onEntries={() => setView({ type: 'entries', tool: tool.id })}
			onDemo={() => setView({ type: 'demo', tool: tool.id })}
		/>
	);

	return (
		<div className="bt-stack">
			<div>
				<Headline level={2}>Tools</Headline>
				<p className="bt-muted">
					Freischaltungen und Einsicht werden getrennt verwaltet. Die User-Vorschau arbeitet unabhängig davon
					ausschließlich mit Testdaten.
				</p>
			</div>
			{released.length > 0 && (
				<section className="bt-stack" aria-label="Freigeschaltete Tools">
					<Headline level={3}>Freigeschaltete Tools</Headline>
					<div className="bt-grid">{released.map(tile)}</div>
				</section>
			)}
			{notReleased.length > 0 && (
				<section className="bt-stack" aria-label="Noch nicht freigeschaltete Tools">
					<Headline level={3}>Noch nicht freigeschaltete Tools</Headline>
					<div className="bt-grid">{notReleased.map(tile)}</div>
				</section>
			)}
			{tools.length === 0 && (
				<Notice type="info" title="Für diese Beratungsstelle sind keine Tools eingeschaltet." />
			)}
			<NotificationPrefsPanel />
		</div>
	);
}

interface TileProps {
	tool: CaseTool;
	sessionId: number | null;
	onChanged: () => Promise<void>;
	onEntries: () => void;
	onDemo: () => void;
}

function ToolTile({ tool, sessionId, onChanged, onEntries, onDemo }: TileProps) {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [busy, setBusy] = useState(false);
	const [confirmWithdraw, setConfirmWithdraw] = useState(false);
	const [expanded, setExpanded] = useState(false);
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

	const status = !tool.released ? null : tool.shared ? (
		<Pill tone="shared">Einsicht freigegeben</Pill>
	) : tool.hasEntries ? (
		<Pill tone="neutral">Einträge vorhanden, keine Einsicht</Pill>
	) : (
		<Pill tone="neutral">Noch keine Einträge</Pill>
	);

	return (
		<Card>
			<div className="bt-tile">
				<div className="bt-tile__head">
					<ToolIcon icon={webTool(tool.id)?.icon} />
					<div className="bt-stack bt-stack--tight">
						<span className="bt-title">{title}</span>
						<div className="bt-row">
							<Pill tone={tool.released ? 'on' : 'off'}>
								{tool.released ? 'Freigeschaltet' : 'Nicht freigeschaltet'}
							</Pill>
							{status}
							{tool.newCount > 0 && (
								<Pill tone="new">
									{tool.newCount === 1 ? '1 neuer Eintrag' : `${tool.newCount} neue Einträge`}
								</Pill>
							)}
						</div>
					</div>
				</div>
				<p className="bt-muted bt-small">
					{sessionId ? `Fall: ${sessionId}` : null}
					{tool.released && tool.releasedAt
						? `${sessionId ? ', ' : ''}freigeschaltet am ${formatDate(tool.releasedAt, host.locale)}`
						: null}
					{tool.lastChangedAt
						? `, zuletzt bearbeitet am ${formatDate(tool.lastChangedAt, host.locale, true)}`
						: null}
				</p>
				<p className={`bt-small${expanded ? '' : ' bt-clamp'}`}>{info?.description}</p>
				<button
					type="button"
					className="bt-linkbtn bt-small"
					aria-expanded={expanded}
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
				</button>
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
				{confirmWithdraw && (
					<div className="bt-confirm" role="group" aria-label="Freischaltung aufheben">
						<span style={{ flex: '1 1 220px' }}>
							Freischaltung aufheben? Das Tool verschwindet für die ratsuchende Person, Sie sehen keine
							Inhalte mehr. Die Einträge bleiben gespeichert.
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
		</Card>
	);
}
