import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { formatDayShort, localToday, weekStart } from '../../shared/days.ts';
import { ToolPage } from '../src/core/ToolPage.tsx';
import { ConsumptionCounsellor } from '../src/tools/consumption-diary/ConsumptionCounsellor.tsx';
import { fakeHost, renderWith } from './fakeHost.tsx';

const today = localToday();
let counter = 0;

const record = (
	kind: string,
	data: unknown,
	day: string | null = null,
	key: string | null = null,
	updatedAt = '2026-11-20T09:00:00.000Z'
) => ({
	id: `${kind}-${++counter}`,
	kind,
	key,
	day,
	data,
	createdAt: updatedAt,
	updatedAt
});

const topics = (list: string[]) => record('topics', { topics: list }, null, 'main');

const tool = (entries: unknown[]) => ({
	id: 'consumption-diary',
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
		<ToolPage toolId="consumption-diary" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
	);

describe('Konsumtagebuch', () => {
	it('starts with the choice of topics', async () => {
		let saved: any = null;
		const { host } = fakeHost({
			'GET /me/tools/consumption-diary': () => tool([]),
			'PUT /me/tools/consumption-diary/keyed/topics/main': (body) => {
				saved = body;
				return record('topics', body.data, null, 'main');
			}
		});
		open(host);
		expect(await screen.findByText('Über das Konsumtagebuch')).toBeTruthy();
		expect(screen.getByText('Diese Themen dokumentieren:')).toBeTruthy();
		expect(screen.queryByText('weiteres Thema hinzufügen')).toBeNull();
		fireEvent.click(screen.getByText('Tagebuch starten'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte wählen Sie mindestens ein Thema.');
		fireEvent.click(screen.getByLabelText('Alkohol'));
		fireEvent.click(screen.getByLabelText('Glücksspiel'));
		fireEvent.click(screen.getByText('Tagebuch starten'));
		await waitFor(() => expect(saved).toEqual({ data: { topics: ['alcohol', 'gambling'] } }));
		expect(await screen.findByText('Meine Woche', { selector: 'h3' })).toBeTruthy();
		expect(screen.getAllByText('Haben Sie Alkohol getrunken?').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Haben Sie Glücksspiele gespielt?').length).toBeGreaterThan(0);
		fireEvent.click(screen.getByText('Einstellungen'));
		expect(screen.getByText('weiteres Thema hinzufügen')).toBeTruthy();
		expect(screen.queryByLabelText('Cannabis')).toBeNull();
		fireEvent.click(screen.getByText('weiteres Thema hinzufügen'));
		expect(screen.getByLabelText('Cannabis')).toBeTruthy();
		expect(screen.queryByText('weiteres Thema hinzufügen')).toBeNull();
	});

	it('offers no further topic when all topics are chosen', async () => {
		const { host } = fakeHost({
			'GET /me/tools/consumption-diary': () => tool([topics(['alcohol', 'cannabis', 'gambling', 'media'])])
		});
		open(host);
		fireEvent.click(await screen.findByText('Einstellungen'));
		expect(screen.getByLabelText('Medien')).toBeTruthy();
		expect(screen.queryByText('weiteres Thema hinzufügen')).toBeNull();
	});

	it('saves the topics as soon as one is switched, without a save button', async () => {
		const saved: any[] = [];
		const { host } = fakeHost({
			'GET /me/tools/consumption-diary': () => tool([topics(['alcohol'])]),
			'PUT /me/tools/consumption-diary/keyed/topics/main': (body) => {
				saved.push(body);
				return record('topics', body.data, null, 'main');
			}
		});
		open(host);
		fireEvent.click(await screen.findByText('Einstellungen'));
		expect(screen.queryByText('Speichern')).toBeNull();
		fireEvent.click(screen.getByText('weiteres Thema hinzufügen'));
		fireEvent.click(screen.getByLabelText('Cannabis'));
		await waitFor(() => expect(saved.at(-1)).toEqual({ data: { topics: ['alcohol', 'cannabis'] } }));
		fireEvent.click(screen.getByLabelText('Alkohol'));
		await waitFor(() => expect(saved.at(-1)).toEqual({ data: { topics: ['cannabis'] } }));
		fireEvent.click(screen.getByLabelText('Cannabis'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte wählen Sie mindestens ein Thema.');
		expect(saved).toHaveLength(2);
	});

	it('lists the entries of the chosen day under "Tagebucheintrag"', async () => {
		const { host } = fakeHost({
			'GET /me/tools/consumption-diary': () =>
				tool([
					topics(['alcohol', 'gambling']),
					record('day-summary', { topic: 'alcohol', consumed: true }, today, `${today}_alcohol`),
					record('phase', { topic: 'alcohol', start: '20:00', end: '22:00', items: [] }, today),
					record('day-summary', { topic: 'gambling', consumed: false }, today, `${today}_gambling`)
				])
		});
		open(host);
		fireEvent.click(await screen.findByText('Tagebucheintrag'));
		expect(await screen.findByText(/^Einträge am /)).toBeTruthy();
		expect(screen.getByText('Kein Konsum eingetragen')).toBeTruthy();
		expect(screen.getAllByText('Zur Tagesübersicht')).toHaveLength(2);
		fireEvent.click(screen.getByLabelText('bearbeiten'));
		expect((await screen.findAllByRole('button', { name: /eintragen|speichern/i })).length).toBeGreaterThan(
			0
		);
	});

	it('answers a day with "nein" from the week and shows the motivating text', async () => {
		let saved: any = null;
		const { host } = fakeHost({
			'GET /me/tools/consumption-diary': () => tool([topics(['alcohol'])]),
			[`PUT /me/tools/consumption-diary/keyed/day-summary/${today}_alcohol`]: (body) => {
				saved = body;
				return record('day-summary', body.data, today, `${today}_alcohol`);
			}
		});
		open(host);
		const group = await screen.findByRole('radiogroup', {
			name: `${formatDayShort(today)}: Haben Sie Alkohol getrunken?`
		});
		fireEvent.click(within(group).getByText('nein'));
		await waitFor(() => expect(saved).toEqual({ data: { topic: 'alcohol', consumed: false }, day: today }));
		expect(await screen.findByText(/Sie haben heute keinen Alkohol getrunken\? Wunderbar!/)).toBeTruthy();
		fireEvent.change(screen.getByLabelText('Was nehmen Sie sich für morgen vor?'), {
			target: { value: 'Laufen gehen' }
		});
		fireEvent.click(screen.getByText('Speichern'));
		await waitFor(() =>
			expect(saved).toEqual({ data: { topic: 'alcohol', consumed: false, plan: 'Laufen gehen' }, day: today })
		);
	});

	it('records a phase with drinks and asks before "nein" deletes it', async () => {
		const created: any[] = [];
		const { host } = fakeHost({
			'GET /me/tools/consumption-diary': () =>
				tool([
					topics(['alcohol']),
					record(
						'day-summary',
						{ topic: 'alcohol', consumed: true, rating: 'Zu viel' },
						today,
						`${today}_alcohol`
					)
				]),
			'POST /me/tools/consumption-diary/entries': (body) => {
				created.push(body);
				return record(body.kind, body.data, body.day);
			},
			[`PUT /me/tools/consumption-diary/keyed/day-summary/${today}_alcohol`]: (body) =>
				record('day-summary', body.data, today, `${today}_alcohol`)
		});
		open(host);
		const group = await screen.findByRole('radiogroup', {
			name: `${formatDayShort(today)}: Haben Sie Alkohol getrunken?`
		});
		fireEvent.click(within(group).getByText('ja'));
		expect(await screen.findByText('bisher kein Eintrag')).toBeTruthy();
		fireEvent.click(screen.getByText('neue Konsumphase eintragen'));
		expect(screen.getByText('Alkohol: Konsumphase eintragen')).toBeTruthy();
		fireEvent.click(screen.getByText('Konsumphase speichern'));
		expect(screen.getByRole('alert')).toBeTruthy();
		fireEvent.change(screen.getByLabelText('Getränk'), { target: { value: 'beer' } });
		fireEvent.change(screen.getByLabelText('Größe'), { target: { value: '0,5 l' } });
		fireEvent.change(screen.getByLabelText('Anzahl'), { target: { value: '2' } });
		fireEvent.click(screen.getByText('eintragen'));
		expect(screen.getByText('2x 0,5 l Bier')).toBeTruthy();
		fireEvent.change(screen.getByLabelText('Uhrzeit (Beginn)'), { target: { value: '19:00' } });
		fireEvent.change(screen.getByLabelText('Mit wem und wo haben Sie getrunken?'), {
			target: { value: 'Kneipe' }
		});
		fireEvent.click(screen.getByText('Konsumphase speichern'));
		await waitFor(() =>
			expect(created[0]).toEqual({
				kind: 'phase',
				day: today,
				data: {
					topic: 'alcohol',
					items: [{ drink: 'beer', size: '0,5 l', count: 2 }],
					start: '19:00',
					context: 'Kneipe'
				}
			})
		);
		expect(await screen.findByText('19:00 Uhr:')).toBeTruthy();
		fireEvent.click(screen.getByLabelText('nein'));
		expect(
			screen.getByText('Alle für diesen Tag eingetragenen Konsumphasen werden gelöscht. Trotzdem fortfahren?')
		).toBeTruthy();
		fireEvent.click(screen.getByText('Abbrechen'));
		expect(screen.getByText('19:00 Uhr:')).toBeTruthy();
	});

	it('limits the minutes of a duration to 0 to 59', async () => {
		const { host } = fakeHost({
			'GET /me/tools/consumption-diary': () =>
				tool([
					topics(['gambling']),
					record('day-summary', { topic: 'gambling', consumed: true }, today, `${today}_gambling`)
				])
		});
		open(host);
		const group = await screen.findByRole('radiogroup', {
			name: `${formatDayShort(today)}: Haben Sie Glücksspiele gespielt?`
		});
		fireEvent.click(within(group).getByText('ja'));
		fireEvent.click(await screen.findByText('neue Spielphase eintragen'));
		const minutes = screen.getByLabelText('Minuten') as HTMLInputElement;
		fireEvent.change(minutes, { target: { value: '75' } });
		expect(minutes.value).toBe('59');
		fireEvent.change(minutes, { target: { value: '-3' } });
		expect(minutes.value).toBe('0');
		fireEvent.change(minutes, { target: { value: '45' } });
		expect(minutes.value).toBe('45');
	});

	it('shows counsellors the week with sums per topic and the details of a day', () => {
		const scrolled = vi.fn();
		Element.prototype.scrollIntoView = scrolled;
		const monday = weekStart(today);
		render(
			<div className="bt">
				<ConsumptionCounsellor
					entries={[
						topics(['alcohol', 'gambling']),
						record(
							'day-summary',
							{ topic: 'alcohol', consumed: true, plan: 'Weniger' },
							monday,
							`${monday}_alcohol`
						),
						record(
							'phase',
							{ topic: 'alcohol', items: [{ drink: 'beer', size: '0,5 l', count: 3 }], trigger: 'Stress' },
							monday
						),
						record(
							'day-summary',
							{ topic: 'gambling', consumed: false },
							monday,
							`${monday}_gambling`,
							'2026-01-01T00:00:00.000Z'
						)
					]}
					linked={{}}
					options={{}}
					locale="de"
					isNew={(e) => e.updatedAt > '2026-06-01'}
				/>
			</div>
		);
		const tile = screen.getByText(formatDayShort(monday)).closest('button') as HTMLElement;
		expect(within(tile).getByText('3 Getränke, ca. 57 g Alkohol')).toBeTruthy();
		expect(within(tile).getByText('Kein Konsum eingetragen')).toBeTruthy();
		expect(within(tile).getByText('Neu')).toBeTruthy();
		fireEvent.click(tile);
		expect(scrolled).toHaveBeenCalledWith(expect.objectContaining({ block: 'nearest' }));
		expect(document.activeElement).toBe(screen.getByRole('region', { name: /^Einträge vom / }));
		expect(screen.getByText('Stress')).toBeTruthy();
		expect(screen.getByText('Weniger')).toBeTruthy();
		expect(screen.queryByText('neue Konsumphase eintragen')).toBeNull();
		expect(screen.getAllByText('Resümee neu')).toHaveLength(1);
	});

	it('marks no summary as new for a topic answered without a summary', () => {
		const monday = weekStart(today);
		render(
			<div className="bt">
				<ConsumptionCounsellor
					entries={[
						topics(['cannabis']),
						record('day-summary', { topic: 'cannabis', consumed: true }, monday, `${monday}_cannabis`),
						record('phase', { topic: 'cannabis', items: [{ unit: 'joint', count: 2 }] }, monday)
					]}
					linked={{}}
					options={{}}
					locale="de"
					isNew={() => true}
				/>
			</div>
		);
		fireEvent.click(screen.getByText(formatDayShort(monday)).closest('button') as HTMLElement);
		expect(screen.getAllByText('Neu').length).toBeGreaterThan(0);
		expect(screen.queryByText('Resümee neu')).toBeNull();
	});

	it('speaks English', async () => {
		const { host } = fakeHost(
			{
				'GET /me/tools/consumption-diary': () =>
					tool([
						topics(['alcohol']),
						record('day-summary', { topic: 'alcohol', consumed: true }, today, `${today}_alcohol`),
						record(
							'phase',
							{ topic: 'alcohol', start: '19:00', items: [{ drink: 'beer', size: '0,5 l', count: 2 }] },
							today
						)
					])
			},
			{ locale: 'en' }
		);
		open(host);
		const group = await screen.findByRole('radiogroup', {
			name: `${formatDayShort(today, 'en')}: Did you drink alcohol?`
		});
		expect(screen.getByText('My week', { selector: 'h3' })).toBeTruthy();
		fireEvent.click(within(group).getByText('yes'));
		expect(await screen.findByText('Did you drink alcohol today?')).toBeTruthy();
		expect(screen.getByText('19:00:')).toBeTruthy();
		expect(screen.getByText('2x 0.5 l Beer')).toBeTruthy();
		expect(screen.getByText('How would you rate today with regard to your drinking?')).toBeTruthy();
		fireEvent.click(screen.getByText('Add a new phase'));
		expect(screen.getByText('Alcohol: add a phase of drinking')).toBeTruthy();
		fireEvent.change(screen.getByLabelText('Drink'), { target: { value: 'wine' } });
		expect(screen.getByRole('option', { name: '0.375 l' })).toBeTruthy();
	});

	it('addresses the client informally in German', async () => {
		const { host } = fakeHost(
			{
				'GET /me/tools/consumption-diary': () => tool([topics(['gambling'])]),
				[`PUT /me/tools/consumption-diary/keyed/day-summary/${today}_gambling`]: (body) =>
					record('day-summary', body.data, today, `${today}_gambling`)
			},
			{ informal: true }
		);
		open(host);
		const group = await screen.findByRole('radiogroup', {
			name: `${formatDayShort(today)}: Hast du Glücksspiele gespielt?`
		});
		fireEvent.click(within(group).getByText('nein'));
		expect(await screen.findByText(/^Du hast heute keine Glücksspiele gespielt\? Wunderbar!/)).toBeTruthy();
		expect(screen.getByLabelText('Was nimmst du dir für morgen vor?')).toBeTruthy();
	});

	it('shows counsellors the week in English', () => {
		const monday = weekStart(today);
		renderWith(
			fakeHost({}, { locale: 'en' }).host,
			<ConsumptionCounsellor
				entries={[
					topics(['alcohol']),
					record('phase', { topic: 'alcohol', items: [{ drink: 'beer', size: '0,5 l', count: 3 }] }, monday)
				]}
				linked={{}}
				options={{}}
				locale="en"
				isNew={() => false}
			/>
		);
		expect(screen.getByText('Topics recorded: Alcohol')).toBeTruthy();
		expect(screen.getByText('3 drinks, about 57 g of alcohol')).toBeTruthy();
	});
});
