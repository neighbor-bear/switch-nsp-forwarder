import { useEffect, useState } from 'react';
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
	fontSize = 24,
	focused = false,
	...textProps
}: TextInputProps) {
	const [cursorPosition, setCursorPosition] = useState(-1);

	useGamepad(
		{
			A() {
				if (!focused) return; // Ignore since this input is not focused
				const vk = navigator.virtualKeyboard;
				if (vk.boundingRect.height) return; // Ignore since the keyboard is already open
				vk.value = value;
				vk.cursorIndex = cursorPosition >= 0 ? cursorPosition : value.length;
				vk.show();
			},
		},
		[focused, value, cursorPosition],
	);

	useEffect(() => {
		if (!focused) return;
		const vk = navigator.virtualKeyboard;
		function onCursorMoveEvent() {
			setCursorPosition(vk.cursorIndex);
		}
		function onChangeEvent() {
			setCursorPosition(vk.cursorIndex);
			onChange(vk.value);
		}
		vk.addEventListener('change', onChangeEvent);
		vk.addEventListener('cursormove', onCursorMoveEvent);
		return () => {
			vk.removeEventListener('change', onChangeEvent);
			vk.removeEventListener('cursormove', onCursorMoveEvent);
		};
	}, [focused, onChange]);

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
			{focused && cursorPosition >= 0 ? (
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
