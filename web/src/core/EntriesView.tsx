import { Button, Headline, Notice, Spinner } from '@oriso/web-kit';
import { useEffect, useMemo, useState } from 'react';
import { isNewSince, type CaseEntries, type Entry } from '../../../shared/api.ts';
import { toolInfo } from '../../../shared/catalog.ts';
import { localToday } from '../../../shared/days.ts';
import { ApiError, caseApi } from '../api.ts';
import { useHost } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { BackButton, downloadBlob, formatDate, useLoad } from '../ui.tsx';
import { DateRangePicker, type DayRange } from './DateRangePicker.tsx';

const latest = (entries: Entry[]) =>
	entries.reduce<string | undefined>((max, e) => (!max || e.updatedAt > max ? e.updatedAt : max), undefined);

/** The shared entries of one tool, read only; the server checks the access on every request. */
export function EntriesView({ toolId, onBack }: { toolId: string; onBack: () => void }) {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const { data, error } = useLoad(() => api.entries(toolId));
	const title = toolInfo(toolId)?.title.de ?? toolId;

	if (error && !data) {
		return (
			<div className="bt-stack">
				<BackButton onClick={onBack}>Zur Übersicht</BackButton>
				<Notice
					type="warning"
					title={
						error instanceof ApiError && error.status === 403
							? 'Keine Einsicht'
							: 'Die Einträge konnten nicht geladen werden.'
					}
				>
					{error instanceof ApiError && error.status === 403
						? 'Die ratsuchende Person hat die Einsicht zurückgenommen oder das Tool ist nicht mehr freigeschaltet.'
						: 'Bitte versuchen Sie es später noch einmal.'}
				</Notice>
			</div>
		);
	}
	if (!data) {
		return <Spinner />;
	}
	return <Loaded data={data} title={title} onBack={onBack} />;
}

function Loaded({ data, title, onBack }: { data: CaseEntries; title: string; onBack: () => void }) {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const module = webTool(data.id);
	const [exporting, setExporting] = useState(false);
	const [range, setRange] = useState<DayRange>({ from: '', to: '' });
	const { exportRange } = data;
	const lastChange = latest(data.entries);

	useEffect(() => {
		void api.seen(data.id, latest(data.entries)).catch(() => undefined);
	}, [api, data]);

	const exportPdf = async () => {
		setExporting(true);
		try {
			const { blob, fileName } = await api.exportPdf(data.id, exportRange ? range : {});
			downloadBlob(blob, fileName);
		} catch (error) {
			host.notify({
				type: error instanceof ApiError && error.status === 403 ? 'warning' : 'error',
				text:
					error instanceof ApiError && error.status === 403
						? 'Die ratsuchende Person hat die Einsicht zurückgenommen. Ein Export ist nicht möglich.'
						: 'Der Export hat nicht geklappt. Bitte versuchen Sie es noch einmal.'
			});
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>Zur Übersicht</BackButton>
			<div>
				<p className="bt-overline">Einträge, schreibgeschützt</p>
				<Headline level={2}>{title}</Headline>
				<p className="bt-muted bt-small">
					{lastChange
						? `Zuletzt bearbeitet am ${formatDate(lastChange, host.locale, true)}`
						: 'Noch keine Einträge'}
					{data.sharedSince ? `, Einsicht freigegeben seit ${formatDate(data.sharedSince, host.locale)}` : ''}
				</p>
			</div>
			<div className="bt-row" style={{ alignItems: 'flex-end' }}>
				{exportRange && <DateRangePicker value={range} onChange={setRange} today={localToday()} />}
				<Button variant="secondary" disabled={exporting} onClick={exportPdf}>
					{exporting ? 'Export wird erstellt …' : exportRange ? 'Export erstellen' : 'Als PDF exportieren'}
				</Button>
			</div>
			{module ? (
				<module.CounsellorView
					entries={data.entries}
					options={data.options}
					locale={host.locale}
					isNew={(entry) => isNewSince(entry.updatedAt, data.seenAt)}
					linked={data.linked ?? {}}
				/>
			) : (
				<Notice type="info" title="Für dieses Tool gibt es noch keine Ansicht." />
			)}
		</div>
	);
}
