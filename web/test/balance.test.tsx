import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolPage } from '../src/core/ToolPage.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

const tool = (entries: unknown[]) => ({
	id: 'balance',
	demo: false,
	shared: false,
	allowSharing: false,
	options: { intro: '', poles: 'keine Veränderung / Ich möchte etwas ändern!' },
	entries
});

describe('Motivationswaage', () => {
	it('stays inactive without points and asks to work on the exercise first', async () => {
		const { host } = fakeHost({ 'GET /me/tools/balance': () => tool([]) });
		renderWith(
			host,
			<ToolPage toolId="balance" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
		);
		expect(await screen.findAllByText('Bitte bearbeiten Sie zunächst die Übung.')).toHaveLength(2);
		expect(screen.queryByRole('switch')).toBeNull();
		expect(screen.getByText('Ich möchte etwas ändern!')).toBeTruthy();
	});

	it('adds a rated argument and moves the scale', async () => {
		let created: unknown = null;
		const { host } = fakeHost({
			'GET /me/tools/balance': () =>
				tool([entry('argument', { category: 'B', text: 'Der Rausch wird mir fehlen.', rating: 1 })]),
			'POST /me/tools/balance/entries': (body) => {
				created = body;
				return entry(body.kind, body.data);
			}
		});
		renderWith(
			host,
			<ToolPage toolId="balance" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
		);
		expect(await screen.findByText('−10,0')).toBeTruthy();
		fireEvent.click(screen.getAllByText('Hinzufügen')[0]!);
		fireEvent.click(screen.getByText('Eintrag hinzufügen'));
		expect(screen.getByRole('alert').textContent).toBe('Bitte tragen Sie einen Vorteil ein.');
		fireEvent.change(screen.getByLabelText('Neuer Vorteil'), { target: { value: 'Mehr Geld' } });
		fireEvent.click(screen.getByText('Eintrag hinzufügen'));
		expect(screen.getByRole('alert').textContent).toBe(
			'Bitte bewerten Sie, wie wichtig dieser Aspekt für Sie ist.'
		);
		fireEvent.click(screen.getByLabelText('sehr wichtig (★★★)'));
		fireEvent.click(screen.getByText('Eintrag hinzufügen'));
		await waitFor(() =>
			expect(created).toEqual({ kind: 'argument', data: { category: 'A', text: 'Mehr Geld', rating: 3 } })
		);
		expect(await screen.findByText('+5,0, PRO-Tendenz')).toBeTruthy();
	});

	it('deletes an argument only after confirmation', async () => {
		const argument = entry('argument', { category: 'A', text: 'Weg damit', rating: 2 });
		const { host, calls } = fakeHost({
			'GET /me/tools/balance': () => tool([argument]),
			[`DELETE /me/tools/balance/entries/${argument.id}`]: () => undefined
		});
		renderWith(
			host,
			<ToolPage toolId="balance" mode="client" backLabel="Meine Tools" onBack={() => undefined} />
		);
		fireEvent.click((await screen.findAllByText('Bearbeiten'))[1]!);
		fireEvent.click(screen.getByLabelText('Löschen: Weg damit'));
		const item = screen.getByText('Diesen Eintrag löschen?').parentElement as HTMLElement;
		fireEvent.click(within(item).getByText('Löschen'));
		await waitFor(() => expect(calls.some((c) => c.method === 'DELETE')).toBe(true));
		await waitFor(() => expect(screen.queryByText('Weg damit')).toBeNull());
	});
});
