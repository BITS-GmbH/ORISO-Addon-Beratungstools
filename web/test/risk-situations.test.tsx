import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolPage } from '../src/core/ToolPage.tsx';
import { RiskCounsellor } from '../src/tools/risk-situations/RiskCounsellor.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

const tool = (entries: unknown[]) => ({
	id: 'risk-situations',
	demo: false,
	shared: false,
	allowSharing: true,
	options: {},
	entries,
	linked: {},
	counsellors: []
});

const page = () => (
	<ToolPage toolId="risk-situations" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
);

const situation = (text: string, extra: Record<string, unknown> = {}) =>
	entry('situation', { situation: text, difficulty: 'hard', strategy: 'Früh gehen', ...extra });

describe('Risikosituationen und Kontrollstrategien', () => {
	it('shows the guide on the first visit and asks for situation and difficulty', async () => {
		let created: unknown = null;
		const { host } = fakeHost(
			{
				'GET /me/tools/risk-situations': () => tool([]),
				'POST /me/tools/risk-situations/entries': (body) => {
					created = body;
					return entry(body.kind, body.data);
				}
			},
			{ informal: true }
		);
		renderWith(host, page());
		expect(await screen.findByText('Anleitung ausblenden')).toBeTruthy();
		expect(screen.getByText(/Geh Schritt-für-Schritt folgendermaßen vor/)).toBeTruthy();
		fireEvent.click(screen.getByText('Neue Risikosituation eintragen'));
		fireEvent.click(screen.getByText('Speichern'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte beschreibe die Risikosituation.');
		fireEvent.change(screen.getByLabelText('Risikosituation'), { target: { value: 'Feier' } });
		fireEvent.click(screen.getByText('Speichern'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte wähle eine Bewertung aus.');
		fireEvent.change(screen.getByLabelText(/Wie schwierig ist es für dich/), {
			target: { value: 'very-hard' }
		});
		fireEvent.click(screen.getByText('Speichern'));
		await waitFor(() =>
			expect(created).toEqual({
				kind: 'situation',
				data: { situation: 'Feier', difficulty: 'very-hard', strategy: '' }
			})
		);
		expect(await screen.findByText('sehr schwer')).toBeTruthy();
		expect(screen.getByText('noch nicht bearbeitet')).toBeTruthy();
	});

	it('takes the answer to question 5 as the new strategy and keeps the previous one in the analysis', async () => {
		const item = situation('Feier');
		const calls: Array<{ path: string; body: any }> = [];
		const { host } = fakeHost({
			'GET /me/tools/risk-situations': () => tool([item]),
			'POST /me/tools/risk-situations/entries': (body) => {
				calls.push({ path: 'create', body });
				return entry(body.kind, body.data);
			},
			[`PUT /me/tools/risk-situations/entries/${item.id}`]: (body) => {
				calls.push({ path: 'update', body });
				return { ...item, data: body.data };
			}
		});
		renderWith(host, page());
		fireEvent.click(await screen.findByText('Rückfall analysieren'));
		expect(screen.getByText('Bewältigungsstrategien verfeinern')).toBeTruthy();
		fireEvent.click(screen.getByText('Speichern'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte beantworten Sie mindestens eine der Fragen.');
		fireEvent.change(screen.getByLabelText(/^1\. Welche Umstände/), { target: { value: 'Geburtstag' } });
		fireEvent.change(screen.getByLabelText(/^5\. Wie könnten Sie/), {
			target: { value: 'Gar nicht hingehen' }
		});
		fireEvent.click(screen.getByText('Speichern'));
		await waitFor(() => expect(calls).toHaveLength(2));
		expect(calls[0]?.body.data).toMatchObject({
			situationId: item.id,
			circumstances: 'Geburtstag',
			previousStrategy: 'Früh gehen',
			newStrategy: 'Gar nicht hingehen'
		});
		expect(calls[1]?.body.data).toEqual({
			situation: 'Feier',
			difficulty: 'hard',
			strategy: 'Gar nicht hingehen'
		});
		expect(await screen.findByText('Alle Rückfälle')).toBeTruthy();
		expect(screen.queryByLabelText(/^1\. Welche Umstände/)).toBeNull();
		expect(screen.getByText('Geburtstag')).toBeTruthy();
		expect(screen.getByText('Weiteren Rückfall analysieren')).toBeTruthy();
	});

	it('deletes an analysis after asking', async () => {
		const item = situation('Feier');
		const analysis = entry('relapse', {
			situationId: item.id,
			circumstances: 'Geburtstag',
			feelings: '',
			mainReason: '',
			alternatives: '',
			previousStrategy: 'Früh gehen',
			newStrategy: ''
		});
		const { host, calls } = fakeHost({
			'GET /me/tools/risk-situations': () => tool([item, analysis]),
			[`DELETE /me/tools/risk-situations/entries/${analysis.id}`]: () => undefined
		});
		renderWith(host, page());
		fireEvent.click(await screen.findByText('Rückfall analysieren'));
		expect(screen.queryByLabelText(/^1\. Welche Umstände/)).toBeNull();
		fireEvent.click(screen.getByText('Löschen'));
		expect(screen.getByText('Diese Rückfallanalyse löschen?')).toBeTruthy();
		fireEvent.click(screen.getByText('Abbrechen'));
		expect(calls.some((c) => c.method === 'DELETE')).toBe(false);
		fireEvent.click(screen.getByText('Löschen'));
		fireEvent.click(screen.getByText('Löschen'));
		await waitFor(() => expect(screen.queryByText('Alle Rückfälle')).toBeNull());
		expect(calls.filter((c) => c.method === 'DELETE').map((c) => c.path)).toEqual([
			`/me/tools/risk-situations/entries/${analysis.id}`
		]);
	});

	it('shows counsellors cards with the last relapse, new markers and pages of five', () => {
		const items = Array.from({ length: 6 }, (_, index) => situation(`Situation ${index + 1}`));
		const relapse = entry('relapse', {
			situationId: items[0]!.id,
			circumstances: 'Geburtstag',
			feelings: '',
			mainReason: 'Druck',
			alternatives: '',
			previousStrategy: 'Früh gehen',
			newStrategy: 'Gar nicht hingehen'
		});
		render(
			<div className="bt">
				<RiskCounsellor
					entries={[...items, relapse]}
					options={{}}
					locale="de"
					linked={{}}
					isNew={(e) => e.id === relapse.id}
				/>
			</div>
		);
		expect(screen.getByText('Seite 1 von 2')).toBeTruthy();
		expect(screen.queryByText('Situation 6')).toBeNull();
		const first = screen.getByText('Situation 1').closest('.bt-entry') as HTMLElement;
		expect(first.className).toContain('bt-entry--new');
		expect(within(first).getByText(/^Letzter Rückfall/)).toBeTruthy();
		expect(within(first).getByText('Druck')).toBeTruthy();
		fireEvent.click(screen.getByText('Weiter'));
		expect(screen.getByText('Situation 6')).toBeTruthy();
	});

	it('speaks English to an English client, in the editor and the relapse analysis', async () => {
		const { host } = fakeHost(
			{ 'GET /me/tools/risk-situations': () => tool([situation('Party')]) },
			{ locale: 'en' }
		);
		renderWith(host, page());
		expect(await screen.findByText('My risk situations and control strategies')).toBeTruthy();
		expect(screen.getByText('hard')).toBeTruthy();
		expect(screen.getByText('not done yet')).toBeTruthy();
		fireEvent.click(screen.getByText('How to fill this in'));
		expect(screen.getByText('Enter risk situations').closest('li')?.textContent).toBe(
			'Enter risk situations in which you have used substances or shown the problematic behaviour so far.'
		);
		fireEvent.click(screen.getByText('Analyse a relapse'));
		expect(screen.getByText('Improve your coping strategies')).toBeTruthy();
		expect(screen.getByLabelText(/^5\. How could you master the situation/)).toBeTruthy();
		fireEvent.click(screen.getByText('Save'));
		expect(screen.getByRole('alert').textContent).toBe('Please answer at least one of the questions.');
		fireEvent.click(screen.getByText('Back to overview'));
		fireEvent.click(screen.getByText('Enter a new risk situation'));
		expect(screen.getByLabelText(/How difficult is it for you/)).toBeTruthy();
		expect(screen.getByRole('option', { name: 'very hard' })).toBeTruthy();
	});

	it('shows counsellors the cards in English', () => {
		const { host } = fakeHost({}, { locale: 'en' });
		renderWith(
			host,
			<RiskCounsellor
				entries={[situation('Party')]}
				options={{}}
				locale="en"
				linked={{}}
				isNew={() => false}
			/>
		);
		expect(screen.getByText('No relapse recorded.')).toBeTruthy();
		expect(screen.getByText('Control strategy')).toBeTruthy();
		expect(screen.getByText(/^Last changed on /)).toBeTruthy();
	});
});
