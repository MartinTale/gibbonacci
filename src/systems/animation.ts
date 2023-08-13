import { getTransforms } from "../helpers/dom";

type CSSProperties = {
	x?: number;
	y?: number;
	scale?: number;
	rotate?: number;
	opacity?: number;
};

type TweenProperties = {
	from?: CSSProperties;
	to: CSSProperties;
	duration?: number;
	easing?: (pos: number) => number;
	onComplete?: () => void;
};

let tweenIterator = 0;
export const tweens: { [key: number]: (progress: number) => void } = {};

export function tween(target: HTMLElement, props: TweenProperties) {
	const id = tweenIterator++;

	target.style.transition = "none";
	target.style.pointerEvents = "none";

	const onComplete = () => {
		delete tweens[id];
		target.style.transition = "";
		target.style.pointerEvents = "";
		props.onComplete?.();
	};

	const startTime = Date.now();
	const duration = props.duration ?? 1000;
	const easing = props.easing ?? easings.easeInOutExpo;
	getTransforms(target);
	const from = { ...getTransforms(target), ...(props.from ?? {}) };

	const onUpdate = (time: number) => {
		const progress = Math.max(0, Math.min(1, (time - startTime) / duration));

		const to = props.to;

		let transform = "";

		const fromX = from.x ?? 0;
		if (to.x !== undefined) {
			// 0 + (100 - 0) * 0.5 = 50
			// 100 + (200 - 100) * 0.5 = 150
			// -100 + (100 - -100) * 0.5 = 0
			// -100 + (-200 - -100) * 0.5 = -150

			const x = fromX + (to.x - fromX) * easing(progress);
			transform += `translateX(${x}px) `;
		} else {
			transform += `translateX(${fromX}px) `;
		}

		const fromY = from.y ?? 0;
		if (to.y !== undefined) {
			const y = fromY + (to.y - fromY) * easing(progress);
			transform += `translateY(${y}px) `;
		} else {
			transform += `translateY(${fromY}px) `;
		}

		const fromScale = from.scale ?? 1;
		if (to.scale !== undefined) {
			const scale = fromScale + (to.scale - fromScale) * easing(progress);
			transform += `scale(${scale}) `;
		} else {
			transform += `scale(${fromScale}) `;
		}

		const fromRotate = from.rotate ?? 0;
		if (to.rotate !== undefined) {
			const rotate = fromRotate + (to.rotate - fromRotate) * easing(progress);
			transform += `rotate(${rotate}deg) `;
		} else {
			transform += `rotate(${fromRotate}deg) `;
		}

		const fromOpacity = from.opacity ?? 1;
		if (to.opacity !== undefined) {
			const opacity = fromOpacity + (to.opacity - fromOpacity) * easing(progress);
			target.style.opacity = opacity.toString();
		} else {
			target.style.opacity = fromOpacity.toString();
		}

		target.style.transform = transform;

		if (progress === 1) {
			onComplete();
		}
	};

	tweens[id] = onUpdate;

	return id;
}

export const easings = {
	easeInQuad: (pos: number) => {
		return Math.pow(pos, 2);
	},

	easeOutQuad: (pos: number) => {
		return -(Math.pow(pos - 1, 2) - 1);
	},

	easeInOutQuad: (pos: number) => {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 2);
		}
		return -0.5 * ((pos -= 2) * pos - 2);
	},

	easeInCubic: (pos: number) => {
		return Math.pow(pos, 3);
	},

	easeOutCubic: (pos: number) => {
		return Math.pow(pos - 1, 3) + 1;
	},

	easeInOutCubic: (pos: number) => {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 3);
		}
		return 0.5 * (Math.pow(pos - 2, 3) + 2);
	},

	easeInQuart: (pos: number) => {
		return Math.pow(pos, 4);
	},

	easeOutQuart: (pos: number) => {
		return -(Math.pow(pos - 1, 4) - 1);
	},

	easeInOutQuart: (pos: number) => {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 4);
		}
		return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
	},

	easeInQuint: (pos: number) => {
		return Math.pow(pos, 5);
	},

	easeOutQuint: (pos: number) => {
		return Math.pow(pos - 1, 5) + 1;
	},

	easeInOutQuint: (pos: number) => {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 5);
		}
		return 0.5 * (Math.pow(pos - 2, 5) + 2);
	},

	easeInSine: (pos: number) => {
		return -Math.cos(pos * (Math.PI / 2)) + 1;
	},

	easeOutSine: (pos: number) => {
		return Math.sin(pos * (Math.PI / 2));
	},

	easeInOutSine: (pos: number) => {
		return -0.5 * (Math.cos(Math.PI * pos) - 1);
	},

	easeInExpo: (pos: number) => {
		return pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1));
	},

	easeOutExpo: (pos: number) => {
		return pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
	},

	easeInOutExpo: (pos: number) => {
		if (pos === 0) {
			return 0;
		}
		if (pos === 1) {
			return 1;
		}
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(2, 10 * (pos - 1));
		}
		return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
	},

	easeInCirc: (pos: number) => {
		return -(Math.sqrt(1 - pos * pos) - 1);
	},

	easeOutCirc: (pos: number) => {
		return Math.sqrt(1 - Math.pow(pos - 1, 2));
	},

	easeInOutCirc: (pos: number) => {
		if ((pos /= 0.5) < 1) {
			return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
		}
		return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
	},

	easeOutBounce: (pos: number) => {
		if (pos < 1 / 2.75) {
			return 7.5625 * pos * pos;
		} else if (pos < 2 / 2.75) {
			return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
		} else if (pos < 2.5 / 2.75) {
			return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
		} else {
			return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
		}
	},

	easeInBack: (pos: number) => {
		var s = 1.70158;
		return pos * pos * ((s + 1) * pos - s);
	},

	easeOutBack: (pos: number) => {
		var s = 1.70158;
		return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
	},

	easeInOutBack: (pos: number) => {
		var s = 1.70158;
		if ((pos /= 0.5) < 1) {
			return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
		}
		return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
	},

	elastic: (pos: number) => {
		return -1 * Math.pow(4, -8 * pos) * Math.sin(((pos * 6 - 1) * (2 * Math.PI)) / 2) + 1;
	},

	swingFromTo: (pos: number) => {
		var s = 1.70158;
		return (pos /= 0.5) < 1
			? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s))
			: 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
	},

	swingFrom: (pos: number) => {
		var s = 1.70158;
		return pos * pos * ((s + 1) * pos - s);
	},

	swingTo: (pos: number) => {
		var s = 1.70158;
		return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
	},

	bounce: (pos: number) => {
		if (pos < 1 / 2.75) {
			return 7.5625 * pos * pos;
		} else if (pos < 2 / 2.75) {
			return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
		} else if (pos < 2.5 / 2.75) {
			return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
		} else {
			return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
		}
	},

	bouncePast: (pos: number) => {
		if (pos < 1 / 2.75) {
			return 7.5625 * pos * pos;
		} else if (pos < 2 / 2.75) {
			return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
		} else if (pos < 2.5 / 2.75) {
			return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
		} else {
			return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
		}
	},

	easeFromTo: (pos: number) => {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 4);
		}
		return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
	},

	easeFrom: (pos: number) => {
		return Math.pow(pos, 4);
	},

	easeTo: (pos: number) => {
		return Math.pow(pos, 0.25);
	},

	linear: (pos: number) => {
		return pos;
	},
};
