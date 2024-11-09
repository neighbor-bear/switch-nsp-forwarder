import React from 'react';
import { Group, Rect, Text, type TextProps } from 'react-tela';

export interface TextInputProps extends TextProps {
	width: number;
	value: string;
	padding?: number;
	focused?: boolean;
	cursorPosition?: number;
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
	cursorPosition = -1,
	...textProps
}: TextInputProps) {
	return (
		<Group
			width={width + padding * 2}
			height={textProps.fontSize + padding * 2}
			x={x}
			y={y}
			onTouchEnd={onTouchEnd}
		>
			<Text {...textProps} x={padding} y={padding}>
				{value}
			</Text>
			{focused && cursorPosition > 0 ? (
				<Rect width={1} height={textProps.fontSize} fill='white' />
			) : null}
			<Rect
				width={width + padding * 2}
				height={textProps.fontSize + padding * 2}
				stroke={focused ? 'white' : 'rgba(255, 255, 255, 0.5)'}
				lineWidth={2}
			/>
		</Group>
	);
}
