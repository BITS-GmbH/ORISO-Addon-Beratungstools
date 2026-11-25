import { Button, Card, DatePicker, Headline } from '@oriso/web-kit';
import { useState } from 'react';
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
	consumedOn,
	diaryOf,
	phasesOn,
	SUMMARY_KIND,
	summaryKey,
	TOPIC_IDS,
	TOPICS_KEY,
	TOPICS_KIND,
	type DaySummary,
	type DiaryData,
	type TopicId
} from '../../../../shared/tools/consumption-diary.ts';
import { PlannedActivities } from '../../core/PlannedActivities.tsx';
import { useI18n } from '../../host.ts';
import { Icon, Switch, WeekNav } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { DayView } from './DayView.tsx';
import { PhaseSnippet, YesNo } from './parts.tsx';
import { PhaseForm } from './PhaseForm.tsx';

export type Screen =
	| { name: 'week' | 'entry' | 'settings' }
	| { name: 'day'; day: string; topic: TopicId; confirmNo?: boolean }
	| { name: 'phase'; day: string; topic: TopicId; id?: string };

export interface DiaryActions {
	diary: DiaryData;
	store: ClientViewProps['store'];
	today: string;
	/** Stores the yes/no answer and keeps the day's summary texts. */
	answer(day: string, topic: TopicId, consumed: boolean, texts?: Pick<DaySummary, 'rating' | 'plan'>): void;
	/** "Nein" on a day with phases: deletes them, then answers no. */
	deletePhases(day: string, topic: TopicId): Promise<void>;
	go(screen: Screen): void;
}

/** The consumption diary (section 2.2): topics, "Meine Woche", day overviews with phases and the day's summary. */
export function ConsumptionClient({ tool, entries, store, openTool }: ClientViewProps) {
	const { m } = useI18n();
	const texts = m.consumptionDiary;
	const diary = diaryOf(entries);
	const today = localToday();
	const [screen, setScreen] = useState<Screen>(() => ({ name: diary.chosen.length ? 'week' : 'settings' }));
	const [monday, setMonday] = useState(() => weekStart(today));
	const [entryDay, setEntryDay] = useState(today);
	const intro =
		typeof tool.options.intro === 'string' && tool.options.intro ? tool.options.intro : texts.intro;

	const actions: DiaryActions = {
		diary,
		store,
		today,
		answer(day, topic, consumed, texts) {
			const current = diary.summaries.get(summaryKey(day, topic))?.data;
			const rating = texts ? texts.rating : current?.rating;
			const plan = texts ? texts.plan : current?.plan;
			void store.putKeyed(
				SUMMARY_KIND,
				summaryKey(day, topic),
				{ topic, consumed, ...(rating ? { rating } : {}), ...(plan ? { plan } : {}) },
				day
			);
		},
		async deletePhases(day, topic) {
			for (const phase of phasesOn(diary, day, topic)) {
				await store.remove(phase.id);
			}
			actions.answer(day, topic, false);
		},
		go: setScreen
	};

	const choose = (day: string, topic: TopicId, consumed: boolean) => {
		const current = consumedOn(diary, day, topic);
		if (!consumed && phasesOn(diary, day, topic).length > 0) {
			setScreen({ name: 'day', day, topic, confirmNo: true });
			return;
		}
		if (current !== consumed) {
			actions.answer(day, topic, consumed);
		}
		setScreen({ name: 'day', day, topic });
	};

	if (screen.name === 'day') {
		return <DayView key={`${screen.day}-${screen.topic}`} {...screen} actions={actions} onChoose={choose} />;
	}
	if (screen.name === 'phase') {
		return <PhaseForm key={screen.id ?? 'new'} {...screen} actions={actions} />;
	}

	const firstUse = diary.chosen.length === 0;
	return (
		<div className="bt-stack">
			{!firstUse && (
				<nav className="bt-navtabs" aria-label={texts.nav.label}>
					{(['week', 'entry', 'settings'] as const).map((name) => (
						<button
							key={name}
							type="button"
							className="bt-navtab"
							aria-current={screen.name === name ? 'page' : undefined}
							onClick={() => setScreen({ name })}
						>
							{texts.nav[name]}
						</button>
					))}
				</nav>
			)}
			{screen.name === 'settings' || firstUse ? (
				<TopicSettings
					chosen={diary.chosen}
					intro={firstUse ? intro : null}
					onChange={(topics) => void store.putKeyed(TOPICS_KIND, TOPICS_KEY, { topics })}
					onStart={(topics) => {
						void store.putKeyed(TOPICS_KIND, TOPICS_KEY, { topics });
						setScreen({ name: 'week' });
					}}
				/>
			) : screen.name === 'entry' ? (
				<NewEntry
					diary={diary}
					today={today}
					day={entryDay}
					onDay={setEntryDay}
					onOpen={(day, topic) => setScreen({ name: 'day', day, topic })}
					onEdit={(day, topic, id) => setScreen({ name: 'phase', day, topic, id })}
				/>
			) : (
				<Week
					diary={diary}
					intro={intro}
					today={today}
					monday={monday}
					onWeek={setMonday}
					onChoose={choose}
					linked={tool.linked ?? {}}
					onPlan={openTool && (() => openTool('active'))}
				/>
			)}
		</div>
	);
}

