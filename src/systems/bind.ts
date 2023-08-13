import { Hero, state } from "./state";

export const DataKey = {
	level: 0,
	activeHero: 1,
};

export const setters: ((data: any) => void)[] = [];
setters[DataKey.level] = (level: number) => {
	state.level = level;

	bindings[DataKey.level]?.forEach((callback) => {
		callback(level);
	});
};

setters[DataKey.activeHero] = (activeHero: Hero) => {
	state.activeHero = activeHero;

	bindings[DataKey.activeHero]?.forEach((callback) => {
		callback(activeHero);
	});
};

export const getters: (() => any)[] = [];
getters[DataKey.level] = () => state.level;
getters[DataKey.activeHero] = () => state.activeHero;

const bindings: ((data: any) => void)[][] = [];

export function addBinding(source: number, callback: (data: any) => void) {
	if (!bindings[source]) {
		bindings[source] = [];
	}
	bindings[source].push(callback);
	callback(getters[source]());
}
