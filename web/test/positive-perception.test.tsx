import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PositivePerceptionClient } from '../src/tools/positive-perception/PositivePerceptionClient.tsx';
import { PositivePerceptionCounsellor } from '../src/tools/positive-perception/PositivePerceptionCounsellor.tsx';
import { entry } from './fakeHost.tsx';

const tool = {
	id: 'positive-perception',
	demo: false,
	shared: false,
	allowSharing: true,
	options: {},
	entries: []
} as const;

const fakeStore = () => ({
	create: vi.fn(async () => undefined),
	update: vi.fn(async () => undefined),
	remove: vi.fn(async () => undefined),
	putKeyed: vi.fn(async () => undefined),
	removeKeyed: vi.fn(async () => undefined)
});

describe('Positives Wahrnehmen', () => {
	it('leads through the pages and shows the reaction of the chosen remark', () => {
		const onDone = vi.fn();
		render(
			<PositivePerceptionClient
				tool={tool as never}
				entries={[]}
				store={fakeStore() as never}
				informal={true}
				locale="de"
				download={async () => undefined}
				onDone={onDone}
			/>
		);
		expect(screen.getByText(/Auch wenn Konflikte und Streit/)).toBeTruthy();
		fireEvent.click(screen.getByText('Weiter'));
		expect(screen.getByText(/Klicke auf die Kommentare/)).toBeTruthy();
		expect(screen.getByText('Wähle links eine Bemerkung aus.')).toBeTruthy();
		const remark = screen.getByText('„Es war ja klar, dass du das wieder vergisst.“').closest('button')!;
		fireEvent.click(remark);
		expect(remark.getAttribute('aria-pressed')).toBe('true');
		expect(screen.getByText('ich bin unzuverlässig')).toBeTruthy();
		expect(screen.getByText('traurig, weiterhin unzuverlässig')).toBeTruthy();
		fireEvent.click(screen.getByText('„Wie geschickt du damit bist.“'));
		expect(remark.getAttribute('aria-pressed')).toBe('false');
		expect(screen.getByText('ich kann was')).toBeTruthy();
		fireEvent.click(screen.getByText('Weiter'));
		expect(screen.getByText(/Selbstvertrauen deines Kindes/)).toBeTruthy();
		fireEvent.click(screen.getByText('Weiter'));
		expect(screen.getByText('Positive Aspekte wahrnehmen')).toBeTruthy();
		fireEvent.click(screen.getByText('Weiter'));
		expect(onDone).toHaveBeenCalled();
	});

	it('saves, edits and deletes praiseworthy behaviours', async () => {
		const store = fakeStore();
		const saved = entry('behaviour', { text: 'Hausaufgaben gemacht' });
		render(
			<PositivePerceptionClient
				tool={tool as never}
				entries={[saved]}
				store={store as never}
				informal={false}
				locale="de"
				download={async () => undefined}
				onDone={() => undefined}
			/>
		);
		expect(screen.getByText('Seite 4 von 4')).toBeTruthy();
		fireEvent.click(screen.getByText('Hinweis ausblenden'));
		expect(screen.queryByText(/Bedenken Sie dabei/)).toBeNull();
		fireEvent.click(screen.getByText('Hinweis einblenden'));
		expect(screen.getByText(/Bedenken Sie dabei/)).toBeTruthy();

		const input = screen.getByLabelText(/Bitte tragen Sie hier Verhaltensweisen/);
		fireEvent.click(screen.getByText('Speichern'));
		expect(store.create).not.toHaveBeenCalled();
		fireEvent.change(input, { target: { value: ' Pünktlich zu Hause ' } });
		fireEvent.click(screen.getByText('Speichern'));
		expect(store.create).toHaveBeenCalledWith('behaviour', { text: 'Pünktlich zu Hause' });

		fireEvent.click(screen.getByLabelText('Bearbeiten: Hausaufgaben gemacht'));
		fireEvent.change(input, { target: { value: 'Hausaufgaben ohne Erinnerung gemacht' } });
		fireEvent.click(screen.getByText('Änderung speichern'));
		expect(store.update).toHaveBeenCalledWith(saved.id, { text: 'Hausaufgaben ohne Erinnerung gemacht' });

		fireEvent.click(screen.getByLabelText('Löschen: Hausaufgaben gemacht'));
		const item = screen.getByText('Diesen Eintrag löschen?').parentElement as HTMLElement;
		fireEvent.click(within(item).getByText('Löschen'));
		await waitFor(() => expect(store.remove).toHaveBeenCalledWith(saved.id));
	});
});

describe('Positives Wahrnehmen for counsellors', () => {
	it('lists the saved behaviours read only and marks new ones', () => {
		const old = entry('behaviour', { text: 'Abwasch erledigt' });
		const fresh = entry('behaviour', { text: 'An Omas Geburtstag gedacht' });
		render(
			<PositivePerceptionCounsellor
				entries={[old, fresh]}
				options={{}}
				isNew={(e) => e === fresh}
				locale="de"
				linked={{}}
			/>
		);
		expect(screen.getByText('Abwasch erledigt')).toBeTruthy();
		expect(screen.getByText('An Omas Geburtstag gedacht')).toBeTruthy();
		expect(screen.getAllByText('Neu')).toHaveLength(1);
		expect(screen.queryAllByRole('button')).toHaveLength(0);
	});
});
