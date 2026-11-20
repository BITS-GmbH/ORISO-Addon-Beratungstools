import { createPool, type Pool } from 'mariadb';

export const openPool = (url: string, connectionLimit = 10): Pool => {
	const parsed = new URL(url);
	return createPool({
		host: parsed.hostname,
		port: Number(parsed.port || 3306),
		user: decodeURIComponent(parsed.username),
		password: decodeURIComponent(parsed.password),
		database: parsed.pathname.replace(/^\//, ''),
		connectionLimit,
		timezone: 'Z',
		bigIntAsNumber: true,
		insertIdAsNumber: true,
		decimalAsNumber: true
	});
};
