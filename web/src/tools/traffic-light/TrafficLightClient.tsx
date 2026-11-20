import { Button, Card, Headline, RadioGroup, TextField } from '@oriso/web-kit';
import { useEffect, useRef, useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import {
	ACTIVITY_KIND,
	EXAMPLES,
	instructions,
	introText,
	LEVEL_VALUES,
	LEVELS,
	MAX_ACTIVITY_LENGTH,
	type Level
} from '../../../../shared/tools/traffic-light.ts';
import type { ClientViewProps } from '../types.ts';
import { activitiesOf, TrafficLight, type Item } from './parts.tsx';

type Editing = { item: Item | null };

/** The Ampelmodell as the client uses it (section 2.8): intro, the light with its activities and the input view. */
export function TrafficLightClient({ tool, entries, store, informal }: ClientViewProps) {
	const [editing, setEditing] = useState<Editing | null>(null);
	const returnFocus = useRef<HTMLElement | null>(null);
	const items = activitiesOf(entries);

	const open = (item: Item | null) => {
		returnFocus.current = document.activeElement as HTMLElement | null;
		setEditing({ item });
	};
	const close = () => {
		setEditing(null);
		const target = returnFocus.current;
		setTimeout(() => (target?.isConnected ? target : document.getElementById('traffic-light-add'))?.focus());
	};

	if (editing) {
		return (
			<Editor
				key={editing.item?.id ?? 'new'}
				item={editing.item}
				informal={informal}
				store={store}
				onClose={close}
			/>
		);
	}
	const intro =
		typeof tool.options.intro === 'string' && tool.options.intro ? tool.options.intro : introText(informal);
	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<p className="bt-pre">{intro}</p>
					<p className="bt-title">Anleitung zum Ausfüllen:</p>
					<ol className="bt-ol">
						{instructions(informal).map((line) => (
							<li key={line}>{line}</li>
						))}
					</ol>
					<p className="bt-title">Farberläuterungen:</p>
					<ul className="bt-legend bt-legend--long">
						{LEVEL_VALUES.map((level) => (
							<li key={level}>
								<span className={`bt-lamp bt-lamp--${LEVELS[level].colour}`} aria-hidden />
								<span>
									<strong>{LEVELS[level].colourName}:</strong> {LEVELS[level].explanation(informal)}
								</span>
							</li>
						))}
					</ul>
				</div>
			</Card>
			<Card>
				<div className="bt-stack">
					<TrafficLight
						items={items}
						renderItem={(item) => (
							<button
								type="button"
								className="bt-activity bt-activity--button"
								aria-label={`${item.text}, ${LEVELS[item.level].danger}: bearbeiten oder löschen`}
								onClick={() => open(item)}
							>
								<span className="bt-item__text">{item.text}</span>
							</button>
						)}
					/>
					<div>
						<Button id="traffic-light-add" onClick={() => open(null)}>
							+ Neue Aktivität eintragen
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

interface EditorProps {
	item: Item | null;
	informal: boolean;
	store: ClientViewProps['store'];
	onClose: () => void;
}

function Editor({ item, informal, store, onClose }: EditorProps) {
	const [text, setText] = useState(item?.text ?? '');
	const [level, setLevel] = useState<string>(item ? String(item.level) : '');
	const [problem, setProblem] = useState<string | null>(null);
	const [confirming, setConfirming] = useState(false);

	useEffect(() => {
		document.getElementById('traffic-light-activity')?.focus();
	}, []);

	const save = () => {
		if (!text.trim()) {
			setProblem(
				tx(informal, 'Bitte tragen Sie eine Medienaktivität ein.', 'Bitte trage eine Medienaktivität ein.')
			);
			return;
		}
		if (!level) {
			setProblem(
				tx(
					informal,
					'Bitte wählen Sie aus, wie hoch die Gefahr ist.',
					'Bitte wähle aus, wie hoch die Gefahr ist.'
				)
			);
			return;
		}
		const data = { text: text.trim(), level: Number(level) as Level };
		void (item ? store.update(item.id, data) : store.create(ACTIVITY_KIND, data));
		onClose();
	};

	return (
		<Card>
			<form
				className="bt-stack"
				onSubmit={(event) => {
					event.preventDefault();
					save();
				}}
			>
				<Headline level={3}>
					{item
						? 'Aktivität bearbeiten'
						: tx(informal, 'Geben Sie eine neue Medienaktivität ein', 'Gib eine neue Medienaktivität ein')}
				</Headline>
				<TextField
					id="traffic-light-activity"
					label="Medienaktivität"
					value={text}
					maxLength={MAX_ACTIVITY_LENGTH}
					error={Boolean(problem) && !text.trim()}
					onChange={setText}
				/>
				<div className="bt-stack bt-stack--tight">
					<span className="bt-small bt-muted">Beispiele:</span>
					<div className="bt-chips">
						{EXAMPLES.map((example) => (
							<button key={example} type="button" className="bt-chip" onClick={() => setText(example)}>
								{example}
							</button>
						))}
					</div>
				</div>
				<RadioGroup
					label="Wie hoch ist die Gefahr, dass diese Aktivität zur Sucht führt?"
					value={level}
					options={LEVEL_VALUES.map((value) => ({
						value: String(value),
						label: `${LEVELS[value].danger} (${LEVELS[value].colourName})`
					}))}
					error={Boolean(problem) && !level}
					onChange={setLevel}
				/>
				{problem && (
					<p role="alert" style={{ color: 'var(--bt-error)' }}>
						{problem}
					</p>
				)}
				<div className="bt-row bt-row--between">
					<div className="bt-row">
						<Button variant="secondary" onClick={onClose}>
							Abbrechen
						</Button>
						<Button type="submit">Speichern</Button>
					</div>
					{item && !confirming && (
						<Button variant="tertiary" onClick={() => setConfirming(true)}>
							Löschen
						</Button>
					)}
				</div>
				{item && confirming && (
					<div className="bt-confirm" role="group" aria-label="Löschen bestätigen">
						<span style={{ flex: 1 }}>Diese Aktivität löschen?</span>
						<Button
							onClick={() => {
								void store.remove(item.id);
								onClose();
							}}
						>
							Löschen
						</Button>
						<Button variant="tertiary" onClick={() => setConfirming(false)}>
							Abbrechen
						</Button>
					</div>
				)}
			</form>
		</Card>
	);
}
