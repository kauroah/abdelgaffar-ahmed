import { PROFILE_DATA, type BadgeItem } from '../../src/data/portfolioData';
import {
  consumeLimits,
  createUsageGate,
  tooManyRequests,
  type D1Database,
  type UsageDecision,
  type UsageGate,
} from '../_shared/usageLimits';

const CREDLY_USERNAME = 'ahmed-abdelgaffar';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const BASELINE_BADGES = PROFILE_DATA.badges;

interface BadgeCache {
  lastSyncTime: number;
  badges: BadgeItem[];
}

interface CredlyBadge {
  id?: string;
  name?: string;
  image_url?: string;
  issued_at_date?: string;
  issuer?: { entities?: Array<{ entity?: { name?: string } }> };
  badge_template?: {
    name?: string;
    vanity_slug?: string;
    image_url?: string;
    description?: string;
    skills?: Array<{ name?: string }>;
  };
}

let badgeCache: BadgeCache = { lastSyncTime: 0, badges: BASELINE_BADGES };

interface Env {
  API_LIMITS_DB?: D1Database;
  BADGES_SYNC_TOKEN?: string;
}

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/skill\s*badge/gi, '').replace(/[^a-z0-9]/g, '');
}

function mergeWithBaseline(badges: BadgeItem[]): BadgeItem[] {
  const merged = [...badges];
  for (const baseline of BASELINE_BADGES) {
    const exists = merged.some((badge) =>
      (baseline.credentialId && badge.credentialId === baseline.credentialId) ||
      normalizeTitle(badge.title) === normalizeTitle(baseline.title),
    );
    if (!exists) merged.push(baseline);
  }
  return merged;
}

