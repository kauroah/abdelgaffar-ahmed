import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CREDLY_USERNAME = 'ahmed-abdelgaffar';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE = path.join(__dirname, '.credly_badges_cache.json');

app.use(express.json({ limit: '10kb' }));

interface CachedBadgeStore {
  lastSyncTime: number;
  badges: any[];
}

// Local baseline badges with local assets and proof PDFs
const BASELINE_BADGES = [
  {
    id: "google-ai-studio",
    title: "Develop AI-Powered Prototypes in Google AI Studio",
    issuer: "Google Cloud",
    category: "AI & Generative Models",
    date: "Nov 07, 2026",
    badgeImage: "/assets/aistudio/develop-ai-powered-prototypes-in-google-ai-studio_0312b366.png",
    pdfPath: "/assets/aistudio/DevelopAI-PoweredPrototypesinGoogleAIStudio_Badge20261108-20-39f0j5_e15d90d2.pdf",
    verifyUrl: "https://www.credly.com/go/C34mJTu0",
    credentialId: "C34mJTu0",
    description: "Validation of generative AI prototyping using Google AI Studio and Gemini multimodal models, prompt engineering, structured JSON schemas, and API integration.",
    keySkills: ["Google AI Studio", "Gemini API", "Prompt Engineering", "Multimodal Reasoning", "API Prototyping"],
    highlight: true
  },
  {
    id: "google-gemini-enterprise",
    title: "Create Your First Gemini Enterprise Application",
    issuer: "Google Cloud",
    category: "AI & Generative Models",
    date: "Nov 2026",
    badgeImage: "/assets/aistudio/create-your-first-gemini-enterprise-application_871c6260.png",
    verifyUrl: "https://www.credly.com/users/ahmed-abdelgaffar",
    description: "Validation of enterprise generative system design using Google Cloud Gemini models, enterprise data grounding, and vector integration.",
    keySkills: ["Gemini Enterprise", "Cloud Architecture", "Enterprise AI Workflows", "Vector Grounding"],
    highlight: true
  },
  {
    id: "mongodb-rag",
    title: "Building RAG Apps Using MongoDB",
    issuer: "MongoDB",
    category: "AI & Generative Models",
    date: "Nov 08, 2026",
    badgeImage: "/assets/aistudio/building-rag-apps-using-mongodb_6db742c5.png",
    pdfPath: "/assets/aistudio/SkillsCert20261108-20-7qqxcp_54238565.pdf",
    verifyUrl: "https://www.credly.com/badges/0ca8c49e-ba32-4458-bec8-26c4810ec69f",
    credentialId: "0ca8c49e-ba32-4458-bec8-26c4810ec69f",
    description: "Hands-on implementation of Retrieval-Augmented Generation (RAG) using MongoDB Atlas Vector Search, semantic chunking, vector embeddings, and context-window injection.",
    keySkills: ["MongoDB Vector Search", "RAG Architecture", "Semantic Search", "LLM Embeddings", "Context Pipelines"],
    highlight: true
  },
  {
    id: "mongodb-ai-strategy",
    title: "AI and Innovation: How MongoDB Enables a Resilient AI Strategy",
    issuer: "MongoDB",
    category: "Database Architecture",
    date: "Nov 08, 2026",
    badgeImage: "/assets/aistudio/ai-and-innovation-how-mongodb-enables-a-resilient-a_ca788c97.png",
    pdfPath: "/assets/aistudio/AIandInnovationHowMongoDBEnablesaResilientAIStrategy_Badge20261108-20-wvu1ps_a644e4e3.pdf",
    verifyUrl: "https://www.credly.com/go/ukc2g4FK",
    credentialId: "ukc2g4FK",
    description: "Architectural qualification in structuring unified, high-availability operational data architectures for enterprise AI systems and live streaming ingestion.",
    keySkills: ["Resilient AI Architecture", "Unified Data Strategy", "High Availability", "Real-time Operations"],
    highlight: true
  },
  {
    id: "mongodb-schema-opt",
    title: "MongoDB Schema Design Optimization",
    issuer: "MongoDB",
    category: "Database Architecture",
    date: "Nov 08, 2026",
    badgeImage: "/assets/aistudio/mongodb-schema-design-optimization-skill-badge_bb9d7b54.png",
    pdfPath: "/assets/aistudio/SkillsCert20261108-20-avms7k_599a63e3.pdf",
    verifyUrl: "https://www.credly.com/badges/8e30ce61-6851-4b23-87b0-b84a634ffa1f",
    credentialId: "8e30ce61-6851-4b23-87b0-b84a634ffa1f",
    description: "Advanced validation of document modeling design patterns, compound index strategies, aggregation pipeline stages, and query plan profiling.",
    keySkills: ["Schema Design Patterns", "Index Optimization", "Aggregation Pipelines", "Query Profiling", "Document Modeling"],
    highlight: true
  },
  {
    id: "mongodb-code-agents",
    title: "Building an App with Code Agents and MongoDB",
    issuer: "MongoDB",
    category: "AI & Generative Models",
    date: "Nov 2026",
    badgeImage: "/assets/aistudio/building-an-app-with-code-agents-and-mongodb_ac6bcf0a.png",
    verifyUrl: "https://www.credly.com/users/ahmed-abdelgaffar",
    description: "Designing autonomous agent systems that leverage tool-use protocols, schema introspection, and automated verification loops over database operational layers.",
    keySkills: ["AI Code Agents", "Tool Calling / Function Calling", "Atlas Data API", "Autonomous Workflows"],
    highlight: false
  }
];

