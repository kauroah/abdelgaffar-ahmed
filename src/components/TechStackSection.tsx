import React from 'react';
import { PROFILE_DATA } from '../data/portfolioData';

export const TechStackSection: React.FC = () => {
  return (
    <section id="skills" className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Avinash-style Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[var(--muted)] font-medium uppercase mb-2">
            SKILLS & TECHNOLOGIES
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[var(--foreground)] tracking-tight">
            Technical <span className="animated-text-gradient italic">Stack</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-3">
            The programming languages, frameworks, databases, and tools I use to build production systems.
          </p>
        </div>

        {/* Clean Categorized Grid (Expands to 4-Column on Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROFILE_DATA.techMatrix.map((matrix) => (
            <div
              key={matrix.category}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-serif font-normal text-[var(--foreground)] mb-1">
                {matrix.category}
              </h3>
              <p className="text-xs text-[var(--muted)] mb-5">
                {matrix.description}
              </p>

              <div className="space-y-3">
                {matrix.technologies.map((item) => (
                  <div key={item.name} className="pb-3 border-b border-[var(--border)] last:border-0 last:pb-0">
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {item.name}
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">
                      {item.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
