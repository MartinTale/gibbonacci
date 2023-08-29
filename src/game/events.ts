import { gameContainer } from "..";
import { openModal } from "../components/modal/modal";
import { maxNumbers, setGameColorFromLevel } from "../helpers/colors";
import { el, setTextContent } from "../helpers/dom";
import { abbreviateNumber } from "../helpers/numbers";
import { state } from "../systems/state";
import {
	autoMonkey,
	bananasResourceAmountElement,
	endTime,
	meMonkey,
	monkeys,
	numbersResourceAmountElement,
	progress,
} from "./game";

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
	autoMonkey.renderAffordability();
}

export function onMonkeyChange() {
	gameContainer.classList.toggle(
		"all-monkeys",
		state.monkeys.every((monkey) => monkey.awake),
	);
	gameContainer.classList.toggle("me-awake", state.meMonkey.awake);
	gameContainer.classList.toggle("auto-awake", state.autoMonkey.awake);
}

export function onNumbersFoundChange() {
	progress.setValue(state.numbersFound.length);
	setGameColorFromLevel(state.numbersFound.length);

	if (state.numbersFound.length >= maxNumbers && state.endAt === null) {
		state.endAt = Date.now();
		onEndChange();
	}

	document.body.classList.toggle("is-end", state.endAt !== null);
}

export function onEndChange() {
	if (state.endAt !== null) {
		monkeys[0].rootElement.style.top = "680px";
		monkeys[1].rootElement.style.top = "680px";
		monkeys[2].rootElement.style.top = "680px";
		monkeys[2].rootElement.style.left = "110px";
		monkeys[3].rootElement.style.top = "680px";
		monkeys[3].rootElement.style.left = "250px";
		autoMonkey.rootElement.style.top = "600px";

		const duration = state.endAt - state.startAt;
		const seconds = Math.floor(duration / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			setTextContent(endTime, `${hours}h ${minutes % 60}m ${seconds % 60}s`);
		} else if (minutes > 0) {
			setTextContent(endTime, `${minutes}m ${seconds % 60}s`);
		} else {
			setTextContent(endTime, `${seconds}s`);
		}
	}
}

export function onUpgradeChange() {
	if (state.autoMonkey.awake === false && state.meMonkey.level >= 1) {
		openModal(
			gameContainer,
			"New Boss!",
			[
				el("p", "Now, that you're a monkey someone else has taken control of the operation!"),
				el("br"),
				el("p", "They seem to automatically upgrade us now!"),
			],
			[
				{
					content: "I'm monkey!",
					type: "primary",
					onClickCallback: () => {
						autoMonkey.buyUpgrade();
					},
				},
			],
			() => {
				autoMonkey.buyUpgrade();
			},
		);
	}
}
