# Ahmed Abdelgaffar — Portfolio & Resume Studio

A React, TypeScript, and Vite portfolio deployed as a static site with Cloudflare Pages Functions for its API.

## Local development

Install dependencies and run the frontend with Vite:

```bash
npm install
npm run dev
```

For end-to-end local development, including the Pages Functions, copy `.dev.vars.example` to `.dev.vars`, fill in the server-side values you want to test, and run:

```bash
npm run cf:dev
```

This builds the static site and starts Wrangler's local Pages runtime. The frontend-only Vite server does not run Pages Functions.

## Validation

```bash
npm run lint
npm test
npm run build
```

## Cloudflare Pages deployment

Cloudflare Pages builds the Vite site from `npm run build` with `dist` as its output directory. Connect the Git branch to the Pages project for preview and production deployments, or deploy manually with:

```bash
npx wrangler pages deploy dist --project-name <your-pages-project>
```

Add these values in the Cloudflare Pages **Functions** settings for both preview and production:

| Variable | Type | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Secret | Sends contact-form messages |
| `RESEND_FROM` | Variable | Verified Resend sender address |
| `CONTACT_EMAIL_TO` | Variable | Contact-form recipient |
| `GEMINI_API_KEY` | Secret | Generates VOID dialogue audio |
| `FISH_API_KEY` | Secret, optional | Custom VOID voice for assistant turns |

Until a domain is verified with Resend, use `Ahmed Abdelgaffar <onboarding@resend.dev>` only for tests sent to the verified Resend account email. Production email requires a verified sending domain.

All five values are read only by Pages Functions. The health endpoint returns boolean configuration indicators; it never returns values. No KV or R2 binding is required: Credly badge data falls back to the curated portfolio baseline when unavailable, and generated audio is cached only in a warm Worker isolate for up to 24 hours. That cache is not shared or durable, so a cold isolate may call the audio provider again.

The Pages Functions provide:

- `GET /api/health`
- `POST /api/contact`
- `GET /api/badges`
- `POST /api/badges/sync`
- `POST /api/void/dialogue`
