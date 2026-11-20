import { Card } from '@oriso/web-kit';
import { useMemo } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	ARGUMENT_KIND,
	calculate,
	CATEGORIES,
	CONCLUSION_KIND,
	formatValue,
	polesOf,
	ratingLabel,
	tendency,
	type Argument,
	type CategoryId
} from '../../../../shared/tools/balance.ts';
import { Icon } from '../../ui.tsx';
import { Scale } from './Scale.tsx';

export type Item = Argument & { id: string; entry: Entry };

export const argumentsOf = (entries: Entry[]): Item[] =>
	entries
		.filter((e) => e.kind === ARGUMENT_KIND)
		.map((e) => ({ ...(e.data as Argument), id: e.id, entry: e }));

export const conclusionOf = (entries: Entry[]): Entry | undefined =>
	entries.find((e) => e.kind === CONCLUSION_KIND);

export function Stars({ rating, zero = 'nicht wichtig' }: { rating: number; zero?: string }) {
	if (rating === 0) {
		return (
			<span className="bt-stars bt-stars--zero" title={ratingLabel(0)}>
				{zero}
			</span>
		);
	}
	return (
		<span className="bt-stars" role="img" aria-label={ratingLabel(rating)} title={ratingLabel(rating)}>
			{[1, 2, 3].map((n) => (
				<svg key={n} viewBox="0 0 24 24" className={n <= rating ? undefined : 'is-off'} aria-hidden>
					<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
				</svg>
			))}
		</span>
	);
}

export function SideBadge({ category }: { category: CategoryId }) {
	const side = CATEGORIES[category].side;
	return <span className={`bt-side bt-side--${side}`}>{side === 'pro' ? 'PRO' : 'CONTRA'}</span>;
}

export function ScaleCard({ items, poles, hint }: { items: Item[]; poles: unknown; hint: string }) {
	const result = useMemo(() => calculate(items), [items]);
	const active = result.value !== null;
	const tone =
		!active || Math.abs(result.value ?? 0) < 0.05
			? ''
			: (result.value ?? 0) > 0
				? 'bt-value--pro'
				: 'bt-value--contra';
	return (
		<Card>
			<section className="bt-stack bt-stack--tight" aria-label="Ergebnis der Motivationswaage">
				<div className={`bt-scale${active ? '' : ' bt-scale--inactive'}`}>
					<Scale
						result={result}
						poles={polesOf(poles)}
						title={
							active
								? `Motivationswaage: ${formatValue(result.value)}, ${tendency(result.value)}`
								: 'Motivationswaage: noch inaktiv'
						}
					/>
				</div>
				<div className="bt-row" style={{ justifyContent: 'center' }}>
					{active ? (
						<>
							<span className={`bt-value ${tone}`}>{formatValue(result.value)}</span>
							<span className="bt-title">{tendency(result.value)}</span>
						</>
					) : (
						<span className="bt-muted">
							{items.length > 0
								? 'Alle Argumente sind mit „gar nicht wichtig“ bewertet, die Waage bleibt deshalb noch inaktiv.'
								: hint}
						</span>
					)}
				</div>
				{active && (
					<div className="bt-row" style={{ justifyContent: 'center' }}>
						<span className="bt-sum bt-sum--pro">
							PRO {result.pro} {result.pro === 1 ? 'Punkt' : 'Punkte'}
						</span>
						<span className="bt-sum bt-sum--contra">
							CONTRA {result.contra} {result.contra === 1 ? 'Punkt' : 'Punkte'}
						</span>
					</div>
				)}
			</section>
		</Card>
	);
}

export function MiniResult({ items }: { items: Item[] }) {
	const result = calculate(items);
	return (
		<div className="bt-mini" aria-live="polite">
			<span className="bt-small bt-muted">PRO</span>
			<div className="bt-mini__bar" aria-hidden>
				{result.value !== null && (
					<span className="bt-mini__dot" style={{ left: `${((10 - result.value) / 20) * 100}%` }} />
				)}
			</div>
			<span className="bt-small bt-muted">CONTRA</span>
			<span className="bt-small" style={{ fontWeight: 600, minWidth: '11em' }}>
				{result.value !== null
					? `${formatValue(result.value)}, ${tendency(result.value)}`
					: 'Waage noch inaktiv'}
			</span>
		</div>
	);
}

export const IconButton = ({
	icon,
	label,
	onClick
}: {
	icon: 'edit' | 'delete';
	label: string;
	onClick: () => void;
}) => (
	<button
		type="button"
		className="bt-iconbtn"
		title={label.split(':')[0]}
		aria-label={label}
		onClick={onClick}
	>
		<Icon name={icon} />
	</button>
);
