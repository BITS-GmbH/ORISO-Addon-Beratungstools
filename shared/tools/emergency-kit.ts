import type { Entry } from '../api.ts';
import { tx } from '../address.ts';

export const MAX_TEXT_LENGTH = 500;
export const MAX_NAME_LENGTH = 200;
export const MAX_LONG_TEXT_LENGTH = 2000;
export const MAX_ITEMS = 50;

export const TRUSTED_KIND = 'trusted';
export const SELF_HELP_KIND = 'self-help';
export const REQUEST_KIND = 'request';
export const RISK_PRINT_KIND = 'risk-print';
export const OTHER_STRATEGIES_KIND = 'other-strategies';
export const MAIN_KEY = 'main';
export const SELF_HELP_REQUEST_KEY = 'self-help-group';
export const NAKOS_URL = 'https://www.nakos.de/adressen/rot/';

export type ListKind = 'motivation' | 'strategy' | 'critical' | 'craving' | 'relapse';
export const LIST_KINDS: ListKind[] = ['motivation', 'strategy', 'critical', 'craving', 'relapse'];

export type SectionId = ListKind | 'support' | 'risks';

/** "Wie wichtig für mich?" of a motivation. */
export const IMPORTANCE = [
	{ value: 1, label: 'sehr wichtig' },
	{ value: 2, label: 'wichtig' }
] as const;

export const importanceLabel = (value: number): string =>
	IMPORTANCE.find((i) => i.value === value)?.label ?? '';

export interface ExampleGroup {
	label: string;
	items: string[];
}

export interface ListSection {
	id: ListKind;
	number: number;
	title: string;
	/** Heading of the entries on the overview, in the PDF and for counsellors. */
	listLabel: string;
	/** Label of the text field on the edit page. */
	fieldLabel: string;
	intro: (informal: boolean) => string;
	examples: ExampleGroup[];
	/** Shown on the business card. */
	cardTitle: string;
}

