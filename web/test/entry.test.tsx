import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mount, unmount } from '../src/entry.tsx';
import { fakeHost } from './fakeHost.tsx';

describe('lifecycle', () => {
	it('mounts the client view into its element with the add-on styles, and unmounts it', async () => {
		const { host } = fakeHost({ 'GET /me/tools': () => ({ tools: [] }) });
		document.body.appendChild(host.domElement);
		await act(async () => {
			await mount(host);
		});
		expect(document.getElementById('oriso-addon-beratungstools-styles')).toBeTruthy();
		expect(host.domElement.querySelector('.bt')).toBeTruthy();
		expect(host.domElement.textContent).toContain('Meine Tools');
		await act(async () => {
			await unmount(host);
		});
		expect(host.domElement.innerHTML).toBe('');
	});
});
