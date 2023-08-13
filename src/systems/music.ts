// import { gameContainer, soundToggle } from '../systems/game';
import { initAudioContext, zzfx, zzfxP, zzfxX } from "../third-party-libraries/zzfx";
import { zzfxM } from "../third-party-libraries/zzfxm";
// import { openModal } from './components/modal';
import { state } from "./state";
import { bodyElement, gameContainer, soundToggle } from "..";
import { openModal } from "../components/modal/modal";

const musicVolume = 0.5;

let musicStarted = false;

export const sounds = {
	tap: [1.03, 0.5, 355, , , 0, , 0.71, 12, , -752, 0.03, , , , , , 0.22, 0.01],
	rotate: [1.02, 0.5, 1133, , 0.01, 0.01, 1, 1.06, , 0.3, , , , 0.1, 52, , , 0.13, 0.01],
	victory: [1.37, , 1133, 1, 0.1, 0.27, , 1.45, -2, , 136, 0.09, 0.18, 0.2, , , 0.1, 0.83, 0.13],
};

export const music = zzfxM(
	[[musicVolume, 0, 43, , , 0.25, , , , , , , , 0.1]],
	[
		[[0, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33]],
		[[0, -1, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33]],
	],
	[0],
	50,
);

export function playSound(sound: (number | undefined)[]) {
	if (state.sound && zzfxX != null) {
		zzfx(...sound);
	}
}

export function initMusic() {
	if (state.sound == null) {
		openModal(
			gameContainer,
			"Play with sound?",
			"",
			[
				{
					type: "danger",
					content: "No",
					onClickCallback: () => {
						state.sound = false;
					},
				},
				{
					type: "primary",
					content: "Rock ON!",
					onClickCallback: () => {
						state.sound = true;
						if (soundToggle) {
							soundToggle.renderState(state.sound);
						}
					},
				},
			],
			null,
		);
	}

	bodyElement.onclick = () => {
		if (!musicStarted) {
			musicStarted = true;
			initAudioContext();
			zzfxP(...music).loop = true;

			if (state.sound) {
				zzfxX!.resume();
			} else {
				zzfxX!.suspend();
			}
		}
	};
}
