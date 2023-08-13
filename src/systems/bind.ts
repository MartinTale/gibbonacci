import { state } from "./state";

export const DataKey = {
	level: 0,
};

export const setters: ((data: any) => void)[] = [];
setters[DataKey.level] = (level: number) => {
	state.level = level;

	bindings[DataKey.level].forEach((callback) => {
		callback(level);
	});
};

export const getters: (() => any)[] = [];
getters[DataKey.level] = () => state.level;

const bindings: ((data: any) => void)[][] = [];

export function addBinding(source: number, callback: (data: any) => void) {
	if (!bindings[source]) {
		bindings[source] = [];
	}
	bindings[source].push(callback);
	callback(getters[source]());
}
