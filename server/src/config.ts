import { fileURLToPath } from 'node:url';
import { NAME } from './core/manifest.ts';

export interface Config {
	port: number;
	databaseUrl: string;
	addonServiceUrl: string;
	issuer: string;
	uiDir: string;
	notifyWindowMs: number;
	timeZone: string;
	/** Other add-ons whose tokens may call `/internal/**`. */
	trustedReaders: string[];
}

const number = (value: string | undefined, fallback: number): number => {
	const parsed = Number(value);
	return value && Number.isFinite(parsed) ? parsed : fallback;
};

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
	const databaseUrl = env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is required, e.g. mariadb://user:password@host:3306/beratungstools');
	}
	return {
		port: number(env.PORT, 8080),
		databaseUrl,
		addonServiceUrl: (env.ADDONSERVICE_URL ?? 'http://addonservice:8090').replace(/\/+$/, ''),
		issuer: env.ADDONSERVICE_ISSUER ?? 'oriso-addonservice',
		uiDir: env.UI_DIR ?? fileURLToPath(new URL('../../dist/ui', import.meta.url)),
		notifyWindowMs: number(env.NOTIFY_WINDOW_MINUTES, 15) * 60_000,
		timeZone: env.EXPORT_TIME_ZONE ?? 'Europe/Berlin',
		trustedReaders: (env.TRUSTED_READERS ?? '')
			.split(',')
			.map((name) => name.trim())
			.filter((name) => name && name !== NAME)
	};
};
