import { Button, Card, Headline, RadioGroup, Select, Textarea } from '@oriso/web-kit';
import { useRef, useState } from 'react';
import {
	ARGUMENT_KIND,
	CATEGORIES,
	CONCLUSION_KEY,
	CONCLUSION_KIND,
	MAX_CONCLUSION_LENGTH,
	MAX_TEXT_LENGTH,
	RATINGS,
	HALVES,
	type CategoryId,
	type Half
} from '../../../../shared/tools/balance.ts';
import { useI18n } from '../../host.ts';
import { BackButton } from '../../ui.tsx';
import type { ClientViewProps } from '../types.ts';
import {
	argumentsOf,
	conclusionOf,
	IconButton,
	MiniResult,
	ScaleCard,
	SideBadge,
	Stars,
	type Item
} from './parts.tsx';

/** The Motivationswaage as the client uses it (section 2.4): overview with scale, conclusion and lists, and the editor. */
export function BalanceClient({ tool, entries, store }: ClientViewProps) {
	const { m, t } = useI18n();
	const texts = m.balance;
	const [editing, setEditing] = useState<{ half: Half; category: CategoryId } | null>(null);
	const items = argumentsOf(entries);
	const conclusion = conclusionOf(entries);

	if (editing) {
		return (
			<Editor
				key={editing.half}
				half={editing.half}
				initialCategory={editing.category}
				items={items}
				store={store}
				onClose={() => setEditing(null)}
			/>
		);
	}
	return (
		<div className="bt-stack">
			<Intro intro={typeof tool.options.intro === 'string' ? tool.options.intro : ''} />
			<ScaleCard items={items} poles={tool.options.poles} hint={texts.workOnExerciseFirst} />
			<Conclusion
				value={(conclusion?.data as { text: string } | undefined)?.text ?? ''}
				hasArguments={items.length > 0}
				onSave={(text) =>
					text
						? store.putKeyed(CONCLUSION_KIND, CONCLUSION_KEY, { text })
						: store.removeKeyed(CONCLUSION_KIND, CONCLUSION_KEY)
				}
			/>
			{(['change', 'keep'] as const).map((half) => (
				<Card key={half}>
					<div className="bt-stack bt-stack--tight">
						<h3 className="bt-title">{texts.halves[half]}</h3>
						<div className="bt-columns">
							{HALVES[half].map((category) => {
								const list = items.filter((item) => item.category === category);
								return (
									<div key={category} className="bt-column">
										<div className="bt-row bt-row--between">
											<strong>{t(texts.categoryInHalf, { title: texts.categories[category].title })}</strong>
											<SideBadge category={category} />
										</div>
										{list.length === 0 ? (
											<p className="bt-muted bt-small">{texts.noEntriesYet}</p>
										) : (
											<ul className="bt-list">
												{list.map((item) => (
													<li key={item.id} className="bt-item">
														<span className="bt-item__text">{item.text}</span>
														<Stars rating={item.rating} />
													</li>
												))}
											</ul>
										)}
										<div>
											<button
												type="button"
												className="bt-linkbtn"
												onClick={() => setEditing({ half, category })}
											>
												{list.length ? texts.edit : texts.add}
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}

function Intro({ intro }: { intro: string }) {
	const { m, t } = useI18n();
	const texts = m.balance;
	const [open, setOpen] = useState(false);
	return (
		<Card>
			<div className="bt-stack bt-stack--tight">
				<p className="bt-pre">{intro || texts.intro}</p>
				<div>
					<button type="button" className="bt-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
						{texts.howItWorks}
					</button>
				</div>
				{open && (
					<ol className="bt-stack bt-stack--tight" style={{ paddingLeft: 20, margin: 0 }}>
						{texts.howItWorksSteps.map(({ title, text }) => (
							<li key={title}>
								<strong>{t(texts.howItWorksStep, { title })}</strong> {text}
							</li>
						))}
						<li style={{ listStyle: 'none', marginLeft: -20 }} className="bt-muted">
							{texts.howItWorksNote}
						</li>
					</ol>
				)}
			</div>
		</Card>
	);
}

function Conclusion({
	value,
	hasArguments,
	onSave
}: {
	value: string;
	hasArguments: boolean;
	onSave: (text: string) => void;
}) {
	const { m } = useI18n();
	const texts = m.balance;
	const [draft, setDraft] = useState<string | null>(null);
	const prompt = texts.conclusionPrompt;
	return (
		<Card>
			<div className="bt-stack bt-stack--tight">
				<div className="bt-row bt-row--between">
					<h3 className="bt-title">{texts.conclusionTitle}</h3>
					{hasArguments && draft === null && (
						<button type="button" className="bt-linkbtn" onClick={() => setDraft(value)}>
							{texts.edit}
						</button>
					)}
				</div>
				{!hasArguments ? (
					<p className="bt-muted">{texts.workOnExerciseFirst}</p>
				) : draft !== null ? (
					<>
						<Textarea
							label={prompt}
							value={draft}
							maxLength={MAX_CONCLUSION_LENGTH}
							minRows={4}
							onChange={setDraft}
						/>
						<div className="bt-row">
							<Button
								onClick={() => {
									onSave(draft.trim());
									setDraft(null);
								}}
							>
								{texts.saveConclusion}
							</Button>
							<Button variant="tertiary" onClick={() => setDraft(null)}>
								{m.common.cancel}
							</Button>
						</div>
					</>
				) : value ? (
					<p className="bt-pre">{value}</p>
				) : (
					<p className="bt-muted">{prompt}</p>
				)}
			</div>
		</Card>
	);
}

interface EditorProps {
	half: Half;
	initialCategory: CategoryId;
	items: Item[];
	store: ClientViewProps['store'];
	onClose: () => void;
}

function Editor({ half, initialCategory, items, store, onClose }: EditorProps) {
	const { m, t } = useI18n();
	const texts = m.balance;
	const [category, setCategory] = useState<CategoryId>(initialCategory);
	const [text, setText] = useState('');
	const [rating, setRating] = useState<string>('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [showExamples, setShowExamples] = useState(false);
	const [problem, setProblem] = useState<string | null>(null);
	const [confirming, setConfirming] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement>(null);
	const kind = texts.argumentKinds[CATEGORIES[category].kind];

	const reset = () => {
		setText('');
		setRating('');
		setEditingId(null);
		setProblem(null);
	};

	const startEdit = (item: Item) => {
		setCategory(item.category);
		setText(item.text);
		setRating(String(item.rating));
		setEditingId(item.id);
		setProblem(null);
		formRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
	};

	const submit = () => {
		if (!text.trim()) {
			setProblem(kind.missing);
			return;
		}
		if (rating === '') {
			setProblem(texts.ratingMissing);
			return;
		}
		const data = { category, text: text.trim(), rating: Number(rating) };
		void (editingId ? store.update(editingId, data) : store.create(ARGUMENT_KIND, data));
		reset();
	};

	const used = new Set(items.map((item) => item.text));
	const examples = texts.examples[category].filter((example) => !used.has(example));

	return (
		<div className="bt-stack">
			<BackButton onClick={onClose}>{texts.backToOverview}</BackButton>
			<Card>
				<div className="bt-stack" ref={formRef}>
					<Headline level={3}>{texts.halves[half]}</Headline>
					<Select
						label={texts.argumentType}
						value={category}
						options={HALVES[half].map((id) => ({
							value: id,
							label: t(texts.categoryInHalf, { title: texts.categories[id].title })
						}))}
						onChange={(value) => {
							setCategory(value as CategoryId);
							reset();
						}}
					/>
					<Textarea
						id="balance-argument"
						label={editingId ? kind.edit : kind.add}
						value={text}
						maxLength={MAX_TEXT_LENGTH}
						placeholder={kind.placeholder}
						helperText={`${text.length} / ${MAX_TEXT_LENGTH}`}
						onChange={setText}
					/>
					<div className="bt-stack bt-stack--tight">
						<div>
							<button
								type="button"
								className="bt-linkbtn"
								aria-expanded={showExamples}
								onClick={() => setShowExamples(!showExamples)}
							>
								{showExamples ? texts.hideExamples : texts.showExamples}
							</button>
						</div>
						{showExamples &&
							(examples.length ? (
								<div className="bt-chips">
									{examples.map((example) => (
										<button key={example} type="button" className="bt-chip" onClick={() => setText(example)}>
											{example}
										</button>
									))}
								</div>
							) : (
								<p className="bt-muted bt-small">{texts.allExamplesUsed}</p>
							))}
					</div>
					<RadioGroup
						label={texts.ratingQuestion}
						value={rating}
						options={RATINGS.map((option) => ({
							value: String(option.value),
							label: t(texts.ratingOption, {
								label: texts.ratings[option.id],
								stars: '★'.repeat(option.value) || '–'
							})
						}))}
						onChange={setRating}
						error={Boolean(problem) && rating === ''}
					/>
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{problem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={submit}>{editingId ? texts.saveChange : texts.addEntry}</Button>
						{editingId && (
							<Button variant="tertiary" onClick={reset}>
								{m.common.cancel}
							</Button>
						)}
					</div>
				</div>
			</Card>
			<Card>
				<MiniResult items={items} />
			</Card>
			{HALVES[half].map((id) => {
				const list = items.filter((item) => item.category === id);
				return (
					<Card key={id}>
						<div className="bt-stack bt-stack--tight">
							<div className="bt-row bt-row--between">
								<h3 className="bt-title">{texts.categories[id].listTitle}</h3>
								<SideBadge category={id} />
							</div>
							{list.length === 0 ? (
								<p className="bt-muted bt-small">{texts.noEntriesYet}</p>
							) : (
								<ul className="bt-list">
									{list.map((item) => (
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
														{m.common.cancel}
													</Button>
												</div>
											) : (
												<>
													<span className="bt-item__text">{item.text}</span>
													<Stars rating={item.rating} />
													<IconButton
														icon="edit"
														label={t(texts.editItem, { text: item.text })}
														onClick={() => startEdit(item)}
													/>
													<IconButton
														icon="delete"
														label={t(texts.deleteItem, { text: item.text })}
														onClick={() => setConfirming(item.id)}
													/>
												</>
											)}
										</li>
									))}
								</ul>
							)}
						</div>
					</Card>
				);
			})}
			<div>
				<Button variant="secondary" onClick={onClose}>
					{texts.finish}
				</Button>
			</div>
		</div>
	);
}