export const LIST_SECTIONS: Record<ListKind, ListSection> = {
	motivation: {
		id: 'motivation',
		number: 1,
		title: 'Meine Motivation: Darum bleibe ich dabei',
		listLabel: 'Darum will ich mein Verhalten ändern / mein Ziel erreichen:',
		fieldLabel: 'Darum will ich mein Verhalten ändern / mein Ziel erreichen',
		cardTitle: 'Darum bleibe ich dabei',
		intro: (i) =>
			tx(
				i,
				'Es gibt viele gute Gründe, warum Sie Ihr persönliches Ziel verfolgen. Tragen Sie hier die Gründe ein, die für Sie persönlich am wichtigsten sind. Dies hilft Ihnen, Ihre Entscheidung weiter zu festigen. Lesen Sie sich Ihre Gründe immer wieder durch, um sie stets präsent zu haben. Wir haben einige Beispiele für Sie zusammengetragen, an denen Sie sich orientieren können.',
				'Es gibt viele gute Gründe, warum du dein persönliches Ziel verfolgst. Trag hier die Gründe ein, die für dich persönlich am wichtigsten sind. Dies hilft dir, deine Entscheidung weiter zu festigen. Lies dir deine Gründe immer wieder durch, um sie stets präsent zu haben. Wir haben einige Beispiele für dich zusammengetragen, an denen du dich orientieren kannst.'
			),
		examples: [
			{
				label: 'Beispiele',
				items: [
					'Ich habe wieder Zeit für andere Dinge',
					'Endlich keine Schuldgefühle mehr',
					'Meine Partnerin/mein Partner soll mir wieder vertrauen können',
					'Ich will mich wieder selbst spüren',
					'Habe keine Lust, andauernd dran denken zu müssen',
					'Wenn ich so weitermache wie bisher, ist meine Beziehung am Ende',
					'Endlich wieder frei sein',
					'Ich muss meine Familie, meine Freunde, meinen Arbeitgeber nicht mehr anlügen',
					'Keine Heimlichkeiten, kein Doppelleben mehr',
					'Ich kann meinen Kindern wieder in die Augen sehen',
					'Endlich wieder Zeit und Kraft für andere Dinge',
					'Keine kriminellen Machenschaften mehr, um an Geld zu kommen',
					'Ich kann mir wieder selber in die Augen sehen',
					'Endlich keine weiteren Schulden mehr',
					'Wenn ich weitermache wie bisher, reite ich mich immer tiefer in die Probleme'
				]
			}
		]
	},
	strategy: {
		id: 'strategy',
		number: 2,
		title: 'Meine Strategien für den Alltag',
		listLabel: 'Das hilft mir, mein Ziel zu erreichen:',
		fieldLabel: 'Das hilft mir im Alltag',
		cardTitle: 'Das hilft mir im Alltag',
		intro: (i) =>
			tx(
				i,
				'Tragen Sie an dieser Stelle alles ein, was Ihnen im alltäglichen Leben hilft, Ihr Ziel zu erreichen. Hilfreich sind insbesondere einfache Verhaltensregeln, die Sie für sich selber aufstellen. Aber auch regelmäßig durchgeführte Hobbys und Aktivitäten helfen, vom Suchtdruck abzulenken, Stress abzubauen und Ihr Ziel auch langfristig zu erreichen. Anbei sind einige Beispiele aufgelistet, die Sie nutzen können.',
				'Trag an dieser Stelle alles ein, was dir im alltäglichen Leben hilft, dein Ziel zu erreichen. Hilfreich sind insbesondere einfache Verhaltensregeln, die du für dich selber aufstellst. Aber auch regelmäßig durchgeführte Hobbys und Aktivitäten helfen, vom Suchtdruck abzulenken, Stress abzubauen und dein Ziel auch langfristig zu erreichen. Anbei sind einige Beispiele aufgelistet, die du nutzen kannst.'
			),
		examples: [
			{
				label: 'Allgemein',
				items: [
					'Ich hole mir auch weiterhin Hilfe',
					'Ich gehe regelmäßig zur Selbsthilfegruppe',
					'Ich pflege meine Freundschaften',
					'Ich kümmere mich um eine aktive Freizeitgestaltung',
					'Ärger & Frust fresse ich nicht in mich rein',
					'Ich gehe auf Nummer sicher',
					'Ich meide meine Spiel-/Trinkfreunde',
					'Ich meide meinen konsumierenden Freundeskreis',
					'Ich treibe regelmäßig Sport',
					'Ich achte auf Risikosituationen und Frühwarnsignale eines möglichen Rückfalls',
					'Ich arbeite kontinuierlich an meinem Ziel, abstinent zu bleiben',
					'Ich setze mich für meine Bedürfnisse ein',
					'Ich belohne mich hin und wieder',
					'Ich gönne mir etwas Nettes',
					'Ich stelle mich meinen Problemen',
					'Ich kümmere mich um meine Schulden'
				]
			},
			{
				label: 'Glücksspiel',
				items: [
					'Ich installiere ein Programm, das den Zugang zu Online-Glücksspielseiten blockiert',
					'Ich halte mich von Spielorten fern',
					'Wenn ich eine Spielhalle sehe, wechsele ich die Straßenseite',
					'Ich mache mir klare Vorgaben, wie viel Geld ich täglich / wöchentlich ausgebe',
					'Ich gebe mein Geld bewusst für Dinge aus, die ich wirklich brauche',
					'Ich achte darauf, wie viel Bargeld ich mitnehme'
				]
			}
		]
	},
	critical: {
		id: 'critical',
		number: 4,
		title: 'Kritische Situationen, Stimmungen und Gedanken',
		listLabel: '„Innere Risikosituationen“: Hier muss ich besonders aufpassen!',
		fieldLabel: 'Situationen & Stimmungen, in denen ich aufpassen muss',
		cardTitle: 'Hier muss ich aufpassen',
		intro: (i) =>
			tx(
				i,
				'In dieser Übung lernen Sie, die Situationen, Stimmungen und Gedanken zu erkennen, in denen Sie Gefahr laufen, in alte Verhaltensmuster zurückzufallen. Man spricht hier auch von „inneren Risikosituationen“. Welche Gedanken und Stimmungen könnten Ihren Entschluss und Ihr Ziel gefährden? In welchen Situationen sollten Sie also besonders achtsam sein? Schauen Sie sich unsere Beispiele an. Viele Stimmungen oder Gedanken hängen auf den ersten Blick nur wenig mit dem eigentlichen Problemverhalten zusammen. Was sind Ihre ganz persönlichen „inneren Risikosituationen“?',
				'In dieser Übung lernst du, die Situationen, Stimmungen und Gedanken zu erkennen, in denen du Gefahr läufst, in alte Verhaltensmuster zurückzufallen. Man spricht hier auch von „inneren Risikosituationen“. Welche Gedanken und Stimmungen könnten deinen Entschluss und dein Ziel gefährden? In welchen Situationen solltest du also besonders achtsam sein? Schau dir unsere Beispiele an. Viele Stimmungen oder Gedanken hängen auf den ersten Blick nur wenig mit dem eigentlichen Problemverhalten zusammen. Was sind deine ganz persönlichen „inneren Risikosituationen“?'
			),
		examples: [
			{
				label: 'Allgemein',
				items: [
					'Wenn ich an die „guten alten Zeiten“ denke',
					'Wenn ich daran denke, dass ja nicht alles so schlecht war',
					'Wenn ich denke, „einmal ist keinmal“',
					'Wenn ich wieder mit alten Bekannten zusammen bin',
					'Wenn ich schlecht drauf bin und etwas brauche, um wieder „runterzukommen“',
					'Wenn ich Frust habe im Job oder der Beziehung',
					'Wenn alles nicht so läuft, wie ich es mir vorstelle',
					'Wenn mir langweilig ist',
					'Wenn ich Stress habe und mich entspannen will',
					'Wenn ich denke, „jetzt ist sowieso alles egal“',
					'Wenn ich leichtsinnig werde, weil ich meine, es geschafft zu haben',
					'Wenn ich denke, dass ich ja gar nicht abhängig bin',
					'Wenn ich wieder viel Streit mit meiner Partnerin/meinem Partner habe'
				]
			},
			{
				label: 'Glücksspiel',
				items: [
					'Wenn ich „nur so aus Neugier“ mal wieder spielen will',
					'Wenn ich mich für das Erreichte belohnen will, indem ich „nur ein paar Münzen“ in den Automaten stecke',
					'Wenn ich denke, meine finanziellen Probleme damit lösen zu können',
					'Wenn ich zu viel Geld bei mir trage',
					'Wenn ich Alkohol getrunken habe',
					'Wenn ich wieder häufiger ans Spielen denke',
					'Wenn ich denke, „einmal zum Casino schadet ja nicht“'
				]
			},
			{
				label: 'Alkohol',
				items: [
					'Wenn ich „nur so aus Neugier“ mal wieder trinken will',
					'Wenn ich mich für das Erreichte belohnen will, indem ich „nur ein kleines Bier“ trinke'
				]
			},
			{
				label: 'Cannabis',
				items: [
					'Wenn ich „nur so aus Neugier“ mal wieder kiffen will',
					'Wenn ich mich für das Erreichte belohnen will, indem ich „nur einmal am Joint ziehen“ will'
				]
			}
		]
	},
	craving: {
		id: 'craving',
		number: 5,
		title: 'Das hilft mir bei Craving (Suchtdruck)',
		listLabel: 'Das hilft mir, wenn ich Craving / Suchtdruck erlebe:',
		fieldLabel: 'Das hilft mir, wenn ich Craving / Suchtdruck erlebe',
		cardTitle: 'Bei Suchtdruck',
		intro: (i) =>
			tx(
				i,
				'Wer ein Suchtverhalten aufgibt, verspürt häufig über einen längeren Zeitraum immer wieder das heftige Verlangen, das alte Verhalten wieder aufzunehmen. Dieses Phänomen wird als „Craving“ (englisch für Verlangen, Gier) oder auch Suchtdruck bezeichnet. Der intensive Suchtdruck ist in der Regel nur von kurzer Dauer. Kurze „Notfall-Anweisungen“ können Ihnen in solchen Situationen helfen, den Suchtdruck zu überwinden. Die Anweisungen sollten sehr direkt und konkret (wie ein Befehl an sich selbst) formuliert sein. Sie helfen Ihnen dabei, wieder einen kühlen Kopf zu bekommen und dem Suchtdruck zu widerstehen. Achten Sie darauf, die Sätze kurz und sehr deutlich zu formulieren.',
				'Wer ein Suchtverhalten aufgibt, verspürt häufig über einen längeren Zeitraum immer wieder das heftige Verlangen, das alte Verhalten wieder aufzunehmen. Dieses Phänomen wird als „Craving“ (englisch für Verlangen, Gier) oder auch Suchtdruck bezeichnet. Der intensive Suchtdruck ist in der Regel nur von kurzer Dauer. Kurze „Notfall-Anweisungen“ können dir in solchen Situationen helfen, den Suchtdruck zu überwinden. Die Anweisungen sollten sehr direkt und konkret (wie ein Befehl an dich selbst) formuliert sein. Sie helfen dir dabei, wieder einen kühlen Kopf zu bekommen und dem Suchtdruck zu widerstehen. Achte darauf, die Sätze kurz und sehr deutlich zu formulieren.'
			),
		examples: [
			{
				label: 'Beispiele',
				items: [
					'Ich lenke mich sofort mit anderen Aktivitäten ab (mache Sport, gehe einkaufen, gehe ins Kino)',
					'Ich rufe sofort meine Vertrauensperson an',
					'Ich schreibe einen Eintrag in mein Tagebuch',
					'Ich denke daran, wie viel ich bisher erreicht habe',
					'Ich schreibe meiner Beraterin / meinem Berater eine Nachricht',
					'Ich bin stolz auf meine bisherigen Erfolge',
					'Ich rufe eine Suchtberatungsstelle an',
					'Ich gehe an einen sicheren Ort, treffe eine Vertrauensperson',
					'Ich riskiere nicht, was ich bisher erreicht habe!',
					'Ich denke daran, wie weit ich gekommen bin!',
					'Ich denke: „Lass deine Familie nicht im Stich!“',
					'Ich setze meine Beziehung nicht aufs Spiel!',
					'Ich sage mir: „STOP! Hau ab von hier! Sofort!“'
				]
			}
		]
	},
	relapse: {
		id: 'relapse',
		number: 7,
		title: 'Rückfall: Was tun?',
		listLabel: 'Das mache ich bei einem Rückfall:',
		fieldLabel: 'Das mache ich bei einem Rückfall',
		cardTitle: 'Bei einem Rückfall',
		intro: (i) =>
			tx(
				i,
				'Wenn es zu einem Rückfall kommen sollte: Keine Panik! Geben Sie Ihr Vorhaben nicht auf. Sie können aus Rückfällen lernen und Ihre Bewältigungsstrategien später entsprechend verbessern. Das wichtigste Kommando lautet jedoch zunächst STOP! Sie sollten die konkrete Situation so schnell wie möglich verlassen, um weitere Schäden zu vermeiden oder zu begrenzen. Wie möchten Sie bei einem Rückfall handeln? Was genau können Sie tun? Formulieren Sie an dieser Stelle konkrete und für Sie persönlich hilfreiche Handlungsanweisungen für diesen Fall.',
				'Wenn es zu einem Rückfall kommen sollte: Keine Panik! Gib dein Vorhaben nicht auf. Du kannst aus Rückfällen lernen und deine Bewältigungsstrategien später entsprechend verbessern. Das wichtigste Kommando lautet jedoch zunächst STOP! Du solltest die konkrete Situation so schnell wie möglich verlassen, um weitere Schäden zu vermeiden oder zu begrenzen. Wie möchtest du bei einem Rückfall handeln? Was genau kannst du tun? Formuliere an dieser Stelle konkrete und für dich persönlich hilfreiche Handlungsanweisungen für diesen Fall.'
			),
		examples: [
			{
				label: 'Beispiele',
				items: [
					'Ich höre SOFORT auf zu spielen/trinken/kiffen und akzeptiere den Kontrollverlust!',
					'Ich gehe schnellstens raus und mache mich aus dem Staub!',
					'Ich verheimliche den Rückfall nicht, sondern vertraue mich meiner Familie an',
					'Auch wenn ich mich schäme, rufe ich sofort meine Vertrauensperson an',
					'Ich hole mir Unterstützung von …',
					'Ich nehme meinen Rückfall ernst, betrachte ihn aber nicht als Katastrophe',
					'Ich nehme die Situation zum Anlass, weiter an meinem Ziel zu arbeiten',
					'Ich nutze den Rückfall, um meine Bewältigungsstrategien zu verbessern',
					'Ich gebe nicht auf!'
				]
			}
		]
	}
};

