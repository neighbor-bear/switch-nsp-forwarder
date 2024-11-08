import { Group, Rect, Text, type TextProps } from 'react-tela';
import React from 'react';

export interface TextInputProps extends TextProps {
	width: number;
	value: string;
	padding?: number;
	onChange: (value: string) => void;
}

export function TextInput({
	value,
	onChange,
	width,
	x,
	y,
	padding = 8,
	...textProps
}: TextInputProps) {
	return (
		<Group
			width={width + padding * 2}
			height={textProps.fontSize + padding * 2}
			x={x}
			y={y}
		>
			<Text {...textProps} x={padding} y={padding}>
				{value}
			</Text>
			<Rect
				width={width + padding * 2}
				height={textProps.fontSize + padding * 2}
				stroke='white'
				lineWidth={2}
			/>
		</Group>
	);
}
