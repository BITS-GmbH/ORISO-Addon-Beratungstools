import { Button, Card, Checkbox, Headline, Select, Textarea, TextField } from '@oriso/web-kit';
import { useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import type { Entry } from '../../../../shared/api.ts';
import {
	agencyIntro,
	emptySections,
	IMPORTANCE,
	isPrinted,
	itemsOf,
	keyedOf,
	keyedText,
	LIST_SECTIONS,
	MAIN_KEY,
	MAX_LONG_TEXT_LENGTH,
	MAX_NAME_LENGTH,
	MAX_TEXT_LENGTH,
	moreText,
	NAKOS_URL,
	nakosText,
	OTHER_STRATEGIES_KIND,
	OTHER_STRATEGIES_LABEL,
	REQUEST_KIND,
	RISK_PRINT_KIND,
	RISKS_TITLE,
	risksIntro,
	SECTION_ORDER,
	SELF_HELP_KIND,
	SELF_HELP_REQUEST_KEY,
	selfHelpIntro,
	startText,
	SUPPORT_TITLE,
	TRUSTED_KIND,
	trustedIntro,
	trustedOf,
	type ListKind,
	type SectionId
} from '../../../../shared/tools/emergency-kit.ts';
import { difficultyOf, situationsOf, type SituationItem } from '../../../../shared/tools/risk-situations.ts';
import { BackButton, formatDate, Icon, IconButton } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { SectionPreview } from './parts.tsx';

type Screen = 'overview' | SectionId | 'trusted' | 'agency' | 'self-help';

type Store = ClientViewProps['store'];

/** The Notfallkoffer as the client uses it: seven sections, their edit pages and the PDFs. */
export function KitClient({ tool, entries, store, informal, locale, download }: ClientViewProps) {
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
			return (
				<ListEditor
					key={screen}
					kind={screen}
					entries={entries}
					store={store}
					informal={informal}
					onClose={toOverview}
				/>
			);
		case 'support':
			return (
				<SupportPage
					entries={entries}
					agency={agency}
					counsellors={counsellors}
					locale={locale}
					onOpen={setScreen}
					onBack={toOverview}
				/>
			);
		case 'trusted':
			return (
				<TrustedEditor
					entries={entries}
					store={store}
					informal={informal}
					onClose={() => setScreen('support')}
				/>
			);
		case 'agency':
			return (
				<AgencyPage
					agency={agency}
					counsellors={counsellors}
					informal={informal}
					onBack={() => setScreen('support')}
				/>
			);
		case 'self-help':
			return (
				<SelfHelpEditor
					entries={entries}
					store={store}
					informal={informal}
					locale={locale}
					onClose={() => setScreen('support')}
				/>
			);
		case 'risks':
			if (risks) {
				return (
					<RisksEditor
						entries={entries}
						risks={situationsOf(risks)}
						store={store}
						informal={informal}
						onClose={toOverview}
					/>
				);
			}
			break;
	}
	return (
		<Overview
			entries={entries}
			risks={risks}
			agency={agency}
			informal={informal}
			onOpen={setScreen}
			download={download}
		/>
	);
}