export const SUPPORT_TITLE = 'Hier bekomme ich Unterstützung';
export const RISKS_TITLE = 'Meine wichtigsten Risikosituationen & Kontrollstrategien';

/** The seven sections of the overview, in order. */
export const SECTION_ORDER: Array<{ id: SectionId; number: number; title: string }> = [
	{ id: 'motivation', number: 1, title: LIST_SECTIONS.motivation.title },
	{ id: 'strategy', number: 2, title: LIST_SECTIONS.strategy.title },
	{ id: 'support', number: 3, title: SUPPORT_TITLE },
	{ id: 'critical', number: 4, title: LIST_SECTIONS.critical.title },
	{ id: 'craving', number: 5, title: LIST_SECTIONS.craving.title },
	{ id: 'risks', number: 6, title: RISKS_TITLE },
	{ id: 'relapse', number: 7, title: LIST_SECTIONS.relapse.title }
];

export const startText = (informal: boolean): string =>
	tx(
		informal,
		'Eingefahrene Verhaltensweisen, Gewohnheiten und Denkmuster sind nur schwer abzulegen. Das gilt insbesondere bei Suchterkrankungen. Häufig braucht es enorme Anstrengung, um dem Suchtdruck (dem sogenannten „Craving“) zu widerstehen. In Ihrem persönlichen „Notfallkoffer“ sammeln Sie wichtige Informationen, die Ihnen dabei helfen, Rückfälle zu vermeiden und auf Herausforderungen vorbereitet zu sein.',
		'Eingefahrene Verhaltensweisen, Gewohnheiten und Denkmuster sind nur schwer abzulegen. Das gilt insbesondere bei Suchterkrankungen. Häufig braucht es enorme Anstrengung, um dem Suchtdruck (dem sogenannten „Craving“) zu widerstehen. In deinem persönlichen „Notfallkoffer“ sammelst du wichtige Informationen, die dir dabei helfen, Rückfälle zu vermeiden und auf Herausforderungen vorbereitet zu sein.'
	);

