import { useEffect } from 'react';

const onBeforeUnload = (e: Event) => e.preventDefault();

/**
 * Hook to prevent the `+` button from closing the app.
 */
export function usePreventExit() {
	useEffect(() => {
		window.addEventListener('beforeunload', onBeforeUnload);
		return () => window.removeEventListener('beforeunload', onBeforeUnload);
	}, []);
}
