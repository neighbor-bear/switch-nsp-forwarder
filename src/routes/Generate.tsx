import { NACP } from '@tootallnate/nacp';
import { Text, useRoot } from 'react-tela';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Module } from '../hacbrewpack';

export function Generate() {
    const { state } = useLocation();
    const [status, setStatus] = useState('generating');
    const [logs, setLogs] = useState('');

    useEffect(() => {
        (async () => {
            const ModuleFactory = await import('../hacbrewpack.js');
            const titleId = '01b7b5d958110000';
            const helloWasm = Switch.readFileSync('romfs:/hacbrewpack.wasm');
            if (!helloWasm) {
                setStatus('error: missing `hacbrewpack.wasm` file');
                return;
            }

            let Module: Module;
            await ModuleFactory.default({
                noInitialRun: true,
                wasmBinary: helloWasm,
                print(text) {
                    console.debug(text);
                    setLogs((logs) => `${logs + text}\n`);
                },
                printErr(text) {
                    console.debug(text);
                    setLogs((logs) => `${logs + text}\n`);
                },
                preRun(_Module) {
                    Module = _Module;
                    setStatus('preRun');
                    const { FS } = Module;

                    const keys = new Uint8Array(Switch.readFileSync('sdmc:/switch/prod.keys'));
                    FS.writeFile('/keys.dat', keys);

                    const main = new Uint8Array(Switch.readFileSync('romfs:/template/exefs/main'));
                    const mainNpdm = new Uint8Array(Switch.readFileSync('romfs:/template/exefs/main.npdm'));
                    FS.mkdir('/exefs');
                    FS.writeFile('/exefs/main', main);
                    FS.writeFile('/exefs/main.npdm', mainNpdm);

                    const nacp = new NACP();
                    nacp.id = titleId;
                    nacp.title = state.name;
                    nacp.author = state.author;
                    nacp.version = state.version;

                    FS.mkdir('/control');
                    FS.writeFile('/control/control.nacp', new Uint8Array(nacp.buffer));

                    const image = new Uint8Array(state.app.icon);
                    FS.writeFile('/control/icon_AmericanEnglish.dat', image);

                    //FS.mkdir('/logo');
                    //FS.writeFile('/logo/NintendoLogo.png', logo);
                    //FS.writeFile('/logo/StartupMovie.gif', startupMovie);

                    FS.mkdir('/romfs');
                    FS.writeFile('/romfs/nextArgv', 'sdmc:/hbmenu.nro');
                    FS.writeFile('/romfs/nextNroPath', 'sdmc:/hbmenu.nro');
                },
                onRuntimeInitialized: () => {
                    setStatus('onRuntimeInitialized');
                    try {
                        const exitCode = Module.callMain(['--nopatchnacplogo', '--titleid', titleId, '--nologo']);
                        //const exitCode = 1;
                        setStatus(`exit code: ${exitCode}`);
                    } catch (err) {
                        setStatus(`error: ${err}`);
                    }
                },
            });
        })();
    }, []);

    return <>
        <Text fill='white' fontSize={24}>{status}</Text>
        <Text fill='white' fontSize={24} y={32}>{state.app.name}</Text>
        {logs.split('\n').map((line, i) => <Text key={i} fill='white' fontSize={24} y={64 + i * 30}>{line}</Text>)}
    </>;
}
