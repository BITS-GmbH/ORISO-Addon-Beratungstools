import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { addDays, formatDayLong, localToday, weekStart } from '../../shared/days.ts';
import { ToolPage } from '../src/core/ToolPage.tsx';
import { RelativesCounsellor } from '../src/tools/relatives-diary/RelativesCounsellor.tsx';
import { fakeHost, renderWith } from './fakeHost.tsx';

const today = localToday();

const dayEntry = (day: string, data: unknown, updatedAt = '2026-11-20T09:00:00.000Z') => ({
	id: `entry-${day}`,
	kind: 'entry',
	key: day,
	day,
	data,
	createdAt: updatedAt,
	updatedAt
});

const tool = (entries: unknown[], linked: Record<string, unknown[]> = {}) => ({
	id: 'relatives-diary',
	demo: false,
	shared: false,
	allowSharing: false,
	options: { intro: '' },
	entries,
	linked
});

const open = (host: ReturnType<typeof fakeHost>['host']) =>
	renderWith(
		host,
		<ToolPage toolId="relatives-diary" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
	);

describe('Tagebuch für Angehörige', () => {
	it('shows the week with snippet, mood and the planned activities', async () => {
		const long = `Heute war ein langer Tag. ${'Wir haben viel geredet. '.repeat(10)}`;
		const { host } = fakeHost({
			'GET /me/tools/relatives-diary': () =>
				tool([dayEntry(today, { text: long, mood: 4 })], {
					active: [
						{
							id: 'a',
							kind: 'activity',
							key: null,
							day: null,
							data: { title: 'Joggen', date: today, time: '07:00', repeat: 'none', companion: 'Marie' },
							createdAt: '',
							updatedAt: ''
						}
					]
				})
		});
		open(host);
		expect(await screen.findByText('Mein Tagebuch')).toBeTruthy();
		expect(screen.getByText(/^Heute war ein langer Tag\..* …$/)).toBeTruthy();
		expect(screen.getByText('eher gut')).toBeTruthy();
		expect(screen.getByText('Geplante Aktivitäten diese Woche')).toBeTruthy();
		expect(screen.getByText('Joggen (mit Marie)')).toBeTruthy();
		expect((screen.getByLabelText('Woche vor') as HTMLButtonElement).disabled).toBe(true);
	});

	it('hides planned activities while "Aktiv sein" is not released', async () => {
		const { host } = fakeHost({ 'GET /me/tools/relatives-diary': () => tool([]) });
		open(host);
		await screen.findByText('Mein Tagebuch');
		expect(screen.queryByText('Geplante Aktivitäten diese Woche')).toBeNull();
	});

	it('writes the entry of a day with the three questions and a mood', async () => {
		let saved: any = null;
		const { host } = fakeHost({
			'GET /me/tools/relatives-diary': () => tool([]),
			[`PUT /me/tools/relatives-diary/keyed/entry/${today}`]: (body) => {
				saved = body;
				return dayEntry(today, body.data);
			}
		});
		open(host);
		fireEvent.click(await screen.findByLabelText(`Eintrag erstellen: ${formatDayLong(today)}`));
		expect(screen.getByText('Was war heute für Sie wichtig?')).toBeTruthy();
		expect(screen.getByText('Wie lief heute die Kommunikation mit Ihrer / Ihrem Angehörigen?')).toBeTruthy();
		fireEvent.click(screen.getByText('Eintrag speichern'));
		expect(screen.getByRole('alert')).toBeTruthy();
		fireEvent.change(screen.getByLabelText('Tagebucheintrag'), { target: { value: 'Ein guter Tag.' } });
		fireEvent.click(screen.getByLabelText('sehr gut'));
		fireEvent.click(screen.getByText('Eintrag speichern'));
		await waitFor(() => expect(saved).toEqual({ data: { text: 'Ein guter Tag.', mood: 5 }, day: today }));
		expect(await screen.findByText('Ein guter Tag.')).toBeTruthy();
	});

	it('uses the informal address', async () => {
		const { host } = fakeHost({ 'GET /me/tools/relatives-diary': () => tool([]) }, { informal: true });
		open(host);
		fireEvent.click(await screen.findByLabelText(`Eintrag erstellen: ${formatDayLong(today)}`));
		expect(screen.getByText('Was war heute für dich wichtig?')).toBeTruthy();
		expect(screen.getByText('Wie bewertest du den heutigen Tag?')).toBeTruthy();
	});

	it('lets counsellors switch between the week and all entries', () => {
		const lastWeek = addDays(weekStart(today), -5);
		render(
			<div className="bt">
				<RelativesCounsellor
					entries={[
						dayEntry(lastWeek, { text: 'Älterer Eintrag', mood: 2 }, '2026-01-01T00:00:00.000Z'),
						dayEntry(today, { text: 'Neuer Eintrag' })
					]}
					linked={{}}
					options={{}}
					locale="de"
					isNew={(e) => e.updatedAt > '2026-06-01'}
				/>
			</div>
		);
		expect(screen.getByText('Neuer Eintrag')).toBeTruthy();
		expect(screen.queryByText('Älterer Eintrag')).toBeNull();
		fireEvent.click(screen.getByLabelText('Woche zurück'));
		expect(screen.getByText('Älterer Eintrag')).toBeTruthy();
		fireEvent.click(screen.getByRole('tab', { name: 'Alle Einträge' }));
		const items = screen.getAllByRole('listitem').map((li) => li.textContent);
		expect(items[0]).toContain('Neuer Eintrag');
		expect(items[1]).toContain('Älterer Eintrag');
		expect(screen.getAllByText('Neu')).toHaveLength(1);
	});
});
