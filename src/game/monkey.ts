import "./monkey.css";
import { el, mount, setTextContent, svgEl } from "../helpers/dom";
import { SVGs } from "../systems/svgs";
import { MonkeyData, state } from "../systems/state";
import { easings, explode, tween } from "../systems/animation";
import { abbreviateNumber, getMathSymbolElements, random, randomNegativeOrPositiveOne } from "../helpers/numbers";
import {
	onBananaResourceChange,
	onMonkeyChange,
	onNumberResourceChange,
	onNumbersFoundChange,
	onUpgradeChange,
} from "./events";
import { playSound, sounds } from "../systems/music";
import { addNumberFound, currentNumberElement, getNextFibonacciNumber, meMonkey, monkeys } from "./game";

const intervals = [10, 7.5, 5, 3.5, 2, 1];

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
	scaleMultiplier = 1;

	constructor(
		public parentContainer: HTMLElement,
		public x: number,
		public y: number,
		public index: number,
		public type: "me" | "auto" | "other" = "other",
	) {
		this.sleepElement = el("div.sleep", svgEl(SVGs["night-sleep"], "var(--color)"));
		this.levelElement = el("b.level", "1");
		const monkeySVG = type === "auto" ? svgEl(SVGs.gorilla, "var(--color)") : svgEl(SVGs.monkey, "var(--color)");
		this.monkeyElement = el("div.monkey", [monkeySVG, this.levelElement]);
		this.costBananaElement = svgEl(SVGs["banana-bunch"], "var(--color)");
		this.costNumberElement = svgEl(SVGs.turd, "var(--color)");
		this.costAmountElement = el("b");
		this.costElement = el("div.cost", [this.costBananaElement, this.costNumberElement, this.costAmountElement]);
		this.rootElement = el("div.monkey-container.monkey-" + index, [
			this.sleepElement,
			this.monkeyElement,
			this.costElement,
		]);

		this.rootElement.style.left = `${x}px`;
		this.rootElement.style.top = `${y}px`;

		if (type === "me") {
			this.rootElement.classList.add("me");
			this.data = state.meMonkey;
		} else if (type === "auto") {
			this.scaleMultiplier = 1.5;
			this.rootElement.classList.add("auto");
			this.data = state.autoMonkey;
		} else {
			this.data = state.monkeys[index];
		}

		this.renderMonkeyState();
		this.renderMonkeyLevel();
		this.renderCost();
		this.renderAffordability();

		this.rootElement.onclick = () => {
			this.buyUpgrade();
		};

		mount(parentContainer, this.rootElement);

		if (type === "me") {
			setTimeout(
				() => {
					this.playMonkeyThrowBananaAnimation();
				},
				random(0, 1000 / Math.min(5, this.data.level)),
			);
		} else if (type === "auto") {
			setTimeout(
				() => {
					this.playMonkeyUpgradeAnimation();
				},
				(intervals[this.data.level] ?? intervals[intervals.length - 1]) * 1000,
			);
			this.playMonkeyPoopAnimation();
		} else {
			setTimeout(
				() => {
					this.playMonkeyCheckAnimation();
				},
				random(0, 1000 / Math.min(5, this.data.level)),
			);
		}
	}

	renderMonkeyState() {
		this.rootElement.classList.toggle("active", this.data.awake && state.endAt === null);
	}

	renderMonkeyLevel() {
		if (this.type === "me") {
			setTextContent(this.levelElement, "x" + abbreviateNumber(1 + this.data.level));
		} else if (this.type === "auto") {
			let interval = intervals[this.data.level] ?? intervals[intervals.length - 1];
			setTextContent(this.levelElement, interval + "s");
		} else {
			setTextContent(
				this.levelElement,
				abbreviateNumber(Math.pow(2, this.data.level) * (state.meMonkey.level + 1)),
			);
		}
	}

	playMonkeyCheckAnimation() {
		if (state.endAt !== null) {
			return;
		}

		if (this.data.awake) {
			explode(
				getMathSymbolElements(),
				{
					x: () => this.x - 25,
					y: () => this.y - 25,
					scale: () => 0.25,
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

	playMonkeyThrowBananaAnimation() {
		if (state.endAt !== null) {
			return;
		}

		const targetLocation = [
			[-140, -75],
			[140, -75],
			[-90, -150],
			[90, -150],
		][random(0, 3)];

		if (this.data.awake && this.type === "me") {
			explode(
				svgEl(SVGs.banana, "var(--color)"),
				{
					x: () => this.x - 25,
					y: () => this.y - 25,
					scale: () => 0.25,
					rotate: () => 0,
				},
				{
					x: () => targetLocation[0],
					y: () => targetLocation[1],
					scale: () => random(10, 15) / 10,
					rotate: () => random(-90, 90),
				},
				1,
				1000,
			);
		}

		setTimeout(
			() => {
				this.playMonkeyThrowBananaAnimation();
			},
			1000 / Math.min(5, 1 + this.data.level),
		);
	}

	playMonkeyPoopAnimation() {
		if (state.endAt !== null) {
			return;
		}

		if (this.data.awake) {
			explode(
				svgEl(SVGs.turd, "var(--color)"),
				{
					x: () => this.x - 40,
					y: () => this.y - 25,
					scale: () => 0.25,
					rotate: () => 0,
				},
				{
					x: () => random(-40, -80),
					y: () => random(-15, 15),
					scale: () => random(5, 7) / 10,
					rotate: () => random(-45, 45),
				},
				1,
				1000,
			);
		}

		setTimeout(
			() => {
				this.playMonkeyPoopAnimation();
			},
			1000 / Math.min(5, 1 + this.data.level),
		);
	}

	playMonkeyUpgradeAnimation() {
		if (state.endAt !== null) {
			return;
		}

		let index = random(0, 4);

		if (index === 4 && state.bananas <= 10 && state.autoMonkey.level < 5) {
			index = random(0, 3);
		}

		const targetLocation = [
			[-140, 165, 1],
			[140, 165, 1],
			[-90, 85, 1],
			[90, 85, 1],
			[0, 250, 0],
		][index];

		if (this.data.awake && this.type === "auto") {
			explode(
				targetLocation[2] === 0 ? svgEl(SVGs.banana, "var(--color)") : svgEl(SVGs.turd, "var(--color)"),
				{
					x: () => this.x - 25,
					y: () => this.y - 25,
					scale: () => 0.25,
					rotate: () => 0,
				},
				{
					x: () => targetLocation[0],
					y: () => targetLocation[1],
					scale: () => random(10, 15) / 10,
					rotate: () => random(-90, 90),
				},
				1,
				2000,
				() => {
					if (index === 4) {
						meMonkey.buyUpgrade();
					} else {
						monkeys[index].buyUpgrade();
					}
				},
			);
		}

		setTimeout(
			() => {
				this.playMonkeyUpgradeAnimation();
			},
			(intervals[this.data.level] ?? intervals[intervals.length - 1]) * 1000,
		);
	}

	getCost() {
		if (this.type === "me") {
			if (this.data.awake === false) {
				return [0, 0];
			} else {
				if (this.data.level === 0) {
					return [3, 0];
				} else {
					return [5, 0];
				}
			}
		} else if (this.type === "auto") {
			if (this.data.awake === false) {
				return [0, 0];
			} else {
				const costs = [2, 4, 6, 8, 10];
				if (this.data.level <= 4) {
					return [costs[this.data.level], 0];
				} else {
					return [0, 0];
				}
			}
		} else {
			if (this.data.awake === false) {
				return [5, 0];
			} else {
				return [100 * Math.pow(2, this.data.level - 1), 1];
			}
		}
	}

	renderCost() {
		const cost = this.getCost();

		this.costBananaElement.classList.toggle("hidden", cost[1] === 1);
		this.costNumberElement.classList.toggle("hidden", cost[1] === 0);

		if (cost[0] > 0) {
			setTextContent(this.costAmountElement, abbreviateNumber(cost[0]));
		} else {
			this.costBananaElement.classList.toggle("hidden", true);
			this.costNumberElement.classList.toggle("hidden", true);
			setTextContent(this.costAmountElement, "");
		}
	}

	renderAffordability() {
		this.rootElement.classList.toggle("can-afford", this.canAfford());
	}

	canAfford() {
		const cost = this.getCost();

		if (cost[0] === 0 && this.data.level > 0) {
			return false;
		}

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

		const cost = this.getCost();

		if (cost[0] === 0 && this.data.level > 0) {
			return;
		}

		playSound(sounds.tap);

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
			onMonkeyChange();
		} else {
			this.data.level += 1;
		}

		this.renderMonkeyLevel();
		this.renderCost();
		this.renderAffordability();

		this.popUp();

		onUpgradeChange();

		if (this.type === "me") {
			monkeys.forEach((monkey) => {
				monkey.renderMonkeyLevel();
				monkey.popUp();
			});
		}
	}

	popUp() {
		tween(this.rootElement, {
			from: {
				x: 0,
				y: 0,
				scale: 1 * this.scaleMultiplier,
				rotate: 0,
			},
			to: {
				x: 0,
				y: -10,
				scale: 1.4 * this.scaleMultiplier,
				rotate: 0,
			},
			duration: 200,
			easing: easings.easeInOutExpo,
			onComplete: () => {
				tween(this.rootElement, {
					from: {
						x: 0,
						y: -10,
						scale: 1.4 * this.scaleMultiplier,
						rotate: 0,
					},
					to: {
						x: 0,
						y: 0,
						scale: 1 * this.scaleMultiplier,
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

		if (this.type === "me" || this.type === "auto") {
			return;
		}

		this.timeAccumulated += time;

		if (this.timeAccumulated > 1) {
			const timeUsed = Math.floor(this.timeAccumulated);

			this.timeAccumulated -= timeUsed;

			this.findNumbers(timeUsed * Math.pow(2, this.data.level) * (state.meMonkey.level + 1));
		}
	}

	findNumbers(numbers: number) {
		if (this.type === "me" || this.type === "auto") {
			return;
		}

		state.numbersChecked += numbers;

		if (state.numbersChecked >= state.nextFibonacciNumber) {
			playSound(sounds.victory3);
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
					y: () => 600,
					scale: () => 0.25,
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

		state.numbers += numbers;
		onNumberResourceChange();
	}
}
