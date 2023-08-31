import { el } from "../../helpers/dom";

export type Scale = {
	width: number;
	height: number;
	final: number;
};

const scales: { [key: string]: Scale } = {};
const onChangeHandlers: { [key: string]: (scale: Scale) => void } = {};

export function createScaleableContainer(
	parent: HTMLElement,
	width = 360,
	height = 780,
	transformOrigin = "bottom",
	name = "default",
	onChange?: (scale: Scale) => void,
) {
	const container = el("div.scaleable-container");
	container.classList.add(name);

	container.style.transformOrigin = transformOrigin;
	container.style.transition = "none";
	container.style.width = `${width}px`;
	container.style.minWidth = `${width}px`;
	container.style.maxWidth = `${width}px`;
	container.style.height = `${height}px`;
	container.style.minHeight = `${height}px`;
	container.style.maxHeight = `${height}px`;

	if (onChange != null) {
		onChangeHandlers[name] = onChange;
	}

	const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
		entries.forEach((entry: ResizeObserverEntry) => {
			// entries.forEach(() => {
			// scaleContainer(container, width, height, window.innerWidth, window.innerHeight, name);
			scaleContainer(container, width, height, entry.contentRect.width, entry.contentRect.height, name);
		});
	});

	observer.observe(parent);

	return container;
}

function scaleContainer(
	container: HTMLElement,
	expectedWidth: number,
	expectedHeight: number,
	actualWidth: number,
	actualHeight: number,
	name = "default",
) {
	if (scales[name] == null) {
		scales[name] = {
			width: 1,
			height: 1,
			final: 1,
		};
	}

	scales[name].width = actualWidth / expectedWidth;
	scales[name].height = actualHeight / expectedHeight;
	scales[name].final = Math.min(scales[name].width, scales[name].height);

	container.style.transform = `scale(${scales[name].final})`;

	if (onChangeHandlers[name] != null) {
		onChangeHandlers[name](scales[name]);
	}
}

export function getScaleableContainerScale(name = "default") {
	return scales[name] ?? { width: 1, height: 1, final: 1 };
}
