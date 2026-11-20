import { Button, Card, Headline, RadioGroup, Textarea } from '@oriso/web-kit';
import { useState } from 'react';
import { formatDayLong } from '../../../../shared/days.ts';
import {
	consumedOn,
	deleteQuestion,
	MAX_TEXT_LENGTH,
	phasesOn,
	planHint,
	planQuestion,
	ratingHint,
	ratingQuestion,
	summaryKey,
	TOPICS,
	type TopicId
} from '../../../../shared/tools/consumption-diary.ts';
import { BackButton, Icon } from '../../ui.tsx';
import type { DiaryActions } from './ConsumptionClient.tsx';
import { PhaseSnippet } from './parts.tsx';

const onDay = (text: string, isToday: boolean) =>
	isToday ? text : text.replace('heute ', 'an diesem Tag ').replace('den heutigen Tag', 'diesen Tag');

/** "Tagebuch | Alkohol" of one day: the yes/no answer, the phases (on yes) and the day's summary. */
export function DayView({
	day,
	topic,
	confirmNo,
	actions,
	onChoose
}: {
	day: string;
	topic: TopicId;
	confirmNo?: boolean;
	actions: DiaryActions;
	onChoose: (day: string, topic: TopicId, consumed: boolean) => void;
}) {
	const { diary, informal, today, store } = actions;
	const text = TOPICS[topic];
	const isToday = day === today;
	const consumed = consumedOn(diary, day, topic);
	const phases = phasesOn(diary, day, topic);
	const summary = diary.summaries.get(summaryKey(day, topic))?.data;
	const [rating, setRating] = useState(summary?.rating ?? '');
	const [plan, setPlan] = useState(summary?.plan ?? '');
	const [askNo, setAskNo] = useState(Boolean(confirmNo));
	const [more, setMore] = useState(false);
	const [deleting, setDeleting] = useState<string | null>(null);

	const finish = () => {
		if (consumed !== null) {
			actions.answer(day, topic, consumed, { rating: rating.trim(), plan: plan.trim() });
		}
		actions.go({ name: 'week' });
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={() => actions.go({ name: 'week' })}>Zur Wochenübersicht</BackButton>
			<Card>
				<div className="bt-stack">
					<div>
						<p className="bt-overline">Tagebuch | {text.label}</p>
						<Headline level={3}>{formatDayLong(day)}</Headline>
					</div>
					<RadioGroup
						label={onDay(text.dayQuestion(informal), isToday)}
						value={consumed === null ? '' : consumed ? 'yes' : 'no'}
						options={[
							{ value: 'no', label: 'nein' },
							{ value: 'yes', label: 'ja' }
						]}
						onChange={(value) => {
							if (value === 'no' && phases.length > 0) {
								setAskNo(true);
								return;
							}
							onChoose(day, topic, value === 'yes');
						}}
					/>
					{askNo && phases.length > 0 && (
						<div className="bt-confirm" role="alertdialog" aria-label="Einträge löschen">
							<span style={{ flex: 1 }}>{deleteQuestion(topic)}</span>
							<Button variant="tertiary" onClick={() => setAskNo(false)}>
								Abbrechen
							</Button>
							<Button
								onClick={() => {
									setAskNo(false);
									void actions.deletePhases(day, topic);
								}}
							>
								Einträge löschen
							</Button>
						</div>
					)}
					{consumed !== null && (
						<div className="bt-stack bt-stack--tight">
							<p>{consumed ? text.yesIntro(informal) : onDay(text.noIntro(informal), isToday)}</p>
							<div>
								<button
									type="button"
									className="bt-linkbtn"
									aria-expanded={more}
									onClick={() => setMore(!more)}
								>
									{consumed ? 'mehr Info' : 'Mehr Infos'}
								</button>
							</div>
							{more && (
								<p className="bt-muted">{consumed ? text.yesMore(informal) : text.noMore(informal)}</p>
							)}
						</div>
					)}
				</div>
			</Card>
			{consumed && (
				<Card>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">Für diesen Tag protokolliert:</h3>
						{phases.length === 0 ? (
							<p className="bt-muted">bisher kein Eintrag</p>
						) : (
							<ul className="bt-list">
								{phases.map((phase) => (
									<li key={phase.id} className="bt-item">
										{deleting === phase.id ? (
											<div className="bt-row" style={{ flex: 1 }}>
												<span style={{ flex: 1 }}>Diese {text.phaseName} löschen?</span>
												<Button
													onClick={() => {
														setDeleting(null);
														void store.remove(phase.id);
													}}
												>
													Löschen
												</Button>
												<Button variant="tertiary" onClick={() => setDeleting(null)}>
													Abbrechen
												</Button>
											</div>
										) : (
											<>
												<PhaseSnippet phase={phase} />
												<button
													type="button"
													className="bt-iconbtn"
													title="bearbeiten"
													aria-label={`${text.phaseName} bearbeiten`}
													onClick={() => actions.go({ name: 'phase', day, topic, id: phase.id })}
												>
													<Icon name="edit" />
												</button>
												<button
													type="button"
													className="bt-iconbtn"
													title="löschen"
													aria-label={`${text.phaseName} löschen`}
													onClick={() => setDeleting(phase.id)}
												>
													<Icon name="delete" />
												</button>
											</>
										)}
									</li>
								))}
							</ul>
						)}
						<div>
							<Button variant="secondary" onClick={() => actions.go({ name: 'phase', day, topic })}>
								{`neue ${text.phaseName} eintragen`}
							</Button>
						</div>
					</div>
				</Card>
			)}
			{consumed !== null && (
				<Card>
					<div className="bt-stack">
						<p className="bt-overline">Resümee des Tages</p>
						<Textarea
							id="consumption-rating"
							label={onDay(ratingQuestion(topic, informal), isToday)}
							placeholder={ratingHint(informal)}
							value={rating}
							maxLength={MAX_TEXT_LENGTH}
							onChange={setRating}
						/>
						<Textarea
							id="consumption-plan"
							label={planQuestion(informal)}
							placeholder={planHint(topic, informal)}
							value={plan}
							maxLength={MAX_TEXT_LENGTH}
							onChange={setPlan}
						/>
						<div>
							<Button onClick={finish}>{consumed ? 'Fertig' : 'speichern'}</Button>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}
