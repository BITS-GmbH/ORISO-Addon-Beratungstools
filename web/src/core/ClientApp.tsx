import { Button, Card, Headline, Notice, Spinner } from '@oriso/web-kit';
import { useState } from 'react';
import { toolTexts } from '../../../shared/catalog.ts';
import { clientTools } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { webTool } from '../tools/index.ts';
import { Pill, useLoad } from '../ui.tsx';
import { ToolIcon } from './ToolIcon.tsx';
import { ToolPage } from './ToolPage.tsx';

/** "Meine Tools": the tools a counsellor released for the client. */
export function ClientApp() {
	const host = useHost();
	const { m } = useI18n();
	const [open, setOpen] = useState<string | null>(null);
	const { data, error, reload } = useLoad(() => clientTools(host.api));

	if (open) {
		return (
			<ToolPage
				toolId={open}
				mode="client"
				backLabel={m.client.myTools}
				onOpenTool={setOpen}
				onBack={() => {
					setOpen(null);
					void reload();
				}}
			/>
		);
	}
	if (error && !data) {
		return <Notice type="error" title={m.client.loadError} />;
	}
	if (!data) {
		return <Spinner />;
	}
	return (
		<div className="bt-stack">
			<div>
				<Headline level={1} styleLevel={2}>
					{m.client.myTools}
				</Headline>
				<p className="bt-muted">{m.client.intro}</p>
			</div>
			{data.tools.length === 0 ? (
				<Notice type="info" title={m.client.noneTitle}>
					{m.client.noneText}
				</Notice>
			) : (
				<div className="bt-grid">
					{data.tools.map((tool) => {
						const info = toolTexts(m, tool.id);
						return (
							<Card key={tool.id}>
								<div className="bt-tile">
									<div className="bt-tile__head">
										<ToolIcon icon={webTool(tool.id)?.icon} />
										<div className="bt-stack bt-stack--tight">
											<span className="bt-title">{info.title}</span>
											<div className="bt-row">
												{!tool.opened && <Pill tone="new">{m.client.new}</Pill>}
												{tool.shared && <Pill tone="shared">{m.client.shared}</Pill>}
											</div>
										</div>
									</div>
									<p className="bt-muted bt-small bt-clamp">{info.description}</p>
									<div className="bt-tile__actions">
										<Button onClick={() => setOpen(tool.id)}>
											{tool.hasEntries ? m.client.continue : m.client.open}
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
