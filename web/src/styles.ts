// Styles for what the web kit does not cover (tiles, status pills, the share switch, the scale),
// scoped to `.bt`. Colours come from the host's Material 3 tokens (`--m3-*`, set per Träger).

export const CSS = `
.bt {
	--bt-primary: var(--m3-primary, #225e65);
	--bt-on-primary: var(--m3-on-primary, #fff);
	--bt-surface: var(--m3-surface-container-lowest, #fff);
	--bt-surface-low: var(--m3-surface-container-low, #f4f6f7);
	--bt-surface-high: var(--m3-surface-container-high, #e7eaec);
	--bt-text: var(--m3-on-surface, #1a1c1e);
	--bt-muted: var(--m3-on-surface-variant, #545f63);
	--bt-outline: var(--m3-outline, #8a9599);
	--bt-outline-soft: var(--m3-outline-variant, #d6dcde);
	--bt-error: var(--m3-error, #b3261e);
	--bt-primary-soft: color-mix(in srgb, var(--bt-primary) 12%, var(--bt-surface));
	--bt-contra: #c25e22;
	--bt-contra-soft: color-mix(in srgb, var(--bt-contra) 12%, var(--bt-surface));
	--bt-new: #8a3c06;
	--bt-new-soft: #fde4d0;
	container-type: inline-size;
	color: var(--bt-text);
	font-size: 15px;
	line-height: 1.5;
	width: 100%;
	max-width: 1040px;
	box-sizing: border-box;
}
.bt *, .bt *::before, .bt *::after { box-sizing: border-box; }
.bt h2, .bt h3, .bt h4, .bt p, .bt ul { margin: 0; }
.bt-stack { display: flex; flex-direction: column; gap: 16px; }
.bt-stack--tight { gap: 8px; }
.bt-row { display: flex; gap: 8px 12px; flex-wrap: wrap; align-items: center; }
.bt-row--between { justify-content: space-between; }
.bt-muted { color: var(--bt-muted); }
.bt-small { font-size: 13px; }
.bt-overline { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--bt-muted); }
.bt-title { font-size: 17px; font-weight: 700; line-height: 1.35; }
.bt-pre { white-space: pre-wrap; overflow-wrap: anywhere; }
.bt-clamp { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

.bt-linkbtn { font: inherit; font-size: 14px; font-weight: 600; color: var(--bt-primary); background: none; border: 0; padding: 4px 0; cursor: pointer; display: inline-flex; gap: 4px; align-items: center; }
.bt-linkbtn:hover { text-decoration: underline; }
.bt-linkbtn svg, .bt-icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
.bt :focus-visible { outline: 3px solid color-mix(in srgb, var(--bt-primary) 45%, transparent); outline-offset: 2px; }

.bt-grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
@container (min-width: 560px) { .bt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (min-width: 900px) { .bt-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.bt-tile { height: 100%; display: flex; flex-direction: column; gap: 10px; }
.bt-tile__head { display: flex; gap: 10px; align-items: flex-start; }
.bt-tile__icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; flex: none; background: var(--bt-primary-soft); color: var(--bt-primary); }
.bt-tile__icon svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.bt-tile__actions { margin-top: auto; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

.bt-pill { display: inline-flex; align-items: center; gap: 4px; border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 700; white-space: nowrap; }
.bt-pill--off { background: #fbefe2; color: #8a4b12; }
.bt-pill--on { background: #e3f3e6; color: #1e6b2b; }
.bt-pill--shared { background: var(--bt-primary-soft); color: var(--bt-primary); }
.bt-pill--neutral { background: var(--bt-surface-high); color: var(--bt-muted); }
.bt-pill--new { background: var(--bt-new-soft); color: var(--bt-new); }

.bt-confirm { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 10px 12px; border-radius: 10px; background: var(--bt-surface-low); border: 1px solid var(--bt-outline-soft); font-size: 14px; }

.bt-switch { display: flex; gap: 16px; align-items: center; justify-content: space-between; cursor: pointer; }
.bt-switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.bt-switch__track { position: relative; width: 52px; height: 32px; border-radius: 999px; flex: none; background: var(--bt-surface-high); border: 2px solid var(--bt-outline); transition: background .2s, border-color .2s; }
.bt-switch__track::after { content: ''; position: absolute; top: 50%; left: 6px; width: 16px; height: 16px; border-radius: 999px; background: var(--bt-outline); transform: translateY(-50%); transition: left .2s, width .2s, height .2s, background .2s; }
.bt-switch input:checked + .bt-switch__track { background: var(--bt-primary); border-color: var(--bt-primary); }
.bt-switch input:checked + .bt-switch__track::after { left: 24px; width: 24px; height: 24px; background: var(--bt-on-primary); }
.bt-switch input:focus-visible + .bt-switch__track { outline: 3px solid color-mix(in srgb, var(--bt-primary) 45%, transparent); outline-offset: 2px; }

.bt-saving { font-size: 13px; color: var(--bt-muted); display: inline-flex; gap: 4px; align-items: center; min-height: 20px; }
.bt-saving svg { width: 16px; height: 16px; fill: #2e7d32; }
.bt-saving--error { color: var(--bt-error); }

.bt-demo { border: 2px dashed #d9a400; border-radius: 12px; padding: 12px 16px; background: #fff8e1; }

.bt-entry { border: 1px solid var(--bt-outline-soft); border-radius: 10px; padding: 10px 12px; background: var(--bt-surface); }
.bt-entry--new { border-color: #f77d28; }
.bt-answer { display: flex; flex-direction: column; gap: 4px; padding: 12px 0; border-top: 1px solid var(--bt-outline-soft); }
.bt-answer:first-child { border-top: 0; padding-top: 0; }

.bt-steps { display: flex; gap: 6px; }
.bt-steps span { height: 6px; flex: 1; border-radius: 999px; background: var(--bt-surface-high); }
.bt-steps span.is-done { background: var(--bt-primary); }
.bt-summary { display: grid; gap: 0; }
.bt-summary > div { display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; padding: 12px 0; border-top: 1px solid var(--bt-outline-soft); }

/* Motivationswaage */
.bt-scale { display: grid; gap: 8px; justify-items: center; text-align: center; }
.bt-scale svg { width: 100%; max-width: 520px; height: auto; display: block; overflow: visible; }
.bt-scale .bt-beam, .bt-scale .bt-pan, .bt-scale .bt-needle { transition: transform .9s cubic-bezier(.34, 1.36, .5, 1); }
.bt-scale--inactive svg { filter: grayscale(1); opacity: .55; }
.bt-value { font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
.bt-value--pro { color: var(--bt-primary); }
.bt-value--contra { color: var(--bt-contra); }
.bt-sum { border-radius: 999px; padding: 2px 12px; font-size: 13px; font-weight: 600; }
.bt-sum--pro { background: var(--bt-primary-soft); color: var(--bt-primary); }
.bt-sum--contra { background: var(--bt-contra-soft); color: var(--bt-contra); }
.bt-columns { display: grid; gap: 12px; grid-template-columns: 1fr; }
@container (min-width: 620px) { .bt-columns { grid-template-columns: 1fr 1fr; } }
.bt-column { border-radius: 12px; padding: 12px 14px; background: var(--bt-surface-low); display: flex; flex-direction: column; gap: 8px; }
.bt-side { font-size: 11px; font-weight: 700; letter-spacing: .05em; border-radius: 6px; padding: 1px 6px; }
.bt-side--pro { background: var(--bt-primary-soft); color: var(--bt-primary); }
.bt-side--contra { background: var(--bt-contra-soft); color: var(--bt-contra); }
.bt-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.bt-item { display: flex; gap: 8px; align-items: flex-start; background: var(--bt-surface); border: 1px solid var(--bt-outline-soft); border-radius: 10px; padding: 8px 10px; }
.bt-item__text { flex: 1; min-width: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
.bt-iconbtn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 999px; border: 0; background: transparent; color: var(--bt-muted); cursor: pointer; flex: none; }
.bt-iconbtn:hover { background: var(--bt-surface-high); color: var(--bt-text); }
.bt-iconbtn svg { width: 18px; height: 18px; fill: currentColor; }
.bt-stars { display: inline-flex; gap: 1px; align-items: center; color: #c48a00; white-space: nowrap; }
.bt-stars svg { width: 15px; height: 15px; fill: currentColor; }
.bt-stars .is-off { fill: var(--bt-outline-soft); }
.bt-stars--zero { color: var(--bt-muted); font-size: 12px; font-weight: 600; }
.bt-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.bt-chip { font: inherit; font-size: 13px; text-align: left; border: 1px solid var(--bt-outline-soft); background: var(--bt-surface); color: var(--bt-text); border-radius: 8px; padding: 5px 10px; cursor: pointer; }
.bt-chip:hover { border-color: var(--bt-primary); background: var(--bt-primary-soft); }
.bt-mini { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.bt-mini__bar { position: relative; flex: 1; min-width: 140px; height: 8px; border-radius: 999px; background: linear-gradient(90deg, var(--bt-primary) 0%, var(--bt-surface-high) 50%, var(--bt-contra) 100%); }
.bt-mini__dot { position: absolute; top: 50%; width: 18px; height: 18px; border-radius: 999px; background: var(--bt-surface); border: 3px solid var(--bt-text); transform: translate(-50%, -50%); transition: left .6s cubic-bezier(.34,1.36,.5,1); }
.bt-details { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; margin: 4px 0 0; font-size: 13px; }
.bt-details dt { color: var(--bt-muted); }
.bt-details dd { margin: 0; }
@media (prefers-reduced-motion: reduce) {
	.bt-scale .bt-beam, .bt-scale .bt-pan, .bt-scale .bt-needle, .bt-mini__dot { transition: none; }
}
`;

const STYLE_ID = 'oriso-addon-beratungstools-styles';

export const installStyles = (doc: Document): void => {
	if (doc.getElementById(STYLE_ID)) {
		return;
	}
	const style = doc.createElement('style');
	style.id = STYLE_ID;
	style.textContent = CSS;
	doc.head.appendChild(style);
};
