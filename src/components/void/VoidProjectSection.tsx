import React, { useState, useRef } from 'react';
import { VOID_PROJECT_DATA } from '../../data/voidProjectData';
import { VoidVideoPlayer } from './VoidVideoPlayer';
import { VoidArchitectureDetails } from './VoidArchitectureDetails';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

export const VoidProjectSection: React.FC = () => {
  const data = VOID_PROJECT_DATA;
  const [isArchitectureExpanded, setIsArchitectureExpanded] = useState(false);
  const architectureRef = useRef<HTMLDivElement | null>(null);

  // Handle "Explore architecture ↓" click: expands details and scrolls smoothly
  const handleExploreArchitecture = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsArchitectureExpanded(true);
    setTimeout(() => {
      architectureRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }, 60);
  };

  return (
    <section 
      id="void" 
      aria-label="VOID — Real-Time Voice Assistant"
      className="w-full bg-[#F7F5F0] text-[#171717] dark:bg-[#121211] dark:text-[#E8E6DF] transition-colors duration-200 py-20 sm:py-28 lg:py-32 border-b border-[#E5E2DA] dark:border-[#242320] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Eyebrow & Large Section Headline */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#171717] dark:bg-[#E8E6DF]" />
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#171717]/60 dark:text-[#E8E6DF]/60 font-medium">
              {data.eyebrow}
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] text-[#171717] dark:text-[#E8E6DF] max-w-3xl leading-[1.08]">
            {data.headline}
          </h2>
        </div>

        {/* 
          Main Grid: Desktop ~68% video and ~32% project details with a 40px gap (gap-10)
          Mobile: Stack heading, description, video, project links and engineering details
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Video Area (Col-span 8 of 12 ~= 67-68%) */}
          <div className="order-2 lg:order-1 lg:col-span-8 w-full">
            <VoidVideoPlayer
              recordingUrl={data.recordingUrl}
              posterUrl={data.posterUrl}
              captionsUrl={data.captionsUrl}
              title="Watch VOID in action"
            />
          </div>

          {/* Project Details (Col-span 4 of 12 ~= 32-33%) */}
          <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col justify-between space-y-7">
            
            {/* Title & Subtitle */}
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#171717] dark:text-[#E8E6DF]">
                  {data.title}
                </h3>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/50 dark:text-[#E8E6DF]/50">
                  Real-Time AI
                </span>
              </div>
              <p className="text-sm font-normal text-[#171717]/60 dark:text-[#E8E6DF]/60 mt-1">
                {data.subtitle}
              </p>

              {/* Description */}
              <p className="mt-4 text-sm sm:text-base text-[#171717]/85 dark:text-[#E8E6DF]/85 leading-relaxed font-normal">
                {data.description}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="pt-5 border-t border-[#E5E2DA] dark:border-[#2C2A26] grid grid-cols-2 gap-3 text-xs">
              {data.specs.map((spec) => (
                <div key={spec.label} className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#171717]/50 dark:text-[#E8E6DF]/50 block">
                    {spec.label}
                  </span>
                  <span className="font-medium text-[#171717] dark:text-[#E8E6DF] block leading-tight">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Contribution Callout */}
            <div className="pt-5 border-t border-[#E5E2DA] dark:border-[#2C2A26]">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#171717]/50 dark:text-[#E8E6DF]/50 mb-1">
                {data.contributionLabel}
              </span>
              <p className="text-sm font-medium text-[#171717] dark:text-[#E8E6DF]">
                {data.contributionText}
              </p>
            </div>

            {/* Action Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider">
              {/* Only display source link when real repository URL is provided */}
              {data.sourceUrl && (
                <a
                  href={data.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#171717]/20 dark:border-[#E8E6DF]/20 hover:border-[#171717] dark:hover:border-[#E8E6DF] text-[#171717] dark:text-[#E8E6DF] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-[#E8E6DF] focus-visible:outline-none transition-all duration-150"
                  aria-label="View VOID source code on GitHub"
                >
                  <span>View source</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}

              {/* Explore architecture link expands details and smoothly scrolls to them */}
              <button
                onClick={handleExploreArchitecture}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#171717] text-[#F7F5F0] dark:bg-[#E8E6DF] dark:text-[#171717] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-[#E8E6DF] focus-visible:outline-none transition-all duration-150 cursor-pointer shadow-xs"
                aria-label="Explore VOID architecture details below"
              >
                <span>Explore architecture</span>
                <ArrowDown className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>

          </div>
        </div>

        {/* Engineering Details Section (Behind the interaction) */}
        <VoidArchitectureDetails
          ref={architectureRef}
          heading={data.columnsHeading}
          columns={data.columns}
          isExpanded={isArchitectureExpanded}
          onToggleExpand={() => setIsArchitectureExpanded(prev => !prev)}
          architectureSummary={data.architectureSummary}
        />

      </div>
    </section>
  );
};
