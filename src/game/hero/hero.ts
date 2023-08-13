import "./hero.css";
import { el, mount, svgEl } from "../../helpers/dom";
import { SVGs } from "../../systems/svgs";
import { Hero } from "../../systems/state";
import { DataKey, addBinding, getters } from "../../systems/bind";

export const heroContainer = el("div.hero");

const swordsman = svgEl(SVGs["swordsman"], "var(--color)");

const archerSVG = svgEl(SVGs["archer"], "var(--color)");
const arrow = svgEl(SVGs["arrow"], "var(--color)");
const archer = el("div", [archerSVG, arrow]);

const knight = svgEl(SVGs["mounted-knight"], "var(--color)");

mount(heroContainer, swordsman);
mount(heroContainer, archer);
mount(heroContainer, knight);

function renderHero(hero: Hero) {
	swordsman.classList.toggle("active", hero === "swordsman");
	archer.classList.toggle("active", hero === "archer");
	knight.classList.toggle("active", hero === "knight");
}

export function initHero() {
	renderHero(getters[DataKey.activeHero]());

	addBinding(DataKey.activeHero, (activeHero: Hero) => {
		renderHero(activeHero);
	});
}

// setInterval(() => {
// 	tween(swordsman, {
// 		from: {
// 			x: 0,
// 			rotate: 0,
// 		},
// 		to: {
// 			x: 100,
// 			rotate: 0,
// 		},
// 		duration: 600,
// 		easing: easings.easeInExpo,
// 		onComplete: () => {
// 			tween(swordsman, {
// 				from: {
// 					x: 100,
// 					rotate: 0,
// 				},
// 				to: {
// 					x: 200,
// 					rotate: -230,
// 				},
// 				duration: 300,
// 				easing: easings.linear,
// 				onComplete: () => {
// 					tween(swordsman, {
// 						from: {
// 							x: 200,
// 							rotate: -230,
// 						},
// 						to: {
// 							x: 0,
// 							rotate: -360,
// 						},
// 						duration: 1200,
// 						easing: easings.swingTo,
// 					});
// 				},
// 			});
// 		},
// 	});
// }, 3000);

// setTimeout(() => {
// 	setInterval(() => {
// 		tween(archer, {
// 			to: {
// 				x: -30,
// 				scale: 0.9,
// 				opacity: 0.25,
// 			},
// 			duration: 200,
// 			easing: easings.swingTo,
// 			onComplete: () => {
// 				tween(archer, {
// 					from: {
// 						x: -30,
// 						scale: 0.9,
// 						opacity: 0.25,
// 					},
// 					to: {
// 						x: 0,
// 						scale: 1,
// 						opacity: 1,
// 					},
// 					duration: 2100,
// 					easing: easings.easeOutExpo,
// 				});
// 			},
// 		});

// 		tween(arrow, {
// 			from: {
// 				x: 0,
// 				opacity: 1,
// 			},
// 			to: {
// 				x: 200,
// 				opacity: 1,
// 			},
// 			duration: 200,
// 			easing: easings.linear,
// 			onComplete: () => {
// 				tween(arrow, {
// 					from: {
// 						x: 200,
// 						opacity: 1,
// 					},
// 					to: {
// 						x: 200,
// 						opacity: 0,
// 					},
// 					duration: 1000,
// 					easing: easings.easeOutQuad,
// 				});
// 			},
// 		});
// 	}, 3000);
// }, 500);

// setInterval(() => {
// 	tween(knight, {
// 		to: {
// 			x: 100,
// 			rotate: 0,
// 		},
// 		duration: 800,
// 		easing: easings.easeInExpo,
// 		onComplete: () => {
// 			tween(knight, {
// 				to: {
// 					x: 200,
// 					rotate: 45,
// 				},
// 				duration: 300,
// 				easing: easings.easeOutExpo,
// 				onComplete: () => {
// 					tween(knight, {
// 						from: {
// 							x: 200,
// 							rotate: 45,
// 						},
// 						to: {
// 							x: 0,
// 							rotate: 0,
// 						},
// 						duration: 1000,
// 						easing: easings.swingTo,
// 					});
// 				},
// 			});
// 		},
// 	});
// }, 3000);