export const moreText = (informal: boolean): string =>
	tx(
		informal,
		'Das Risiko, in alte Gewohnheiten zurückzufallen, ist in den ersten Tagen, Wochen und Monaten besonders hoch. Ziel der Übung ist es, in schwierigen Situationen hilfreiche Strategien parat zu haben und angemessen auf Suchtdruck reagieren zu können. Nutzen Sie die Fragen und Anregungen in dieser Übung, um sich Ihre persönlichen Strategien bereitzulegen und Ihren „Notfallkoffer“ zusammenzustellen. Wenn Sie möchten, wird Ihre Beraterin / Ihr Berater Sie bei der Ausarbeitung unterstützen.',
		'Das Risiko, in alte Gewohnheiten zurückzufallen, ist in den ersten Tagen, Wochen und Monaten besonders hoch. Ziel der Übung ist es, in schwierigen Situationen hilfreiche Strategien parat zu haben und angemessen auf Suchtdruck reagieren zu können. Nutze die Fragen und Anregungen in dieser Übung, um dir deine persönlichen Strategien bereitzulegen und deinen „Notfallkoffer“ zusammenzustellen. Wenn du möchtest, wird deine Beraterin / dein Berater dich bei der Ausarbeitung unterstützen.'
	);

export const trustedIntro = (informal: boolean): string[] => [
	tx(
		informal,
		'Das Einbeziehen von Menschen aus Ihrem engen privaten Umfeld kann Sie enorm entlasten. Haben Sie bereits Personen in die Problematik eingeweiht? Dann tragen Sie Vornamen und/oder die Rolle der Personen (bspw. Freundin, Bruder, Mutter, Opa) auf Ihrer Unterstützungsliste ein.',
		'Das Einbeziehen von Menschen aus deinem engen privaten Umfeld kann dich enorm entlasten. Hast du bereits Personen in die Problematik eingeweiht? Dann trag Vornamen und/oder die Rolle der Personen (bspw. Freundin, Bruder, Mutter, Opa) auf deiner Unterstützungsliste ein.'
	),
	tx(
		informal,
		'Wenn Sie bisher niemanden eingeweiht haben, überlegen Sie, wen Sie zukünftig als Vertrauensperson einbinden könnten. Denken Sie an Ihren Freundeskreis, Ihre Familie, Ihre Nachbarn oder andere nahestehende Personen in Ihrem privaten Umfeld. Wer könnte Sie bei Ihrem Vorhaben unterstützen und in schwierigen Situationen helfen?',
		'Wenn du bisher niemanden eingeweiht hast, überlege, wen du zukünftig als Vertrauensperson einbinden könntest. Denk an deinen Freundeskreis, deine Familie, deine Nachbarn oder andere nahestehende Personen in deinem privaten Umfeld. Wer könnte dich bei deinem Vorhaben unterstützen und in schwierigen Situationen helfen?'
	)
];

