import { Card } from '@oriso/web-kit';
import type { ReactNode } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	isPrinted,
	itemsOf,
	keyedOf,
	OTHER_STRATEGIES_KIND,
	REQUEST_KIND,
	SECTION_NUMBERS,
	SELF_HELP_KIND,
	SELF_HELP_REQUEST_KEY,
	trustedOf,
	type ListKind
} from '../../../../shared/tools/emergency-kit.ts';
import { difficultyOf, situationsOf } from '../../../../shared/tools/risk-situations.ts';
import { useI18n } from '../../host.ts';
import { Pill } from '../../ui.tsx';
import type { CounsellorViewProps } from '../types.ts';
import { ImportanceLabel } from './parts.tsx';

type IsNew = (entry: Entry) => boolean;

function Tile({
	number,
	title,
	fresh,
	children
}: {
	number: number;
	title: string;
	fresh: boolean;
	children: ReactNode;
}) {
	const { m } = useI18n();
	return (
		<Card>
			<section className="bt-stack bt-stack--tight" aria-label={title}>
				<div className="bt-row bt-row--between" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
					<h3 className="bt-title">
						{number}. {title}
					</h3>
					{fresh && <Pill tone="new">{m.emergencyKit.new}</Pill>}
				</div>
				{children}
			</section>
		</Card>
	);
}

function Line({ entry, isNew, children }: { entry: Entry; isNew: IsNew; children: ReactNode }) {
	const { m } = useI18n();
	const fresh = isNew(entry);
	return (
		<li className={`bt-item${fresh ? ' bt-entry--new' : ''}`}>
			<span className="bt-item__text">{children}</span>
			{fresh && <Pill tone="new">{m.emergencyKit.new}</Pill>}
		</li>
	);
}

function Empty() {
	return <p className="bt-muted bt-small">{useI18n().m.emergencyKit.noEntries}</p>;
}

function ListTile({ kind, entries, isNew }: { kind: ListKind; entries: Entry[]; isNew: IsNew }) {
	const section = useI18n().m.emergencyKit.sections[kind];
	const items = itemsOf(entries, kind);
	return (
		<Tile
			number={SECTION_NUMBERS[kind]}
			title={section.title}
			fresh={items.some((item) => isNew(item.entry))}
		>
			<p className="bt-muted bt-small">{section.listLabel}</p>
			{items.length === 0 ? (
				<Empty />
			) : (
				<ul className="bt-list">
					{items.map((item) => (
						<Line key={item.id} entry={item.entry} isNew={isNew}>
							{item.text} {kind === 'motivation' && <ImportanceLabel value={item.importance} />}
						</Line>
					))}
				</ul>
			)}
		</Tile>
	);
}

/** Read only: the sections of the Notfallkoffer as tiles, with "neu" on what the counsellor has not seen. */
export function KitCounsellor({ entries, isNew, linked }: CounsellorViewProps) {
	const { m, t, date } = useI18n();
	const texts = m.emergencyKit;
	const trusted = trustedOf(entries);
	const selfHelp = keyedOf(entries, SELF_HELP_KIND);
	const request = keyedOf(entries, REQUEST_KIND, SELF_HELP_REQUEST_KEY);
	const other = keyedOf(entries, OTHER_STRATEGIES_KIND);
	const risks = linked['risk-situations'];
	const printed = risks ? situationsOf(risks).filter((risk) => isPrinted(entries, risk.id)) : [];
	const supportEntries = [...trusted.map((person) => person.entry), selfHelp, request].filter(
		(entry): entry is Entry => Boolean(entry)
	);

	return (
		<div className="bt-kit">
			<ListTile kind="motivation" entries={entries} isNew={isNew} />
			<ListTile kind="strategy" entries={entries} isNew={isNew} />
			<Tile
				number={SECTION_NUMBERS.support}
				title={texts.sections.support.title}
				fresh={supportEntries.some(isNew)}
			>
				<strong className="bt-small">{texts.trusted}</strong>
				{trusted.length === 0 ? (
					<Empty />
				) : (
					<ul className="bt-list">
						{trusted.map((person) => (
							<Line key={person.id} entry={person.entry} isNew={isNew}>
								{person.name}
							</Line>
						))}
					</ul>
				)}
				<strong className="bt-small">{texts.selfHelp}</strong>
				{selfHelp ? <p className="bt-pre">{(selfHelp.data as { text: string }).text}</p> : <Empty />}
				{request && (
					<p className="bt-small">
						<Pill tone="shared">{texts.requestWanted}</Pill>{' '}
						{t(texts.requestSince, { date: date(request.createdAt) })}
					</p>
				)}
			</Tile>
			<ListTile kind="critical" entries={entries} isNew={isNew} />
			<ListTile kind="craving" entries={entries} isNew={isNew} />
			{(risks || other) && (
				<Tile
					number={SECTION_NUMBERS.risks}
					title={texts.sections.risks.title}
					fresh={Boolean(other && isNew(other))}
				>
					{risks ? (
						printed.length === 0 ? (
							<p className="bt-muted bt-small">{texts.noPrintedRisks}</p>
						) : (
							<ul className="bt-list">
								{printed.map((risk) => {
									const difficulty = difficultyOf(risk.difficulty);
									return (
										<li key={risk.id} className="bt-item">
											<dl className="bt-details bt-item__text">
												<dt>{texts.riskSituation}</dt>
												<dd>{risk.situation}</dd>
												{difficulty && (
													<>
														<dt>{texts.rating}</dt>
														<dd>{m.riskSituations.difficulty[difficulty.value]}</dd>
													</>
												)}
												<dt>{texts.controlStrategy}</dt>
												<dd>{risk.strategy || '–'}</dd>
											</dl>
										</li>
									);
								})}
							</ul>
						)
					) : (
						<p className="bt-muted bt-small">{texts.risksOnlyShared}</p>
					)}
					<strong className="bt-small">{texts.otherStrategies}</strong>
					{other ? <p className="bt-pre">{(other.data as { text: string }).text}</p> : <Empty />}
				</Tile>
			)}
			<ListTile kind="relapse" entries={entries} isNew={isNew} />
		</div>
	);
}
