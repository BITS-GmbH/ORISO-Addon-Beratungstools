import { tx } from '../address.ts';

export const MAX_BEHAVIOUR_LENGTH = 500;
export const MAX_BEHAVIOURS = 200;
export const BEHAVIOUR_KIND = 'behaviour';

export interface Behaviour {
	text: string;
}

export const introParagraphs = (): string[] => [
	'Auch wenn Konflikte und Streit zu jeder gesunden Beziehung dazu gehören, können Auseinandersetzungen in der Familie die Beziehung zwischen Eltern und ihren Kindern auf Dauer sehr belasten. Dies ist spätestens dann der Fall, wenn den positiven Dingen wenig oder gar keine Aufmerksamkeit mehr geschenkt wird. Häufig wird dann in der Familie nur noch über negative Aspekte geschimpft; positive Ereignisse scheinen praktisch gar nicht mehr zu existieren.',
	'Eine „negative Aufmerksamkeit“ kann dazu führen, dass wir nur noch negative Aspekte im Verhalten unserer Kinder wahrnehmen: Wenn etwas nicht funktioniert, wird dies sofort kritisiert, was gut funktioniert, nehmen wir hingegen häufig als selbstverständlich hin. Während wir negative Aspekte sofort registrieren und darauf reagieren, nehmen wir positive Aspekte vielleicht schon gar nicht mehr wahr.'
];

export const schemaIntro = (informal: boolean): string[] => [
	'Dabei ist es sinnvoll, gut funktionierende Dinge im Auge zu behalten. Die Aufmerksamkeit auf Positives fördert bei Kindern und Jugendlichen das Selbstvertrauen und den Selbstschutz. Und bereits kleine Veränderungen im Umgang miteinander können eine große Wirkung auf die Beziehung haben. Die familiäre Atmosphäre kann sich durch die Konzentration auf positive Aspekte wesentlich verbessern.',
	tx(
		informal,
		'Was negative und positive Kommentare jeweils in Ihrem Kind auslösen können, ist im folgenden Schema erläutert. Klicken Sie auf die Kommentare, um die Reaktion des Kindes sehen zu können.',
		'Was negative und positive Kommentare jeweils in deinem Kind auslösen können, ist im folgenden Schema erläutert. Klicke auf die Kommentare, um die Reaktion des Kindes sehen zu können.'
	)
];

export interface Remark {
	remark: string;
	tone: 'negative' | 'positive';
	selfImage: string;
	feeling: string;
	behaviour: string;
}

export const REMARKS: Remark[] = [
	{
		remark: 'Du stellst dich wieder total dumm an.',
		tone: 'negative',
		selfImage: 'ich bin dumm',
		feeling: 'negativ/schlecht',
		behaviour: 'wütend, lästig'
	},
	{
		remark: 'Es war ja klar, dass du das wieder vergisst.',
		tone: 'negative',
		selfImage: 'ich bin unzuverlässig',
		feeling: 'unzufrieden, Scham',
		behaviour: 'traurig, weiterhin unzuverlässig'
	},
	{
		remark: 'Wie schön, dass du das gemacht hast.',
		tone: 'positive',
		selfImage: 'ich bin nett',
		feeling: 'zufrieden',
		behaviour: 'nett, freundlich'
	},
	{
		remark: 'Wie geschickt du damit bist.',
		tone: 'positive',
		selfImage: 'ich kann was',
		feeling: 'zufrieden',
		behaviour: 'freundlich'
	}
];

export const explanationPoints = (informal: boolean): string[] => [
	'Eine „negative Aufmerksamkeit“ kann das familiäre Klima stark belasten.',
	tx(
		informal,
		'Negative Kommentare können negative Folgen für das Selbstbild und das Verhalten Ihres Kindes haben.',
		'Negative Kommentare können negative Folgen für das Selbstbild und das Verhalten deines Kindes haben.'
	),
	tx(
		informal,
		'Positive Kommentare und Lob fördern hingegen das Selbstvertrauen Ihres Kindes.',
		'Positive Kommentare und Lob fördern hingegen das Selbstvertrauen deines Kindes.'
	)
];

