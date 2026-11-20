import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

const ICONS = {
	back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
	check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
	edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
	delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
	star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
	expand: 'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z'
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
export const SaveStatus = ({ state }: { state: SaveState }) => (
	<span
		className={`bt-saving${state === 'error' ? ' bt-saving--error' : ''}`}
		role="status"
		aria-live="polite"
	>
		{state === 'saving' && 'Wird gespeichert …'}
		{state === 'saved' && (
			<>
				<Icon name="check" />
				Automatisch gespeichert
			</>
		)}
		{state === 'error' && 'Nicht gespeichert'}
	</span>
);

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

export const formatDate = (iso: string | null | undefined, locale = 'de', withTime = false): string =>
	iso
		? new Date(iso).toLocaleString(locale.split('@')[0] || 'de', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
			})
		: '';

interface Loaded<T> {
	data: T | null;
	error: Error | null;
	loading: boolean;
	reload: () => Promise<void>;
}

/** Loads data once and on `reload`; keeps the last data while reloading. */
export const useLoad = <T,>(load: () => Promise<T>): Loaded<T> => {
	const [state, setState] = useState<{ data: T | null; error: Error | null; loading: boolean }>({
		data: null,
		error: null,
		loading: true
	});
	const loadRef = useRef(load);
	loadRef.current = load;
	const reload = useCallback(async () => {
		setState((previous) => ({ ...previous, loading: true }));
		try {
			const data = await loadRef.current();
			setState({ data, error: null, loading: false });
		} catch (error) {
			setState((previous) => ({ data: previous.data, error: error as Error, loading: false }));
		}
	}, []);
	useEffect(() => {
		void reload();
	}, [reload]);
	return { ...state, reload };
};
