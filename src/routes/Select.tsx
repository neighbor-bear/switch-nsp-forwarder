import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, useRoot } from 'react-tela';
import { type AppInfo, apps, pathToAppInfo } from '../apps';
import { AppTile } from '../components/AppTile';
import { Footer, FooterItem } from '../components/Footer';
import { FilePicker } from '../components/FilePicker';
import { useDirection, useGamepadButton } from '../hooks/use-gamepad';
import { Scrollbar } from '../components/Scrollbar';

export function Select() {
	const root = useRoot();
	const navigate = useNavigate();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [filePickerShowing, setFilePickerShowing] = useState(false);

	const perRow = 5;
	const focused = !filePickerShowing;
	const containerHeight = root.ctx.canvas.height - 114;
	const totalRows = Math.ceil(apps.length / perRow);

	// Calculate scroll position to keep selected row in view
	// Generally always in the middle unless the top row is selected
	const selectedRow = Math.floor(selectedIndex / perRow);
	const scrollOffset = Math.max(0, selectedRow);

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

	useGamepadButton('B', () => navigate(-1), [navigate], focused);

	useGamepadButton(
		'X',
		() => {
			setFilePickerShowing(true);
		},
		[],
		focused,
	);

	useDirection(
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

	useDirection(
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

	useDirection(
		'Up',
		() => {
			setSelectedIndex((i) => Math.max(0, i - perRow));
		},
		[],
		focused,
	);

	useDirection(
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
				请选择要为其创建桌面图标的应用：
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
						scrollOffset={scrollOffset}
					/>
				))}
				<Scrollbar
					height={containerHeight}
					x={root.ctx.canvas.width}
					numEntries={totalRows}
					itemsPerPage={1}
					scrollOffset={scrollOffset}
				/>
			</Group>

			<Footer>
				<FooterItem button='Plus' x={root.ctx.canvas.width - 560}>
					退出
				</FooterItem>
				<FooterItem button='X' x={root.ctx.canvas.width - 450}>
					文件选择器
				</FooterItem>
				<FooterItem button='B' x={root.ctx.canvas.width - 260}>
					返回
				</FooterItem>
				<FooterItem button='A' x={root.ctx.canvas.width - 140}>
					选择
				</FooterItem>
			</Footer>

			{filePickerShowing && (
				<FilePicker
					onClose={() => {
						setFilePickerShowing(false);
					}}
					onSelect={(url) => {
						const app = pathToAppInfo(url);
						if (app) {
							goToEdit(app);
						}
					}}
				/>
			)}
		</>
	);
}
