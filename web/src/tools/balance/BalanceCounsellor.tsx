import { Card } from '@oriso/web-kit';
import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import { CATEGORIES, HALVES, ratingLabel } from '../../../../shared/tools/balance.ts';
import { useI18n } from '../../host.ts';
import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { argumentsOf, conclusionOf, ScaleCard, SideBadge, Stars, type Item } from './parts.tsx';

/** Read only: scale, conclusion and the four lists as cards with relevance and "Öffnen" (section 2.4). */
export function BalanceCounsellor({ entries, options, isNew }: CounsellorViewProps) {
	const { m, t } = useI18n();
	const texts = m.balance;
	const items = argumentsOf(entries);
	const conclusion = conclusionOf(entries);
	return (
		<div className="bt-stack">
			<ScaleCard items={items} poles={options.poles} hint={texts.counsellor.noArguments} />
			<Card>
				<div className="bt-stack bt-stack--tight">
					<div className="bt-row bt-row--between">
						<h3 className="bt-title">{texts.counsellor.conclusion}</h3>
						{conclusion && isNew(conclusion) && <Pill tone="new">{texts.counsellor.new}</Pill>}
					</div>
					{conclusion ? (
						<p className="bt-pre">{(conclusion.data as { text: string }).text}</p>
					) : (
						<p className="bt-muted">{texts.counsellor.noConclusion}</p>
					)}
				</div>
			</Card>
			{(['change', 'keep'] as const).map((half) => (
				<Card key={half}>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">{texts.halves[half]}</h3>
						<div className="bt-columns">
							{HALVES[half].map((category) => (
								<div key={category} className="bt-column">
									<div className="bt-row bt-row--between">
										<strong>{t(texts.categoryInHalf, { title: texts.categories[category].title })}</strong>
										<SideBadge category={category} />
									</div>
									<EntryCards items={items.filter((item) => item.category === category)} isNew={isNew} />
								</div>
							))}
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}

function EntryCards({ items, isNew }: { items: Item[]; isNew: (entry: Entry) => boolean }) {
	const i18n = useI18n();
	const { m, t } = i18n;
	const texts = m.balance.counsellor;
	const [open, setOpen] = useState<string | null>(null);
	if (items.length === 0) {
		return <p className="bt-muted bt-small">{texts.noEntries}</p>;
	}
	return (
		<ul className="bt-list">
			{items.map((item) => {
				const expanded = open === item.id;
				const fresh = isNew(item.entry);
				const { side } = CATEGORIES[item.category];
				return (
					<li key={item.id} className={`bt-entry${fresh ? ' bt-entry--new' : ''}`}>
						<div className="bt-row bt-row--between" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
							<span className={`bt-item__text${expanded ? '' : ' bt-clamp'}`}>{item.text}</span>
							{fresh && <Pill tone="new">{texts.new}</Pill>}
						</div>
						<div className="bt-row bt-row--between">
							<Stars rating={item.rating} />
							<button
								type="button"
								className="bt-linkbtn bt-small"
								aria-expanded={expanded}
								onClick={() => setOpen(expanded ? null : item.id)}
							>
								{expanded ? texts.close : texts.open}
							</button>
						</div>
						{expanded && (
							<dl className="bt-details">
								<dt>{texts.category}</dt>
								<dd>
									{t(m.balance.categoryWithSide, {
										category: m.balance.categories[item.category].long,
										side: m.balance.sides[side]
									})}
								</dd>
								<dt>{texts.relevance}</dt>
								<dd>
									{t(texts.relevanceValue, {
										label: ratingLabel(item.rating, m),
										count: item.rating
									})}
								</dd>
								<dt>{texts.lastChanged}</dt>
								<dd>{i18n.date(item.entry.updatedAt, { withTime: true })}</dd>
							</dl>
						)}
					</li>
				);
			})}
		</ul>
	);
}
