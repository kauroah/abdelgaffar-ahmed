import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Clean Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[var(--muted)] font-medium uppercase mb-2">
            WORK HISTORY
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[var(--foreground)] tracking-tight">
            Engineering <span className="animated-text-gradient italic">Experience</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-3">
            Commercial and engineering roles with measurable technical results.
          </p>
        </div>

        {/* Experience List */}
        <div className="space-y-6">
          {PROFILE_DATA.experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-[var(--foreground)] tracking-wide">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {exp.company}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                {exp.summary}
              </p>

              {/* Achievements */}
              <div className="space-y-2 mb-5">
                {exp.achievements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--foreground)]/90 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-[var(--muted)] mr-1">
                  Stack:
                </span>
                {exp.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
