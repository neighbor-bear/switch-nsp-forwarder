function* nroIterator(path: string | URL) {
	const entries = Switch.readDirSync(path);
	if (!entries) {
		return;
	}
	for (const entry of entries) {
		if (!entry.endsWith('.nro')) {
			continue;
		}
		const fullPath = new URL(entry, path);
		const data = Switch.readFileSync(fullPath);
		if (!data) {
			continue;
		}
		yield fullPath;
	}
}

export const apps: [string, Switch.Application][] = [
	...nroIterator('sdmc:/switch/'),
].map((fullPath) => [
	fullPath.href,
	new Switch.Application(Switch.readFileSync(fullPath)),
]);
