import { Group, Rect, Text } from 'react-tela';
import { AppIcon } from './AppIcon';

export function AppTile({
	app,
	index,
	selected,
	onTouchEnd,
}: {
	app: Switch.Application;
	index: number;
	selected: boolean;
	onTouchEnd?: () => void;
}) {
	const width = 320;
	const height = 320;
	const perRow = 4;
	const x = (index % perRow) * width;
	const y = Math.floor(index / perRow) * height;
	return (
		<Group width={width} height={height} x={x} y={y} onTouchEnd={onTouchEnd}>
			{selected && (
				<Rect width={width} height={height} fill='rgba(0, 0, 255, 0.5)' />
			)}
			<AppIcon app={app} width={256} height={256} x={width / 2 - 128} y={16} />
			<Text fill='white' fontSize={20} x={width / 2} y={288} textAlign='center'>
				{app.name}
			</Text>
		</Group>
	);
}
