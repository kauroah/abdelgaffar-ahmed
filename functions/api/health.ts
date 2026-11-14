interface Env {
  GEMINI_API_KEY?: string;
  FISH_API_KEY?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  CONTACT_EMAIL_TO?: string;
  BADGES_SYNC_TOKEN?: string;
  API_LIMITS_DB?: unknown;
}
interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function isConfigured(value: string | undefined): boolean {
  const normalized = value?.trim();
  return Boolean(normalized && !/^your_|^my_/i.test(normalized));
}

export const onRequestGet = async (
  context: PagesFunctionContext,
): Promise<Response> => {
  const badgeSyncToken = context.env.BADGES_SYNC_TOKEN;
  const configured = {
    gemini: isConfigured(context.env.GEMINI_API_KEY),
    fishAudio: isConfigured(context.env.FISH_API_KEY),
    resend: isConfigured(context.env.RESEND_API_KEY) && isConfigured(context.env.RESEND_FROM),
    contactRecipient: isConfigured(context.env.CONTACT_EMAIL_TO),
    badgeSync: isConfigured(badgeSyncToken) && (badgeSyncToken?.trim().length ?? 0) >= 32,
    usageLimits: Boolean(context.env.API_LIMITS_DB),
  };
  return Response.json(
    {
      status: 'ok',
      runtime: 'cloudflare-pages-functions',
      providersConfigured: configured,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
};
