function* nroIterator(path: string | URL) {
    const entries = Switch.readDirSync(path);
    if (!entries) {
        return;
    }
    for (const entry of entries) {
        const fullPath = new URL(entry, path);
        const data = Switch.readFileSync(fullPath);
        if (!data) {
            continue;
        }
        const app = new Switch.Application(data)
        yield app;
    }
}

export const apps = [...nroIterator('sdmc:/switch/')];
