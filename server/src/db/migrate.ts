import { readdir, readFile } from 'node:fs/promises';
import type { Pool } from 'mariadb';

const DIRECTORY = new URL('./migrations/', import.meta.url);
const LOCK = 'beratungstools_migrations';

/** Splits a migration into statements; migrations keep to one statement per `;` at a line end. */
const statements = (sql: string): string[] =>
	sql
		.split(/;\s*$/m)
		.map((statement) => statement.trim())
		.filter(Boolean);

/**
 * Applies the numbered SQL files in `migrations/` that are not applied yet, in order. A named lock
 * keeps replicas starting at the same time from running them twice.
 */
export const migrate = async (
	pool: Pool,
	log: (message: string) => void = console.log
): Promise<string[]> => {
	const connection = await pool.getConnection();
	try {
		const [{ locked }] = await connection.query('SELECT GET_LOCK(?, 60) AS locked', [LOCK]);
		if (Number(locked) !== 1) {
			throw new Error('could not get the migration lock');
		}
		await connection.query(
			'CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(100) NOT NULL PRIMARY KEY, applied_at DATETIME(3) NOT NULL)'
		);
		const done = new Set(
			(await connection.query('SELECT version FROM schema_migrations')).map(
				(row: { version: string }) => row.version
			)
		);
		const files = (await readdir(DIRECTORY)).filter((name) => /^\d+_.+\.sql$/.test(name)).sort();
		const applied: string[] = [];
		for (const file of files) {
			const version = file.replace(/\.sql$/, '');
			if (done.has(version)) {
				continue;
			}
			for (const statement of statements(await readFile(new URL(file, DIRECTORY), 'utf8'))) {
				await connection.query(statement);
			}
			await connection.query('INSERT INTO schema_migrations (version, applied_at) VALUES (?, NOW(3))', [
				version
			]);
			log(`migration ${version} applied`);
			applied.push(version);
		}
		return applied;
	} finally {
		await connection.query('SELECT RELEASE_LOCK(?)', [LOCK]).catch(() => undefined);
		await connection.release();
	}
};
