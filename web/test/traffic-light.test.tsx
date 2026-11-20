import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolPage } from '../src/core/ToolPage.tsx';
import { TrafficLightCounsellor } from '../src/tools/traffic-light/TrafficLightCounsellor.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

const tool = (entries: unknown[]) => ({
	id: 'traffic-light',
	demo: false,
	shared: false,
	allowSharing: true,
	options: { intro: '' },
	entries
});

const page = () => (
	<ToolPage toolId="traffic-light" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
);

const field = (name: RegExp) => screen.getByRole('region', { name }) as HTMLElement;

describe('Ampelmodell', () => {
	it('shows the instructions in the chosen form of address and an empty light', async () => {
		const { host } = fakeHost({ 'GET /me/tools/traffic-light': () => tool([]) }, { informal: true });
		renderWith(host, page());
		expect(await screen.findByText('Trage eine Medienaktivität ein.')).toBeTruthy();
		expect(within(field(/Rot: große Gefahr/)).getByText('Keine Aktivitäten.')).toBeTruthy();
		expect(screen.getByText('Grün:').parentElement?.textContent).toContain('kannst du ohne Probleme');
	});

	it('adds an activity with a danger level and shows it in the matching field', async () => {
		let created: unknown = null;
		const { host } = fakeHost({
			'GET /me/tools/traffic-light': () => tool([]),
			'POST /me/tools/traffic-light/entries': (body) => {
				created = body;
				return entry(body.kind, body.data);
			}
		});
		renderWith(host, page());
		fireEvent.click(await screen.findByText('+ Neue Aktivität eintragen'));
		expect(screen.getByText('Geben Sie eine neue Medienaktivität ein')).toBeTruthy();
		fireEvent.click(screen.getByText('Speichern'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte tragen Sie eine Medienaktivität ein.');
		fireEvent.click(screen.getByText('Einen Film gucken'));
		fireEvent.click(screen.getByText('Speichern'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte wählen Sie aus, wie hoch die Gefahr ist.');
		fireEvent.click(screen.getByLabelText('mögliche Gefahr (Gelb)'));
		fireEvent.click(screen.getByText('Speichern'));
		await waitFor(() =>
			expect(created).toEqual({ kind: 'activity', data: { text: 'Einen Film gucken', level: 2 } })
		);
		expect(await within(field(/Gelb: mögliche Gefahr/)).findByText('Einen Film gucken')).toBeTruthy();
	});

	it('edits and deletes an activity by clicking it', async () => {
		const activity = entry('activity', { text: 'Instagram', level: 2 });
		let updated: unknown = null;
		const { host, calls } = fakeHost({
			'GET /me/tools/traffic-light': () => tool([activity]),
			[`PUT /me/tools/traffic-light/entries/${activity.id}`]: (body) => {
				updated = body;
				return { ...activity, data: body.data };
			},
			[`DELETE /me/tools/traffic-light/entries/${activity.id}`]: () => undefined
		});
		renderWith(host, page());
		fireEvent.click(await screen.findByLabelText('Instagram, mögliche Gefahr: bearbeiten oder löschen'));
		expect((screen.getByLabelText('Medienaktivität') as HTMLInputElement).value).toBe('Instagram');
		expect((screen.getByLabelText('mögliche Gefahr (Gelb)') as HTMLInputElement).checked).toBe(true);
		fireEvent.click(screen.getByLabelText('große Gefahr (Rot)'));
		fireEvent.click(screen.getByText('Speichern'));
		await waitFor(() => expect(updated).toEqual({ data: { text: 'Instagram', level: 3 } }));
		expect(await within(field(/Rot: große Gefahr/)).findByText('Instagram')).toBeTruthy();

		fireEvent.click(screen.getByLabelText('Instagram, große Gefahr: bearbeiten oder löschen'));
		fireEvent.click(screen.getByText('Löschen'));
		const confirm = screen.getByRole('group', { name: 'Löschen bestätigen' });
		fireEvent.click(within(confirm).getByText('Löschen'));
		await waitFor(() => expect(calls.some((c) => c.method === 'DELETE')).toBe(true));
		await waitFor(() => expect(screen.queryByText('Instagram')).toBeNull());
	});
});

describe('Ampelmodell for counsellors', () => {
	it('shows the light read only with a legend and marks new activities', () => {
		const seen = entry('activity', { text: 'E-Mails schreiben', level: 1 });
		const fresh = entry('activity', { text: 'Ein Computerspiel spielen', level: 3 });
		render(
			<TrafficLightCounsellor
				entries={[seen, fresh]}
				options={{}}
				isNew={(e) => e.id === fresh.id}
				locale="de"
				linked={{}}
			/>
		);
		expect(screen.getByRole('list', { name: 'Legende' }).textContent).toContain('Rot = große Gefahr');
		expect(within(field(/Rot: große Gefahr/)).getByText('Ein Computerspiel spielen')).toBeTruthy();
		expect(within(field(/Grün: keine Gefahr/)).getByText('E-Mails schreiben')).toBeTruthy();
		expect(screen.getAllByText('Neu')).toHaveLength(1);
		expect(screen.queryAllByRole('button')).toHaveLength(0);
	});
});
