import { Card } from '@oriso/web-kit';
import type { ReactNode } from 'react';
import type { Entry } from '../../../../shared/api.ts';
import {
	isPrinted,
	itemsOf,
	keyedOf,
	LIST_SECTIONS,
	OTHER_STRATEGIES_KIND,
	OTHER_STRATEGIES_LABEL,
	REQUEST_KIND,
	RISKS_TITLE,
	SELF_HELP_KIND,
	SELF_HELP_REQUEST_KEY,
	SUPPORT_TITLE,
	trustedOf,
	type ListKind
} from '../../../../shared/tools/emergency-kit.ts';
import { difficultyOf, situationsOf } from '../../../../shared/tools/risk-situations.ts';
import { formatDate, Pill } from '../../ui.tsx';
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
	return (
		<Card>
			<section className="bt-stack bt-stack--tight" aria-label={title}>
				<div className="bt-row bt-row--between" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
					<h3 className="bt-title">
						{number}. {title}
					</h3>
					{fresh && <Pill tone="new">Neu</Pill>}
				</div>
				{children}
			</section>
		</Card>
	);
}

function Line({ entry, isNew, children }: { entry: Entry; isNew: IsNew; children: ReactNode }) {
	const fresh = isNew(entry);
	return (
		<li className={`bt-item${fresh ? ' bt-entry--new' : ''}`}>
			<span className="bt-item__text">{children}</span>
			{fresh && <Pill tone="new">Neu</Pill>}
		</li>
	);
}

const Empty = () => <p className="bt-muted bt-small">Keine Einträge.</p>;

function ListTile({ kind, entries, isNew }: { kind: ListKind; entries: Entry[]; isNew: IsNew }) {
	const section = LIST_SECTIONS[kind];
	const items = itemsOf(entries, kind);
	return (
		<Tile number={section.number} title={section.title} fresh={items.some((item) => isNew(item.entry))}>
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
export function KitCounsellor({ entries, isNew, locale, linked }: CounsellorViewProps) {
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
			<Tile number={3} title={SUPPORT_TITLE} fresh={supportEntries.some(isNew)}>
				<strong className="bt-small">Vertrauensperson(en)</strong>
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
				<strong className="bt-small">Selbsthilfegruppe</strong>
				{selfHelp ? <p className="bt-pre">{(selfHelp.data as { text: string }).text}</p> : <Empty />}
				{request && (
					<p className="bt-small">
						<Pill tone="shared">Empfehlung gewünscht</Pill> seit {formatDate(request.createdAt, locale)}
					</p>
				)}
			</Tile>
			<ListTile kind="critical" entries={entries} isNew={isNew} />
			<ListTile kind="craving" entries={entries} isNew={isNew} />
			{(risks || other) && (
				<Tile number={6} title={RISKS_TITLE} fresh={Boolean(other && isNew(other))}>
					{risks ? (
						printed.length === 0 ? (
							<p className="bt-muted bt-small">Keine Risikosituationen für den Ausdruck ausgewählt.</p>
						) : (
							<ul className="bt-list">
								{printed.map((risk) => (
									<li key={risk.id} className="bt-item">
										<span className="bt-item__text">
											<strong>{risk.situation}</strong> ({difficultyOf(risk.difficulty)?.label})
											<br />
											{risk.strategy}
										</span>
									</li>
								))}
							</ul>
						)
					) : (
						<p className="bt-muted bt-small">
							Die Risikosituationen sind nur sichtbar, solange auch „Risikosituationen und Kontrollstrategien“
							geteilt ist.
						</p>
					)}
					<strong className="bt-small">{OTHER_STRATEGIES_LABEL}</strong>
					{other ? <p className="bt-pre">{(other.data as { text: string }).text}</p> : <Empty />}
				</Tile>
			)}
			<ListTile kind="relapse" entries={entries} isNew={isNew} />
		</div>
	);
}
