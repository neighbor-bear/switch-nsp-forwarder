import { Button } from '@nx.js/constants';
import { type DependencyList, useEffect } from 'react';
import type { ButtonName } from '../types';

export type ButtonHandlers = {
	[A in ButtonName]?: () => void;
};

const pressed: boolean[] = [];

export function useGamepad(buttons: ButtonHandlers, deps?: DependencyList) {
	useEffect(() => {
		let raf: number;
		const loop = () => {
			const [gp] = navigator.getGamepads();
			if (!gp) return;
			for (const [button, onPress] of Object.entries(buttons)) {
				const buttonNum = Button[button as ButtonName];
				const wasPressed = pressed[buttonNum];
				const isPressed = gp.buttons[buttonNum]?.pressed;
				if (!wasPressed && isPressed) {
					pressed[buttonNum] = true;
					onPress();
				} else if (wasPressed && !isPressed) {
					pressed[buttonNum] = false;
				}
			}
			raf = requestAnimationFrame(loop);
		};
		loop();
		return () => cancelAnimationFrame(raf);
	}, deps);
}