export const agencyIntro = (informal: boolean): string =>
	tx(
		informal,
		'Ihre Beraterin / Ihr Berater ist nicht nur digital, sondern auch vor Ort für Sie da. Melden Sie sich telefonisch bei ihr / ihm, machen Sie einen Termin für eine Beratung vor Ort aus oder gehen Sie zur offenen Sprechstunde.',
		'Deine Beraterin / dein Berater ist nicht nur digital, sondern auch vor Ort für dich da. Melde dich telefonisch bei ihr / ihm, mach einen Termin für eine Beratung vor Ort aus oder geh zur offenen Sprechstunde.'
	);

export const selfHelpIntro = (informal: boolean): string[] => [
	'Selbsthilfegruppen ermöglichen einen Austausch von Betroffenen und auch deren Angehörigen untereinander. Das dient nicht nur der seelischen Entlastung. Mitglieder der Gruppe profitieren jeweils auch von den Erfahrungen der anderen Teilnehmenden. Selbsthilfegruppen werden über Beratungsstellen oder Selbsthilfeorganisationen organisiert.',
	tx(
		informal,
		'Ihre Beraterin / Ihr Berater hilft Ihnen bei der Suche nach passenden Angeboten vor Ort oder auch digital.',
		'Deine Beraterin / dein Berater hilft dir bei der Suche nach passenden Angeboten vor Ort oder auch digital.'
	)
];

