import { Text } from 'react-tela';
import { useRouteError } from 'react-router-dom';

export function RouteErrorBoundary() {
	// biome-ignore lint/suspicious/noExplicitAny: TODO properly handle `unknown` type
	const error = useRouteError() as any;
	return (
		<Text x={100} y={100} fill='red'>
			Route Error: {error.data}
		</Text>
	);
}
