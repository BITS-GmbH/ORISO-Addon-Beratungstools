import { Button, Card, Headline, Textarea } from '@oriso/web-kit';
import { useEffect, useRef, useState } from 'react';
import { tx } from '../../../../shared/address.ts';
import {
	aspectsHint,
	aspectsIntro,
	BEHAVIOUR_KIND,
	EXAMPLES,
	explanationClosing,
	explanationPoints,
	inputLabel,
	introParagraphs,
	MAX_BEHAVIOUR_LENGTH,
	REMARKS,
	schemaIntro
} from '../../../../shared/tools/positive-perception.ts';
import { Icon } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import { behavioursOf, type Item } from './parts.tsx';

const PAGES = ['Einführung', 'Komplimente machen', 'Komplimente machen', 'Positive Aspekte wahrnehmen'];
const LAST = PAGES.length - 1;

/** Positives Wahrnehmen (section 2.9): introduction, the interactive scheme, explanation and the praise list. */
export function PositivePerceptionClient({ tool, entries, store, informal, onDone }: ClientViewProps) {
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
					{PAGES.map((_, index) => (
						<span key={index} className={index <= page ? 'is-done' : undefined} />
					))}
				</div>
				<div ref={headingRef} tabIndex={-1} className="bt-focus-target">
					<p className="bt-overline">
						Seite {page + 1} von {PAGES.length}
					</p>
					<Headline level={3}>{PAGES[page] as string}</Headline>
				</div>
				{page === 0 &&
					(intro ? (
						<p className="bt-pre">{intro}</p>
					) : (
						introParagraphs().map((paragraph) => <p key={paragraph}>{paragraph}</p>)
					))}
				{page === 1 && <Scheme informal={informal} />}
				{page === 2 && <Explanation informal={informal} />}
				{page === 3 && <Aspects items={items} informal={informal} store={store} />}
				<div className="bt-row bt-row--between">
					{page > 0 ? (
						<Button variant="secondary" onClick={() => setPage(page - 1)}>
							Zurück
						</Button>
					) : (
						<span />
					)}
					<Button onClick={() => (page === LAST ? onDone() : setPage(page + 1))}>Weiter</Button>
				</div>
			</div>
		</Card>
	);
}

function Scheme({ informal }: { informal: boolean }) {
	const [active, setActive] = useState<number | null>(null);
	const chosen = active === null ? null : REMARKS[active];
	return (
		<div className="bt-stack">
			{schemaIntro(informal).map((paragraph) => (
				<p key={paragraph}>{paragraph}</p>
			))}
			<div className="bt-scheme">
				<div className="bt-stack bt-stack--tight">
					<p className="bt-title" id="bt-remarks-label">
						Bemerkung der Eltern
					</p>
					<ul className="bt-list" aria-labelledby="bt-remarks-label">
						{REMARKS.map((remark, index) => (
							<li key={remark.remark}>
								<button
									type="button"
									className={`bt-remark bt-remark--${remark.tone}`}
									aria-pressed={active === index}
									aria-controls="bt-reaction"
									onClick={() => setActive(index)}
								>
									<span className="bt-item__text">„{remark.remark}“</span>
									<span className="bt-remark__tone">
										{remark.tone === 'negative' ? 'negativ' : 'positiv'}
									</span>
								</button>
							</li>
						))}
					</ul>
				</div>
				<div id="bt-reaction" className="bt-reaction" aria-live="polite">
					{chosen ? (
						<dl className="bt-reaction__list">
							<dt>Selbstbild des Kindes</dt>
							<dd>{chosen.selfImage}</dd>
							<dt>Gefühl des Kindes</dt>
							<dd>{chosen.feeling}</dd>
							<dt>Mögliches Verhalten des Kindes</dt>
							<dd>{chosen.behaviour}</dd>
						</dl>
					) : (
						<p className="bt-muted">
							{tx(informal, 'Wählen Sie links eine Bemerkung aus.', 'Wähle links eine Bemerkung aus.')}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

function Explanation({ informal }: { informal: boolean }) {
	return (
		<div className="bt-stack">
			<ul className="bt-points">
				{explanationPoints(informal).map((point) => (
					<li key={point}>{point}</li>
				))}
			</ul>
			<p>{explanationClosing(informal)}</p>
		</div>
	);
}

function Aspects({
	items,
	informal,
	store
}: {
	items: Item[];
	informal: boolean;
	store: ClientViewProps['store'];
}) {
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
			<p>{aspectsIntro(informal)}</p>
			<div className="bt-hint">
				<button
					type="button"
					className="bt-linkbtn"
					aria-expanded={hintOpen}
					aria-controls="bt-praise-hint"
					onClick={() => setHintOpen(!hintOpen)}
				>
					{hintOpen ? 'Hinweis ausblenden' : 'Hinweis einblenden'}
				</button>
				{hintOpen && (
					<p id="bt-praise-hint" className="bt-small">
						{aspectsHint(informal)}
					</p>
				)}
			</div>
			<div className="bt-columns">
				<div className="bt-column">
					<strong>Positive Verhaltensweisen könnten sein:</strong>
					<ul className="bt-points bt-small">
						{EXAMPLES.map((example) => (
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
						label={inputLabel(informal)}
						value={text}
						maxLength={MAX_BEHAVIOUR_LENGTH}
						minRows={3}
						error={problem && !text.trim()}
						helperText={
							problem && !text.trim()
								? tx(informal, 'Bitte tragen Sie zuerst etwas ein.', 'Bitte trage zuerst etwas ein.')
								: `${text.length} / ${MAX_BEHAVIOUR_LENGTH}`
						}
						onChange={setText}
					/>
					<div className="bt-row">
						<Button type="submit">{editingId ? 'Änderung speichern' : 'Speichern'}</Button>
						{editingId && (
							<Button variant="tertiary" onClick={reset}>
								Abbrechen
							</Button>
						)}
					</div>
				</form>
			</div>
			<div className="bt-stack bt-stack--tight">
				<p className="bt-title">
					{tx(informal, 'Ihre gespeicherten Verhaltensweisen', 'Deine gespeicherten Verhaltensweisen')}
				</p>
				{items.length === 0 ? (
					<p className="bt-muted bt-small">Noch keine Einträge.</p>
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
										<span style={{ flex: 1 }}>Diesen Eintrag löschen?</span>
										<Button
											onClick={() => {
												setConfirming(null);
												if (editingId === item.id) {
													reset();
												}
												void store.remove(item.id);
											}}
										>
											Löschen
										</Button>
										<Button variant="tertiary" onClick={() => setConfirming(null)}>
											Abbrechen
										</Button>
									</div>
								) : (
									<>
										<span className="bt-item__text">{item.text}</span>
										<IconButton
											icon="edit"
											label={`Bearbeiten: ${item.text}`}
											onClick={() => {
												setText(item.text);
												setEditingId(item.id);
												setProblem(false);
												document.getElementById('positive-perception-behaviour')?.focus();
											}}
										/>
										<IconButton
											icon="delete"
											label={`Löschen: ${item.text}`}
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
	label,
	onClick
}: {
	icon: 'edit' | 'delete';
	label: string;
	onClick: () => void;
}) => (
	<button
		type="button"
		className="bt-iconbtn"
		title={label.split(':')[0]}
		aria-label={label}
		onClick={onClick}
	>
		<Icon name={icon} />
	</button>
);
