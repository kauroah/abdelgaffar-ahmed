import { handleBadgesSync } from '../badges';

export const onRequestPost = (): Promise<Response> => handleBadgesSync();
