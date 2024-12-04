import { Text, useRoot } from 'react-tela';
import { useGamepadButton } from '../hooks/use-gamepad';
import { Footer, FooterItem } from '../components/Footer';

export function ErrorMissingProdKeys() {
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

			<Footer>
				<FooterItem button='A' x={root.ctx.canvas.width - 100}>
					Exit
				</FooterItem>
			</Footer>
		</>
	);
}