// In-memory cache initialization
let badgeCache: CachedBadgeStore = {
  lastSyncTime: 0,
  badges: BASELINE_BADGES,
};

// Load saved cache file if present
try {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.lastSyncTime && Array.isArray(parsed.badges)) {
      badgeCache = parsed;
    }
  }
} catch (e) {
  console.warn('Failed to read local cache file:', e);
}

// Function to fetch badges from Credly's public endpoint
async function fetchFromCredly(): Promise<any[]> {
  const url = `https://www.credly.com/users/${CREDLY_USERNAME}/badges.json`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Credly responded with status: ${response.status}`);
  }

  const json = await response.json();
  const rawBadges = json?.data || [];

  // Helper to normalize badge titles for duplicate detection
  const normTitle = (s: string) => s.toLowerCase().replace(/skill\s*badge/gi, '').replace(/[^a-z0-9]/g, '');

  // Map and merge with baseline badges
  const mergedBadges = rawBadges.map((item: any) => {
    const rawTitle = item.badge_template?.name || item.name || 'Untitled Credly Badge';
    // Clean trailing "Skill Badge" if present to keep titles unified
    const cleanTitle = rawTitle.replace(/\s+skill\s+badge$/i, '').trim();
    const issuerName = item.issuer?.entities?.[0]?.entity?.name || '';
    const isMongoDB = issuerName.toLowerCase().includes('mongodb') || rawTitle.toLowerCase().includes('mongodb');
    const issuer = isMongoDB ? 'MongoDB' : 'Google Cloud';

    // Find baseline match by credentialId, normalized title, or vanity slug
    const matchedBaseline = BASELINE_BADGES.find(
      b => (b.credentialId && item.id && b.credentialId === item.id) ||
           normTitle(b.title) === normTitle(rawTitle) ||
           (item.badge_template?.vanity_slug && b.id.includes(item.badge_template.vanity_slug))
    );

    const title = matchedBaseline?.title || cleanTitle;
    const skills = item.badge_template?.skills?.map((s: any) => s.name) || matchedBaseline?.keySkills || [];
    const date = item.issued_at_date || matchedBaseline?.date || 'Recently Issued';

    return {
      id: matchedBaseline?.id || `credly-${item.id}`,
      title,
      issuer,
      category: matchedBaseline?.category || (title.toLowerCase().includes('ai') ? 'AI & Generative Models' : 'Database Architecture'),
      date,
      badgeImage: matchedBaseline?.badgeImage || item.badge_template?.image_url || item.image_url,
      pdfPath: matchedBaseline?.pdfPath,
      verifyUrl: `https://www.credly.com/badges/${item.id}`,
      credentialId: item.id,
      description: item.badge_template?.description || matchedBaseline?.description || `Verified certification issued by ${issuerName}.`,
      keySkills: skills.length > 0 ? skills.slice(0, 5) : ["Cloud Architecture", "Verified Skill"],
      highlight: matchedBaseline?.highlight ?? true,
      isLiveFetched: true,
    };
  });

  // Ensure any baseline badge not returned by the API is still kept intact
  BASELINE_BADGES.forEach(baseline => {
    const exists = mergedBadges.some((b: any) => 
      (baseline.credentialId && b.credentialId && baseline.credentialId === b.credentialId) ||
      normTitle(b.title) === normTitle(baseline.title)
    );
    if (!exists) {
      mergedBadges.push(baseline);
    }
  });

  // Deduplicate by credentialId or normalized title
  const seenKeys = new Set<string>();
  const deduplicated = mergedBadges.filter((b: any) => {
    const key = b.credentialId || normTitle(b.title);
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  return deduplicated;
}

// Sync Controller with 24-hour TTL check
async function syncCredlyBadges(force = false) {
  const now = Date.now();
  const age = now - badgeCache.lastSyncTime;

  if (!force && badgeCache.lastSyncTime > 0 && age < CACHE_TTL_MS && badgeCache.badges.length > 0) {
    return {
      badges: badgeCache.badges,
      lastSyncTime: badgeCache.lastSyncTime,
      nextSyncTime: badgeCache.lastSyncTime + CACHE_TTL_MS,
      fromCache: true,
    };
  }

  try {
    console.log(`[Credly Sync] Fetching latest badges for ${CREDLY_USERNAME}...`);
    const fetched = await fetchFromCredly();
    badgeCache = {
      lastSyncTime: now,
      badges: fetched,
    };

    // Save to disk
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(badgeCache, null, 2), 'utf-8');
    } catch (saveErr) {
      console.warn('Failed to persist cache to disk:', saveErr);
    }

    console.log(`[Credly Sync] Successfully updated ${fetched.length} badges.`);
    return {
      badges: badgeCache.badges,
      lastSyncTime: badgeCache.lastSyncTime,
      nextSyncTime: badgeCache.lastSyncTime + CACHE_TTL_MS,
      fromCache: false,
    };
  } catch (err: any) {
    console.error('[Credly Sync] Error fetching from Credly:', err.message);
    // Return existing cache or baseline on error
    return {
      badges: badgeCache.badges.length > 0 ? badgeCache.badges : BASELINE_BADGES,
      lastSyncTime: badgeCache.lastSyncTime || now,
      nextSyncTime: now + CACHE_TTL_MS,
      fromCache: true,
      error: err.message,
    };
  }
}

