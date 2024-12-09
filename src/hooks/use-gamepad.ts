import { Button } from '@nx.js/constants';
import { type DependencyList, useCallback, useEffect } from 'react';
import type { ButtonName } from '../types';

class GamepadLoop {
	running = false;
	callbacks = new Map<() => void, ButtonName>();
	pressed: boolean[] = [];

	constructor() {
		navigator.virtualKeyboard.addEventListener(
			'geometrychange',
			this.#onVirtualKeyboardGeometryChange,
		);
	}

	queueLoop() {
		if (this.running) return;
		if (navigator.virtualKeyboard.boundingRect.height > 0) return;
		this.running = true;
		queueMicrotask(this.loop);
	}

	#onVirtualKeyboardGeometryChange = () => {
		if (navigator.virtualKeyboard.boundingRect.height > 0) {
			this.running = false;
		} else {
			this.queueLoop();
		}
	};

	loop = () => {
		if (this.callbacks.size === 0 || !this.running) return;

		const [gp] = navigator.getGamepads();
		if (!gp) return;

		for (const [cb, button] of this.callbacks) {
			const buttonNum = Button[button];
			const wasPressed = this.pressed[buttonNum];
			const isPressed = gp.buttons[buttonNum]?.pressed;
			if (!wasPressed && isPressed) {
				this.pressed[buttonNum] = true;
				cb();
			} else if (wasPressed && !isPressed) {
				this.pressed[buttonNum] = false;
			}
		}

		requestAnimationFrame(this.loop);
	};

	add(cb: () => void, button: ButtonName) {
		this.callbacks.set(cb, button);
		this.queueLoop();
	}

	delete(cb: () => void) {
		this.callbacks.delete(cb);
		if (this.callbacks.size === 0) {
			this.running = false;
		}
	}
}

const gamepadLoop = new GamepadLoop();

export function useGamepadButton(
	button: ButtonName,
	callback: () => void,
	deps: DependencyList,
	focused = true,
) {
	const cb = useCallback(callback, deps);

	useEffect(() => {
		if (!focused) {
			gamepadLoop.delete(cb);
			return;
		}
		gamepadLoop.add(cb, button);
		return () => {
			gamepadLoop.delete(cb);
		};
	}, [focused, cb, button]);
}
