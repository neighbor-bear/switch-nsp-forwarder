import React from 'react';
import { render } from 'react-tela/render';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { AppletType } from '@nx.js/constants';
import { prodKeys } from './prod-keys';

// Routes
import { ErrorAppletMode } from './routes/ErrorAppletMode';
import { ErrorMissingProdKeys } from './routes/ErrorMissingProdKeys';
import { Select } from './routes/Select';
import { Generate } from './routes/Generate';
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

let initialRoute = '/select';
if (Switch.appletType() !== AppletType.Application) {
	// Ensure the app is running in full-memory mode
	initialRoute = '/error-applet-mode';
} else if (!prodKeys) {
	// Ensure the `prod.keys` file exists
	initialRoute = '/error-missing-prod-keys';
}

const router = createMemoryRouter(routes, {
	initialEntries: [initialRoute],
	initialIndex: 0,
});

render(<RouterProvider router={router} />, screen);
