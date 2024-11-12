import { Text, useRoot } from 'react-tela';
import { useGamepad } from '../hooks/use-gamepad';

export function ErrorAppletMode() {
	const root = useRoot();

	useGamepad(
		{
			A() {
				Switch.exit();
			},
		},
		[],
	);

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
				● Applet Mode ●
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={340}
			>
				NSP Forwarder Generator requires full-memory access.
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={390}
			>
				Please re-launch via title redirection.
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='#999'
				fontSize={28}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={480}
			>
				{'(Press     to exit)'}
			</Text>
			<Text
				fontFamily='system-icons'
				fill='#999'
				fontSize={28}
				textAlign='center'
				x={root.ctx.canvas.width / 2 - 8}
				y={480}
			>
				
			</Text>
		</>
	);
}
