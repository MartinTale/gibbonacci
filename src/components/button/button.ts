import "./button.css";
import { el } from "../../helpers/dom";
import { playSound, sounds } from "../../systems/music";

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
	button.onclick = (e) => {
		playSound(sounds.tap);
		onClickCallback(e);
	};

	return button;
}
