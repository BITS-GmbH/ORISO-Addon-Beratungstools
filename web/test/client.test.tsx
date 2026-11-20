import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClientApp } from '../src/core/ClientApp.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

const goalsTool = (entries: unknown[] = []) => ({
	id: 'goals',
	demo: false,
	shared: false,
	allowSharing: true,
	options: { intro: '' },
	entries
});

describe('Meine Tools', () => {
	it('tells the client when nothing is released yet, in the right form of address', async () => {
		const { host } = fakeHost({ 'GET /me/tools': () => ({ tools: [] }) }, { informal: true });
		renderWith(host, <ClientApp />);
		expect(await screen.findByText(/Sprich sie oder ihn gern darauf an/)).toBeTruthy();
	});

	it('lists released tools and opens one with the share switch', async () => {
		const { host, calls } = fakeHost({
			'GET /me/tools': () => ({
				tools: [
					{ id: 'goals', releasedAt: '2026-11-20T09:00:00Z', opened: false, shared: false, hasEntries: false }
				]
			}),
			'GET /me/tools/goals': () => goalsTool(),
			'PUT /me/tools/goals/share': (body) => body
		});
		renderWith(host, <ClientApp />);
		expect(await screen.findByText('Neu')).toBeTruthy();
		fireEvent.click(screen.getByText('Öffnen'));
		expect(await screen.findByText(/Bitte beschreiben Sie anhand der folgenden Fragen/)).toBeTruthy();
		fireEvent.click(screen.getByRole('switch'));
		await waitFor(() => expect(calls.some((c) => c.method === 'PUT' && c.body?.shared === true)).toBe(true));
		expect(host.notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});
});

describe('Ausgangssituation und Ziele', () => {
	it('walks through the questions and saves automatically after a pause', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		const { host, calls } = fakeHost({
			'GET /me/tools': () => ({
				tools: [{ id: 'goals', releasedAt: '', opened: true, shared: false, hasEntries: false }]
			}),
			'GET /me/tools/goals': () => goalsTool(),
			'PUT /me/tools/goals/keyed/answer/situation': (body) => entry('answer', body.data, 'situation')
		});
		renderWith(host, <ClientApp />);
		fireEvent.click(await screen.findByText('Öffnen'));
		fireEvent.click(await screen.findByText('Los geht’s'));
		expect(screen.getByText('Frage 1 von 4: Wie ist Ihre aktuelle Situation?')).toBeTruthy();
		fireEvent.change(screen.getByLabelText('Ihre aktuelle Situation'), { target: { value: 'Viel Stress' } });
		expect(calls.filter((c) => c.method === 'PUT')).toHaveLength(0);
		await act(async () => {
			await vi.advanceTimersByTimeAsync(900);
		});
		await waitFor(() => expect(screen.getByText('Automatisch gespeichert')).toBeTruthy());
		expect(calls.find((c) => c.method === 'PUT')?.body).toEqual({ data: { text: 'Viel Stress' } });
		for (let step = 0; step < 4; step++) {
			fireEvent.click(screen.getByText('Weiter'));
		}
		expect(screen.getByText('Bevor es los geht: Ziel formulieren')).toBeTruthy();
		fireEvent.click(screen.getByText('Zur Zusammenfassung'));
		expect(screen.getByText('Viel Stress')).toBeTruthy();
		expect(screen.getAllByText('Noch keine Angabe')).toHaveLength(4);
		vi.useRealTimers();
	});

	it('saves a pending answer when the client moves on before the pause ends', async () => {
		const { host, calls } = fakeHost({
			'GET /me/tools': () => ({
				tools: [{ id: 'goals', releasedAt: '', opened: true, shared: false, hasEntries: true }]
			}),
			'GET /me/tools/goals': () => goalsTool([entry('answer', { text: 'alt' }, 'situation')]),
			'PUT /me/tools/goals/keyed/answer/situation': (body) => entry('answer', body.data, 'situation'),
			'DELETE /me/tools/goals/keyed/answer/situation': () => undefined
		});
		renderWith(host, <ClientApp />);
		fireEvent.click(await screen.findByText('Weiter bearbeiten'));
		fireEvent.click(await screen.findByLabelText('Bearbeiten: Ihre aktuelle Situation'));
		fireEvent.change(screen.getByLabelText('Ihre aktuelle Situation'), { target: { value: '' } });
		fireEvent.click(screen.getByText('Weiter'));
		await waitFor(() => expect(calls.some((c) => c.method === 'DELETE')).toBe(true));
	});
});
