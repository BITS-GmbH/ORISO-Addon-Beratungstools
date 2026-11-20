import { formatDate, Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { behavioursOf } from './parts.tsx';

/** The tool description has no counsellor view; this lists the saved behaviours, read only. */
export function PositivePerceptionCounsellor({ entries, isNew, locale }: CounsellorViewProps) {
	const items = behavioursOf(entries);
	return (
		<div className="bt-stack bt-stack--tight">
			<p className="bt-title">Verhaltensweisen und Aktivitäten, die gelobt werden sollen</p>
			{items.length === 0 ? (
				<p className="bt-muted">Noch keine Einträge.</p>
			) : (
				<ul className="bt-list">
					{items.map((item) => (
						<li key={item.id} className={`bt-entry${isNew(item.entry) ? ' bt-entry--new' : ''}`}>
							<div
								className="bt-row bt-row--between"
								style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}
							>
								<span className="bt-item__text">{item.text}</span>
								{isNew(item.entry) && <Pill tone="new">Neu</Pill>}
							</div>
							<p className="bt-muted bt-small">
								Zuletzt geändert am {formatDate(item.entry.updatedAt, locale, true)}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
