import { Button, Card, DatePicker, Headline, NumberField, Select, Textarea, TextField } from '@oriso/web-kit';
import { useState } from 'react';
import type { I18n } from '../../../../shared/i18n/index.ts';
import {
	activityLabel,
	consumedOn,
	DRINKS,
	drinkOf,
	GAMES,
	itemLabel,
	MAX_COUNT,
	MAX_ITEMS,
	MAX_TEXT_LENGTH,
	MEDIA,
	PHASE_KIND,
	sizeLabel,
	type AlcoholItem,
	type CannabisItem,
	type DurationItem,
	type Phase,
	type TopicId
} from '../../../../shared/tools/consumption-diary.ts';
import { useI18n } from '../../host.ts';
import { BackButton, Icon, TimeField } from '../../ui.tsx';
import type { DiaryActions } from './ConsumptionClient.tsx';

type Item = AlcoholItem | CannabisItem | DurationItem;

/** "Konsumphase eintragen": date, times, what was consumed, where and with whom, and why. */
export function PhaseForm({
	day,
	topic,
	id,
	actions
}: {
	day: string;
	topic: TopicId;
	id?: string;
	actions: DiaryActions;
}) {
	const i18n = useI18n();
	const texts = i18n.m.consumptionDiary;
	const { diary, store, today } = actions;
	const existing = id ? diary.phases.find((phase) => phase.id === id) : undefined;
	const initial = existing?.data;
	const text = texts.topics[topic];
	const [date, setDate] = useState(existing?.day ?? day);
	const [start, setStart] = useState(initial?.start ?? '');
	const [end, setEnd] = useState(initial?.end ?? '');
	const [items, setItems] = useState<Item[]>(initial?.items ?? []);
	const [context, setContext] = useState(initial?.context ?? '');
	const [trigger, setTrigger] = useState(initial?.trigger ?? '');
	const [device, setDevice] = useState(initial?.topic === 'media' ? (initial.device ?? '') : '');
	const [pending, setPending] = useState<Item[]>([]);
	const [problem, setProblem] = useState(false);
	const back = () => actions.go({ name: 'day', day, topic });

	const save = () => {
		const all = [...items, ...pending].slice(0, MAX_ITEMS);
		if (all.length === 0) {
			setProblem(true);
			return;
		}
		const data = {
			topic,
			items: all,
			...(start ? { start } : {}),
			...(end ? { end } : {}),
			...(context.trim() ? { context: context.trim() } : {}),
			...(trigger.trim() ? { trigger: trigger.trim() } : {}),
			...(topic === 'media' && device.trim() ? { device: device.trim() } : {})
		} as Phase;
		void (existing ? store.update(existing.id, data, date) : store.create(PHASE_KIND, data, date));
		if (consumedOn(diary, date, topic) !== true) {
			actions.answer(date, topic, true);
		}
		actions.go({ name: 'day', day: date, topic });
	};

	return (
		<div className="bt-stack">
			<BackButton onClick={back}>{texts.phase.back}</BackButton>
			<Card>
				<div className="bt-stack">
					<Headline level={3}>{text.phaseTitle}</Headline>
					<div className="bt-fields">
						<DatePicker
							label={texts.phase.date}
							value={date}
							max={today}
							onChange={(value) => setDate(value || day)}
						/>
						<TimeField label={texts.phase.start} value={start} onChange={setStart} />
						<TimeField label={texts.phase.end} value={end} onChange={setEnd} />
					</div>
					<ItemEditor
						topic={topic}
						onPending={setPending}
						onAdd={(item) => {
							setProblem(false);
							setItems((list) => (list.length < MAX_ITEMS ? [...list, item] : list));
						}}
					/>
					<div className="bt-stack bt-stack--tight">
						<strong>{text.loggedLabel}</strong>
						{items.length === 0 ? (
							<p className="bt-muted bt-small">{texts.phase.nothingYet}</p>
						) : (
							<ul className="bt-list">
								{items.map((item, index) => (
									<li key={index} className="bt-item">
										<span className="bt-item__text">{itemLabel(topic, item, i18n)}</span>
										<button
											type="button"
											className="bt-iconbtn"
											title={texts.phase.deleteItem}
											aria-label={i18n.t(texts.phase.deleteItemLabel, {
												item: itemLabel(topic, item, i18n)
											})}
											onClick={() => setItems(items.filter((_, i) => i !== index))}
										>
											<Icon name="delete" />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
					{topic === 'media' && (
						<TextField
							label={texts.phase.deviceQuestion}
							value={device}
							maxLength={MAX_TEXT_LENGTH}
							onChange={setDevice}
						/>
					)}
					<Textarea
						label={text.contextQuestion}
						value={context}
						maxLength={MAX_TEXT_LENGTH}
						onChange={setContext}
					/>
					<Textarea
						label={text.triggerQuestion}
						value={trigger}
						maxLength={MAX_TEXT_LENGTH}
						onChange={setTrigger}
					/>
					{problem && (
						<p role="alert" style={{ color: 'var(--bt-error)' }}>
							{texts.phase.missingItem}
						</p>
					)}
					<div className="bt-row">
						<Button onClick={save}>{text.saveLabel}</Button>
						<Button variant="tertiary" onClick={back}>
							{texts.phase.cancel}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

const choiceOptions = (topic: 'gambling' | 'media', { m, t }: I18n) => {
	const texts = m.consumptionDiary;
	const groups = topic === 'gambling' ? GAMES : MEDIA;
	const titles: Record<string, string> = topic === 'gambling' ? texts.gameGroups : texts.mediaGroups;
	return [
		{ value: '', label: texts.phase.choose },
		...groups.flatMap((group, index) => [
			{
				value: `group-${index}`,
				label: t(texts.phase.group, { group: titles[group.id] ?? group.id }),
				disabled: true
			},
			...group.options.map((option) => ({ value: option, label: activityLabel(topic, option, m) }))
		])
	];
};

/**
 * The topic's input for one item with "eintragen". Complete but not yet added input is reported
 * as pending, so that saving the phase does not lose it.
 */
function ItemEditor({
	topic,
	onAdd,
	onPending
}: {
	topic: TopicId;
	onAdd: (item: Item) => void;
	onPending: (items: Item[]) => void;
}) {
	const i18n = useI18n();
	const texts = i18n.m.consumptionDiary;
	const [drink, setDrink] = useState('');
	const [size, setSize] = useState('');
	const [count, setCount] = useState<number | null>(1);
	const [joints, setJoints] = useState<number | null>(null);
	const [bongs, setBongs] = useState<number | null>(null);
	const [other, setOther] = useState('');
	const [activity, setActivity] = useState('');
	const [hours, setHours] = useState<number | null>(null);
	const [minutes, setMinutes] = useState<number | null>(null);

	const validCount = (value: number | null) =>
		value && value > 0 ? Math.min(Math.round(value), MAX_COUNT) : 0;

	const itemsOf = (values: {
		drink: string;
		size: string;
		count: number | null;
		joints: number | null;
		bongs: number | null;
		other: string;
		activity: string;
		hours: number | null;
		minutes: number | null;
	}): Item[] => {
		if (topic === 'alcohol') {
			return values.drink && values.size && validCount(values.count)
				? [
						{
							drink: values.drink as AlcoholItem['drink'],
							size: values.size,
							count: validCount(values.count)
						}
					]
				: [];
		}
		if (topic === 'cannabis') {
			return [
				...(validCount(values.joints) ? [{ unit: 'joint' as const, count: validCount(values.joints) }] : []),
				...(validCount(values.bongs) ? [{ unit: 'bong' as const, count: validCount(values.bongs) }] : []),
				...(values.other.trim() ? [{ unit: 'other' as const, count: 1, text: values.other.trim() }] : [])
			];
		}
		const total = Math.max(0, Math.round((values.hours ?? 0) * 60 + (values.minutes ?? 0)));
		return values.activity && total > 0
			? [{ activity: values.activity, minutes: Math.min(total, 24 * 60) }]
			: [];
	};

	const current = { drink, size, count, joints, bongs, other, activity, hours, minutes };
	const update = (patch: Partial<typeof current>) => {
		const next = { ...current, ...patch };
		setDrink(next.drink);
		setSize(next.size);
		setCount(next.count);
		setJoints(next.joints);
		setBongs(next.bongs);
		setOther(next.other);
		setActivity(next.activity);
		setHours(next.hours);
		setMinutes(next.minutes);
		onPending(itemsOf(next));
	};
	const ready = itemsOf(current);

	const add = () => {
		ready.forEach(onAdd);
		update({
			drink: '',
			size: '',
			count: 1,
			joints: null,
			bongs: null,
			other: '',
			activity: '',
			hours: null,
			minutes: null
		});
	};

	return (
		<div className="bt-stack bt-stack--tight">
			<div className="bt-fields">
				{topic === 'alcohol' && (
					<>
						<Select
							label={texts.phase.drink}
							value={drink}
							options={[
								{ value: '', label: texts.phase.choose },
								...DRINKS.map((option) => ({ value: option.id, label: texts.drinks[option.id] }))
							]}
							onChange={(value) => update({ drink: value, size: '' })}
						/>
						<Select
							label={texts.phase.size}
							value={size}
							disabled={!drink}
							options={[
								{ value: '', label: texts.phase.choose },
								...(drinkOf(drink)?.sizes ?? []).map(([value]) => ({
									value,
									label: sizeLabel(value, i18n)
								}))
							]}
							onChange={(value) => update({ size: value })}
						/>
						<NumberField
							label={texts.phase.count}
							value={count}
							min={1}
							max={MAX_COUNT}
							onChange={(value) => update({ count: value })}
						/>
					</>
				)}
				{topic === 'cannabis' && (
					<>
						<NumberField
							label={texts.phase.joints}
							value={joints}
							min={0}
							max={MAX_COUNT}
							onChange={(value) => update({ joints: value })}
						/>
						<NumberField
							label={texts.phase.bongs}
							value={bongs}
							min={0}
							max={MAX_COUNT}
							onChange={(value) => update({ bongs: value })}
						/>
						<TextField
							label={texts.phase.otherKind}
							value={other}
							maxLength={200}
							onChange={(value) => update({ other: value })}
						/>
					</>
				)}
				{(topic === 'gambling' || topic === 'media') && (
					<>
						<Select
							label={topic === 'gambling' ? texts.phase.gambling : texts.phase.media}
							value={activity}
							options={choiceOptions(topic, i18n)}
							onChange={(value) => update({ activity: value })}
						/>
						<NumberField
							label={texts.phase.hours}
							value={hours}
							min={0}
							max={24}
							onChange={(value) => update({ hours: value })}
						/>
						<NumberField
							label={texts.phase.minutes}
							value={minutes}
							min={0}
							max={59}
							onChange={(value) => update({ minutes: clampWhole(value, 0, 59) })}
						/>
					</>
				)}
			</div>
			<div>
				<Button variant="secondary" disabled={ready.length === 0} onClick={add}>
					{texts.phase.add}
				</Button>
			</div>
		</div>
	);
}

const clampWhole = (value: number | null, min: number, max: number): number | null =>
	value === null ? null : Math.min(max, Math.max(min, Math.trunc(value)));
