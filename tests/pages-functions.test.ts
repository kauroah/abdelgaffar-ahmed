import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { onRequestGet as healthGet } from '../functions/api/health';
import { onRequestPost as contactPost } from '../functions/api/contact';
import { handleBadgesGet, handleBadgesSync } from '../functions/api/badges';
import {
  clearDialogueAudioCache,
  handleDialogueRequest,
} from '../functions/api/void/dialogue';
import { VOID_PROJECT_DATA } from '../src/data/voidProjectData';

describe('Cloudflare Pages API routes', () => {
  beforeEach(() => {
    sendMock.mockReset();
    clearDialogueAudioCache();
  });

  it('reports the Pages runtime and only server-side provider configuration flags', async () => {
    const response = await healthGet({
      request: new Request('https://portfolio.test/api/health'),
      env: {
        GEMINI_API_KEY: 'gemini-secret',
        RESEND_API_KEY: 'resend-secret',
        RESEND_FROM: 'portfolio@example.com',
        CONTACT_EMAIL_TO: 'owner@example.com',
      },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: 'ok',
      runtime: 'cloudflare-pages-functions',
      providersConfigured: {
        gemini: true,
        fishAudio: false,
        resend: true,
        contactRecipient: true,
      },
    });
  });

  it('does not count template placeholders as configured provider credentials', async () => {
    const response = await healthGet({
      request: new Request('https://portfolio.test/api/health'),
      env: {
        GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',
        FISH_API_KEY: 'MY_FISH_API_KEY',
        RESEND_API_KEY: 'YOUR_RESEND_API_KEY',
        RESEND_FROM: 'Ahmed <onboarding@resend.dev>',
        CONTACT_EMAIL_TO: 'owner@example.com',
      },
    });

    await expect(response.json()).resolves.toMatchObject({
      providersConfigured: {
        gemini: false,
        fishAudio: false,
        resend: false,
        contactRecipient: true,
      },
    });
  });

  it('rejects invalid contact data and reports missing Resend configuration', async () => {
    const invalid = await contactPost({
      request: new Request('https://portfolio.test/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email' }),
      }),
      env: {},
    });
    expect(invalid.status).toBe(400);

    const missingConfig = await contactPost({
      request: new Request('https://portfolio.test/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: 'test@example.com', message: 'Hello' }),
      }),
      env: {},
    });
    expect(missingConfig.status).toBe(503);
    await expect(missingConfig.json()).resolves.toMatchObject({ reason: 'resend_unconfigured' });
  });

  it('sends the branded contact template and handles Resend provider errors', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'email-test-id' }, error: null });
    const request = () => new Request('https://portfolio.test/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Sender',
        email: 'sender@example.com',
        subject: '<hello>',
        message: 'Line one\n<script>alert(1)</script>',
      }),
    });
    const env = {
      RESEND_API_KEY: 'resend-secret',
      RESEND_FROM: 'Portfolio <onboarding@resend.dev>',
      CONTACT_EMAIL_TO: 'owner@example.com',
    };
    const success = await contactPost({ request: request(), env });

    expect(success.status).toBe(200);
    await expect(success.json()).resolves.toEqual({ ok: true, messageId: 'email-test-id' });
    const sentEmail = sendMock.mock.calls[0][0];
    expect(sentEmail.html).toContain('Ahmed Abdelgaffar');
    expect(sentEmail.html).toContain('monogram_logo_email.png');
    expect(sentEmail.html).toContain('&lt;script&gt;');
    expect(sentEmail.html).not.toContain('<script>');

    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'provider unavailable' } });
    const failed = await contactPost({ request: request(), env });
    expect(failed.status).toBe(502);
  });

  it('returns Credly baseline badges after a provider failure and reports sync failure', async () => {
    const failingFetch = vi.fn(async () => new Response('unavailable', { status: 503 }));
    const response = await handleBadgesGet(
      new Request('https://portfolio.test/api/badges?force=true'),
      failingFetch as typeof fetch,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('fallback');
    expect(body.fromCache).toBe(true);
    expect(body.badges.length).toBeGreaterThan(0);

    const syncResponse = await handleBadgesSync(failingFetch as typeof fetch);
    expect(syncResponse.status).toBe(502);
  });

  it('syncs Credly badges and merges locally curated baseline badges', async () => {
    const fetcher = vi.fn(async () => Response.json({
      data: [{
        id: 'credential-123',
        name: 'Test Cloud Badge',
        image_url: 'https://example.com/badge.png',
        issuer: { entities: [{ entity: { name: 'Google Cloud' } }] },
        badge_template: {
          name: 'Test Cloud Badge',
          description: 'Verified badge',
          skills: [{ name: 'Cloud' }],
        },
      }],
    }));

    const response = await handleBadgesSync(fetcher as typeof fetch);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe('success');
    expect(body.badges.some((badge: { credentialId?: string }) => badge.credentialId === 'credential-123')).toBe(true);
    expect(body.badges.length).toBeGreaterThan(1);
  });

  it('validates dialogue requests and returns an explicit missing-credentials response', async () => {
    const missing = await handleDialogueRequest(
      new Request('https://portfolio.test/api/void/dialogue', {
        method: 'POST',
        body: '{',
      }),
      {},
    );
    expect(missing.status).toBe(400);

    const scenario = VOID_PROJECT_DATA.scenarios[0];
    const noCredentials = await handleDialogueRequest(
      new Request('https://portfolio.test/api/void/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          turns: scenario.turns.map(({ id, speaker }) => ({ id, speaker })),
        }),
      }),
      {},
    );
    expect(noCredentials.status).toBe(200);
    await expect(noCredentials.json()).resolves.toEqual({ available: false, reason: 'no_api_key' });
  });

  it('uses only canonical scenario dialogue, supports mocked provider success and fallback failures', async () => {
    const scenario = VOID_PROJECT_DATA.scenarios[0];
    const request = () => new Request('https://portfolio.test/api/void/dialogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId: scenario.id,
        turns: scenario.turns.map(({ id, speaker }) => ({ id, speaker, text: 'untrusted client text' })),
      }),
    });
    const successfulProviders = {
      gemini: vi.fn(async () => ({ mimeType: 'audio/wav', audioBase64: 'Z2VtaW5p' })),
      fish: vi.fn(async () => ({ mimeType: 'audio/mpeg', audioBase64: 'ZmlzaA==' })),
    };
    const success = await handleDialogueRequest(
      request(),
      { GEMINI_API_KEY: 'real-gemini-key' },
      successfulProviders,
    );
    const successBody = await success.json();
    expect(successBody.available).toBe(true);
    expect(successBody.turns.every((turn: { audioBase64: string }) => turn.audioBase64 === 'Z2VtaW5p')).toBe(true);
    expect(successfulProviders.gemini).toHaveBeenCalledWith(
      'Ahmed',
      scenario.turns[0].text,
      scenario.turns[0].speechStyle,
      'real-gemini-key',
    );

    clearDialogueAudioCache();
    const failingProviders = {
      gemini: vi.fn(async () => { throw new Error('simulated provider failure'); }),
      fish: vi.fn(async () => { throw new Error('simulated provider failure'); }),
    };
    const failed = await handleDialogueRequest(
      request(),
      { GEMINI_API_KEY: 'real-gemini-key' },
      failingProviders,
    );
    const failedBody = await failed.json();
    expect(failed.status).toBe(200);
    expect(failedBody.available).toBe(false);
    expect(failedBody.failedTurns).toHaveLength(scenario.turns.length);
  });

  it('uses Fish Audio for VOID turns and falls back to Gemini when Fish fails', async () => {
    const scenario = VOID_PROJECT_DATA.scenarios[0];
    const request = () => new Request('https://portfolio.test/api/void/dialogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId: scenario.id,
        turns: scenario.turns.map(({ id, speaker }) => ({ id, speaker })),
      }),
    });
    const providerOverrides = {
      gemini: vi.fn(async () => ({ mimeType: 'audio/wav', audioBase64: 'Z2VtaW5p' })),
      fish: vi.fn(async () => { throw new Error('simulated Fish failure'); }),
    };

    const response = await handleDialogueRequest(
      request(),
      { GEMINI_API_KEY: 'gemini-key', FISH_API_KEY: 'fish-key' },
      providerOverrides,
    );
    const body = await response.json();

    expect(body.available).toBe(true);
    expect(body.engine).toBe('gemini');
    expect(providerOverrides.fish).toHaveBeenCalled();
    expect(providerOverrides.gemini).toHaveBeenCalled();
  });
});
