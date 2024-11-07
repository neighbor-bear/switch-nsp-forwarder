import React from 'react';
import { render } from 'react-tela/render';
import {
    RouterProvider,
    createMemoryRouter,
} from 'react-router-dom';

import { ErrorAppletMode } from './routes/ErrorAppletMode';
import { ErrorMissingProdKeys } from './routes/ErrorMissingProdKeys';
import { Select } from './routes/Select';
import { Generate } from './routes/Generate';
import { isFullMemoryMode } from './is-applet-mode';
import { hasProdKeys } from './prod-keys';
import { RouteErrorBoundary } from './routes/Error';

const routes = [
    {
        path: '/error-applet-mode',
        element: <ErrorAppletMode />,
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: '/error-missing-prod-keys',
        element: <ErrorMissingProdKeys />,
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: '/select',
        element: <Select />,
        errorElement: <RouteErrorBoundary />,
    },
    {
        path: '/generate',
        element: <Generate />,
        errorElement: <RouteErrorBoundary />,
    },
];

const initialRoute = !isFullMemoryMode() ? '/error-applet-mode' :
    !hasProdKeys() ? '/error-missing-prod-keys' :
        '/select';

const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0
});

render(<RouterProvider router={router} />, screen);

//function* nroIterator(path: string | URL) {
//    const entries = Switch.readDirSync(path);
//    if (!entries) {
//        return;
//    }
//    for (const entry of entries) {
//        const fullPath = new URL(entry, path);
//        const data = Switch.readFileSync(fullPath);
//        if (!data) {
//            continue;
//        }
//        const app = new Switch.Application(data)
//        yield app;
//    }
//}
//
//const ctx = screen.getContext('2d');
//const apps = [...nroIterator('sdmc:/switch/')];
//
//let x = 0;
//let y = 0;
//const logoSize = 256;
//
//ctx.fillStyle = 'white';
//ctx.font = '48px sans-serif';
//ctx.textAlign = 'center';
//ctx.textBaseline = 'top';
//ctx.fillText('NSP Forwarder Generator', screen.width / 2, 12);
//
//for (let i = 0; i < apps.length; i++) {
//    const app = apps[i];
//    const { icon, name } = app;
//    if (!icon) continue;
//    createImageBitmap(new Blob([icon])).then((bitmap) => {
//        ctx.drawImage(bitmap, (x++) * logoSize, y * logoSize, 256, 256);
//        if (x > 4) {
//            x = 0;
//            y++;
//        }
//    });
//}

//import { NACP } from '@tootallnate/nacp';
//import ModuleFactory from './hacbrewpack.js';
//
//const Module = await ModuleFactory({
//    noInitialRun: true,
//});
//const { FS } = Module;
//
//const keys = new Uint8Array(Switch.readFileSync('romfs:/prod.keys'));
//FS.writeFile('/keys.dat', keys);
//
//const main = new Uint8Array(Switch.readFileSync('romfs:/template/exefs/main'));
//const mainNpdm = new Uint8Array(Switch.readFileSync('romfs:/template/exefs/main.npdm'));
//FS.mkdir('/exefs');
//FS.writeFile('/exefs/main', main);
//FS.writeFile('/exefs/main.npdm', mainNpdm);
//
//const titleId = '01b7b5d958110000';
//const nacp = new NACP();
//nacp.id = titleId;
//nacp.title = 'test'
//nacp.author = 'nate';
//nacp.version = '1.0.0';
//
//FS.mkdir('/control');
//FS.writeFile('/control/control.nacp', new Uint8Array(nacp.buffer));
//
//const image = new Uint8Array(Switch.readFileSync('romfs:/icon.jpg'));
//FS.writeFile('/control/icon_AmericanEnglish.dat', image);
//
////FS.mkdir('/logo');
////FS.writeFile('/logo/NintendoLogo.png', logo);
////FS.writeFile('/logo/StartupMovie.gif', startupMovie);
//
//FS.mkdir('/romfs');
//FS.writeFile('/romfs/nextArgv', 'sdmc:/hbmenu.nro');
//FS.writeFile('/romfs/nextNroPath', 'sdmc:/hbmenu.nro');
//
//const exitCode = Module.callMain(['--nopatchnacplogo', '--titleid', titleId, '--nologo']);
//console.log({ exitCode });
//
//let nsp;
//if (exitCode === 0) {
//    try {
//        const nspName = FS.readdir('/hacbrewpack_nsp').filter((n) =>
//            n.endsWith('.nsp')
//        )[0];
//        console.log({ nspName });
//
//        const data = FS.readFile(`/hacbrewpack_nsp/${nspName}`);
//        console.log(data);
//        Switch.writeFileSync(new URL(nspName, 'sdmc:/'), data);
//        //nsp = new File([data], nspName);
//    } catch (err) {
//        console.error('Failed to locate NSP file:', err.message);
//    }
//}
