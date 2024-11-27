import { Text, useRoot } from 'react-tela';
import { useSearchParams } from 'react-router-dom';

export function Success() {
	const root = useRoot();
	const [searchParams] = useSearchParams();
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
			<Text
				fontFamily='sans-serif'
				fill='white'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={340}
			>
				Created NSP file:
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='yellow'
				fontSize={32}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={400}
			>
				{searchParams.get('name') ?? ''}
			</Text>
			<Text
				fontFamily='sans-serif'
				fill='#999'
				fontSize={26}
				textAlign='center'
				x={root.ctx.canvas.width / 2}
				y={500}
			>
				Please install it with your preferred title installer.
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
	);
}
