export function hasProdKeys() {
    const stat = Switch.statSync('sdmc:/switch/prod.keys');
    return stat && stat.size > 0;
}
