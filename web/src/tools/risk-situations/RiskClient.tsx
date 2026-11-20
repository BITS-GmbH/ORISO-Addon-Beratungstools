import { Button, Card, Headline, Select, Textarea } from '@oriso/web-kit';
import { useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import {
	DIFFICULTIES,
	difficultyQuestion,
	guideIntro,
	guideSteps,
	MAX_ANSWER_LENGTH,
	MAX_SITUATION_LENGTH,
	MAX_STRATEGY_LENGTH,
	NEW_STRATEGY_QUESTION,
	RELAPSE_KIND,
	RELAPSE_QUESTIONS,
	relapseIntro,
	relapsesOf,
	SITUATION_KIND,
	situationHint,
	situationsOf,
	startText,
	strategyQuestion,
	type Relapse,
	type RelapseAnswer,
	type RelapseItem,
	type Situation,
	type SituationItem
} from '../../../../shared/tools/risk-situations.ts';
import { BackButton, formatDate, IconButton } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { DifficultyBadge, RelapseDetails } from './parts.tsx';

type Screen = { name: 'list' } | { name: 'edit'; id: string | null } | { name: 'relapse'; id: string };

/** Risikosituationen und Kontrollstrategien as the client uses it: the list, the editor and the relapse analysis. */
export function RiskClient({ entries, store, informal, locale, download }: ClientViewProps) {
	const [screen, setScreen] = useState<Screen>({ name: 'list' });
	const situations = situationsOf(entries);
	const back = () => setScreen({ name: 'list' });

	if (screen.name === 'edit') {
		const current = situations.find((item) => item.id === screen.id);
		return (
			<SituationEditor
				key={screen.id ?? 'new'}
				situation={current}
				informal={informal}
				onCancel={back}
				onSave={(data) => {
					void (current ? store.update(current.id, data) : store.create(SITUATION_KIND, data));
					back();
				}}
			/>
		);
	}
	if (screen.name === 'relapse') {
		const situation = situations.find((item) => item.id === screen.id);
		if (situation) {
			return (
				<RelapsePage
					situation={situation}
					relapses={relapsesOf(entries, situation.id)}
					store={store}
					informal={informal}
					locale={locale}
					download={download}
					onBack={back}
				/>
			);
		}
	}
	return (
		<Overview
			situations={situations}
			entries={entries}
			informal={informal}
			locale={locale}
			onEdit={(id) => setScreen({ name: 'edit', id })}
			onRelapse={(id) => setScreen({ name: 'relapse', id })}
			onDelete={(item) => {
				for (const relapse of relapsesOf(entries, item.id)) {
					void store.remove(relapse.id);
				}
				void store.remove(item.id);
			}}
			onPdf={() => download('table')}
		/>
	);
}

function Overview({
	situations,
	entries,
	informal,
	locale,
	onEdit,
	onRelapse,
	onDelete,
	onPdf
}: {
	situations: SituationItem[];
	entries: ClientViewProps['entries'];
	informal: boolean;
	locale: string;
	onEdit: (id: string | null) => void;
	onRelapse: (id: string) => void;
	onDelete: (item: SituationItem) => void;
	onPdf: () => void;
}) {
	const [guide, setGuide] = useState(situations.length === 0);
	const [confirming, setConfirming] = useState<string | null>(null);
	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<p>{startText(informal)}</p>
					<div>
						<button
							type="button"
							className="bt-linkbtn"
							aria-expanded={guide}
							onClick={() => setGuide(!guide)}
						>
							{guide ? 'Anleitung ausblenden' : 'Anleitung zum Ausfüllen'}
						</button>
					</div>
					{guide && (
						<div className="bt-stack bt-stack--tight">
							<p>{guideIntro(informal)}</p>
							<ol className="bt-steps-list">
								{guideSteps(informal).map(([title, text]) => (
									<li key={title}>
										<strong>{title}</strong>
										{title === 'Risikosituation eintragen' ? ', ' : ': '}
										{text}
									</li>
								))}
							</ol>
						</div>
					)}
				</div>
			</Card>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>Meine Risikosituationen und Kontrollstrategien</Headline>
					{situations.length === 0 ? (
						<p className="bt-muted">
							{tx(
								informal,
								'Sie haben noch keine Risikosituation eingetragen.',
								'Du hast noch keine Risikosituation eingetragen.'
							)}
						</p>
					) : (
						<ul className="bt-list">
							{situations.map((item) => {
								const last = relapsesOf(entries, item.id)[0];
								return (
									<li key={item.id} className="bt-risk">
										{confirming === item.id ? (
											<div className="bt-confirm" style={{ gridColumn: '1 / -1' }}>
												<span style={{ flex: 1 }}>
													Diese Risikosituation mit allen Rückfallanalysen löschen?
												</span>
												<Button
													onClick={() => {
														setConfirming(null);
														onDelete(item);
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
												<div className="bt-risk__cell">
													<span className="bt-overline">Risikosituation</span>
													<span className="bt-item__text">{item.situation}</span>
												</div>
												<div className="bt-risk__cell">
													<span className="bt-overline">Bewertung</span>
													<DifficultyBadge value={item.difficulty} />
												</div>
												<div className="bt-risk__cell">
													<span className="bt-overline">Kontrollstrategie</span>
													<Teaser text={item.strategy} />
												</div>
												<div className="bt-risk__cell">
													<span className="bt-overline">Rückfall</span>
													<button type="button" className="bt-linkbtn" onClick={() => onRelapse(item.id)}>
														Rückfall analysieren
													</button>
													<span className="bt-small bt-muted">
														{last
															? `Stand ${formatDate(last.entry.createdAt, locale)}`
															: 'noch nicht bearbeitet'}
													</span>
												</div>
												<div className="bt-risk__actions">
													<IconButton
														icon="edit"
														label={`Bearbeiten: ${item.situation}`}
														onClick={() => onEdit(item.id)}
													/>
													<IconButton
														icon="delete"
														label={`Löschen: ${item.situation}`}
														onClick={() => setConfirming(item.id)}
													/>
												</div>
											</>
										)}
									</li>
								);
							})}
						</ul>
					)}
					<div className="bt-row">
						<Button onClick={() => onEdit(null)}>Neue Risikosituation eintragen</Button>
						{situations.length > 0 && (
							<Button variant="secondary" onClick={onPdf}>
								Tabelle als PDF ausgeben
							</Button>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
}

function Teaser({ text }: { text: string }) {
	const [open, setOpen] = useState(false);
	if (!text) {
		return <span className="bt-muted bt-small">Noch keine Strategie</span>;
	}
	const long = text.length > 160;
	return (
		<>
			<span className={`bt-item__text${long && !open ? ' bt-clamp' : ''}`}>{text}</span>
			{long && (
				<button type="button" className="bt-linkbtn bt-small" onClick={() => setOpen(!open)}>
					{open ? 'weniger anzeigen' : 'mehr anzeigen'}
				</button>
			)}
		</>
	);
}

function SituationEditor({
	situation,
	informal,
	onSave,
	onCancel
}: {
	situation: SituationItem | undefined;
	informal: boolean;
	onSave: (data: Situation) => void;
	onCancel: () => void;
}) {
	const [text, setText] = useState(situation?.situation ?? '');
	const [difficulty, setDifficulty] = useState<string>(situation?.difficulty ?? '');
	const [strategy, setStrategy] = useState(situation?.strategy ?? '');
	const [problem, setProblem] = useState<string | null>(null);

	const save = () => {
		if (!text.trim()) {
			setProblem(
				tx(informal, 'Bitte beschreiben Sie die Risikosituation.', 'Bitte beschreibe die Risikosituation.')
			);
			return;
		}
		if (!difficulty) {
			setProblem(tx(informal, 'Bitte wählen Sie eine Bewertung aus.', 'Bitte wähle eine Bewertung aus.'));
			return;
		}
		onSave({
			situation: text.trim(),
			difficulty: difficulty as Situation['difficulty'],
			strategy: strategy.trim()
		});
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onCancel}>Zur Übersicht</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>
						{situation ? 'Risikosituation bearbeiten' : 'Risikosituation erstellen'}
					</Headline>
					<Textarea
						id="risk-situation"
						label="Risikosituation"
						helperText={situationHint(informal)}
						value={text}
						maxLength={MAX_SITUATION_LENGTH}
						minRows={3}
						error={Boolean(problem) && !text.trim()}
						onChange={setText}
					/>
					<Select
						id="risk-difficulty"
						label={difficultyQuestion(informal)}
						value={difficulty}
						error={Boolean(problem) && Boolean(text.trim()) && !difficulty}
						options={[
							{ value: '', label: 'Bitte auswählen' },
							...DIFFICULTIES.map((d) => ({ value: d.value, label: d.label }))
						]}
						onChange={setDifficulty}
					/>
					<Textarea
						id="risk-strategy"
						label="Kontroll-/Bewältigungsstrategie"
						helperText={strategyQuestion(informal)}
						value={strategy}
						maxLength={MAX_STRATEGY_LENGTH}
						minRows={4}
						onChange={setStrategy}
					/>
					{problem && (
						<p role="alert" className="bt-alert">
							{problem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={save}>Speichern</Button>
						<Button variant="tertiary" onClick={onCancel}>
							Abbrechen
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

const EMPTY_ANSWERS: Record<RelapseAnswer | 'newStrategy', string> = {
	circumstances: '',
	feelings: '',
	mainReason: '',
	alternatives: '',
	newStrategy: ''
};

function RelapsePage({
	situation,
	relapses,
	store,
	informal,
	locale,
	download,
	onBack
}: {
	situation: SituationItem;
	relapses: RelapseItem[];
	store: ClientViewProps['store'];
	informal: boolean;
	locale: string;
	download: ClientViewProps['download'];
	onBack: () => void;
}) {
	const [editing, setEditing] = useState<RelapseItem | null>(null);
	const [answers, setAnswers] = useState(EMPTY_ANSWERS);
	const [problem, setProblem] = useState<string | null>(null);
	const [open, setOpen] = useState<string | null>(null);
	const previousStrategy = editing ? editing.previousStrategy : situation.strategy;

	const startEdit = (relapse: RelapseItem | null) => {
		setEditing(relapse);
		setAnswers(
			relapse
				? {
						circumstances: relapse.circumstances,
						feelings: relapse.feelings,
						mainReason: relapse.mainReason,
						alternatives: relapse.alternatives,
						newStrategy: relapse.newStrategy
					}
				: EMPTY_ANSWERS
		);
		setProblem(null);
	};

	const save = async (): Promise<string | null> => {
		const trimmed = Object.fromEntries(
			Object.entries(answers).map(([key, value]) => [key, value.trim()])
		) as typeof answers;
		if (Object.values(trimmed).every((value) => !value)) {
			setProblem(
				tx(
					informal,
					'Bitte beantworten Sie mindestens eine der Fragen.',
					'Bitte beantworte mindestens eine der Fragen.'
				)
			);
			return null;
		}
		const data: Relapse = { situationId: situation.id, ...trimmed, previousStrategy };
		const isLatest = !editing || editing.id === relapses[0]?.id;
		const saved = editing ? await store.update(editing.id, data) : await store.create(RELAPSE_KIND, data);
		if (saved && isLatest && trimmed.newStrategy && trimmed.newStrategy !== situation.strategy) {
			await store.update(situation.id, {
				situation: situation.situation,
				difficulty: situation.difficulty,
				strategy: trimmed.newStrategy
			});
		}
		if (saved) {
			startEdit(null);
		}
		return saved?.id ?? null;
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>Zur Übersicht</BackButton>
			<Card>
				<div className="bt-stack">
					<div className="bt-stack bt-stack--tight">
						<p className="bt-overline">Rückfälle analysieren</p>
						<Headline level={3}>Bewältigungsstrategien verfeinern</Headline>
						<p>{relapseIntro(informal)}</p>
					</div>
					<div className="bt-quote">
						<span className="bt-overline">Meine Risikosituation</span>
						<p className="bt-pre">{situation.situation}</p>
					</div>
					{editing && (
						<p className="bt-muted bt-small">
							{tx(informal, 'Sie bearbeiten die Analyse vom', 'Du bearbeitest die Analyse vom')}{' '}
							{formatDate(editing.entry.createdAt, locale)}.
						</p>
					)}
					{RELAPSE_QUESTIONS.map((question) => (
						<Textarea
							key={question.id}
							id={`relapse-${question.id}`}
							label={question.question(informal)}
							value={answers[question.id]}
							maxLength={MAX_ANSWER_LENGTH}
							minRows={3}
							onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
						/>
					))}
					<div className="bt-quote">
						<span className="bt-overline">Meine zuvor eingetragene Kontrollstrategie:</span>
						<p className={`bt-pre${previousStrategy ? '' : ' bt-muted'}`}>
							{previousStrategy || 'Noch keine Strategie eingetragen.'}
						</p>
					</div>
					<Textarea
						id="relapse-newStrategy"
						label={NEW_STRATEGY_QUESTION(informal)}
						placeholder={tx(
							informal,
							'Beschreiben Sie möglichst genau Ihre neue Kontrollstrategie',
							'Beschreibe möglichst genau deine neue Kontrollstrategie'
						)}
						value={answers.newStrategy}
						maxLength={MAX_STRATEGY_LENGTH}
						minRows={4}
						onChange={(value) => setAnswers({ ...answers, newStrategy: value })}
					/>
					{problem && (
						<p role="alert" className="bt-alert">
							{problem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={() => void save()}>Speichern</Button>
						<Button
							variant="secondary"
							onClick={async () => {
								const id = await save();
								if (id) {
									await download('relapse', { id });
								}
							}}
						>
							Seite als PDF ausgeben
						</Button>
						{editing && (
							<Button variant="tertiary" onClick={() => startEdit(null)}>
								Abbrechen
							</Button>
						)}
					</div>
				</div>
			</Card>
			{relapses.length > 0 && (
				<Card>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">Alle Rückfälle</h3>
						<ul className="bt-list">
							{relapses.map((relapse) => {
								const expanded = open === relapse.id;
								return (
									<li key={relapse.id} className="bt-entry">
										<div className="bt-row bt-row--between">
											<strong>Analyse vom {formatDate(relapse.entry.createdAt, locale)}</strong>
											<div className="bt-row">
												<button
													type="button"
													className="bt-linkbtn bt-small"
													aria-expanded={expanded}
													onClick={() => setOpen(expanded ? null : relapse.id)}
												>
													{expanded ? 'Schließen' : 'Öffnen'}
												</button>
												<button
													type="button"
													className="bt-linkbtn bt-small"
													onClick={() => startEdit(relapse)}
												>
													Bearbeiten
												</button>
												<button
													type="button"
													className="bt-linkbtn bt-small"
													onClick={() => void download('relapse', { id: relapse.id })}
												>
													Seite als PDF ausgeben
												</button>
											</div>
										</div>
										{expanded && <RelapseDetails relapse={relapse} />}
									</li>
								);
							})}
						</ul>
					</div>
				</Card>
			)}
		</div>
	);
}
