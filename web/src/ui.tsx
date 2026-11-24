import { Button } from '@oriso/web-kit';
import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type ComponentProps } from 'react';
import { i18nFor } from '../../shared/i18n/index.ts';
import { useI18n } from './host.ts';

const ICONS = {
	back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
	check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
	edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
	delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
	star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
	expand: 'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z',
	previous: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
	next: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
	bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z',
	calendar:
		'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z'
} as const;

export const Icon = ({ name, label }: { name: keyof typeof ICONS; label?: string }) => (
	<svg
		viewBox="0 0 24 24"
		className="bt-icon"
		aria-hidden={label ? undefined : true}
		aria-label={label}
		role={label ? 'img' : undefined}
	>
		<path d={ICONS[name]} />
	</svg>
);

export const IconButton = ({
	icon,
	label,
	onClick
}: {
	icon: 'edit' | 'delete';
	label: string;
	onClick: () => void;
}) => (
	<button
		type="button"
		className="bt-iconbtn"
		title={label.split(':')[0]}
		aria-label={label}
		onClick={onClick}
	>
		<Icon name={icon} />
	</button>
);

export const BackButton = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
	<button type="button" className="bt-linkbtn" onClick={onClick}>
		<Icon name="back" />
		{children}
	</button>
);

export const Pill = ({
	tone,
	children
}: {
	tone: 'off' | 'on' | 'shared' | 'neutral' | 'new';
	children: ReactNode;
}) => <span className={`bt-pill bt-pill--${tone}`}>{children}</span>;

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** The autosave indicator: tells the user that their input has been stored. */
export const SaveStatus = ({ state }: { state: SaveState }) => {
	const { m } = useI18n();
	return (
		<span
			className={`bt-saving${state === 'error' ? ' bt-saving--error' : ''}`}
			role="status"
			aria-live="polite"
		>
			{state === 'saving' && m.common.saving}
			{state === 'saved' && (
				<>
					<Icon name="check" />
					{m.common.saved}
				</>
			)}
			{state === 'error' && m.common.notSaved}
		</span>
	);
};

export const Switch = ({
	checked,
	onChange,
	label,
	description,
	overline
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: string;
	description?: string;
	overline?: string;
}) => (
	<label className="bt-switch">
		<span>
			{overline && (
				<span className="bt-overline" style={{ display: 'block' }}>
					{overline}
				</span>
			)}
			<span className="bt-title" style={{ display: 'block' }}>
				{label}
			</span>
			{description && (
				<span className="bt-muted bt-small" style={{ display: 'block' }}>
					{description}
				</span>
			)}
		</span>
		<input
			type="checkbox"
			role="switch"
			checked={checked}
			onChange={(event) => onChange(event.target.checked)}
		/>
		<span className="bt-switch__track" aria-hidden />
	</label>
);

export const downloadBlob = (blob: Blob, fileName: string): void => {
	const url = URL.createObjectURL(blob);
	const link = Object.assign(document.createElement('a'), { href: url, download: fileName });
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

/** Date (and time) in the format of the host's locale. */
export const formatDate = (iso: string | null | undefined, locale = 'de', withTime = false): string =>
	i18nFor(locale).date(iso, { withTime });

interface Loaded<T> {
	data: T | null;
	error: Error | null;
	loading: boolean;
	reload: () => Promise<void>;
}

interface LoadState<T> {
	deps: readonly unknown[];
	data: T | null;
	error: Error | null;
	loading: boolean;
}

const sameDeps = (a: readonly unknown[], b: readonly unknown[]) =>
	a.length === b.length && a.every((value, index) => Object.is(value, b[index]));

/**
 * Loads data when mounted, whenever `deps` change and on `reload`; keeps the last data while
 * reloading. Data loaded for other `deps` is never returned, and an answer that arrives after a newer
 * load started (or after `deps` changed) is dropped.
 */
export const useLoad = <T,>(load: () => Promise<T>, deps: readonly unknown[] = []): Loaded<T> => {
	const [state, setState] = useState<LoadState<T>>({ deps, data: null, error: null, loading: true });
	const loadRef = useRef(load);
	loadRef.current = load;
	const depsRef = useRef(deps);
	depsRef.current = deps;
	const generation = useRef(0);
	const reload = useCallback(async () => {
		const current = ++generation.current;
		const forDeps = depsRef.current;
		setState((previous) =>
			sameDeps(previous.deps, forDeps)
				? { ...previous, loading: true }
				: { deps: forDeps, data: null, error: null, loading: true }
		);
		try {
			const data = await loadRef.current();
			if (current === generation.current) {
				setState({ deps: forDeps, data, error: null, loading: false });
			}
		} catch (error) {
			if (current === generation.current) {
				setState((previous) => ({
					deps: forDeps,
					data: sameDeps(previous.deps, forDeps) ? previous.data : null,
					error: error as Error,
					loading: false
				}));
			}
		}
	}, []);
	useEffect(() => {
		void reload();
		return () => {
			generation.current += 1;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reload, ...deps]);
	if (!sameDeps(state.deps, deps)) {
		return { data: null, error: null, loading: true, reload };
	}
	return { data: state.data, error: state.error, loading: state.loading, reload };
};

/** Scrolls a detail opened below its trigger into view and moves the focus there; `key` names what is open. */
export const useReveal = <T extends HTMLElement>(key: unknown) => {
	const ref = useRef<T>(null);
	useEffect(() => {
		const element = ref.current;
		if (key == null || !element) {
			return;
		}
		const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		element.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
		element.focus({ preventScroll: true });
	}, [key]);
	return ref;
};

/**
 * A time of day (`HH:MM` or `''`). The web kit has no time field, so this one copies the look of
 * the kit's outlined fields: label in the notch of the outline, one focus border.
 */
export const TimeField = ({
	label,
	value,
	onChange
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) => {
	const id = useId();
	return (
		<div className="bt-timefield">
			<input id={id} type="time" value={value} onChange={(event) => onChange(event.target.value)} />
			<label htmlFor={id}>{label}</label>
			<fieldset aria-hidden="true">
				<legend>
					<span>{label}</span>
				</legend>
			</fieldset>
		</div>
	);
};

/** "Woche zurück / Woche vor" with the week's dates in between. */
export const WeekNav = ({
	label,
	onPrevious,
	onNext,
	nextDisabled
}: {
	label: string;
	onPrevious: () => void;
	onNext: () => void;
	nextDisabled?: boolean;
}) => {
	const { m } = useI18n();
	return (
		<div className="bt-weeknav">
			<button
				type="button"
				className="bt-iconbtn"
				aria-label={m.common.weekBack}
				title={m.common.weekBack}
				onClick={onPrevious}
			>
				<Icon name="previous" />
			</button>
			<span className="bt-title" aria-live="polite">
				{label}
			</span>
			<button
				type="button"
				className="bt-iconbtn"
				aria-label={m.common.weekForward}
				title={m.common.weekForward}
				disabled={nextDisabled}
				onClick={onNext}
			>
				<Icon name="next" />
			</button>
		</div>
	);
};

/** The confirming button of a destructive action; the web kit has no danger variant. */
export const DangerButton = (props: ComponentProps<typeof Button>) => (
	<span className="bt-danger">
		<Button {...props} />
	</span>
);
