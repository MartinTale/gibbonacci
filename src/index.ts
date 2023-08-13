import "./reset.css";
import "./defaults.css";
import { initMusic } from "./systems/music";
import { el, mount, setTextContent } from "./helpers/dom";
import { initState, resetState } from "./systems/state";
import { SVGs } from "./systems/svgs";
import { abbreviateNumber, random } from "./helpers/numbers";
import { initFireflies } from "./components/fireflies/fireflies";
import { EdgeLinkButton, EdgeButton } from "./components/edge-button/edge-button";
import { initGame, startGameLoop } from "./game/game";
import { createButton } from "./components/button/button";
import { DataKey, addBinding, getters, setters } from "./systems/bind";
import { easings, tween } from "./systems/animation";
import { ProgressBar } from "./components/progress-bar/progress-bar";
import { colors, setGameColor } from "./helpers/colors";

export let bodyElement: HTMLElement;
export let gameContainer: HTMLElement;

export let soundToggle: EdgeButton;

window.addEventListener("DOMContentLoaded", () => {
	bodyElement = document.body;

	initState();
	setGameColor(colors[0]);
	initFireflies();

	gameContainer = el("div.game");
	mount(bodyElement, gameContainer);

	initMusic();

	new EdgeLinkButton(bodyElement, SVGs.discord, "#5865F2", 8, -8, "https://discord.gg/kPf8XwNuZT");
	new EdgeLinkButton(
		bodyElement,
		SVGs.coffee,
		"#FBAA19",
		64,
		-8,
		"https://ko-fi.com/martintale?ref=js13kgames-template",
	);

	soundToggle = new EdgeButton(bodyElement, SVGs.sound, "sound", 8, 8);

	if (import.meta.env.MODE === "development") {
		new EdgeLinkButton(
			bodyElement,
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m1.6 11.4-1.5-1 5.4-.6 1.9 5-1.5-1c-1.5 2.4-2.9 5.2-2 8C1.4 19.5 0 18 0 16c0-1.4 1-3.3 1.6-4.6zm4 5.6c-.7 1-1 2.9-.7 4 .1.6.6 1 1.2 1H11v-5H5.7zm10.8 5.2V24L13 19.7l3.4-4.2v1.8c2.8 0 5.8-.4 7.6-2.5-.5 3.2-1.1 5.3-2.8 6.3-1.2.8-3.4 1-4.8 1zm2.7-6.4a6 6 0 0 0 3.8-1.5c.4-.4.5-1 .2-1.5l-2.6-4.2-4.3 2.6 2.8 4.6zM18 4.2l1.6-.9-2 5-5.4-.7 1.6-.9c-1.4-2.4-3.2-5-6-5.6C10 .4 11.5 0 12.8 0c2.2 0 3.5 1.3 5.4 4.2zm-6.9.8c-.4-1.1-2-2.3-3.2-2.6-.5-.2-1 0-1.3.5L4.3 7.2l4.3 2.4L11.2 5z"/></svg>`,
			"#f00",
			-8,
			-8,
			() => {
				resetState();
			},
		);
	}

	const testButton = createButton(
		"",
		() => {
			setters[DataKey.level](getters[DataKey.level]() + 1);
			tween(testButton, {
				to: {
					x: random(-200, 200),
					y: random(-100, 300),
					rotate: random(-180, 180),
					scale: random(5, 20) / 10,
					opacity: random(20, 100) / 100,
				},
				duration: 1000,
				easing: easings.swingTo,
			});
		},
		"primary",
	);

	mount(gameContainer, testButton);

	const testButton2 = createButton(
		"",
		() => {
			setters[DataKey.level](getters[DataKey.level]() + 1);
		},
		"primary",
	);

	mount(gameContainer, testButton2);

	const bar = new ProgressBar(gameContainer, 0, 100, 0);
	bar.container.style.margin = "10px";
	bar.container.onclick = () => {
		bar.setValue(bar.value + 10);
	};

	addBinding(DataKey.level, (level: number) => {
		setTextContent(testButton, `Test ${abbreviateNumber(level)}`);
	});
	addBinding(DataKey.level, (level: number) => {
		setTextContent(testButton2, `Test ${abbreviateNumber(level * 80)}`);
	});

	initGame();
	startGameLoop();
});
