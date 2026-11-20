import { Button, Card, DatePicker, Headline, Select, TextField } from '@oriso/web-kit';
import { useRef, useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import {
	ACTIVITY_KIND,
	activitiesOf,
	REPEAT_LABELS,
	REPEATS,
	type Activity,
	type Repeat
} from '../../../../shared/activities.ts';
import { formatDayLong, localToday } from '../../../../shared/days.ts';
import {
	howTo,
	intro,
	MAX_COMPANION_LENGTH,
	MAX_TITLE_LENGTH,
	nextLabel,
	SUGGESTIONS,
	suggestionsHint,
	toIcs
} from '../../../../shared/tools/active.ts';
import { BackButton, downloadBlob, Icon, TimeField } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';

interface Draft {
	title: string;
	date: string;
	time: string;
	repeat: Repeat;
	dates: string[];
	companion: string;
}

const EMPTY: Draft = { title: '', date: '', time: '', repeat: 'none', dates: [], companion: '' };

const draftOf = (activity: Activity): Draft => ({
	title: activity.title,
	date: activity.date ?? '',
	time: activity.time ?? '',
	repeat: activity.repeat,
	dates: activity.dates ?? [],
	companion: activity.companion ?? ''
});

const download = (text: string, fileName: string) =>
	downloadBlob(new Blob([text], { type: 'text/calendar;charset=utf-8' }), fileName);

/** "Aktiv sein" (section 2.6): plan activities, see them listed, take them into a calendar. */
export function ActiveClient({ tool, entries, store, informal }: ClientViewProps) {
	const [draft, setDraft] = useState<Draft>(EMPTY);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [suggesting, setSuggesting] = useState(false);
	const [problem, setProblem] = useState<string | null>(null);
	const [confirming, setConfirming] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement>(null);
	const activities = activitiesOf(entries);
	const today = localToday();
	const customIntro = typeof tool.options.intro === 'string' ? tool.options.intro : '';

	const reset = () => {
		setDraft(EMPTY);
		setEditingId(null);
		setProblem(null);
	};

	const submit = () => {
		const title = draft.title.trim();
		if (!title) {
			setProblem(tx(informal, 'Bitte tragen Sie eine Aktivität ein.', 'Bitte trage eine Aktivität ein.'));
			return;
		}
		if (!draft.date && (draft.time || draft.repeat !== 'none')) {
			setProblem(
				tx(
					informal,
					'Für Uhrzeit und Wiederholung wählen Sie bitte auch ein Datum.',
					'Für Uhrzeit und Wiederholung wähle bitte auch ein Datum.'
				)
			);
			return;
		}
		const data: Activity = {
			title,
			repeat: draft.repeat,
			...(draft.date ? { date: draft.date } : {}),
			...(draft.date && draft.time ? { time: draft.time } : {}),
			...(draft.repeat === 'custom' && draft.dates.length ? { dates: draft.dates } : {}),
			...(draft.companion.trim() ? { companion: draft.companion.trim() } : {})
		};
		void (editingId ? store.update(editingId, data) : store.create(ACTIVITY_KIND, data));
		reset();
	};

	if (suggesting) {
		return (
			<Suggestions
				informal={informal}
				onBack={() => setSuggesting(false)}
				onPick={(title) => {
					setDraft((current) => ({ ...current, title }));
					setSuggesting(false);
				}}
			/>
		);
	}

	const dated = activities.filter((a) => a.data.date);

	return (
		<div className="bt-stack">
			<Intro custom={customIntro} informal={informal} />
			<Card>
				<div className="bt-stack" ref={formRef}>
					<div className="bt-row bt-row--between">
						<Headline level={3}>{editingId ? 'Aktivität bearbeiten' : 'Neue Aktivität planen'}</Headline>
						<Button variant="secondary" onClick={() => setSuggesting(true)}>
							Vorschläge für Aktivitäten
						</Button>
					</div>
					<TextField
						id="active-title"
						label="Aktivität eintragen"
						placeholder="Name oder Beschreibung der Aktivität"
						value={draft.title}
						maxLength={MAX_TITLE_LENGTH}
						error={Boolean(problem) && !draft.title.trim()}
						onChange={(title) => setDraft({ ...draft, title })}
					/>
					<div className="bt-fields">
						<DatePicker
							label="Datum auswählen (optional)"
							value={draft.date}
							onChange={(date) => setDraft({ ...draft, date })}
						/>
						<TimeField
							label="Uhrzeit auswählen (optional)"
							value={draft.time}
							onChange={(time) => setDraft({ ...draft, time })}
						/>
						<Select
							label="Aktivität wiederholen?"
							value={draft.repeat}
							options={REPEATS.map((value) => ({ value, label: REPEAT_LABELS[value] }))}
							onChange={(repeat) => setDraft({ ...draft, repeat: repeat as Repeat })}
						/>
					</div>
					{draft.repeat === 'custom' && (
						<CustomDates
							dates={draft.dates}
							onChange={(dates) => setDraft({ ...draft, dates })}
							first={draft.date}
						/>
					)}
					<TextField
						label="Begleitung (optional)"
						placeholder="Name einer begleitenden Person"
						value={draft.companion}
						maxLength={MAX_COMPANION_LENGTH}
						onChange={(companion) => setDraft({ ...draft, companion })}
					/>
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{problem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={submit}>{editingId ? 'Änderung speichern' : 'Aktivität hinzufügen'}</Button>
						{editingId && (
							<Button variant="tertiary" onClick={reset}>
								Abbrechen
							</Button>
						)}
					</div>
				</div>
			</Card>
			<Card>
				<div className="bt-stack bt-stack--tight">
					<div className="bt-row bt-row--between">
						<h3 className="bt-title">Eingetragene Aktivitäten</h3>
						{dated.length > 0 && (
							<Button
								variant="secondary"
								onClick={() =>
									download(
										toIcs(
											dated.map((a) => ({ id: a.id, data: a.data })),
											new Date()
										),
										'aktiv-sein.ics'
									)
								}
							>
								In meinen Kalender übernehmen
							</Button>
						)}
					</div>
					{activities.length === 0 ? (
						<p className="bt-muted">Noch keine Aktivitäten eingetragen.</p>
					) : (
						<ul className="bt-list">
							{activities.map(({ id, data }) => (
								<li
									key={id}
									className="bt-item"
									style={editingId === id ? { borderColor: 'var(--bt-primary)' } : undefined}
								>
									{confirming === id ? (
										<div className="bt-row" style={{ flex: 1 }}>
											<span style={{ flex: 1 }}>Diese Aktivität löschen?</span>
											<Button
												onClick={() => {
													setConfirming(null);
													if (editingId === id) {
														reset();
													}
													void store.remove(id);
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
											<button
												type="button"
												className="bt-plan"
												aria-label={`Bearbeiten: ${data.title}`}
												onClick={() => {
													setDraft(draftOf(data));
													setEditingId(id);
													setProblem(null);
													formRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
												}}
											>
												<strong className="bt-item__text">{data.title}</strong>
												<span className="bt-small bt-muted">
													Nächster Termin: {nextLabel(data, today)}
													{data.repeat !== 'none' ? ` (${REPEAT_LABELS[data.repeat]})` : ''}
												</span>
												<span className="bt-small bt-muted">Begleitung: {data.companion ?? '–'}</span>
											</button>
											<button
												type="button"
												className="bt-iconbtn"
												title="Aktivität löschen"
												aria-label={`Löschen: ${data.title}`}
												onClick={() => setConfirming(id)}
											>
												<Icon name="delete" />
											</button>
										</>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
			</Card>
		</div>
	);
}

function Intro({ custom, informal }: { custom: string; informal: boolean }) {
	const [open, setOpen] = useState(false);
	return (
		<Card>
			<div className="bt-stack bt-stack--tight">
				{custom ? (
					<p className="bt-pre">{custom}</p>
				) : (
					intro(informal).map((paragraph) => <p key={paragraph}>{paragraph}</p>)
				)}
				<div>
					<button type="button" className="bt-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
						Wie gehe ich vor?
					</button>
				</div>
				{open && (
					<ul style={{ paddingLeft: 20, margin: 0 }} className="bt-stack bt-stack--tight">
						{howTo(informal).map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				)}
			</div>
		</Card>
	);
}

function CustomDates({
	dates,
	first,
	onChange
}: {
	dates: string[];
	first: string;
	onChange: (dates: string[]) => void;
}) {
	const [next, setNext] = useState('');
	const add = () => {
		if (next && next !== first && !dates.includes(next)) {
			onChange([...dates, next].sort());
		}
		setNext('');
	};
	return (
		<div className="bt-stack bt-stack--tight">
			<div className="bt-row" style={{ alignItems: 'flex-end' }}>
				<DatePicker label="Weiterer Termin" value={next} onChange={setNext} />
				<Button variant="secondary" disabled={!next} onClick={add}>
					Termin hinzufügen
				</Button>
			</div>
			{dates.length > 0 && (
				<ul className="bt-chips" aria-label="Weitere Termine">
					{dates.map((day) => (
						<li key={day} className="bt-chip" style={{ listStyle: 'none', display: 'inline-flex', gap: 4 }}>
							{formatDayLong(day)}
							<button
								type="button"
								className="bt-linkbtn bt-small"
								aria-label={`Termin entfernen: ${formatDayLong(day)}`}
								onClick={() => onChange(dates.filter((d) => d !== day))}
							>
								entfernen
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function Suggestions({
	informal,
	onBack,
	onPick
}: {
	informal: boolean;
	onBack: () => void;
	onPick: (title: string) => void;
}) {
	const [category, setCategory] = useState(0);
	const current = SUGGESTIONS[category] ?? SUGGESTIONS[0];
	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>Zurück zur Planung</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>Vorschläge für Aktivitäten</Headline>
					<p>{suggestionsHint(informal)}</p>
					<div className="bt-navtabs" role="tablist">
						{SUGGESTIONS.map((candidate, index) => (
							<button
								key={candidate.title}
								type="button"
								role="tab"
								className="bt-navtab"
								aria-selected={index === category}
								onClick={() => setCategory(index)}
							>
								{candidate.title}
							</button>
						))}
					</div>
					<div className="bt-chips" role="tabpanel" aria-label={current?.title}>
						{current?.items.map((item) => (
							<button key={item} type="button" className="bt-chip" onClick={() => onPick(item)}>
								{item}
							</button>
						))}
					</div>
				</div>
			</Card>
		</div>
	);
}
