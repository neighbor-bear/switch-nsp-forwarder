import { AppletType } from '@nx.js/constants';
export const isFullMemoryMode = () => AppletType.Application === Switch.appletType();