function TopicSettings({
	chosen,
	intro,
	onChange,
	onStart
}: {
	chosen: TopicId[];
	intro: string | null;
	/** Saves right away; the diary is already in use. */
	onChange: (topics: TopicId[]) => void;
	/** First use: starts the diary with the chosen topics. */
	onStart: (topics: TopicId[]) => void;
}) {
	const { m } = useI18n();
	const texts = m.consumptionDiary;
	const [selected, setSelected] = useState<TopicId[]>(chosen);
	const firstUse = chosen.length === 0;
	const [showAll, setShowAll] = useState(firstUse);
	const [problem, setProblem] = useState(false);
	const visible = TOPIC_IDS.filter((id) => showAll || chosen.includes(id) || selected.includes(id));
	const moreTopics = visible.length < TOPIC_IDS.length;
	return (
		<>
			{intro && (
				<Card>
					<div className="bt-stack bt-stack--tight">
						<Headline level={3}>{texts.about}</Headline>
						<p className="bt-pre">{intro}</p>
					</div>
				</Card>
			)}
			<Card>
				<div className="bt-stack">
					<h3 className="bt-title">{texts.settings.title}</h3>
					<div className="bt-stack bt-stack--tight">
						{visible.map((id) => (
							<div key={id} className="bt-entry">
								<Switch
									label={texts.topics[id].label}
									checked={selected.includes(id)}
									onChange={(on) => {
										const next = on ? [...selected, id] : selected.filter((topic) => topic !== id);
										setSelected(next);
										setProblem(next.length === 0);
										if (!firstUse && next.length > 0) {
											onChange(TOPIC_IDS.filter((topic) => next.includes(topic)));
										}
									}}
								/>
							</div>
						))}
					</div>
					{moreTopics && (
						<div>
							<button type="button" className="bt-linkbtn" onClick={() => setShowAll(true)}>
								{texts.settings.addTopic}
							</button>
						</div>
					)}
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{texts.settings.pickTopic}
						</p>
					)}
					{firstUse && (
						<div>
							<Button onClick={() => (selected.length ? onStart(selected) : setProblem(true))}>
								{texts.settings.start}
							</Button>
						</div>
					)}
				</div>
			</Card>
		</>
	);
}

