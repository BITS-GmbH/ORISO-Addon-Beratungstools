import { Button } from '@oriso/web-kit';
import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import { relapsesOf, situationsOf, type RelapseItem } from '../../../../shared/tools/risk-situations.ts';
import { useI18n } from '../../host.ts';
import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { DifficultyBadge, RelapseDetails } from './parts.tsx';

const PAGE_SIZE = 5;

/** Read only: one card per risk situation with difficulty, strategy, the last relapse and all relapses. */
export function RiskCounsellor({ entries, isNew }: CounsellorViewProps) {
	const i18n = useI18n();
	const texts = i18n.m.riskSituations;
	const situations = situationsOf(entries);
	const [page, setPage] = useState(0);
	if (situations.length === 0) {
		return <p className="bt-muted">{texts.noSituations}</p>;
	}
	const pages = Math.ceil(situations.length / PAGE_SIZE);
	const current = Math.min(page, pages - 1);
	return (
		<div className="bt-stack">
			{situations.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map((item) => {
				const relapses = relapsesOf(entries, item.id);
				const fresh = isNew(item.entry) || relapses.some((relapse) => isNew(relapse.entry));
				return (
					<div key={item.id} className={`bt-entry bt-stack bt-stack--tight${fresh ? ' bt-entry--new' : ''}`}>
						<div className="bt-row bt-row--between" style={{ alignItems: 'flex-start' }}>
							<DifficultyBadge value={item.difficulty} />
							{fresh && <Pill tone="new">{texts.new}</Pill>}
						</div>
						<div>
							<span className="bt-overline">{texts.columns.situation}</span>
							<p className="bt-pre">{item.situation}</p>
						</div>
						<div>
							<span className="bt-overline">{texts.columns.strategy}</span>
							<p className={`bt-pre${item.strategy ? '' : ' bt-muted'}`}>
								{item.strategy || texts.noStrategy}
							</p>
						</div>
						<Relapses relapses={relapses} isNew={isNew} />
						<p className="bt-muted bt-small">
							{i18n.t(texts.lastChanged, { date: i18n.date(item.entry.updatedAt, { withTime: true }) })}
						</p>
					</div>
				);
			})}
			{pages > 1 && (
				<nav className="bt-row bt-row--between" aria-label={texts.pages}>
					<Button variant="secondary" disabled={current === 0} onClick={() => setPage(current - 1)}>
						{texts.previousPage}
					</Button>
					<span className="bt-small bt-muted">{i18n.t(texts.pageOf, { page: current + 1, pages })}</span>
					<Button variant="secondary" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
						{texts.nextPage}
					</Button>
				</nav>
			)}
		</div>
	);
}

function Relapses({ relapses, isNew }: { relapses: RelapseItem[]; isNew: (entry: Entry) => boolean }) {
	const i18n = useI18n();
	const texts = i18n.m.riskSituations;
	const [all, setAll] = useState(false);
	const [last, ...earlier] = relapses;
	if (!last) {
		return <p className="bt-muted bt-small">{texts.noRelapse}</p>;
	}
	return (
		<>
			<div className="bt-quote">
				<div className="bt-row bt-row--between">
					<strong>{i18n.t(texts.lastRelapse, { date: i18n.date(last.entry.createdAt) })}</strong>
					{isNew(last.entry) && <Pill tone="new">{texts.new}</Pill>}
				</div>
				<RelapseDetails relapse={last} />
			</div>
			{earlier.length > 0 && (
				<div className="bt-stack bt-stack--tight">
					<div>
						<button type="button" className="bt-linkbtn" aria-expanded={all} onClick={() => setAll(!all)}>
							{all ? texts.hideEarlierRelapses : i18n.t(texts.showAllRelapses, { count: relapses.length })}
						</button>
					</div>
					{all &&
						earlier.map((relapse) => (
							<div key={relapse.id} className="bt-entry">
								<div className="bt-row bt-row--between">
									<strong>{i18n.t(texts.analysedOn, { date: i18n.date(relapse.entry.createdAt) })}</strong>
									{isNew(relapse.entry) && <Pill tone="new">{texts.new}</Pill>}
								</div>
								<RelapseDetails relapse={relapse} />
							</div>
						))}
				</div>
			)}
		</>
	);
}
