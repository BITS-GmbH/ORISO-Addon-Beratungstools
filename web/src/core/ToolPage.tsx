import { Headline, Notice, Spinner } from '@oriso/web-kit';
import { useCallback, useMemo, useState } from 'react';
import type { ClientTool } from '../../../shared/api.ts';
import { type ToolId, toolInfo } from '../../../shared/catalog.ts';
import { ApiError, ownerApi } from '../api.ts';
import { useHost, useTx } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { BackButton, downloadBlob, SaveStatus, Switch, useLoad } from '../ui.tsx';
import { useEntryStore } from './entryStore.ts';

interface Props {
	toolId: string;
	mode: 'client' | 'demo';
	onBack: () => void;
	backLabel: string;
	onOpenTool?: (id: ToolId) => void;
}

/** A tool as its user sees it: header with autosave status, the share switch and the tool itself. */
export function ToolPage({ toolId, mode, onBack, backLabel, onOpenTool }: Props) {
	const host = useHost();
	const api = useMemo(
		() => ownerApi(host.api, mode === 'client' ? '/me' : '/demo', toolId),
		[host.api, mode, toolId]
	);
	const { data, error } = useLoad(api.load);
	const title = toolInfo(toolId)?.title.de ?? toolId;

	if (error && !data) {
		return (
			<div className="bt-stack">
				<BackButton onClick={onBack}>{backLabel}</BackButton>
				<Notice type="error" title={`„${title}“ konnte nicht geladen werden.`}>
					{error instanceof ApiError && error.status === 403
						? 'Das Tool ist nicht mehr freigeschaltet.'
						: 'Bitte versuchen Sie es später noch einmal.'}
				</Notice>
			</div>
		);
	}
	if (!data) {
		return <Spinner />;
	}
	return (
		<LoadedTool
			key={toolId}
			tool={data}
			api={api}
			title={title}
			onBack={onBack}
			backLabel={backLabel}
			onOpenTool={onOpenTool}
		/>
	);
}

function LoadedTool({
	tool,
	api,
	title,
	onBack,
	backLabel,
	onOpenTool
}: {
	tool: ClientTool;
	api: ReturnType<typeof ownerApi>;
	title: string;
	onBack: () => void;
	backLabel: string;
	onOpenTool?: (id: ToolId) => void;
}) {
	const host = useHost();
	const tx = useTx();
	const [shared, setShared] = useState(tool.shared);
	const onError = useCallback(
		(error: Error) =>
			host.notify({
				type: 'error',
				text:
					error instanceof ApiError && error.status === 403
						? 'Das Tool ist nicht mehr freigeschaltet. Ihre Eingabe wurde nicht gespeichert.'
						: tx(
								'Speichern hat nicht geklappt. Bitte versuchen Sie es noch einmal.',
								'Speichern hat nicht geklappt. Bitte versuch es noch einmal.'
							)
			}),
		[host, tx]
	);
	const { entries, store } = useEntryStore(api, tool.entries, onError);
	const module = webTool(tool.id);

	const download = useCallback(
		async (format: string, params?: Record<string, string>) => {
			try {
				const { blob, fileName } = await api.exportPdf(format, params);
				downloadBlob(blob, fileName);
			} catch {
				host.notify({
					type: 'error',
					text: tx(
						'Das PDF konnte nicht erstellt werden. Bitte versuchen Sie es noch einmal.',
						'Das PDF konnte nicht erstellt werden. Bitte versuch es noch einmal.'
					)
				});
			}
		},
		[api, host, tx]
	);

	const changeShare = async (next: boolean) => {
		setShared(next);
		try {
			await api.share(next);
			host.notify({
				type: 'success',
				text: next
					? tx(
							'Ihre Beratung kann diese Inhalte jetzt einsehen.',
							'Deine Beratung kann diese Inhalte jetzt einsehen.'
						)
					: tx(
							'Die Inhalte sind wieder nur für Sie sichtbar.',
							'Die Inhalte sind wieder nur für dich sichtbar.'
						)
			});
		} catch (error) {
			setShared(!next);
			onError(error as Error);
		}
	};

	return (
		<div className="bt-stack">
			<div className="bt-row bt-row--between">
				<BackButton onClick={onBack}>{backLabel}</BackButton>
				<SaveStatus state={store.saveState} />
			</div>
			<Headline level={2}>{title}</Headline>
			{tool.allowSharing && (
				<div className="bt-entry">
					<Switch
						overline="Sichtbarkeit für Berater/in"
						label={tx(
							'Mit meiner Beraterin / meinem Berater teilen',
							'Mit meiner Beraterin / meinem Berater teilen'
						)}
						description={
							shared
								? tx(
										'Ihre Beraterin / Ihr Berater kann Ihre Einträge einsehen und wird über neue Einträge informiert.',
										'Deine Beraterin / dein Berater kann deine Einträge einsehen und wird über neue Einträge informiert.'
									)
								: tx('Ihre Einträge sind nur für Sie sichtbar.', 'Deine Einträge sind nur für dich sichtbar.')
						}
						checked={shared}
						onChange={changeShare}
					/>
				</div>
			)}
			{module ? (
				<module.ClientView
					tool={tool}
					entries={entries}
					store={store}
					informal={host.informal}
					locale={host.locale}
					onDone={onBack}
					download={download}
					openTool={onOpenTool}
				/>
			) : (
				<Notice type="info" title="Dieses Tool ist noch nicht verfügbar." />
			)}
		</div>
	);
}
