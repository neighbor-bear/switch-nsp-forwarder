interface FS {
	mkdir: (path: string) => void;
	writeFile: (path: string, data: Uint8Array | string) => void;
	readFile: (path: string) => Uint8Array;
	readdir: (path: string) => string[];
}

interface Module {
	FS: FS;
	callMain: (args: string[]) => number;
}

interface ModuleInitOptions {
	noInitialRun?: boolean;
	wasmBinary?: ArrayBuffer;
	print?: (text: string) => void;
	printErr?: (text: string) => void;
	preRun?: (Module: Module) => void;
	onRuntimeInitialized?: () => void;
}

export default function (options: ModuleInitOptions): Promise<Module>;
