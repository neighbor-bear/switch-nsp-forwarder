import { Button } from '@nx.js/constants';
import { Group, Text, useRoot } from 'react-tela';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apps } from '../apps';
import { AppTile } from '../components/AppTile';

export function Select() {
    const root = useRoot();
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        let raf: number;
        function loop() {
            const [gp] = navigator.getGamepads();
            if (gp?.buttons[Button.A]?.pressed) {
                const [path, app] = apps[selectedIndex];
                navigate('/generate', {
                    state: {
                        app,
                        path,
                        name: app.name,
                        author: app.author,
                        version: app.version,
                    },
                });
            } else if (gp?.buttons[Button.Right]?.pressed) {
                setSelectedIndex(i => i + 1);
            } else {
                raf = requestAnimationFrame(loop);
            }
        }
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [selectedIndex, navigate]);

    return <>
        <Text fill='white' fontSize={24}>Select an app to create a forwader for:</Text>
        <Group y={40} width={root.ctx.canvas.width} height={root.ctx.canvas.height - 40}>
            {apps.map((app, i) => <AppTile key={app[0]} app={app[1]} index={i} selected={selectedIndex === i} />)}</Group>
    </>;
}