export const explanationClosing = (informal: boolean): string =>
	tx(
		informal,
		'Im Rahmen dieses Tools sollen diese positiven Aspekte deshalb wieder in den Vordergrund gerückt werden. Ziel ist es, durch Lob und Anerkennung den Kontakt und die Interaktion mit Ihrem Kind zu verbessern.',
		'Im Rahmen dieses Tools sollen diese positiven Aspekte deshalb wieder in den Vordergrund gerückt werden. Ziel ist es, durch Lob und Anerkennung den Kontakt und die Interaktion mit deinem Kind zu verbessern.'
	);

export const aspectsIntro = (informal: boolean): string =>
	tx(
		informal,
		'Die einfachste Art, Ihrem Kind positives Feedback zu geben, ist ein Lob oder ein Kompliment. Mit jedem Lob oder Kompliment, das Sie Ihrem Kind machen, richtet sich zudem Ihr eigener Fokus auf die positiven Handlungen Ihres Kindes. Zunächst sollten Sie deshalb überlegen, welche Verhaltensweisen Ihres Kindes erfreulich und positiv sind. Welches Verhalten, welche Aktivität Ihres Kindes könnten Sie loben?',
		'Die einfachste Art, deinem Kind positives Feedback zu geben, ist ein Lob oder ein Kompliment. Mit jedem Lob oder Kompliment, das du deinem Kind machst, richtet sich zudem dein eigener Fokus auf die positiven Handlungen deines Kindes. Zunächst solltest du deshalb überlegen, welche Verhaltensweisen deines Kindes erfreulich und positiv sind. Welches Verhalten, welche Aktivität deines Kindes könntest du loben?'
	);

export const aspectsHint = (informal: boolean): string =>
	tx(
		informal,
		'Bedenken Sie dabei: Beim Erteilen eines Kompliments geht es um ein konkretes Verhalten Ihres Kindes und nicht um seine gesamte Persönlichkeit. Vielleicht sind diese Verhaltensweisen einfache, alltägliche Dinge oder, zumindest in Ihren Augen, sogar Selbstverständlichkeiten. Sie können natürlich auch ein Verhalten oder eine Aktivität loben, die Ihrem Kind Freude bereitet. Tatsächlich ist eine Förderung solcher Aktivitäten sehr sinnvoll, um sie weiter auszubauen und so eine mögliche Alternative zum Problemverhalten (z. B. dem Computerspielen, dem Kiffen, dem Alkoholkonsum o. ä.) zu schaffen.',
		'Bedenke dabei: Beim Erteilen eines Kompliments geht es um ein konkretes Verhalten deines Kindes und nicht um seine gesamte Persönlichkeit. Vielleicht sind diese Verhaltensweisen einfache, alltägliche Dinge oder, zumindest in deinen Augen, sogar Selbstverständlichkeiten. Du kannst natürlich auch ein Verhalten oder eine Aktivität loben, die deinem Kind Freude bereitet. Tatsächlich ist eine Förderung solcher Aktivitäten sehr sinnvoll, um sie weiter auszubauen und so eine mögliche Alternative zum Problemverhalten (z. B. dem Computerspielen, dem Kiffen, dem Alkoholkonsum o. ä.) zu schaffen.'
	);

export const EXAMPLES = [
	'Hilfe im Haushalt (z. B. den Abwasch erledigt)',
	'Kleinigkeiten erledigt (z. B. Besorgung gemacht)',
	'Sportlich aktiv gewesen (oder regelmäßig sportlich aktiv)',
	'pünktlich nach Hause gekommen',
	'Hausaufgaben gemacht',
	'Eine gute Note bekommen (ggf. auch keine schlechte Note bekommen)',
	'An einen Geburtstag gedacht'
];

export const inputLabel = (informal: boolean): string =>
	tx(
		informal,
		'Bitte tragen Sie hier Verhaltensweisen und Aktivitäten Ihres Kindes ein, die Sie loben möchten:',
		'Bitte trage hier Verhaltensweisen und Aktivitäten deines Kindes ein, die du loben möchtest:'
	);
