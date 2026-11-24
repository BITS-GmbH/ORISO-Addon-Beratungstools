import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, formatDay, formatDayLong, weekStart } from '../../../shared/days.ts';
import { Icon } from '../ui.tsx';

export interface DayRange {
	/** `YYYY-MM-DD`, or `''` for no limit. */
	from: string;
	to: string;
}

const MONTHS = [
	'Januar',
	'Februar',
	'März',
	'April',
	'Mai',
	'Juni',
	'Juli',
	'August',
	'September',
	'Oktober',
	'November',
	'Dezember'
];
const WEEKDAYS = [
	['Mo', 'Montag'],
	['Di', 'Dienstag'],
	['Mi', 'Mittwoch'],
	['Do', 'Donnerstag'],
	['Fr', 'Freitag'],
	['Sa', 'Samstag'],
	['So', 'Sonntag']
];

const monthOf = (day: string) => `${day.slice(0, 7)}-01`;

const shiftMonth = (month: string, by: number): string => {
	const [year, index] = month.split('-').map(Number) as [number, number];
	const total = year * 12 + index - 1 + by;
	return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}-01`;
};

/** The same day of the month `by` months away, kept within that month. */
const shiftDayByMonths = (day: string, by: number): string => {
	const month = shiftMonth(monthOf(day), by);
	const last = addDays(shiftMonth(month, 1), -1);
	const candidate = `${month.slice(0, 8)}${day.slice(8)}`;
	return candidate > last ? last : candidate;
};

const monthLabel = (month: string) => `${MONTHS[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;

/** Monday to Sunday rows covering the month. */
const weeksOf = (month: string): string[][] => {
	const next = shiftMonth(month, 1);
	const weeks: string[][] = [];
	for (let monday = weekStart(month); monday < next; monday = addDays(monday, 7)) {
		weeks.push(Array.from({ length: 7 }, (_, index) => addDays(monday, index)));
	}
	return weeks;
};

export const rangeLabel = ({ from, to }: DayRange): string => {
	if (!from && !to) {
		return 'Alle Einträge';
	}
	if (from && to) {
		return from === to ? formatDay(from) : `${formatDay(from)} bis ${formatDay(to)}`;
	}
	return from ? `ab ${formatDay(from)}` : `bis ${formatDay(to)}`;
};

/**
 * One field for a period: the first click in the calendar sets the start, the second the end.
 * The web kit has no range picker; this follows its outlined fields and the docked M3 calendar.
 */
export function DateRangePicker({
	value,
	onChange,
	today,
	label = 'Zeitraum'
}: {
	value: DayRange;
	onChange: (range: DayRange) => void;
	/** Latest day that can be picked. */
	today: string;
	label?: string;
}) {
	const id = useId();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const gridRef = useRef<HTMLTableElement>(null);
	const [open, setOpen] = useState(false);
	const [start, setStart] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [focused, setFocused] = useState(today);
	const [month, setMonth] = useState(monthOf(today));
	const focusPending = useRef(false);

	const close = (returnFocus = true) => {
		setOpen(false);
		setStart(null);
		setHovered(null);
		if (returnFocus) {
			triggerRef.current?.focus();
		}
	};

	const openCalendar = () => {
		const initial = value.to || value.from || today;
		setFocused(initial);
		setMonth(monthOf(initial));
		setStart(null);
		setOpen(true);
		focusPending.current = true;
	};

	useEffect(() => {
		if (!open) {
			return;
		}
		const onPointerDown = (event: MouseEvent) => {
			if (!wrapperRef.current?.contains(event.target as Node)) {
				setOpen(false);
				setStart(null);
			}
		};
		document.addEventListener('mousedown', onPointerDown);
		return () => document.removeEventListener('mousedown', onPointerDown);
	}, [open]);

	useEffect(() => {
		if (open && focusPending.current) {
			focusPending.current = false;
			gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focused}"]`)?.focus();
		}
	}, [open, focused, month]);

	const commit = (range: DayRange) => {
		onChange(range);
		close();
	};

	const pick = (day: string) => {
		if (start === null) {
			setStart(day);
			setFocused(day);
			return;
		}
		commit(day < start ? { from: day, to: start } : { from: start, to: day });
	};

	const focusDay = (day: string) => {
		const target = day > today ? today : day;
		setFocused(target);
		setMonth(monthOf(target));
		setHovered(start === null ? null : target);
		focusPending.current = true;
	};

	const onGridKey = (event: KeyboardEvent) => {
		const moves: Record<string, () => string> = {
			ArrowLeft: () => addDays(focused, -1),
			ArrowRight: () => addDays(focused, 1),
			ArrowUp: () => addDays(focused, -7),
			ArrowDown: () => addDays(focused, 7),
			Home: () => weekStart(focused),
			End: () => addDays(weekStart(focused), 6),
			PageUp: () => shiftDayByMonths(focused, -1),
			PageDown: () => shiftDayByMonths(focused, 1)
		};
		const move = moves[event.key];
		if (move) {
			event.preventDefault();
			focusDay(move());
		}
	};

	const shownStart = start ?? value.from;
	const shownEnd = start === null ? value.to : (hovered ?? start);
	const [low, high] =
		shownStart && shownEnd && shownEnd < shownStart ? [shownEnd, shownStart] : [shownStart, shownEnd];
	const inRange = (day: string) => Boolean(low && high && day >= low && day <= high);
	const isEdge = (day: string) => day === low || day === high;
	const nextMonthDisabled = shiftMonth(month, 1) > today;
	const tabbable = monthOf(focused) === month ? focused : month;

	return (
		<div
			className="bt-range"
			ref={wrapperRef}
			onBlur={(event) => {
				if (open && event.relatedTarget && !wrapperRef.current?.contains(event.relatedTarget as Node)) {
					close(false);
				}
			}}
		>
			<button
				ref={triggerRef}
				type="button"
				className="bt-range__field"
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={open ? `${id}-dialog` : undefined}
				onClick={() => (open ? close() : openCalendar())}
			>
				<span className="bt-range__text">
					<span className="bt-range__label">{label}</span>
					<span className="bt-range__value">{rangeLabel(value)}</span>
				</span>
				<Icon name="calendar" />
			</button>
			{open && (
				<div
					id={`${id}-dialog`}
					className="bt-range__popover"
					role="dialog"
					aria-label={`${label} wählen`}
					onKeyDown={(event) => {
						if (event.key === 'Escape') {
							event.preventDefault();
							close();
						}
					}}
				>
					<div className="bt-range__quick" role="group" aria-label="Schnellauswahl">
						<button
							type="button"
							className="bt-chip"
							onClick={() => commit({ from: weekStart(today), to: today })}
						>
							Diese Woche
						</button>
						<button
							type="button"
							className="bt-chip"
							onClick={() => commit({ from: addDays(today, -27), to: today })}
						>
							Letzte 4 Wochen
						</button>
						<button type="button" className="bt-chip" onClick={() => commit({ from: '', to: '' })}>
							Alle Einträge
						</button>
					</div>
					<div className="bt-range__month">
						<button
							type="button"
							className="bt-iconbtn"
							aria-label="Vorheriger Monat"
							title="Vorheriger Monat"
							onClick={() => setMonth(shiftMonth(month, -1))}
						>
							<Icon name="previous" />
						</button>
						<span className="bt-range__monthlabel" aria-live="polite" id={`${id}-month`}>
							{monthLabel(month)}
						</span>
						<button
							type="button"
							className="bt-iconbtn"
							aria-label="Nächster Monat"
							title="Nächster Monat"
							disabled={nextMonthDisabled}
							onClick={() => setMonth(shiftMonth(month, 1))}
						>
							<Icon name="next" />
						</button>
					</div>
					<table
						ref={gridRef}
						className="bt-range__grid"
						role="grid"
						aria-labelledby={`${id}-month`}
						onKeyDown={onGridKey}
						onMouseLeave={() => setHovered(null)}
					>
						<thead>
							<tr>
								{WEEKDAYS.map(([short, long]) => (
									<th key={short} scope="col" abbr={long}>
										{short}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{weeksOf(month).map((week) => (
								<tr key={week[0]}>
									{week.map((day) => {
										const outside = monthOf(day) !== month;
										const selected = inRange(day);
										const classes = [
											'bt-range__day',
											outside ? 'is-outside' : '',
											selected ? 'is-in-range' : '',
											selected && isEdge(day) ? 'is-edge' : '',
											day === low ? 'is-start' : '',
											day === high ? 'is-end' : '',
											day === today ? 'is-today' : ''
										]
											.filter(Boolean)
											.join(' ');
										return (
											<td key={day} role="gridcell" aria-selected={selected} className={classes}>
												{!outside && (
													<button
														type="button"
														data-day={day}
														tabIndex={day === tabbable ? 0 : -1}
														disabled={day > today}
														aria-label={formatDayLong(day)}
														aria-current={day === today ? 'date' : undefined}
														onClick={() => pick(day)}
														onMouseEnter={() => start !== null && setHovered(day)}
														onFocus={() => setFocused(day)}
													>
														{Number(day.slice(8))}
													</button>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
					<p className="bt-small bt-muted" aria-live="polite">
						{start === null
							? 'Ersten Tag des Zeitraums wählen.'
							: `Ab ${formatDay(start)}: jetzt den letzten Tag wählen.`}
					</p>
				</div>
			)}
		</div>
	);
}
