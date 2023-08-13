import { tweens } from "../systems/animation";
import { DataKey, getters, setters } from "../systems/bind";
import { state } from "../systems/state";
import "./game.css";

export function initGame() {
	console.log("init game");
}

export function startGameLoop() {
	processGameState();
}

function processGameState() {
	const newProcessingTime = Date.now();
	const secondsPassed = (newProcessingTime - state.lastProcessedAt) / 1000;

	Object.values(tweens).forEach((updateTween) => updateTween(newProcessingTime));
	// console.log(secondsPassed);

	setters[DataKey.level](getters[DataKey.level]() + secondsPassed);

	state.lastProcessedAt = newProcessingTime;
	requestAnimationFrame(processGameState);
}