// Background scheduler: runs every 24 hours
setInterval(() => {
  console.log('[Credly Scheduler] 24-hour interval triggered. Refreshing badges...');
  syncCredlyBadges(true).catch(e => console.error('[Credly Scheduler] Error:', e));
}, CACHE_TTL_MS);

// API Endpoints
const contactRateLimits = new Map<string, { count: number; resetAt: number }>();
let rateLimitRequestsSinceCleanup = 0;
const allowedContactSubjects = new Set([
  'Job Opportunity / Technical Role',
  'Distributed Java Architecture',
  'Mobile / Flutter Architecture',
  'AI / RAG Integration',
  'General Technical Inquiry',
]);

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message, website } = req.body ?? {};

  if (typeof website === 'string' && website.trim()) {
    res.status(400).json({ error: 'Invalid form submission.' });
    return;
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof subject !== 'string' ||
    typeof message !== 'string'
  ) {
    res.status(400).json({ error: 'Please complete all required fields.' });
    return;
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();
  if (
    cleanName.length < 1 ||
    cleanName.length > 100 ||
    cleanEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    !allowedContactSubjects.has(subject) ||
    cleanMessage.length < 1 ||
    cleanMessage.length > 5000
  ) {
    res.status(400).json({ error: 'Please check the form fields and try again.' });
    return;
  }

  const now = Date.now();
  const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
  const clientLimit = contactRateLimits.get(clientKey);
  if (clientLimit && clientLimit.resetAt > now && clientLimit.count >= 5) {
    res.status(429).json({ error: 'Too many messages. Please try again in a few minutes.' });
    return;
  }
  if (!clientLimit || clientLimit.resetAt <= now) {
    contactRateLimits.set(clientKey, { count: 1, resetAt: now + 15 * 60 * 1000 });
  } else {
    clientLimit.count += 1;
  }

  rateLimitRequestsSinceCleanup += 1;
  if (rateLimitRequestsSinceCleanup >= 100) {
    for (const [key, limit] of contactRateLimits) {
      if (limit.resetAt <= now) contactRateLimits.delete(key);
    }
    rateLimitRequestsSinceCleanup = 0;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const username = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || username;
  const recipient = process.env.CONTACT_EMAIL_TO;
  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !from || !recipient) {
    res.status(503).json({ error: 'Email is not configured yet. Please use the direct email link instead.' });
    return;
  }
  if ((username && !password) || (!username && password)) {
    res.status(503).json({ error: 'Email service configuration is incomplete. Please use the direct email link.' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    ...(username && password ? { auth: { user: username, pass: password } } : {}),
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transporter.sendMail({
      from: { name: process.env.SMTP_FROM_NAME?.trim() || 'Portfolio', address: from },
      to: recipient,
      replyTo: { name: cleanName, address: cleanEmail },
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nTopic: ${subject}\n\n${cleanMessage}`,
    });
    res.status(200).json({ message: 'Your message was sent successfully.' });
  } catch (error) {
    const details: { code?: string; command?: string; responseCode?: number } = error instanceof Error
      ? error as Error & { code?: string; command?: string; responseCode?: number }
      : {};
    console.error('[Contact Form] SMTP delivery failed:', {
      code: details.code || 'UNKNOWN',
      command: details.command,
      responseCode: details.responseCode,
    });

    if (details.code === 'ECONNECTION' || details.code === 'ETIMEDOUT') {
      res.status(502).json({
        error: 'Could not connect to the SMTP server. This network or hosting provider may block outbound email ports; try an HTTPS email provider or allow SMTP traffic.',
      });
    } else if (details.code === 'EAUTH' || details.responseCode === 535) {
      res.status(502).json({
        error: 'The SMTP server rejected the credentials. Check the email address and provider-issued app password in the server environment.',
      });
    } else {
      res.status(502).json({ error: 'Your message could not be sent right now. Please try again or use the direct email link.' });
    }
  } finally {
    transporter.close();
  }
});

app.get('/api/badges', async (req, res) => {
  const force = req.query.force === 'true';
  const result = await syncCredlyBadges(force);
  res.json({
    status: 'success',
    username: CREDLY_USERNAME,
    totalBadges: result.badges.length,
    syncIntervalHours: 24,
    lastSyncTime: result.lastSyncTime,
    nextSyncTime: result.nextSyncTime,
    fromCache: result.fromCache,
    badges: result.badges,
  });
});

app.post('/api/badges/sync', async (req, res) => {
  const result = await syncCredlyBadges(true);
  res.json({
    status: 'success',
    message: 'Credly badges refreshed successfully',
    totalBadges: result.badges.length,
    lastSyncTime: result.lastSyncTime,
    nextSyncTime: result.nextSyncTime,
    badges: result.badges,
  });
});

// Server bootstrap with Vite middleware in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Pre-fetch on startup
  syncCredlyBadges(false).catch(e => console.warn('[Startup Sync] Failed:', e.message));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
