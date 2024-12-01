export interface AppInfo {
	path: string;
	id: string;
	name: string;
	author: string;
	version: string;
	icon: ArrayBuffer | undefined;
}

function isDirectory(mode: number) {
	return (mode & 16384) === 16384;
}

function* nroIterator(
	path: string | URL,
	recursive = true,
): IteratorObject<URL, void> {
	const entries = Switch.readDirSync(path) ?? [];
	for (const entry of entries) {
		// Skip hidden files
		if (entry.startsWith('.')) continue;

		const fullPath = new URL(entry, path);

		let stat = null;
		try {
			stat = Switch.statSync(fullPath);
		} catch (err) {
			console.debug(`Failed to stat ${fullPath}: ${err}`);
		}

		if (!stat) continue;

		if (isDirectory(stat.mode)) {
			if (recursive) {
				// Only traverse one level deep into the "switch" directory
				yield* nroIterator(new URL(`${fullPath}/`), false);
			}
		} else if (entry.endsWith('.nro')) {
			yield fullPath;
		}
	}
}

export const apps: AppInfo[] = [...nroIterator('sdmc:/switch/')].map((path) => {
	const app = new Switch.Application(path);
	return {
		path: path.href,
		id: app.id.toString(16).padStart(16, '0'),
		name: app.name,
		author: app.author,
		version: app.version,
		icon: app.icon,
	};
});
