import { setTextContent } from "../helpers/dom";
import { abbreviateNumber } from "../helpers/numbers";
import { state } from "../systems/state";
import { bananasResourceAmountElement, monkeys, numbersResourceAmountElement } from "./game";

export function onNumberResourceChange() {
	setTextContent(numbersResourceAmountElement, abbreviateNumber(state.numbers));

	monkeys.forEach((monkey) => {
		monkey.renderAffordability();
	});
}

export function onBananaResourceChange() {
	setTextContent(bananasResourceAmountElement, abbreviateNumber(state.bananas));
	monkeys.forEach((monkey) => {
		monkey.renderAffordability();
	});
}
