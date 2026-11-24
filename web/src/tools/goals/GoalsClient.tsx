import { Button, Card, Headline, Textarea } from '@oriso/web-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	ANSWER_KIND,
	MAX_ANSWER_LENGTH,
	STEP_IDS,
	type Answer,
	type StepId
} from '../../../../shared/tools/goals.ts';
import { useI18n } from '../../host.ts';
import type { ClientViewProps } from '../types.ts';

type Screen = 'start' | 'summary' | number;

const SAVE_DELAY_MS = 800;

/** Four questions, the goal and a summary, saved automatically while the client types (section 2.1). */
export function GoalsClient({ tool, entries, store, onDone }: ClientViewProps) {
	const { m, t } = useI18n();
	const texts = m.goals;
	const saved = useCallback(
		(id: StepId) =>
			(entries.find((e) => e.kind === ANSWER_KIND && e.key === id)?.data as Answer | undefined)?.text ?? '',
		[entries]
	);
	const [drafts, setDrafts] = useState<Record<string, string>>(() =>
		Object.fromEntries(STEP_IDS.map((id) => [id, saved(id)]))
	);
	const [screen, setScreen] = useState<Screen>(() =>
		STEP_IDS.some((id) => saved(id)) ? 'summary' : 'start'
	);
	const timers = useRef(new Map<StepId, ReturnType<typeof setTimeout>>());
	const latest = useRef({ drafts, saved, store });
	useEffect(() => {
		latest.current = { drafts, saved, store };
	});

	const persist = useCallback((id: StepId) => {
		timers.current.delete(id);
		const { drafts: current, saved: stored, store: entryStore } = latest.current;
		const text = (current[id] ?? '').trim();
		if (text === stored(id)) {
			return;
		}
		if (text) {
			void entryStore.putKeyed(ANSWER_KIND, id, { text });
		} else {
			void entryStore.removeKeyed(ANSWER_KIND, id);
		}
	}, []);

	const flush = useCallback(() => {
		for (const [id, timer] of timers.current) {
			clearTimeout(timer);
			persist(id);
		}
	}, [persist]);

	useEffect(() => flush, [flush]);

	const change = (id: StepId, value: string) => {
		setDrafts((previous) => ({ ...previous, [id]: value }));
		clearTimeout(timers.current.get(id));
		timers.current.set(
			id,
			setTimeout(() => persist(id), SAVE_DELAY_MS)
		);
	};

	const go = (next: Screen) => {
		flush();
		setScreen(next);
	};

	const intro =
		typeof tool.options.intro === 'string' && tool.options.intro ? tool.options.intro : texts.start;

	if (screen === 'start') {
		return (
			<Card>
				<div className="bt-stack">
					<p className="bt-pre">{intro}</p>
					<div>
						<Button onClick={() => go(0)}>{texts.startButton}</Button>
					</div>
				</div>
			</Card>
		);
	}

	if (screen === 'summary') {
		return (
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{texts.summaryTitle}</Headline>
					<p>{texts.summaryText}</p>
					<p className="bt-title">{texts.overview}</p>
					<div className="bt-summary">
						{STEP_IDS.map((id, index) => (
							<div key={id}>
								<strong>{texts.steps[id].summary}</strong>
								<button
									type="button"
									className="bt-linkbtn"
									onClick={() => go(index)}
									aria-label={t(texts.editLabel, { label: texts.steps[id].summary })}
								>
									{texts.edit}
								</button>
								<p
									className={`bt-pre${drafts[id]?.trim() ? '' : ' bt-muted'}`}
									style={{ gridColumn: '1 / -1' }}
								>
									{drafts[id]?.trim() || texts.empty}
								</p>
							</div>
						))}
					</div>
					<div className="bt-row">
						<Button variant="secondary" onClick={() => go(0)}>
							{texts.restart}
						</Button>
						<Button variant="secondary" onClick={onDone}>
							{texts.home}
						</Button>
					</div>
				</div>
			</Card>
		);
	}

	const id = STEP_IDS[screen] as StepId;
	const step = texts.steps[id];
	const last = screen === STEP_IDS.length - 1;
	return (
		<Card>
			<div className="bt-stack">
				<div className="bt-steps" aria-hidden>
					{STEP_IDS.map((candidate, index) => (
						<span key={candidate} className={index <= screen ? 'is-done' : undefined} />
					))}
				</div>
				<div>
					<p className="bt-overline">{step.section}</p>
					<Headline level={3}>{step.title}</Headline>
				</div>
				<div className="bt-stack bt-stack--tight">
					{step.hint.map((line) => (
						<p key={line} className="bt-muted">
							{line}
						</p>
					))}
				</div>
				<Textarea
					id={`goals-${id}`}
					label={step.summary}
					value={drafts[id] ?? ''}
					maxLength={MAX_ANSWER_LENGTH}
					minRows={6}
					onChange={(value) => change(id, value)}
					helperText={texts.autosave}
				/>
				<div className="bt-row bt-row--between">
					<Button variant="secondary" onClick={() => go(screen === 0 ? 'start' : screen - 1)}>
						{texts.back}
					</Button>
					<Button onClick={() => go(last ? 'summary' : screen + 1)}>
						{last ? texts.toSummary : texts.next}
					</Button>
				</div>
			</div>
		</Card>
	);
}
