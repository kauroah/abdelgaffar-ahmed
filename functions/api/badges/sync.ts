import { handleBadgesSync } from '../badges';
import { createUsageGate, type D1Database } from '../../_shared/usageLimits';

interface Env {
  API_LIMITS_DB?: D1Database;
  BADGES_SYNC_TOKEN?: string;
}

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export const onRequestPost = ({ request, env }: PagesFunctionContext): Promise<Response> =>
  handleBadgesSync(request, env, fetch, createUsageGate(env.API_LIMITS_DB));
