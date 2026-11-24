import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CounsellorApp } from '../src/core/CounsellorApp.tsx';
import { ProfileTile } from '../src/core/ProfileTile.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

const tile = (id: string, extra: Record<string, unknown> = {}) => ({
	id,
	released: false,
	releasedAt: null,
	hasEntries: false,
	shared: false,
	sharedSince: null,
	lastChangedAt: null,
	newCount: 0,
	exportRange: false,
	...extra
});

const counsellor = {
	slot: 'consultant.session',
	sessionId: 4711,
	askerId: 'a1',
	user: { id: 'c1', username: 'c1', roles: ['consultant'] }
};

describe('tool overview', () => {
	it('lists the tools compactly and shows status and actions in the detail view', async () => {
		const { host } = fakeHost(
			{
				'GET /case/tools': () => ({
					sessionId: 4711,
					tools: [
						tile('goals', { released: true, releasedAt: '2026-11-20T09:00:00Z', hasEntries: true }),
						tile('balance', { released: true, shared: true, newCount: 2 })
					]
				})
			},
			counsellor
		);
		renderWith(host, <CounsellorApp />);
		expect(await screen.findByText('Freigeschaltet')).toBeTruthy();
		expect(screen.queryByText('Noch nicht freigeschaltet')).toBeNull();
		expect(screen.getByText('2 neue Einträge')).toBeTruthy();
		expect(screen.queryByText('User-Vorschau')).toBeNull();
		expect(screen.queryByText(/Fall:/)).toBeNull();

		fireEvent.click(screen.getByText('Ausgangssituation und Ziele'));
		expect(await screen.findByText('Einträge vorhanden, keine Einsicht')).toBeTruthy();
		expect(screen.queryByText('Einträge ansehen')).toBeNull();
		expect(screen.getByText('User-Vorschau')).toBeTruthy();

		fireEvent.click(screen.getByText('‹ Alle Tools'));
		fireEvent.click(await screen.findByText('Motivationswaage'));
		expect(await screen.findByText('Einträge ansehen')).toBeTruthy();
	});

	it('releases a tool and explains a closed DPA gate', async () => {
		let released = false;
		const { host, calls } = fakeHost(
			{
				'GET /case/tools': () => ({ sessionId: 4711, tools: [tile('goals', { released }), tile('balance')] }),
				'POST /case/tools/goals/release': () => {
					released = true;
					return { released: true };
				},
				'POST /case/tools/balance/release': () => {
					throw Object.assign(new Error(), { status: 409 });
				}
			},
			counsellor
		);
		renderWith(host, <CounsellorApp />);
		fireEvent.click(await screen.findByText('Ausgangssituation und Ziele'));
		fireEvent.click(await screen.findByText('Freischalten'));
		expect(await screen.findByText('Freischaltung aufheben')).toBeTruthy();
		expect(calls.some((c) => c.method === 'POST' && c.path === '/case/tools/goals/release')).toBe(true);
		fireEvent.click(screen.getByText('‹ Alle Tools'));
		fireEvent.click(await screen.findByText('Motivationswaage'));
		fireEvent.click(await screen.findByText('Freischalten'));
		await waitFor(() =>
			expect(host.notify).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'warning',
					text: expect.stringContaining('Auftragsverarbeitungsvertrag')
				})
			)
		);
	});

	it('asks before withdrawing a release', async () => {
		const { host, calls } = fakeHost(
			{
				'GET /case/tools': () => ({ sessionId: 4711, tools: [tile('goals', { released: true })] }),
				'DELETE /case/tools/goals/release': () => ({ released: false })
			},
			counsellor
		);
		renderWith(host, <CounsellorApp />);
		fireEvent.click(await screen.findByText('Ausgangssituation und Ziele'));
		fireEvent.click(await screen.findByText('Freischaltung aufheben'));
		expect(calls.some((c) => c.method === 'DELETE')).toBe(false);
		fireEvent.click(screen.getByText('Aufheben'));
		await waitFor(() => expect(calls.some((c) => c.method === 'DELETE')).toBe(true));
	});

	it('opens shared entries read only, marks what is new and then marks it as seen', async () => {
		const { host, calls } = fakeHost(
			{
				'GET /case/tools': () => ({
					sessionId: 4711,
					tools: [tile('balance', { released: true, shared: true, newCount: 1 })]
				}),
				'GET /case/tools/balance/entries': () => ({
					id: 'balance',
					options: { poles: 'CONTRA Veränderung / PRO Veränderung' },
					seenAt: '2026-11-20T10:00:00.000Z',
					sharedSince: '2026-11-19T10:00:00.000Z',
					exportRange: false,
					entries: [
						entry(
							'argument',
							{ category: 'A', text: 'gesehen', rating: 2 },
							null,
							'2026-11-20T09:00:00.000Z'
						),
						entry(
							'argument',
							{ category: 'D', text: 'neu dazu', rating: 3 },
							null,
							'2026-11-20T11:00:00.000Z'
						)
					]
				}),
				'POST /case/tools/balance/seen': (body) => ({ seenAt: body.until })
			},
			counsellor
		);
		renderWith(host, <CounsellorApp />);
		fireEvent.click(await screen.findByText('Motivationswaage'));
		fireEvent.click(await screen.findByText('Einträge ansehen'));
		expect(await screen.findByText('neu dazu')).toBeTruthy();
		expect(screen.getAllByText('Neu')).toHaveLength(1);
		expect(screen.getByText('+10,0')).toBeTruthy();
		expect(screen.queryByText('Bearbeiten')).toBeNull();
		await waitFor(() =>
			expect(calls.find((c) => c.path === '/case/tools/balance/seen')?.body).toEqual({
				until: '2026-11-20T11:00:00.000Z'
			})
		);
	});

	it('runs the user preview on demo data with a reset', async () => {
		const { host, calls } = fakeHost(
			{
				'GET /case/tools': () => ({ sessionId: 4711, tools: [tile('goals')] }),
				'GET /demo/tools/goals': () => ({
					id: 'goals',
					demo: true,
					shared: false,
					allowSharing: true,
					options: {},
					entries: []
				}),
				'POST /demo/tools/goals/reset': () => undefined
			},
			counsellor
		);
		renderWith(host, <CounsellorApp />);
		fireEvent.click(await screen.findByText('Ausgangssituation und Ziele'));
		fireEvent.click(await screen.findByText('User-Vorschau'));
		expect(await screen.findByText('User-Vorschau / Demo: keine Speicherung im realen Fall')).toBeTruthy();
		fireEvent.click(screen.getByText('Demo zurücksetzen'));
		await waitFor(() =>
			expect(calls.filter((c) => c.path === '/demo/tools/goals' && c.method === 'GET')).toHaveLength(2)
		);
	});

	it('stores the counsellor’s notification preferences', async () => {
		const { host, calls } = fakeHost(
			{
				'GET /case/tools': () => ({ sessionId: 4711, tools: [] }),
				'GET /counsellor/notification-prefs': () => ({
					firstShare: true,
					newEntry: true,
					changedEntry: true
				}),
				'PUT /counsellor/notification-prefs': (body) => body
			},
			counsellor
		);
		renderWith(host, <CounsellorApp />);
		fireEvent.click(await screen.findByText('Benachrichtigungseinstellungen'));
		fireEvent.click(await screen.findByLabelText('Änderungen an bestehenden Einträgen'));
		fireEvent.click(screen.getByText('Einstellungen speichern'));
		await waitFor(() =>
			expect(calls.find((c) => c.method === 'PUT')?.body).toEqual({
				firstShare: true,
				newEntry: true,
				changedEntry: false
			})
		);
	});
});

describe('profile tile', () => {
	it('shows the state per released tool and links into the case', async () => {
		const { host } = fakeHost(
			{
				'GET /case/tools': () => ({
					sessionId: 4711,
					tools: [tile('goals', { released: true, shared: true, newCount: 3 }), tile('balance')]
				})
			},
			{ ...counsellor, slot: 'consultant.asker-profile' }
		);
		renderWith(host, <ProfileTile />);
		expect(await screen.findByText('3 neu')).toBeTruthy();
		expect(screen.queryByText('Motivationswaage')).toBeNull();
		fireEvent.click(screen.getByText('Tools im Fall öffnen'));
		expect(host.navigate).toHaveBeenCalledWith(
			'/sessions/consultant/sessionView/session/4711?addon=beratungstools%2Ftools%2Fconsultant.session'
		);
	});
});
