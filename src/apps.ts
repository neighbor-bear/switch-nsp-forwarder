function isDirectory(mode: number) {
	return (mode & 16384) === 16384;
}

function* nroIterator(path: string | URL): IteratorObject<URL, void> {
	const entries = Switch.readDirSync(path) ?? [];
	for (const entry of entries) {
		const fullPath = new URL(entry, path);
		const stat = Switch.statSync(fullPath);
		if (stat) {
			if (isDirectory(stat.mode)) {
				yield* nroIterator(new URL(`${fullPath}/`));
			} else if (entry.endsWith('.nro')) {
				yield fullPath;
			}
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
