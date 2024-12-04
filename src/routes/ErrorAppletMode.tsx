import { Text, useRoot } from 'react-tela';
import { useGamepadButton } from '../hooks/use-gamepad';
import { Footer, FooterItem } from '../components/Footer';

export function ErrorAppletMode() {
	const root = useRoot();

	useGamepadButton('A', () => Switch.exit(), []);

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
			<Footer>
				<FooterItem button='A' x={root.ctx.canvas.width - 100}>
					Exit
				</FooterItem>
			</Footer>
		</>
	);
}
