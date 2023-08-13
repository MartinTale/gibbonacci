const STATE_KEY = "js13kgames-template";

export type Path = "sound" | "screen";

export type State = {
	lastProcessedAt: number;
	sound: boolean | null;
	level: number;
};

export const emptyState: State = {
	lastProcessedAt: Date.now(),
	sound: null,
	level: 0,
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
