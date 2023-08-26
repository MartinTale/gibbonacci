import "./monkey.css";
import { el, mount, setTextContent, svgEl } from "../helpers/dom";
import { SVGs } from "../systems/svgs";
import { MonkeyData, state } from "../systems/state";
import { easings, explode, tween } from "../systems/animation";
import { abbreviateNumber, getMathSymbolElements, random, randomNegativeOrPositiveOne } from "../helpers/numbers";
import { onBananaResourceChange, onNumberResourceChange } from "./events";
import { playSound, sounds } from "../systems/music";
import { addNumberFound, currentNumberElement, getNextFibonacciNumber, progress } from "./game";

export class Monkey {
	rootElement: HTMLElement;
	sleepElement: HTMLElement;
	monkeyElement: HTMLElement;
	costBananaElement: HTMLElement;
	costNumberElement: HTMLElement;
	costAmountElement: HTMLElement;
	costElement: HTMLElement;
	levelElement: HTMLElement;

	data: MonkeyData;

	timeAccumulated: number = 0;

	constructor(
		public parentContainer: HTMLElement,
		public x: number,
		public y: number,
		public index: number,
	) {
		this.sleepElement = el("div.sleep", svgEl(SVGs["night-sleep"], "var(--color)"));
		this.levelElement = el("b.level", "1");
		this.monkeyElement = el("div.monkey", [svgEl(SVGs.monkey, "var(--color)"), this.levelElement]);
		this.costBananaElement = svgEl(SVGs.banana, "var(--color)");
		this.costNumberElement = svgEl(SVGs.hashtag, "var(--color)");
		this.costAmountElement = el("b");
		this.costElement = el("div.cost", [this.costBananaElement, this.costNumberElement, this.costAmountElement]);
		this.rootElement = el("div.monkey-container", [this.sleepElement, this.monkeyElement, this.costElement]);

		this.rootElement.style.left = `${x}px`;
		this.rootElement.style.top = `${y}px`;

		this.data = state.monkeys[index];

		this.renderMonkeyState();
		this.renderMonkeyLevel();
		this.renderCost();
		this.renderAffordability();

		this.rootElement.onclick = () => {
			this.buyUpgrade();
		};

		mount(parentContainer, this.rootElement);

		setTimeout(
			() => {
				this.playMonkeyCheckAnimation();
			},
			random(0, 1000 / Math.min(5, this.data.level)),
		);
	}

	renderMonkeyState() {
		this.rootElement.classList.toggle("active", this.data.awake);
	}

	renderMonkeyLevel() {
		setTextContent(this.levelElement, abbreviateNumber(Math.pow(2, this.data.level - 1)));
	}

	playMonkeyCheckAnimation() {
		if (this.data.awake) {
			explode(
				getMathSymbolElements(),
				{
					x: () => this.x - 25,
					y: () => this.y - 25,
					scale: () => 1,
					rotate: () => 0,
				},
				{
					x: () => random(40, 60) * randomNegativeOrPositiveOne(),
					y: () => random(-15, 15),
					scale: () => random(8, 10) / 10,
					rotate: () => random(-45, 45),
				},
				1,
				1000,
			);
		}

		setTimeout(
			() => {
				this.playMonkeyCheckAnimation();
			},
			1000 / Math.min(5, this.data.level),
		);
	}

	getCost() {
		if (this.data.awake === false) {
			return [5, 0];
		} else {
			return [100 * Math.pow(2, this.data.level), 1];
		}
	}

	renderCost() {
		const cost = this.getCost();

		this.costBananaElement.classList.toggle("hidden", cost[1] === 1);
		this.costNumberElement.classList.toggle("hidden", cost[1] === 0);

		setTextContent(this.costAmountElement, abbreviateNumber(cost[0]));
	}

	renderAffordability() {
		this.rootElement.classList.toggle("can-afford", this.canAfford());
	}

	canAfford() {
		const cost = this.getCost();

		if (cost[1] === 0) {
			return state.bananas >= cost[0];
		} else {
			return state.numbers >= cost[0];
		}
	}

	buyUpgrade() {
		if (!this.canAfford()) {
			return;
		}

		playSound(sounds.tap);

		const cost = this.getCost();

		if (cost[1] === 0) {
			state.bananas -= cost[0];
			onBananaResourceChange();
		} else {
			state.numbers -= cost[0];
			onNumberResourceChange();
		}

		if (this.data.awake === false) {
			this.data.awake = true;
			this.renderMonkeyState();
		} else {
			this.data.level += 1;
		}

		this.renderMonkeyLevel();
		this.renderCost();
		this.renderAffordability();

		tween(this.rootElement, {
			from: {
				x: 0,
				y: 0,
				scale: 1,
				rotate: 0,
			},
			to: {
				x: 0,
				y: -10,
				scale: 1.4,
				rotate: 0,
			},
			duration: 200,
			easing: easings.easeInOutExpo,
			onComplete: () => {
				tween(this.rootElement, {
					from: {
						x: 0,
						y: -10,
						scale: 1.4,
						rotate: 0,
					},
					to: {
						x: 0,
						y: 0,
						scale: 1,
						rotate: 0,
					},
					duration: 800,
					easing: easings.easeOutBounce,
				});
			},
		});
	}

	process(time: number) {
		if (this.data.awake === false) {
			return;
		}

		this.timeAccumulated += time;

		if (this.timeAccumulated > 1) {
			const timeUsed = Math.floor(this.timeAccumulated);

			this.timeAccumulated -= timeUsed;

			this.findNumbers(timeUsed * Math.pow(2, this.data.level - 1));
		}
	}

	findNumbers(numbers: number) {
		state.numbersChecked += numbers;

		if (state.numbersChecked >= state.nextFibonacciNumber) {
			playSound(sounds.victory2);
			state.numbersFound.push(state.nextFibonacciNumber);
			addNumberFound(state.nextFibonacciNumber);
			state.nextFibonacciNumber = getNextFibonacciNumber();
			progress.setValue(state.numbersFound.length);

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
		}

		setTextContent(currentNumberElement, abbreviateNumber(state.numbersChecked));

		state.numbers += 1;
		onNumberResourceChange();
	}
}
