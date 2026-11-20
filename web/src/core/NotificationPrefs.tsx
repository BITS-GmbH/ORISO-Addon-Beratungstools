import { Button, Checkbox } from '@oriso/web-kit';
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PREFS, type NotificationPrefs } from '../../../shared/api.ts';
import { caseApi } from '../api.ts';
import { useHost } from '../host.ts';
import { Icon } from '../ui.tsx';

/** The counsellor's own choice which tool events notify them (in all their cases). */
export function NotificationPrefsPanel() {
	const host = useHost();
	const api = useMemo(() => caseApi(host.api), [host.api]);
	const [open, setOpen] = useState(false);
	const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (open && !prefs) {
			api.prefs().then(setPrefs, () => setPrefs(DEFAULT_PREFS));
		}
	}, [api, open, prefs]);

	const save = async () => {
		if (!prefs) {
			return;
		}
		setSaving(true);
		try {
			setPrefs(await api.savePrefs(prefs));
			host.notify({ type: 'success', text: 'Ihre Benachrichtigungseinstellungen sind gespeichert.' });
		} catch {
			host.notify({ type: 'error', text: 'Die Einstellungen konnten nicht gespeichert werden.' });
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className="bt-entry">
			<button type="button" className="bt-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
				Benachrichtigungseinstellungen
				<span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : undefined }}>
					<Icon name="expand" />
				</span>
			</button>
			{open && prefs && (
				<div className="bt-stack bt-stack--tight" style={{ marginTop: 8 }}>
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
					<div>
						<Button disabled={saving} onClick={save}>
							Einstellungen speichern
						</Button>
					</div>
				</div>
			)}
		</section>
	);
}
