import { PROFILE_DATA, type BadgeItem } from '../../src/data/portfolioData';

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
): Promise<Response> {
  const force = new URL(request.url).searchParams.get('force') === 'true';
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

export async function handleBadgesSync(fetcher: typeof fetch = fetch): Promise<Response> {
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

interface PagesFunctionContext {
  request: Request;
}

export const onRequestGet = ({ request }: PagesFunctionContext): Promise<Response> =>
  handleBadgesGet(request);
