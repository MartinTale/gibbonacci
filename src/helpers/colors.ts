import { updateFireflyColor } from "../components/fireflies/fireflies";

type RGB = { r: number; g: number; b: number };

export const colors = ["#D1D5D8", "#41A85F", "#2C82C9", "#9365B8", "#FAC51C", "#E25041"];

// const colorsPerIndex = 20;
// let colorIndex = 0;
// setInterval(() => {
// 	colorIndex++;

// 	const realColorIndex = Math.min(colors.length - 1, Math.floor(colorIndex / colorsPerIndex));
// 	const color = getColorFromRange(hexToRgb(colors[realColorIndex]), hexToRgb(colors[Math.min(colors.length - 1, realColorIndex + 1)]), (colorIndex % colorsPerIndex) / colorsPerIndex);

// 	setGameColor(rgbToHex(color.r, color.g, color.b));
// }, 100);

export function setGameColor(newHexColor: string) {
	const rgbColor = hexToRgb(newHexColor);

	const bg =
		"rgb(" +
		Math.max(0, rgbColor.r * 0.25) +
		"," +
		Math.max(0, rgbColor.g * 0.25) +
		"," +
		Math.max(0, rgbColor.b * 0.25) +
		")";
	const color =
		"rgb(" +
		Math.min(255, rgbColor.r * 1.5) +
		"," +
		Math.min(255, rgbColor.g * 1.5) +
		"," +
		Math.min(255, rgbColor.b * 1.5) +
		")";
	const shadow =
		"rgb(" +
		Math.min(255, rgbColor.r * 1.2) +
		"," +
		Math.min(255, rgbColor.g * 1.2) +
		"," +
		Math.min(255, rgbColor.b * 1.2) +
		")";

	document.documentElement.style.setProperty("--bg", bg);
	document.documentElement.style.setProperty("--color", color);
	document.documentElement.style.setProperty("--shadow", shadow);

	updateFireflyColor(newHexColor);
}

globalThis.setGameColor = setGameColor;

export function hexToRgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return {
		r: parseInt(result![1], 16),
		g: parseInt(result![2], 16),
		b: parseInt(result![3], 16),
	};
}

function componentToHex(c) {
	var hex = Math.floor(c).toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getColorFromRange(first: RGB, second: RGB, percentage: number) {
	let result: RGB = { r: 0, g: 0, b: 0 };
	Object.keys(first).forEach((key) => {
		let start = first[key];
		let end = second[key];
		let offset = (start - end) * percentage;
		if (offset >= 0) {
			Math.abs(offset);
		}
		result[key] = start - offset;
	});
	return result;
}
