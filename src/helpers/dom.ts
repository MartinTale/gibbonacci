export function el(tagAndClasses: string, content: null | string | HTMLElement | HTMLElement[] = null) {
	const parts = tagAndClasses.split(".");
	const tag = parts.shift();

	const element = document.createElement(tag!);

	parts.forEach((part) => {
		element.classList.add(part);
	});

	if (typeof content === "string") {
		setTextContent(element, content);
	} else if (Array.isArray(content)) {
		content.forEach((item) => mount(element, item));
	} else if (content != null) {
		mount(element, content);
	}

	return element;
}

export function mount(container: HTMLElement, element: HTMLElement) {
	container.insertAdjacentElement("beforeend", element);
}

export function svgEl(svgString: string, color?: string): HTMLElement {
	if (color) {
		svgString = svgString.replace("[fill]", `fill="${color}"`);
	}

	const parser = new DOMParser();
	return parser.parseFromString(svgString, "image/svg+xml").documentElement;
}

export function externalLinkEl(content: string | HTMLElement | HTMLElement[], link: string) {
	const linkElement = el("a", content) as HTMLAnchorElement;

	linkElement.href = link;
	linkElement.target = "_blank";

	return linkElement;
}

export function setTextContent(element: HTMLElement, text: string) {
	element.textContent = text;
}

export function getTransforms(element: HTMLElement) {
	const style = getComputedStyle(element);
	const matrix = new WebKitCSSMatrix(style.transform);

	return {
		x: matrix.m41,
		y: matrix.m42,
		scale: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
		rotate: Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)),
		opacity: parseFloat(style.opacity),
	};
}
