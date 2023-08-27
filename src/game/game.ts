import "./game.css";
import { gameContainer } from "..";
import { createButton } from "../components/button/button";
import { openModal } from "../components/modal/modal";
import { ProgressBar } from "../components/progress-bar/progress-bar";
import { el, mount, setTextContent, svgEl } from "../helpers/dom";
import { abbreviateNumber, getMathSymbolElements, random } from "../helpers/numbers";
import { easings, explode, tween, tweens } from "../systems/animation";
import { playSound, sounds } from "../systems/music";
import { state } from "../systems/state";
import { SVGs } from "../systems/svgs";
import { onBananaResourceChange, onMonkeyChange, onNumberResourceChange, onNumbersFoundChange } from "./events";
import { Monkey } from "./monkey";

export const maxNumbers = 204;

const numbersFoundContainer = el("div.numbers-found");
const numbersFoundElements: HTMLElement[] = [];
export let currentNumberElement: HTMLElement;
let checkCurrentNumberButton: HTMLElement;
const checkNumberLabel = el("b.is-fibonacci", "Is Fibonacci?");

export let progress: ProgressBar;

export const bananasResourceAmountElement = el("b");
export const numbersResourceAmountElement = el("b");
export const monkeys: Monkey[] = [];
export let meMonkey: Monkey;

export function initGame() {
	const gameNameElement = el("h1.name", "MonkeyBonacci");

	mount(gameContainer, gameNameElement);
	mount(gameContainer, numbersFoundContainer);
	renderNumbersFound();

	currentNumberElement = el("b.current", abbreviateNumber(state.numbersChecked));
	mount(gameContainer, currentNumberElement);
	mount(gameContainer, checkNumberLabel);

	checkCurrentNumberButton = createButton(
		"Check!",
		() => {
			if (state.numbersChecked >= state.nextFibonacciNumber) {
				playSound(sounds.victory2);
				state.numbersFound.push(state.nextFibonacciNumber);
				addNumberFound(state.nextFibonacciNumber);
				state.nextFibonacciNumber = getNextFibonacciNumber();
				onNumbersFoundChange();

				state.bananas += 1;
				onBananaResourceChange();

				explode(
					[
						svgEl(SVGs.banana, "var(--color)"),
						svgEl(SVGs["banana-peeled"], "var(--color)"),
						svgEl(SVGs["banana-bunch"], "var(--color)"),
					],
					{
						x: () => 160,
						y: () => 550,
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
						y: () => 665,
						scale: () => 1,
						rotate: () => 0,
					},
					{
						x: () => random(-100, 100),
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

			state.numbers += 1;
			onNumberResourceChange();
		},
		"primary",
	);
	checkCurrentNumberButton.classList.add("check-current-number");
	mount(gameContainer, checkCurrentNumberButton);

	meMonkey = new Monkey(gameContainer, 180, 680, -1, true);

	const meMonkeyButton = createButton(
		svgEl(SVGs.monkey, "var(--color)"),
		() => {
			playSound(sounds.tap);
			openModal(
				gameContainer,
				"Me Monkey!",
				[el("p", "Turn yourself into a monkey?"), el("br"), el("p", "..."), el("br"), el("b", "Really?")],
				[
					{
						type: "primary",
						content: "Yes, please!",
						onClickCallback: () => {
							meMonkey.buyUpgrade();
						},
					},
				],
				null,
			);
		},
		"primary",
	);
	meMonkeyButton.classList.add("me-monkey");
	mount(gameContainer, meMonkeyButton);

	progress = new ProgressBar(gameContainer, 0, maxNumbers, 0);
	progress.container.style.position = "absolute";
	progress.container.style.top = "60px";
	onNumbersFoundChange();

	onMonkeyChange();

	monkeys.push(new Monkey(gameContainer, 40, 600, 0));
	monkeys.push(new Monkey(gameContainer, 320, 600, 1));
	monkeys.push(new Monkey(gameContainer, 90, 520, 2));
	monkeys.push(new Monkey(gameContainer, 270, 520, 3));

	const bananasElement = el("div.bananas", [
		svgEl(SVGs["banana-bunch"], "var(--color)"),
		bananasResourceAmountElement,
	]);
	onBananaResourceChange();
	const numbersElement = el("div.numbers", [svgEl(SVGs.turd, "var(--color)"), numbersResourceAmountElement]);
	onNumberResourceChange();

	mount(gameContainer, el("div.resources", [bananasElement, numbersElement]));

	processGameState();
}

function processGameState() {
	const newProcessingTime = Date.now();
	const secondsPassed = (newProcessingTime - state.lastProcessedAt) / 1000;

	Object.values(tweens).forEach((updateTween) => updateTween(newProcessingTime));

	monkeys.forEach((monkey) => monkey.process(secondsPassed));

	state.lastProcessedAt = newProcessingTime;
	requestAnimationFrame(processGameState);
}

function renderNumbersFound() {
	numbersFoundElements.forEach((element) => element.remove());

	const lastNumbers = state.numbersFound.slice(-6);

	lastNumbers.forEach((number) => {
		const abbreviatedNumber = abbreviateNumber(number, 8);

		const numberFoundElement = el("div.number-found", abbreviatedNumber);
		mount(numbersFoundContainer, numberFoundElement);
		numbersFoundElements.push(numberFoundElement);
	});

	updateNumbersFoundStyle();
}

export function addNumberFound(number: number) {
	if (numbersFoundElements.length >= 6) {
		numbersFoundElements[0].remove();
		numbersFoundElements.shift();
	}

	const numberFoundElement = el("div.number-found", abbreviateNumber(number, 8));
	mount(numbersFoundContainer, numberFoundElement);
	numbersFoundElements.push(numberFoundElement);

	tween(numberFoundElement, {
		from: {
			y: 300,
			scale: 1,
		},
		to: {
			y: 125,
			scale: 3,
		},
		duration: 500,
		easing: easings.easeOutExpo,
		onComplete: () => {
			tween(numberFoundElement, {
				from: {
					y: 125,
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

export function getNextFibonacciNumber() {
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
