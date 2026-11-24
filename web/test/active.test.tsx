import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolPage } from '../src/core/ToolPage.tsx';
import { ActiveCounsellor } from '../src/tools/active/ActiveCounsellor.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

const tool = (entries: unknown[]) => ({
	id: 'active',
	demo: false,
	shared: false,
	allowSharing: false,
	options: { intro: '' },
	entries,
	linked: {}
});

const open = (host: ReturnType<typeof fakeHost>['host']) =>
	renderWith(
		host,
		<ToolPage toolId="active" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
	);

describe('Aktiv sein', () => {
	it('plans an activity from a suggestion, with an optional companion', async () => {
		let created: any = null;
		const { host } = fakeHost({
			'GET /me/tools/active': () => tool([]),
			'POST /me/tools/active/entries': (body) => {
				created = body;
				return entry(body.kind, body.data);
			}
		});
		open(host);
		expect(await screen.findByText('Noch keine Aktivitäten eingetragen.')).toBeTruthy();
		fireEvent.click(screen.getByText('Aktivität hinzufügen'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte tragen Sie eine Aktivität ein.');
		fireEvent.click(screen.getByText('Vorschläge für Aktivitäten'));
		fireEvent.click(screen.getByRole('tab', { name: 'Genuss' }));
		fireEvent.click(screen.getByText('Pizza bestellen'));
		expect((screen.getByLabelText('Aktivität eintragen') as HTMLInputElement).value).toBe('Pizza bestellen');
		fireEvent.change(screen.getByLabelText('Begleitung (optional)'), { target: { value: 'Peter' } });
		fireEvent.click(screen.getByText('Aktivität hinzufügen'));
		await waitFor(() =>
			expect(created).toEqual({
				kind: 'activity',
				data: { title: 'Pizza bestellen', repeat: 'none', companion: 'Peter' }
			})
		);
		expect(await screen.findByText('Nächster Termin: kein Termin')).toBeTruthy();
	});

	it('asks for a date when a repetition is chosen', async () => {
		const { host } = fakeHost({ 'GET /me/tools/active': () => tool([]) });
		open(host);
		fireEvent.change(await screen.findByLabelText('Aktivität eintragen'), { target: { value: 'Joggen' } });
		fireEvent.change(screen.getByLabelText('Aktivität wiederholen?'), { target: { value: 'weekly' } });
		fireEvent.click(screen.getByText('Aktivität hinzufügen'));
		expect(screen.getByRole('alert').textContent).toContain('Datum');
	});

	it('edits an activity on click and deletes only after confirmation', async () => {
		const activity = entry('activity', {
			title: 'Schwimmen',
			date: '2099-01-05',
			time: '18:00',
			repeat: 'none'
		});
		let updated: any = null;
		const { host, calls } = fakeHost({
			'GET /me/tools/active': () => tool([activity]),
			[`PUT /me/tools/active/entries/${activity.id}`]: (body) => {
				updated = body;
				return { ...activity, data: body.data };
			},
			[`DELETE /me/tools/active/entries/${activity.id}`]: () => undefined
		});
		open(host);
		expect(await screen.findByText('Nächster Termin: Montag, 05.01.2099, 18:00 Uhr')).toBeTruthy();
		fireEvent.click(screen.getByLabelText('Bearbeiten: Schwimmen'));
		fireEvent.change(screen.getByLabelText('Aktivität eintragen'), { target: { value: 'Schwimmen gehen' } });
		fireEvent.click(screen.getByText('Änderung speichern'));
		await waitFor(() => expect(updated?.data.title).toBe('Schwimmen gehen'));
		fireEvent.click(await screen.findByLabelText('Löschen: Schwimmen gehen'));
		const item = screen.getByText('Diese Aktivität löschen?').parentElement as HTMLElement;
		fireEvent.click(within(item).getByText('Löschen'));
		await waitFor(() => expect(calls.some((c) => c.method === 'DELETE')).toBe(true));
	});

	it('shows the activities read only with "neu" markers for counsellors', () => {
		const seen = entry('activity', { title: 'Lesen', repeat: 'none' }, null, '2026-11-01T09:00:00.000Z');
		const fresh = entry('activity', {
			title: 'Kino',
			date: '2099-01-05',
			repeat: 'none',
			companion: 'Marie'
		});
		render(
			<div className="bt">
				<ActiveCounsellor
					entries={[seen, fresh]}
					linked={{}}
					options={{}}
					locale="de"
					isNew={(e) => e.updatedAt > '2026-11-10'}
				/>
			</div>
		);
		expect(screen.getAllByText('Neu')).toHaveLength(1);
		expect(screen.getByText('Montag, 05.01.2099')).toBeTruthy();
		expect(screen.getByText('Marie')).toBeTruthy();
		expect(screen.queryByText('Löschen')).toBeNull();
	});

	it('speaks English to an English client', async () => {
		let created: any = null;
		const activity = entry('activity', {
			title: 'Schwimmen',
			date: '2099-01-05',
			time: '18:00',
			repeat: 'weekly',
			companion: 'Marie'
		});
		const { host } = fakeHost(
			{
				'GET /me/tools/active': () => tool([activity]),
				'POST /me/tools/active/entries': (body) => {
					created = body;
					return entry(body.kind, body.data);
				}
			},
			{ locale: 'en' }
		);
		open(host);
		expect(await screen.findByText('Next date: Monday, 05/01/2099, 18:00 (weekly)')).toBeTruthy();
		expect(screen.getByText('Company: Marie')).toBeTruthy();
		expect(screen.getByText('Add to my calendar')).toBeTruthy();
		fireEvent.click(screen.getByText('Add activity'));
		expect(screen.getByRole('alert').textContent).toBe('Please enter an activity.');
		fireEvent.click(screen.getByText('Ideas for activities'));
		fireEvent.click(screen.getByRole('tab', { name: 'Treats' }));
		fireEvent.click(screen.getByText('Order a pizza'));
		expect((screen.getByLabelText('Enter an activity') as HTMLInputElement).value).toBe('Order a pizza');
		fireEvent.click(screen.getByText('Add activity'));
		await waitFor(() =>
			expect(created).toEqual({ kind: 'activity', data: { title: 'Order a pizza', repeat: 'none' } })
		);
	});

	it('addresses the client informally in German', async () => {
		const { host } = fakeHost({ 'GET /me/tools/active': () => tool([]) }, { informal: true });
		open(host);
		fireEvent.click(await screen.findByText('Aktivität hinzufügen'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte trage eine Aktivität ein.');
		fireEvent.click(screen.getByText('Wie gehe ich vor?'));
		expect(screen.getByText(/^Trage unten deine geplanten Aktivitäten ein/)).toBeTruthy();
	});

	it('shows the counsellor view in English', () => {
		const custom = entry('activity', {
			title: 'Kurs',
			date: '2099-01-05',
			repeat: 'custom',
			dates: ['2099-01-12']
		});
		const { host } = fakeHost({}, { locale: 'en' });
		renderWith(
			host,
			<ActiveCounsellor
				entries={[custom]}
				linked={{}}
				options={{}}
				locale="en"
				isNew={(e) => e.updatedAt > '2026-11-10'}
			/>
		);
		expect(screen.getByText('Next date')).toBeTruthy();
		expect(screen.getByText('Monday, 05/01/2099')).toBeTruthy();
		expect(screen.getByText('on chosen dates: Monday, 05/01/2099; Monday, 12/01/2099')).toBeTruthy();
		expect(screen.getByText('New')).toBeTruthy();
	});
});
