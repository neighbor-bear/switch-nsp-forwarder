import { Text, useRoot } from 'react-tela';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Footer, FooterItem } from '../components/Footer';
import { useGamepadButton } from '../hooks/use-gamepad';

export function Success() {
	const root = useRoot();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const wasInstalled = searchParams.get('installed') === '1';
	const name = searchParams.get('name') ?? '';

	useGamepadButton('Minus', () => navigate('/select-forwarder-type'), [
		navigate,
	]);

	return (
		<>
			<Text
				fontFamily='sans-serif'
				fill='green'
				fontSize={60}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={200}
			>
				{'Success    '}
			</Text>
			<Text
				fontFamily='system-icons'
				fill='rgb(100, 255, 100)'
				fontSize={60}
				textAlign='center'
				x={root.ctx.canvas.width / 2 + 130}
				y={200}
			>
				
			</Text>
			{wasInstalled ? (
				<>
					<Text
						fontFamily='sans-serif'
						fill='white'
						fontSize={32}
						textAlign='center'
						x={root.ctx.canvas.width / 2}
						y={340}
					>
						Installed Forwarder:
					</Text>
					<Text
						fontFamily='sans-serif'
						fill='yellow'
						fontSize={32}
						textAlign='center'
						x={root.ctx.canvas.width / 2}
						y={400}
					>
						{name}
					</Text>
				</>
			) : (
				<>
					<Text
						fontFamily='sans-serif'
						fill='white'
						fontSize={32}
						textAlign='center'
						x={root.ctx.canvas.width / 2}
						y={340}
					>
						创建快捷方式：
					</Text>
					<Text
						fontFamily='sans-serif'
						fill='yellow'
						fontSize={32}
						textAlign='center'
						x={root.ctx.canvas.width / 2}
						y={400}
					>
						{name}
					</Text>
					<Text
						fontFamily='sans-serif'
						fill='#999'
						fontSize={26}
						textAlign='center'
						x={root.ctx.canvas.width / 2}
						y={500}
					>
						请使用您常用的包安装程序进行安装。
					</Text>
					<Text
						fontFamily='sans-serif'
						fill='#999'
						fontSize={26}
						textAlign='center'
						x={root.ctx.canvas.width / 2}
						y={546}
					>
						(Goldleaf, DBI, Tinfoil, etc.)
					</Text>
				</>
			)}

			<Text
				fontFamily='sans-serif'
				fill='cyan'
				fontSize={16}
				textAlign='right'
				textBaseline='bottom'
				x={root.ctx.canvas.width - 10}
				y={root.ctx.canvas.height - 90}
			>
				{`${searchParams.get('duration') ?? ''} ms`}
			</Text>

			<Footer>
				<FooterItem button='Minus' x={root.ctx.canvas.width - 320}>
					重新开始
				</FooterItem>
				<FooterItem button='Plus' x={root.ctx.canvas.width - 120}>
					退出
				</FooterItem>
			</Footer>
		</>
	);
}
