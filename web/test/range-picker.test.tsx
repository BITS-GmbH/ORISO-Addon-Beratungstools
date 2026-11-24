import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker, type DayRange } from '../src/core/DateRangePicker.tsx';

const today = '2026-11-24';

const Picker = ({ onChange }: { onChange: (range: DayRange) => void }) => {
	const [range, setRange] = useState<DayRange>({ from: '', to: '' });
	return (
		<div className="bt">
			<DateRangePicker
				value={range}
				today={today}
				onChange={(next) => {
					setRange(next);
					onChange(next);
				}}
			/>
		</div>
	);
};

const field = () => screen.getByRole('button', { name: /^Zeitraum/ });
const day = (label: string) => screen.getByRole('button', { name: label });

describe('Zeitraum', () => {
	it('picks a range with two clicks, in either order', () => {
		const onChange = vi.fn();
		render(<Picker onChange={onChange} />);
		expect(field().textContent).toContain('Alle Einträge');
		fireEvent.click(field());
		expect(screen.getByRole('dialog', { name: 'Zeitraum wählen' })).toBeTruthy();
		expect(screen.getByText('November 2026')).toBeTruthy();
		expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual([
			'Mo',
			'Di',
			'Mi',
			'Do',
			'Fr',
			'Sa',
			'So'
		]);
		fireEvent.click(day('Dienstag, 10.11.2026'));
		expect(onChange).not.toHaveBeenCalled();
		fireEvent.click(day('Dienstag, 03.11.2026'));
		expect(onChange).toHaveBeenCalledWith({ from: '2026-11-03', to: '2026-11-10' });
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(field().textContent).toContain('03.11. bis 10.11.2026');
	});

	it('offers quick choices and no days after today', () => {
		const onChange = vi.fn();
		render(<Picker onChange={onChange} />);
		fireEvent.click(field());
		expect((day('Mittwoch, 25.11.2026') as HTMLButtonElement).disabled).toBe(true);
		expect((screen.getByLabelText('Nächster Monat') as HTMLButtonElement).disabled).toBe(true);
		fireEvent.click(screen.getByText('Diese Woche'));
		expect(onChange).toHaveBeenLastCalledWith({ from: '2026-11-23', to: '2026-11-24' });
		fireEvent.click(field());
		fireEvent.click(screen.getByText('Letzte 4 Wochen'));
		expect(onChange).toHaveBeenLastCalledWith({ from: '2026-10-28', to: '2026-11-24' });
		fireEvent.click(field());
		fireEvent.click(screen.getByText('Alle Einträge', { selector: 'button' }));
		expect(onChange).toHaveBeenLastCalledWith({ from: '', to: '' });
	});

	it('is usable with the keyboard', () => {
		const onChange = vi.fn();
		render(<Picker onChange={onChange} />);
		fireEvent.click(field());
		expect(document.activeElement).toBe(day('Dienstag, 24.11.2026'));
		fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
		expect(document.activeElement).toBe(day('Montag, 23.11.2026'));
		fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
		expect(screen.getByText('Oktober 2026')).toBeTruthy();
		expect(document.activeElement).toBe(day('Freitag, 23.10.2026'));
		fireEvent.click(document.activeElement!);
		fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
		fireEvent.click(document.activeElement!);
		expect(onChange).toHaveBeenCalledWith({ from: '2026-10-23', to: '2026-10-30' });
		expect(document.activeElement).toBe(field());
		fireEvent.click(field());
		fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(document.activeElement).toBe(field());
	});
});
