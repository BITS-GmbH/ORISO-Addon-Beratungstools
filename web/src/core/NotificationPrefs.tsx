import { Button, Checkbox } from '@oriso/web-kit';
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PREFS, type NotificationPrefs } from '../../../shared/api.ts';
import { caseApi } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { Icon } from '../ui.tsx';

export const PREFS_PANEL_ID = 'bt-notification-prefs';

/** Opens the notification preferences; sits next to the "Tools" headline so it is found. */
export function NotificationPrefsButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
	const { m } = useI18n();
	return (
		<button
			type="button"
			className="bt-tonalbtn"
			aria-expanded={open}
			aria-controls={open ? PREFS_PANEL_ID : undefined}
			onClick={onToggle}
		>
			<Icon name="bell" />
			{m.prefs.button}
		</button>
	);
}

/** The counsellor's own choice which tool events notify them (in all their cases). */
export function NotificationPrefsPanel({ onClose }: { onClose: () => void }) {
	const host = useHost();
	const { m } = useI18n();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		api.prefs().then(setPrefs, () => setPrefs(DEFAULT_PREFS));
	}, [api]);

	const save = async () => {
		if (!prefs) {
			return;
		}
		setSaving(true);
		try {
			setPrefs(await api.savePrefs(prefs));
			host.notify({ type: 'success', text: m.prefs.saved });
			onClose();
		} catch {
			host.notify({ type: 'error', text: m.prefs.saveFailed });
		} finally {
			setSaving(false);
		}
	};

	return (
		<section id={PREFS_PANEL_ID} className="bt-entry bt-stack bt-stack--tight" aria-label={m.prefs.button}>
			<h3 className="bt-title">{m.prefs.title}</h3>
			{prefs && (
				<>
					<p className="bt-muted bt-small">{m.prefs.intro}</p>
					<Checkbox
						label={m.prefs.firstShare}
						checked={prefs.firstShare}
						onChange={(firstShare) => setPrefs({ ...prefs, firstShare })}
					/>
					<Checkbox
						label={m.prefs.newEntry}
						checked={prefs.newEntry}
						onChange={(newEntry) => setPrefs({ ...prefs, newEntry })}
					/>
					<Checkbox
						label={m.prefs.changedEntry}
						checked={prefs.changedEntry}
						onChange={(changedEntry) => setPrefs({ ...prefs, changedEntry })}
					/>
					<div className="bt-row">
						<Button disabled={saving} onClick={save}>
							{m.prefs.save}
						</Button>
						<Button variant="secondary" onClick={onClose}>
							{m.common.cancel}
						</Button>
					</div>
				</>
			)}
		</section>
	);
}
