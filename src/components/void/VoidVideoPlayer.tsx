import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Mic, Cpu } from 'lucide-react';
import { VoidParticleSphere, VoidSphereState } from './VoidParticleSphere';
import { VoidWorkspaceStage } from './VoidWorkspaceStage';
import { VoidTaskScenario, VoidDialogueTurn } from '../../data/voidProjectData';

interface VoidVideoPlayerProps {
  scenarios: VoidTaskScenario[];
  posterUrl?: string;
  captionsUrl?: string;
  title?: string;
}

interface TurnWindow {
  turn: VoidDialogueTurn;
  index: number;
  startSec: number;
  toolWindowEndSec: number;
  endSec: number;
  speechDurationSec: number;
}

interface ApiTurnAudio {
  id: string;
  speaker: 'Ahmed' | 'VOID';
  mimeType: string | null;
  audioBase64: string | null;
}

const TOOL_PAUSE_SEC = 1.15;

export const VoidVideoPlayer: React.FC<VoidVideoPlayerProps> = ({
  scenarios,
  title = 'Watch VOID in action',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // AudioContext + Analyser refs for decoded WAV/MP3 turn playback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const turnBuffersCacheRef = useRef<Record<string, (AudioBuffer | null)[] | 'unavailable'>>({});
  const fftEnergyRef = useRef<number>(0);

  // Playback session control
  const playbackSessionRef = useRef<number>(0);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id ?? '');
  const activeScenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0],
    [scenarios, selectedScenarioId]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [decodedDurations, setDecodedDurations] = useState<number[] | null>(null);
  const [playbackMode, setPlaybackMode] = useState<'audio' | 'speech'>('speech');
  const [activeTurnIdx, setActiveTurnIdx] = useState<number>(0);
  const [inToolPhase, setInToolPhase] = useState<boolean>(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [audioEnergy, setAudioEnergy] = useState(0.2);

  // Build turn timeline windows using actual decoded AudioBuffer durations when available
  const { turnWindows, totalDuration } = useMemo(() => {
    const windows: TurnWindow[] = [];
    let cursor = 0;

    activeScenario.turns.forEach((turn, index) => {
      const hasTools = Boolean(turn.toolCalls && turn.toolCalls.length > 0);
      const toolPause = hasTools ? TOOL_PAUSE_SEC : 0;
      const speechSec =
        decodedDurations && decodedDurations[index]
          ? decodedDurations[index]
          : turn.estimatedSec;

      const startSec = cursor;
      const toolWindowEndSec = cursor + toolPause;
      const endSec = toolWindowEndSec + speechSec;
      windows.push({
        turn,
        index,
        startSec,
        toolWindowEndSec,
        endSec,
        speechDurationSec: speechSec,
      });

      const nextTurn = activeScenario.turns[index + 1];
      const gap = nextTurn?.isBargeIn ? 0.05 : 0.28;
      cursor = endSec + gap;
    });

    return {
      turnWindows: windows,
      totalDuration: Math.max(1, cursor),
    };
  }, [activeScenario, decodedDurations]);

  const displayedTurn = activeScenario.turns[activeTurnIdx] || activeScenario.turns[0];

  // Role-specific 3D sphere posture
  const sphereState: VoidSphereState = useMemo(() => {
    if (!isPlaying || !displayedTurn) return 'idle';
    if (inToolPhase) return 'thinking';
    if (displayedTurn.isBargeIn) return 'barge-in';
    return displayedTurn.speaker === 'Ahmed' ? 'user' : 'assistant';
  }, [isPlaying, displayedTurn, inToolPhase]);

  const stopAllAudio = useCallback(() => {
    playbackSessionRef.current += 1;
    if (timerRef.current !== null) {
      globalThis.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.onended = null;
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {
        // Already stopped
      }
      sourceNodeRef.current = null;
    }
    fftEnergyRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopAllAudio]);

  // Keep mute gain synchronized live for decoded AudioBuffer playback
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  const pickDualVoices = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { userVoice: null, assistantVoice: null };
    }
    const voices = window.speechSynthesis.getVoices();
    const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    const pool = enVoices.length >= 2 ? enVoices : voices;

    const userPreferred = ['google us english', 'samantha', 'alex', 'mark', 'aria', 'jenny'];
    const assistantPreferred = ['daniel', 'david', 'uk english male', 'ryan', 'guy', 'george', 'arthur'];

    const assistantVoice =
      pool.find((v) => assistantPreferred.some((kw) => v.name.toLowerCase().includes(kw))) ||
      pool[0] ||
      null;

    const userVoice =
      pool.find(
        (v) =>
          v.name !== assistantVoice?.name &&
          userPreferred.some((kw) => v.name.toLowerCase().includes(kw))
      ) ||
      pool.find((v) => v.name !== assistantVoice?.name) ||
      pool[0] ||
      null;

    return { userVoice, assistantVoice };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Sequentially play decoded AudioBuffers (Fish Audio MP3 or Gemini WAV), with per-turn SpeechSynthesis fallback if a single turn has no buffer
  const runAudioBufferSequence = useCallback(
    (buffers: (AudioBuffer | null)[], startIndex: number, offsetWithinTurnSec = 0) => {
      stopAllAudio();
      const sessionId = playbackSessionRef.current;

      const ensureAudioGraph = () => {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const gain = ctx.createGain();
        gain.gain.value = isMuted ? 0 : 1;
        gainNodeRef.current = gain;

        analyser.connect(gain);
        gain.connect(ctx.destination);
        return { ctx, analyser };
      };

      const playTurnIndex = (idx: number, turnOffset: number) => {
        if (playbackSessionRef.current !== sessionId) return;
        if (idx >= activeScenario.turns.length || idx >= buffers.length) {
          setIsPlaying(false);
          setActiveTurnIdx(0);
          setInToolPhase(false);
          setCurrentTime(0);
          fftEnergyRef.current = 0;
          return;
        }

        const turn = activeScenario.turns[idx];
        const buffer = buffers[idx];
        const hasTools = Boolean(turn.toolCalls && turn.toolCalls.length > 0);
        const toolPauseSec = hasTools ? TOOL_PAUSE_SEC : 0;

        setActiveTurnIdx(idx);

        const advanceToNextTurn = () => {
          if (playbackSessionRef.current !== sessionId) return;
          const nextTurn = activeScenario.turns[idx + 1];
          const gapMs = nextTurn?.isBargeIn ? 40 : 280;
          timerRef.current = globalThis.setTimeout(() => {
            playTurnIndex(idx + 1, 0);
          }, gapMs);
        };

        const startSpeechBuffer = (speechOffset: number) => {
          if (playbackSessionRef.current !== sessionId) return;
          setInToolPhase(false);

          // If this turn lacks an AudioBuffer (e.g. quota hit on Ahmed), use browser SpeechSynthesis just for this turn
          if (!buffer) {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
              timerRef.current = globalThis.setTimeout(advanceToNextTurn, turn.estimatedSec * 1000);
              return;
            }
            const { userVoice, assistantVoice } = pickDualVoices();
            const utterance = new SpeechSynthesisUtterance(turn.text);
            activeUtteranceRef.current = utterance;
            if (turn.speaker === 'Ahmed') {
              if (userVoice) utterance.voice = userVoice;
              utterance.pitch = 1.05;
              utterance.rate = turn.isBargeIn ? 1.12 : 1.02;
            } else {
              if (assistantVoice) utterance.voice = assistantVoice;
              utterance.pitch = 0.78;
              utterance.rate = 0.94;
            }
            utterance.volume = isMuted ? 0 : 1.0;
            utterance.onend = advanceToNextTurn;
            utterance.onerror = () => {
              timerRef.current = globalThis.setTimeout(advanceToNextTurn, turn.estimatedSec * 1000);
            };
            window.speechSynthesis.speak(utterance);
            return;
          }

          const { ctx, analyser } = ensureAudioGraph();
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(analyser);
          sourceNodeRef.current = source;

          const safeOffset = Math.max(0, Math.min(speechOffset, Math.max(0, buffer.duration - 0.05)));
          source.start(0, safeOffset);

          source.onended = () => {
            if (playbackSessionRef.current !== sessionId) return;
            sourceNodeRef.current = null;
            fftEnergyRef.current = 0;
            advanceToNextTurn();
          };
        };

        if (hasTools && turnOffset < toolPauseSec) {
          setInToolPhase(true);
          const remainingToolMs = Math.max(50, (toolPauseSec - turnOffset) * 1000);
          timerRef.current = globalThis.setTimeout(() => {
            startSpeechBuffer(0);
          }, remainingToolMs);
        } else {
          startSpeechBuffer(Math.max(0, turnOffset - toolPauseSec));
        }
      };

      playTurnIndex(startIndex, offsetWithinTurnSec);
    },
    [activeScenario, isMuted, pickDualVoices, stopAllAudio]
  );

  // Sequential fallback using two distinct SpeechSynthesis voices (Ahmed vs Heisenberg VOID)
  const runSpeechSequenceFromTurn = useCallback(
    (startIndex: number) => {
      stopAllAudio();
      const sessionId = playbackSessionRef.current;

      const speakTurn = (idx: number) => {
        if (playbackSessionRef.current !== sessionId) return;
        if (idx >= activeScenario.turns.length) {
          setIsPlaying(false);
          setActiveTurnIdx(0);
          setInToolPhase(false);
          setCurrentTime(0);
          return;
        }

        const turn = activeScenario.turns[idx];
        const win = turnWindows[idx];
        setActiveTurnIdx(idx);
        if (win) setCurrentTime(win.startSec);

        const beginUtterance = () => {
          if (playbackSessionRef.current !== sessionId) return;
          setInToolPhase(false);

          if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            timerRef.current = globalThis.setTimeout(() => {
              speakTurn(idx + 1);
            }, turn.estimatedSec * 1000);
            return;
          }

          const { userVoice, assistantVoice } = pickDualVoices();
          const utterance = new SpeechSynthesisUtterance(turn.text);
          activeUtteranceRef.current = utterance;

          if (turn.speaker === 'Ahmed') {
            if (userVoice) utterance.voice = userVoice;
            utterance.pitch = 1.05;
            utterance.rate = turn.isBargeIn ? 1.12 : 1.02;
          } else {
            if (assistantVoice) utterance.voice = assistantVoice;
            // Deep, deliberate Heisenberg-inspired tone
            utterance.pitch = 0.78;
            utterance.rate = 0.94;
          }

          utterance.volume = isMuted ? 0 : 1.0;

          utterance.onend = () => {
            if (playbackSessionRef.current !== sessionId) return;
            const nextTurn = activeScenario.turns[idx + 1];
            const gapMs = nextTurn?.isBargeIn ? 40 : 280;
            timerRef.current = globalThis.setTimeout(() => {
              speakTurn(idx + 1);
            }, gapMs);
          };

          utterance.onerror = () => {
            if (playbackSessionRef.current !== sessionId) return;
            timerRef.current = globalThis.setTimeout(() => {
              speakTurn(idx + 1);
            }, turn.estimatedSec * 1000);
          };

          window.speechSynthesis.speak(utterance);
        };

        if (turn.toolCalls && turn.toolCalls.length > 0) {
          setInToolPhase(true);
          timerRef.current = globalThis.setTimeout(beginUtterance, TOOL_PAUSE_SEC * 1000);
        } else {
          beginUtterance();
        }
      };

      speakTurn(startIndex);
    },
    [activeScenario, turnWindows, pickDualVoices, isMuted, stopAllAudio]
  );

  // Decode base64 turns into AudioBuffers (null if a turn fell back to client speech)
  const decodeBase64Turns = async (apiTurns: ApiTurnAudio[]): Promise<(AudioBuffer | null)[]> => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;

    const buffers: (AudioBuffer | null)[] = [];
    for (const item of apiTurns) {
      if (!item.audioBase64) {
        buffers.push(null);
        continue;
      }
      const binaryStr = window.atob(item.audioBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const decoded = await ctx.decodeAudioData(bytes.buffer.slice(0));
      buffers.push(decoded);
    }
    return buffers;
  };

  // Start scenario from optional time offset
  const startScenarioPlayback = useCallback(
    async (offsetSec = 0) => {
      setHasStarted(true);
      setIsPreparingAudio(true);

      const resolveTurnStart = (windows: TurnWindow[], targetSec: number) => {
        const foundIdx = windows.findIndex((w) => targetSec <= w.endSec);
        const idx = foundIdx === -1 ? 0 : foundIdx;
        const win = windows[idx];
        const within = win ? Math.max(0, targetSec - win.startSec) : 0;
        return { idx, within };
      };

      const cached = turnBuffersCacheRef.current[activeScenario.id];
      if (cached && cached !== 'unavailable') {
        const durations = cached.map((b, i) => b?.duration ?? activeScenario.turns[i]?.estimatedSec ?? 4);
        setDecodedDurations(durations);
        setPlaybackMode('audio');
        setIsPreparingAudio(false);
        setIsPlaying(true);

        // Compute windows cleanly with decoded durations
        let cursor = 0;
        const freshWindows: TurnWindow[] = activeScenario.turns.map((turn, index) => {
          const toolPause = turn.toolCalls?.length ? TOOL_PAUSE_SEC : 0;
          const startSec = cursor;
          const toolWindowEndSec = cursor + toolPause;
          const speechSec = durations[index] ?? turn.estimatedSec;
          const endSec = toolWindowEndSec + speechSec;
          const gap = activeScenario.turns[index + 1]?.isBargeIn ? 0.05 : 0.28;
          cursor = endSec + gap;
          return { turn, index, startSec, toolWindowEndSec, endSec, speechDurationSec: speechSec };
        });

        const { idx, within } = resolveTurnStart(freshWindows, offsetSec);
        runAudioBufferSequence(cached, idx, within);
        return;
      }

      if (cached !== 'unavailable') {
        try {
          const res = await fetch('/api/void/dialogue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scenarioId: activeScenario.id,
              turns: activeScenario.turns.map((t) => ({
                id: t.id,
                speaker: t.speaker,
                text: t.text,
                style: t.speechStyle,
              })),
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.available && Array.isArray(data.turns) && data.turns.length > 0) {
              const buffers = await decodeBase64Turns(data.turns);
              turnBuffersCacheRef.current[activeScenario.id] = buffers;
              const durations = buffers.map((b, i) => b?.duration ?? activeScenario.turns[i]?.estimatedSec ?? 4);
              setDecodedDurations(durations);
              setPlaybackMode('audio');
              setIsPreparingAudio(false);
              setIsPlaying(true);

              let cursor = 0;
              const freshWindows: TurnWindow[] = activeScenario.turns.map((turn, index) => {
                const toolPause = turn.toolCalls?.length ? TOOL_PAUSE_SEC : 0;
                const startSec = cursor;
                const toolWindowEndSec = cursor + toolPause;
                const speechSec = durations[index] ?? turn.estimatedSec;
                const endSec = toolWindowEndSec + speechSec;
                const gap = activeScenario.turns[index + 1]?.isBargeIn ? 0.05 : 0.28;
                cursor = endSec + gap;
                return { turn, index, startSec, toolWindowEndSec, endSec, speechDurationSec: speechSec };
              });

              const { idx, within } = resolveTurnStart(freshWindows, offsetSec);
              runAudioBufferSequence(buffers, idx, within);
              return;
            }
          }
          turnBuffersCacheRef.current[activeScenario.id] = 'unavailable';
        } catch {
          turnBuffersCacheRef.current[activeScenario.id] = 'unavailable';
        }
      }

      // Fallback dual-voice SpeechSynthesis engine
      setPlaybackMode('speech');
      setDecodedDurations(null);
      setIsPreparingAudio(false);
      setIsPlaying(true);
      const { idx } = resolveTurnStart(turnWindows, offsetSec);
      runSpeechSequenceFromTurn(idx);
    },
    [activeScenario, turnWindows, runAudioBufferSequence, runSpeechSequenceFromTurn]
  );

  const togglePlay = useCallback(() => {
    if (isPreparingAudio) return;
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      startScenarioPlayback(currentTime);
    }
  }, [isPlaying, isPreparingAudio, currentTime, startScenarioPlayback, stopAllAudio]);

  const handleSelectScenario = (scenarioId: string) => {
    if (scenarioId === selectedScenarioId) return;
    stopAllAudio();
    setIsPlaying(false);
    setHasStarted(false);
    setCurrentTime(0);
    setActiveTurnIdx(0);
    setInToolPhase(false);
    setDecodedDurations(null);
    setSelectedScenarioId(scenarioId);
  };

  // Timer + real-time FFT analyzer loop
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    let lastTs = performance.now();
    const freqData = new Uint8Array(128);

    const tick = (ts: number) => {
      const delta = (ts - lastTs) / 1000;
      lastTs = ts;

      if (playbackMode === 'audio' && analyserRef.current && sourceNodeRef.current) {
        analyserRef.current.getByteFrequencyData(freqData);
        let sum = 0;
        const bins = Math.min(48, freqData.length);
        for (let i = 1; i < bins; i++) {
          sum += freqData[i];
        }
        fftEnergyRef.current = sum / (bins * 255);
      } else {
        fftEnergyRef.current = 0;
      }

      setCurrentTime((prev) => Math.min(totalDuration, prev + delta));
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackMode, totalDuration]);

  const handleScrubberInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * totalDuration;
    setCurrentTime(newTime);

    const targetIdx = Math.max(
      0,
      turnWindows.findIndex((w) => newTime <= w.endSec)
    );
    setActiveTurnIdx(targetIdx === -1 ? 0 : targetIdx);

    if (isPlaying) {
      startScenarioPlayback(newTime);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'm') {
      e.preventDefault();
      setIsMuted((prev) => !prev);
    } else if (e.key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const progressPercent = totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0;

  const statusLabel = useMemo(() => {
    if (isPreparingAudio) return 'LOADING VOICES';
    if (!isPlaying || !displayedTurn) return 'VOICE ASSISTANT';
    if (inToolPhase) return 'EXECUTING COMMANDS';
    if (displayedTurn.isBargeIn) return 'BARGE-IN · INTERRUPTED';
    return displayedTurn.speaker === 'Ahmed' ? 'AHMED · SPEAKING' : 'VOID · SPEAKING';
  }, [isPreparingAudio, isPlaying, displayedTurn, inToolPhase]);

  return (
    <div className="w-full space-y-4">
      {/* 16:9 Matte-Black VOID Interactive Viewport */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative w-full aspect-[16/9] bg-[#0A0A0A] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="VOID Voice Assistant Interactive Sphere and Dual-Voice Demo Player. Press Space to play or pause, M to mute, F for fullscreen."
      >
        {/* TOP HEADER BAR */}
        <div className="relative z-40 pointer-events-none flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-7">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-base sm:text-lg tracking-wider text-white">
              VOID
            </span>
            {isPlaying && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 hidden sm:inline">
                / Task {activeScenario.index}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/80">
            {displayedTurn && isPlaying && (
              <span className="text-white/50 hidden sm:inline">
                {displayedTurn.speaker === 'Ahmed' ? (
                  <Mic className="w-3 h-3 inline mr-1 -mt-0.5" />
                ) : (
                  <Cpu className="w-3 h-3 inline mr-1 -mt-0.5" />
                )}
              </span>
            )}
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* CENTER CANVAS: Full Sphere before start, Live Desktop + Docked Sphere once playing */}
        {!hasStarted ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-0 w-full h-full">
              <VoidParticleSphere
                isSpeaking={false}
                speakerState="idle"
                externalEnergyRef={fftEnergyRef}
                intensity={0.4}
                onAudioEnergy={setAudioEnergy}
              />
            </div>

            <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-200">
              <button
                onClick={togglePlay}
                disabled={isPreparingAudio}
                className="group/btn relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full border border-white text-white transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer bg-black/25 backdrop-blur-[2px] disabled:opacity-60"
                aria-label="Play VOID voice demonstration"
              >
                <span
                  className="absolute inset-[-4px] rounded-full border border-white/30 transition-transform duration-75 pointer-events-none"
                  style={{
                    transform: `scale(${1 + audioEnergy * 0.14})`,
                    opacity: 0.35 + audioEnergy * 0.5,
                  }}
                />
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white translate-x-0.5" />
              </button>

              <div className="mt-4 sm:mt-5 flex flex-col items-center text-center px-4">
                <span className="text-sm sm:text-base lg:text-lg font-medium text-white tracking-tight">
                  {isPreparingAudio ? 'Preparing dual voices...' : title}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-white/60 mt-1">
                  DEMO PREVIEW · AHMED &amp; VOID
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Live OS Desktop + Opening Apps + Always-Listening Background Terminal */}
            <VoidWorkspaceStage
              scenarioId={activeScenario.id}
              activeTurnIdx={activeTurnIdx}
              inToolPhase={inToolPhase}
              isPlaying={isPlaying}
              speakerState={sphereState}
              displayedTurn={displayedTurn}
            />

            {/* Docked Floating 3D VOID Particle Orb HUD */}
            <div
              className="absolute bottom-13 sm:bottom-14 right-3 sm:right-6 z-30 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#0A0A0D]/90 border border-white/20 shadow-2xl overflow-hidden backdrop-blur-md pointer-events-none transition-transform duration-200"
              aria-hidden="true"
            >
              <VoidParticleSphere
                isSpeaking={isPlaying}
                speakerState={sphereState}
                externalEnergyRef={fftEnergyRef}
                intensity={isPlaying ? 1.0 : 0.4}
                onAudioEnergy={setAudioEnergy}
              />
            </div>

            {/* Live Closed Captions cleanly clear of the docked orb */}
            {captionsEnabled && displayedTurn && (
              <div className="absolute bottom-13 sm:bottom-14 left-3 sm:left-6 right-26 sm:right-38 z-30 pointer-events-none flex items-end">
                <div className="px-3.5 py-2 rounded-lg bg-black/85 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs text-white leading-relaxed shadow-xl max-w-full">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/60 mr-2">
                    [{displayedTurn.roleLabel}]
                  </span>
                  <span className="font-normal text-white/95">{displayedTurn.text}</span>
                </div>
              </div>
            )}

            {/* Click anywhere inside workspace stage to pause while playing */}
            {isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-x-0 top-12 bottom-12 z-20 bg-transparent pointer-events-auto cursor-pointer"
                aria-label="Pause VOID demonstration"
              />
            )}

            {/* Paused Overlay (preserves top header and bottom playback controls) */}
            {!isPlaying && (
              <div className="absolute inset-x-0 top-12 bottom-12 z-30 flex items-center justify-center bg-black/35 backdrop-blur-[1px] pointer-events-auto">
                <button
                  onClick={togglePlay}
                  disabled={isPreparingAudio}
                  className="flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-white text-white bg-black/60 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-2xl"
                  aria-label="Resume VOID demonstration"
                >
                  <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM CONTROL BAR */}
        <div
          className="relative z-40 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 pb-4 sm:pb-6 text-white text-xs select-none"
          role="region"
          aria-label="Playback controls"
        >
          <button
            onClick={togglePlay}
            className="p-1 rounded hover:bg-white/10 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>

          <div className="font-mono text-[11px] sm:text-xs text-white/90 tabular-nums whitespace-nowrap min-w-[70px]">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>

          <div
            ref={progressBarRef}
            onClick={handleScrubberInteraction}
            className="relative flex-1 h-6 flex items-center cursor-pointer group/scrubber"
            role="slider"
            aria-valuenow={Math.round(currentTime)}
            aria-valuemin={0}
            aria-valuemax={Math.round(totalDuration)}
            aria-label="Timeline position"
          >
            <div className="w-full h-[2px] sm:h-[3px] bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full shadow-md pointer-events-none group-hover/scrubber:scale-125 transition-transform duration-100"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCaptionsEnabled((prev) => !prev)}
              className={`px-1.5 py-0.5 rounded border text-[10px] font-mono tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer ${
                captionsEnabled
                  ? 'border-white text-white bg-white/20 font-bold'
                  : 'border-white/40 text-white/60 hover:text-white hover:border-white/80'
              }`}
              aria-label={captionsEnabled ? 'Disable closed captions' : 'Enable closed captions'}
              title="Closed captions"
            >
              CC
            </button>

            <button
              onClick={() => setIsMuted((prev) => !prev)}
              className="p-1 rounded hover:bg-white/10 active:scale-95 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/50" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-white/10 active:scale-95 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-white/70 hover:text-white" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-white/70 hover:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* EDITORIAL SCENARIO SELECTOR & DUAL-VOICE LEGEND */}
      <div className="pt-2 border-t border-[#E5E2DA] dark:border-[#2C2A26] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] font-mono text-[#171717]/65 dark:text-[#E8E6DF]/65">
          <span className="uppercase tracking-wider">Select Voice Task</span>
          <span className="truncate">
            Dual Voiceover: <strong className="text-[#171717] dark:text-[#E8E6DF]">Ahmed (User)</strong> &middot;{' '}
            <strong className="text-[#171717] dark:text-[#E8E6DF]">VOID (Heisenberg Style)</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {scenarios.map((sc) => {
            const isSelected = sc.id === activeScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-[#E8E6DF] ${
                  isSelected
                    ? 'bg-[#171717] text-[#F7F5F0] border-[#171717] dark:bg-[#E8E6DF] dark:text-[#171717] dark:border-[#E8E6DF]'
                    : 'bg-transparent text-[#171717] dark:text-[#E8E6DF] border-[#E5E2DA] dark:border-[#2C2A26] hover:border-[#171717]/50 dark:hover:border-[#E8E6DF]/50'
                }`}
              >
                <div className="text-xs font-medium leading-snug truncate">
                  {sc.shortLabel}
                </div>
                <div
                  className={`text-[10px] font-mono mt-1 truncate ${
                    isSelected
                      ? 'text-[#F7F5F0]/75 dark:text-[#171717]/75'
                      : 'text-[#171717]/55 dark:text-[#E8E6DF]/55'
                  }`}
                >
                  {sc.complexityTag}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[#171717]/75 dark:text-[#E8E6DF]/75 leading-relaxed">
          {activeScenario.summary}
        </p>
      </div>
    </div>
  );
};
