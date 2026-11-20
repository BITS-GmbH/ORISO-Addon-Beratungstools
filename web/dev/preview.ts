// Local preview without ORISO: `npm run db:up`, then `npm run preview` and open the printed URL.
// Runs the real API against the compose MariaDB with locally signed tokens and a host stand-in,
// and serves the UI with Vite; React and a kit stand-in come from this page instead of the host.
import { generateKeyPairSync, sign } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { addDays } from '../../shared/days.ts';
import { buildApp } from '../../server/src/app.ts';
import type { Claims } from '../../server/src/auth.ts';
import { createVerifier } from '../../server/src/auth.ts';
import { NAME } from '../../server/src/core/manifest.ts';
import { migrate } from '../../server/src/db/migrate.ts';
import { openPool } from '../../server/src/db/pool.ts';
import type { Host, HostNotification } from '../../server/src/host.ts';
import { Store } from '../../server/src/store.ts';
import { TOOLS } from '../../server/src/tools/index.ts';

const API_PORT = Number(process.env.API_PORT ?? 8091);
const UI_PORT = Number(process.env.PORT ?? 5179);
const databaseUrl =
	process.env.DATABASE_URL ?? 'mariadb://beratungstools:beratungstools@127.0.0.1:3307/beratungstools';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwks = { keys: [{ ...publicKey.export({ format: 'jwk' }), kid: 'preview', alg: 'RS256' }] };
const b64 = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
const token = (claims: Record<string, unknown>) => {
	const head = b64({ alg: 'RS256', kid: 'preview', typ: 'JWT' });
	const body = b64({
		iss: 'oriso-addonservice',
		aud: [NAME],
		exp: Math.floor(Date.now() / 1000) + 3600,
		tenantId: 1,
		...claims
	});
	return `${head}.${body}.${sign('sha256', Buffer.from(`${head}.${body}`), privateKey).toString('base64url')}`;
};

const ROLES: Record<string, Record<string, unknown>> = {
	asker: { sub: 'preview-asker', username: 'Testuser_Lorenz_02', roles: ['user'] },
	counsellor: {
		sub: 'preview-counsellor',
		username: 'Beraterin',
		roles: ['consultant'],
		askerId: 'preview-asker',
		sessionId: 4711,
		agencyId: 1
	}
};

const settings: Record<string, unknown> = {};
const log: Array<{ at: string; kind: string; text: string }> = [];
const record = (kind: string, text: string) => {
	log.unshift({ at: new Date().toISOString(), kind, text });
	log.length = Math.min(log.length, 30);
};

const host: Host = {
	settings: async () => settings,
	gates: async () => ({ dpa: { newCounsellingAllowed: true } }),
	context: async () => ({
		sessions: [{ id: 4711, agencyId: 1, consultantId: 'preview-counsellor' }],
		consultants: [{ id: 'preview-counsellor', username: 'Beraterin', displayName: 'Maria Beispiel' }]
	}),
	notify: async (_claims: Claims, notification: HostNotification) => {
		record(
			`Benachrichtigung an ${notification.recipient}`,
			`${notification.title.de}: ${notification.text.de}`
		);
		return true;
	},
	audit: async (_claims, entry) => {
		record('Audit', entry.summary.de);
		return true;
	}
};

