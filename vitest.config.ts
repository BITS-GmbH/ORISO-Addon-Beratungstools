import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const kit = fileURLToPath(new URL('./web/dev/kit.tsx', import.meta.url));

export default defineConfig({
	test: {
		projects: [
			{ test: { name: 'server', include: ['server/test/**/*.test.ts'], environment: 'node' } },
			{
				test: {
					name: 'integration',
					include: ['server/test/**/*.it.ts'],
					environment: 'node',
					fileParallelism: false,
					testTimeout: 20000
				}
			},
			{
				resolve: { alias: { '@oriso/web-kit': kit } },
				test: {
					name: 'web',
					include: ['web/test/**/*.test.{ts,tsx}'],
					environment: 'jsdom',
					setupFiles: ['web/test/setup.ts']
				}
			}
		]
	}
});
