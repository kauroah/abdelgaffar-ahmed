# Ahmed Abdelgaffar — Portfolio & Resume Studio

Modern personal engineering portfolio and adjustable ATS CV generator built with React 19, TypeScript, Tailwind CSS, Express, and Vite.

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: Version 18 or higher (v20+ recommended)
- **npm**: Installed automatically with Node.js (or `pnpm` / `yarn`)

---

### Step 1: Install Dependencies
Open your terminal in the project root folder and run:
```bash
npm install
```

---

### Step 2: Run Development Server
Start the local full-stack server (runs Express + Vite HMR on port 3000):
```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

---

### Step 3: Production Build (Optional)
To test or build the optimized production bundle:
```bash
# Compile client assets into dist/
npm run build

# Start production server
npm run start
```

---

## 🛠️ Project Structure

- `server.ts`: Express backend handling Vite middleware, Credly badge automatic 24h background sync, and API endpoints.
- `src/App.tsx`: Main application entry point orchestrating sections and floating navigation dock.
- `src/components/`:
  - `Hero.tsx`: Headline, bio, photo card, social links, and top brand header.
  - `Logo.tsx`: Custom vector monogram logo.
  - `ProjectsSection.tsx`: Responsive 2-column showcase of engineering case studies.
  - `BadgesSection.tsx`: Verified MongoDB & Google Cloud badges with direct verification links.
  - `CvStudioModal.tsx`: Adjustable resume generator with instant vector PDF download.
  - `FloatingDock.tsx`: Floating bottom dock navigation.
  - `TechStackSection.tsx`: 4-column categorized ecosystem breakdown.
  - `ExperienceTimeline.tsx`: Engineering work history with X-Y-Z formula metrics.
  - `EducationSection.tsx`: Academic degrees and scholarship history.
  - `ContactSection.tsx`: Contact form and messaging channels.
- `src/utils/pdfGenerator.ts`: Client-side ATS vector PDF generation using jsPDF.
- `public/assets/aistudio/`: Local badge badges, proof certificate PDFs, and avatar assets.

---

## ⚙️ Available Scripts

- `npm run dev`: Starts the local dev server at `http://localhost:3000`
- `npm run build`: Compiles TypeScript and creates optimized production assets in `dist/`
- `npm run start`: Runs the Node server using production assets
- `npm run lint`: Runs TypeScript validation (`tsc --noEmit`)

## Deploying to Vercel

The Vite frontend is deployed as a static site, and `api/[...path].ts` serves the Express API routes as a Vercel Function. Import the GitHub repository in the Vercel dashboard; the public assets currently total about 180 MB, above the Hobby plan's 100 MB CLI source-upload limit.

1. In Vercel, choose **Add New → Project** and import `kauroah/abdelgaffar-ahmed`.
2. Keep the detected Vite settings: build command `npm run build`, output directory `dist`.
3. Add environment variables in **Project Settings → Environment Variables**:
   - `RESEND_API_KEY`, `RESEND_FROM`, and `CONTACT_EMAIL_TO` for the contact form.
   - `GEMINI_API_KEY` for generated VOID dialogue audio. `FISH_API_KEY` is optional.
4. Deploy from the Vercel dashboard. Future pushes to the connected GitHub branch will deploy automatically.

Do not commit production secrets. Credly and audio caches use the function's temporary storage on Vercel, so they are not durable between function instances.

## Deploying to Cloudflare Pages

Cloudflare Pages serves the Vite build and discovers API routes in `functions/`.

1. Build the site with `npm run build`.
2. Push to the connected Git branch; Cloudflare Pages will build and deploy it. For a manual deployment, use `npx wrangler pages deploy dist --project-name <your-pages-project>`.
3. Add `RESEND_API_KEY` as a Pages Function secret. Set `RESEND_FROM` and `CONTACT_EMAIL_TO` as environment variables.
4. Until you verify a domain with Resend, use `Ahmed Abdelgaffar <onboarding@resend.dev>` only for tests sent to the verified email on your Resend account. For production, verify a domain and change `RESEND_FROM` to an address on that domain.

In Cloudflare Pages project settings, add `RESEND_API_KEY` as a secret and set `RESEND_FROM` and `CONTACT_EMAIL_TO` as environment variables for both preview and production environments.

For local development, copy `.dev.vars.example` to `.dev.vars`, enter the key there, build with `npm run build`, then run `npm run cf:dev`. `.dev.vars` is git-ignored.

The Pages Functions currently implement `/api/contact` and `/api/health`; Credly badge sync and VOID audio generation still need Pages Function implementations or a separately hosted Node backend.
