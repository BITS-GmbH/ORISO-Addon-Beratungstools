import { Button, Card, Headline, Select, Textarea } from '@oriso/web-kit';
import { useState } from 'react';
import {
	DIFFICULTIES,
	MAX_ANSWER_LENGTH,
	MAX_SITUATION_LENGTH,
	MAX_STRATEGY_LENGTH,
	RELAPSE_ANSWERS,
	RELAPSE_KIND,
	relapsesOf,
	SITUATION_KIND,
	situationsOf,
	type Relapse,
	type RelapseAnswer,
	type RelapseItem,
	type Situation,
	type SituationItem
} from '../../../../shared/tools/risk-situations.ts';
import { useI18n } from '../../host.ts';
import { BackButton, IconButton } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { DifficultyBadge, RelapseDetails, WithTitle } from './parts.tsx';

type Screen = { name: 'list' } | { name: 'edit'; id: string | null } | { name: 'relapse'; id: string };

/** Risikosituationen und Kontrollstrategien as the client uses it: the list, the editor and the relapse analysis. */
export function RiskClient({ entries, store, download }: ClientViewProps) {
	const [screen, setScreen] = useState<Screen>({ name: 'list' });
	const situations = situationsOf(entries);
	const back = () => setScreen({ name: 'list' });

	if (screen.name === 'edit') {
		const current = situations.find((item) => item.id === screen.id);
		return (
			<SituationEditor
				key={screen.id ?? 'new'}
				situation={current}
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
	onEdit,
	onRelapse,
	onDelete,
	onPdf
}: {
	situations: SituationItem[];
	entries: ClientViewProps['entries'];
	onEdit: (id: string | null) => void;
	onRelapse: (id: string) => void;
	onDelete: (item: SituationItem) => void;
	onPdf: () => void;
}) {
	const i18n = useI18n();
	const texts = i18n.m.riskSituations;
	const [guide, setGuide] = useState(situations.length === 0);
	const [confirming, setConfirming] = useState<string | null>(null);
	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<p>{texts.start}</p>
					<div>
						<button
							type="button"
							className="bt-linkbtn"
							aria-expanded={guide}
							onClick={() => setGuide(!guide)}
						>
							{guide ? texts.guideHide : texts.guideShow}
						</button>
					</div>
					{guide && (
						<div className="bt-stack bt-stack--tight">
							<p>{texts.guideIntro}</p>
							<ol className="bt-steps-list">
								{Object.entries(texts.guideSteps).map(([id, step]) => (
									<li key={id}>
										<WithTitle text={step.text} title={step.title} />
									</li>
								))}
							</ol>
						</div>
					)}
				</div>
			</Card>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{texts.heading}</Headline>
					{situations.length === 0 ? (
						<p className="bt-muted">{texts.empty}</p>
					) : (
						<ul className="bt-list">
							{situations.map((item) => {
								const last = relapsesOf(entries, item.id)[0];
								return (
									<li key={item.id} className="bt-risk">
										{confirming === item.id ? (
											<div className="bt-confirm" style={{ gridColumn: '1 / -1' }}>
												<span style={{ flex: 1 }}>{texts.deleteQuestion}</span>
												<Button
													onClick={() => {
														setConfirming(null);
														onDelete(item);
													}}
												>
													{texts.delete}
												</Button>
												<Button variant="tertiary" onClick={() => setConfirming(null)}>
													{i18n.m.common.cancel}
												</Button>
											</div>
										) : (
											<>
												<div className="bt-risk__cell">
													<span className="bt-overline">{texts.columns.situation}</span>
													<span className="bt-item__text">{item.situation}</span>
												</div>
												<div className="bt-risk__cell">
													<span className="bt-overline">{texts.columns.difficulty}</span>
													<DifficultyBadge value={item.difficulty} />
												</div>
												<div className="bt-risk__cell">
													<span className="bt-overline">{texts.columns.strategy}</span>
													<Teaser text={item.strategy} />
												</div>
												<div className="bt-risk__cell">
													<span className="bt-overline">{texts.columns.relapse}</span>
													<button type="button" className="bt-linkbtn" onClick={() => onRelapse(item.id)}>
														{texts.analyseRelapse}
													</button>
													<span className="bt-small bt-muted">
														{last
															? i18n.t(texts.relapseState, { date: i18n.date(last.entry.createdAt) })
															: texts.notEdited}
													</span>
												</div>
												<div className="bt-risk__actions">
													<IconButton
														icon="edit"
														label={i18n.t(texts.editLabel, { situation: item.situation })}
														onClick={() => onEdit(item.id)}
													/>
													<IconButton
														icon="delete"
														label={i18n.t(texts.deleteLabel, { situation: item.situation })}
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
						<Button onClick={() => onEdit(null)}>{texts.add}</Button>
						{situations.length > 0 && (
							<Button variant="secondary" onClick={onPdf}>
								{texts.tablePdf}
							</Button>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
}

function Teaser({ text }: { text: string }) {
	const texts = useI18n().m.riskSituations;
	const [open, setOpen] = useState(false);
	if (!text) {
		return <span className="bt-muted bt-small">{texts.noStrategy}</span>;
	}
	const long = text.length > 160;
	return (
		<>
			<span className={`bt-item__text${long && !open ? ' bt-clamp' : ''}`}>{text}</span>
			{long && (
				<button type="button" className="bt-linkbtn bt-small" onClick={() => setOpen(!open)}>
					{open ? texts.showLess : texts.showMore}
				</button>
			)}
		</>
	);
}

function SituationEditor({
	situation,
	onSave,
	onCancel
}: {
	situation: SituationItem | undefined;
	onSave: (data: Situation) => void;
	onCancel: () => void;
}) {
	const i18n = useI18n();
	const texts = i18n.m.riskSituations;
	const [text, setText] = useState(situation?.situation ?? '');
	const [difficulty, setDifficulty] = useState<string>(situation?.difficulty ?? '');
	const [strategy, setStrategy] = useState(situation?.strategy ?? '');
	const [problem, setProblem] = useState<string | null>(null);

	const save = () => {
		if (!text.trim()) {
			setProblem(texts.missingSituation);
			return;
		}
		if (!difficulty) {
			setProblem(texts.missingDifficulty);
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
			<BackButton onClick={onCancel}>{texts.toOverview}</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{situation ? texts.editTitle : texts.createTitle}</Headline>
					<Textarea
						id="risk-situation"
						label={texts.columns.situation}
						helperText={texts.situationHint}
						value={text}
						maxLength={MAX_SITUATION_LENGTH}
						minRows={3}
						error={Boolean(problem) && !text.trim()}
						onChange={setText}
					/>
					<Select
						id="risk-difficulty"
						label={texts.difficultyQuestion}
						value={difficulty}
						error={Boolean(problem) && Boolean(text.trim()) && !difficulty}
						options={[
							{ value: '', label: texts.choose },
							...DIFFICULTIES.map((d) => ({ value: d.value, label: texts.difficulty[d.value] }))
						]}
						onChange={setDifficulty}
					/>
					<Textarea
						id="risk-strategy"
						label={texts.strategyLabel}
						helperText={texts.strategyQuestion}
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
						<Button onClick={save}>{texts.save}</Button>
						<Button variant="tertiary" onClick={onCancel}>
							{i18n.m.common.cancel}
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
	download,
	onBack
}: {
	situation: SituationItem;
	relapses: RelapseItem[];
	store: ClientViewProps['store'];
	download: ClientViewProps['download'];
	onBack: () => void;
}) {
	const i18n = useI18n();
	const texts = i18n.m.riskSituations;
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
			setProblem(texts.missingAnswer);
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
			<BackButton onClick={onBack}>{texts.toOverview}</BackButton>
			<Card>
				<div className="bt-stack">
					<div className="bt-stack bt-stack--tight">
						<p className="bt-overline">{texts.relapseOverline}</p>
						<Headline level={3}>{texts.relapseTitle}</Headline>
						<p>{texts.relapseIntro}</p>
					</div>
					<div className="bt-quote">
						<span className="bt-overline">{texts.mySituation}</span>
						<p className="bt-pre">{situation.situation}</p>
					</div>
					{editing && (
						<p className="bt-muted bt-small">
							{i18n.t(texts.editingAnalysis, { date: i18n.date(editing.entry.createdAt) })}
						</p>
					)}
					{RELAPSE_ANSWERS.map((id) => (
						<Textarea
							key={id}
							id={`relapse-${id}`}
							label={texts.questions[id]}
							value={answers[id]}
							maxLength={MAX_ANSWER_LENGTH}
							minRows={3}
							onChange={(value) => setAnswers({ ...answers, [id]: value })}
						/>
					))}
					<div className="bt-quote">
						<span className="bt-overline">{texts.previousStrategyOverline}</span>
						<p className={`bt-pre${previousStrategy ? '' : ' bt-muted'}`}>
							{previousStrategy || texts.noPreviousStrategy}
						</p>
					</div>
					<Textarea
						id="relapse-newStrategy"
						label={texts.questions.newStrategy}
						placeholder={texts.newStrategyPlaceholder}
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
						<Button onClick={() => void save()}>{texts.save}</Button>
						<Button
							variant="secondary"
							onClick={async () => {
								const id = await save();
								if (id) {
									await download('relapse', { id });
								}
							}}
						>
							{texts.pagePdf}
						</Button>
						{editing && (
							<Button variant="tertiary" onClick={() => startEdit(null)}>
								{i18n.m.common.cancel}
							</Button>
						)}
					</div>
				</div>
			</Card>
			{relapses.length > 0 && (
				<Card>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">{texts.allRelapses}</h3>
						<ul className="bt-list">
							{relapses.map((relapse) => {
								const expanded = open === relapse.id;
								return (
									<li key={relapse.id} className="bt-entry">
										<div className="bt-row bt-row--between">
											<strong>
												{i18n.t(texts.analysisOf, { date: i18n.date(relapse.entry.createdAt) })}
											</strong>
											<div className="bt-row">
												<button
													type="button"
													className="bt-linkbtn bt-small"
													aria-expanded={expanded}
													onClick={() => setOpen(expanded ? null : relapse.id)}
												>
													{expanded ? texts.close : texts.open}
												</button>
												<button
													type="button"
													className="bt-linkbtn bt-small"
													onClick={() => startEdit(relapse)}
												>
													{texts.edit}
												</button>
												<button
													type="button"
													className="bt-linkbtn bt-small"
													onClick={() => void download('relapse', { id: relapse.id })}
												>
													{texts.pagePdf}
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