function NewEntry({
	diary,
	today,
	day,
	onDay,
	onOpen,
	onEdit
}: {
	diary: DiaryData;
	today: string;
	day: string;
	onDay: (day: string) => void;
	onOpen: (day: string, topic: TopicId) => void;
	onEdit: (day: string, topic: TopicId, id: string) => void;
}) {
	const i18n = useI18n();
	const { m, t } = i18n;
	const texts = m.consumptionDiary;
	const shown = day > today ? today : day;
	const logged = diary.chosen.filter((topic) => consumedOn(diary, shown, topic) !== null);
	return (
		<>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{texts.newEntry.title}</Headline>
					<DatePicker
						label={texts.newEntry.date}
						value={day}
						max={today}
						onChange={(value) => onDay(value || today)}
					/>
					<div className="bt-row">
						{diary.chosen.map((topic) => (
							<Button key={topic} variant="secondary" onClick={() => onOpen(shown, topic)}>
								{t(texts.newEntry.add, { topic: texts.topics[topic].label })}
							</Button>
						))}
					</div>
				</div>
			</Card>
			<Card>
				<div className="bt-stack bt-stack--tight">
					<h3 className="bt-title">
						{t(texts.newEntry.dayEntries, { date: formatDayLong(shown, i18n.lang) })}
					</h3>
					{logged.length === 0 ? (
						<p className="bt-muted">{texts.newEntry.none}</p>
					) : (
						logged.map((topic) => {
							const phases = phasesOn(diary, shown, topic);
							return (
								<div key={topic} className="bt-stack bt-stack--tight">
									<div className="bt-row bt-row--between">
										<strong>{texts.topics[topic].label}</strong>
										<button
											type="button"
											className="bt-linkbtn bt-small"
											onClick={() => onOpen(shown, topic)}
										>
											{texts.newEntry.openDay}
										</button>
									</div>
									{phases.length === 0 ? (
										<p className="bt-muted bt-small">{texts.newEntry.noConsumption}</p>
									) : (
										<ul className="bt-list">
											{phases.map((phase) => (
												<li key={phase.id} className="bt-item">
													<PhaseSnippet phase={phase} />
													<button
														type="button"
														className="bt-iconbtn"
														title={texts.day.editTitle}
														aria-label={texts.day.editTitle}
														onClick={() => onEdit(shown, topic, phase.id)}
													>
														<Icon name="edit" />
													</button>
												</li>
											))}
										</ul>
									)}
								</div>
							);
						})
					)}
				</div>
			</Card>
		</>
	);
}

function Week({
	diary,
	intro,
	today,
	monday,
	onWeek,
	onChoose,
	linked,
	onPlan
}: {
	diary: DiaryData;
	intro: string;
	today: string;
	monday: string;
	onWeek: (monday: string) => void;
	onChoose: (day: string, topic: TopicId, consumed: boolean) => void;
	linked: NonNullable<ClientViewProps['tool']['linked']>;
	onPlan?: () => void;
}) {
	const { m, t, lang } = useI18n();
	const texts = m.consumptionDiary;
	const [showIntro, setShowIntro] = useState(false);
	const topics = diary.chosen;
	return (
		<Card>
			<div className="bt-stack">
				<div className="bt-row bt-row--between">
					<Headline level={3}>{texts.week.title}</Headline>
					<button
						type="button"
						className="bt-linkbtn"
						aria-expanded={showIntro}
						onClick={() => setShowIntro(!showIntro)}
					>
						{texts.about}
					</button>
				</div>
				{showIntro && <p className="bt-pre bt-muted">{intro}</p>}
				<WeekNav
					label={formatWeek(monday, lang)}
					onPrevious={() => onWeek(addDays(monday, -7))}
					onNext={() => onWeek(addDays(monday, 7))}
					nextDisabled={addDays(monday, 7) > today}
				/>
				<div className="bt-week" style={{ ['--bt-cols' as string]: topics.length }}>
					<div className="bt-week__row bt-week__row--head" aria-hidden>
						<span />
						{topics.map((topic) => (
							<span key={topic}>{texts.topics[topic].weekQuestion}</span>
						))}
					</div>
					{weekDays(monday).map((day) => (
						<div key={day} className="bt-week__row">
							<span className={`bt-week__day${day === today ? ' is-today' : ''}`}>
								{formatDayShort(day, lang)}
							</span>
							{topics.map((topic) => (
								<div key={topic} className="bt-week__cell">
									<span className="bt-week__topic">{texts.topics[topic].weekQuestion}</span>
									<YesNo
										label={t(texts.week.cell, {
											day: formatDayShort(day, lang),
											question: texts.topics[topic].weekQuestion
										})}
										value={consumedOn(diary, day, topic)}
										disabled={day > today}
										onChange={(consumed) => onChoose(day, topic, consumed)}
									/>
								</div>
							))}
						</div>
					))}
				</div>
				<PlannedActivities linked={linked} monday={monday} onPlan={onPlan} />
			</div>
		</Card>
	);
}
