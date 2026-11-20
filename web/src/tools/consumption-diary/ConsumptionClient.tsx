import { Button, Card, DatePicker, Headline } from '@oriso/web-kit';
import { useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import {
	addDays,
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
	startMessage,
	SUMMARY_KIND,
	summaryKey,
	TOPIC_IDS,
	TOPICS,
	TOPICS_KEY,
	TOPICS_KIND,
	type DaySummary,
	type DiaryData,
	type TopicId
} from '../../../../shared/tools/consumption-diary.ts';
import { PlannedActivities } from '../../core/PlannedActivities.tsx';
import { Switch, WeekNav } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { DayView } from './DayView.tsx';
import { YesNo } from './parts.tsx';
import { PhaseForm } from './PhaseForm.tsx';

export type Screen =
	| { name: 'week' | 'entry' | 'settings' }
	| { name: 'day'; day: string; topic: TopicId; confirmNo?: boolean }
	| { name: 'phase'; day: string; topic: TopicId; id?: string };

export interface DiaryActions {
	diary: DiaryData;
	store: ClientViewProps['store'];
	informal: boolean;
	today: string;
	/** Stores the yes/no answer and keeps the day's summary texts. */
	answer(day: string, topic: TopicId, consumed: boolean, texts?: Pick<DaySummary, 'rating' | 'plan'>): void;
	/** "Nein" on a day with phases: deletes them, then answers no. */
	deletePhases(day: string, topic: TopicId): Promise<void>;
	go(screen: Screen): void;
}

/** The consumption diary (section 2.2): topics, "Meine Woche", day overviews with phases and the day's summary. */
export function ConsumptionClient({ tool, entries, store, informal }: ClientViewProps) {
	const diary = diaryOf(entries);
	const today = localToday();
	const [screen, setScreen] = useState<Screen>(() => ({ name: diary.chosen.length ? 'week' : 'settings' }));
	const [monday, setMonday] = useState(() => weekStart(today));
	const intro =
		typeof tool.options.intro === 'string' && tool.options.intro
			? tool.options.intro
			: startMessage(informal);

	const actions: DiaryActions = {
		diary,
		store,
		informal,
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
				<nav className="bt-navtabs" aria-label="Konsumtagebuch">
					{(
						[
							['week', 'Meine Woche'],
							['entry', 'Tagebucheintrag'],
							['settings', 'Einstellungen']
						] as const
					).map(([name, label]) => (
						<button
							key={name}
							type="button"
							className="bt-navtab"
							aria-current={screen.name === name ? 'page' : undefined}
							onClick={() => setScreen({ name })}
						>
							{label}
						</button>
					))}
				</nav>
			)}
			{screen.name === 'settings' || firstUse ? (
				<TopicSettings
					key={diary.chosen.join()}
					chosen={diary.chosen}
					intro={firstUse ? intro : null}
					informal={informal}
					onSave={(topics) => {
						void store.putKeyed(TOPICS_KIND, TOPICS_KEY, { topics });
						setScreen({ name: 'week' });
					}}
				/>
			) : screen.name === 'entry' ? (
				<NewEntry
					topics={diary.chosen}
					today={today}
					onOpen={(day, topic) => setScreen({ name: 'day', day, topic })}
				/>
			) : (
				<Week
					diary={diary}
					informal={informal}
					intro={intro}
					today={today}
					monday={monday}
					onWeek={setMonday}
					onChoose={choose}
					linked={tool.linked ?? {}}
				/>
			)}
		</div>
	);
}

