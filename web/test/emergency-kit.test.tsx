import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolPage } from '../src/core/ToolPage.tsx';
import { KitCounsellor } from '../src/tools/emergency-kit/KitCounsellor.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

const tool = (entries: unknown[], extra: Record<string, unknown> = {}) => ({
	id: 'emergency-kit',
	demo: false,
	shared: false,
	allowSharing: true,
	options: { agency: '' },
	entries,
	linked: {},
	counsellors: [],
	...extra
});

const page = () => (
	<ToolPage toolId="emergency-kit" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
);

const risk = entry('situation', { situation: 'Feier', difficulty: 'hard', strategy: 'Früh gehen' });

describe('Notfallkoffer', () => {
	it('shows section 6 only when the risk situations exercise is released', async () => {
		const { host } = fakeHost({ 'GET /me/tools/emergency-kit': () => tool([]) });
		const { unmount } = renderWith(host, page());
		expect(await screen.findByText('Meine Motivation: Darum bleibe ich dabei')).toBeTruthy();
		expect(screen.queryByText('Meine wichtigsten Risikosituationen & Kontrollstrategien')).toBeNull();
		unmount();
		const released = fakeHost({
			'GET /me/tools/emergency-kit': () => tool([], { linked: { 'risk-situations': [risk] } })
		});
		renderWith(released.host, page());
		expect(await screen.findByText('Meine wichtigsten Risikosituationen & Kontrollstrategien')).toBeTruthy();
	});

	it('shows each risk situation with its rating, and no rating where there is none', async () => {
		const unrated = entry('situation', { situation: 'Streit', strategy: 'Spazieren' });
		const { host } = fakeHost({
			'GET /me/tools/emergency-kit': () => tool([], { linked: { 'risk-situations': [risk, unrated] } })
		});
		renderWith(host, page());
		fireEvent.click(await screen.findByText('Meine wichtigsten Risikosituationen & Kontrollstrategien'));
		const rated = screen.getByText('Feier').closest('li') as HTMLElement;
		expect(within(rated).getByText('Bewertung')).toBeTruthy();
		expect(within(rated).getByText('schwer')).toBeTruthy();
		expect(within(rated).getByText('Früh gehen')).toBeTruthy();
		const other = screen.getByText('Streit').closest('li') as HTMLElement;
		expect(within(other).queryByText('Bewertung')).toBeNull();
		expect(other.textContent).not.toContain('undefined');
	});

	it('saves motivations only with their importance and takes examples over', async () => {
		const created: unknown[] = [];
		const { host } = fakeHost({
			'GET /me/tools/emergency-kit': () => tool([]),
			'POST /me/tools/emergency-kit/entries': (body) => {
				created.push(body);
				return entry(body.kind, body.data);
			}
		});
		renderWith(host, page());
		fireEvent.click(await screen.findByText('Meine Motivation: Darum bleibe ich dabei'));
		fireEvent.click(screen.getByText('Beispiele anzeigen'));
		fireEvent.click(screen.getByText('Endlich wieder frei sein'));
		fireEvent.click(screen.getByText('Speichern'));
		expect(screen.getByRole('alert').textContent).toBe(
			'Bitte wählen Sie bei jedem Eintrag aus, wie wichtig er für Sie ist.'
		);
		fireEvent.change(screen.getByLabelText('Wie wichtig?'), { target: { value: '1' } });
		fireEvent.click(screen.getByText('Speichern'));
		await waitFor(() =>
			expect(created).toEqual([
				{ kind: 'motivation', data: { text: 'Endlich wieder frei sein', importance: 1 } }
			])
		);
		expect(await screen.findByText('Endlich wieder frei sein')).toBeTruthy();
	});

	it('offers topic examples for critical situations', async () => {
		const { host } = fakeHost({ 'GET /me/tools/emergency-kit': () => tool([]) });
		renderWith(host, page());
		fireEvent.click(await screen.findByText('Kritische Situationen, Stimmungen und Gedanken'));
		fireEvent.click(screen.getByText('Beispiele anzeigen'));
		fireEvent.click(screen.getByText('Cannabis'));
		expect(screen.getByText('Wenn ich „nur so aus Neugier“ mal wieder kiffen will')).toBeTruthy();
	});

	it('asks for a self-help group once and shows the agency from the settings', async () => {
		const puts: string[] = [];
		const { host } = fakeHost({
			'GET /me/tools/emergency-kit': () =>
				tool([], { options: { agency: 'Suchtberatung Mitte' }, counsellors: ['Maria Beispiel'] }),
			'PUT /me/tools/emergency-kit/keyed/request/self-help-group': (body, url) => {
				puts.push(url.pathname);
				return entry('request', body.data, 'self-help-group');
			}
		});
		renderWith(host, page());
		fireEvent.click(await screen.findByText('Hier bekomme ich Unterstützung'));
		fireEvent.click(screen.getByText('Anzeigen'));
		expect(screen.getByText('Suchtberatung Mitte')).toBeTruthy();
		expect(screen.getByText('Maria Beispiel')).toBeTruthy();
		fireEvent.click(screen.getByText('Zurück', { selector: 'button.bt-linkbtn' }));
		fireEvent.click(screen.getByText('Selbsthilfegruppe eintragen'));
		expect(screen.getByRole('link').getAttribute('href')).toBe('https://www.nakos.de/adressen/rot/');
		fireEvent.click(screen.getByText('Ich möchte eine Selbsthilfegruppe empfohlen bekommen.'));
		await waitFor(() => expect(puts).toHaveLength(1));
		expect(await screen.findByText(/angefragt am/)).toBeTruthy();
		expect(screen.queryByRole('button', { name: /empfohlen bekommen/ })).toBeNull();
	});

	it('asks before the PDF when a section is empty', async () => {
		const { host, calls } = fakeHost({ 'GET /me/tools/emergency-kit': () => tool([]) });
		renderWith(host, page());
		fireEvent.click(await screen.findByText('Gesamten Notfallkoffer als PDF ausgeben'));
		expect(
			screen.getByText('Zu mindestens einer Rubrik liegen keine Einträge vor. Trotzdem fortfahren?')
		).toBeTruthy();
		fireEvent.click(screen.getByText('Fortfahren'));
		await waitFor(() =>
			expect(calls.some((call) => call.path === '/me/tools/emergency-kit/export/kit')).toBe(true)
		);
	});

	it('shows counsellors the sections as tiles and the risk situations only when shared', () => {
		const motivation = entry('motivation', { text: 'Frei sein', importance: 1 });
		const other = entry('other-strategies', { text: 'Atmen' }, 'main');
		const view = (linked: Record<string, unknown>) =>
			render(
				<div className="bt">
					<KitCounsellor
						entries={[motivation, other]}
						options={{}}
						locale="de"
						linked={linked}
						isNew={(e) => e.id === motivation.id}
					/>
				</div>
			);
		const { unmount } = view({});
		const tile = screen.getByRole('region', { name: 'Meine Motivation: Darum bleibe ich dabei' });
		expect(within(tile).getAllByText('Neu')).toHaveLength(2);
		expect(within(tile).getByText('sehr wichtig')).toBeTruthy();
		expect(screen.getByText(/nur sichtbar, solange auch/)).toBeTruthy();
		unmount();
		view({ 'risk-situations': [risk, entry('situation', { situation: 'Streit', strategy: 'Spazieren' })] });
		const rated = screen.getByText('Feier').closest('li') as HTMLElement;
		expect(within(rated).getByText('Bewertung')).toBeTruthy();
		expect(within(rated).getByText('schwer')).toBeTruthy();
		expect(within(rated).getByText('Früh gehen')).toBeTruthy();
		const unrated = screen.getByText('Streit').closest('li') as HTMLElement;
		expect(within(unrated).queryByText('Bewertung')).toBeNull();
		expect(unrated.textContent).not.toContain('undefined');
	});
});
