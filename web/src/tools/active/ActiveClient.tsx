import { Button, Card, DatePicker, Headline, Select, TextField } from '@oriso/web-kit';
import { useRef, useState } from 'react';
import {
	ACTIVITY_KIND,
	activitiesOf,
	REPEATS,
	type Activity,
	type Repeat
} from '../../../../shared/activities.ts';
import { formatDayLong, localToday } from '../../../../shared/days.ts';
import {
	MAX_COMPANION_LENGTH,
	MAX_TITLE_LENGTH,
	nextLabel,
	SUGGESTION_CATEGORIES,
	toIcs,
	type SuggestionCategory
} from '../../../../shared/tools/active.ts';
import { useI18n } from '../../host.ts';
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
export function ActiveClient({ tool, entries, store }: ClientViewProps) {
	const i18n = useI18n();
	const { m, t } = i18n;
	const texts = m.active;
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
			setProblem(texts.missingTitle);
			return;
		}
		if (!draft.date && (draft.time || draft.repeat !== 'none')) {
			setProblem(texts.missingDate);
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
			<Intro custom={customIntro} />
			<Card>
				<div className="bt-stack" ref={formRef}>
					<div className="bt-row bt-row--between">
						<Headline level={3}>{editingId ? texts.editTitle : texts.newTitle}</Headline>
						<Button variant="secondary" onClick={() => setSuggesting(true)}>
							{texts.suggestionsButton}
						</Button>
					</div>
					<TextField
						id="active-title"
						label={texts.titleLabel}
						placeholder={texts.titlePlaceholder}
						value={draft.title}
						maxLength={MAX_TITLE_LENGTH}
						error={Boolean(problem) && !draft.title.trim()}
						onChange={(title) => setDraft({ ...draft, title })}
					/>
					<div className="bt-fields">
						<DatePicker
							label={texts.dateLabel}
							value={draft.date}
							onChange={(date) => setDraft({ ...draft, date })}
						/>
						<TimeField
							label={texts.timeLabel}
							value={draft.time}
							onChange={(time) => setDraft({ ...draft, time })}
						/>
						<Select
							label={texts.repeatLabel}
							value={draft.repeat}
							options={REPEATS.map((value) => ({ value, label: texts.repeatOptions[value] }))}
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
						label={texts.companionLabel}
						placeholder={texts.companionPlaceholder}
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
						<Button onClick={submit}>{editingId ? texts.saveChange : texts.add}</Button>
						{editingId && (
							<Button variant="secondary" onClick={reset}>
								{m.common.cancel}
							</Button>
						)}
					</div>
				</div>
			</Card>
			<Card>
				<div className="bt-stack bt-stack--tight">
					<div className="bt-row bt-row--between">
						<h3 className="bt-title">{texts.listTitle}</h3>
						{dated.length > 0 && (
							<Button
								variant="secondary"
								onClick={() =>
									download(
										toIcs(
											dated.map((a) => ({ id: a.id, data: a.data })),
											new Date(),
											i18n
										),
										texts.calendarFileName
									)
								}
							>
								{texts.addToCalendar}
							</Button>
						)}
					</div>
					{activities.length === 0 ? (
						<p className="bt-muted">{texts.empty}</p>
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
											<span style={{ flex: 1 }}>{texts.confirmDelete}</span>
											<Button
												onClick={() => {
													setConfirming(null);
													if (editingId === id) {
														reset();
													}
													void store.remove(id);
												}}
											>
												{texts.delete}
											</Button>
											<Button variant="secondary" onClick={() => setConfirming(null)}>
												{m.common.cancel}
											</Button>
										</div>
									) : (
										<>
											<button
												type="button"
												className="bt-plan"
												aria-label={t(texts.editLabel, { title: data.title })}
												onClick={() => {
													setDraft(draftOf(data));
													setEditingId(id);
													setProblem(null);
													formRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
												}}
											>
												<strong className="bt-item__text">{data.title}</strong>
												<span className="bt-small bt-muted">
													{data.repeat === 'none'
														? t(texts.nextLine, { next: nextLabel(data, today, i18n) })
														: t(texts.nextLineWithRepeat, {
																next: nextLabel(data, today, i18n),
																repeat: texts.repeatOptions[data.repeat]
															})}
												</span>
												<span className="bt-small bt-muted">
													{t(texts.companionLine, { companion: data.companion ?? '–' })}
												</span>
											</button>
											<button
												type="button"
												className="bt-iconbtn"
												title={texts.deleteTitle}
												aria-label={t(texts.deleteLabel, { title: data.title })}
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

function Intro({ custom }: { custom: string }) {
	const texts = useI18n().m.active;
	const [open, setOpen] = useState(false);
	return (
		<Card>
			<div className="bt-stack bt-stack--tight">
				{custom ? (
					<p className="bt-pre">{custom}</p>
				) : (
					texts.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
				)}
				<div>
					<button type="button" className="bt-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
						{texts.howToToggle}
					</button>
				</div>
				{open && (
					<ul style={{ paddingLeft: 20, margin: 0 }} className="bt-stack bt-stack--tight">
						{texts.howTo.map((line) => (
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
	const { lang, t, m } = useI18n();
	const texts = m.active;
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
				<DatePicker label={texts.furtherDateLabel} value={next} onChange={setNext} />
				<Button variant="secondary" disabled={!next} onClick={add}>
					{texts.addDate}
				</Button>
			</div>
			{dates.length > 0 && (
				<ul className="bt-chips" aria-label={texts.furtherDatesLabel}>
					{dates.map((day) => (
						<li key={day} className="bt-chip" style={{ listStyle: 'none', display: 'inline-flex', gap: 4 }}>
							{formatDayLong(day, lang)}
							<button
								type="button"
								className="bt-linkbtn bt-small"
								aria-label={t(texts.removeDateLabel, { day: formatDayLong(day, lang) })}
								onClick={() => onChange(dates.filter((d) => d !== day))}
							>
								{texts.removeDate}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function Suggestions({ onBack, onPick }: { onBack: () => void; onPick: (title: string) => void }) {
	const texts = useI18n().m.active;
	const [category, setCategory] = useState<SuggestionCategory>('sport');
	const current = texts.suggestions[category];
	return (
		<div className="bt-stack">
			<BackButton onClick={onBack}>{texts.backToPlanning}</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{texts.suggestionsTitle}</Headline>
					<p>{texts.suggestionsHint}</p>
					<div className="bt-navtabs" role="tablist">
						{SUGGESTION_CATEGORIES.map((candidate) => (
							<button
								key={candidate}
								type="button"
								role="tab"
								className="bt-navtab"
								aria-selected={candidate === category}
								onClick={() => setCategory(candidate)}
							>
								{texts.suggestions[candidate].title}
							</button>
						))}
					</div>
					<div className="bt-chips" role="tabpanel" aria-label={current.title}>
						{current.items.map((item) => (
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
