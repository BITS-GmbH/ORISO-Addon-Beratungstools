import { buildApp } from './app.ts';
import { createVerifier } from './auth.ts';
import { loadConfig } from './config.ts';
import { NAME } from './core/manifest.ts';
import { migrate } from './db/migrate.ts';
import { openPool } from './db/pool.ts';
import { createHost } from './host.ts';
import { Store } from './store.ts';
import { TOOLS } from './tools/index.ts';

const config = loadConfig();
const pool = openPool(config.databaseUrl);
await migrate(pool);

const { app } = buildApp({
	store: new Store(pool),
	verify: createVerifier({
		jwksUrl: `${config.addonServiceUrl}/addons/.well-known/jwks.json`,
		issuer: config.issuer,
		audience: NAME,
		trustedReaders: config.trustedReaders
	}),
	host: createHost({ url: `${config.addonServiceUrl}/addons/host` }),
	tools: TOOLS,
	notifyWindowMs: config.notifyWindowMs,
	timeZone: config.timeZone,
	trustedReaders: config.trustedReaders,
	uiDir: config.uiDir,
	logger: true
});

await app.listen({ port: config.port, host: '0.0.0.0' });
app.log.info(`${NAME} on :${config.port}, AddonService ${config.addonServiceUrl}`);

const stop = async () => {
	await app.close();
	await pool.end();
	process.exit(0);
};
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
