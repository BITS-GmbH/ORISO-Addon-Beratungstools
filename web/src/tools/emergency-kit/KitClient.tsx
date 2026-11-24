import { Button, Card, Checkbox, Headline, Select, Textarea, TextField } from '@oriso/web-kit';
import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	emptySections,
	IMPORTANCE,
	isPrinted,
	itemsOf,
	keyedOf,
	keyedText,
	MAIN_KEY,
	MAX_LONG_TEXT_LENGTH,
	MAX_NAME_LENGTH,
	MAX_TEXT_LENGTH,
	NAKOS_URL,
	OTHER_STRATEGIES_KIND,
	REQUEST_KIND,
	RISK_PRINT_KIND,
	SECTION_NUMBERS,
	SECTION_ORDER,
	SELF_HELP_KIND,
	SELF_HELP_REQUEST_KEY,
	TRUSTED_KIND,
	trustedOf,
	type ListKind,
	type SectionId
} from '../../../../shared/tools/emergency-kit.ts';
import { difficultyOf, situationsOf, type SituationItem } from '../../../../shared/tools/risk-situations.ts';
import { useI18n } from '../../host.ts';
import { BackButton, Icon, IconButton } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { SectionPreview } from './parts.tsx';

type Screen = 'overview' | SectionId | 'trusted' | 'agency' | 'self-help';

type Store = ClientViewProps['store'];

/** The Notfallkoffer as the client uses it: seven sections, their edit pages and the PDFs. */
export function KitClient({ tool, entries, store, download }: ClientViewProps) {
	const [screen, setScreen] = useState<Screen>('overview');
	const risks = tool.linked?.['risk-situations'];
	const agency = typeof tool.options.agency === 'string' ? tool.options.agency.trim() : '';
	const counsellors = tool.counsellors ?? [];
	const toOverview = () => setScreen('overview');

	switch (screen) {
		case 'motivation':
		case 'strategy':
		case 'critical':
		case 'craving':
		case 'relapse':
			return <ListEditor key={screen} kind={screen} entries={entries} store={store} onClose={toOverview} />;
		case 'support':
			return (
				<SupportPage
					entries={entries}
					agency={agency}
					counsellors={counsellors}
					onOpen={setScreen}
					onBack={toOverview}
				/>
			);
		case 'trusted':
			return <TrustedEditor entries={entries} store={store} onClose={() => setScreen('support')} />;
		case 'agency':
			return <AgencyPage agency={agency} counsellors={counsellors} onBack={() => setScreen('support')} />;
		case 'self-help':
			return <SelfHelpEditor entries={entries} store={store} onClose={() => setScreen('support')} />;
		case 'risks':
			if (risks) {
				return (
					<RisksEditor entries={entries} risks={situationsOf(risks)} store={store} onClose={toOverview} />
				);
			}
			break;
	}
	return <Overview entries={entries} risks={risks} agency={agency} onOpen={setScreen} download={download} />;
}

function Overview({
	entries,
	risks,
	agency,
	onOpen,
	download
}: {
	entries: Entry[];
	risks: Entry[] | undefined;
	agency: string;
	onOpen: (screen: Screen) => void;
	download: ClientViewProps['download'];
}) {
	const { m } = useI18n();
	const texts = m.emergencyKit;
	const [more, setMore] = useState(entries.length === 0);
	const [confirming, setConfirming] = useState(false);
	const situations = risks ? situationsOf(risks) : undefined;
	const empty = emptySections(entries, agency, situations);
	const sections = SECTION_ORDER.filter((id) => id !== 'risks' || risks !== undefined);

	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<p className="bt-lead">{texts.start}</p>
					<div>
						<button type="button" className="bt-linkbtn" aria-expanded={more} onClick={() => setMore(!more)}>
							{more ? texts.hideInfo : texts.showInfo}
						</button>
					</div>
					{more && <p>{texts.more}</p>}
				</div>
			</Card>
			<div className="bt-kit">
				{sections.map((id) => (
					<button key={id} type="button" className="bt-kit-tile" onClick={() => onOpen(id)}>
						<span className="bt-kit-tile__title">
							<span className="bt-kit-tile__number" aria-hidden>
								{SECTION_NUMBERS[id]}
							</span>
							{texts.sections[id].title}
						</span>
						<SectionPreview section={id} entries={entries} risks={situations} agency={agency} />
					</button>
				))}
			</div>
			<Card>
				<div className="bt-stack bt-stack--tight">
					<h3 className="bt-title">{texts.printTitle}</h3>
					{confirming ? (
						<div className="bt-confirm" role="alertdialog" aria-label={texts.confirmLabel}>
							<span style={{ flex: 1 }}>{texts.confirmEmpty}</span>
							<Button
								onClick={() => {
									setConfirming(false);
									void download('kit');
								}}
							>
								{texts.proceed}
							</Button>
							<Button variant="secondary" onClick={() => setConfirming(false)}>
								{m.common.cancel}
							</Button>
						</div>
					) : (
						<div className="bt-row">
							<Button
								variant="secondary"
								onClick={() => (empty.length > 0 ? setConfirming(true) : void download('kit'))}
							>
								{texts.printKit}
							</Button>
							<Button variant="secondary" onClick={() => void download('card')}>
								{texts.printCard}
							</Button>
						</div>
					)}
					<p className="bt-muted bt-small">{texts.cardHint}</p>
				</div>
			</Card>
		</div>
	);
}

