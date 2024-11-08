import { Button } from '@nx.js/constants';
import React, { useEffect } from 'react';
import { Text, useRoot } from 'react-tela';

export function ErrorMissingProdKeys() {
	const root = useRoot();

	useEffect(() => {
		let raf: number;
		function loop() {
			const [gp] = navigator.getGamepads();
			if (gp?.buttons[Button.A]?.pressed) {
				Switch.exit();
			} else {
				raf = requestAnimationFrame(loop);
			}
		}
		loop();
		return () => cancelAnimationFrame(raf);
	}, []);

	return (
		<>
			<Text
				fontFamily='sans-serif'
				fill='red'
				fontSize={60}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={200}
			>
				"prod.keys" File Not Found
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={340}
			>
				Please run the `Lockpick_RCM.bin` payload
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={390}
			>
				to generate your "prod.keys" file.
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='#999'
				fontSize={28}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={480}
			>
				(Press to exit)
			</Text>
			<Text
				fontFamily='system-icons'
				fill='#999'
				fontSize={28}
				textAlign='center'
				x={root.ctx.canvas.width / 2 - 8}
				y={480}
			>
				
			</Text>
		</>
	);
}
