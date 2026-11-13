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
