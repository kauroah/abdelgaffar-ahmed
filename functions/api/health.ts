interface Env {
  GEMINI_API_KEY?: string;
  FISH_API_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_EMAIL_TO?: string;
}
interface PagesFunctionContext {
  env: Env;
  request: Request;
}
export const onRequestGet = async (
  context: PagesFunctionContext,
): Promise<Response> => {
  const configured = {
    gemini: Boolean(context.env.GEMINI_API_KEY),
    fishAudio: Boolean(context.env.FISH_API_KEY),
    resend: Boolean(context.env.RESEND_API_KEY),
    contactRecipient: Boolean(context.env.CONTACT_EMAIL_TO),
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
