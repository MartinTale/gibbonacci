import "./reset.css";
import "./defaults.css";
import { initMusic } from "./systems/music";
import { mount } from "./helpers/dom";
import { initState, resetState } from "./systems/state";
import { SVGs } from "./systems/svgs";
import { initFireflies } from "./components/fireflies/fireflies";
import { EdgeLinkButton, EdgeButton } from "./components/edge-button/edge-button";
import { initGame } from "./game/game";
import { colors, setGameColor } from "./helpers/colors";
import { closeModal, openModal } from "./components/modal/modal";
import { createScaleableContainer } from "./components/scaleable-container/scaleable-container";

export let bodyElement: HTMLElement;
export let gameContainer: HTMLElement;

export let soundToggle: EdgeButton;

window.addEventListener("DOMContentLoaded", () => {
	bodyElement = document.body;

	initState();
	setGameColor(colors[0]);
	initFireflies();

	gameContainer = createScaleableContainer(bodyElement, 360, 780, "bottom", "game");
	mount(bodyElement, gameContainer);

	initMusic();

	new EdgeLinkButton(bodyElement, SVGs.discord, "#5865F2", 8, -8, "https://discord.gg/kPf8XwNuZT");
	new EdgeLinkButton(bodyElement, SVGs.coffee, "#FBAA19", 64, -8, "https://ko-fi.com/martintale?ref=monkey-bonacci");

	soundToggle = new EdgeButton(bodyElement, SVGs.sound, "sound", 8, 8);

	// if (import.meta.env.MODE === "development") {
	new EdgeLinkButton(
		bodyElement,
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M255 34.8c-30.5-.2-59 22-79.6 62.1l-.2.4L43 326.8l-.3.3c-24.3 38.3-29.4 74.4-14.3 101 15 26.4 48.6 40 93.5 37.8h265c45 2.3 78.5-11.4 93.6-37.9 15-26.5 10-62.6-14.4-100.8l-.2-.4L335.3 98l-.2-.4c-21-40.2-49.6-62.8-80.1-63zm0 18.8c13.6.1 26.5 7 38.2 18.3a189.8 189.8 0 0 1 33.4 48.4l.1.3L442 322.2v.1l.2.3a183 183 0 0 1 25.3 54c3.9 16 3 30.6-3.9 42.3-6.9 11.8-19.2 19.6-34.8 24a182 182 0 0 1-57.4 4.4H137.6a179 179 0 0 1-60.4-5c-15.8-5-27.7-13.5-33.7-25.8-6-12.2-5.9-26.8-1.5-42.4a198.6 198.6 0 0 1 24.9-51.5l.2-.4L183.6 120l.2-.4a183 183 0 0 1 33-48.2c11.7-11.3 24.7-18 38.2-17.8zm47.7 62-28.5 224.1h-41.9l-27.9-219.2a293 293 0 0 0-4.2 8v.2l-.2.2L83 332v.2l-.2.1a184 184 0 0 0-22.8 47c-3.6 12.8-3.1 22.2.3 29 3.3 6.9 9.9 12.3 22.4 16.2a167 167 0 0 0 54.4 4.3H372c21.9 1.1 39.3-.3 52-3.8 12.5-3.6 19.7-8.9 23.6-15.4 3.9-6.6 5-15.6 1.8-28.5-3.2-13-10.7-29.4-23-48.8l-.2-.1-.1-.3-115.7-202.2v-.2l-.1-.2c-2.5-4.8-5-9.3-7.5-13.5zM231.3 362h43.9v43.9h-44v-44z"/></svg>`,
		"#f00",
		-8,
		-8,
		() => {
			openModal(
				gameContainer,
				"HARD RESET",
				"This will delete all progress!",
				[
					{
						content: "Cancel",
						type: "normal",
						onClickCallback: () => {
							closeModal();
						},
					},
					{
						content: "Reset",
						type: "danger",
						onClickCallback: () => {
							resetState();
							closeModal();
						},
					},
				],
				null,
			);
		},
	);
	// }

	initGame();
});
