export function isDirectory(mode: number) {
	return (mode & 16384) === 16384;
}
