import "./hero.css";
import { el, mount, svgEl } from "../../helpers/dom";
import { SVGs } from "../../systems/svgs";
import { Hero } from "../../systems/state";
import { DataKey, addBinding, getters } from "../../systems/bind";
import { easings, tween } from "../../systems/animation";

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
	swordsman.classList.toggle("active", hero === 0);
	archer.classList.toggle("active", hero === 1);
	knight.classList.toggle("active", hero === 2);
}

export function initHero() {
	renderHero(getters[DataKey.activeHero]());

	addBinding(DataKey.activeHero, (activeHero: Hero) => {
		renderHero(activeHero);
	});
}

export function attack() {}

let heroAttackAnimationId: number | null = null;
let arrowAnimationId: number | null = null;
const heroAttackAnimation = {
	swordsman: () => {
		heroAttackAnimationId = tween(swordsman, {
			from: {
				x: 0,
				rotate: 0,
			},
			to: {
				x: 100,
				rotate: 0,
			},
			duration: 600,
			easing: easings.easeInExpo,
			onComplete: () => {
				heroAttackAnimationId = tween(swordsman, {
					from: {
						x: 100,
						rotate: 0,
					},
					to: {
						x: 200,
						rotate: -230,
					},
					duration: 300,
					easing: easings.linear,
					onComplete: () => {
						heroAttackAnimationId = tween(swordsman, {
							from: {
								x: 200,
								rotate: -230,
							},
							to: {
								x: 0,
								rotate: -360,
							},
							duration: 1200,
							easing: easings.swingTo,
						});
					},
				});
			},
		});
	},
	archer: () => {
		heroAttackAnimationId = tween(archer, {
			to: {
				x: -30,
				scale: 0.9,
				opacity: 0.25,
			},
			duration: 200,
			easing: easings.swingTo,
			onComplete: () => {
				heroAttackAnimationId = tween(archer, {
					from: {
						x: -30,
						scale: 0.9,
						opacity: 0.25,
					},
					to: {
						x: 0,
						scale: 1,
						opacity: 1,
					},
					duration: 2100,
					easing: easings.easeOutExpo,
				});
			},
		});

		arrowAnimationId = tween(arrow, {
			from: {
				x: 0,
				opacity: 1,
			},
			to: {
				x: 200,
				opacity: 1,
			},
			duration: 200,
			easing: easings.linear,
			onComplete: () => {
				arrowAnimationId = tween(arrow, {
					from: {
						x: 200,
						opacity: 1,
					},
					to: {
						x: 200,
						opacity: 0,
					},
					duration: 1000,
					easing: easings.easeOutQuad,
				});
			},
		});
	},
	knight: () => {
		heroAttackAnimationId = tween(knight, {
			to: {
				x: 100,
				rotate: 0,
			},
			duration: 800,
			easing: easings.easeInExpo,
			onComplete: () => {
				heroAttackAnimationId = tween(knight, {
					to: {
						x: 200,
						rotate: 45,
					},
					duration: 300,
					easing: easings.easeOutExpo,
					onComplete: () => {
						heroAttackAnimationId = tween(knight, {
							from: {
								x: 200,
								rotate: 45,
							},
							to: {
								x: 0,
								rotate: 0,
							},
							duration: 1000,
							easing: easings.swingTo,
						});
					},
				});
			},
		});
	},
};
