export function isDirectory(mode: number) {
	return (mode & 16384) === 16384;
}

export function abToHex(arr: ArrayBuffer) {
	return Array.from(new Uint8Array(arr))
		.map((v) => v.toString(16).padStart(2, '0'))
		.join('');
}
