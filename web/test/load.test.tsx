import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLoad } from '../src/ui.tsx';

const Shows = ({ id, load }: { id: string; load: (id: string) => Promise<string> }) => {
	const { data } = useLoad(() => load(id), [id]);
	return <p>{data ?? 'loading'}</p>;
};

describe('useLoad', () => {
	it('loads again when its inputs change and drops the answer for the old ones', async () => {
		const pending = new Map<string, (value: string) => void>();
		const load = (id: string) => new Promise<string>((resolve) => pending.set(id, resolve));
		const { rerender } = render(<Shows id="diary" load={load} />);
		await waitFor(() => expect(pending.has('diary')).toBe(true));
		rerender(<Shows id="active" load={load} />);
		await waitFor(() => expect(pending.has('active')).toBe(true));
		pending.get('active')?.('active data');
		expect(await screen.findByText('active data')).toBeTruthy();
		pending.get('diary')?.('diary data');
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(screen.queryByText('diary data')).toBeNull();
		expect(screen.getByText('active data')).toBeTruthy();
	});

	it('never shows the data of the old inputs while the new ones load', async () => {
		const load = (id: string) =>
			id === 'diary' ? Promise.resolve('diary data') : new Promise<string>(() => {});
		const { rerender } = render(<Shows id="diary" load={load} />);
		expect(await screen.findByText('diary data')).toBeTruthy();
		rerender(<Shows id="active" load={load} />);
		expect(screen.getByText('loading')).toBeTruthy();
	});
});
