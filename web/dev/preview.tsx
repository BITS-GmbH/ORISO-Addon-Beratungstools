import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import * as reactDomClient from 'react-dom/client';
import * as kit from './kit.tsx';

Object.assign(globalThis, {
	__ORISO_ADDON_SHARED__: { contract: 'oriso-addon/v1', react: React, reactDomClient, jsxRuntime, kit }
});
const addon = await import('../src/entry.tsx');

const tokens = new Map<string, string>();
const tokenFor = async (as: string) => {
	if (!tokens.has(as)) {
		tokens.set(as, (await (await fetch(`/dev/token?as=${as}`)).json()).token);
	}
	return tokens.get(as) as string;
};

const notify = ({ type, text }: { type: string; text: string }) => {
	const toast = Object.assign(document.createElement('div'), {
		className: `toast ${type}`,
		textContent: text
	});
	document.getElementById('toasts')?.append(toast);
	setTimeout(() => toast.remove(), 4000);
};

const element = (id: string) => document.getElementById(id) as HTMLElement;
const informal = () => (element('informal') as HTMLInputElement).checked;
const locale = () => (element('locale') as HTMLSelectElement).value;

const props = (slot: string, id: string, as: string, counsellor: boolean) => ({
	contract: 'oriso-addon/v1',
	domElement: element(id),
	addon: { name: 'beratungstools', version: 'preview' },
	app: { id: 'tools' },
	slot,
	user: { id: as, username: as, roles: [counsellor ? 'consultant' : 'user'] },
	tenant: { id: 1 },
	locale: counsellor || locale() !== 'de' || !informal() ? locale() : 'de@informal',
	informal: counsellor ? false : informal(),
	theme: {},
	...(counsellor ? { sessionId: 4711, agencyId: 1, askerId: 'preview-asker' } : {}),
	api: async (path: string, init: RequestInit = {}) =>
		fetch(`/api${path}`, {
			...init,
			headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${await tokenFor(as)}` }
		}),
	navigate: (to: string) => notify({ type: 'info', text: `navigate(${to})` }),
	notify
});

const panes = [
	['asker.navigation', 'asker', 'asker', false],
	['consultant.session', 'counsellor', 'counsellor', true],
	['consultant.asker-profile', 'profile', 'counsellor', true]
] as const;

const mounted = new Map<string, ReturnType<typeof props>>();
const renderAll = async () => {
	for (const [slot, id, as, counsellor] of panes) {
		const previous = mounted.get(id);
		if (previous) {
			await addon.unmount(previous as never);
		}
		const next = props(slot, id, as, counsellor);
		mounted.set(id, next);
		await addon.mount(next as never);
	}
};

const saveSettings = async () => {
	await fetch('/dev/settings', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			allowSharing: (element('sharing') as HTMLInputElement).checked,
			balancePoles: (element('poles') as HTMLSelectElement).value
		})
	});
	await renderAll();
};

element('informal').onchange = renderAll;
element('locale').onchange = renderAll;
(element('locale') as HTMLSelectElement).value = new URLSearchParams(location.search).get('lang') ?? 'de';
element('sharing').onchange = saveSettings;
element('poles').onchange = saveSettings;
element('sample').onclick = async () => {
	await fetch('/dev/sample', { method: 'POST' });
	await renderAll();
};
element('reset').onclick = async () => {
	await fetch('/dev/reset', { method: 'POST' });
	await renderAll();
};

setInterval(async () => {
	const log = (await (await fetch('/dev/log')).json()) as Array<{ at: string; kind: string; text: string }>;
	element('log').replaceChildren(
		...log.map((line) =>
			Object.assign(document.createElement('div'), {
				textContent: `${line.at.slice(11, 19)} ${line.kind}: ${line.text}`
			})
		)
	);
}, 1500);

await saveSettings();
