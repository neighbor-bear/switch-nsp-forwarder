import React, { useEffect, useState } from "react";
import { Group, Image, Rect, Text } from "react-tela";

export function AppTile({ app, index, selected }: { app: Switch.Application; index: number; selected: boolean }) {
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    useEffect(() => {
        const { icon } = app;
        if (!icon) return;
        const url = URL.createObjectURL(new Blob([icon], { type: 'image/jpeg' }));
        setImgUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [app])

    const width = 320;
    const height = 320;
    const perRow = 4;
    const x = (index % perRow) * width;
    const y = Math.floor(index / perRow) * height;
    return <Group width={width} height={height} x={x} y={y}>
        {selected && <Rect width={width} height={height} fill='rgba(0, 0, 255, 0.5)' />}
        {imgUrl && <Image src={imgUrl} width={256} height={256} x={width / 2 - 128} y={16} />}
        <Text fill='white' fontSize={20} x={width / 2} y={288} textAlign="center">{app.name}</Text>
    </Group>;
}
