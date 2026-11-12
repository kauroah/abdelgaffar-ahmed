import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Radio, Check } from 'lucide-react';
import { VoidParticleSphere } from './VoidParticleSphere';

interface VoidVideoPlayerProps {
  recordingUrl?: string;
  posterUrl: string;
  captionsUrl?: string;
  title?: string;
}

export const VoidVideoPlayer: React.FC<VoidVideoPlayerProps> = ({
  recordingUrl,
  captionsUrl,
  title = "Watch VOID in action"
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechIntervalRef = useRef<number | null>(null);

  // Default duration is 88 seconds (1:28) matching the reference UI
  const DEFAULT_DURATION = 88;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [audioEnergy, setAudioEnergy] = useState(0.3);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Voice assistant mock conversational utterances for the 1:28 timeline
  const CAPTIONS_SCRIPT = [
    { start: 0, end: 5, text: "VOID: Ready. Full-duplex audio stream connected at 48kHz." },
    { start: 5.5, end: 11, text: "User: Analyze the distributed message queue throughput and alert on consumer lag." },
    { start: 11.5, end: 19, text: "VOID: Orchestrator active. Ingress telemetry indicates 14,200 msg/sec with zero partition lag across 6 brokers." },
    { start: 20, end: 26, text: "User: Can you simulate a node partition on worker 03 and re-route traffic?" },
    { start: 27, end: 35, text: "VOID: Simulating partition on worker 03. Traffic seamlessly rebalanced to pool B in 12ms with zero dropped frames." },
    { start: 36, end: 44, text: "User: Show me memory residency and heap allocation." },
    { start: 45, end: 54, text: "VOID: Total heap stable at 412MB. Garbage collector cycles running under 4ms latency." },
    { start: 55, end: 68, text: "User: Keep monitor active on telemetry channel and alert on breach." },
    { start: 69, end: 88, text: "VOID: Telemetry watchdog armed. Continuous background listening active." }
  ];

  // Update caption based on currentTime
  useEffect(() => {
    if (!captionsEnabled) {
      setActiveCaption(null);
      return;
    }
    const match = CAPTIONS_SCRIPT.find(c => currentTime >= c.start && currentTime <= c.end);
    setActiveCaption(match ? match.text : null);
  }, [currentTime, captionsEnabled]);

  // Audio synthesis helper for organic sound generation when playing
  const playSpeechTone = useCallback((frequency: number, durationSec: number) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.85, ctx.currentTime + durationSec);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // AudioContext unavailable or restricted
    }
  }, [isMuted]);

  // Handle Play/Pause
  const togglePlay = useCallback(() => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    setHasStarted(true);

    if (videoRef.current) {
      if (nextPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }

    if (nextPlaying) {
      // Play brief ambient connection tone
      playSpeechTone(440, 0.4);
    }
  }, [isPlaying, playSpeechTone]);

  // Timer loop for synchronized progress scrubber
  useEffect(() => {
    let animId: number;
    let lastTs = performance.now();

    const loop = (ts: number) => {
      const delta = (ts - lastTs) / 1000;
      lastTs = ts;

      if (isPlaying) {
        setCurrentTime(prev => {
          const next = prev + delta;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        // Trigger periodic subtle speech harmonic tones during speech segments
        if (Math.random() < 0.04) {
          const tones = [320, 380, 440, 520, 580];
          const tone = tones[Math.floor(Math.random() * tones.length)];
          playSpeechTone(tone, 0.2);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, duration, playSpeechTone]);

  // Handle scrubber click or drag
  const handleScrubberInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Format seconds to m:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Fullscreen toggle
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

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'm') {
      e.preventDefault();
      setIsMuted(prev => !prev);
    } else if (e.key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full aspect-[16/9] bg-[#0A0A0A] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none group flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      aria-label="VOID Voice Assistant Interactive Sphere and Video Player. Press Space to play/pause, M to mute, F for fullscreen."
    >
      {/* Hidden real video element if video exists to support native sync */}
      {recordingUrl && (
        <video
          ref={videoRef}
          src={recordingUrl}
          preload="none"
          playsInline
          muted={isMuted}
          className="hidden"
          onLoadedMetadata={(e) => {
            const vid = e.currentTarget;
            if (vid.duration && !isNaN(vid.duration) && isFinite(vid.duration)) {
              setDuration(vid.duration);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* TOP HEADER BAR (Directly matching the screenshot) */}
      <div className="relative z-20 flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-7">
        {/* Left: VOID */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-base sm:text-lg tracking-wider text-white">
            VOID
          </span>
          {/* Subtle live indicator */}
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
        </div>

        {/* Right: VOICE ASSISTANT */}
        <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-white/80">
          VOICE ASSISTANT
        </div>
      </div>

      {/* 
        CENTER AREA: 
        1. Live 3D Particle Sphere with vocal speech wave modulation 
        2. Central Circular Play Button with audio reactive ring 
        3. "Watch VOID in action" & "DEMO PREVIEW" text labels
      */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        {/* The 3D Canvas Particle Sphere */}
        <div className="absolute inset-0 w-full h-full">
          <VoidParticleSphere
            isSpeaking={isPlaying}
            intensity={isPlaying ? 1.0 : 0.4}
            onAudioEnergy={setAudioEnergy}
          />
        </div>

        {/* Center Circular Play Button Overlay */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto">
          <button
            onClick={togglePlay}
            className="group/btn relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full border border-white text-white transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer bg-black/20 backdrop-blur-[2px]"
            aria-label={isPlaying ? "Pause VOID voice demo" : "Play VOID voice demonstration"}
          >
            {/* Audio reactive outer ring that expands with vocal speech energy */}
            <span
              className="absolute inset-[-4px] rounded-full border border-white/30 transition-transform duration-75 pointer-events-none"
              style={{
                transform: `scale(${1 + audioEnergy * 0.16})`,
                opacity: 0.35 + audioEnergy * 0.55
              }}
            />

            {/* Play or Pause Icon */}
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
            ) : (
              <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white translate-x-0.5" />
            )}
          </button>

          {/* Under-Sphere Labels: "Watch VOID in action" & "DEMO PREVIEW" */}
          <div className="mt-4 sm:mt-5 flex flex-col items-center text-center px-4">
            <span className="text-sm sm:text-base lg:text-lg font-medium text-white tracking-tight">
              {title}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-white/60 mt-1">
              DEMO PREVIEW
            </span>
          </div>
        </div>

        {/* Live Closed Captions Display */}
        {captionsEnabled && activeCaption && (
          <div className="absolute bottom-16 sm:bottom-20 z-30 max-w-xl px-4 text-center pointer-events-none transition-all duration-200">
            <div className="inline-block px-3.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-white font-mono leading-relaxed shadow-lg">
              {activeCaption}
            </div>
          </div>
        )}
      </div>

      {/* 
        BOTTOM CONTROL BAR (Directly matching the screenshot layout)
        [ ▶ ]  0:00 / 1:28  ───⚪───────────  [CC]  🔊
      */}
      <div 
        className="relative z-20 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 pb-4 sm:pb-6 text-white text-xs select-none"
        role="region"
        aria-label="Playback controls"
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1 rounded hover:bg-white/10 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          )}
        </button>

        {/* Time Counter (e.g. 0:00 / 1:28) */}
        <div className="font-mono text-[11px] sm:text-xs text-white/90 tabular-nums whitespace-nowrap min-w-[70px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Interactive Scrubber Bar with round knob */}
        <div
          ref={progressBarRef}
          onClick={handleScrubberInteraction}
          className="relative flex-1 h-6 flex items-center cursor-pointer group/scrubber"
          role="slider"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-label="Timeline position"
        >
          {/* Background track */}
          <div className="w-full h-[2px] sm:h-[3px] bg-white/20 rounded-full overflow-hidden">
            {/* Active progress track */}
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* White Circular Thumb Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full shadow-md pointer-events-none group-hover/scrubber:scale-125 transition-transform duration-100"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Right Controls: [CC] and Volume */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Closed Captions [CC] Button */}
          <button
            onClick={() => setCaptionsEnabled(prev => !prev)}
            className={`px-1.5 py-0.5 rounded border text-[10px] font-mono tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer ${
              captionsEnabled 
                ? 'border-white text-white bg-white/20 font-bold' 
                : 'border-white/40 text-white/60 hover:text-white hover:border-white/80'
            }`}
            aria-label={captionsEnabled ? "Disable closed captions" : "Enable closed captions"}
            title="Closed captions"
          >
            CC
          </button>

          {/* Volume / Mute Button */}
          <button
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              if (!nextMuted) {
                playSpeechTone(440, 0.2);
              }
            }}
            className="p-1 rounded hover:bg-white/10 active:scale-95 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/50" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded hover:bg-white/10 active:scale-95 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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
  );
};