export const nakosText = (informal: boolean): string =>
	tx(
		informal,
		'Mithilfe des folgenden Links können Sie auch selbstständig nach Informationen zu Selbsthilfegruppen in Ihrer Umgebung suchen:',
		'Mithilfe des folgenden Links kannst du auch selbstständig nach Informationen zu Selbsthilfegruppen in deiner Umgebung suchen:'
	);

export const risksIntro = (informal: boolean): string =>
	tx(
		informal,
		'Hier finden Sie alle Risikosituationen und entsprechende Kontrollstrategien, die Sie in der Übung „Risikosituationen und Kontrollstrategien“ ausgearbeitet haben. Wenn Sie im Laufe der Beratung noch andere Tricks und Strategien gelernt haben, um mit Risikosituationen erfolgreich umzugehen, können Sie diese im Textfeld unten eintragen.',
		'Hier findest du alle Risikosituationen und entsprechende Kontrollstrategien, die du in der Übung „Risikosituationen und Kontrollstrategien“ ausgearbeitet hast. Wenn du im Laufe der Beratung noch andere Tricks und Strategien gelernt hast, um mit Risikosituationen erfolgreich umzugehen, kannst du diese im Textfeld unten eintragen.'
	);

export const OTHER_STRATEGIES_LABEL =
	'Andere Strategien, die ich gelernt habe und in Zukunft bewusst einsetzen will:';

