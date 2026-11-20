import { Button } from '@oriso/web-kit';
import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import { relapsesOf, situationsOf, type RelapseItem } from '../../../../shared/tools/risk-situations.ts';
import { formatDate, Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { DifficultyBadge, RelapseDetails } from './parts.tsx';

const PAGE_SIZE = 5;

/** Read only: one card per risk situation with difficulty, strategy, the last relapse and all relapses. */
export function RiskCounsellor({ entries, isNew, locale }: CounsellorViewProps) {
	const situations = situationsOf(entries);
	const [page, setPage] = useState(0);
	if (situations.length === 0) {
		return <p className="bt-muted">Noch keine Risikosituationen eingetragen.</p>;
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
							{fresh && <Pill tone="new">Neu</Pill>}
						</div>
						<div>
							<span className="bt-overline">Risikosituation</span>
							<p className="bt-pre">{item.situation}</p>
						</div>
						<div>
							<span className="bt-overline">Kontrollstrategie</span>
							<p className={`bt-pre${item.strategy ? '' : ' bt-muted'}`}>
								{item.strategy || 'Noch keine Strategie'}
							</p>
						</div>
						<Relapses relapses={relapses} isNew={isNew} locale={locale} />
						<p className="bt-muted bt-small">
							Zuletzt geändert am {formatDate(item.entry.updatedAt, locale, true)}
						</p>
					</div>
				);
			})}
			{pages > 1 && (
				<nav className="bt-row bt-row--between" aria-label="Seiten">
					<Button variant="secondary" disabled={current === 0} onClick={() => setPage(current - 1)}>
						Zurück
					</Button>
					<span className="bt-small bt-muted">
						Seite {current + 1} von {pages}
					</span>
					<Button variant="secondary" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
						Weiter
					</Button>
				</nav>
			)}
		</div>
	);
}

function Relapses({
	relapses,
	isNew,
	locale
}: {
	relapses: RelapseItem[];
	isNew: (entry: Entry) => boolean;
	locale: string;
}) {
	const [all, setAll] = useState(false);
	const [last, ...earlier] = relapses;
	if (!last) {
		return <p className="bt-muted bt-small">Kein Rückfall dokumentiert.</p>;
	}
	return (
		<>
			<div className="bt-quote">
				<div className="bt-row bt-row--between">
					<strong>Letzter Rückfall, analysiert am {formatDate(last.entry.createdAt, locale)}</strong>
					{isNew(last.entry) && <Pill tone="new">Neu</Pill>}
				</div>
				<RelapseDetails relapse={last} />
			</div>
			{earlier.length > 0 && (
				<div className="bt-stack bt-stack--tight">
					<div>
						<button type="button" className="bt-linkbtn" aria-expanded={all} onClick={() => setAll(!all)}>
							{all ? 'Frühere Rückfälle ausblenden' : `Alle Rückfälle (${relapses.length})`}
						</button>
					</div>
					{all &&
						earlier.map((relapse) => (
							<div key={relapse.id} className="bt-entry">
								<div className="bt-row bt-row--between">
									<strong>Analysiert am {formatDate(relapse.entry.createdAt, locale)}</strong>
									{isNew(relapse.entry) && <Pill tone="new">Neu</Pill>}
								</div>
								<RelapseDetails relapse={relapse} />
							</div>
						))}
				</div>
			)}
		</>
	);
}
