import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlannedActivities } from '../src/core/PlannedActivities.tsx';

describe('planned activities in the diaries', () => {
	it('stays hidden while "Aktiv sein" is not released', () => {
		const { container } = render(<PlannedActivities linked={{}} monday="2026-11-23" onPlan={() => {}} />);
		expect(container.textContent).toBe('');
	});

	it('offers to plan activities in "Aktiv sein" when the week is empty', () => {
		const onPlan = vi.fn();
		render(<PlannedActivities linked={{ active: [] }} monday="2026-11-23" onPlan={onPlan} />);
		expect(screen.getByText(/keine Aktivitäten geplant/)).toBeTruthy();
		fireEvent.click(screen.getByText('Aktivitäten in „Aktiv sein“ planen'));
		expect(onPlan).toHaveBeenCalled();
	});

	it('shows no planning link to counsellors', () => {
		render(<PlannedActivities linked={{ active: [] }} monday="2026-11-23" />);
		expect(screen.queryByText('Aktivitäten in „Aktiv sein“ planen')).toBeNull();
	});
});
