import "./button.css";
import { el } from "../../helpers/dom";
import { playSound, sounds } from "../../systems/music";
import { easings, tween, tweens } from "../../systems/animation";

export type ButtonType = "normal" | "primary" | "danger" | "disabled";

export type Button = {
	type: ButtonType;
	content: string | HTMLElement | HTMLElement[];
	onClickCallback: ((e: Event) => void) | null;
};

export function createButton(
	content: string | HTMLElement | HTMLElement[],
	onClickCallback: (e: any) => void,
	type: ButtonType,
): HTMLElement {
	const button = el("button." + type, content) as HTMLButtonElement;

	let tweenId: number;

	button.onclick = (e) => {
		playSound(sounds.tap);

		if (tweenId && tweens[tweenId]) {
			delete tweens[tweenId];
		}

		tweenId = tween(button, {
			to: {
				scale: 0.9,
			},
			duration: 100,
			easing: easings.easeOutSine,
			onComplete: () => {
				tweenId = tween(button, {
					to: {
						scale: 1,
					},
					duration: 100,
					easing: easings.easeInSine,
				});
			},
		});
		onClickCallback(e);
	};

	return button;
}
