import type { Release, Share } from '../store.ts';
import type { ServerTool } from '../tools/types.ts';
import { allowsSharing, isOffered, type Settings } from './settings.ts';

export const isActive = (release: Release | null | undefined): release is Release =>
	Boolean(release && !release.withdrawnAt);

/**
 * Release, entries and share are separate states; counsellors may read only while the tool is
 * offered, released and shared, and sharing is allowed. Checked on every read.
 */
export const isReadable = (
	settings: Settings,
	tool: ServerTool,
	release: Release | null | undefined,
	share: Share | null | undefined
): boolean =>
	isOffered(settings, tool) && allowsSharing(settings) && isActive(release) && Boolean(share?.shared);
