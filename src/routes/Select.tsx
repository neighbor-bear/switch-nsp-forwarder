import { Button } from '@nx.js/constants';
import { Group, Text, useRoot } from 'react-tela';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apps } from '../apps';
import { AppTile } from '../components/AppTile';
import { useGamepad } from '../hooks/use-gamepad';
import type { EditState } from './Edit';

export function Select() {
	const root = useRoot();
	const navigate = useNavigate();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const perRow = 4;

	function goToEdit([path, app]: [string, Switch.Application]) {
		const state: EditState = {
			app,
			path,
		};
		navigate('/edit', { state });
	}

	useGamepad(
		{
			[Button.A]() {
				goToEdit(apps[selectedIndex]);
			},
			[Button.Left]() {
				setSelectedIndex((i) => {
					if (i % perRow === 0) return i;
					return i - 1;
				});
			},
			[Button.Right]() {
				setSelectedIndex((i) => {
					if (i === apps.length - 1) return i;
					if (i % perRow === perRow - 1) return i;
					return i + 1;
				});
			},
			[Button.Up]() {
				setSelectedIndex((i) => Math.max(0, i - perRow));
			},
			[Button.Down]() {
				setSelectedIndex((i) => Math.min(apps.length - 1, i + perRow));
			},
		},
		[selectedIndex, navigate],
	);

	return (
		<>
			<Text fill='white' fontSize={24}>
				Select an app to create a forwader for:
			</Text>
			<Text fill='white' fontSize={24} x={500}>
				{apps[selectedIndex][0]}
			</Text>
			<Group
				y={40}
				width={root.ctx.canvas.width}
				height={root.ctx.canvas.height - 40}
			>
				{apps.map((app, i) => (
					<AppTile
						key={app[0]}
						app={app[1]}
						index={i}
						onTouchEnd={() => goToEdit(app)}
						selected={selectedIndex === i}
					/>
				))}
			</Group>
		</>
	);
}
