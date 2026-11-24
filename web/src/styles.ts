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

.bt-linkbtn { font: inherit; font-size: 14px; font-weight: 600; color: var(--bt-primary); background: none; border: 0; padding: 4px 0; cursor: pointer; display: inline-flex; gap: 4px; align-items: center; width: fit-content; max-width: 100%; text-align: left; }
.bt-linkbtn:hover { text-decoration: underline; }
.bt-linkbtn svg, .bt-icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
.bt :focus-visible:not(.MuiInputBase-input, .MuiInputBase-root *, .MuiPickersInputBase-root *) { outline: 3px solid color-mix(in srgb, var(--bt-primary) 45%, transparent); outline-offset: 2px; }

.bt-grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
@container (min-width: 560px) { .bt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (min-width: 900px) { .bt-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.bt-toollist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.bt-toolrow { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; text-align: left; font: inherit; color: inherit; background: var(--bt-surface, #fff); border: 1px solid var(--bt-outline, #d8dcdc); border-radius: 12px; cursor: pointer; }
.bt-toolrow:hover { border-color: var(--bt-primary); }
.bt-toolrow:focus-visible { outline: 2px solid var(--bt-primary); outline-offset: 2px; }
.bt-toolrow__text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bt-toolrow__text > .bt-small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bt-toolrow__title { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.bt-toolrow__chevron { flex: none; font-size: 22px; line-height: 1; color: var(--bt-primary); }
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
/* Ampelmodell */
.bt-ol { margin: 0; padding-left: 22px; display: flex; flex-direction: column; gap: 4px; }
.bt-lamp { width: 16px; height: 16px; border-radius: 999px; flex: none; display: inline-block; box-shadow: inset 0 0 0 2px rgba(0, 0, 0, .18); }
.bt-lamp--red { background: #d32f2f; }
.bt-lamp--yellow { background: #f6c000; }
.bt-lamp--green { background: #2e7d32; }
.bt-legend { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
.bt-legend li { display: flex; gap: 8px; align-items: flex-start; }
.bt-legend li .bt-lamp { margin-top: 3px; }
.bt-light-wrap { display: grid; gap: 16px; grid-template-columns: 1fr; align-items: start; }
@container (min-width: 620px) { .bt-light-wrap { grid-template-columns: 11em minmax(0, 1fr); } }
.bt-light { display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 22px; background: #33393c; max-width: 560px; width: 100%; }
.bt-light__field { border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; border: 2px solid; }
.bt-light__field--red { background: #fdecea; border-color: #d32f2f; }
.bt-light__field--yellow { background: #fff6d6; border-color: #e0ad00; }
.bt-light__field--green { background: #e6f3e7; border-color: #2e7d32; }
.bt-light__head { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 15px; font-weight: 700; color: #1a1c1e; }
.bt-light__count { margin-left: auto; font-size: 12px; font-weight: 600; color: #4a5357; }
.bt-light__field .bt-muted { color: #4a5357; }
.bt-light__list { list-style: none; padding: 0 2px 0 0; margin: 0; display: flex; flex-direction: column; gap: 6px; max-height: 232px; overflow-y: auto; }
.bt-activity { display: flex; gap: 8px; align-items: flex-start; width: 100%; text-align: left; font: inherit; color: #1a1c1e; background: #fff; border: 1px solid rgba(0, 0, 0, .14); border-radius: 10px; padding: 8px 10px; }
.bt-activity--button { cursor: pointer; }
.bt-activity--button:hover { border-color: #1a1c1e; }
.bt-activity--new { border-color: #f77d28; }
/* Positives Wahrnehmen */
.bt-focus-target:focus { outline: none; }
.bt-points { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.bt-scheme { display: grid; gap: 16px; grid-template-columns: 1fr; align-items: start; }
@container (min-width: 620px) { .bt-scheme { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
.bt-remark { display: flex; gap: 8px; align-items: flex-start; width: 100%; text-align: left; font: inherit; color: var(--bt-text); background: var(--bt-surface); border: 1px solid var(--bt-outline-soft); border-radius: 10px; padding: 10px 12px; cursor: pointer; }
.bt-remark:hover { border-color: var(--bt-primary); }
.bt-remark[aria-pressed='true'] { border: 2px solid var(--bt-primary); background: var(--bt-primary-soft); padding: 9px 11px; }
.bt-remark__tone { font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; border-radius: 6px; padding: 1px 6px; flex: none; }
.bt-remark--negative .bt-remark__tone { background: var(--bt-contra-soft); color: #8a3c06; }
.bt-remark--positive .bt-remark__tone { background: var(--bt-primary-soft); color: var(--bt-primary); }
.bt-reaction { border-radius: 12px; padding: 12px 14px; background: var(--bt-surface-low); min-height: 100%; }
.bt-reaction__list { margin: 0; display: flex; flex-direction: column; gap: 2px; }
.bt-reaction__list dt { font-size: 13px; color: var(--bt-muted); margin-top: 8px; }
.bt-reaction__list dt:first-child { margin-top: 0; }
.bt-reaction__list dd { margin: 0; font-weight: 700; }
.bt-hint { border-left: 3px solid var(--bt-primary); padding: 4px 0 4px 12px; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }

.bt-alert { color: var(--bt-error); }
.bt-lead { font-weight: 600; }
.bt-plain { margin: 0; padding-left: 18px; }
.bt-quote { display: flex; flex-direction: column; gap: 2px; border-left: 4px solid var(--bt-primary-soft); background: var(--bt-surface-low); border-radius: 0 10px 10px 0; padding: 8px 12px; }
.bt-steps-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.bt-details--stacked { grid-template-columns: 1fr; gap: 8px; }
.bt-details--stacked dt { font-weight: 600; }
.bt-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
.bt-tab { font: inherit; font-size: 13px; font-weight: 600; border: 1px solid var(--bt-outline-soft); background: var(--bt-surface); color: var(--bt-muted); border-radius: 999px; padding: 3px 12px; cursor: pointer; }
.bt-tab[aria-pressed='true'] { background: var(--bt-primary); border-color: var(--bt-primary); color: var(--bt-on-primary); }

/* Notfallkoffer */
.bt-kit { display: grid; gap: 12px; grid-template-columns: 1fr; }
@container (min-width: 620px) { .bt-kit { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.bt-kit-tile { font: inherit; color: inherit; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 8px; min-height: 96px; padding: 14px 16px; border-radius: 12px; border: 1px solid var(--bt-outline-soft); background: var(--bt-surface); transition: border-color .15s, box-shadow .15s; }
.bt-kit-tile:hover { border-color: var(--bt-primary); box-shadow: 0 1px 4px rgba(0, 0, 0, .08); }
.bt-kit-tile__title { display: flex; gap: 10px; align-items: flex-start; font-weight: 700; line-height: 1.35; }
.bt-kit-tile__number { flex: none; width: 26px; height: 26px; border-radius: 999px; display: grid; place-items: center; font-size: 13px; background: var(--bt-primary-soft); color: var(--bt-primary); }
.bt-kit-tile__lines { display: flex; flex-direction: column; gap: 2px; padding-left: 36px; font-size: 13px; }
.bt-kit-tile__line { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bt-kit-tile__line::before { content: '• '; color: var(--bt-muted); }
.bt-kit-tile__empty, .bt-kit-tile__more { padding-left: 36px; font-size: 13px; color: var(--bt-muted); }
.bt-kit-tile__more { padding-left: 0; }
.bt-kit-row { display: flex; gap: 8px; align-items: flex-start; padding: 10px 0; border-top: 1px solid var(--bt-outline-soft); }
.bt-kit-row:first-child { border-top: 0; padding-top: 0; }
.bt-kit-row__fields { flex: 1; min-width: 0; display: grid; gap: 8px; grid-template-columns: 1fr; }
@container (min-width: 620px) { .bt-kit-row__fields:has(> :nth-child(2)) { grid-template-columns: 1fr 200px; } }
.bt-kit-row .bt-iconbtn { margin-top: 26px; }
.bt-request svg { fill: var(--bt-outline); }
.bt-done { display: inline-flex; gap: 6px; align-items: center; color: #1e6b2b; font-weight: 600; }
.bt-done svg { width: 20px; height: 20px; fill: #2e7d32; flex: none; }

/* Risikosituationen */
.bt-risk { display: grid; gap: 8px 16px; grid-template-columns: 1fr; padding: 12px; border: 1px solid var(--bt-outline-soft); border-radius: 10px; background: var(--bt-surface); }
.bt-risk__cell { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.bt-risk__actions { display: flex; justify-content: flex-end; }
@container (min-width: 760px) {
	.bt-risk { grid-template-columns: minmax(0, 3fr) minmax(110px, 1fr) minmax(0, 3fr) minmax(150px, 1.4fr) auto; align-items: start; }
}
.bt-level { display: inline-flex; gap: 6px; align-items: center; font-size: 13px; font-weight: 600; white-space: nowrap; }
.bt-level__bars { display: inline-flex; gap: 2px; align-items: flex-end; }
.bt-level__bars span { width: 4px; border-radius: 2px; background: var(--bt-outline-soft); }
.bt-level__bars span:nth-child(1) { height: 6px; }
.bt-level__bars span:nth-child(2) { height: 9px; }
.bt-level__bars span:nth-child(3) { height: 12px; }
.bt-level__bars span:nth-child(4) { height: 15px; }
.bt-level--1 .is-on { background: #2e7d32; }
.bt-level--2 .is-on { background: #c48a00; }
.bt-level--3 .is-on { background: #c25e22; }
.bt-level--4 .is-on { background: var(--bt-error); }
/* Diaries and Aktiv sein */
.bt-field { display: flex; flex-direction: column; gap: 6px; }
.bt-field label { font-weight: 600; }
.bt-field input { font: inherit; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--bt-outline); background: var(--bt-surface); color: inherit; max-width: 12em; }
.bt-fields { display: grid; gap: 12px; grid-template-columns: 1fr; align-items: end; }
@container (min-width: 560px) { .bt-fields { grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); } }
.bt-weeknav { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.bt-weeknav .bt-title { text-align: center; font-size: 15px; }
.bt-iconbtn:disabled { opacity: .35; cursor: default; background: transparent; }
.bt-navtabs { display: flex; gap: 4px; flex-wrap: wrap; border-bottom: 1px solid var(--bt-outline-soft); }
.bt-navtab { font: inherit; font-size: 14px; font-weight: 600; padding: 8px 12px; background: none; border: 0; border-bottom: 3px solid transparent; color: var(--bt-muted); cursor: pointer; }
.bt-navtab[aria-current='page'], .bt-navtab[aria-selected='true'] { color: var(--bt-primary); border-bottom-color: var(--bt-primary); }
.bt-week { display: flex; flex-direction: column; }
.bt-week__row { display: grid; grid-template-columns: 1fr; gap: 6px; padding: 10px 0; border-top: 1px solid var(--bt-outline-soft); align-items: center; }
.bt-week__row--head { display: none; }
.bt-week__day { font-weight: 700; }
.bt-week__day.is-today { color: var(--bt-primary); }
.bt-week__cell { display: flex; gap: 8px; align-items: center; justify-content: space-between; min-width: 0; }
.bt-week__topic { font-size: 13px; color: var(--bt-muted); }
@container (min-width: 600px) {
	.bt-week__row { grid-template-columns: 7.5em repeat(var(--bt-cols, 1), minmax(0, 1fr)); gap: 12px; }
	.bt-week__row--head { display: grid; border-top: 0; font-size: 13px; font-weight: 700; color: var(--bt-muted); align-items: end; }
	.bt-week__topic { display: none; }
	.bt-week__cell { justify-content: flex-start; }
}
.bt-yesno { display: inline-flex; border: 1px solid var(--bt-outline); border-radius: 999px; overflow: hidden; flex: none; }
.bt-yesno button { font: inherit; font-size: 13px; font-weight: 600; padding: 4px 14px; border: 0; background: var(--bt-surface); color: var(--bt-text); cursor: pointer; }
.bt-yesno button + button { border-left: 1px solid var(--bt-outline); }
.bt-yesno button[aria-checked='true'] { background: var(--bt-primary); color: var(--bt-on-primary); }
.bt-yesno button:disabled { cursor: default; opacity: .45; }
.bt-snippet { color: var(--bt-muted); font-size: 14px; overflow-wrap: anywhere; }
.bt-plan { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; text-align: left; font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.bt-plan:hover strong { text-decoration: underline; }
.bt-planned__when { font-weight: 600; white-space: nowrap; min-width: 8.5em; }
.bt-daytiles { display: grid; gap: 8px; grid-template-columns: 1fr; }
@container (min-width: 560px) { .bt-daytiles { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (min-width: 900px) { .bt-daytiles { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.bt-daytile { display: flex; flex-direction: column; gap: 6px; text-align: left; font: inherit; color: inherit; border: 1px solid var(--bt-outline-soft); border-radius: 10px; padding: 10px 12px; background: var(--bt-surface); }
.bt-daytile--new { border-color: #f77d28; }
.bt-daytile--empty { background: var(--bt-surface-low); }
.bt-mood { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--bt-muted); }
.bt-mood svg { width: 24px; height: 24px; flex: none; }
.bt-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.bt-moods { display: flex; flex-wrap: wrap; gap: 8px; border: 0; padding: 0; margin: 0; }
.bt-moods legend { font-weight: 600; margin-bottom: 6px; padding: 0; }
.bt-moods label { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 84px; padding: 8px 4px; border: 1px solid var(--bt-outline-soft); border-radius: 10px; cursor: pointer; font-size: 12px; text-align: center; background: var(--bt-surface); }
.bt-moods label svg { width: 32px; height: 32px; }
.bt-moods input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.bt-moods input:checked + label { border-color: var(--bt-primary); background: var(--bt-primary-soft); font-weight: 700; }
.bt-moods input:focus-visible + label { outline: 3px solid color-mix(in srgb, var(--bt-primary) 45%, transparent); outline-offset: 2px; }
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
