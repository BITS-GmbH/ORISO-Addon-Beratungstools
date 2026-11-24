import { Button, Checkbox } from '@oriso/web-kit';
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PREFS, type NotificationPrefs } from '../../../shared/api.ts';
import { caseApi } from '../api.ts';
import { useHost } from '../host.ts';
import { Icon } from '../ui.tsx';

export const PREFS_PANEL_ID = 'bt-notification-prefs';

/** Opens the notification preferences; sits next to the "Tools" headline so it is found. */
export function NotificationPrefsButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
	return (
		<button
			type="button"
			className="bt-tonalbtn"
			aria-expanded={open}
			aria-controls={open ? PREFS_PANEL_ID : undefined}
			onClick={onToggle}
		>
			<Icon name="bell" />
			Benachrichtigungen
		</button>
	);
}

/** The counsellor's own choice which tool events notify them (in all their cases). */
export function NotificationPrefsPanel({ onClose }: { onClose: () => void }) {
	const host = useHost();
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
			host.notify({ type: 'success', text: 'Ihre Benachrichtigungseinstellungen sind gespeichert.' });
			onClose();
		} catch {
			host.notify({ type: 'error', text: 'Die Einstellungen konnten nicht gespeichert werden.' });
		} finally {
			setSaving(false);
		}
	};

	return (
		<section id={PREFS_PANEL_ID} className="bt-entry bt-stack bt-stack--tight" aria-label="Benachrichtigungen">
			<h3 className="bt-title">Benachrichtigungseinstellungen</h3>
			{prefs && (
				<>
					<p className="bt-muted bt-small">
						Worüber möchten Sie informiert werden, wenn Ratsuchende ihre Tools mit Ihnen teilen? Gilt für alle
						Ihre Fälle. Mehrere Änderungen kurz hintereinander werden zusammengefasst.
					</p>
					<Checkbox
						label="Erstmalige Freigabe von Tool-Inhalten"
						checked={prefs.firstShare}
						onChange={(firstShare) => setPrefs({ ...prefs, firstShare })}
					/>
					<Checkbox
						label="Neue Einträge in freigegebenen Tools"
						checked={prefs.newEntry}
						onChange={(newEntry) => setPrefs({ ...prefs, newEntry })}
					/>
					<Checkbox
						label="Änderungen an bestehenden Einträgen"
						checked={prefs.changedEntry}
						onChange={(changedEntry) => setPrefs({ ...prefs, changedEntry })}
					/>
					<div className="bt-row">
						<Button disabled={saving} onClick={save}>
							Einstellungen speichern
						</Button>
						<Button variant="tertiary" onClick={onClose}>
							Abbrechen
						</Button>
					</div>
				</>
			)}
		</section>
	);
}
