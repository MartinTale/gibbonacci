import "./progress-bar.css";
import { el, mount } from "../../helpers/dom";

export class ProgressBar {
	container: HTMLElement;
	progress: HTMLElement;

	constructor(
		parent: HTMLElement,
		public min: number,
		public max: number,
		public value: number,
	) {
		this.progress = el("div.progress");
		this.container = el("div.progress-bar", this.progress);

		this.setValue(value);

		mount(parent, this.container);
	}

	getProgress() {
		return Math.min(100, Math.max(0, ((this.value - this.min) / (this.max - this.min)) * 100));
	}

	setValue(value: number) {
		this.value = value;
		this.progress.style.width = `${this.getProgress()}%`;
	}
}
