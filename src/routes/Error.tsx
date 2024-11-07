import React from "react";
import { Text } from "react-tela";
import { useRouteError } from "react-router-dom";

export function RouteErrorBoundary() {
    const error = useRouteError() as any;
    return (
        <Text x={100} y={100} fill='red'>
            Route Error: {error.data}
        </Text>
    );
}
