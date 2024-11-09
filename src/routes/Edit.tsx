import { Button } from '@nx.js/constants';
import React, { useState } from 'react';
import { Group, Rect, Text, useRoot } from 'react-tela';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextInput } from '../components/TextInput';
import { AppIcon } from '../components/AppIcon';
import { useGamepad } from '../hooks/use-gamepad';
import { usePreventExit } from '../hooks/use-prevent-exit';

export function Edit() {
	const {
		state: { app, path },
	} = useLocation();
	const root = useRoot();
	const navigate = useNavigate();
	const [name, setName] = useState(app.name);
	const [author, setAuthor] = useState(app.author);
	const [version, setVersion] = useState(app.version);
	const [profileSelector, setProfileSelector] = useState(false);
	const [nroPath, setNroPath] = useState(path);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const [cursorPosition, setCursorPosition] = useState(3);

	usePreventExit();

	useGamepad(
		{
			[Button.Plus]() {
				navigate('/generate', {
					state: {
						app,
						path: nroPath,
						name,
						author,
						version,
					},
				});
			},
			[Button.A]() {
				if (navigator.virtualKeyboard.boundingRect.height) return;
				navigator.virtualKeyboard.show();
			},
			[Button.B]() {
				if (navigator.virtualKeyboard.boundingRect.height) return;
				// Go back
				navigate(-1);
			},
			[Button.Up]() {},
			[Button.Down]() {},
		},
		[app, nroPath, name, author, version, navigate],
	);

	const fields = [
		{ name: 'App Title', value: name, onChange: setName },
		{ name: 'Author', value: author, onChange: setAuthor },
		{ name: 'Version', value: version, onChange: setVersion },
		{ name: 'NRO Path', value: nroPath, onChange: setNroPath },
	];

	return (
		<>
			<Text fill='white' fontSize={32} x={4} y={8}>
				Edit configuration for your forwarder:
			</Text>

			{fields.map(({ name, value, onChange }, i) => (
				<>
					<Text fill='white' fontSize={24} x={20} y={88 + i * 50}>
						{name}:
					</Text>
					<TextInput
						value={value}
						onChange={onChange}
						width={500}
						x={160}
						y={80 + i * 50}
						fontSize={24}
						fill='white'
						focused={focusedIndex === i}
						cursorPosition={cursorPosition}
						onTouchEnd={() => setFocusedIndex(i)}
					/>
				</>
			))}

			<AppIcon app={app} x={root.ctx.canvas.width - 320} y={64} />

			<Group
				width={root.ctx.canvas.width}
				height={80}
				y={root.ctx.canvas.height - 80}
			>
				<Rect width={root.ctx.canvas.width} height={2} fill='white' />
				<Text
					fill='white'
					fontSize={32}
					textBaseline='middle'
					textAlign='right'
					x={root.ctx.canvas.width - 20}
					y={40}
				>
					Generate
				</Text>
				<Text
					fontFamily='system-icons'
					fill='white'
					fontSize={32}
					textBaseline='middle'
					textAlign='right'
					x={root.ctx.canvas.width - 174}
					y={40}
				>
					
				</Text>
				<Text
					fill='white'
					fontSize={32}
					textBaseline='middle'
					textAlign='right'
					x={root.ctx.canvas.width - 260}
					y={40}
				>
					Edit
				</Text>
				<Text
					fontFamily='system-icons'
					fill='white'
					fontSize={32}
					textBaseline='middle'
					textAlign='right'
					x={root.ctx.canvas.width - 330}
					y={40}
				>
					
				</Text>
				<Text
					fill='white'
					fontSize={32}
					textBaseline='middle'
					textAlign='right'
					x={root.ctx.canvas.width - 420}
					y={40}
				>
					Back
				</Text>
				<Text
					fontFamily='system-icons'
					fill='white'
					fontSize={32}
					textBaseline='middle'
					textAlign='right'
					x={root.ctx.canvas.width - 500}
					y={40}
				>
					
				</Text>
			</Group>
		</>
	);
}
