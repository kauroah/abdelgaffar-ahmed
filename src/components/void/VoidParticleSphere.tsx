import React, { useEffect, useRef } from 'react';

interface VoidParticleSphereProps {
  isSpeaking?: boolean;
  intensity?: number; // 0.0 to 1.0 multiplier
  className?: string;
  onAudioEnergy?: (energy: number) => void;
}

interface Particle3D {
  // Base spherical coordinates
  baseX: number;
  baseY: number;
  baseZ: number;
  theta: number; // azimuthal angle
  phi: number;   // polar angle
  radiusOffset: number;
  speedMultiplier: number;
  noiseSeed: number;
}

export const VoidParticleSphere: React.FC<VoidParticleSphereProps> = ({
  isSpeaking = true,
  intensity = 1.0,
  className = "",
  onAudioEnergy,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle3D[]>([]);

  // Speech cadence & voice waveform simulation state
  const voiceStateRef = useRef({
    currentEnergy: 0.25,
    targetEnergy: 0.25,
    speechTimer: 0,
    burstDuration: 1.2,
    isSyllableActive: true,
    cadencePhase: 0,
    vocalTractFreq: 3.5, // 3.5 Hz speech rate
  });

  useEffect(() => {
    // Generate ~1,800 particles distributed evenly on a unit sphere using the Fibonacci lattice
    const particleCount = 1800;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.39996323 radians
    const particles: Particle3D[] = [];

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // from 1 to -1
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

    // Handle high DPI displays and responsive resizing
    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for optimal 60fps performance
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    updateSize();
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);

    let lastTime = performance.now();
    let rotY = 0;
    let rotX = 0.15;
    let speechClock = 0;

    // Check user motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (!canvas || !ctx || width === 0 || height === 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Clear canvas with deep dark background
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Simulate natural human voice speech dynamics:
      // Voice consists of:
      // 1. Sentence / phrase bursts (1.5 - 3 seconds of talking)
      // 2. Breath pauses (300 - 500 ms)
      // 3. Syllable rhythms (3 - 5 Hz envelope variations)
      // 4. Formant micro-jitters (12 - 20 Hz high-frequency vocal flutter)
      const vs = voiceStateRef.current;
      speechClock += dt;

      if (isSpeaking) {
        // Active speaking state
        vs.speechTimer += dt;
        if (vs.speechTimer > vs.burstDuration) {
          vs.speechTimer = 0;
          // Toggle between active phrase utterance and micro-breath pause
          if (vs.isSyllableActive) {
            // Take a short breath pause
            vs.isSyllableActive = false;
            vs.burstDuration = 0.25 + Math.random() * 0.35;
            vs.targetEnergy = 0.15 + Math.random() * 0.1;
          } else {
            // Start a new speech sentence
            vs.isSyllableActive = true;
            vs.burstDuration = 1.6 + Math.random() * 2.2;
            vs.vocalTractFreq = 3.2 + Math.random() * 1.5;
          }
        }

        if (vs.isSyllableActive) {
          // Syllable oscillation (speech cadence)
          const syllableWave = Math.sin(speechClock * vs.vocalTractFreq * Math.PI * 2);
          const emphasisWave = Math.sin(speechClock * 1.2);
          const formantJitter = (Math.sin(speechClock * 24.0) + Math.cos(speechClock * 16.0)) * 0.08;

          const rawEnergy = 0.5 + 0.35 * syllableWave * (0.6 + 0.4 * emphasisWave) + formantJitter;
          vs.targetEnergy = Math.max(0.18, Math.min(1.0, rawEnergy * intensity));
        }
      } else {
        // Idle / Listening mode: gentle resting breath
        const breath = Math.sin(speechClock * 1.2) * 0.5 + 0.5;
        vs.targetEnergy = (0.12 + breath * 0.08) * intensity;
      }

      // Smooth energy lerp for organic vocal response
      vs.currentEnergy += (vs.targetEnergy - vs.currentEnergy) * (dt * 12.0);
      const voiceEnergy = vs.currentEnergy;

      if (onAudioEnergy) {
        onAudioEnergy(voiceEnergy);
      }

      // Rotational movement
      const rotSpeedY = prefersReducedMotion ? 0.04 : 0.18 + voiceEnergy * 0.12;
      const rotSpeedX = prefersReducedMotion ? 0.02 : 0.06 + voiceEnergy * 0.05;
      rotY += dt * rotSpeedY;
      rotX = 0.18 + Math.sin(speechClock * 0.5) * 0.08;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Base radius of the sphere proportional to container size
      // Reference image has the sphere occupying roughly 58% of vertical height
      const baseRadius = Math.min(width, height) * 0.32;
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

      // Process each 3D particle and apply speech modulation waves
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Complex vocal resonance waves traveling across the spherical lattice:
        // 1. Longitudinal speech wave (rippling from poles to equator)
        const longitudinal = Math.sin(p.phi * 4.0 - speechClock * 4.5 + p.noiseSeed);
        // 2. Azimuthal frequency harmonic (vocal timbre ripples)
        const azimuthal = Math.cos(p.theta * 3.0 + speechClock * 3.8);
        // 3. High-order acoustic turbulence (air expelled during consonants)
        const turbulence = Math.sin(p.theta * 7.0 - p.phi * 5.0 + speechClock * 8.0) * 0.5;

        // Combined speech deformation displacement
        const deformation = (longitudinal * 0.5 + azimuthal * 0.35 + turbulence * 0.25) * voiceEnergy;
        const currentR = baseRadius * p.radiusOffset * (1.0 + deformation * 0.38);

        // Calculate 3D position
        const px = p.baseX * currentR;
        const py = p.baseY * currentR;
        const pz = p.baseZ * currentR;

        // Rotate around Y axis
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;

        // Rotate around X axis
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // 3D perspective projection
        const depth = fov + z2;
        if (depth <= 10) continue;

        const k = fov / depth;
        const x2d = cx + x1 * k;
        const y2d = cy + y2 * k;

        // Normalized depth: z2 goes from roughly -baseRadius to +baseRadius
        const normZ = z2 / baseRadius; // ~ -1 to +1

        // Particles closer to camera (z2 > 0) are brighter, sharper, and slightly larger
        // Particles further away (z2 < 0) are fainter and smaller
        const depthFactor = (normZ + 1.2) / 2.2; // 0.1 to 1.0
        const brightness = Math.max(0.15, Math.min(1.0, depthFactor));

        // When voice is speaking intensely, frontal particles light up with subtle luminescence
        const speechGlow = voiceEnergy > 0.4 ? (voiceEnergy - 0.4) * 0.4 : 0;
        const alpha = Math.max(0.12, Math.min(0.98, (0.2 + brightness * 0.75 + speechGlow)));
        const size = Math.max(0.7, (0.8 + brightness * 1.4 + (voiceEnergy * 0.3)));

        projectedList.push({
          x2d,
          y2d,
          z: z2,
          size,
          alpha,
          brightness,
        });
      }

      // Sort particles back-to-front for proper depth layering
      projectedList.sort((a, b) => a.z - b.z);

      // Render particles
      for (let i = 0; i < projectedList.length; i++) {
        const pt = projectedList[i];
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.size, 0, Math.PI * 2);

        if (pt.brightness > 0.75) {
          // Foreground points: pure brilliant white with high opacity
          ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha})`;
        } else if (pt.brightness > 0.45) {
          // Midground points: crisp soft white
          ctx.fillStyle = `rgba(240, 243, 250, ${pt.alpha * 0.85})`;
        } else {
          // Background points: subtle atmospheric particles
          ctx.fillStyle = `rgba(200, 210, 225, ${pt.alpha * 0.55})`;
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
  }, [isSpeaking, intensity, onAudioEnergy]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
