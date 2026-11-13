import React, { forwardRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { VoidEngineeringColumn } from '../../data/voidProjectData';
import { ChevronDown, ArrowRight, Mic, Cpu, Radio, ShieldAlert } from 'lucide-react';

interface VoidArchitectureDetailsProps {
  heading: string;
  columns: VoidEngineeringColumn[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  architectureSummary: {
    overview: string;
    pipelineSteps: {
      phase: string;
      role: string;
      implementationNote: string;
    }[];
    designDecisions: {
      topic: string;
      rationale: string;
    }[];
  };
}

export const VoidArchitectureDetails = forwardRef<HTMLDivElement, VoidArchitectureDetailsProps>(({
  heading,
  columns,
  isExpanded,
  onToggleExpand,
  architectureSummary
}, ref) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} id="void-architecture" className="mt-16 sm:mt-24 pt-10 border-t border-[#E5E2DA] dark:border-[#2C2A26]">
      {/* Section Subheading & Monospace Tag */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#171717]/50 dark:text-[#E8E6DF]/50 block mb-1">
            Pipeline Architecture
          </span>
          <h3 className="text-xl sm:text-2xl font-normal tracking-tight text-[#171717] dark:text-[#E8E6DF]">
            {heading}
          </h3>
        </div>
        <span className="text-xs font-mono text-[#171717]/60 dark:text-[#E8E6DF]/60">
          Full-duplex audio stream orchestration
        </span>
      </div>

      {/* 3 Numbered Columns with Vertical Dividers on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E2DA] dark:divide-[#2C2A26] border-y border-[#E5E2DA] dark:border-[#2C2A26]">
        {columns.map((col, idx) => (
          <div
            key={col.number}
            className={`py-8 md:py-6 transition-colors duration-150 ${
              idx === 0 ? 'md:pr-8' : idx === 1 ? 'md:px-8' : 'md:pl-8'
            }`}
          >
            {/* Number + Title */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xs font-mono font-medium text-[#171717]/50 dark:text-[#E8E6DF]/50">
                {col.number} —
              </span>
              <h4 className="text-base font-medium text-[#171717] dark:text-[#E8E6DF] tracking-tight">
                {col.title}
              </h4>
            </div>

            {/* Concise Summary */}
            <p className="text-sm text-[#171717]/80 dark:text-[#E8E6DF]/80 leading-relaxed font-normal">
              “{col.summary}”
            </p>

            {/* Configurable Technical Bullets */}
            <ul className="mt-4 space-y-2">
              {col.technicalPoints.map((point, pIdx) => (
                <li key={pIdx} className="text-xs text-[#171717]/70 dark:text-[#E8E6DF]/70 flex items-start gap-2.5 leading-normal">
                  <span className="w-1.5 h-1.5 rounded-xs bg-[#171717]/40 dark:bg-[#E8E6DF]/40 mt-1 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Expand Architecture Toggle Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          aria-controls="expanded-architecture-panel"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#E8E6DF] bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-[#E8E6DF] focus-visible:outline-none px-4 py-2.5 rounded-full border border-[#E5E2DA] dark:border-[#2C2A26] transition-all duration-150 cursor-pointer"
        >
          <span>{isExpanded ? "Collapse verified pipeline blueprint" : "Explore verified pipeline blueprint"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable Architecture Area */}
      <motion.div
        id="expanded-architecture-panel"
        aria-hidden={!isExpanded}
        className="overflow-hidden"
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
          marginTop: isExpanded ? 32 : 0
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: 'easeInOut' }}
        style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
      >
        <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E5E2DA] dark:border-[#2C2A26] space-y-8">
          
          {/* Architecture Overview */}
          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#171717]/60 dark:text-[#E8E6DF]/60 mb-2">
              System Architecture Blueprint
            </h5>
            <p className="text-sm text-[#171717]/85 dark:text-[#E8E6DF]/85 leading-relaxed max-w-3xl">
              {architectureSummary.overview}
            </p>
          </div>

          {/* Visual Dataflow Pipeline Diagram */}
          <div className="p-4 sm:p-5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-[#E5E2DA] dark:border-[#2C2A26]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#171717]/50 dark:text-[#E8E6DF]/50 block mb-3">
              Event-Driven Audio Pipeline Flow
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Node 1 */}
              <div className="p-3.5 rounded-lg bg-[#F7F5F0] dark:bg-[#1A1A18] border border-[#E5E2DA] dark:border-[#2C2A26] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#171717] dark:text-[#E8E6DF] mb-1">
                    <Mic className="w-3.5 h-3.5 opacity-70" />
                    <span>1. Ingress & VAD</span>
                  </div>
                  <p className="text-[11px] text-[#171717]/65 dark:text-[#E8E6DF]/65">
                    48kHz raw PCM audio capture with Voice Activity Detection boundaries.
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  Latency: &lt;40ms
                </div>
              </div>

              {/* Node 2 */}
              <div className="p-3.5 rounded-lg bg-[#F7F5F0] dark:bg-[#1A1A18] border border-[#E5E2DA] dark:border-[#2C2A26] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#171717] dark:text-[#E8E6DF] mb-1">
                    <Radio className="w-3.5 h-3.5 opacity-70" />
                    <span>2. Duplex Gateway</span>
                  </div>
                  <p className="text-[11px] text-[#171717]/65 dark:text-[#E8E6DF]/65">
                    WebSocket frame multiplexing token streams and audio synthesis.
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                  Zero-handshake stream
                </div>
              </div>

              {/* Node 3 */}
              <div className="p-3.5 rounded-lg bg-[#F7F5F0] dark:bg-[#1A1A18] border border-[#E5E2DA] dark:border-[#2C2A26] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#171717] dark:text-[#E8E6DF] mb-1">
                    <Cpu className="w-3.5 h-3.5 opacity-70" />
                    <span>3. AudioBuffer & Visualizer</span>
                  </div>
                  <p className="text-[11px] text-[#171717]/65 dark:text-[#E8E6DF]/65">
                    Progressive Web Audio playback and math-driven particle canvas.
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono text-amber-600 dark:text-amber-400">
                  Barge-in hook: instant drop
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Phases List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-[#E5E2DA] dark:border-[#2C2A26]">
            {architectureSummary.pipelineSteps.map((step) => (
              <div key={step.phase} className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#171717]/50 dark:text-[#E8E6DF]/50">
                  Phase / {step.phase}
                </span>
                <div className="text-xs font-medium text-[#171717] dark:text-[#E8E6DF]">
                  {step.role}
                </div>
                <p className="text-xs text-[#171717]/70 dark:text-[#E8E6DF]/70 leading-relaxed font-normal">
                  {step.implementationNote}
                </p>
              </div>
            ))}
          </div>

          {/* Design Decisions */}
          <div className="pt-4 border-t border-[#E5E2DA] dark:border-[#2C2A26] space-y-3">
            <h5 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#171717]/60 dark:text-[#E8E6DF]/60">
              Verified Design Decisions
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {architectureSummary.designDecisions.map((decision) => (
                <div key={decision.topic} className="text-xs space-y-1 p-3 rounded-lg bg-black/[0.015] dark:bg-white/[0.015] border border-[#E5E2DA]/60 dark:border-[#2C2A26]/60">
                  <div className="font-medium text-[#171717] dark:text-[#E8E6DF] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{decision.topic}</span>
                  </div>
                  <p className="text-[#171717]/75 dark:text-[#E8E6DF]/75 leading-relaxed pl-5">
                    {decision.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
});

VoidArchitectureDetails.displayName = "VoidArchitectureDetails";
