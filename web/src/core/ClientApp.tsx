import { Headline, Notice, Spinner } from '@oriso/web-kit';
import { useState } from 'react';
import { clientTools } from '../api.ts';
import { useHost, useI18n } from '../host.ts';
import { Pill, useLoad } from '../ui.tsx';
import { ToolPage } from './ToolPage.tsx';
import { ToolRow } from './ToolRow.tsx';

/** "Meine Tools": the tools a counsellor released for the client. */
export function ClientApp() {
	const host = useHost();
	const { m } = useI18n();
	const [open, setOpen] = useState<string | null>(null);
	const { data, error, reload } = useLoad(() => clientTools(host.api), [host.api]);

	if (open) {
		return (
			<ToolPage
				key={open}
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
				<ul className="bt-toollist bt-toollist--wide">
					{data.tools.map((tool) => (
						<li key={tool.id}>
							<ToolRow
								toolId={tool.id}
								badges={
									<>
										{!tool.opened && <Pill tone="new">{m.client.new}</Pill>}
										{tool.shared && <Pill tone="shared">{m.client.shared}</Pill>}
									</>
								}
								onOpen={() => setOpen(tool.id)}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
