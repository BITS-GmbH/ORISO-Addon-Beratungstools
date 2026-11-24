import { useI18n } from '../../host.ts';
import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { behavioursOf } from './parts.tsx';

/** The tool description has no counsellor view; this lists the saved behaviours, read only. */
export function PositivePerceptionCounsellor({ entries, isNew }: CounsellorViewProps) {
	const { m, t, date } = useI18n();
	const texts = m.positivePerception;
	const items = behavioursOf(entries);
	return (
		<div className="bt-stack bt-stack--tight">
			<p className="bt-title">{texts.counsellorTitle}</p>
			{items.length === 0 ? (
				<p className="bt-muted">{texts.noEntries}</p>
			) : (
				<ul className="bt-list">
					{items.map((item) => (
						<li key={item.id} className={`bt-entry${isNew(item.entry) ? ' bt-entry--new' : ''}`}>
							<div
								className="bt-row bt-row--between"
								style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}
							>
								<span className="bt-item__text">{item.text}</span>
								{isNew(item.entry) && <Pill tone="new">{texts.new}</Pill>}
							</div>
							<p className="bt-muted bt-small">
								{t(texts.lastChanged, { date: date(item.entry.updatedAt, { withTime: true }) })}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
