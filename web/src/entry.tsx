import { Provider } from '@oriso/web-kit';
import type { CSSProperties } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ClientApp } from './core/ClientApp.tsx';
import { CounsellorApp } from './core/CounsellorApp.tsx';
import { ProfileTile } from './core/ProfileTile.tsx';
import { HostContext, type HostProps } from './host.ts';
import { installStyles } from './styles.ts';

const roots = new Map<HTMLElement, Root>();

function Slot({ slot }: { slot: string }) {
	switch (slot) {
		case 'asker.navigation':
		case 'asker.session-menu':
			return <ClientApp />;
		case 'consultant.session':
			return <CounsellorApp />;
		case 'consultant.asker-profile':
			return <ProfileTile />;
		default:
			return null;
	}
}

const render = (props: HostProps) => {
	roots.get(props.domElement)?.render(
		<Provider>
			<HostContext.Provider value={props}>
				<div className="bt" style={(props.theme ?? {}) as CSSProperties}>
					<Slot key={`${props.slot}:${props.askerId ?? ''}:${props.sessionId ?? ''}`} slot={props.slot} />
				</div>
			</HostContext.Provider>
		</Provider>
	);
};

export async function bootstrap(): Promise<void> {}

export async function mount(props: HostProps): Promise<void> {
	installStyles(props.domElement.ownerDocument);
	roots.set(props.domElement, createRoot(props.domElement));
	render(props);
}

export async function update(props: HostProps): Promise<void> {
	render(props);
}

export async function unmount(props: HostProps): Promise<void> {
	roots.get(props.domElement)?.unmount();
	roots.delete(props.domElement);
}
