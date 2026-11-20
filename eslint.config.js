import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist', 'node_modules', 'tooling'] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: { globals: { ...globals.node, ...globals.browser } },
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'@typescript-eslint/consistent-type-imports': 'error'
		}
	},
	{
		files: ['**/test/**/*.{ts,tsx}'],
		rules: { '@typescript-eslint/no-explicit-any': 'off' }
	},
	{
		files: ['web/**/*.tsx', 'web/**/*.ts'],
		plugins: { 'react-hooks': reactHooks },
		rules: reactHooks.configs.recommended.rules
	}
);
