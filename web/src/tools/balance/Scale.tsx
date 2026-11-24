import { useId } from 'react';
import type { BalanceResult } from '../../../../shared/tools/balance.ts';
import { useI18n } from '../../host.ts';

const PIVOT = { x: 320, y: 70 };
const HALF_BEAM = 210;
const MAX_TILT = 12;
const DIAL = { x: 320, y: 300, r: 62 };

interface PanProps {
	x: number;
	y: number;
	side: 'pro' | 'contra';
	points: number;
	label: string;
	active: boolean;
}

const Pan = ({ x, y, side, points, label, active }: PanProps) => {
	const stroke = side === 'pro' ? 'var(--bt-primary)' : 'var(--bt-contra)';
	return (
		<g className="bt-pan" style={{ transform: `translate(${x}px, ${y}px)` }}>
			<path
				d="M0 0 L-66 98 M0 0 L66 98"
				stroke="var(--bt-muted)"
				strokeWidth={2}
				fill="none"
				strokeLinecap="round"
			/>
			<circle r={6} fill="var(--bt-muted)" />
			<path
				d="M-80 98 Q0 156 80 98 Z"
				fill={`var(--bt-${side === 'pro' ? 'primary' : 'contra'}-soft)`}
				stroke={stroke}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			{active && (
				<text y={122} textAnchor="middle" fontSize={20} fontWeight={700} fill={stroke}>
					{points}
				</text>
			)}
			<text y={158} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--bt-text)">
				{label}
			</text>
		</g>
	);
};

const tick = (value: number, length: number) => {
	const angle = ((value / 10) * 90 - 90) * (Math.PI / 180);
	const outer = DIAL.r - 6;
	return {
		x1: DIAL.x + Math.cos(angle) * outer,
		y1: DIAL.y + Math.sin(angle) * outer,
		x2: DIAL.x + Math.cos(angle) * (outer - length),
		y2: DIAL.y + Math.sin(angle) * (outer - length)
	};
};

/**
 * The scale: a beam that tips towards the heavier side and a dial whose needle shows the value
 * (−10 … +10). PRO on the left, CONTRA on the right, as in the tool description's figure; level
 * and without a needle while inactive.
 */
export function Scale({
	result,
	poles,
	title
}: {
	result: BalanceResult;
	poles: { contra: string; pro: string };
	title: string;
}) {
	const { sides } = useI18n().m.balance;
	const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
	const active = result.value !== null;
	const value = result.value ?? 0;
	const tilt = -(value / 10) * MAX_TILT;
	const radians = (tilt * Math.PI) / 180;
	const dx = Math.cos(radians) * HALF_BEAM;
	const dy = Math.sin(radians) * HALF_BEAM;

	return (
		<svg viewBox="0 6 640 334" role="img" aria-label={title}>
			<defs>
				<linearGradient id={`${id}-dial`} x1={0} x2={1} y1={0} y2={0}>
					<stop offset="0%" stopColor="var(--bt-primary)" />
					<stop offset="50%" stopColor="var(--bt-surface-high)" />
					<stop offset="100%" stopColor="var(--bt-contra)" />
				</linearGradient>
			</defs>
			<ellipse cx={320} cy={334} rx={150} ry={6} fill="var(--bt-outline-soft)" />
			<path d="M236 330 L404 330 L382 306 L258 306 Z" fill="var(--bt-muted)" />
			<rect x={313} y={PIVOT.y} width={14} height={240} rx={4} fill="var(--bt-muted)" />
			<circle cx={PIVOT.x} cy={PIVOT.y - 22} r={11} fill="var(--bt-muted)" />
			<g
				className="bt-beam"
				style={{ transform: `rotate(${tilt}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}
			>
				<rect
					x={PIVOT.x - HALF_BEAM - 6}
					y={PIVOT.y - 6}
					width={2 * HALF_BEAM + 12}
					height={12}
					rx={6}
					fill="var(--bt-text)"
				/>
			</g>
			<circle
				cx={PIVOT.x}
				cy={PIVOT.y}
				r={10}
				fill="var(--bt-surface)"
				stroke="var(--bt-text)"
				strokeWidth={4}
			/>
			<Pan
				x={PIVOT.x - dx}
				y={PIVOT.y - dy}
				side="pro"
				points={result.pro}
				label={poles.pro}
				active={active}
			/>
			<Pan
				x={PIVOT.x + dx}
				y={PIVOT.y + dy}
				side="contra"
				points={result.contra}
				label={poles.contra}
				active={active}
			/>
			<path
				d={`M${DIAL.x - DIAL.r} ${DIAL.y} A${DIAL.r} ${DIAL.r} 0 0 1 ${DIAL.x + DIAL.r} ${DIAL.y} Z`}
				fill="var(--bt-surface)"
				stroke="var(--bt-muted)"
				strokeWidth={3}
			/>
			<path
				d={`M${DIAL.x - DIAL.r + 6} ${DIAL.y} A${DIAL.r - 6} ${DIAL.r - 6} 0 0 1 ${DIAL.x + DIAL.r - 6} ${DIAL.y}`}
				fill="none"
				stroke={`url(#${id}-dial)`}
				strokeWidth={7}
				strokeLinecap="round"
			/>
			<text
				x={DIAL.x - DIAL.r - 8}
				y={DIAL.y - 4}
				textAnchor="end"
				fontSize={13}
				fontWeight={700}
				fill="var(--bt-primary)"
			>
				{sides.pro}
			</text>
			<text
				x={DIAL.x + DIAL.r + 8}
				y={DIAL.y - 4}
				textAnchor="start"
				fontSize={13}
				fontWeight={700}
				fill="var(--bt-contra)"
			>
				{sides.contra}
			</text>
			{[-10, -5, 0, 5, 10].map((v) => (
				<line
					key={v}
					{...tick(v, v === 0 ? 14 : 9)}
					stroke="var(--bt-text)"
					strokeWidth={2}
					strokeLinecap="round"
				/>
			))}
			{active && (
				<g
					className="bt-needle"
					style={{
						transform: `rotate(${-(value / 10) * 90}deg)`,
						transformOrigin: `${DIAL.x}px ${DIAL.y}px`
					}}
				>
					<path
						d={`M${DIAL.x - 3.5} ${DIAL.y} L${DIAL.x} ${DIAL.y - DIAL.r + 12} L${DIAL.x + 3.5} ${DIAL.y} Z`}
						fill="var(--bt-text)"
					/>
				</g>
			)}
			<circle cx={DIAL.x} cy={DIAL.y} r={6} fill="var(--bt-text)" />
		</svg>
	);
}