/** The pre-written message to the counsellors when the client asks for a self-help group. */
export const selfHelpRequest = (username: string) => {
	const name = username || 'Eine ratsuchende Person';
	return {
		title: { de: 'Selbsthilfegruppe angefragt', en: 'Self-help group requested' },
		text: {
			de: `${name} möchte eine Selbsthilfegruppe empfohlen bekommen. Bitte nennen Sie ${username || 'der Person'} passende Angaben (Name der Gruppe, Termin(e), Ansprechperson, Telefonnummer) zum Eintragen in die Übung „Notfallkoffer“ unter dem Punkt „Meine Selbsthilfegruppe“ und nehmen Sie für weitere Absprachen ggf. Kontakt über die Nachrichtenfunktion auf. Dies ist eine automatisch generierte Nachricht der Beratungstools.`,
			en: `${name} would like a recommendation for a self-help group (emergency kit). Please get in touch through the messages.`
		}
	};
};

export interface ListItem {
	text: string;
	importance?: number;
}

export type Item = ListItem & { id: string; entry: Entry };

export const itemsOf = (entries: Entry[], kind: ListKind): Item[] =>
	entries.filter((e) => e.kind === kind).map((e) => ({ ...(e.data as ListItem), id: e.id, entry: e }));

export const trustedOf = (entries: Entry[]): Array<{ id: string; name: string; entry: Entry }> =>
	entries
		.filter((e) => e.kind === TRUSTED_KIND)
		.map((e) => ({ name: (e.data as { name: string }).name, id: e.id, entry: e }));

export const keyedOf = (entries: Entry[], kind: string, key = MAIN_KEY): Entry | undefined =>
	entries.find((e) => e.kind === kind && e.key === key);

export const keyedText = (entries: Entry[], kind: string): string =>
	(keyedOf(entries, kind)?.data as { text?: string } | undefined)?.text ?? '';

/** "Für Ausdruck übernehmen?": a risk situation goes into the PDFs unless the client said no. */
export const isPrinted = (entries: Entry[], situationId: string): boolean =>
	(keyedOf(entries, RISK_PRINT_KIND, situationId)?.data as { print?: boolean } | undefined)?.print !== false;

/** Sections with nothing in them, for the question before the PDF of the whole kit. */
export const emptySections = (
	entries: Entry[],
	agency: string,
	risks: Array<{ id: string }> | undefined
): SectionId[] =>
	SECTION_ORDER.map((section) => section.id).filter((id) => {
		if (id === 'support') {
			return !agency && trustedOf(entries).length === 0 && !keyedText(entries, SELF_HELP_KIND);
		}
		if (id === 'risks') {
			return (
				risks !== undefined &&
				!keyedText(entries, OTHER_STRATEGIES_KIND) &&
				!risks.some((risk) => isPrinted(entries, risk.id))
			);
		}
		return itemsOf(entries, id).length === 0;
	});
