import { Headline, Notice, Spinner } from '@oriso/web-kit';
import { useCallback, useMemo, useState } from 'react';
import type { ClientTool } from '../../../shared/api.ts';
import { type ToolId, toolTexts } from '../../../shared/catalog.ts';
import { ApiError, ownerApi } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
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
	const { m, t, lang } = useI18n();
	const api = useMemo(
		() => ownerApi(host.api, mode === 'client' ? '/me' : '/demo', toolId, lang),
		[host.api, mode, toolId, lang]
	);
	const { data, error } = useLoad(api.load, [api]);
	const title = toolTexts(m, toolId).title;

	if (error && !data) {
		return (
			<div className="bt-stack">
				<BackButton onClick={onBack}>{backLabel}</BackButton>
				<Notice type="error" title={t(m.toolPage.loadError, { title })}>
					{error instanceof ApiError && error.status === 403 ? m.toolPage.notReleased : m.common.tryLater}
				</Notice>
			</div>
		);
	}
	if (!data || data.id !== toolId) {
		return <Spinner />;
	}
	return (
		<LoadedTool
			key={`${toolId}:${mode}`}
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
	const { m, lang } = useI18n();
	const [shared, setShared] = useState(tool.shared);
	const onError = useCallback(
		(error: Error) =>
			host.notify({
				type: 'error',
				text:
					error instanceof ApiError && error.status === 403
						? m.toolPage.notReleasedNotSaved
						: m.toolPage.saveFailed
			}),
		[host, m]
	);
	const { entries, store } = useEntryStore(api, tool.entries, onError);
	const module = webTool(tool.id);

	const download = useCallback(
		async (format: string, params?: Record<string, string>) => {
			try {
				const { blob, fileName } = await api.exportPdf(format, { ...params, lang });
				downloadBlob(blob, fileName);
			} catch {
				host.notify({ type: 'error', text: m.toolPage.pdfFailed });
			}
		},
		[api, host, m, lang]
	);

	const changeShare = async (next: boolean) => {
		setShared(next);
		try {
			await api.share(next);
			host.notify({
				type: 'success',
				text: next ? m.toolPage.sharedNow : m.toolPage.privateAgain
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
						overline={m.toolPage.shareOverline}
						label={m.toolPage.shareLabel}
						description={shared ? m.toolPage.shareOn : m.toolPage.shareOff}
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
				<Notice type="info" title={m.toolPage.notAvailable} />
			)}
		</div>
	);
}
