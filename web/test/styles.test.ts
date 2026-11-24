import { describe, expect, it } from 'vitest';
import { CSS } from '../src/styles.ts';

const focusRingSelector = () => {
	const rule = CSS.split('\n').find((line) => line.startsWith('.bt :focus-visible'));
	return rule!.slice(0, rule!.indexOf('{')).trim().replace(':focus-visible', '');
};

describe('focus ring', () => {
	it('is drawn on our own controls but not inside web kit fields, which have their own frame', () => {
		document.body.innerHTML = `
			<div class="bt">
				<button id="own">Speichern</button>
				<input id="time" type="time" />
				<div class="MuiInputBase-root"><input id="text" class="MuiInputBase-input" /></div>
				<div class="MuiInputBase-root"><textarea id="area" class="MuiInputBase-input"></textarea></div>
				<div class="MuiInputBase-root"><div id="select" role="combobox" class="MuiSelect-select MuiInputBase-input"></div></div>
				<div class="MuiInputBase-root"><input id="date" class="MuiInputBase-input" /><button id="calendar">Kalender</button></div>
			</div>`;
		const selector = focusRingSelector();
		const ringed = (id: string) => document.getElementById(id)!.matches(selector);
		expect(ringed('own')).toBe(true);
		expect(ringed('time')).toBe(true);
		for (const id of ['text', 'area', 'select', 'date', 'calendar']) {
			expect(ringed(id)).toBe(false);
		}
	});
});
