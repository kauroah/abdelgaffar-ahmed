import { Resend } from 'resend';
import { readBoundedJson } from '../_shared/requestBody';
import {
  consumeLimits,
  createUsageGate,
  tooManyRequests,
  type D1Database,
  type UsageGate,
  type UsageDecision,
} from '../_shared/usageLimits';

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  CONTACT_EMAIL_TO?: string;
  API_LIMITS_DB?: D1Database;
}

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseContactMessage(body: unknown): ContactMessage | null {
  if (typeof body !== 'object' || body === null) return null;

  const input = body as Record<string, unknown>;
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const subject = typeof input.subject === 'string' && input.subject.trim()
    ? input.subject.trim()
    : 'Portfolio Inquiry';
  const message = typeof input.message === 'string' ? input.message.trim() : '';

  if (
    !name ||
    name.length > 80 ||
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    subject.length > 120 ||
    !message ||
    message.length > 4000
  ) {
    return null;
  }

  return { name, email, subject, message };
}

function createEmailHtml(contact: ContactMessage, logoUrl: string): string {
  const safeName = escapeHtml(contact.name);
  const safeEmail = escapeHtml(contact.email);
  const safeSubject = escapeHtml(contact.subject);
  const safeMessage = escapeHtml(contact.message).replace(/\r\n|\r|\n/g, '<br>');

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px 12px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#171717">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#fff;border:1px solid #e2e2e5;border-radius:18px;overflow:hidden">
          <tr><td style="padding:30px 34px;background:#0a0a0a;color:#ededed">
            <table role="presentation" cellspacing="0" cellpadding="0"><tr>
              <td width="54" style="width:54px;padding:6px;background:#fff;border-radius:10px">
                <img src="${escapeHtml(logoUrl)}" width="48" alt="Ahmed Abdelgaffar monogram" style="display:block;width:48px;height:auto;border:0">
              </td>
              <td style="padding-left:14px">
                <div style="font-size:14px;font-weight:bold">Ahmed Abdelgaffar</div>
                <div style="padding-top:5px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:#a3a3a3">FLUTTER &amp; APPLIED AI ENGINEER</div>
              </td>
            </tr></table>
            <div style="padding-top:30px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;color:#a3a3a3">PORTFOLIO / NEW MESSAGE</div>
            <div style="padding-top:10px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;color:#fff">A new message,<br>from your portfolio.</div>
          </td></tr>
          <tr><td style="padding:30px 34px">
            <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.8px;color:#737373">01 / INCOMING NOTE</div>
            <div style="padding-top:8px;font-family:Georgia,'Times New Roman',serif;font-size:22px">${safeName} got in touch</div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;font-size:13px">
              <tr><td style="padding:13px 0;border-top:1px solid #e2e2e5;color:#737373">SENDER</td><td align="right" style="padding:13px 0;border-top:1px solid #e2e2e5;font-weight:bold">${safeName}</td></tr>
              <tr><td style="padding:13px 0;border-top:1px solid #e2e2e5;color:#737373">EMAIL</td><td align="right" style="padding:13px 0;border-top:1px solid #e2e2e5"><a href="mailto:${safeEmail}" style="color:#171717">${safeEmail}</a></td></tr>
              <tr><td style="padding:13px 0;border-top:1px solid #e2e2e5;color:#737373">TOPIC</td><td align="right" style="padding:13px 0;border-top:1px solid #e2e2e5;font-weight:bold">${safeSubject}</td></tr>
            </table>
            <div style="margin-top:22px;padding:18px 20px;background:#f5f5f5;border:1px solid #e2e2e5;border-left:3px solid #171717;border-radius:8px">
              <div style="padding-bottom:10px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:#737373">THE MESSAGE</div>
              <div style="font-size:14px;line-height:1.75;overflow-wrap:anywhere">${safeMessage}</div>
            </div>
            <div style="padding-top:22px;color:#737373;font-size:12px">Reply directly to this email to reach ${safeName}.</div>
          </td></tr>
          <tr><td style="padding:17px 34px;background:#fafafa;border-top:1px solid #e2e2e5;color:#737373;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1px">AHMED ABDELGAFFAR / FLUTTER · APPLIED AI</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function handleContact(
  request: Request,
  env: Env,
  usageGate: UsageGate = createUsageGate(env.API_LIMITS_DB),
): Promise<Response> {
  const parsedBody = await readBoundedJson(request, 8 * 1024);
  if (!parsedBody.ok && parsedBody.reason === 'too_large') {
    return jsonResponse({ ok: false, error: 'Your message is too large.' }, 413);
  }
  if (!parsedBody.ok) {
    return jsonResponse({ ok: false, error: 'Please submit a valid message.' }, 400);
  }

  const contact = parseContactMessage(parsedBody.value);
  if (!contact) {
    return jsonResponse({
      ok: false,
      error: 'Please provide your name, a valid email address, and a message.',
    }, 400);
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM?.trim();
  const to = env.CONTACT_EMAIL_TO?.trim();
  if (!apiKey || !from || !to) {
    return jsonResponse({
      ok: false,
      reason: 'resend_unconfigured',
      error: 'Email delivery is not configured yet. Please use the direct email link instead.',
    }, 503);
  }

  let decision: UsageDecision;
  try {
    decision = await consumeLimits(usageGate, request, [
      { key: 'contact:ip:15m', limit: 3, windowMs: 15 * 60 * 1000 },
      { key: 'contact:ip:24h', limit: 10, windowMs: 24 * 60 * 60 * 1000 },
      {
        key: 'contact:global:24h',
        limit: 50,
        windowMs: 24 * 60 * 60 * 1000,
        units: 1,
        global: true,
      },
    ]);
  } catch {
    console.error('[Contact] Usage protection is unavailable.');
    return jsonResponse({
      ok: false,
      reason: 'usage_limits_unavailable',
      error: 'Message delivery is temporarily unavailable. Please try emailing directly.',
    }, 503);
  }
  if (!decision.allowed) {
    return tooManyRequests({
      ok: false,
      error: 'Too many messages were sent. Please try again later.',
    }, decision.retryAfterSeconds);
  }

  const resend = new Resend(apiKey);
  const logoUrl = new URL('/assets/aistudio/monogram_logo_email.png', request.url).toString();

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: contact.email,
      subject: `[Portfolio] ${contact.subject} — ${contact.name}`,
      text: [
        'NEW MESSAGE FROM YOUR PORTFOLIO',
        '',
        `${contact.name} reached out about: ${contact.subject}`,
        `Email: ${contact.email}`,
        '',
        'Message:',
        contact.message,
        '',
        `Reply directly to this email to respond to ${contact.name}.`,
      ].join('\n'),
      html: createEmailHtml(contact, logoUrl),
    });

    if (error) {
      console.error('[Resend Contact] Delivery failed.');
      return jsonResponse({
        ok: false,
        error: 'Unable to deliver your message right now. Please try emailing directly.',
      }, 502);
    }

    console.log(`[Resend Contact] Delivered message ${data.id}`);
    return jsonResponse({ ok: true, messageId: data.id });
  } catch (error) {
    console.error('[Resend Contact] Request failed.');
    return jsonResponse({
      ok: false,
      error: 'Unable to deliver your message right now. Please try emailing directly.',
    }, 502);
  }
}

export const onRequestPost = async ({ request, env }: PagesFunctionContext): Promise<Response> => {
  return handleContact(request, env);
};
