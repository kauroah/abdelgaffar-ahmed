export interface D1PreparedStatement {
  bind(...values: Array<string | number>): D1PreparedStatement;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface UsageDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface UsageGate {
  consume(
    request: Request | null,
    key: string,
    limit: number,
    windowMs: number,
    units?: number,
  ): Promise<UsageDecision>;
}

const UPSERT_USAGE_SQL = `
  INSERT INTO api_usage_limits (bucket_key, window_start_ms, count, expires_at_ms)
  VALUES (?1, ?2, ?3, ?4)
  ON CONFLICT(bucket_key) DO UPDATE SET
    window_start_ms = excluded.window_start_ms,
    count = CASE
      WHEN api_usage_limits.window_start_ms = excluded.window_start_ms
        THEN api_usage_limits.count + excluded.count
      ELSE excluded.count
    END,
    expires_at_ms = excluded.expires_at_ms
  WHERE api_usage_limits.window_start_ms != excluded.window_start_ms
    OR api_usage_limits.count + excluded.count <= ?5
  RETURNING count
`;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
let lastCleanupTime = 0;

async function getActorKey(request: Request | null): Promise<string> {
  if (!request) return 'global';

  const address = request.headers.get('CF-Connecting-IP')?.trim();
  if (!address) throw new Error('Client address is unavailable.');

  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(address));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function createUsageGate(database?: D1Database): UsageGate {
  return {
    async consume(request, key, limit, windowMs, units = 1) {
      if (!database) throw new Error('The API usage database is not configured.');
      if (!Number.isInteger(limit) || limit < 1 ||
          !Number.isInteger(windowMs) || windowMs < 1 ||
          !Number.isInteger(units) || units < 1 || units > limit) {
        throw new Error('Invalid API usage limit.');
      }

      const now = Date.now();
      const windowStart = Math.floor(now / windowMs) * windowMs;
      const expiresAt = windowStart + windowMs;
      const actor = await getActorKey(request);
      const bucketKey = `${key}:${actor}`;

      if (now - lastCleanupTime >= CLEANUP_INTERVAL_MS) {
        await database
          .prepare('DELETE FROM api_usage_limits WHERE expires_at_ms <= ?1')
          .bind(now)
          .run();
        lastCleanupTime = now;
      }

      const result = await database
        .prepare(UPSERT_USAGE_SQL)
        .bind(bucketKey, windowStart, units, expiresAt, limit)
        .first<{ count: number }>();

      if (result) return { allowed: true, retryAfterSeconds: 0 };
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((expiresAt - now) / 1000)),
      };
    },
  };
}

export async function consumeLimits(
  gate: UsageGate,
  request: Request | null,
  limits: Array<{
    key: string;
    limit: number;
    windowMs: number;
    units?: number;
    global?: boolean;
  }>,
): Promise<UsageDecision> {
  for (const limit of limits) {
    const decision = await gate.consume(
      limit.global ? null : request,
      limit.key,
      limit.limit,
      limit.windowMs,
      limit.units,
    );
    if (!decision.allowed) return decision;
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function tooManyRequests(body: unknown, retryAfterSeconds: number): Response {
  return Response.json(body, {
    status: 429,
    headers: { 'Retry-After': String(Math.max(1, retryAfterSeconds)) },
  });
}