function Overview({
	entries,
	risks,
	agency,
	informal,
	onOpen,
	download
}: {
	entries: Entry[];
	risks: Entry[] | undefined;
	agency: string;
	informal: boolean;
	onOpen: (screen: Screen) => void;
	download: ClientViewProps['download'];
}) {
	const [more, setMore] = useState(entries.length === 0);
	const [confirming, setConfirming] = useState(false);
	const situations = risks ? situationsOf(risks) : undefined;
	const empty = emptySections(entries, agency, situations);
	const sections = SECTION_ORDER.filter((section) => section.id !== 'risks' || risks !== undefined);

	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<p className="bt-lead">{startText(informal)}</p>
					<div>
						<button type="button" className="bt-linkbtn" aria-expanded={more} onClick={() => setMore(!more)}>
							{more ? 'Infotext ausblenden' : 'Infotext einblenden'}
						</button>
					</div>
					{more && <p>{moreText(informal)}</p>}
				</div>
			</Card>
			<div className="bt-kit">
				{sections.map((section) => (
					<button key={section.id} type="button" className="bt-kit-tile" onClick={() => onOpen(section.id)}>
						<span className="bt-kit-tile__title">
							<span className="bt-kit-tile__number" aria-hidden>
								{section.number}
							</span>
							{section.title}
						</span>
						<SectionPreview section={section.id} entries={entries} risks={situations} agency={agency} />
					</button>
				))}
			</div>
			<Card>
				<div className="bt-stack bt-stack--tight">
					<h3 className="bt-title">Notfallkoffer ausdrucken</h3>
					{confirming ? (
						<div className="bt-confirm" role="alertdialog" aria-label="Trotzdem fortfahren?">
							<span style={{ flex: 1 }}>
								Zu mindestens einer Rubrik liegen keine Einträge vor. Trotzdem fortfahren?
							</span>
							<Button
								onClick={() => {
									setConfirming(false);
									void download('kit');
								}}
							>
								Fortfahren
							</Button>
							<Button variant="tertiary" onClick={() => setConfirming(false)}>
								Abbrechen
							</Button>
						</div>
					) : (
						<div className="bt-row">
							<Button
								variant="secondary"
								onClick={() => (empty.length > 0 ? setConfirming(true) : void download('kit'))}
							>
								Gesamten Notfallkoffer als PDF ausgeben
							</Button>
							<Button variant="secondary" onClick={() => void download('card')}>
								Notfallkoffer im Visitenkartenformat
							</Button>
						</div>
					)}
					<p className="bt-muted bt-small">
						{tx(
							informal,
							'Das Visitenkartenformat passt ausgeschnitten in jede Geldbörse, so haben Sie Ihren Notfallkoffer immer dabei.',
							'Das Visitenkartenformat passt ausgeschnitten in jede Geldbörse, so hast du deinen Notfallkoffer immer dabei.'
						)}
					</p>
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
	informal,
	onClose
}: {
	kind: ListKind;
	entries: Entry[];
	store: Store;
	informal: boolean;
	onClose: () => void;
}) {
	const section = LIST_SECTIONS[kind];
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
			setProblem(
				tx(
					informal,
					'Bitte wählen Sie bei jedem Eintrag aus, wie wichtig er für Sie ist.',
					'Bitte wähle bei jedem Eintrag aus, wie wichtig er für dich ist.'
				)
			);
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

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>Zum Notfallkoffer</BackButton>
			<Card>
				<div className="bt-stack">
					<div className="bt-stack bt-stack--tight">
						<p className="bt-overline">Notfallkoffer, Teil {section.number}</p>
						<Headline level={3}>{section.title}</Headline>
						<p>{section.intro(informal)}</p>
					</div>
					<Examples
						groups={section.examples}
						group={group}
						onGroup={setGroup}
						items={(examples?.items ?? []).filter((item) => !used.has(item))}
						onPick={addExample}
					/>
					<div className="bt-stack bt-stack--tight">
						<h4 className="bt-title">{section.listLabel}</h4>
						<ul className="bt-list">
							{rows.map((row, index) => (
								<li key={row.key} className="bt-kit-row">
									<div className="bt-kit-row__fields">
										<Textarea
											id={`kit-${kind}-${row.key}`}
											label={`${section.fieldLabel} (${index + 1})`}
											value={row.text}
											maxLength={MAX_TEXT_LENGTH}
											minRows={2}
											onChange={(text) => change(row.key, { text })}
										/>
										{withImportance && (
											<Select
												id={`kit-importance-${row.key}`}
												label="Wie wichtig?"
												value={row.importance}
												error={Boolean(problem) && Boolean(row.text.trim()) && !row.importance}
												options={[
													{ value: '', label: 'Bitte auswählen' },
													...IMPORTANCE.map((option) => ({
														value: String(option.value),
														label: option.label
													}))
												]}
												onChange={(importance) => change(row.key, { importance })}
											/>
										)}
									</div>
									<IconButton
										icon="delete"
										label={`Löschen: ${row.text || `Eintrag ${index + 1}`}`}
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
								+ Neuer Eintrag
							</button>
						</div>
					</div>
					{problem && (
						<p role="alert" className="bt-alert">
							{problem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={save}>Speichern</Button>
						<Button variant="tertiary" onClick={onClose}>
							Abbrechen
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
	const [open, setOpen] = useState(false);
	return (
		<div className="bt-stack bt-stack--tight">
			<div>
				<button type="button" className="bt-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
					{open ? 'Beispiele ausblenden' : 'Beispiele anzeigen'}
				</button>
			</div>
			{open && (
				<>
					{groups.length > 1 && (
						<div className="bt-tabs" role="group" aria-label="Beispiele nach Thema">
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
						<p className="bt-muted bt-small">Alle Beispiele sind schon eingetragen.</p>
					)}
					<p className="bt-muted bt-small">Ein Klick auf ein Beispiel übernimmt es als Eintrag.</p>
				</>
			)}
		</div>
	);
}

function SupportPage({
	entries,
	agency,
	counsellors,
	locale,
	onOpen,
	onBack
}: {
	entries: Entry[];
	agency: string;
	counsellors: string[];
	locale: string;
	onOpen: (screen: Screen) => void;
	onBack: () => void;
}) {
	const trusted = trustedOf(entries);
	const selfHelp = keyedText(entries, SELF_HELP_KIND);
	const request = keyedOf(entries, REQUEST_KIND, SELF_HELP_REQUEST_KEY);
	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>Zum Notfallkoffer</BackButton>
			<Card>
				<div className="bt-stack">
					<div>
						<p className="bt-overline">Notfallkoffer, Teil 3</p>
						<Headline level={3}>{SUPPORT_TITLE}</Headline>
					</div>
					<div className="bt-summary">
						<div>
							<strong>Meine Vertrauensperson(en)</strong>
							<button type="button" className="bt-linkbtn" onClick={() => onOpen('trusted')}>
								{trusted.length ? 'Ändern' : 'Vertrauensperson eintragen'}
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
							<strong>Meine Beratungsstelle</strong>
							<button type="button" className="bt-linkbtn" onClick={() => onOpen('agency')}>
								Anzeigen
							</button>
							<p className={`bt-pre${agency ? '' : ' bt-muted'}`} style={{ gridColumn: '1 / -1' }}>
								{agency ||
									(counsellors.length ? `Beratung: ${counsellors.join(', ')}` : 'Noch nicht hinterlegt')}
							</p>
						</div>
						<div>
							<strong>Meine Selbsthilfegruppe</strong>
							<button type="button" className="bt-linkbtn" onClick={() => onOpen('self-help')}>
								{selfHelp ? 'Ändern' : 'Selbsthilfegruppe eintragen'}
							</button>
							{(selfHelp || request) && (
								<div style={{ gridColumn: '1 / -1' }}>
									{selfHelp && <p className="bt-pre">{selfHelp}</p>}
									{request && (
										<p className="bt-small bt-muted">
											Empfehlung angefragt am {formatDate(request.createdAt, locale)}
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

function TrustedEditor({
	entries,
	store,
	informal,
	onClose
}: {
	entries: Entry[];
	store: Store;
	informal: boolean;
	onClose: () => void;
}) {
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
			<BackButton onClick={onClose}>Zurück</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>Meine Vertrauensperson(en)</Headline>
					{trustedIntro(informal).map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
					<ul className="bt-list">
						{rows.map((row, index) => (
							<li key={row.key} className="bt-kit-row">
								<div className="bt-kit-row__fields">
									<TextField
										id={`kit-trusted-${row.key}`}
										label={`Name / Rolle Vertrauensperson (${index + 1})`}
										placeholder="Name eintragen"
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
									label={`Löschen: ${row.text || `Zeile ${index + 1}`}`}
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
							+ Zeile hinzufügen
						</button>
					</div>
					<div className="bt-row">
						<Button onClick={save}>Einträge speichern</Button>
						<Button variant="tertiary" onClick={onClose}>
							Zurück
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
	informal,
	onBack
}: {
	agency: string;
	counsellors: string[];
	informal: boolean;
	onBack: () => void;
}) {
	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>Zurück</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>Meine Beratungsstelle</Headline>
					<p>{agencyIntro(informal)}</p>
					<div className="bt-quote">
						<span className="bt-overline">
							{tx(informal, 'Ihre Beratungsstelle:', 'Deine Beratungsstelle:')}
						</span>
						<p className={`bt-pre${agency ? '' : ' bt-muted'}`}>
							{agency ||
								tx(
									informal,
									'Die Kontaktdaten Ihrer Beratungsstelle sind hier noch nicht hinterlegt. Ihre Beraterin / Ihr Berater nennt sie Ihnen gerne.',
									'Die Kontaktdaten deiner Beratungsstelle sind hier noch nicht hinterlegt. Deine Beraterin / dein Berater nennt sie dir gerne.'
								)}
						</p>
					</div>
					{counsellors.length > 0 && (
						<div className="bt-quote">
							<span className="bt-overline">
								{tx(informal, 'Ihre Beraterin / Ihr Berater:', 'Deine Beraterin / dein Berater:')}
							</span>
							<p>{counsellors.join(', ')}</p>
						</div>
					)}
					<div>
						<Button variant="secondary" onClick={onBack}>
							Zurück
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
	informal,
	locale,
	onClose
}: {
	entries: Entry[];
	store: Store;
	informal: boolean;
	locale: string;
	onClose: () => void;
}) {
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
			<BackButton onClick={onClose}>Zurück</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>Meine Selbsthilfegruppe</Headline>
					{selfHelpIntro(informal).map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
					{request ? (
						<p className="bt-done" role="status">
							<Icon name="check" />
							Ich möchte eine Selbsthilfegruppe empfohlen bekommen. (angefragt am{' '}
							{formatDate(request.createdAt, locale)})
						</p>
					) : (
						<div>
							<button
								type="button"
								className="bt-linkbtn bt-request"
								onClick={() => void store.putKeyed(REQUEST_KIND, SELF_HELP_REQUEST_KEY, { requested: true })}
							>
								<Icon name="check" />
								Ich möchte eine Selbsthilfegruppe empfohlen bekommen.
							</button>
							<p className="bt-muted bt-small">
								{tx(
									informal,
									'Ihre Beraterin / Ihr Berater erhält dann eine Nachricht.',
									'Deine Beraterin / dein Berater erhält dann eine Nachricht.'
								)}
							</p>
						</div>
					)}
					<p>
						{nakosText(informal)}{' '}
						<a href={NAKOS_URL} target="_blank" rel="noopener noreferrer">
							NAKOS (Nationale Kontakt- und Informationsstelle zur Anregung und Unterstützung von
							Selbsthilfegruppen)
						</a>
					</p>
					<Textarea
						id="kit-self-help"
						label="Meine Selbsthilfegruppe:"
						placeholder={tx(
							informal,
							'Tragen Sie hier den Namen der Gruppe, Termin(e), Ansprechperson, Telefonnummer ein',
							'Trag hier den Namen der Gruppe, Termin(e), Ansprechperson, Telefonnummer ein'
						)}
						value={text}
						maxLength={MAX_LONG_TEXT_LENGTH}
						minRows={4}
						onChange={setText}
					/>
					<div className="bt-row">
						<Button onClick={save}>Speichern</Button>
						<Button variant="tertiary" onClick={onClose}>
							Abbrechen
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
	informal,
	onClose
}: {
	entries: Entry[];
	risks: SituationItem[];
	store: Store;
	informal: boolean;
	onClose: () => void;
}) {
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
			<BackButton onClick={onClose}>Zum Notfallkoffer</BackButton>
			<Card>
				<div className="bt-stack">
					<div className="bt-stack bt-stack--tight">
						<p className="bt-overline">Notfallkoffer, Teil 6</p>
						<Headline level={3}>{RISKS_TITLE}</Headline>
						<p>{risksIntro(informal)}</p>
					</div>
					{risks.length === 0 ? (
						<p className="bt-muted">
							{tx(
								informal,
								'In der Übung „Risikosituationen und Kontrollstrategien“ haben Sie noch keine Risikosituation eingetragen.',
								'In der Übung „Risikosituationen und Kontrollstrategien“ hast du noch keine Risikosituation eingetragen.'
							)}
						</p>
					) : (
						<ul className="bt-list">
							{risks.map((risk) => (
								<li key={risk.id} className="bt-entry bt-stack bt-stack--tight">
									<div className="bt-row bt-row--between" style={{ alignItems: 'flex-start' }}>
										<strong className="bt-item__text">{risk.situation}</strong>
										<span className="bt-pill bt-pill--neutral">{difficultyOf(risk.difficulty)?.label}</span>
									</div>
									<p className={`bt-pre${risk.strategy ? '' : ' bt-muted'}`}>
										{risk.strategy || 'Noch keine Kontrollstrategie'}
									</p>
									<Checkbox
										label="Für Ausdruck übernehmen?"
										checked={print[risk.id] ?? true}
										onChange={(checked) => setPrint({ ...print, [risk.id]: checked })}
									/>
								</li>
							))}
						</ul>
					)}
					<Textarea
						id="kit-other-strategies"
						label={OTHER_STRATEGIES_LABEL}
						value={other}
						maxLength={MAX_LONG_TEXT_LENGTH}
						minRows={4}
						onChange={setOther}
					/>
					<div className="bt-row">
						<Button onClick={save}>Speichern</Button>
						<Button variant="tertiary" onClick={onClose}>
							Abbrechen
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
