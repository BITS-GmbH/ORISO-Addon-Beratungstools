import { Button, Card, Headline, Textarea } from '@oriso/web-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import {
	ANSWER_KIND,
	MAX_ANSWER_LENGTH,
	STEPS,
	startMessage,
	summaryMessage,
	type Answer,
	type GoalsStep
} from '../../../../shared/tools/goals.ts';
import type { ClientViewProps } from '../types.ts';

type Screen = 'start' | 'summary' | number;
type StepId = GoalsStep['id'];

const SAVE_DELAY_MS = 800;

/** Four questions, the goal and a summary, saved automatically while the client types (section 2.1). */
export function GoalsClient({ tool, entries, store, informal, onDone }: ClientViewProps) {
	const saved = useCallback(
		(id: StepId) =>
			(entries.find((e) => e.kind === ANSWER_KIND && e.key === id)?.data as Answer | undefined)?.text ?? '',
		[entries]
	);
	const [drafts, setDrafts] = useState<Record<string, string>>(() =>
		Object.fromEntries(STEPS.map((step) => [step.id, saved(step.id)]))
	);
	const [screen, setScreen] = useState<Screen>(() =>
		STEPS.some((step) => saved(step.id)) ? 'summary' : 'start'
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
		typeof tool.options.intro === 'string' && tool.options.intro
			? tool.options.intro
			: startMessage(informal);

	if (screen === 'start') {
		return (
			<Card>
				<div className="bt-stack">
					<p className="bt-pre">{intro}</p>
					<div>
						<Button onClick={() => go(0)}>{tx(informal, 'Los geht’s', 'Los geht’s')}</Button>
					</div>
				</div>
			</Card>
		);
	}

	if (screen === 'summary') {
		return (
			<Card>
				<div className="bt-stack">
					<Headline level={3}>Zusammenfassung</Headline>
					<p>{summaryMessage(informal)}</p>
					<p className="bt-title">
						{tx(informal, 'Ihre Angaben im Überblick:', 'Deine Angaben im Überblick:')}
					</p>
					<div className="bt-summary">
						{STEPS.map((step, index) => (
							<div key={step.id}>
								<strong>{step.summary(informal)}</strong>
								<button
									type="button"
									className="bt-linkbtn"
									onClick={() => go(index)}
									aria-label={`Bearbeiten: ${step.summary(informal)}`}
								>
									Bearbeiten
								</button>
								<p
									className={`bt-pre${drafts[step.id]?.trim() ? '' : ' bt-muted'}`}
									style={{ gridColumn: '1 / -1' }}
								>
									{drafts[step.id]?.trim() || 'Noch keine Angabe'}
								</p>
							</div>
						))}
					</div>
					<div className="bt-row">
						<Button variant="secondary" onClick={() => go(0)}>
							{tx(informal, 'Von vorn durchgehen', 'Von vorn durchgehen')}
						</Button>
						<Button variant="tertiary" onClick={onDone}>
							Meine Startseite
						</Button>
					</div>
				</div>
			</Card>
		);
	}

	const step = STEPS[screen] as GoalsStep;
	const last = screen === STEPS.length - 1;
	return (
		<Card>
			<div className="bt-stack">
				<div className="bt-steps" aria-hidden>
					{STEPS.map((candidate, index) => (
						<span key={candidate.id} className={index <= screen ? 'is-done' : undefined} />
					))}
				</div>
				<div>
					<p className="bt-overline">{step.section}</p>
					<Headline level={3}>{step.title(informal)}</Headline>
				</div>
				<div className="bt-stack bt-stack--tight">
					{step.hint(informal).map((line) => (
						<p key={line} className="bt-muted">
							{line}
						</p>
					))}
				</div>
				<Textarea
					id={`goals-${step.id}`}
					label={step.summary(informal)}
					value={drafts[step.id] ?? ''}
					maxLength={MAX_ANSWER_LENGTH}
					minRows={6}
					onChange={(value) => change(step.id, value)}
					helperText={tx(
						informal,
						'Ihre Angaben werden automatisch gespeichert.',
						'Deine Angaben werden automatisch gespeichert.'
					)}
				/>
				<div className="bt-row bt-row--between">
					<Button variant="secondary" onClick={() => go(screen === 0 ? 'start' : screen - 1)}>
						Zurück
					</Button>
					<Button onClick={() => go(last ? 'summary' : screen + 1)}>
						{last ? 'Zur Zusammenfassung' : 'Weiter'}
					</Button>
				</div>
			</div>
		</Card>
	);
}