const pool = openPool(databaseUrl);
await migrate(pool);
const { app } = buildApp({
	store: new Store(pool),
	verify: createVerifier({
		jwksUrl: 'preview',
		issuer: 'oriso-addonservice',
		audience: NAME,
		fetchImpl: async () => new Response(JSON.stringify(jwks))
	}),
	host,
	tools: TOOLS,
	notifyWindowMs: 60_000
});
app.get('/dev/token', async (request) => ({
	token: token(ROLES[(request.query as { as?: string }).as ?? 'asker'] ?? {})
}));
app.get('/dev/log', async () => log);
app.put('/dev/settings', async (request) => Object.assign(settings, request.body));
app.post('/dev/reset', async () => {
	for (const table of [
		'entries',
		'shares',
		'releases',
		'seen',
		'notification_outbox',
		'notification_prefs'
	]) {
		await pool.query(`DELETE FROM ${table}`);
	}
	log.length = 0;
	return { ok: true };
});
app.post('/dev/sample', async () => {
	const call = (as: string, method: 'POST' | 'PUT', url: string, payload?: object) =>
		app.inject({
			method,
			url: `/api${url}`,
			headers: { authorization: `Bearer ${token(ROLES[as] ?? {})}` },
			...(payload ? { payload } : {})
		});
	await call('counsellor', 'POST', '/case/tools/goals/release');
	await call('counsellor', 'POST', '/case/tools/balance/release');
	await call('asker', 'PUT', '/me/tools/goals/keyed/answer/situation', {
		data: { text: 'Seit dem Umzug trinke ich fast jeden Abend, meistens zwei bis drei Bier.' }
	});
	await call('asker', 'PUT', '/me/tools/goals/keyed/answer/goal', {
		data: { text: 'Unter der Woche nichts trinken.' }
	});
	const args: Array<[string, string, number]> = [
		['A', 'Ich kann wieder klar denken.', 3],
		['A', 'Mehr Geld / weniger Schulden.', 2],
		['B', 'Der Rausch wird mir fehlen.', 2],
		['C', 'Beim Trinken habe ich meine Ruhe.', 1],
		['D', 'Es geht gesundheitlich weiter bergab.', 3]
	];
	for (const [category, text, rating] of args) {
		await call('asker', 'POST', '/me/tools/balance/entries', {
			kind: 'argument',
			data: { category, text, rating }
		});
	}
	await call('asker', 'PUT', '/me/tools/balance/keyed/conclusion/main', {
		data: { text: 'Die Vorteile überwiegen. Ich möchte es mit Unterstützung versuchen.' }
	});
	await call('asker', 'PUT', '/me/tools/balance/share', { shared: true });
	await call('counsellor', 'POST', '/case/tools/traffic-light/release');
	const activities: Array<[string, number]> = [
		['Ein Computerspiel spielen', 3],
		['Nachts durch Kurzvideos scrollen', 3],
		['Instagram', 2],
		['E-Mails schreiben', 1],
		['Online-Banking durchführen', 1]
	];
	for (const [text, level] of activities) {
		await call('asker', 'POST', '/me/tools/traffic-light/entries', {
			kind: 'activity',
			data: { text, level }
		});
	}
	await call('asker', 'PUT', '/me/tools/traffic-light/share', { shared: true });
	await call('counsellor', 'POST', '/case/tools/positive-perception/release');
	for (const text of [
		'Hat ohne Aufforderung den Abwasch erledigt.',
		'War pünktlich zum Abendessen zu Hause.'
	]) {
		await call('asker', 'POST', '/me/tools/positive-perception/entries', {
			kind: 'behaviour',
			data: { text }
		});
	}
	await call('asker', 'PUT', '/me/tools/positive-perception/share', { shared: true });

	await call('counsellor', 'POST', '/case/tools/risk-situations/release');
	await call('counsellor', 'POST', '/case/tools/emergency-kit/release');
	const situation = await call('asker', 'POST', '/me/tools/risk-situations/entries', {
		kind: 'situation',
		data: {
			situation: 'Freitagabend nach der Arbeit, wenn die Kollegen noch etwas trinken gehen.',
			difficulty: 'hard',
			strategy: 'Ich sage vorher zu Hause Bescheid, dass ich um sechs da bin.'
		}
	});
	await call('asker', 'POST', '/me/tools/risk-situations/entries', {
		kind: 'relapse',
		data: {
			situationId: situation.json().id,
			circumstances: 'Geburtstag eines Kollegen in der Kneipe gegenüber.',
			feelings: 'Ich wollte nicht als Spielverderber dastehen.',
			mainReason: 'Gruppendruck und keine Ausrede parat.',
			alternatives: 'Kurz gratulieren und mit Verweis auf einen Termin gehen.',
			previousStrategy: 'Ich gehe direkt nach Hause.',
			newStrategy: 'Ich sage vorher zu Hause Bescheid, dass ich um sechs da bin.'
		}
	});
	await call('asker', 'POST', '/me/tools/risk-situations/entries', {
		kind: 'situation',
		data: {
			situation: 'Sonntags allein zu Hause, wenn mir langweilig ist.',
			difficulty: 'medium',
			strategy: 'Ich plane den Sonntag vorher und rufe jemanden an.'
		}
	});
	for (const [kind, data] of [
		['motivation', { text: 'Endlich wieder frei sein', importance: 1 }],
		['motivation', { text: 'Meine Partnerin soll mir wieder vertrauen können', importance: 2 }],
		['strategy', { text: 'Ich treibe regelmäßig Sport' }],
		['trusted', { name: 'Anna (Schwester)' }],
		['craving', { text: 'Ich sage mir: „STOP! Hau ab von hier! Sofort!“' }],
		['relapse', { text: 'Ich gebe nicht auf!' }]
	] as const) {
		await call('asker', 'POST', '/me/tools/emergency-kit/entries', { kind, data });
	}
	await call('asker', 'PUT', '/me/tools/emergency-kit/keyed/request/self-help-group', {
		data: { requested: true }
	});
	await call('asker', 'PUT', '/me/tools/risk-situations/share', { shared: true });
	await call('asker', 'PUT', '/me/tools/emergency-kit/share', { shared: true });
	Object.assign(settings, {
		emergencyKitAgency:
			'Suchtberatung Beispielstadt\nMusterstraße 1, 12345 Beispielstadt\nTelefon 0123 456789\nOffene Sprechstunde: Di 14 bis 16 Uhr'
	});
	const today = new Date().toISOString().slice(0, 10);
	for (const tool of ['consumption-diary', 'relatives-diary', 'active']) {
		await call('counsellor', 'POST', `/case/tools/${tool}/release`);
		await call('asker', 'PUT', `/me/tools/${tool}/share`, { shared: true });
	}
	await call('asker', 'POST', '/me/tools/active/entries', {
		kind: 'activity',
		data: {
			title: 'Joggen im Park',
			date: addDays(today, -2),
			time: '07:30',
			repeat: 'weekly',
			companion: 'Marie'
		}
	});
	await call('asker', 'POST', '/me/tools/active/entries', {
		kind: 'activity',
		data: { title: 'Ins Kino gehen', date: addDays(today, 2), time: '20:00', repeat: 'none' }
	});
	await call('asker', 'PUT', '/me/tools/consumption-diary/keyed/topics/main', {
		data: { topics: ['alcohol', 'gambling'] }
	});
	const summary = (offset: number, topic: string, consumed: boolean, rating?: string) => {
		const day = addDays(today, offset);
		return call('asker', 'PUT', `/me/tools/consumption-diary/keyed/day-summary/${day}_${topic}`, {
			day,
			data: { topic, consumed, ...(rating ? { rating } : {}) }
		});
	};
	await summary(-1, 'alcohol', true, 'Nach dem Streit mehr als geplant.');
	await call('asker', 'POST', '/me/tools/consumption-diary/entries', {
		kind: 'phase',
		day: addDays(today, -1),
		data: {
			topic: 'alcohol',
			start: '19:00',
			end: '22:00',
			items: [{ drink: 'beer', size: '0,5 l', count: 3 }],
			context: 'Zu Hause',
			trigger: 'Streit'
		}
	});
	await summary(-1, 'gambling', false);
	await summary(0, 'alcohol', false, 'Abends Sport statt Bier.');
	for (const [offset, text, mood] of [
		[-2, 'Ein ruhiger Tag, wir waren zusammen einkaufen.', 4],
		[-1, 'Heute gab es wieder Streit wegen des Geldes. Ich habe versucht, ruhig zu bleiben.', 2]
	] as const) {
		const day = addDays(today, offset);
		await call('asker', 'PUT', `/me/tools/relatives-diary/keyed/entry/${day}`, { day, data: { text, mood } });
	}
	return { ok: true };
});
await app.listen({ port: API_PORT, host: '127.0.0.1' });

const vite = await createServer({
	configFile: false,
	root: fileURLToPath(new URL('..', import.meta.url)),
	resolve: { alias: { '@oriso/web-kit': fileURLToPath(new URL('./kit.tsx', import.meta.url)) } },
	server: {
		port: UI_PORT,
		proxy: Object.fromEntries(
			['/api', '/dev/token', '/dev/log', '/dev/settings', '/dev/reset', '/dev/sample'].map((path) => [
				path,
				`http://127.0.0.1:${API_PORT}`
			])
		)
	}
});
await vite.listen();
console.log(`preview on http://localhost:${UI_PORT}/dev/preview.html`);
