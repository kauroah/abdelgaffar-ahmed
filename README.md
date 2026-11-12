# Ahmed Abdelgaffar — AI & Flutter Developer

Personal portfolio for my work building AI-powered applications and cross-platform Flutter products. The site brings together selected projects, engineering experience, education, verified credentials, and an adjustable CV studio.

**Based in Moscow, Russia** · **Open to AI and Flutter opportunities**

[GitHub](https://github.com/kauroah) · [Credly](https://www.credly.com/users/ahmed-abdelgaffar) · [Email](mailto:kauroah@gmail.com)

## About me

I’m Ahmed Abdelgaffar, a software engineer focused on applied AI and mobile development. I enjoy taking a product from its technical foundations through to an experience people can use.

- **AI:** model inference, explainable AI, local language models, voice interfaces, and RAG.
- **Flutter:** cross-platform product development, clean architecture, BLoC/Cubit, and production releases.
- **Engineering foundation:** Java, TypeScript, backend systems, databases, and API design.
- **Education:** MSc in Software Engineering at RTU MIREA; BSc in Software Engineering from Kazan Federal University.

## Featured work

### VOID — Real-Time Voice Assistant

A voice interface that connects speech recognition, language-model responses, and streamed audio. I worked on the interface, orchestration, and audio pipeline, including interruption handling so a user can speak over active playback.

**Focus:** Web Audio API · PCM audio · WebSockets · streaming speech · voice activity detection  
[Source code](https://github.com/kauroah/void)

### PneumoAI — Medical Imaging & Diagnostic Platform

My bachelor’s thesis project combines chest X-ray classification with Grad-CAM visual explanations, CURB-65 risk scoring, and locally run Qwen explanations. The design keeps clinical data on-device rather than sending it to an external AI service.

**Focus:** DenseNet121 · ONNX Runtime · Grad-CAM · Qwen 2.5 / Ollama · Next.js · TypeScript · Python  
Reported project metrics include a 0.97 F1 score and under 3-second CPU inference on the benchmark described in the project.

### Founders — Social Network & Deal-Flow Platform

A Flutter product for entrepreneurs and investors, with deal-flow feeds, partner discovery, and messaging. The app uses clean architecture and BLoC/Cubit to keep product features and state management modular.

**Focus:** Flutter · Dart · BLoC/Cubit · Firebase · REST APIs · secure storage

### Adam & Eve — Mobile Commerce

A Flutter ordering app for a bakery business, published on the Apple App Store, Google Play, and RuStore.

**Focus:** Flutter · Dart · Node.js · PostgreSQL · payments · push notifications  
[App Store](https://apps.apple.com/ru/app/%D0%B0%D0%B4%D0%B0%D0%BC-%D0%B8-%D0%B5%D0%B2%D0%B0/id6761149171?l=en-GB) · [Google Play](https://play.google.com/store/apps/details?id=com.adamandeve.foodapp&pcampaignid=web_share) · [RuStore](https://www.rustore.ru/catalog/app/com.adamandeve.foodapp)

The portfolio also includes selected distributed-systems and backend case studies, including a background job orchestrator, a transactional outbox, and an identity and access management service.

## What’s in the portfolio

- **Project case studies** with architecture notes, technologies, screenshots, and available source or store links.
- **VOID project showcase** with a demo video and expandable architecture details.
- **Adjustable CV studio** for creating a tailored, ATS-friendly PDF resume.
- **Experience, education, technical stack, and language proficiency.**
- **MongoDB and Google Cloud credentials**, with badge details and Credly verification links.
- **Credly badge sync** through the Express API, with local baseline badges available if the remote service is unavailable.
- **Responsive layout**, floating navigation dock, and light/dark themes.

## Technology

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4
- **Backend:** Node.js, Express
- **Motion and UI:** Motion, Lucide
- **CV export:** jsPDF
- **Validation:** TypeScript, Vitest

## Run locally

### Requirements

- Node.js **20.19+** or **22.12+**
- [Bun](https://bun.sh/) to install the dependencies from the included `bun.lock`

### Install and start

```bash
bun install --frozen-lockfile
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

The Express server hosts the Vite development app and exposes:

- `GET /api/badges` — read the cached or refreshed badge list. Add `?force=true` to request a refresh.
- `POST /api/badges/sync` — request an immediate badge refresh.
- `POST /api/contact` — validates and sends a contact form message through SMTP.

The Credly integration uses its public profile endpoint. If that endpoint is unavailable, the portfolio continues to use its bundled baseline badge data.

### Configure contact form email

The contact form sends messages through an SMTP server. Copy `.env.example` to `.env` and set:

| Variable | Description |
| --- | --- |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (typically `587` for STARTTLS or `465` for implicit TLS) |
| `SMTP_SECURE` | Set to `true` for implicit TLS; port `465` enables it automatically |
| `SMTP_USER` | SMTP username, when required by your provider |
| `SMTP_PASS` | SMTP password or provider-issued app password, when required |
| `SMTP_FROM` | Verified sender address; defaults to `SMTP_USER` |
| `SMTP_FROM_NAME` | Sender display name shown in the inbox; defaults to `Portfolio` |
| `CONTACT_EMAIL_TO` | Inbox that should receive portfolio messages |

The notification uses the configured sender address with the `Portfolio` display name, while the visitor's address is set as `Reply-To` so you can reply directly to them. Keep `.env` private and never commit real SMTP credentials. Restart the server after changing environment settings. The form only confirms delivery after the SMTP server accepts the message; if SMTP isn’t configured or delivery fails, it displays an error and keeps the message available for retry.

If the form reports that it cannot connect to SMTP, check that the machine or hosting provider allows outbound connections on the configured SMTP port. Some networks block SMTP; in that case, use an HTTPS-based email provider/API or a host that permits SMTP egress.

### Build and run in production mode

```bash
bun run build
bun run start
```

The production server serves the generated client from `dist/` on port `3000` by default. Set `PORT` to use another port.

## Project commands

| Command | Description |
| --- | --- |
| `bun run dev` | Start Express and Vite in development mode |
| `bun run build` | Build the production frontend into `dist/` |
| `bun run start` | Serve the production build |
| `bun run lint` | Run TypeScript checks (`tsc --noEmit`) |
| `bun run test` | Run the Vitest suite |

## Project structure

```text
src/
  components/       Portfolio sections, project details, CV studio, and navigation
  data/             Profile, project, credential, and portfolio content
  hooks/            Client-side Credly synchronization
  utils/            PDF generation utilities
public/assets/      Project screenshots, demo media, portraits, and credentials
server.ts           Express server and badge API
```

## Contact

- **Email:** [kauroah@gmail.com](mailto:kauroah@gmail.com)
- **Telegram:** [@xrotw](https://t.me/xrotw)
- **GitHub:** [kauroah](https://github.com/kauroah)
- **Location:** Moscow, Russia