async function fetchFromCredly(fetcher: typeof fetch): Promise<BadgeItem[]> {
  const response = await fetcher(`https://www.credly.com/users/${CREDLY_USERNAME}/badges.json`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; portfolio badge sync)',
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error(`Credly responded with status ${response.status}`);

  const payload: unknown = await response.json();
  const rawBadges = (payload as { data?: unknown } | null)?.data;
  if (!Array.isArray(rawBadges)) throw new Error('Credly returned an invalid badge list');

  const mapped = (rawBadges as CredlyBadge[]).flatMap((item): BadgeItem[] => {
    const rawTitle = item.badge_template?.name || item.name || 'Untitled Credly Badge';
    const cleanTitle = rawTitle.replace(/\s+skill\s+badge$/i, '').trim();
    const issuerName = item.issuer?.entities?.[0]?.entity?.name || '';
    const issuer: BadgeItem['issuer'] = /mongodb/i.test(`${issuerName} ${rawTitle}`)
      ? 'MongoDB'
      : 'Google Cloud';
    const baseline = BASELINE_BADGES.find((badge) =>
      (badge.credentialId && item.id && badge.credentialId === item.id) ||
      normalizeTitle(badge.title) === normalizeTitle(rawTitle) ||
      Boolean(item.badge_template?.vanity_slug && badge.id.includes(item.badge_template.vanity_slug)),
    );
    const badgeImage = baseline?.badgeImage || item.badge_template?.image_url || item.image_url;
    if (!item.id || !badgeImage) return [];

    return [{
      id: baseline?.id || `credly-${item.id}`,
      title: baseline?.title || cleanTitle,
      issuer,
      category: baseline?.category || (cleanTitle.toLowerCase().includes('ai')
        ? 'AI & Generative Models'
        : 'Database Architecture'),
      date: item.issued_at_date || baseline?.date || 'Recently Issued',
      badgeImage,
      ...(baseline?.pdfPath ? { pdfPath: baseline.pdfPath } : {}),
      verifyUrl: baseline?.verifyUrl || `https://www.credly.com/badges/${item.id}`,
      credentialId: item.id,
      description: item.badge_template?.description || baseline?.description ||
        `Verified certification issued by ${issuerName || issuer}.`,
      keySkills: (item.badge_template?.skills || [])
        .map((skill) => skill.name)
        .filter((name): name is string => Boolean(name))
        .slice(0, 5)
        .concat(baseline?.keySkills || [])
        .slice(0, 5),
      highlight: baseline?.highlight ?? false,
    }];
  });

  const seen = new Set<string>();
  return mapped.filter((badge) => {
    const key = badge.credentialId || normalizeTitle(badge.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function syncCredlyBadges(
  force: boolean,
  fetcher: typeof fetch,
): Promise<{ badges: BadgeItem[]; lastSyncTime: number; nextSyncTime: number; fromCache: boolean; error?: string }> {
  const now = Date.now();
  if (!force && badgeCache.lastSyncTime > 0 &&
      now - badgeCache.lastSyncTime < CACHE_TTL_MS && badgeCache.badges.length > 0) {
    return {
      badges: mergeWithBaseline(badgeCache.badges),
      lastSyncTime: badgeCache.lastSyncTime,
      nextSyncTime: badgeCache.lastSyncTime + CACHE_TTL_MS,
      fromCache: true,
    };
  }

  try {
    const badges = mergeWithBaseline(await fetchFromCredly(fetcher));
    badgeCache = { lastSyncTime: now, badges };
    return {
      badges,
      lastSyncTime: now,
      nextSyncTime: now + CACHE_TTL_MS,
      fromCache: false,
    };
  } catch (error) {
    console.error('[Credly Sync] Failed to refresh badges:', error);
    return {
      badges: mergeWithBaseline(badgeCache.badges),
      lastSyncTime: badgeCache.lastSyncTime || now,
      nextSyncTime: now + CACHE_TTL_MS,
      fromCache: true,
      error: 'Credly badge refresh failed; showing the local baseline.',
    };
  }
}

export async function handleBadgesGet(
  request: Request,
  fetcher: typeof fetch = fetch,
  usageGate: UsageGate = createUsageGate(),
): Promise<Response> {
  const force = new URL(request.url).searchParams.get('force') === 'true';
  if (force) {
    let decision: UsageDecision;
    try {
      decision = await consumeLimits(usageGate, request, [
        { key: 'badges:force:ip:15m', limit: 1, windowMs: 15 * 60 * 1000 },
        { key: 'badges:force:ip:24h', limit: 4, windowMs: 24 * 60 * 60 * 1000 },
        { key: 'badges:force:global:1h', limit: 12, windowMs: 60 * 60 * 1000, global: true },
      ]);
    } catch {
      console.error('[Credly Sync] Usage protection is unavailable.');
      return Response.json({
        status: 'error',
        message: 'Badge refresh is temporarily unavailable.',
      }, { status: 503 });
    }
    if (!decision.allowed) {
      return tooManyRequests({
        status: 'rate_limited',
        message: 'Badge refresh is temporarily limited. Please try again later.',
      }, decision.retryAfterSeconds);
    }
  }

  const result = await syncCredlyBadges(force, fetcher);
  return Response.json({
    status: result.error ? 'fallback' : 'success',
    ...(result.error ? { syncError: result.error } : {}),
    username: CREDLY_USERNAME,
    totalBadges: result.badges.length,
    syncIntervalHours: 24,
    lastSyncTime: result.lastSyncTime,
    nextSyncTime: result.nextSyncTime,
    fromCache: result.fromCache,
    badges: result.badges,
  });
}

async function tokensMatch(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [providedDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const providedBytes = new Uint8Array(providedDigest);
  const expectedBytes = new Uint8Array(expectedDigest);
  let difference = 0;
  for (let index = 0; index < providedBytes.length; index += 1) {
    difference |= providedBytes[index] ^ expectedBytes[index];
  }
  return difference === 0;
}

export async function handleBadgesSync(
  request: Request,
  env: Env,
  fetcher: typeof fetch = fetch,
  usageGate: UsageGate = createUsageGate(env.API_LIMITS_DB),
): Promise<Response> {
  const expectedToken = env.BADGES_SYNC_TOKEN?.trim();
  if (!expectedToken || expectedToken.length < 32 || /^your_|^my_/i.test(expectedToken)) {
    return Response.json({
      status: 'error',
      reason: 'sync_unconfigured',
      message: 'Badge synchronization is not configured.',
    }, { status: 503 });
  }

  let decision: UsageDecision;
  try {
    decision = await consumeLimits(usageGate, request, [
      { key: 'badges:sync-auth:ip:5m', limit: 10, windowMs: 5 * 60 * 1000 },
    ]);
  } catch {
    console.error('[Credly Sync] Usage protection is unavailable.');
    return Response.json({
      status: 'error',
      reason: 'usage_limits_unavailable',
      message: 'Badge synchronization is temporarily unavailable.',
    }, { status: 503 });
  }
  if (!decision.allowed) {
    return tooManyRequests({
      status: 'rate_limited',
      message: 'Badge synchronization is temporarily limited. Please try again later.',
    }, decision.retryAfterSeconds);
  }

  const authorization = request.headers.get('Authorization') || '';
  const match = /^Bearer\s+(.+)$/i.exec(authorization);
  if (!match || !(await tokensMatch(match[1].trim(), expectedToken))) {
    return Response.json({
      status: 'error',
      reason: 'unauthorized',
      message: 'Authorization is required.',
    }, { status: 401 });
  }

  try {
    decision = await consumeLimits(usageGate, request, [
      { key: 'badges:sync:ip:5m', limit: 1, windowMs: 5 * 60 * 1000 },
      { key: 'badges:sync:ip:24h', limit: 4, windowMs: 24 * 60 * 60 * 1000 },
      { key: 'badges:sync:global:1h', limit: 12, windowMs: 60 * 60 * 1000, global: true },
    ]);
  } catch {
    console.error('[Credly Sync] Usage protection is unavailable.');
    return Response.json({
      status: 'error',
      reason: 'usage_limits_unavailable',
      message: 'Badge synchronization is temporarily unavailable.',
    }, { status: 503 });
  }
  if (!decision.allowed) {
    return tooManyRequests({
      status: 'rate_limited',
      message: 'Badge synchronization is temporarily limited. Please try again later.',
    }, decision.retryAfterSeconds);
  }

  const result = await syncCredlyBadges(true, fetcher);
  if (result.error) {
    return Response.json({
      status: 'error',
      message: result.error,
      totalBadges: result.badges.length,
      badges: result.badges,
    }, { status: 502 });
  }

  return Response.json({
    status: 'success',
    message: 'Credly badges refreshed successfully',
    totalBadges: result.badges.length,
    lastSyncTime: result.lastSyncTime,
    nextSyncTime: result.nextSyncTime,
    badges: result.badges,
  });
}

export const onRequestGet = ({ request, env }: PagesFunctionContext): Promise<Response> =>
  handleBadgesGet(request, fetch, createUsageGate(env.API_LIMITS_DB));
