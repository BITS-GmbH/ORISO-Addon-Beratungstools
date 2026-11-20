import { Card } from '@oriso/web-kit';
import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import { CATEGORIES, HALF_TEXT, HALVES, ratingLabel } from '../../../../shared/tools/balance.ts';
import { formatDate, Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { argumentsOf, conclusionOf, ScaleCard, SideBadge, Stars, type Item } from './parts.tsx';

/** Read only: scale, conclusion and the four lists as cards with relevance and "Öffnen" (section 2.4). */
export function BalanceCounsellor({ entries, options, isNew, locale }: CounsellorViewProps) {
	const items = argumentsOf(entries);
	const conclusion = conclusionOf(entries);
	return (
		<div className="bt-stack">
			<ScaleCard items={items} poles={options.poles} hint="Noch keine Argumente eingetragen." />
			<Card>
				<div className="bt-stack bt-stack--tight">
					<div className="bt-row bt-row--between">
						<h3 className="bt-title">Fazit</h3>
						{conclusion && isNew(conclusion) && <Pill tone="new">Neu</Pill>}
					</div>
					{conclusion ? (
						<p className="bt-pre">{(conclusion.data as { text: string }).text}</p>
					) : (
						<p className="bt-muted">Noch kein Fazit eingetragen.</p>
					)}
				</div>
			</Card>
			{(['change', 'keep'] as const).map((half) => (
				<Card key={half}>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">{HALF_TEXT[half]}</h3>
						<div className="bt-columns">
							{HALVES[half].map((category) => (
								<div key={category} className="bt-column">
									<div className="bt-row bt-row--between">
										<strong>… {CATEGORIES[category].title}</strong>
										<SideBadge category={category} />
									</div>
									<EntryCards
										items={items.filter((item) => item.category === category)}
										isNew={isNew}
										locale={locale}
									/>
								</div>
							))}
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}

function EntryCards({
	items,
	isNew,
	locale
}: {
	items: Item[];
	isNew: (entry: Entry) => boolean;
	locale: string;
}) {
	const [open, setOpen] = useState<string | null>(null);
	if (items.length === 0) {
		return <p className="bt-muted bt-small">Keine Einträge.</p>;
	}
	return (
		<ul className="bt-list">
			{items.map((item) => {
				const expanded = open === item.id;
				const fresh = isNew(item.entry);
				const { long, side } = CATEGORIES[item.category];
				return (
					<li key={item.id} className={`bt-entry${fresh ? ' bt-entry--new' : ''}`}>
						<div className="bt-row bt-row--between" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
							<span className={`bt-item__text${expanded ? '' : ' bt-clamp'}`}>{item.text}</span>
							{fresh && <Pill tone="new">Neu</Pill>}
						</div>
						<div className="bt-row bt-row--between">
							<Stars rating={item.rating} />
							<button
								type="button"
								className="bt-linkbtn bt-small"
								aria-expanded={expanded}
								onClick={() => setOpen(expanded ? null : item.id)}
							>
								{expanded ? 'Schließen' : 'Öffnen'}
							</button>
						</div>
						{expanded && (
							<dl className="bt-details">
								<dt>Kategorie</dt>
								<dd>
									{long} ({side === 'pro' ? 'PRO' : 'CONTRA'})
								</dd>
								<dt>Relevanz</dt>
								<dd>
									{ratingLabel(item.rating)} ({item.rating} {item.rating === 1 ? 'Punkt' : 'Punkte'})
								</dd>
								<dt>Zuletzt geändert</dt>
								<dd>{formatDate(item.entry.updatedAt, locale, true)}</dd>
							</dl>
						)}
					</li>
				);
			})}
		</ul>
	);
}
