function isDirectory(mode: number) {
	return (mode & 16384) === 16384;
}

function* nroIterator(path: string | URL): IteratorObject<URL, void> {
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
			yield* nroIterator(new URL(`${fullPath}/`));
		} else if (entry.endsWith('.nro')) {
			yield fullPath;
		}
	}
}

export const apps: [string, Switch.Application][] = [
	...nroIterator('sdmc:/switch/'),
].map((fullPath) => [
	fullPath.href,
	// biome-ignore lint/style/noNonNullAssertion: `readFileSync` should always return a value at this point
	new Switch.Application(Switch.readFileSync(fullPath)!),
]);
