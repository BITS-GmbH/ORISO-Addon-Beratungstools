import { Button, Card, Headline, Notice, Spinner } from '@oriso/web-kit';
import { useState } from 'react';
import { toolInfo } from '../../../shared/catalog.ts';
import { clientTools } from '../api.ts';
import { useHost, useTx } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { Pill, useLoad } from '../ui.tsx';
import { ToolIcon } from './ToolIcon.tsx';
import { ToolPage } from './ToolPage.tsx';

/** "Meine Tools": the tools a counsellor released for the client. */
export function ClientApp() {
	const host = useHost();
	const tx = useTx();
	const [open, setOpen] = useState<string | null>(null);
	const { data, error, reload } = useLoad(() => clientTools(host.api));

	if (open) {
		return (
			<ToolPage
				toolId={open}
				mode="client"
				backLabel="Meine Tools"
				onOpenTool={setOpen}
				onBack={() => {
					setOpen(null);
					void reload();
				}}
			/>
		);
	}
	if (error && !data) {
		return <Notice type="error" title="Ihre Tools konnten nicht geladen werden." />;
	}
	if (!data) {
		return <Spinner />;
	}
	return (
		<div className="bt-stack">
			<div>
				<Headline level={1} styleLevel={2}>
					Meine Tools
				</Headline>
				<p className="bt-muted">
					{tx(
						'Diese Übungen hat Ihre Beratung für Sie freigeschaltet. Was Sie eintragen, sieht Ihre Beratung nur, wenn Sie es teilen.',
						'Diese Übungen hat deine Beratung für dich freigeschaltet. Was du einträgst, sieht deine Beratung nur, wenn du es teilst.'
					)}
				</p>
			</div>
			{data.tools.length === 0 ? (
				<Notice type="info" title={tx('Noch keine Tools freigeschaltet', 'Noch keine Tools freigeschaltet')}>
					{tx(
						'Ihre Beraterin oder Ihr Berater kann Ihnen Tools freischalten. Sprechen Sie sie oder ihn gern darauf an.',
						'Deine Beraterin oder dein Berater kann dir Tools freischalten. Sprich sie oder ihn gern darauf an.'
					)}
				</Notice>
			) : (
				<div className="bt-grid">
					{data.tools.map((tool) => {
						const info = toolInfo(tool.id);
						return (
							<Card key={tool.id}>
								<div className="bt-tile">
									<div className="bt-tile__head">
										<ToolIcon icon={webTool(tool.id)?.icon} />
										<div className="bt-stack bt-stack--tight">
											<span className="bt-title">{info?.title.de ?? tool.id}</span>
											<div className="bt-row">
												{!tool.opened && <Pill tone="new">Neu</Pill>}
												{tool.shared && <Pill tone="shared">Mit der Beratung geteilt</Pill>}
											</div>
										</div>
									</div>
									<p className="bt-muted bt-small bt-clamp">{info?.description}</p>
									<div className="bt-tile__actions">
										<Button onClick={() => setOpen(tool.id)}>
											{tool.hasEntries ? 'Weiter bearbeiten' : 'Öffnen'}
										</Button>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
