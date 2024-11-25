import { Button } from '@nx.js/constants';
import { type DependencyList, useEffect, useRef } from 'react';
import type { ButtonName } from '../types';

export type ButtonHandlers = {
	[A in ButtonName]?: () => void;
};

export function useGamepad(buttons: ButtonHandlers, deps?: DependencyList) {
	const pressed = useRef<boolean[]>([]);
	useEffect(() => {
		let raf: number;
		const loop = () => {
			const [gp] = navigator.getGamepads();
			if (!gp) return;
			for (const [button, onPress] of Object.entries(buttons)) {
				const buttonNum = Button[button as ButtonName];
				const wasPressed = pressed.current[buttonNum];
				const isPressed = gp.buttons[buttonNum]?.pressed;
				if (!wasPressed && isPressed) {
					pressed.current[buttonNum] = true;
					onPress();
				} else if (wasPressed && !isPressed) {
					pressed.current[buttonNum] = false;
				}
			}
			raf = requestAnimationFrame(loop);
		};
		loop();
		return () => cancelAnimationFrame(raf);
	}, [...(deps || []), buttons]);
}
