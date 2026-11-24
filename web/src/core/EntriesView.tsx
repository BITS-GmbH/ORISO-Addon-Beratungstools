import { Button, Headline, Notice, Spinner } from '@oriso/web-kit';
import { useEffect, useMemo, useState } from 'react';
import { isNewSince, type CaseEntries, type Entry } from '../../../shared/api.ts';
import { toolTexts } from '../../../shared/catalog.ts';
import { localToday } from '../../../shared/days.ts';
import { ApiError, caseApi } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { BackButton, downloadBlob, useLoad } from '../ui.tsx';
import { DateRangePicker, type DayRange } from './DateRangePicker.tsx';

const latest = (entries: Entry[]) =>
	entries.reduce<string | undefined>((max, e) => (!max || e.updatedAt > max ? e.updatedAt : max), undefined);

/** The shared entries of one tool, read only; the server checks the access on every request. */
export function EntriesView({ toolId, onBack }: { toolId: string; onBack: () => void }) {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const { data, error } = useLoad(() => api.entries(toolId), [api, toolId]);
	const { m } = useI18n();
	const title = toolTexts(m, toolId).title;

	if (error && !data) {
		return (
			<div className="bt-stack">
				<BackButton onClick={onBack}>{m.entries.back}</BackButton>
				<Notice
					type="warning"
					title={error instanceof ApiError && error.status === 403 ? m.entries.noAccess : m.entries.loadError}
				>
					{error instanceof ApiError && error.status === 403 ? m.entries.revoked : m.common.tryLater}
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
	const i18n = useI18n();
	const { m, t } = i18n;
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
			const { blob, fileName } = await api.exportPdf(data.id, {
				...(exportRange ? range : {}),
				lang: i18n.lang
			});
			downloadBlob(blob, fileName);
		} catch (error) {
			host.notify({
				type: error instanceof ApiError && error.status === 403 ? 'warning' : 'error',
				text:
					error instanceof ApiError && error.status === 403 ? m.entries.exportRevoked : m.entries.exportFailed
			});
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>{m.entries.back}</BackButton>
			<div>
				<p className="bt-overline">{m.entries.readOnly}</p>
				<Headline level={2}>{title}</Headline>
				<p className="bt-muted bt-small">
					{[
						lastChange
							? t(m.entries.lastChangedOn, { date: i18n.date(lastChange, { withTime: true }) })
							: m.entries.noEntries,
						data.sharedSince ? t(m.entries.sharedSince, { date: i18n.date(data.sharedSince) }) : null
					]
						.filter(Boolean)
						.join(', ')}
				</p>
			</div>
			<div className="bt-row" style={{ alignItems: 'flex-end' }}>
				{exportRange && <DateRangePicker value={range} onChange={setRange} today={localToday()} />}
				<Button variant="secondary" disabled={exporting} onClick={exportPdf}>
					{exporting ? m.entries.exporting : exportRange ? m.entries.createExport : m.entries.exportPdf}
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
				<Notice type="info" title={m.entries.noView} />
			)}
		</div>
	);
}