interface Row {
	key: string;
	id: string | null;
	text: string;
	importance: string;
}

let rowCounter = 0;
const newRow = (text = ''): Row => ({ key: `new-${(rowCounter += 1)}`, id: null, text, importance: '' });

function ListEditor({
	kind,
	entries,
	store,
	onClose
}: {
	kind: ListKind;
	entries: Entry[];
	store: Store;
	onClose: () => void;
}) {
	const { m, t } = useI18n();
	const texts = m.emergencyKit;
	const section = texts.sections[kind];
	const items = itemsOf(entries, kind);
	const withImportance = kind === 'motivation';
	const [rows, setRows] = useState<Row[]>(() =>
		items.length
			? items.map((item) => ({
					key: item.id,
					id: item.id,
					text: item.text,
					importance: item.importance ? String(item.importance) : ''
				}))
			: [newRow()]
	);
	const [group, setGroup] = useState(0);
	const [problem, setProblem] = useState<string | null>(null);

	const change = (key: string, patch: Partial<Row>) =>
		setRows((list) => list.map((row) => (row.key === key ? { ...row, ...patch } : row)));

	const addExample = (text: string) =>
		setRows((list) => {
			const emptyRow = list.find((row) => !row.text.trim());
			return emptyRow
				? list.map((row) => (row === emptyRow ? { ...row, text } : row))
				: [...list, newRow(text)];
		});

	const save = () => {
		if (withImportance && rows.some((row) => row.text.trim() && !row.importance)) {
			setProblem(texts.missingImportance);
			return;
		}
		const kept = new Set<string>();
		for (const row of rows) {
			const text = row.text.trim();
			const data = withImportance ? { text, importance: Number(row.importance) } : { text };
			if (!row.id) {
				if (text) {
					void store.create(kind, data);
				}
				continue;
			}
			const before = items.find((item) => item.id === row.id);
			if (!text || !before) {
				continue;
			}
			kept.add(row.id);
			if (before.text !== text || (withImportance && before.importance !== data.importance)) {
				void store.update(row.id, data);
			}
		}
		for (const item of items) {
			if (!kept.has(item.id)) {
				void store.remove(item.id);
			}
		}
		onClose();
	};

	const used = new Set(rows.map((row) => row.text.trim()));
	const examples = section.examples[group] ?? section.examples[0];
	const entryLabel = (index: number) => t(texts.entryLabel, { number: index + 1 });

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>{texts.backToKit}</BackButton>
			<Card>
				<div className="bt-stack">
					<div className="bt-stack bt-stack--tight">
						<p className="bt-overline">{t(texts.part, { number: SECTION_NUMBERS[kind] })}</p>
						<Headline level={3}>{section.title}</Headline>
						<p>{section.intro}</p>
					</div>
					<Examples
						groups={section.examples}
						group={group}
						onGroup={setGroup}
						items={(examples?.items ?? []).filter((item) => !used.has(item))}
						onPick={addExample}
					/>
					<div className="bt-stack bt-stack--tight">
						<h4 className="bt-title">{section.fieldLabel}</h4>
						<ul className="bt-list">
							{rows.map((row, index) => (
								<li key={row.key} className="bt-kit-row">
									<div className="bt-kit-row__fields">
										<Textarea
											id={`kit-${kind}-${row.key}`}
											label={entryLabel(index)}
											value={row.text}
											maxLength={MAX_TEXT_LENGTH}
											minRows={2}
											onChange={(text) => change(row.key, { text })}
										/>
										{withImportance && (
											<Select
												id={`kit-importance-${row.key}`}
												label={texts.importanceQuestion}
												value={row.importance}
												error={Boolean(problem) && Boolean(row.text.trim()) && !row.importance}
												options={[
													{ value: '', label: texts.choose },
													...IMPORTANCE.map((option) => ({
														value: String(option.value),
														label: texts.importance[option.key]
													}))
												]}
												onChange={(importance) => change(row.key, { importance })}
											/>
										)}
									</div>
									<IconButton
										icon="delete"
										label={t(texts.deleteLabel, { text: row.text || entryLabel(index) })}
										onClick={() => setRows((list) => list.filter((candidate) => candidate.key !== row.key))}
									/>
								</li>
							))}
						</ul>
						<div>
							<button
								type="button"
								className="bt-linkbtn"
								onClick={() => setRows((list) => [...list, newRow()])}
							>
								{texts.addEntry}
							</button>
						</div>
					</div>
					{problem && (
						<p role="alert" className="bt-alert">
							{problem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={save}>{texts.save}</Button>
						<Button variant="secondary" onClick={onClose}>
							{m.common.cancel}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

function Examples({
	groups,
	group,
	onGroup,
	items,
	onPick
}: {
	groups: Array<{ label: string }>;
	group: number;
	onGroup: (index: number) => void;
	items: string[];
	onPick: (text: string) => void;
}) {
	const texts = useI18n().m.emergencyKit;
	const [open, setOpen] = useState(false);
	return (
		<div className="bt-stack bt-stack--tight">
			<div>
				<button type="button" className="bt-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
					{open ? texts.hideExamples : texts.showExamples}
				</button>
			</div>
			{open && (
				<>
					{groups.length > 1 && (
						<div className="bt-tabs" role="group" aria-label={texts.examplesByTopic}>
							{groups.map((candidate, index) => (
								<button
									key={candidate.label}
									type="button"
									className="bt-tab"
									aria-pressed={index === group}
									onClick={() => onGroup(index)}
								>
									{candidate.label}
								</button>
							))}
						</div>
					)}
					{items.length ? (
						<div className="bt-chips">
							{items.map((example) => (
								<button key={example} type="button" className="bt-chip" onClick={() => onPick(example)}>
									{example}
								</button>
							))}
						</div>
					) : (
						<p className="bt-muted bt-small">{texts.allExamplesUsed}</p>
					)}
					<p className="bt-muted bt-small">{texts.pickExample}</p>
				</>
			)}
		</div>
	);
}

function SupportPage({
	entries,
	agency,
	counsellors,
	onOpen,
	onBack
}: {
	entries: Entry[];
	agency: string;
	counsellors: string[];
	onOpen: (screen: Screen) => void;
	onBack: () => void;
}) {
	const { m, t, date } = useI18n();
	const texts = m.emergencyKit;
	const trusted = trustedOf(entries);
	const selfHelp = keyedText(entries, SELF_HELP_KIND);
	const request = keyedOf(entries, REQUEST_KIND, SELF_HELP_REQUEST_KEY);
	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>{texts.backToKit}</BackButton>
			<Card>
				<div className="bt-stack">
					<div>
						<p className="bt-overline">{t(texts.part, { number: SECTION_NUMBERS.support })}</p>
						<Headline level={3}>{texts.sections.support.title}</Headline>
					</div>
					<div className="bt-summary">
						<div>
							<strong>{texts.myTrusted}</strong>
							<button type="button" className="bt-linkbtn" onClick={() => onOpen('trusted')}>
								{trusted.length ? texts.change : texts.addTrusted}
							</button>
							{trusted.length > 0 && (
								<ul className="bt-plain" style={{ gridColumn: '1 / -1' }}>
									{trusted.map((person) => (
										<li key={person.id}>{person.name}</li>
									))}
								</ul>
							)}
						</div>
						<div>
							<strong>{texts.myAgency}</strong>
							<button type="button" className="bt-linkbtn" onClick={() => onOpen('agency')}>
								{texts.showAgency}
							</button>
							<p className={`bt-pre${agency ? '' : ' bt-muted'}`} style={{ gridColumn: '1 / -1' }}>
								{agency ||
									(counsellors.length
										? t(texts.counsellorsLine, { names: counsellors.join(', ') })
										: texts.notStored)}
							</p>
						</div>
						<div>
							<strong>{texts.mySelfHelp}</strong>
							<button type="button" className="bt-linkbtn" onClick={() => onOpen('self-help')}>
								{selfHelp ? texts.change : texts.addSelfHelp}
							</button>
							{(selfHelp || request) && (
								<div style={{ gridColumn: '1 / -1' }}>
									{selfHelp && <p className="bt-pre">{selfHelp}</p>}
									{request && (
										<p className="bt-small bt-muted">
											{t(texts.requestedOn, { date: date(request.createdAt) })}
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}

function TrustedEditor({ entries, store, onClose }: { entries: Entry[]; store: Store; onClose: () => void }) {
	const { m, t } = useI18n();
	const texts = m.emergencyKit;
	const people = trustedOf(entries);
	const [rows, setRows] = useState<Row[]>(() =>
		people.length
			? people.map((person) => ({ key: person.id, id: person.id, text: person.name, importance: '' }))
			: [newRow()]
	);

	const save = () => {
		const kept = new Set<string>();
		for (const row of rows) {
			const name = row.text.trim();
			const before = people.find((person) => person.id === row.id);
			if (!row.id || !before) {
				if (name) {
					void store.create(TRUSTED_KIND, { name });
				}
			} else if (name) {
				kept.add(row.id);
				if (before.name !== name) {
					void store.update(row.id, { name });
				}
			}
		}
		for (const person of people) {
			if (!kept.has(person.id)) {
				void store.remove(person.id);
			}
		}
		onClose();
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>{texts.back}</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{texts.myTrusted}</Headline>
					{texts.trustedIntro.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
					<ul className="bt-list">
						{rows.map((row, index) => (
							<li key={row.key} className="bt-kit-row">
								<div className="bt-kit-row__fields">
									<TextField
										id={`kit-trusted-${row.key}`}
										label={t(texts.trustedField, { number: index + 1 })}
										placeholder={texts.trustedPlaceholder}
										value={row.text}
										maxLength={MAX_NAME_LENGTH}
										onChange={(text) =>
											setRows((list) =>
												list.map((candidate) =>
													candidate.key === row.key ? { ...candidate, text } : candidate
												)
											)
										}
									/>
								</div>
								<IconButton
									icon="delete"
									label={t(texts.deleteLabel, {
										text: row.text || t(texts.rowLabel, { number: index + 1 })
									})}
									onClick={() => setRows((list) => list.filter((candidate) => candidate.key !== row.key))}
								/>
							</li>
						))}
					</ul>
					<div>
						<button
							type="button"
							className="bt-linkbtn"
							onClick={() => setRows((list) => [...list, newRow()])}
						>
							{texts.addRow}
						</button>
					</div>
					<div className="bt-row">
						<Button onClick={save}>{texts.saveEntries}</Button>
						<Button variant="secondary" onClick={onClose}>
							{texts.back}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

function AgencyPage({
	agency,
	counsellors,
	onBack
}: {
	agency: string;
	counsellors: string[];
	onBack: () => void;
}) {
	const texts = useI18n().m.emergencyKit;
	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>{texts.back}</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{texts.myAgency}</Headline>
					<p>{texts.agencyIntro}</p>
					<div className="bt-quote">
						<span className="bt-overline">{texts.yourAgency}</span>
						<p className={`bt-pre${agency ? '' : ' bt-muted'}`}>{agency || texts.agencyMissing}</p>
					</div>
					{counsellors.length > 0 && (
						<div className="bt-quote">
							<span className="bt-overline">{texts.yourCounsellor}</span>
							<p>{counsellors.join(', ')}</p>
						</div>
					)}
					<div>
						<Button variant="secondary" onClick={onBack}>
							{texts.back}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

function SelfHelpEditor({
	entries,
	store,
	onClose
}: {
	entries: Entry[];
	store: Store;
	onClose: () => void;
}) {
	const { m, t, date } = useI18n();
	const texts = m.emergencyKit;
	const saved = keyedText(entries, SELF_HELP_KIND);
	const [text, setText] = useState(saved);
	const request = keyedOf(entries, REQUEST_KIND, SELF_HELP_REQUEST_KEY);

	const save = () => {
		const value = text.trim();
		if (value !== saved) {
			void (value
				? store.putKeyed(SELF_HELP_KIND, MAIN_KEY, { text: value })
				: store.removeKeyed(SELF_HELP_KIND, MAIN_KEY));
		}
		onClose();
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>{texts.back}</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{texts.mySelfHelp}</Headline>
					{texts.selfHelpIntro.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
					{request ? (
						<p className="bt-done" role="status">
							<Icon name="check" />
							{t(texts.requestDone, { date: date(request.createdAt) })}
						</p>
					) : (
						<div>
							<button
								type="button"
								className="bt-linkbtn bt-request"
								onClick={() => void store.putKeyed(REQUEST_KIND, SELF_HELP_REQUEST_KEY, { requested: true })}
							>
								<Icon name="check" />
								{texts.requestButton}
							</button>
							<p className="bt-muted bt-small">{texts.requestHint}</p>
						</div>
					)}
					<p>
						{texts.nakosText}{' '}
						<a href={NAKOS_URL} target="_blank" rel="noopener noreferrer">
							{texts.nakosLink}
						</a>
					</p>
					<Textarea
						id="kit-self-help"
						label={texts.selfHelpField}
						placeholder={texts.selfHelpPlaceholder}
						value={text}
						maxLength={MAX_LONG_TEXT_LENGTH}
						minRows={4}
						onChange={setText}
					/>
					<div className="bt-row">
						<Button onClick={save}>{texts.save}</Button>
						<Button variant="secondary" onClick={onClose}>
							{m.common.cancel}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

function RisksEditor({
	entries,
	risks,
	store,
	onClose
}: {
	entries: Entry[];
	risks: SituationItem[];
	store: Store;
	onClose: () => void;
}) {
	const { m, t } = useI18n();
	const texts = m.emergencyKit;
	const savedOther = keyedText(entries, OTHER_STRATEGIES_KIND);
	const [other, setOther] = useState(savedOther);
	const [print, setPrint] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(risks.map((risk) => [risk.id, isPrinted(entries, risk.id)]))
	);

	const save = () => {
		for (const risk of risks) {
			const wanted = print[risk.id] ?? true;
			if (wanted !== isPrinted(entries, risk.id)) {
				void store.putKeyed(RISK_PRINT_KIND, risk.id, { print: wanted });
			}
		}
		const value = other.trim();
		if (value !== savedOther) {
			void (value
				? store.putKeyed(OTHER_STRATEGIES_KIND, MAIN_KEY, { text: value })
				: store.removeKeyed(OTHER_STRATEGIES_KIND, MAIN_KEY));
		}
		onClose();
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>{texts.backToKit}</BackButton>
			<Card>
				<div className="bt-stack">
					<div className="bt-stack bt-stack--tight">
						<p className="bt-overline">{t(texts.part, { number: SECTION_NUMBERS.risks })}</p>
						<Headline level={3}>{texts.sections.risks.title}</Headline>
						<p>{texts.risksIntro}</p>
					</div>
					{risks.length === 0 ? (
						<p className="bt-muted">{texts.noRisks}</p>
					) : (
						<ul className="bt-list">
							{risks.map((risk) => {
								const difficulty = difficultyOf(risk.difficulty);
								return (
									<li key={risk.id} className="bt-risk bt-risk--kit">
										<div className="bt-risk__cell">
											<span className="bt-overline">{texts.riskSituation}</span>
											<span className="bt-item__text">{risk.situation}</span>
										</div>
										<div className="bt-risk__cell">
											{difficulty && (
												<>
													<span className="bt-overline">{texts.rating}</span>
													<span>{m.riskSituations.difficulty[difficulty.value]}</span>
												</>
											)}
										</div>
										<div className="bt-risk__cell">
											<span className="bt-overline">{texts.controlStrategy}</span>
											<span className={`bt-pre${risk.strategy ? '' : ' bt-muted'}`}>
												{risk.strategy || texts.noStrategy}
											</span>
										</div>
										<div className="bt-risk__cell">
											<Checkbox
												label={texts.printRisk}
												checked={print[risk.id] ?? true}
												onChange={(checked) => setPrint({ ...print, [risk.id]: checked })}
											/>
										</div>
									</li>
								);
							})}
						</ul>
					)}
					<Textarea
						id="kit-other-strategies"
						label={texts.otherStrategies}
						value={other}
						maxLength={MAX_LONG_TEXT_LENGTH}
						minRows={4}
						onChange={setOther}
					/>
					<div className="bt-row">
						<Button onClick={save}>{texts.save}</Button>
						<Button variant="secondary" onClick={onClose}>
							{m.common.cancel}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
