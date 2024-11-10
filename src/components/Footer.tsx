import React from 'react';
import { useRoot, Group, Rect, Text } from 'react-tela';
import { BUTTON_ICONS } from '../button-icons';
import type { Button } from '@nx.js/constants';

export function Footer({ children }: { children: React.ReactNode }) {
	const root = useRoot();
	return (
		<Group
			width={root.ctx.canvas.width}
			height={74}
			y={root.ctx.canvas.height - 74}
		>
			<Rect width={root.ctx.canvas.width} height={2} fill='white' />
			{children}
		</Group>
	);
}

export function FooterItem({
	button,
	children,
	x,
}: { button: Button; children: string; x: number }) {
	return (
		<>
			<Text
				fontFamily='system-icons'
				fill='white'
				fontSize={24}
				textBaseline='middle'
				x={x}
				y={37}
			>
				{BUTTON_ICONS[button]}
			</Text>
			<Text
				fontFamily='system-ui'
				fill='white'
				fontSize={24}
				textBaseline='middle'
				x={x + 30}
				y={37}
			>
				{children}
			</Text>
		</>
	);
}
