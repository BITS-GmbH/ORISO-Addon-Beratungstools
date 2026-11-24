import { Button, Card, Headline, Textarea } from '@oriso/web-kit';
import { useEffect, useRef, useState } from 'react';
import {
	BEHAVIOUR_KIND,
	MAX_BEHAVIOUR_LENGTH,
	REMARKS,
	type Remark
} from '../../../../shared/tools/positive-perception.ts';
import { useI18n } from '../../host.ts';
import { Icon } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { behavioursOf, type Item } from './parts.tsx';

const PAGE_COUNT = 4;
const LAST = PAGE_COUNT - 1;

/** Positives Wahrnehmen (section 2.9): introduction, the interactive scheme, explanation and the praise list. */
export function PositivePerceptionClient({ tool, entries, store, onDone }: ClientViewProps) {
	const { m, t } = useI18n();
	const texts = m.positivePerception;
	const items = behavioursOf(entries);
	const [page, setPage] = useState(() => (items.length > 0 ? LAST : 0));
	const headingRef = useRef<HTMLDivElement>(null);
	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		headingRef.current?.focus();
	}, [page]);

	const intro = typeof tool.options.intro === 'string' && tool.options.intro ? tool.options.intro : '';

	return (
		<Card>
			<div className="bt-stack">
				<div className="bt-steps" aria-hidden>
					{texts.pages.map((_, index) => (
						<span key={index} className={index <= page ? 'is-done' : undefined} />
					))}
				</div>
				<div ref={headingRef} tabIndex={-1} className="bt-focus-target">
					<p className="bt-overline">{t(texts.pageOf, { page: page + 1, count: PAGE_COUNT })}</p>
					<Headline level={3}>{texts.pages[page] as string}</Headline>
				</div>
				{page === 0 &&
					(intro ? (
						<p className="bt-pre">{intro}</p>
					) : (
						texts.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
					))}
				{page === 1 && <Scheme />}
				{page === 2 && <Explanation />}
				{page === 3 && <Aspects items={items} store={store} />}
				<div className="bt-row bt-row--between">
					{page > 0 ? (
						<Button variant="secondary" onClick={() => setPage(page - 1)}>
							{texts.back}
						</Button>
					) : (
						<span />
					)}
					<Button onClick={() => (page === LAST ? onDone() : setPage(page + 1))}>{texts.next}</Button>
				</div>
			</div>
		</Card>
	);
}

