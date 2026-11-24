import { createContext, useContext } from 'react';
import { i18nFor, type I18n } from '../../shared/i18n/index.ts';

/** What the host passes to `mount` and `update` (contract `oriso-addon/v1`, ORISO-Frontend addonTypes.ts). */
export interface HostProps {
	contract: string;
	domElement: HTMLElement;
	slot: string;
	user: { id: string; username: string; roles: string[] };
	tenant: { id?: number; name?: string };
	locale: string;
	informal: boolean;
	theme?: Record<string, string>;
	agencyId?: number;
	sessionId?: number;
	askerId?: string;
	api: (path: string, init?: RequestInit) => Promise<Response>;
	navigate: (to: string) => void;
	notify: (notice: { type: 'success' | 'info' | 'warning' | 'error'; text: string; title?: string }) => void;
}

export const HostContext = createContext<HostProps | null>(null);

export const useHost = (): HostProps => {
	const host = useContext(HostContext);
	if (!host) {
		throw new Error('outside of the add-on root');
	}
	return host;
};

/** Formal or informal text for the person using the add-on. */
export const useTx = () => {
	const { informal } = useHost();
	return (sie: string, du: string) => (informal ? du : sie);
};

/** The catalogue and formatting for the user's language and form of address. */
export const useI18n = (): I18n => {
	const host = useContext(HostContext);
	return i18nFor(host?.locale, host?.informal);
};
