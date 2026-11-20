import orisoAddon from '@oriso/vite-plugin-addon';
import { defineConfig } from 'vite';

export default defineConfig({
	root: 'web',
	plugins: [orisoAddon()],
	publicDir: 'public',
	build: {
		outDir: '../dist/ui',
		emptyOutDir: true,
		target: 'es2022',
		lib: { entry: 'src/entry.tsx', formats: ['es'], fileName: () => 'entry.js' }
	}
});
