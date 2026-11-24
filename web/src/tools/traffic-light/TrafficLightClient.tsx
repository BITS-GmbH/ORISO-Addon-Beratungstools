import { Button, Card, Headline, RadioGroup, TextField } from '@oriso/web-kit';
import { useEffect, useRef, useState } from 'react';
import {
	ACTIVITY_KIND,
	LEVEL_COLOURS,
	LEVEL_VALUES,
	MAX_ACTIVITY_LENGTH,
	type Level
} from '../../../../shared/tools/traffic-light.ts';
import { useI18n } from '../../host.ts';
import type { ClientViewProps } from '../types.ts';
import { activitiesOf, TrafficLight, type Item } from './parts.tsx';

type Editing = { item: Item | null };

/** The Ampelmodell as the client uses it (section 2.8): intro, the light with its activities and the input view. */
export function TrafficLightClient({ tool, entries, store }: ClientViewProps) {
	const { m, t } = useI18n();
	const texts = m.trafficLight;
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
		return <Editor key={editing.item?.id ?? 'new'} item={editing.item} store={store} onClose={close} />;
	}
	const intro =
		typeof tool.options.intro === 'string' && tool.options.intro ? tool.options.intro : texts.intro;
	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<p className="bt-pre">{intro}</p>
					<p className="bt-title">{texts.instructionsTitle}</p>
					<ol className="bt-ol">
						{texts.instructions.map((line) => (
							<li key={line}>{line}</li>
						))}
					</ol>
					<p className="bt-title">{texts.explanationsTitle}</p>
					<ul className="bt-legend bt-legend--long">
						{LEVEL_VALUES.map((level) => {
							const colour = LEVEL_COLOURS[level];
							return (
								<li key={level}>
									<span className={`bt-lamp bt-lamp--${colour}`} aria-hidden />
									<span>
										<strong>{texts.levels[colour].colourName}:</strong> {texts.levels[colour].explanation}
									</span>
								</li>
							);
						})}
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
								aria-label={t(texts.editActivityLabel, {
									text: item.text,
									danger: texts.levels[LEVEL_COLOURS[item.level]].danger
								})}
								onClick={() => open(item)}
							>
								<span className="bt-item__text">{item.text}</span>
							</button>
						)}
					/>
					<div>
						<Button id="traffic-light-add" onClick={() => open(null)}>
							{texts.add}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

interface EditorProps {
	item: Item | null;
	store: ClientViewProps['store'];
	onClose: () => void;
}

function Editor({ item, store, onClose }: EditorProps) {
	const { m, t } = useI18n();
	const texts = m.trafficLight;
	const [text, setText] = useState(item?.text ?? '');
	const [level, setLevel] = useState<string>(item ? String(item.level) : '');
	const [problem, setProblem] = useState<string | null>(null);
	const [confirming, setConfirming] = useState(false);

	useEffect(() => {
		document.getElementById('traffic-light-activity')?.focus();
	}, []);

	const save = () => {
		if (!text.trim()) {
			setProblem(texts.missingActivity);
			return;
		}
		if (!level) {
			setProblem(texts.missingLevel);
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
				<Headline level={3}>{item ? texts.editTitle : texts.newTitle}</Headline>
				<TextField
					id="traffic-light-activity"
					label={texts.activityLabel}
					value={text}
					maxLength={MAX_ACTIVITY_LENGTH}
					error={Boolean(problem) && !text.trim()}
					onChange={setText}
				/>
				<div className="bt-stack bt-stack--tight">
					<span className="bt-small bt-muted">{texts.examplesLabel}</span>
					<div className="bt-chips">
						{texts.examples.map((example) => (
							<button key={example} type="button" className="bt-chip" onClick={() => setText(example)}>
								{example}
							</button>
						))}
					</div>
				</div>
				<RadioGroup
					label={texts.dangerQuestion}
					value={level}
					options={LEVEL_VALUES.map((value) => ({
						value: String(value),
						label: t(texts.levelOption, {
							danger: texts.levels[LEVEL_COLOURS[value]].danger,
							colour: texts.levels[LEVEL_COLOURS[value]].colourName
						})
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
							{texts.cancel}
						</Button>
						<Button type="submit">{texts.save}</Button>
					</div>
					{item && !confirming && (
						<Button variant="secondary" onClick={() => setConfirming(true)}>
							{texts.delete}
						</Button>
					)}
				</div>
				{item && confirming && (
					<div className="bt-confirm" role="group" aria-label={texts.confirmDeleteLabel}>
						<span style={{ flex: 1 }}>{texts.confirmDelete}</span>
						<Button
							onClick={() => {
								void store.remove(item.id);
								onClose();
							}}
						>
							{texts.delete}
						</Button>
						<Button variant="secondary" onClick={() => setConfirming(false)}>
							{texts.cancel}
						</Button>
					</div>
				)}
			</form>
		</Card>
	);
}
