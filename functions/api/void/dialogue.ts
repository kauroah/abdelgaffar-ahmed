import { GoogleGenAI } from '@google/genai';
import { VOID_PROJECT_DATA } from '../../../src/data/voidProjectData';

interface Env {
  GEMINI_API_KEY?: string;
  FISH_API_KEY?: string;
}

interface DialogueTurnInput {
  id: string;
  speaker: 'Ahmed' | 'VOID';
}

interface AudioTurn {
  id: string;
  speaker: 'Ahmed' | 'VOID';
  mimeType: string | null;
  audioBase64: string | null;
}

interface SynthesizedAudio {
  mimeType: string;
  audioBase64: string;
}

interface Providers {
  gemini: (speaker: 'Ahmed' | 'VOID', text: string, style: string | undefined, apiKey: string) => Promise<SynthesizedAudio>;
  fish: (text: string, apiKey: string) => Promise<SynthesizedAudio>;
}

const FISH_HEISENBERG_VOICE_ID = '52fc1dcd125d4ecabef0baf91807cb12';
const audioCache = new Map<string, { audio: SynthesizedAudio; expiresAt: number }>();
const AUDIO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function isConfigured(key: string | undefined): key is string {
  return Boolean(key?.trim() && !/^your_|^my_/i.test(key.trim()));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

async function synthesizeFish(text: string, apiKey: string): Promise<SynthesizedAudio> {
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
  if (!response.ok) throw new Error(`Fish Audio responded with status ${response.status}`);
  return { mimeType: 'audio/mpeg', audioBase64: arrayBufferToBase64(await response.arrayBuffer()) };
}

async function synthesizeGemini(
  speaker: 'Ahmed' | 'VOID',
  text: string,
  style: string | undefined,
  apiKey: string,
): Promise<SynthesizedAudio> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
  const voiceName = speaker === 'Ahmed' ? 'Puck' : 'Charon';
  const defaultStyle = speaker === 'Ahmed'
    ? 'Natural, friendly, clear young software engineer speaking conversationally'
    : 'Deep, gravelly, calm, deliberate Heisenberg-inspired voice with dry confidence and steady pacing';
  const models = speaker === 'Ahmed'
    ? ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts']
    : ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];
  let lastError: unknown;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{
          role: 'user',
          parts: [{ text, speechMetadata: { style: style || defaultStyle } }],
        }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
        },
      });
      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioBase64) return { mimeType: 'audio/wav', audioBase64 };
      lastError = new Error(`${model} returned no audio`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Gemini TTS failed');
}

const providers: Providers = {
  gemini: synthesizeGemini,
  fish: synthesizeFish,
};

function parseTurns(body: unknown): { scenarioId: string; turns: DialogueTurnInput[] } | null {
  if (typeof body !== 'object' || body === null) return null;
  const input = body as { scenarioId?: unknown; turns?: unknown };
  if (typeof input.scenarioId !== 'string' || !Array.isArray(input.turns)) return null;

  const scenario = VOID_PROJECT_DATA.scenarios.find(({ id }) => id === input.scenarioId);
  if (!scenario || input.turns.length !== scenario.turns.length) return null;
  const turns = input.turns as DialogueTurnInput[];
  if (!turns.every((turn, index) =>
    typeof turn?.id === 'string' &&
    turn.id === scenario.turns[index].id &&
    turn.speaker === scenario.turns[index].speaker,
  )) return null;

  return { scenarioId: input.scenarioId, turns };
}

function cachedAudio(key: string): SynthesizedAudio | undefined {
  const cached = audioCache.get(key);
  if (!cached) return undefined;
  if (cached.expiresAt <= Date.now()) {
    audioCache.delete(key);
    return undefined;
  }
  return cached.audio;
}

export async function handleDialogueRequest(
  request: Request,
  env: Env,
  providerOverrides: Providers = providers,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ available: false, error: 'Please submit a valid dialogue request.' }, { status: 400 });
  }

  const parsed = parseTurns(body);
  if (!parsed) {
    return Response.json({ available: false, error: 'Unknown scenario or invalid dialogue turns.' }, { status: 400 });
  }

  const geminiKey = isConfigured(env.GEMINI_API_KEY) ? env.GEMINI_API_KEY.trim() : undefined;
  const fishKey = isConfigured(env.FISH_API_KEY) ? env.FISH_API_KEY.trim() : undefined;
  if (!geminiKey && !fishKey) {
    return Response.json({ available: false, reason: 'no_api_key' });
  }

  const scenario = VOID_PROJECT_DATA.scenarios.find(({ id }) => id === parsed.scenarioId)!;
  const usedProviders = new Set<string>();
  const failedTurns: string[] = [];
  const audioTurns: AudioTurn[] = await Promise.all(scenario.turns.map(async (turn) => {
    const useFish = turn.speaker === 'VOID' && Boolean(fishKey);
    const cacheKey = `${parsed.scenarioId}:${turn.id}:${useFish ? 'fish' : 'gemini'}`;
    const cached = cachedAudio(cacheKey);
    if (cached) {
      usedProviders.add(useFish ? 'fish' : 'gemini');
      return { id: turn.id, speaker: turn.speaker, ...cached };
    }

    try {
      let synthesized: SynthesizedAudio;
      if (useFish && fishKey) {
        try {
          synthesized = await providerOverrides.fish(turn.text, fishKey);
          usedProviders.add('fish');
        } catch (fishError) {
          if (!geminiKey) throw fishError;
          console.warn(`[VOID TTS] Fish Audio failed for ${turn.id}; trying Gemini.`);
          synthesized = await providerOverrides.gemini(turn.speaker, turn.text, turn.speechStyle, geminiKey);
          usedProviders.add('gemini');
        }
      } else if (geminiKey) {
        synthesized = await providerOverrides.gemini(turn.speaker, turn.text, turn.speechStyle, geminiKey);
        usedProviders.add('gemini');
      } else {
        throw new Error('No TTS provider is configured for this turn');
      }

      audioCache.set(cacheKey, { audio: synthesized, expiresAt: Date.now() + AUDIO_CACHE_TTL_MS });
      return { id: turn.id, speaker: turn.speaker, ...synthesized };
    } catch {
      console.warn(`[VOID TTS] Audio unavailable for ${turn.id}.`);
      failedTurns.push(turn.id);
      return { id: turn.id, speaker: turn.speaker, mimeType: null, audioBase64: null };
    }
  }));

  const result = {
    available: audioTurns.some(({ audioBase64 }) => Boolean(audioBase64)),
    ...(usedProviders.size ? { engine: [...usedProviders].sort().join('+') } : {}),
    ...(failedTurns.length ? { failedTurns } : {}),
    turns: audioTurns,
  };
  return Response.json(result);
}

export function clearDialogueAudioCache(): void {
  audioCache.clear();
}

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export const onRequestPost = ({ request, env }: PagesFunctionContext): Promise<Response> =>
  handleDialogueRequest(request, env);
