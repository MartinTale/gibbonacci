const STATE_KEY = "js13kgames-2023";

export type Path = "sound" | "screen";

export const HeroType = {
	SWORDSMAN: 0,
	ARCHER: 1,
	KNIGHT: 2,
} as const;
type HeroTypeKeys = keyof typeof HeroType;
type HeroTypeValues = (typeof HeroType)[HeroTypeKeys];

export const HeroPropType = {
	ID: 0,
	HP: 1,
	HP_MAX: 2,
	ATTACK: 3,
	DEFENSE: 4,
} as const;

export type State = {
	lastProcessedAt: number;
	sound: boolean | null;

	activeHero: HeroTypeValues;
	heroes: [
		[number, number, number, number, number],
		[number, number, number, number, number],
		[number, number, number, number, number],
	];

	level: number;
	enemy: [number, number, number, number, number];
};

export const emptyState: State = {
	lastProcessedAt: Date.now(),
	sound: null,

	activeHero: 0,
	heroes: [
		[0, 100, 100, 5, 5],
		[1, 50, 50, 5, 0],
		[2, 75, 75, 10, 5],
	],

	level: 0,
	enemy: [0, 100, 100, 10, 10],
};

export let state: State;

let stateLoaded = false;
let autoSaveInterval: number;

export function initState() {
	loadState();

	autoSaveInterval = setInterval(saveState, 15000);
	globalThis.onbeforeunload = () => {
		saveState();
	};
}

export function resetState() {
	clearInterval(autoSaveInterval);
	globalThis.onbeforeunload = null;
	localStorage.removeItem(STATE_KEY);

	setTimeout(() => {
		globalThis.location.reload();
	}, 500);
}

function loadState() {
	const encodedState = localStorage.getItem(STATE_KEY);
	const decodedState = encodedState ? atob(encodedState) : "{}";
	const jsonState = JSON.parse(decodedState) as State | undefined;

	if (jsonState) {
		state = Object.assign({ ...emptyState }, jsonState);
	} else {
		state = { ...emptyState };
	}

	stateLoaded = true;
}

function saveState() {
	if (!stateLoaded) {
		return;
	}

	const jsonState = JSON.stringify(state);
	const encodedState = btoa(jsonState);
	localStorage.setItem(STATE_KEY, encodedState);
}
