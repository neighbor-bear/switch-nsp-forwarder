import React from "react";
import { Text } from "react-tela";

export function AppTile({ app, index, selected }: { app: Switch.Application; index: number; selected: boolean }) {
    return <><Text fill='white'>{app.name}</Text></>;
}
