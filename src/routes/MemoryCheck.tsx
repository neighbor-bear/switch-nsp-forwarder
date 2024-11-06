import { Text, useRoot } from 'react-tela';
import React, { useEffect } from 'react';
import { AppletType } from '@nx.js/constants';
import { useNavigate } from 'react-router-dom';

export function MemoryCheck() {
    const root = useRoot();
    const navigate = useNavigate();
    const appletType = Switch.appletType();

    // If the app is running in full-memory mode, then continue to the next step
    useEffect(() => {
        if (appletType === AppletType.Application) {
            navigate('/select');
        }
    }, [appletType, navigate]);

    return <>
        <Text fontFamily='sans-serif' fill='red' fontSize={60} textAlign='center' x={root.ctx.canvas.width / 2} y={200}>● Applet Mode ●</Text>
        <Text fontFamily='sans-serif' fill='white' fontSize={32} textAlign='center' x={root.ctx.canvas.width / 2} y={340}>NSP Forwarder Generator requires full-memory access.</Text>
        <Text fontFamily='sans-serif' fill='white' fontSize={32} textAlign='center' x={root.ctx.canvas.width / 2} y={390}>Please re-launch via title redirection.</Text>
        <Text fontFamily='sans-serif' fill='#999' fontSize={28} textAlign='center' x={root.ctx.canvas.width / 2} y={480}>(Press     to exit)</Text>
        <Text fontFamily='system-icons' fill='#999' fontSize={28} textAlign='center' x={root.ctx.canvas.width / 2 - 8} y={480}></Text>
    </>;
}
