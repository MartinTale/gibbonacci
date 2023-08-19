import { gameContainer } from "..";
import { createButton } from "../components/button/button";
import { ProgressBar } from "../components/progress-bar/progress-bar";
import { el, mount, setTextContent, svgEl } from "../helpers/dom";
import { abbreviateNumber, random } from "../helpers/numbers";
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

				explode(
					[
						svgEl(SVGs.banana, "var(--color)"),
						svgEl(SVGs["banana-peeled"], "var(--color)"),
						svgEl(SVGs["banana-bunch"], "var(--color)"),
					],
					{
						x: () => 160,
						y: () => 600,
						scale: () => 1,
						rotate: () => 0,
					},
					{
						x: () => random(-150, 150),
						y: () => random(-550, 50),
						scale: () => random(5, 20) / 10,
						rotate: () => random(-360, 360),
					},
					10,
					2000,
				);
			} else {
				explode(
					getMathSymbolElements(),
					{
						x: () => 160,
						y: () => 680,
						scale: () => 1,
						rotate: () => 0,
					},
					{
						x: () => random(-150, 150),
						y: () => random(-150, 20),
						scale: () => random(10, 20) / 10,
						rotate: () => random(-45, 45),
					},
					5,
					1000,
				);
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
			y: 300,
			scale: 3,
		},
		duration: 250,
		easing: easings.easeOutExpo,
		onComplete: () => {
			tween(numberFoundElement, {
				from: {
					y: 300,
					scale: 3,
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

// https://www.calculators.org/math/html-math.php
const mathSymbols = [
	"?",
	"+",
	"-",
	"×",
	"÷",
	"=",
	"≠",
	"±",
	"<",
	">",
	"ƒ",
	"%",
	"∃",
	"∅",
	"∏",
	"∑",
	"√",
	"∛",
	"∜",
	"∞",
	"⊾",
	"⊿",
	"⋈",
	"Δ",
	"Θ",
	"Λ",
	"Φ",
	"Ψ",
	"Ω",
	"α",
	"β",
	"γ",
	"δ",
	"λ",
];
function getMathSymbolElements() {
	return mathSymbols.map((symbol) => el("span.math-symbol", symbol));
}
