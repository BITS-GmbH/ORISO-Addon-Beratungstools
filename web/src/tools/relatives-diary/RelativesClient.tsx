import { Button, Card, Headline, Textarea } from '@oriso/web-kit';
import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	addDays,
	formatDayLong,
	formatDayShort,
	formatWeek,
	localToday,
	weekDays,
	weekStart
} from '../../../../shared/days.ts';
import {
	dayQuestions,
	ENTRY_KIND,
	MAX_TEXT_LENGTH,
	snippet,
	type DiaryEntry
} from '../../../../shared/tools/relatives-diary.ts';
import { PlannedActivities } from '../../core/PlannedActivities.tsx';
import { useI18n } from '../../host.ts';
import { BackButton, WeekNav } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { MoodIndicator, MoodPicker } from './Mood.tsx';

export const entriesByDay = (entries: Entry[]): Map<string, Entry<DiaryEntry>> =>
	new Map(
		entries
			.filter((e): e is Entry<DiaryEntry> => e.kind === ENTRY_KIND && Boolean(e.day))
			.map((e) => [e.day as string, e])
	);

/** "Mein Tagebuch" (section 2.3): a week with snippets and moods, and one entry per day. */
export function RelativesClient({ tool, entries, store, openTool }: ClientViewProps) {
	const { m, t, lang } = useI18n();
	const texts = m.relativesDiary;
	const today = localToday();
	const [monday, setMonday] = useState(() => weekStart(today));
	const [openDay, setOpenDay] = useState<string | null>(null);
	const byDay = entriesByDay(entries);
	const customIntro = typeof tool.options.intro === 'string' ? tool.options.intro : '';

	if (openDay) {
		return (
			<DayEntry
				key={openDay}
				day={openDay}
				today={today}
				entry={byDay.get(openDay)}
				store={store}
				onClose={() => setOpenDay(null)}
			/>
		);
	}

	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<Headline level={3}>{texts.title}</Headline>
					{customIntro ? (
						<p className="bt-pre">{customIntro}</p>
					) : (
						texts.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
					)}
				</div>
			</Card>
			<Card>
				<div className="bt-stack">
					<WeekNav
						label={formatWeek(monday, lang)}
						onPrevious={() => setMonday(addDays(monday, -7))}
						onNext={() => setMonday(addDays(monday, 7))}
						nextDisabled={addDays(monday, 7) > today}
					/>
					<div className="bt-relweek">
						<div className="bt-relweek__row bt-relweek__row--head" aria-hidden>
							<span />
							<span>{texts.weekEntriesHeading}</span>
							<span>{texts.weekMoodHeading}</span>
							<span />
						</div>
						{weekDays(monday).map((day) => {
							const entry = byDay.get(day);
							const future = day > today;
							return (
								<div key={day} className="bt-relweek__row">
									<span className={`bt-relweek__day${day === today ? ' is-today' : ''}`}>
										{formatDayShort(day, lang)}
									</span>
									<span className="bt-relweek__text bt-snippet">
										{entry?.data.text && snippet(entry.data.text)}
									</span>
									<span className="bt-relweek__mood">
										<MoodIndicator mood={entry?.data.mood} />
									</span>
									{!future && (
										<button
											type="button"
											className="bt-linkbtn bt-relweek__action"
											aria-label={t(entry ? texts.openEntryLabel : texts.createEntryLabel, {
												day: formatDayLong(day, lang)
											})}
											onClick={() => setOpenDay(day)}
										>
											{entry ? texts.openEntry : texts.createEntry}
										</button>
									)}
								</div>
							);
						})}
					</div>
					<PlannedActivities
						linked={tool.linked ?? {}}
						monday={monday}
						onPlan={openTool && (() => openTool('active'))}
					/>
				</div>
			</Card>
		</div>
	);
}

function DayEntry({
	day,
	today,
	entry,
	store,
	onClose
}: {
	day: string;
	today: string;
	entry: Entry<DiaryEntry> | undefined;
	store: ClientViewProps['store'];
	onClose: () => void;
}) {
	const [text, setText] = useState(entry?.data.text ?? '');
	const [mood, setMood] = useState<number | undefined>(entry?.data.mood);
	const [confirming, setConfirming] = useState(false);
	const [problem, setProblem] = useState<string | null>(null);
	const { m, lang } = useI18n();
	const texts = m.relativesDiary;
	const { questions, mood: moodQuestion } = dayQuestions(m, day === today);

	const save = () => {
		if (!text.trim() && !mood) {
			setProblem(texts.emptyEntry);
			return;
		}
		void store.putKeyed(
			ENTRY_KIND,
			day,
			{ ...(text.trim() ? { text: text.trim() } : {}), ...(mood ? { mood } : {}) },
			day
		);
		onClose();
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>{texts.backToOverview}</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{formatDayLong(day, lang)}</Headline>
					<div>
						{questions.map((question) => (
							<p key={question} className="bt-title">
								{question}
							</p>
						))}
					</div>
					<Textarea
						id="relatives-diary-text"
						label={texts.entryLabel}
						value={text}
						minRows={8}
						maxLength={MAX_TEXT_LENGTH}
						onChange={setText}
						helperText={`${text.length} / ${MAX_TEXT_LENGTH}`}
					/>
					<MoodPicker legend={moodQuestion} name={`mood-${day}`} value={mood} onChange={setMood} />
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{problem}
						</p>
					)}
					<div className="bt-row bt-row--between">
						<div className="bt-row">
							<Button onClick={save}>{texts.saveEntry}</Button>
							<Button variant="tertiary" onClick={onClose}>
								{texts.backToOverview}
							</Button>
						</div>
						{entry && !confirming && (
							<Button variant="tertiary" onClick={() => setConfirming(true)}>
								{texts.deleteEntry}
							</Button>
						)}
					</div>
					{confirming && (
						<div className="bt-confirm" role="alertdialog" aria-label={texts.deleteEntry}>
							<span style={{ flex: 1 }}>{texts.deleteConfirm}</span>
							<Button
								onClick={() => {
									void store.removeKeyed(ENTRY_KIND, day);
									onClose();
								}}
							>
								{texts.deleteButton}
							</Button>
							<Button variant="tertiary" onClick={() => setConfirming(false)}>
								{m.common.cancel}
							</Button>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}
