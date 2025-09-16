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
				"prod.keys" 文件未找到
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={340}
			>
				请运行 Lockpick_RCM.bin 有效载荷
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={390}
			>
				以生成您的 "prod.keys" 文件。
			</Text>

			<Footer>
				<FooterItem button='A' x={root.ctx.canvas.width - 100}>
					退出
				</FooterItem>
			</Footer>
		</>
	);
}
