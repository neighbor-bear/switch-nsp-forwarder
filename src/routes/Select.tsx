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
        const t = setTimeout(() => {
            const app = apps[selectedIndex];
            navigate('/generate', {
                state: {
                    app,
                    name: app.name,
                    author: app.author,
                    version: app.version,
                },
            });
        }, 1000);
        return () => clearTimeout(t);
    }, [selectedIndex, navigate]);

    return <>
        <Text fill='white' fontSize={24}>Select an app to create a forwader for:</Text>
        <Group y={40} width={root.ctx.canvas.width} height={root.ctx.canvas.height - 40}>
            {apps.map((app, i) => <AppTile key={app.name} app={app} index={i} selected={selectedIndex === i} />)}</Group>
    </>;
}
