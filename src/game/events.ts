import { gameContainer } from "..";
import { setGameColorFromLevel } from "../helpers/colors";
import { setTextContent } from "../helpers/dom";
import { abbreviateNumber } from "../helpers/numbers";
import { state } from "../systems/state";
import { bananasResourceAmountElement, meMonkey, monkeys, numbersResourceAmountElement, progress } from "./game";

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
	meMonkey.renderAffordability();
}

export function onMonkeyChange() {
	gameContainer.classList.toggle(
		"all-monkeys",
		state.monkeys.every((monkey) => monkey.awake),
	);
	gameContainer.classList.toggle("me-awake", state.meMonkey.awake);
}

export function onNumbersFoundChange() {
	progress.setValue(state.numbersFound.length);
	setGameColorFromLevel(state.numbersFound.length);
}
