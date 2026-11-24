import { Button, Card, Headline, RadioGroup, Textarea } from '@oriso/web-kit';
import { useState } from 'react';
import { formatDayLong } from '../../../../shared/days.ts';
import {
	consumedOn,
	MAX_TEXT_LENGTH,
	phasesOn,
	summaryKey,
	type TopicId
} from '../../../../shared/tools/consumption-diary.ts';
import { useI18n } from '../../host.ts';
import { BackButton, Icon } from '../../ui.tsx';
import type { DiaryActions } from './ConsumptionClient.tsx';
import { PhaseSnippet } from './parts.tsx';

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
	const { m, t, lang } = useI18n();
	const texts = m.consumptionDiary;
	const { diary, today, store } = actions;
	const text = texts.topics[topic];
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
			<BackButton onClick={() => actions.go({ name: 'week' })}>{texts.day.back}</BackButton>
			<Card>
				<div className="bt-stack">
					<div>
						<p className="bt-overline">{t(texts.day.overline, { topic: text.label })}</p>
						<Headline level={3}>{formatDayLong(day, lang)}</Headline>
					</div>
					<RadioGroup
						label={isToday ? text.dayQuestion : text.pastDayQuestion}
						value={consumed === null ? '' : consumed ? 'yes' : 'no'}
						options={[
							{ value: 'no', label: texts.no },
							{ value: 'yes', label: texts.yes }
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
						<div className="bt-confirm" role="alertdialog" aria-label={texts.day.deleteAll}>
							<span style={{ flex: 1 }}>{text.deleteAllQuestion}</span>
							<Button variant="tertiary" onClick={() => setAskNo(false)}>
								{texts.day.cancel}
							</Button>
							<Button
								onClick={() => {
									setAskNo(false);
									void actions.deletePhases(day, topic);
								}}
							>
								{texts.day.deleteAll}
							</Button>
						</div>
					)}
					{consumed !== null && (
						<div className="bt-stack bt-stack--tight">
							<p>{consumed ? text.yesIntro : isToday ? text.noIntro : text.pastNoIntro}</p>
							<div>
								<button
									type="button"
									className="bt-linkbtn"
									aria-expanded={more}
									onClick={() => setMore(!more)}
								>
									{consumed ? texts.day.moreAfterYes : texts.day.moreAfterNo}
								</button>
							</div>
							{more && <p className="bt-muted">{consumed ? text.yesMore : text.noMore}</p>}
						</div>
					)}
				</div>
			</Card>
			{consumed && (
				<Card>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">{texts.day.logged}</h3>
						{phases.length === 0 ? (
							<p className="bt-muted">{texts.day.noPhase}</p>
						) : (
							<ul className="bt-list">
								{phases.map((phase) => (
									<li key={phase.id} className="bt-item">
										{deleting === phase.id ? (
											<div className="bt-row" style={{ flex: 1 }}>
												<span style={{ flex: 1 }}>{text.deletePhaseQuestion}</span>
												<Button
													onClick={() => {
														setDeleting(null);
														void store.remove(phase.id);
													}}
												>
													{texts.day.delete}
												</Button>
												<Button variant="tertiary" onClick={() => setDeleting(null)}>
													{texts.day.cancel}
												</Button>
											</div>
										) : (
											<>
												<PhaseSnippet phase={phase} />
												<button
													type="button"
													className="bt-iconbtn"
													title={texts.day.editTitle}
													aria-label={text.editPhase}
													onClick={() => actions.go({ name: 'phase', day, topic, id: phase.id })}
												>
													<Icon name="edit" />
												</button>
												<button
													type="button"
													className="bt-iconbtn"
													title={texts.day.deleteTitle}
													aria-label={text.deletePhase}
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
								{text.newPhase}
							</Button>
						</div>
					</div>
				</Card>
			)}
			{consumed !== null && (
				<Card>
					<div className="bt-stack">
						<p className="bt-overline">{texts.day.summary}</p>
						<Textarea
							id="consumption-rating"
							label={isToday ? text.ratingQuestion : text.pastRatingQuestion}
							placeholder={texts.day.ratingHint}
							value={rating}
							maxLength={MAX_TEXT_LENGTH}
							onChange={setRating}
						/>
						<Textarea
							id="consumption-plan"
							label={texts.day.planQuestion}
							placeholder={text.planHint}
							value={plan}
							maxLength={MAX_TEXT_LENGTH}
							onChange={setPlan}
						/>
						<div>
							<Button onClick={finish}>{consumed ? texts.day.done : texts.day.save}</Button>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}
