import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, useRoot } from 'react-tela';
import { type AppInfo, apps, pathToAppInfo } from '../apps';
import { AppTile } from '../components/AppTile';
import { Footer, FooterItem } from '../components/Footer';
import { FilePicker } from '../components/FilePicker';
import { useGamepadButton } from '../hooks/use-gamepad';

export function Select() {
	const root = useRoot();
	const navigate = useNavigate();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [filePickerShowing, setFilePickerShowing] = useState(false);

	const perRow = 5;
	const focused = !filePickerShowing;

	const goToEdit = useCallback(
		(appInfo: AppInfo) => {
			navigate('/edit', { state: appInfo });
		},
		[navigate],
	);

	useGamepadButton(
		'A',
		() => goToEdit(apps[selectedIndex]),
		[selectedIndex, goToEdit],
		focused,
	);

	useGamepadButton(
		'X',
		() => {
			setFilePickerShowing(true);
		},
		[],
		focused,
	);

	useGamepadButton(
		'Left',
		() => {
			setSelectedIndex((i) => {
				if (i % perRow === 0) return i;
				return i - 1;
			});
		},
		[],
		focused,
	);

	useGamepadButton(
		'Right',
		() => {
			setSelectedIndex((i) => {
				if (i === apps.length - 1) return i;
				if (i % perRow === perRow - 1) return i;
				return i + 1;
			});
		},
		[],
		focused,
	);

	useGamepadButton(
		'Up',
		() => {
			setSelectedIndex((i) => Math.max(0, i - perRow));
		},
		[],
		focused,
	);

	useGamepadButton(
		'Down',
		() => {
			setSelectedIndex((i) => Math.min(apps.length - 1, i + perRow));
		},
		[],
		focused,
	);

	return (
		<>
			<Text fill='white' fontSize={24}>
				Select an app to create a forwader for:
			</Text>
			<Text fill='white' fontSize={24} x={500}>
				{apps[selectedIndex].path}
			</Text>

			<Group
				y={40}
				width={root.ctx.canvas.width}
				height={root.ctx.canvas.height - 114}
			>
				{apps.map((app, i) => (
					<AppTile
						key={app.path}
						icon={app.icon}
						name={app.name}
						index={i}
						onTouchEnd={() => goToEdit(app)}
						selected={selectedIndex === i}
					/>
				))}
			</Group>

			<Footer>
				<FooterItem button='Plus' x={root.ctx.canvas.width - 460}>
					Exit
				</FooterItem>
				<FooterItem button='X' x={root.ctx.canvas.width - 340}>
					File Picker
				</FooterItem>
				<FooterItem button='A' x={root.ctx.canvas.width - 140}>
					Select
				</FooterItem>
			</Footer>

			{filePickerShowing && (
				<FilePicker
					onClose={() => {
						setFilePickerShowing(false);
					}}
					onSelect={(url) => {
						goToEdit(pathToAppInfo(url));
					}}
				/>
			)}
		</>
	);
}
