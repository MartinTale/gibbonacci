const tiers = ["", "K", "M", "B", "T", "Q"];

export function abbreviateNumber(
	value: number,
	minExp = 3,
	removeZeros = false,
	roundValue: false | 0 | 1 | -1 = 0,
): string {
	if (value < 0) {
		return "-" + abbreviateNumber(-value, minExp);
	}

	if (roundValue === 0) {
		value = Math.round(value);
	} else if (roundValue === 1) {
		value = Math.ceil(value);
	} else if (roundValue === -1) {
		value = Math.floor(value);
	}

	const exp = Math.floor(Math.log10(value));

	if (exp < minExp) {
		return value.toLocaleString();
	}

	const divider = Math.pow(10, exp);
	let expValue = value / divider;
	let formattedExpValue = expValue.toFixed(2);

	const tier = Math.floor(exp / 3);

	const suffix = tiers[tier];

	if (suffix) {
		expValue *= Math.pow(10, exp % 3);
		formattedExpValue = expValue.toFixed(2 - (exp % 3));
	}

	if (removeZeros) {
		formattedExpValue = removeTrailingZeros(formattedExpValue);
	}

	if (!suffix) {
		return formattedExpValue + "e" + exp;
	}

	return formattedExpValue + suffix;
}

export function removeTrailingZeros(value: string): string {
	return value.replace(/0+$/, "").replace(/\.$/, "");
}

export function random(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