function TopicSettings({
	chosen,
	intro,
	informal,
	onSave
}: {
	chosen: TopicId[];
	intro: string | null;
	informal: boolean;
	onSave: (topics: TopicId[]) => void;
}) {
	const [selected, setSelected] = useState<TopicId[]>(chosen);
	const [showAll, setShowAll] = useState(chosen.length === 0);
	const [problem, setProblem] = useState(false);
	const visible = TOPIC_IDS.filter((id) => showAll || chosen.includes(id));
	return (
		<>
			{intro && (
				<Card>
					<div className="bt-stack bt-stack--tight">
						<Headline level={3}>Über das Konsumtagebuch</Headline>
						<p className="bt-pre">{intro}</p>
					</div>
				</Card>
			)}
			<Card>
				<div className="bt-stack">
					<h3 className="bt-title">Diese Themen dokumentieren:</h3>
					<div className="bt-stack bt-stack--tight">
						{visible.map((id) => (
							<div key={id} className="bt-entry">
								<Switch
									label={TOPICS[id].label}
									checked={selected.includes(id)}
									onChange={(on) => {
										setProblem(false);
										setSelected(on ? [...selected, id] : selected.filter((topic) => topic !== id));
									}}
								/>
							</div>
						))}
					</div>
					{!showAll && (
						<div>
							<button type="button" className="bt-linkbtn" onClick={() => setShowAll(true)}>
								weiteres Thema hinzufügen
							</button>
						</div>
					)}
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{tx(informal, 'Bitte wählen Sie mindestens ein Thema.', 'Bitte wähle mindestens ein Thema.')}
						</p>
					)}
					<div>
						<Button onClick={() => (selected.length ? onSave(selected) : setProblem(true))}>
							{chosen.length ? 'Speichern' : 'Tagebuch starten'}
						</Button>
					</div>
				</div>
			</Card>
		</>
	);
}

function NewEntry({
	topics,
	today,
	onOpen
}: {
	topics: TopicId[];
	today: string;
	onOpen: (day: string, topic: TopicId) => void;
}) {
	const [day, setDay] = useState(today);
	return (
		<Card>
			<div className="bt-stack">
				<Headline level={3}>Tagebucheintrag</Headline>
				<DatePicker label="Datum" value={day} max={today} onChange={(value) => setDay(value || today)} />
				<div className="bt-row">
					{topics.map((topic) => (
						<Button key={topic} variant="secondary" onClick={() => onOpen(day > today ? today : day, topic)}>
							{`${TOPICS[topic].label} Eintrag hinzufügen`}
						</Button>
					))}
				</div>
			</div>
		</Card>
	);
}

function Week({
	diary,
	informal,
	intro,
	today,
	monday,
	onWeek,
	onChoose,
	linked
}: {
	diary: DiaryData;
	informal: boolean;
	intro: string;
	today: string;
	monday: string;
	onWeek: (monday: string) => void;
	onChoose: (day: string, topic: TopicId, consumed: boolean) => void;
	linked: NonNullable<ClientViewProps['tool']['linked']>;
}) {
	const [showIntro, setShowIntro] = useState(false);
	const topics = diary.chosen;
	return (
		<Card>
			<div className="bt-stack">
				<div className="bt-row bt-row--between">
					<Headline level={3}>Meine Woche</Headline>
					<button
						type="button"
						className="bt-linkbtn"
						aria-expanded={showIntro}
						onClick={() => setShowIntro(!showIntro)}
					>
						Über das Konsumtagebuch
					</button>
				</div>
				{showIntro && <p className="bt-pre bt-muted">{intro}</p>}
				<WeekNav
					label={formatWeek(monday)}
					onPrevious={() => onWeek(addDays(monday, -7))}
					onNext={() => onWeek(addDays(monday, 7))}
					nextDisabled={addDays(monday, 7) > today}
				/>
				<div className="bt-week" style={{ ['--bt-cols' as string]: topics.length }}>
					<div className="bt-week__row bt-week__row--head" aria-hidden>
						<span />
						{topics.map((topic) => (
							<span key={topic}>{TOPICS[topic].weekQuestion(informal)}</span>
						))}
					</div>
					{weekDays(monday).map((day) => (
						<div key={day} className="bt-week__row">
							<span className={`bt-week__day${day === today ? ' is-today' : ''}`}>{formatDayShort(day)}</span>
							{topics.map((topic) => (
								<div key={topic} className="bt-week__cell">
									<span className="bt-week__topic">{TOPICS[topic].weekQuestion(informal)}</span>
									<YesNo
										label={`${formatDayShort(day)}: ${TOPICS[topic].weekQuestion(informal)}`}
										value={consumedOn(diary, day, topic)}
										disabled={day > today}
										onChange={(consumed) => onChoose(day, topic, consumed)}
									/>
								</div>
							))}
						</div>
					))}
				</div>
				<PlannedActivities linked={linked} monday={monday} />
			</div>
		</Card>
	);
}
