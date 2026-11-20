export const TOOL_IDS = [
	'goals',
	'consumption-diary',
	'relatives-diary',
	'balance',
	'emergency-kit',
	'active',
	'risk-situations',
	'traffic-light',
	'positive-perception'
] as const;

export type ToolId = (typeof TOOL_IDS)[number];

export type Audience = 'affected' | 'relatives' | 'parents';

export interface ToolInfo {
	id: ToolId;
	title: { de: string; en: string };
	/** Shown under the tile for counsellors and clients (delphi's "Anzeigetexte der Tools"). */
	description: string;
	audience: Audience[];
}

/**
 * All tools of the add-on in delphi's order of priority. Only tools with a module on both sides are
 * offered; the others are listed here so their order and texts are settled.
 */
export const CATALOG: ToolInfo[] = [
	{
		id: 'goals',
		title: { de: 'Ausgangssituation und Ziele', en: 'Starting point and goals' },
		description:
			'Dieses Tool ermöglicht es, die aktuelle Situation in eigenen Worten zu beschreiben und ein konkretes Ziel für die Beratung zu benennen. Die genaue Benennung des persönlichen Ziels hilft Betroffenen dabei, an einer Verbesserung ihrer Situation zu arbeiten. Gleichzeitig bekommt die Beraterin / der Berater mehr Möglichkeiten und Ansatzpunkte, um den Beratungsprozess angemessen zu gestalten. Das persönliche Ziel kann im Laufe der Beratung angepasst werden.',
		audience: ['affected', 'relatives']
	},
	{
		id: 'consumption-diary',
		title: { de: 'Konsumtagebuch', en: 'Consumption diary' },
		description:
			'Im Konsumtagebuch können Betroffene ihr Konsum- und/oder Glücksspielverhalten dokumentieren. Dazu gehören Häufigkeit, Menge und Dauer des Konsums oder Glücksspielens, aber auch Gedanken und Gefühle, die mit dem Suchtverhalten zusammenhängen. Wenn Betroffene das Tagebuch ihrer Beraterin / ihrem Berater freischalten wollen, können diese Rückmeldungen zu den Einträgen geben.',
		audience: ['affected']
	},
	{
		id: 'relatives-diary',
		title: { de: 'Tagebuch für Angehörige', en: 'Diary for relatives' },
		description:
			'Mit diesem Tagebuch haben Angehörige die Möglichkeit, die Erlebnisse des Tages anhand von drei Fragen zu reflektieren. Die Fragen helfen dabei, die eigenen Gedanken und Gefühle in Bezug auf das Suchtverhalten des Angehörigen einzuordnen und zu dokumentieren. Sofern Angehörige das Tagebuch ihrem Berater / ihrer Beraterin freischalten, können diese Rückmeldungen zu den Einträgen geben.',
		audience: ['relatives']
	},
	{
		id: 'balance',
		title: { de: 'Motivationswaage', en: 'Decisional balance' },
		description:
			'Die Motivationswaage hilft Betroffenen, Vor- und Nachteile der Überwindung des Suchtverhaltens abzuwägen und zu gewichten. Damit können Unsicherheiten und Bedenken aufgedeckt und klarere Entscheidungen getroffen werden. Sofern Betroffene wollen, können sie ihrer Beraterin / ihrem Berater Einblick in ihre Notizen geben, sodass diese gezielt auf die individuellen Abwägungen eingehen können.',
		audience: ['affected']
	},
	{
		id: 'emergency-kit',
		title: { de: 'Notfallkoffer', en: 'Emergency kit' },
		description:
			'Mit diesem Tool können Betroffene ihren persönlichen Notfallkoffer zusammenstellen, der ihnen dabei hilft, in besonders kritischen Situationen einen Rückfall zu vermeiden. Im Notfallkoffer können Kontaktadressen von Berater:innen oder Angehörigen sowie konkrete Handlungsanweisungen und Merksätze hinterlegt werden.',
		audience: ['affected']
	},
	{
		id: 'active',
		title: { de: 'Aktiv sein', en: 'Being active' },
		description:
			'Dieses Tool ermöglicht es Betroffenen, ihren Alltag mit Hilfe von angenehmen Aktivitäten positiv zu gestalten, um die Lebensqualität zu verbessern und den Suchtdruck zu verringern. Aktivitäten können selbst eingetragen oder aus einer Liste mit Vorschlägen gewählt und sowohl einmalig als auch regelmäßig geplant werden.',
		audience: ['affected', 'relatives']
	},
	{
		id: 'risk-situations',
		title: { de: 'Risikosituationen und Kontrollstrategien', en: 'Risk situations and control strategies' },
		description:
			'Mit diesem Tool können sich Betroffene gezielt mit ihren persönlichen Risikosituationen auseinandersetzen und geeignete Kontrollstrategien erarbeiten. Sollten Rückfälle passieren, können diese dokumentiert und die Strategien überarbeitet werden. Sofern Betroffene wollen, können sie ihre Notizen ihrer Beraterin / ihrem Berater zugänglich machen, sodass diese gezielt auf die Risikosituationen und Kontrollstrategien eingehen können.',
		audience: ['affected']
	},
	{
		id: 'traffic-light',
		title: { de: 'Ampelmodell', en: 'Traffic light model' },
		description:
			'Das Ampelmodell hilft Betroffenen dabei, die persönliche Gefahr einzelner Medienaktivitäten einzuschätzen und ihre Konsumkompetenz zu stärken. Einzelne Medienaktivitäten können, analog zu einer Ampel, in „grüne“ (unbedenkliche), „gelbe“ (riskante) und „rote“ (sehr riskante) Aktivitäten eingeordnet werden.',
		audience: ['affected']
	},
	{
		id: 'positive-perception',
		title: { de: 'Positives Wahrnehmen', en: 'Positive perception' },
		description:
			'Dieses Tool hilft Eltern, positive Aspekte im Verhalten ihres Kindes bewusster wahrzunehmen, um die Interaktion und Kommunikation mit ihrem Kind zu verbessern. Es informiert über Risiken negativer Kommunikation und über den Einfluss von positiven Verstärkern auf die Gefühle und das Verhalten des Kindes. Eltern können den eigenen Einsatz von Lob reflektieren und positive Kommunikation planen.',
		audience: ['parents']
	}
];

export const toolInfo = (id: string): ToolInfo | undefined => CATALOG.find((tool) => tool.id === id);

export const isToolId = (id: string): id is ToolId => (TOOL_IDS as readonly string[]).includes(id);

/** Key of a tool in the flat settings object, e.g. `consumption-diary` → `consumptionDiary`. */
export const settingsKey = (id: ToolId): string =>
	id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
