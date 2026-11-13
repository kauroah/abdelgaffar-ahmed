import React, { useEffect, useRef } from 'react';

export type VoidSphereState = 'idle' | 'user' | 'thinking' | 'assistant' | 'barge-in';

interface VoidParticleSphereProps {
  isSpeaking?: boolean;
  speakerState?: VoidSphereState;
  /** Optional real-time normalized audio energy (0..1) from Web Audio AnalyserNode */
  externalEnergyRef?: React.MutableRefObject<number>;
  intensity?: number;
  className?: string;
  onAudioEnergy?: (energy: number) => void;
}

interface Particle3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  theta: number;
  phi: number;
  radiusOffset: number;
  speedMultiplier: number;
  noiseSeed: number;
}

export const VoidParticleSphere: React.FC<VoidParticleSphereProps> = ({
  isSpeaking = false,
  speakerState = 'idle',
  externalEnergyRef,
  intensity = 1.0,
  className = '',
  onAudioEnergy,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle3D[]>([]);

  // Keep latest props in refs so animation loop doesn't recreate on state transitions
  const statePropsRef = useRef({
    isSpeaking,
    speakerState,
    intensity,
    onAudioEnergy,
  });
  statePropsRef.current = { isSpeaking, speakerState, intensity, onAudioEnergy };

  const voiceStateRef = useRef({
    currentEnergy: 0.2,
    targetEnergy: 0.2,
    speechTimer: 0,
    burstDuration: 1.2,
    isSyllableActive: true,
    vocalTractFreq: 3.6,
    bargePulse: 0,
    prevSpeakerState: 'idle' as VoidSphereState,
  });

  useEffect(() => {
    // Generate 1,800 particles distributed evenly on a unit sphere via Fibonacci lattice
    const particleCount = 1800;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const particles: Particle3D[] = [];

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const phi = Math.acos(Math.max(-1, Math.min(1, y)));

      particles.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        theta,
        phi,
        radiusOffset: 0.94 + Math.random() * 0.12,
        speedMultiplier: 0.85 + Math.random() * 0.3,
        noiseSeed: Math.random() * 100,
      });
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);

    let lastTime = performance.now();
    let rotY = 0;
    let rotX = 0.16;
    let speechClock = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (!canvas || !ctx || width === 0 || height === 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const {
        isSpeaking: activeSpeak,
        speakerState: role,
        intensity: currentIntensity,
        onAudioEnergy: reportEnergy,
      } = statePropsRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const vs = voiceStateRef.current;
      speechClock += dt;

      // Trigger crisp shock-contraction when entering barge-in state
      if (role === 'barge-in' && vs.prevSpeakerState !== 'barge-in') {
        vs.bargePulse = 1.0;
      }
      vs.prevSpeakerState = role;
      vs.bargePulse = Math.max(0, vs.bargePulse - dt * 2.8);

      // Use real Web Audio FFT energy when available (> 0.02), otherwise run natural speech cadence
      const liveExternalEnergy = externalEnergyRef?.current ?? 0;

      if (role === 'thinking') {
        // Coherent rhythmic pulse while orchestrating tools
        vs.targetEnergy = 0.28 + Math.sin(speechClock * 6.5) * 0.08;
      } else if (liveExternalEnergy > 0.015) {
        vs.targetEnergy = Math.min(1.0, liveExternalEnergy * 1.35 * currentIntensity);
      } else if (activeSpeak || role === 'user' || role === 'assistant' || role === 'barge-in') {
        vs.speechTimer += dt;
        if (vs.speechTimer > vs.burstDuration) {
          vs.speechTimer = 0;
          if (vs.isSyllableActive) {
            vs.isSyllableActive = false;
            vs.burstDuration = 0.18 + Math.random() * 0.25;
            vs.targetEnergy = 0.18 + Math.random() * 0.08;
          } else {
            vs.isSyllableActive = true;
            vs.burstDuration = 1.3 + Math.random() * 1.9;
            vs.vocalTractFreq = role === 'user' ? 3.1 + Math.random() * 1.1 : 3.8 + Math.random() * 1.4;
          }
        }

        if (vs.isSyllableActive) {
          const syllableWave = Math.sin(speechClock * vs.vocalTractFreq * Math.PI * 2);
          const emphasisWave = Math.sin(speechClock * 1.4);
          const formantJitter = (Math.sin(speechClock * 22.0) + Math.cos(speechClock * 15.0)) * 0.08;
          const baseBias = role === 'user' ? 0.44 : 0.56;
          const rawEnergy = baseBias + 0.34 * syllableWave * (0.65 + 0.35 * emphasisWave) + formantJitter;
          vs.targetEnergy = Math.max(0.2, Math.min(1.0, rawEnergy * currentIntensity));
        }
      } else {
        // Idle gentle breath
        const breath = Math.sin(speechClock * 1.15) * 0.5 + 0.5;
        vs.targetEnergy = (0.12 + breath * 0.07) * currentIntensity;
      }

      vs.currentEnergy += (vs.targetEnergy - vs.currentEnergy) * Math.min(1, dt * 14.0);
      const voiceEnergy = vs.currentEnergy;

      if (reportEnergy) {
        reportEnergy(voiceEnergy);
      }

      // Role-specific rotational dynamics
      const roleSpeedBoost = role === 'thinking' ? 0.55 : role === 'assistant' ? 0.22 : 0.14;
      const rotSpeedY = prefersReducedMotion ? 0.03 : roleSpeedBoost + voiceEnergy * 0.14;
      rotY += dt * rotSpeedY;
      rotX = 0.18 + Math.sin(speechClock * 0.45) * 0.08;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Role-specific sphere scale: user listening contracts slightly; assistant expands outward; barge-in compresses sharply
      let radiusScale = 1.0;
      if (role === 'user') radiusScale = 0.94 + voiceEnergy * 0.05;
      else if (role === 'thinking') radiusScale = 0.88;
      else if (role === 'assistant') radiusScale = 1.0 + voiceEnergy * 0.1;
      else if (role === 'barge-in') radiusScale = 0.9 - vs.bargePulse * 0.12;

      const baseRadius = Math.min(width, height) * 0.315 * radiusScale;
      const cx = width / 2;
      const cy = height / 2;
      const fov = 600;

      const particles = particlesRef.current;
      const projectedList: Array<{
        x2d: number;
        y2d: number;
        z: number;
        size: number;
        alpha: number;
        brightness: number;
      }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let deformation = 0;
        if (role === 'thinking') {
          // Orbital equatorial compression wave during tool calls
          const equatorBand = Math.exp(-Math.pow((p.phi - Math.PI / 2) * 2.2, 2));
          deformation = Math.sin(p.theta * 4.0 - speechClock * 7.0) * 0.18 * (0.4 + equatorBand);
        } else {
          const longitudinal = Math.sin(p.phi * 4.0 - speechClock * 4.6 + p.noiseSeed);
          const azimuthal = Math.cos(p.theta * 3.0 + speechClock * 3.9);
          const turbulence = Math.sin(p.theta * 7.0 - p.phi * 5.0 + speechClock * 8.5) * 0.48;
          const amplitudeFactor = role === 'user' ? 0.28 : 0.42;
          deformation = (longitudinal * 0.5 + azimuthal * 0.35 + turbulence * 0.25) * voiceEnergy * amplitudeFactor;
        }

        const currentR = baseRadius * p.radiusOffset * (1.0 + deformation);

        const px = p.baseX * currentR;
        const py = p.baseY * currentR;
        const pz = p.baseZ * currentR;

        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;

        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const depth = fov + z2;
        if (depth <= 10) continue;

        const k = fov / depth;
        const x2d = cx + x1 * k;
        const y2d = cy + y2 * k;

        const normZ = z2 / Math.max(1, baseRadius);
        const depthFactor = (normZ + 1.2) / 2.2;
        const brightness = Math.max(0.15, Math.min(1.0, depthFactor));

        const speechGlow = voiceEnergy > 0.35 ? (voiceEnergy - 0.35) * 0.38 : 0;
        const alpha = Math.max(0.12, Math.min(0.98, 0.2 + brightness * 0.74 + speechGlow));
        const size = Math.max(0.7, 0.82 + brightness * 1.38 + voiceEnergy * 0.28);

        projectedList.push({ x2d, y2d, z: z2, size, alpha, brightness });
      }

      projectedList.sort((a, b) => a.z - b.z);

      // Restrained monochromatic / tonal differentiation per speaker role
      const isUserRole = role === 'user' || role === 'barge-in';
      for (let i = 0; i < projectedList.length; i++) {
        const pt = projectedList[i];
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.size, 0, Math.PI * 2);

        if (isUserRole) {
          // Ahmed (User): crisp cool slate-silver luminance
          if (pt.brightness > 0.72) {
            ctx.fillStyle = `rgba(216, 232, 255, ${pt.alpha})`;
          } else if (pt.brightness > 0.45) {
            ctx.fillStyle = `rgba(176, 204, 240, ${pt.alpha * 0.82})`;
          } else {
            ctx.fillStyle = `rgba(135, 165, 205, ${pt.alpha * 0.5})`;
          }
        } else {
          // VOID (Assistant / Idle / Tool Orchestration): pure luminous white
          if (pt.brightness > 0.75) {
            ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha})`;
          } else if (pt.brightness > 0.45) {
            ctx.fillStyle = `rgba(240, 243, 250, ${pt.alpha * 0.85})`;
          } else {
            ctx.fillStyle = `rgba(200, 210, 225, ${pt.alpha * 0.55})`;
          }
        }
        ctx.fill();
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [externalEnergyRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
