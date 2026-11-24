import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PositivePerceptionClient } from '../src/tools/positive-perception/PositivePerceptionClient.tsx';
import { PositivePerceptionCounsellor } from '../src/tools/positive-perception/PositivePerceptionCounsellor.tsx';
import { entry, fakeHost, renderWith } from './fakeHost.tsx';

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
		renderWith(
			fakeHost({}, { informal: true }).host,
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

describe('Positives Wahrnehmen in English', () => {
	it('shows the pages, the scheme and the praise list in English', () => {
		renderWith(
			fakeHost({}, { locale: 'en' }).host,
			<PositivePerceptionClient
				tool={tool as never}
				entries={[]}
				store={fakeStore() as never}
				informal={false}
				locale="en"
				download={async () => undefined}
				onDone={() => undefined}
			/>
		);
		expect(screen.getByText('Page 1 of 4')).toBeTruthy();
		expect(screen.getByText(/Conflicts and arguments are part of every healthy relationship/)).toBeTruthy();
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Choose a comment on the left.')).toBeTruthy();
		fireEvent.click(screen.getByText('“I knew you’d forget that again.”'));
		expect(screen.getByText('How the child sees themselves')).toBeTruthy();
		expect(screen.getByText('I am unreliable')).toBeTruthy();
		expect(screen.getAllByText('negative')).toHaveLength(2);
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Noticing the positive')).toBeTruthy();
		expect(screen.getByText('Coming home on time')).toBeTruthy();
		expect(screen.getByLabelText(/behaviours and activities of your child/)).toBeTruthy();
		expect(screen.getByText('No entries yet.')).toBeTruthy();
		expect(screen.getByText('Back')).toBeTruthy();
	});

	it('lists the behaviours for counsellors in English', () => {
		const saved = entry('behaviour', { text: 'Did the washing-up' });
		renderWith(
			fakeHost({}, { locale: 'en' }).host,
			<PositivePerceptionCounsellor
				entries={[saved]}
				options={{}}
				isNew={() => true}
				locale="en"
				linked={{}}
			/>
		);
		expect(screen.getByText('Behaviours and activities to praise')).toBeTruthy();
		expect(screen.getByText('New')).toBeTruthy();
		expect(screen.getByText(/^Last changed on 20\/11\/2026/)).toBeTruthy();
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
