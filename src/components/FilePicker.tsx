import { useCallback, useEffect, useState } from 'react';
import { Group, Rect, Text, useRoot } from 'react-tela';
import { useGamepadButton } from '../hooks/use-gamepad';
import { isDirectory } from '../util';

interface Entry {
	name: string;
	isDirectory: boolean;
}

export interface FilePickerProps {
	onSelect?: (url: URL) => void;
	onClose?: () => void;
}

export function FilePicker({ onSelect, onClose }: FilePickerProps) {
	const [dir, setDir] = useState(new URL('sdmc:/'));
	const [entries, setEntries] = useState<Entry[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const root = useRoot();
	const focused = true;
	const numEntries = entries.length;

	const doSelect = useCallback(
		(entry: Entry) => {
			if (entry.name === '..' && dir.href.endsWith(':/')) {
				return onClose?.();
			}

			let selection: URL;
			try {
				selection = new URL(
					entry.isDirectory ? `${entry.name}/` : entry.name,
					dir,
				);
			} catch (err) {
				console.debug(`Failed to parse URL from entry: ${entry} from ${dir}`);
				return;
			}
			console.debug('Selection:', selection.href);

			if (entry.isDirectory) {
				setDir(selection);
				setSelectedIndex(0);
			} else {
				onSelect?.(selection);
			}
		},
		[dir, onClose, onSelect],
	);

	useGamepadButton(
		'A',
		() => {
			doSelect(entries[selectedIndex]);
		},
		[doSelect, entries, selectedIndex],
		focused,
	);

	useGamepadButton(
		'B',
		() => doSelect(entries[0]),
		[doSelect, entries],
		focused,
	);

	useGamepadButton(
		'Up',
		() => {
			setSelectedIndex((i) => Math.max(0, i - 1));
		},
		[],
		focused,
	);

	useGamepadButton(
		'Down',
		() => {
			setSelectedIndex((i) => Math.min(numEntries - 1, i + 1));
		},
		[numEntries],
		focused,
	);

	useEffect(() => {
		const names = (Switch.readDirSync(dir) ?? []).filter((name) => {
			// Skip hidden files
			return !name.startsWith('.');
		});
		const entries: Entry[] = names
			.map((name) => {
				try {
					const stat = Switch.statSync(new URL(name, dir));
					return {
						name,
						isDirectory: stat ? isDirectory(stat.mode) : false,
					};
				} catch (err) {
					console.debug(`Failed to stat "${name}" in "${dir}": ${err}`);
				}
			})
			.filter((v) => typeof v !== 'undefined');
		setEntries(
			[{ name: '..', isDirectory: true }, ...entries].sort((a, b) => {
				if (a.isDirectory && !b.isDirectory) return -1;
				if (b.isDirectory && !a.isDirectory) return 1;
				return a.name.localeCompare(b.name);
			}),
		);
	}, [dir]);

	return (
		<>
			<Rect
				width={root.ctx.canvas.width}
				height={root.ctx.canvas.height}
				fill='rgba(0, 0, 0, 0.5)'
			/>
			<Group
				width={root.ctx.canvas.width - 80}
				height={root.ctx.canvas.height - 80}
				x={40}
				y={40}
			>
				<Rect
					width={root.ctx.canvas.width - 80}
					height={root.ctx.canvas.height - 80}
					fill='black'
					lineWidth={4}
				/>
				{entries.map((entry, i) => (
					<FilePickerItem
						key={entry.name}
						entry={entry}
						index={i}
						selected={i === selectedIndex}
					/>
				))}
				<Rect
					width={root.ctx.canvas.width - 80}
					height={root.ctx.canvas.height - 80}
					stroke='white'
					lineWidth={4}
				/>
			</Group>
		</>
	);
}

function FilePickerItem({
	entry,
	index,
	selected,
	onTouchEnd,
}: {
	entry: Entry;
	index: number;
	selected: boolean;
	onTouchEnd?: () => void;
}) {
	const root = useRoot();
	const width = root.ctx.canvas.width - 80;
	const height = 20;
	const padding = 8;
	const y = (height + padding * 2) * index;
	return (
		<Group
			width={width}
			height={height + padding * 2}
			x={0}
			y={y}
			onTouchEnd={onTouchEnd}
		>
			{selected && (
				<Rect width={width} height={height + padding * 2} fill='blue' />
			)}
			<Text
				fill='white'
				fontFamily='system-icons'
				fontSize={height}
				x={padding}
				y={padding}
			>
				{entry.isDirectory ? '' : ''}
			</Text>
			<Text fill='white' fontSize={height} x={padding + 28} y={padding}>
				{entry.name}
			</Text>
		</Group>
	);
}
