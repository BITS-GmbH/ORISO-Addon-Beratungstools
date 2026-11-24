import { Button, Card, Headline, Textarea } from '@oriso/web-kit';
import { useState } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import { tx } from '../../../../shared/address.ts';
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
	ENTRY_KIND,
	intro,
	MAX_TEXT_LENGTH,
	moodQuestion,
	questions,
	snippet,
	type DiaryEntry
} from '../../../../shared/tools/relatives-diary.ts';
import { PlannedActivities } from '../../core/PlannedActivities.tsx';
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
export function RelativesClient({ tool, entries, store, informal, openTool }: ClientViewProps) {
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
				informal={informal}
				store={store}
				onClose={() => setOpenDay(null)}
			/>
		);
	}

	return (
		<div className="bt-stack">
			<Card>
				<div className="bt-stack bt-stack--tight">
					<Headline level={3}>Mein Tagebuch</Headline>
					{customIntro ? (
						<p className="bt-pre">{customIntro}</p>
					) : (
						intro(informal).map((paragraph) => <p key={paragraph}>{paragraph}</p>)
					)}
				</div>
			</Card>
			<Card>
				<div className="bt-stack">
					<WeekNav
						label={formatWeek(monday)}
						onPrevious={() => setMonday(addDays(monday, -7))}
						onNext={() => setMonday(addDays(monday, 7))}
						nextDisabled={addDays(monday, 7) > today}
					/>
					<div className="bt-week" style={{ ['--bt-cols' as string]: 2 }}>
						<div className="bt-week__row bt-week__row--head" aria-hidden>
							<span />
							<span>Tagebucheinträge</span>
						</div>
						{weekDays(monday).map((day) => {
							const entry = byDay.get(day);
							const future = day > today;
							return (
								<div key={day} className="bt-week__row">
									<span className={`bt-week__day${day === today ? ' is-today' : ''}`}>
										{formatDayShort(day)}
									</span>
									<div className="bt-week__cell">
										<div className="bt-stack bt-stack--tight" style={{ flex: 1, minWidth: 0 }}>
											{entry?.data.text && <span className="bt-snippet">{snippet(entry.data.text)}</span>}
											<MoodIndicator mood={entry?.data.mood} />
										</div>
										{!future && (
											<button
												type="button"
												className="bt-linkbtn"
												aria-label={`${entry ? 'Eintrag öffnen' : 'Eintrag erstellen'}: ${formatDayLong(day)}`}
												onClick={() => setOpenDay(day)}
											>
												{entry ? 'Öffnen' : 'Eintrag erstellen'}
											</button>
										)}
									</div>
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
	informal,
	store,
	onClose
}: {
	day: string;
	today: string;
	entry: Entry<DiaryEntry> | undefined;
	informal: boolean;
	store: ClientViewProps['store'];
	onClose: () => void;
}) {
	const [text, setText] = useState(entry?.data.text ?? '');
	const [mood, setMood] = useState<number | undefined>(entry?.data.mood);
	const [confirming, setConfirming] = useState(false);
	const [problem, setProblem] = useState<string | null>(null);
	const [question1, question2, question3] = questions(informal);
	const dayWord = (value: string) =>
		day === today ? value : value.replace('heute', 'an diesem Tag').replace('heutigen Tag', 'Tag');

	const save = () => {
		if (!text.trim() && !mood) {
			setProblem(
				tx(
					informal,
					'Bitte schreiben Sie etwas auf oder bewerten Sie den Tag.',
					'Bitte schreib etwas auf oder bewerte den Tag.'
				)
			);
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
			<BackButton onClick={onClose}>zurück zur Übersicht</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{formatDayLong(day)}</Headline>
					<div>
						<p className="bt-title">{dayWord(question1 ?? '')}</p>
						<p className="bt-title">{dayWord(question2 ?? '')}</p>
						<p className="bt-title">{question3}</p>
					</div>
					<Textarea
						id="relatives-diary-text"
						label="Tagebucheintrag"
						value={text}
						minRows={8}
						maxLength={MAX_TEXT_LENGTH}
						onChange={setText}
						helperText={`${text.length} / ${MAX_TEXT_LENGTH}`}
					/>
					<MoodPicker
						legend={dayWord(moodQuestion(informal))}
						name={`mood-${day}`}
						value={mood}
						onChange={setMood}
					/>
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{problem}
						</p>
					)}
					<div className="bt-row bt-row--between">
						<div className="bt-row">
							<Button onClick={save}>Eintrag speichern</Button>
							<Button variant="tertiary" onClick={onClose}>
								zurück zur Übersicht
							</Button>
						</div>
						{entry && !confirming && (
							<Button variant="tertiary" onClick={() => setConfirming(true)}>
								Eintrag löschen
							</Button>
						)}
					</div>
					{confirming && (
						<div className="bt-confirm" role="alertdialog" aria-label="Eintrag löschen">
							<span style={{ flex: 1 }}>Diesen Tagebucheintrag löschen?</span>
							<Button
								onClick={() => {
									void store.removeKeyed(ENTRY_KIND, day);
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
				</div>
			</Card>
		</div>
	);
}
