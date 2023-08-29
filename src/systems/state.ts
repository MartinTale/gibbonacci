const STATE_KEY = "monkey-bonacci";
export type Path = "sound" | "screen";

const version = "0.0.5";

export const HeroPropType = {
	ID: 0,
	HP: 1,
	HP_MAX: 2,
	ATTACK: 3,
	DEFENSE: 4,
} as const;

export type MonkeyData = {
	awake: boolean;
	level: number;
};

export type State = {
	version: string;
	lastProcessedAt: number;
	startAt: number;
	endAt: number | null;
	sound: boolean | null;

	numbersChecked: number;
	numbersFound: number[];
	nextFibonacciNumber: number;

	bananas: number;
	numbers: number;

	monkeys: [MonkeyData, MonkeyData, MonkeyData, MonkeyData];
	meMonkey: MonkeyData;
	autoMonkey: MonkeyData;
};

export const emptyState: State = {
	version,
	lastProcessedAt: Date.now(),
	startAt: Date.now(),
	endAt: null,
	sound: null,

	numbersChecked: 0,
	numbersFound: [],
	nextFibonacciNumber: 0,

	bananas: 0,
	numbers: 0,

	monkeys: [
		{ awake: false, level: 1 },
		{ awake: false, level: 1 },
		{ awake: false, level: 1 },
		{ awake: false, level: 1 },
	],
	meMonkey: { awake: false, level: 0 },
	autoMonkey: { awake: false, level: 0 },
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
		if (jsonState?.version !== version) {
			state = { ...emptyState };
		} else {
			state = Object.assign({ ...emptyState }, jsonState);
		}
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
