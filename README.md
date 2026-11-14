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

Configure these values separately for the **Preview** and **Production** environments in the Cloudflare dashboard. Go to **Workers & Pages > `abdelgaffar-ahmed` > Settings > Environment variables**, select the environment, and add:

| Variable | Type | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Secret | Sends contact-form messages |
| `RESEND_FROM` | Variable | Verified Resend sender address |
| `CONTACT_EMAIL_TO` | Variable | Contact-form recipient |
| `GEMINI_API_KEY` | Secret | Generates VOID dialogue audio |
| `FISH_API_KEY` | Secret, optional | Custom VOID voice for assistant turns |
| `BADGES_SYNC_TOKEN` | Secret | Authorizes the protected badge-sync endpoint; use a random value of at least 32 characters |
| `API_LIMITS_DB` | D1 binding | Persistent, atomic rate and usage limits for protected API routes |

Until a domain is verified with Resend, use `Ahmed Abdelgaffar <onboarding@resend.dev>` only for tests sent to the verified Resend account email. Production email requires a verified sending domain.

Mark `RESEND_API_KEY`, `GEMINI_API_KEY`, `FISH_API_KEY`, and `BADGES_SYNC_TOKEN` as encrypted secrets. `RESEND_FROM` and `CONTACT_EMAIL_TO` are ordinary runtime variables. Generate a unique `BADGES_SYNC_TOKEN` locally, for example with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`, and paste it into Cloudflare as a secret. Do not use a `VITE_` prefix or put secret values in frontend code.

All secrets and contact settings are read only by Pages Functions. The health endpoint returns boolean configuration indicators; it never returns values. The `API_LIMITS_DB` binding is required for contact delivery, dialogue generation, and forced badge refreshes; these routes fail closed if the binding or migration is missing.

Create separate D1 databases for Preview and Production and apply the migration to each:

```bash
npx wrangler d1 create portfolio-api-usage-preview
npx wrangler d1 execute portfolio-api-usage-preview --remote --file=migrations/0001_api_usage_limits.sql
npx wrangler d1 create portfolio-api-usage-production
npx wrangler d1 execute portfolio-api-usage-production --remote --file=migrations/0001_api_usage_limits.sql
```

In **Workers & Pages > `abdelgaffar-ahmed` > Settings > Bindings**, select the Preview environment, add a **D1 database** binding named `API_LIMITS_DB`, and choose `portfolio-api-usage-preview`. Repeat for Production using `portfolio-api-usage-production`. Save and redeploy the corresponding environment after adding each binding and its variables/secrets.

For local Pages Functions testing, add the database binding to the project's Wrangler configuration using the `database_id` returned by `wrangler d1 create`, then apply the migration with `npx wrangler d1 execute portfolio-api-usage --local --file=migrations/0001_api_usage_limits.sql` and run `npm run cf:dev`.

The Wrangler binding entry is:

```toml
[[d1_databases]]
binding = "API_LIMITS_DB"
database_name = "portfolio-api-usage"
database_id = "<database-id-from-wrangler-d1-create>"
migrations_dir = "migrations"
```

The server-side limits are:

- Contact: 3 sends per IP per 15 minutes, 10 per IP per 24-hour window, and 50 total sends per 24-hour window.
- VOID dialogue: 2 requests per IP per 10 minutes, 5 per IP per 24-hour window, and 120 reserved provider attempts per 24-hour window. The reservation includes model fallback attempts, even if a provider fails.
- Forced Credly refresh: 1 per IP per 15 minutes, 4 per IP per 24-hour window, and 12 total per hour. `POST /api/badges/sync` additionally requires the server-only `BADGES_SYNC_TOKEN` bearer token.

Limits use fixed windows and D1 atomic updates. Client IPs are SHA-256 hashed before storage; expired counters are purged at most hourly per Worker isolate. Credly badge data falls back to the curated portfolio baseline when unavailable, and generated audio is cached only in a warm Worker isolate for up to 24 hours. That content cache is not shared or durable, so a cold isolate may call Credly or an audio provider again; the D1 usage counters are shared across deployments using the same database.

The optional `.dev.vars` file contains only local secret values. Configure `API_LIMITS_DB` as a local D1 binding in Wrangler when exercising the protected routes. The frontend Vite server does not run Pages Functions.

The Pages Functions provide:

- `GET /api/health`
- `POST /api/contact`
- `GET /api/badges`
- `POST /api/badges/sync`
- `POST /api/void/dialogue`
