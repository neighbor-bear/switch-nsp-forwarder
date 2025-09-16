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
				● 小程序模式 ●
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={340}
			>
				NSP转发生成器需要完全内存访问权限。
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={390}
			>
				请通过标题重定向重新启动。
			</Text>
			<Footer>
				<FooterItem button='A' x={root.ctx.canvas.width - 100}>
					退出
				</FooterItem>
			</Footer>
		</>
	);
}
