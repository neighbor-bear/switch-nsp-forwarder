import { Button } from '@nx.js/constants';
import { Group, Rect, Text, useRoot } from 'react-tela';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGamepad } from '../hooks/use-gamepad';
import { TextInput } from '../components/TextInput';

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

	// Prevent + from closing the app
	useEffect(() => {
		function onBeforeUnload(e: Event) {
			e.preventDefault();
		}
		window.addEventListener('beforeunload', onBeforeUnload);
		return () => window.removeEventListener('beforeunload', onBeforeUnload);
	}, []);

	return (
		<>
			<Text fill='white' fontSize={32} x={4} y={4}>
				Edit configuration for your forwarder:
			</Text>

			<Text fill='white' fontSize={24} x={20} y={80}>
				App Title:
			</Text>
			<TextInput
				value={name}
				onChange={(v) => setName(v)}
				width={500}
				x={160}
				y={80}
				fontSize={24}
				fill='white'
			/>

			<Text fill='white' fontSize={24} x={20} y={130}>
				Author:
			</Text>
			<TextInput
				value={author}
				onChange={(v) => setAuthor(v)}
				width={500}
				x={160}
				y={130}
				fontSize={24}
				fill='white'
			/>

			<Text fill='white' fontSize={24} x={20} y={180}>
				Version:
			</Text>
			<TextInput
				value={version}
				onChange={(v) => setVersion(v)}
				width={500}
				x={160}
				y={180}
				fontSize={24}
				fill='white'
			/>

			<Text fill='white' fontSize={24} x={20} y={230}>
				NRO Path:
			</Text>
			<TextInput
				value={nroPath}
				onChange={(v) => setNroPath(v)}
				width={500}
				x={160}
				y={230}
				fontSize={24}
				fill='white'
			/>

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
