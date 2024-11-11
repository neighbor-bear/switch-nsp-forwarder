import React, { useEffect, useState } from 'react';
import { Group, Rect, Text, type TextProps } from 'react-tela';
import { useGamepad } from '../hooks/use-gamepad';

export interface TextInputProps extends TextProps {
	width: number;
	value: string;
	padding?: number;
	focused?: boolean;
	onChange: (value: string) => void;
}

export function TextInput({
	value,
	onChange,
	onTouchEnd,
	width,
	x,
	y,
	padding = 8,
	focused,
	fontSize = 24,
	...textProps
}: TextInputProps) {
	const [cursorPosition, setCursorPosition] = useState(0);

	useGamepad(
		{
			A() {
				const vk = navigator.virtualKeyboard;
				if (!focused || vk.boundingRect.height) return;
				vk.show();
			},
		},
		[focused, value],
	);

	useEffect(() => {
		if (!focused) return;
		const vk = navigator.virtualKeyboard;
		function onCursorMove() {
			setCursorPosition(vk.cursorIndex);
		}
		vk.addEventListener('cursormove', onCursorMove);
		return () => {
			vk.removeEventListener('cursormove', onCursorMove);
		};
	}, [focused]);

	return (
		<Group
			width={width + padding * 2}
			height={fontSize + padding * 2}
			x={x}
			y={y}
			onTouchEnd={onTouchEnd}
		>
			<Text {...textProps} fontSize={fontSize} x={padding} y={padding}>
				{value}
			</Text>
			{focused && cursorPosition > 0 ? (
				<Rect width={1} height={fontSize} fill='white' />
			) : null}
			<Rect
				width={width + padding * 2}
				height={fontSize + padding * 2}
				stroke={focused ? 'white' : 'rgba(255, 255, 255, 0.5)'}
				lineWidth={2}
			/>
		</Group>
	);
}
