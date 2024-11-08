import { type DependencyList, useEffect, useRef } from 'react';

export function useGamepad(
	buttons: Record<number, () => void>,
	deps?: DependencyList[],
) {
	const pressed = useRef<boolean[]>([]);
	useEffect(() => {
		let raf: number;
		const loop = () => {
			const [gp] = navigator.getGamepads();
			if (!gp) return;
			for (const [button, onPress] of Object.entries(buttons)) {
				const buttonNum = Number(button);
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
	}, deps);
}
