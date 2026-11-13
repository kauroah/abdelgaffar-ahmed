import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CREDLY_USERNAME = 'ahmed-abdelgaffar';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE = path.join(__dirname, '.credly_badges_cache.json');

app.use(express.json());

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
  },
  {
    id: "freeacademy-advanced-python",
    title: "Advanced Python Programming",
    issuer: "FreeAcademy AI",
    category: "Programming & Development",
    date: "Nov 13, 2026",
    badgeImage: "/assets/certificates/freeacademy-advanced-python.jpg",
    pdfPath: "/assets/aistudio/Advanced_Python_Programming_-_Certificate_d990c942.pdf",
    verifyUrl: "https://freeacademy.ai/verify/FA-2026-APP-PW1QHX",
    credentialId: "FA-2026-APP-PW1QHX",
    description: "Certificate in advanced Python programming, covering language features and practical software development.",
    keySkills: ["Python", "Object-Oriented Programming", "Data Structures", "Debugging", "Software Development"],
    highlight: true
  },
  {
    id: "freeacademy-how-llms-work",
    title: "How LLMs Actually Work",
    issuer: "FreeAcademy AI",
    category: "AI & Generative Models",
    date: "Nov 13, 2026",
    badgeImage: "/assets/certificates/freeacademy-how-llms-work.jpg",
    pdfPath: "/assets/aistudio/How_LLMs_Work_-_Certificate_3950364a.pdf",
    verifyUrl: "https://freeacademy.ai/verify/FA-2026-MHLW-27M17O",
    credentialId: "FA-2026-MHLW-27M17O",
    description: "Course certificate covering the core concepts behind large language models and how they generate text.",
    keySkills: ["Large Language Models", "Tokenization", "Transformer Architecture", "Text Generation", "Generative AI"],
    highlight: true
  },
  {
    id: "freeacademy-figma-ai",
    title: "Figma AI: Design Faster",
    issuer: "FreeAcademy AI",
    category: "AI & Design Tools",
    date: "Nov 12, 2026",
    badgeImage: "/assets/certificates/freeacademy-figma-ai.jpg",
    pdfPath: "/assets/aistudio/Figma_AI_Features_-_Certificate_43583b8e.pdf",
    verifyUrl: "https://freeacademy.ai/verify/FA-2026-MFAF-JK0NIM",
    credentialId: "FA-2026-MFAF-JK0NIM",
    description: "Course certificate on using Figma AI features to accelerate interface design and prototyping workflows.",
    keySkills: ["Figma", "AI-Assisted Design", "UI Design", "Prototyping", "Design Workflow"],
    highlight: false
  },
  {
    id: "freeacademy-canva-ai",
    title: "Canva AI for Non-Designers",
    issuer: "FreeAcademy AI",
    category: "AI & Design Tools",
    date: "Nov 12, 2026",
    badgeImage: "/assets/certificates/freeacademy-canva-ai.jpg",
    pdfPath: "/assets/aistudio/Canva_AI_For_Non_Designers_-_Certificate_6bd27ca3.pdf",
    verifyUrl: "https://freeacademy.ai/verify/FA-2026-MCAF-DA1STY",
    credentialId: "FA-2026-MCAF-DA1STY",
    description: "Course certificate on using Canva AI tools to create and refine visual content without a professional design background.",
    keySkills: ["Canva", "AI-Assisted Design", "Visual Content", "Graphic Design", "Generative AI"],
    highlight: false
  },
  {
    id: "freeacademy-debug-code-ai",
    title: "Debug Any Code with AI",
    issuer: "FreeAcademy AI",
    category: "Programming & Development",
    date: "Nov 12, 2026",
    badgeImage: "/assets/certificates/freeacademy-debug-code-ai.jpg",
    pdfPath: "/assets/aistudio/Debug_Code_With_AI_-_Certificate_e4edea94.pdf",
    verifyUrl: "https://freeacademy.ai/verify/FA-2026-MDCW-L9E6KS",
    credentialId: "FA-2026-MDCW-L9E6KS",
    description: "Course certificate on applying AI tools to investigate software defects and support debugging workflows.",
    keySkills: ["AI-Assisted Debugging", "Root Cause Analysis", "Prompting", "Code Review", "Software Troubleshooting"],
    highlight: true
  },
  {
    id: "freeacademy-aerospace-ai",
    title: "AI for Aerospace Mechanical Engineers",
    issuer: "FreeAcademy AI",
    category: "AI in Engineering",
    date: "Nov 12, 2026",
    badgeImage: "/assets/certificates/freeacademy-aerospace-ai.jpg",
    pdfPath: "/assets/aistudio/AI_For_Aerospace_Mechanical_Engineers_-_Certificate_bf095b4b.pdf",
    verifyUrl: "https://freeacademy.ai/verify/FA-2026-AFAM-79GNLW",
    credentialId: "FA-2026-AFAM-79GNLW",
    description: "Course certificate exploring applications of artificial intelligence in aerospace and mechanical engineering contexts.",
    keySkills: ["Artificial Intelligence", "Aerospace Engineering", "Mechanical Engineering", "Engineering Applications", "Applied AI"],
    highlight: false
  },
  {
    id: "freeacademy-prompt-engineering",
    title: "Prompt Engineering Course",
    issuer: "FreeAcademy AI",
    category: "AI & Generative Models",
    date: "Nov 08, 2026",
    badgeImage: "/assets/certificates/freeacademy-prompt-engineering.jpg",
    pdfPath: "/assets/aistudio/Prompt_Engineering_-_Certificate_b1c5d7d4.pdf",
    verifyUrl: "https://freeacademy.ai/verify/FA-2026-PE-AOE5VO",
    credentialId: "FA-2026-PE-AOE5VO",
    description: "Course certificate in writing and refining prompts for clearer, more useful outputs from generative AI systems.",
    keySkills: ["Prompt Engineering", "Generative AI", "Instruction Design", "LLM Interaction", "Output Evaluation"],
    highlight: true
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

function mergeWithBaseline(list: any[]): any[] {
  const norm = (s: string) => s.toLowerCase().replace(/skill\s*badge/gi, '').replace(/[^a-z0-9]/g, '');
  const merged = [...list];
  BASELINE_BADGES.forEach(baseline => {
    const exists = merged.some((b: any) =>
      (baseline.credentialId && b.credentialId && baseline.credentialId === b.credentialId) ||
      norm(b.title) === norm(baseline.title)
    );
    if (!exists) {
      merged.push(baseline);
    }
  });
  return merged;
}

// Sync Controller with 24-hour TTL check
async function syncCredlyBadges(force = false) {
  const now = Date.now();
  const age = now - badgeCache.lastSyncTime;

  if (!force && badgeCache.lastSyncTime > 0 && age < CACHE_TTL_MS && badgeCache.badges.length > 0) {
    return {
      badges: mergeWithBaseline(badgeCache.badges),
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

// Dual-speaker Voiceover Synthesis for VOID Demo (User: Ahmed + Assistant: VOID / Heisenberg style)
const VOID_AUDIO_CACHE_DIR = path.join(__dirname, '.void_audio_cache');
const FISH_HEISENBERG_VOICE_ID = '52fc1dcd125d4ecabef0baf91807cb12';

async function synthesizeFishAudioTurn(text: string, apiKey: string): Promise<{ mimeType: string; buffer: Buffer }> {
  const response = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      model: 's2.1-pro-free',
    },
    body: JSON.stringify({
      text,
      format: 'mp3',
      reference_id: FISH_HEISENBERG_VOICE_ID,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Fish Audio error ${response.status}: ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return { mimeType: 'audio/mpeg', buffer: Buffer.from(arrayBuffer) };
}

async function synthesizeGeminiSingleTurn(
  ai: GoogleGenAI,
  speaker: 'Ahmed' | 'VOID',
  text: string,
  style?: string
): Promise<{ mimeType: string; buffer: Buffer }> {
  const voiceName = speaker === 'Ahmed' ? 'Puck' : 'Charon';
  const defaultStyle =
    speaker === 'Ahmed'
      ? 'Natural, friendly, clear young software engineer speaking conversationally'
      : 'Deep, gravelly, calm, deliberate Heisenberg-inspired voice with dry confidence and steady pacing';

  const modelsToTry =
    speaker === 'Ahmed'
      ? ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts']
      : ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];

  let lastErr: unknown;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: style || defaultStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return { mimeType: 'audio/wav', buffer: Buffer.from(base64Audio, 'base64') };
      }
      lastErr = new Error(`${model} returned no audio for ${speaker}`);
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(`Gemini TTS failed for ${speaker}`);
}

app.post('/api/void/dialogue', async (req, res) => {
  const { scenarioId, turns } = req.body as {
    scenarioId?: string;
    turns?: Array<{ id: string; speaker: 'Ahmed' | 'VOID'; text: string; style?: string }>;
  };

  if (!scenarioId || !Array.isArray(turns) || turns.length === 0) {
    return res.status(400).json({ available: false, error: 'Missing scenarioId or turns' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const fishKey = process.env.FISH_API_KEY;
  const hasGemini = Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY');
  const hasFish = Boolean(fishKey && fishKey !== 'MY_FISH_API_KEY');

  if (!hasGemini && !hasFish) {
    return res.json({
      available: false,
      reason: 'no_api_key',
    });
  }

  const safeScenario = scenarioId.replace(/[^a-zA-Z0-9_-]/g, '');

  try {
    if (!fs.existsSync(VOID_AUDIO_CACHE_DIR)) {
      fs.mkdirSync(VOID_AUDIO_CACHE_DIR, { recursive: true });
    }

    const ai = hasGemini
      ? new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' },
          },
        })
      : null;

    const audioTurns = await Promise.all(
      turns.map(async (turn, idx) => {
        const safeTurn = (turn.id || `t${idx}`).replace(/[^a-zA-Z0-9_-]/g, '');
        const useFishForVoid = turn.speaker === 'VOID' && hasFish && fishKey;
        const mp3CacheFile = path.join(VOID_AUDIO_CACHE_DIR, `v2_${safeScenario}_${safeTurn}.mp3`);
        const wavCacheFile = path.join(VOID_AUDIO_CACHE_DIR, `v2_${safeScenario}_${safeTurn}.wav`);

        // Always prefer cached Heisenberg Fish MP3 if it exists for VOID turns
        if (turn.speaker === 'VOID' && fs.existsSync(mp3CacheFile)) {
          const cachedBuf = fs.readFileSync(mp3CacheFile);
          return {
            id: turn.id,
            speaker: turn.speaker,
            mimeType: 'audio/mpeg',
            audioBase64: cachedBuf.toString('base64'),
          };
        }

        if (!useFishForVoid && fs.existsSync(wavCacheFile)) {
          const cachedBuf = fs.readFileSync(wavCacheFile);
          return {
            id: turn.id,
            speaker: turn.speaker,
            mimeType: 'audio/wav',
            audioBase64: cachedBuf.toString('base64'),
          };
        }

        try {
          let synthesized: { mimeType: string; buffer: Buffer };
          if (useFishForVoid && fishKey) {
            try {
              synthesized = await synthesizeFishAudioTurn(turn.text, fishKey);
            } catch (fishErr) {
              if (!ai) throw fishErr;
              console.warn('[VOID TTS] Fish Audio fallback to Gemini Charon:', fishErr);
              synthesized = await synthesizeGeminiSingleTurn(ai, turn.speaker, turn.text, turn.style);
            }
          } else if (ai) {
            synthesized = await synthesizeGeminiSingleTurn(ai, turn.speaker, turn.text, turn.style);
          } else {
            throw new Error('No TTS provider available for turn');
          }

          const outExt = synthesized.mimeType === 'audio/mpeg' ? 'mp3' : 'wav';
          const outCachePath = path.join(VOID_AUDIO_CACHE_DIR, `v2_${safeScenario}_${safeTurn}.${outExt}`);
          try {
            fs.writeFileSync(outCachePath, synthesized.buffer);
          } catch (writeErr) {
            console.warn('[VOID TTS] Cache write failed:', writeErr);
          }

          return {
            id: turn.id,
            speaker: turn.speaker,
            mimeType: synthesized.mimeType,
            audioBase64: synthesized.buffer.toString('base64'),
          };
        } catch (turnErr: any) {
          console.warn(`[VOID TTS] Turn ${safeScenario}/${safeTurn} fallback to client speech:`, turnErr?.message || turnErr);
          return {
            id: turn.id,
            speaker: turn.speaker,
            mimeType: null,
            audioBase64: null,
          };
        }
      })
    );

    const anyAudioAvailable = audioTurns.some((t) => Boolean(t.audioBase64));

    return res.json({
      available: anyAudioAvailable,
      engine: hasFish ? 'fish+gemini' : 'gemini-dual',
      turns: audioTurns,
    });
  } catch (err: any) {
    console.error('[VOID TTS] Synthesis error:', err?.message || err);
    return res.status(err?.status || 500).json({
      available: false,
      error: err?.message || 'Failed to synthesize dual-speaker voiceover',
    });
  }
});

// SMTP Contact Form Endpoint for Recruiter / HR Outreach
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanSubject = (subject || 'Portfolio Inquiry').trim();
  const cleanMessage = (message || '').trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({
      ok: false,
      error: 'Please fill in your name, email address, and message.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  }

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const smtpUser = (process.env.SMTP_USER || 'ahmedabdelhady0246@gmail.com').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();
  const configuredFromName = (process.env.SMTP_FROM_NAME || process.env.SMTP_FROM || '').replace(/"/g, '').trim();
  const smtpFromName = !configuredFromName || /^portfolio$/i.test(configuredFromName)
    ? 'Ahmed Abdelgaffar'
    : configuredFromName;
  const smtpFromRaw = (process.env.SMTP_FROM || '').trim();
  const contactTo = (process.env.CONTACT_EMAIL_TO || 'ahmedabdelhady0246@gmail.com').trim();

  if (!smtpPass || smtpPass === 'MY_GMAIL_APP_PASSWORD' || smtpPass.includes('*')) {
    return res.status(503).json({
      ok: false,
      reason: 'smtp_unconfigured',
      error: 'SMTP delivery is not configured yet (set SMTP_PASS in server secrets) or reach out directly via email below.',
    });
  }

  const fromHeader = smtpFromRaw.includes('@') ? smtpFromRaw : `"${smtpFromName}" <${smtpUser}>`;
  const htmlMessage = escapeHtml(cleanMessage).replace(/\r\n|\r|\n/g, '<br>');

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: fromHeader,
      to: contactTo,
      replyTo: cleanEmail,
      subject: `[Portfolio] ${cleanSubject} — ${cleanName}`,
      attachments: [{
        filename: 'ahmed-abdelgaffar-monogram.png',
        path: path.join(__dirname, 'public', 'assets', 'aistudio', 'monogram_logo_email.png'),
        cid: 'portfolio-monogram',
        contentDisposition: 'inline',
      }],
      text: [
        `NEW MESSAGE FROM YOUR PORTFOLIO`,
        ``,
        `${cleanName} reached out about: ${cleanSubject}`,
        `Email: ${cleanEmail}`,
        ``,
        `Message:`,
        cleanMessage,
        ``,
        `Reply directly to this email to respond to ${cleanName}.`,
      ].join('\n'),
      html: `
        <!doctype html>
        <html lang="en">
          <body style="margin:0;padding:32px 12px;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#171717;">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
              ${escapeHtml(cleanName)} sent you a message about ${escapeHtml(cleanSubject)}.
            </div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center">
                  <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e2e2e5;border-radius:18px;overflow:hidden;">
                    <tr>
                      <td style="padding:30px 34px 32px;background-color:#0a0a0a;color:#ededed;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td width="54" align="center" valign="middle" style="width:54px;padding:6px;background-color:#ffffff;border-radius:10px;">
                              <img src="cid:portfolio-monogram" width="48" alt="Ahmed Abdelgaffar monogram" style="display:block;width:48px;height:auto;border:0;">
                            </td>
                            <td style="padding-left:14px;">
                              <div style="font-size:14px;font-weight:bold;letter-spacing:0.2px;color:#ededed;">Ahmed Abdelgaffar</div>
                              <div style="padding-top:5px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:#a3a3a3;">FLUTTER &amp; APPLIED AI ENGINEER</div>
                            </td>
                          </tr>
                        </table>
                        <div style="padding-top:32px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;color:#a3a3a3;">PORTFOLIO&nbsp;&nbsp; / &nbsp;&nbsp;NEW MESSAGE</div>
                        <div style="padding-top:10px;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.15;letter-spacing:-0.5px;color:#ffffff;">A new message,<br>from your portfolio.</div>
                        <div style="padding-top:12px;font-size:13px;line-height:1.6;color:#a3a3a3;">Someone reached out about working together.</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px 34px 34px;">
                        <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.8px;color:#737373;">01 &nbsp; / &nbsp; INCOMING NOTE</div>
                        <div style="padding-top:7px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#171717;">
                          ${escapeHtml(cleanName)} got in touch
                        </div>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:22px;font-size:13px;line-height:1.5;">
                          <tr>
                            <td style="padding:13px 0;border-top:1px solid #e2e2e5;color:#737373;font-family:'Courier New',monospace;font-size:10px;letter-spacing:1px;">SENDER</td>
                            <td align="right" style="padding:13px 0;border-top:1px solid #e2e2e5;color:#171717;font-weight:bold;">${escapeHtml(cleanName)}</td>
                          </tr>
                          <tr>
                            <td style="padding:13px 0;border-top:1px solid #e2e2e5;color:#737373;font-family:'Courier New',monospace;font-size:10px;letter-spacing:1px;">EMAIL</td>
                            <td align="right" style="padding:13px 0;border-top:1px solid #e2e2e5;overflow-wrap:anywhere;"><a href="mailto:${escapeHtml(cleanEmail)}" style="color:#171717;text-decoration:underline;">${escapeHtml(cleanEmail)}</a></td>
                          </tr>
                          <tr>
                            <td style="padding:13px 0;border-top:1px solid #e2e2e5;color:#737373;font-family:'Courier New',monospace;font-size:10px;letter-spacing:1px;">TOPIC</td>
                            <td align="right" style="padding:13px 0;border-top:1px solid #e2e2e5;color:#171717;font-weight:bold;">${escapeHtml(cleanSubject)}</td>
                          </tr>
                        </table>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
                          <tr>
                            <td style="padding:18px 20px;background-color:#f5f5f5;border:1px solid #e2e2e5;border-left:3px solid #171717;border-radius:8px;">
                              <div style="padding-bottom:10px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:1.5px;color:#737373;">THE MESSAGE</div>
                              <div style="color:#262626;font-size:14px;line-height:1.75;overflow-wrap:anywhere;">${htmlMessage}</div>
                            </td>
                          </tr>
                        </table>
                        <div style="padding-top:22px;color:#737373;font-size:12px;line-height:1.6;">
                          You can reply directly to this email to reach ${escapeHtml(cleanName)}.
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:17px 34px;background-color:#fafafa;border-top:1px solid #e2e2e5;color:#737373;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1px;">
                        AHMED ABDELGAFFAR &nbsp; / &nbsp; FLUTTER · APPLIED AI
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log(`[SMTP Contact] Delivered message ${info.messageId} from ${cleanEmail}`);
    return res.json({
      ok: true,
      messageId: info.messageId,
    });
  } catch (err: any) {
    console.error('[SMTP Contact] Delivery failed:', err?.message || err);
    return res.status(500).json({
      ok: false,
      error: 'Unable to deliver message via SMTP right now. Please try emailing directly.',
    });
  }
});

// Server bootstrap with Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
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