function Scheme() {
	const { m, t } = useI18n();
	const texts = m.positivePerception;
	const [active, setActive] = useState<number | null>(null);
	const chosen = active === null ? null : texts.remarks[(REMARKS[active] as Remark).id];
	return (
		<div className="bt-stack">
			{texts.schemeIntro.map((paragraph) => (
				<p key={paragraph}>{paragraph}</p>
			))}
			<div className="bt-scheme">
				<div className="bt-stack bt-stack--tight">
					<p className="bt-title" id="bt-remarks-label">
						{texts.remarksLabel}
					</p>
					<ul className="bt-list" aria-labelledby="bt-remarks-label">
						{REMARKS.map((remark, index) => (
							<li key={remark.id}>
								<button
									type="button"
									className={`bt-remark bt-remark--${remark.tone}`}
									aria-pressed={active === index}
									aria-controls="bt-reaction"
									onClick={() => setActive(index)}
								>
									<span className="bt-item__text">
										{t(texts.quotedRemark, { remark: texts.remarks[remark.id].remark })}
									</span>
									<span className="bt-remark__tone">{texts.tones[remark.tone]}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
				<div id="bt-reaction" className="bt-reaction" aria-live="polite">
					{chosen ? (
						<dl className="bt-reaction__list">
							<dt>{texts.selfImageLabel}</dt>
							<dd>{chosen.selfImage}</dd>
							<dt>{texts.feelingLabel}</dt>
							<dd>{chosen.feeling}</dd>
							<dt>{texts.behaviourLabel}</dt>
							<dd>{chosen.behaviour}</dd>
						</dl>
					) : (
						<p className="bt-muted">{texts.chooseRemark}</p>
					)}
				</div>
			</div>
		</div>
	);
}

function Explanation() {
	const texts = useI18n().m.positivePerception;
	return (
		<div className="bt-stack">
			<ul className="bt-points">
				{texts.explanationPoints.map((point) => (
					<li key={point}>{point}</li>
				))}
			</ul>
			<p>{texts.explanationClosing}</p>
		</div>
	);
}

function Aspects({ items, store }: { items: Item[]; store: ClientViewProps['store'] }) {
	const { m, t } = useI18n();
	const texts = m.positivePerception;
	const [hintOpen, setHintOpen] = useState(true);
	const [text, setText] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [confirming, setConfirming] = useState<string | null>(null);
	const [problem, setProblem] = useState(false);

	const reset = () => {
		setText('');
		setEditingId(null);
		setProblem(false);
	};

	const save = () => {
		const value = text.trim();
		if (!value) {
			setProblem(true);
			return;
		}
		void (editingId
			? store.update(editingId, { text: value })
			: store.create(BEHAVIOUR_KIND, { text: value }));
		reset();
	};

	return (
		<div className="bt-stack">
			<p>{texts.aspectsIntro}</p>
			<div className="bt-hint">
				<button
					type="button"
					className="bt-linkbtn"
					aria-expanded={hintOpen}
					aria-controls="bt-praise-hint"
					onClick={() => setHintOpen(!hintOpen)}
				>
					{hintOpen ? texts.hideHint : texts.showHint}
				</button>
				{hintOpen && (
					<p id="bt-praise-hint" className="bt-small">
						{texts.aspectsHint}
					</p>
				)}
			</div>
			<div className="bt-columns">
				<div className="bt-column">
					<strong>{texts.examplesTitle}</strong>
					<ul className="bt-points bt-small">
						{texts.examples.map((example) => (
							<li key={example}>{example}</li>
						))}
					</ul>
				</div>
				<form
					className="bt-stack bt-stack--tight"
					onSubmit={(event) => {
						event.preventDefault();
						save();
					}}
				>
					<Textarea
						id="positive-perception-behaviour"
						label={texts.inputLabel}
						value={text}
						maxLength={MAX_BEHAVIOUR_LENGTH}
						minRows={3}
						error={problem && !text.trim()}
						helperText={
							problem && !text.trim()
								? texts.emptyInput
								: t(texts.characterCount, { length: text.length, max: MAX_BEHAVIOUR_LENGTH })
						}
						onChange={setText}
					/>
					<div className="bt-row">
						<Button type="submit">{editingId ? texts.saveChange : texts.save}</Button>
						{editingId && (
							<Button variant="tertiary" onClick={reset}>
								{texts.cancel}
							</Button>
						)}
					</div>
				</form>
			</div>
			<div className="bt-stack bt-stack--tight">
				<p className="bt-title">{texts.savedTitle}</p>
				{items.length === 0 ? (
					<p className="bt-muted bt-small">{texts.noEntries}</p>
				) : (
					<ul className="bt-list">
						{items.map((item) => (
							<li
								key={item.id}
								className="bt-item"
								style={editingId === item.id ? { borderColor: 'var(--bt-primary)' } : undefined}
							>
								{confirming === item.id ? (
									<div className="bt-row" style={{ flex: 1 }}>
										<span style={{ flex: 1 }}>{texts.confirmDelete}</span>
										<Button
											onClick={() => {
												setConfirming(null);
												if (editingId === item.id) {
													reset();
												}
												void store.remove(item.id);
											}}
										>
											{texts.delete}
										</Button>
										<Button variant="tertiary" onClick={() => setConfirming(null)}>
											{texts.cancel}
										</Button>
									</div>
								) : (
									<>
										<span className="bt-item__text">{item.text}</span>
										<IconButton
											icon="edit"
											title={texts.edit}
											label={t(texts.editLabel, { text: item.text })}
											onClick={() => {
												setText(item.text);
												setEditingId(item.id);
												setProblem(false);
												document.getElementById('positive-perception-behaviour')?.focus();
											}}
										/>
										<IconButton
											icon="delete"
											title={texts.delete}
											label={t(texts.deleteLabel, { text: item.text })}
											onClick={() => setConfirming(item.id)}
										/>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

const IconButton = ({
	icon,
	title,
	label,
	onClick
}: {
	icon: 'edit' | 'delete';
	title: string;
	label: string;
	onClick: () => void;
}) => (
	<button type="button" className="bt-iconbtn" title={title} aria-label={label} onClick={onClick}>
		<Icon name={icon} />
	</button>
);
