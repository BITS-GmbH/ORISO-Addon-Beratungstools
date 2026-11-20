import { Button, Card, Headline, RadioGroup, Select, Textarea } from '@oriso/web-kit';
import { useRef, useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import {
	ARGUMENT_KIND,
	CATEGORIES,
	CONCLUSION_KEY,
	CONCLUSION_KIND,
	EXAMPLES,
	HALF_TEXT,
	HALVES,
	MAX_CONCLUSION_LENGTH,
	MAX_TEXT_LENGTH,
	RATINGS,
	type CategoryId,
	type Half
} from '../../../../shared/tools/balance.ts';
import { BackButton } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import {
	argumentsOf,
	conclusionOf,
	IconButton,
	MiniResult,
	ScaleCard,
	SideBadge,
	Stars,
	type Item
} from './parts.tsx';

const listTitle = (category: CategoryId, informal: boolean) => {
	const { kind, change } = CATEGORIES[category];
	const what = kind === 'advantage' ? 'Vorteile' : 'Nachteile';
	return change
		? tx(
				informal,
				`Ihre eingetragenen ${what}, wenn Sie Ihr Ziel erreichen:`,
				`Deine eingetragenen ${what}, wenn du dein Ziel erreichst:`
			)
		: tx(
				informal,
				`Ihre eingetragenen ${what}, wenn Sie Ihr Verhalten nicht ändern:`,
				`Deine eingetragenen ${what}, wenn du dein Verhalten nicht änderst:`
			);
};

/** The Motivationswaage as the client uses it (section 2.4): overview with scale, conclusion and lists, and the editor. */
export function BalanceClient({ tool, entries, store, informal }: ClientViewProps) {
	const [editing, setEditing] = useState<{ half: Half; category: CategoryId } | null>(null);
	const items = argumentsOf(entries);
	const conclusion = conclusionOf(entries);

	if (editing) {
		return (
			<Editor
				key={editing.half}
				half={editing.half}
				initialCategory={editing.category}
				items={items}
				informal={informal}
				store={store}
				onClose={() => setEditing(null)}
			/>
		);
	}
	return (
		<div className="bt-stack">
			<Intro intro={typeof tool.options.intro === 'string' ? tool.options.intro : ''} informal={informal} />
			<ScaleCard
				items={items}
				poles={tool.options.poles}
				hint={tx(informal, 'Bitte bearbeiten Sie zunächst die Übung.', 'Bitte bearbeite zunächst die Übung.')}
			/>
			<Conclusion
				value={(conclusion?.data as { text: string } | undefined)?.text ?? ''}
				hasArguments={items.length > 0}
				informal={informal}
				onSave={(text) =>
					text
						? store.putKeyed(CONCLUSION_KIND, CONCLUSION_KEY, { text })
						: store.removeKeyed(CONCLUSION_KIND, CONCLUSION_KEY)
				}
			/>
			{(['change', 'keep'] as const).map((half) => (
				<Card key={half}>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">{HALF_TEXT[half]}</h3>
						<div className="bt-columns">
							{HALVES[half].map((category) => {
								const list = items.filter((item) => item.category === category);
								return (
									<div key={category} className="bt-column">
										<div className="bt-row bt-row--between">
											<strong>… {CATEGORIES[category].title}</strong>
											<SideBadge category={category} />
										</div>
										{list.length === 0 ? (
											<p className="bt-muted bt-small">Noch keine Einträge.</p>
										) : (
											<ul className="bt-list">
												{list.map((item) => (
													<li key={item.id} className="bt-item">
														<span className="bt-item__text">{item.text}</span>
														<Stars rating={item.rating} />
													</li>
												))}
											</ul>
										)}
										<div>
											<button
												type="button"
												className="bt-linkbtn"
												onClick={() => setEditing({ half, category })}
											>
												{list.length ? 'Bearbeiten' : 'Hinzufügen'}
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}

function Intro({ intro, informal }: { intro: string; informal: boolean }) {
	const [open, setOpen] = useState(false);
	const steps: Array<[string, string]> = [
		[
			'Argumente sammeln',
			tx(
				informal,
				'Überlegen Sie für sich persönlich: Welche Folgen hat es, wenn ich mein Verhalten ändere, also bspw. mit dem Trinken, Spielen oder Kiffen aufhöre? Was passiert, wenn ich weitermache wie bisher? Seien Sie dabei ehrlich zu sich selbst!',
				'Überlege für dich persönlich: Welche Folgen hat es, wenn ich mein Verhalten ändere, also bspw. mit dem Trinken, Spielen oder Kiffen aufhöre? Was passiert, wenn ich weitermache wie bisher? Sei dabei ehrlich zu dir selbst!'
			)
		],
		[
			'Bewerten',
			tx(
				informal,
				'In beiden Fällen können die Auswirkungen einer Veränderung für Sie positiv oder negativ sein. Überlegen Sie auch, ob diese Auswirkungen für Sie besonders wichtig oder eher weniger wichtig sind.',
				'In beiden Fällen können die Auswirkungen einer Veränderung für dich positiv oder negativ sein. Überlege auch, ob diese Auswirkungen für dich besonders wichtig oder eher weniger wichtig sind.'
			)
		],
		[
			'Ergebnis ansehen',
			tx(
				informal,
				'Wenn Sie alle Vor- und Nachteile eingetragen und bewertet haben, zeigt Ihnen die Motivationswaage Ihre aktuelle innere Haltung zu dem ausgewählten Thema an.',
				'Wenn du alle Vor- und Nachteile eingetragen und bewertet hast, zeigt dir die Motivationswaage deine aktuelle innere Haltung zu dem ausgewählten Thema an.'
			)
		],
		[
			'Fazit ziehen',
			tx(
				informal,
				'Was ist Ihr Fazit? Wie schätzen Sie Ihre aktuelle Motivation ein? Sind Sie innerlich bereit, Ihr Verhalten zu verändern? Oder brauchen Sie weitere Argumente?',
				'Was ist dein Fazit? Wie schätzt du deine aktuelle Motivation ein? Bist du innerlich bereit, dein Verhalten zu verändern? Oder brauchst du weitere Argumente?'
			)
		]
	];
	return (
		<Card>
			<div className="bt-stack bt-stack--tight">
				<p className="bt-pre">
					{intro ||
						tx(
							informal,
							'Die eigenen Gewohnheiten zu ändern ist immer eine herausfordernde Aufgabe. Jede Veränderung ist anstrengend, kostet Kraft und braucht Durchhaltevermögen. Die Motivationswaage hilft Ihnen dabei, sich über die Vor- und Nachteile einer Überwindung des Suchtverhaltens im Klaren zu sein.',
							'Die eigenen Gewohnheiten zu ändern ist immer eine herausfordernde Aufgabe. Jede Veränderung ist anstrengend, kostet Kraft und braucht Durchhaltevermögen. Die Motivationswaage hilft dir dabei, dir über die Vor- und Nachteile einer Überwindung des Suchtverhaltens im Klaren zu sein.'
						)}
				</p>
				<div>
					<button type="button" className="bt-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
						So funktioniert die Motivationswaage
					</button>
				</div>
				{open && (
					<ol className="bt-stack bt-stack--tight" style={{ paddingLeft: 20, margin: 0 }}>
						{steps.map(([title, text]) => (
							<li key={title}>
								<strong>{title}:</strong> {text}
							</li>
						))}
						<li style={{ listStyle: 'none', marginLeft: -20 }} className="bt-muted">
							{tx(
								informal,
								'Sie können die Übung jederzeit erneut bearbeiten und ergänzen, wenn Ihnen neue Vor- und Nachteile einfallen. Wenn Sie möchten, kann Ihre Beraterin / Ihr Berater Ihre Angaben einsehen und Sie so bei Ihrem Vorhaben optimal unterstützen.',
								'Du kannst die Übung jederzeit erneut bearbeiten und ergänzen, wenn dir neue Vor- und Nachteile einfallen. Wenn du möchtest, kann deine Beraterin / dein Berater deine Angaben einsehen und dich so bei deinem Vorhaben optimal unterstützen.'
							)}
						</li>
					</ol>
				)}
			</div>
		</Card>
	);
}

function Conclusion({
	value,
	hasArguments,
	informal,
	onSave
}: {
	value: string;
	hasArguments: boolean;
	informal: boolean;
	onSave: (text: string) => void;
}) {
	const [draft, setDraft] = useState<string | null>(null);
	const prompt = tx(
		informal,
		'Welches Bild ergibt sich für Sie, nachdem Sie alle Argumente gesammelt haben? Welche Schlussfolgerungen ziehen Sie für sich zum momentanen Zeitpunkt?',
		'Welches Bild ergibt sich für dich, nachdem du alle Argumente gesammelt hast? Welche Schlussfolgerungen ziehst du für dich zum momentanen Zeitpunkt?'
	);
	return (
		<Card>
			<div className="bt-stack bt-stack--tight">
				<div className="bt-row bt-row--between">
					<h3 className="bt-title">Mein Fazit</h3>
					{hasArguments && draft === null && (
						<button type="button" className="bt-linkbtn" onClick={() => setDraft(value)}>
							Bearbeiten
						</button>
					)}
				</div>
				{!hasArguments ? (
					<p className="bt-muted">
						{tx(informal, 'Bitte bearbeiten Sie zunächst die Übung.', 'Bitte bearbeite zunächst die Übung.')}
					</p>
				) : draft !== null ? (
					<>
						<Textarea
							label={prompt}
							value={draft}
							maxLength={MAX_CONCLUSION_LENGTH}
							minRows={4}
							onChange={setDraft}
						/>
						<div className="bt-row">
							<Button
								onClick={() => {
									onSave(draft.trim());
									setDraft(null);
								}}
							>
								Fazit speichern
							</Button>
							<Button variant="tertiary" onClick={() => setDraft(null)}>
								Abbrechen
							</Button>
						</div>
					</>
				) : value ? (
					<p className="bt-pre">{value}</p>
				) : (
					<p className="bt-muted">{prompt}</p>
				)}
			</div>
		</Card>
	);
}

interface EditorProps {
	half: Half;
	initialCategory: CategoryId;
	items: Item[];
	informal: boolean;
	store: ClientViewProps['store'];
	onClose: () => void;
}

function Editor({ half, initialCategory, items, informal, store, onClose }: EditorProps) {
	const [category, setCategory] = useState<CategoryId>(initialCategory);
	const [text, setText] = useState('');
	const [rating, setRating] = useState<string>('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [showExamples, setShowExamples] = useState(false);
	const [problem, setProblem] = useState<string | null>(null);
	const [confirming, setConfirming] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement>(null);
	const noun = CATEGORIES[category].kind === 'advantage' ? 'Vorteil' : 'Nachteil';

	const reset = () => {
		setText('');
		setRating('');
		setEditingId(null);
		setProblem(null);
	};

	const startEdit = (item: Item) => {
		setCategory(item.category);
		setText(item.text);
		setRating(String(item.rating));
		setEditingId(item.id);
		setProblem(null);
		formRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
	};

	const submit = () => {
		if (!text.trim()) {
			setProblem(tx(informal, `Bitte tragen Sie einen ${noun} ein.`, `Bitte trage einen ${noun} ein.`));
			return;
		}
		if (rating === '') {
			setProblem(
				tx(
					informal,
					'Bitte bewerten Sie, wie wichtig dieser Aspekt für Sie ist.',
					'Bitte bewerte, wie wichtig dieser Aspekt für dich ist.'
				)
			);
			return;
		}
		const data = { category, text: text.trim(), rating: Number(rating) };
		void (editingId ? store.update(editingId, data) : store.create(ARGUMENT_KIND, data));
		reset();
	};

	const used = new Set(items.map((item) => item.text));
	const examples = EXAMPLES[category].filter((example) => !used.has(example));

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>Zur Übersicht der Motivationswaage</BackButton>
			<Card>
				<div className="bt-stack" ref={formRef}>
					<Headline level={3}>{HALF_TEXT[half]}</Headline>
					<Select
						label="Art des Arguments"
						value={category}
						options={HALVES[half].map((id) => ({ value: id, label: `… ${CATEGORIES[id].title}` }))}
						onChange={(value) => {
							setCategory(value as CategoryId);
							reset();
						}}
					/>
					<Textarea
						id="balance-argument"
						label={editingId ? `${noun} bearbeiten` : `Neuer ${noun}`}
						value={text}
						maxLength={MAX_TEXT_LENGTH}
						placeholder={tx(
							informal,
							`${noun} hier eintragen. Nutzen Sie für jeden ${noun} einen neuen Eintrag.`,
							`${noun} hier eintragen. Nutze für jeden ${noun} einen neuen Eintrag.`
						)}
						helperText={`${text.length} / ${MAX_TEXT_LENGTH}`}
						onChange={setText}
					/>
					<div className="bt-stack bt-stack--tight">
						<div>
							<button
								type="button"
								className="bt-linkbtn"
								aria-expanded={showExamples}
								onClick={() => setShowExamples(!showExamples)}
							>
								{showExamples ? 'Beispiele ausblenden' : 'Beispiele anzeigen'}
							</button>
						</div>
						{showExamples &&
							(examples.length ? (
								<div className="bt-chips">
									{examples.map((example) => (
										<button key={example} type="button" className="bt-chip" onClick={() => setText(example)}>
											{example}
										</button>
									))}
								</div>
							) : (
								<p className="bt-muted bt-small">Alle Beispiele sind schon eingetragen.</p>
							))}
					</div>
					<RadioGroup
						label={tx(
							informal,
							'Wie wichtig ist dieser Aspekt für Sie?',
							'Wie wichtig ist dieser Aspekt für dich?'
						)}
						value={rating}
						options={RATINGS.map((option) => ({
							value: String(option.value),
							label: `${option.label} (${'★'.repeat(option.value) || '–'})`
						}))}
						onChange={setRating}
						error={Boolean(problem) && rating === ''}
					/>
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{problem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={submit}>{editingId ? 'Änderung speichern' : 'Eintrag hinzufügen'}</Button>
						{editingId && (
							<Button variant="tertiary" onClick={reset}>
								Abbrechen
							</Button>
						)}
					</div>
				</div>
			</Card>
			<Card>
				<MiniResult items={items} />
			</Card>
			{HALVES[half].map((id) => {
				const list = items.filter((item) => item.category === id);
				return (
					<Card key={id}>
						<div className="bt-stack bt-stack--tight">
							<div className="bt-row bt-row--between">
								<h3 className="bt-title">{listTitle(id, informal)}</h3>
								<SideBadge category={id} />
							</div>
							{list.length === 0 ? (
								<p className="bt-muted bt-small">Noch keine Einträge.</p>
							) : (
								<ul className="bt-list">
									{list.map((item) => (
										<li
											key={item.id}
											className="bt-item"
											style={editingId === item.id ? { borderColor: 'var(--bt-primary)' } : undefined}
										>
											{confirming === item.id ? (
												<div className="bt-row" style={{ flex: 1 }}>
													<span style={{ flex: 1 }}>Diesen Eintrag löschen?</span>
													<Button
														onClick={() => {
															setConfirming(null);
															if (editingId === item.id) {
																reset();
															}
															void store.remove(item.id);
														}}
													>
														Löschen
													</Button>
													<Button variant="tertiary" onClick={() => setConfirming(null)}>
														Abbrechen
													</Button>
												</div>
											) : (
												<>
													<span className="bt-item__text">{item.text}</span>
													<Stars rating={item.rating} />
													<IconButton
														icon="edit"
														label={`Bearbeiten: ${item.text}`}
														onClick={() => startEdit(item)}
													/>
													<IconButton
														icon="delete"
														label={`Löschen: ${item.text}`}
														onClick={() => setConfirming(item.id)}
													/>
												</>
											)}
										</li>
									))}
								</ul>
							)}
						</div>
					</Card>
				);
			})}
			<div>
				<Button variant="secondary" onClick={onClose}>
					Beenden
				</Button>
			</div>
		</div>
	);
}
