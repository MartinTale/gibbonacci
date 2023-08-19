import { gameContainer } from "..";
import { createButton } from "../components/button/button";
import { ProgressBar } from "../components/progress-bar/progress-bar";
import { el, mount, setTextContent, svgEl } from "../helpers/dom";
import { abbreviateNumber } from "../helpers/numbers";
import { easings, explode, tween, tweens } from "../systems/animation";
import { state } from "../systems/state";
import { SVGs } from "../systems/svgs";

import "./game.css";

const numbersFoundContainer = el("div.numbers-found");
const numbersFoundElements: HTMLElement[] = [];
let currentNumberElement: HTMLElement;
let checkCurrentNumberButton: HTMLElement;

export function initGame() {
	const gameNameElement = el("h1.name", "MonkeyBonacci");

	mount(gameContainer, gameNameElement);
	mount(gameContainer, numbersFoundContainer);
	renderNumbersFound();

	currentNumberElement = el("b.current", abbreviateNumber(state.numbersChecked));
	mount(gameContainer, currentNumberElement);

	checkCurrentNumberButton = createButton(
		"Check!",
		() => {
			if (state.numbersChecked >= state.nextFibonacciNumber) {
				state.numbersFound.push(state.nextFibonacciNumber);
				addNumberFound(state.nextFibonacciNumber);
				state.nextFibonacciNumber = getNextFibonacciNumber();
				progress.setValue(state.numbersFound.length);

				explode(160, 600, svgEl(SVGs.banana, "var(--color)"), 5);
				explode(160, 600, svgEl(SVGs["banana-peeled"], "var(--color)"), 5);
				explode(160, 600, svgEl(SVGs["banana-bunch"], "var(--color)"), 5);
			} else {
				explode(160, 680, el("span.question", "?"), 2);
			}

			state.numbersChecked += 1;
			setTextContent(currentNumberElement, abbreviateNumber(state.numbersChecked));
		},
		"primary",
	);
	checkCurrentNumberButton.classList.add("check-current-number");
	mount(gameContainer, checkCurrentNumberButton);

	const progress = new ProgressBar(gameContainer, 0, 100, 0);
	progress.container.style.position = "absolute";
	progress.container.style.bottom = "15px";
	progress.setValue(state.numbersFound.length);

	processGameState();
}

function processGameState() {
	const newProcessingTime = Date.now();
	// const secondsPassed = (newProcessingTime - state.lastProcessedAt) / 1000;

	Object.values(tweens).forEach((updateTween) => updateTween(newProcessingTime));
	// console.log(secondsPassed);

	// setters[DataKey.level](getters[DataKey.level]() + secondsPassed);

	state.lastProcessedAt = newProcessingTime;
	requestAnimationFrame(processGameState);
}

function renderNumbersFound() {
	numbersFoundElements.forEach((element) => element.remove());

	const lastNumbers = state.numbersFound.slice(-6);

	lastNumbers.forEach((number) => {
		const abbreviatedNumber = abbreviateNumber(number);

		const numberFoundElement = el("div.number-found", abbreviatedNumber);
		mount(numbersFoundContainer, numberFoundElement);
		numbersFoundElements.push(numberFoundElement);
	});

	updateNumbersFoundStyle();
}

function addNumberFound(number: number) {
	if (numbersFoundElements.length >= 6) {
		numbersFoundElements[0].remove();
		numbersFoundElements.shift();
	}

	const numberFoundElement = el("div.number-found", abbreviateNumber(number));
	mount(numbersFoundContainer, numberFoundElement);
	numbersFoundElements.push(numberFoundElement);

	tween(numberFoundElement, {
		from: {
			y: 400,
			scale: 1,
		},
		to: {
			y: 340,
			scale: 2,
		},
		duration: 250,
		easing: easings.easeOutExpo,
		onComplete: () => {
			tween(numberFoundElement, {
				from: {
					y: 340,
					scale: 2,
				},
				to: {
					y: 0,
					scale: 1,
				},
				duration: 1000,
				easing: easings.easeInOutExpo,
			});
		},
	});

	updateNumbersFoundStyle();
}

function updateNumbersFoundStyle() {
	const offset = numbersFoundElements.length > 5 ? 0 : 1;
	numbersFoundElements.forEach((element, index) => {
		element.style.opacity = `${1 - (numbersFoundElements.length - index - 1) * 0.2}`;
		element.style.bottom = `${(5 - index - offset) * 40}px`;
	});
}

function getNextFibonacciNumber() {
	if (state.numbersFound.length === 0) {
		return 0;
	}

	if (state.numbersFound.length === 1) {
		return 1;
	}

	if (state.numbersFound.length === 2) {
		return 2;
	}

	return state.numbersFound[state.numbersFound.length - 1] + state.numbersFound[state.numbersFound.length - 2];
}
