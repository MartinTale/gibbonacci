import "./edge-button.css";
import { Path, state } from "../../systems/state";
import { externalLinkEl, el, mount, svgEl } from "../../helpers/dom";
import { playSound, sounds } from "../../systems/music";
import { zzfxX } from "../../third-party-libraries/zzfx";

export class EdgeButton {
	root: HTMLElement;

	constructor(
		container: HTMLElement,
		icon: string,
		private path: Path,
		top: number,
		right: number,
	) {
		this.root = el("div.edge-button", svgEl(icon, "#fff"));
		this.root.style.top = `${top}px`;
		this.root.style.right = `${right}px`;

		mount(container, this.root);

		if (path === "screen") {
			// screens.openScreen('game');
			// this.renderState(screens.screen === 'levels');
			// this.root.onclick = () => {
			// 	playSound(sounds.tap);
			// 	screens.openScreen(screens.screen === 'game' ? 'levels' : 'game');
			// 	this.renderState(screens.screen === 'levels');
			// };
		} else {
			this.renderState(state[path] as boolean);
			this.root.onclick = () => {
				playSound(sounds.tap);
				state[path] = !state[path];
				this.renderState(state[path] as boolean);
			};
		}
	}

	public renderState = (newState: boolean) => {
		this.root.classList.toggle("active", newState === true);

		if (this.path === "sound") {
			if (zzfxX != null) {
				newState ? zzfxX.resume() : zzfxX.suspend();
			}
		}
	};
}

export class EdgeLinkButton {
	root: HTMLElement;

	constructor(
		container: HTMLElement,
		icon: string,
		color: string,
		top: number,
		right: number,
		link: string | (() => void),
	) {
		const iconElement = svgEl(icon, color);
		iconElement.style.fill = color;

		if (typeof link === "function") {
			this.root = el("div", iconElement);
			this.root.onclick = () => {
				playSound(sounds.tap);
				link();
			};
		} else {
			this.root = externalLinkEl(iconElement, link);
		}

		this.root.style.borderColor = color;
		this.root.classList.add("edge-button", "link");

		if (top < 0) {
			this.root.style.bottom = `${Math.abs(top)}px`;
		} else {
			this.root.style.top = `${top}px`;
		}

		if (right < 0) {
			this.root.style.left = `${Math.abs(right)}px`;
		} else {
			this.root.style.right = `${right}px`;
		}

		mount(container, this.root);
	}
}
