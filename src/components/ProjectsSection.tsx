import React, { useState } from 'react';
import { ArrowUpRight, Github, ExternalLink, CheckCircle2, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PROFILE_DATA, CaseStudyProject } from '../data/portfolioData';

interface ProjectsSectionProps {
  onSelectProject: (project: CaseStudyProject) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectProject }) => {
  const [filter, setFilter] = useState<'All' | 'Distributed Systems' | 'Mobile Architecture' | 'Applied AI / RAG' | 'Microservices'>('All');
  const prefersReducedMotion = useReducedMotion();

  const filteredProjects = PROFILE_DATA.caseStudies.filter(c => {
    if (filter === 'All') return true;
    return c.category === filter;
  });

  return (
    <section id="projects" className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Avinash-style Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[var(--muted)] font-medium uppercase mb-2">
            EXPLORE MY WORK
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[var(--foreground)] tracking-tight">
            Featured <span className="animated-text-gradient italic">Projects</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-3">
            Production Flutter mobile apps, applied AI &amp; inference systems, and resilient supporting backend architectures.
          </p>

          {/* Clean Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {(['All', 'Mobile Architecture', 'Applied AI / RAG', 'Distributed Systems', 'Microservices'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs font-medium'
                    : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {tab === 'All' ? `All (${PROFILE_DATA.caseStudies.length})` : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Dual-Column Project Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                delay: prefersReducedMotion ? 0 : (index % 2) * 0.08,
                ease: 'easeOut'
              }}
            >
              {/* Top Meta & Action Row */}
              <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 min-w-0">
                  {project.icon && (
                    <img
                      src={project.icon}
                      alt={`${project.title} app icon`}
                      className="w-11 h-11 rounded-xl object-cover border border-[var(--border)] shrink-0 shadow-2xs"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                      {project.category}
                    </span>
                    <div className="text-xs text-[var(--muted)] font-medium truncate mt-0.5 max-w-[180px] sm:max-w-xs">
                      {project.role}
                    </div>
                  </div>
                </div>

                {/* Streamlined Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] flex items-center gap-1.5 transition-all shadow-2xs"
                      title="View Source Code"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Full-Width Project Title */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-serif font-normal text-[var(--foreground)] leading-snug [text-wrap:balance] break-words">
                  {project.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--muted)] mt-4 leading-relaxed">
                {project.problemStatement}
              </p>

              {/* Key Highlights / Bullets */}
              <div className="mt-4 space-y-2">
                <div className="text-xs sm:text-sm text-[var(--foreground)]/90 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Architecture:</strong> {project.architecturePattern}</span>
                </div>
                {project.benchmarkedMetrics.map((b) => (
                  <div key={b.metric} className="text-xs sm:text-sm text-[var(--foreground)]/90 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>{b.metric}:</strong> {b.impact} {b.baselineComparison ? `(${b.baselineComparison})` : ''}</span>
                  </div>
                ))}
              </div>

              {/* Production Store Links if published */}
              {(project.links.appStore || project.links.googlePlay || project.links.ruStore) && (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="text-[11px] font-medium text-[var(--muted)]">Stores:</span>
                  {project.links.appStore && (
                    <a href={project.links.appStore} target="_blank" rel="noreferrer" className="text-[var(--foreground)] font-medium hover:underline flex items-center gap-1">
                      <span>App Store</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {project.links.googlePlay && (
                    <a href={project.links.googlePlay} target="_blank" rel="noreferrer" className="text-[var(--foreground)] font-medium hover:underline flex items-center gap-1">
                      <span>Google Play</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {project.links.ruStore && (
                    <a href={project.links.ruStore} target="_blank" rel="noreferrer" className="text-[var(--foreground)] font-medium hover:underline flex items-center gap-1">
                      <span>RuStore</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                </div>
              )}

              {/* Screenshots Gallery Strip or Banner (if available) */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div 
                  onClick={() => onSelectProject(project)}
                  className="mt-4 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)] transition-all cursor-pointer group/screens"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2.5 px-0.5">
                    <span className="font-medium text-[var(--foreground)]">
                      {project.category === 'Mobile Architecture' ? 'Mobile Screens' : 'System Screens'} ({project.screenshots.length})
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 group-hover/screens:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px] font-medium">
                      <span>Inspect Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>

                  <div className={`grid gap-2 ${
                    project.category === 'Mobile Architecture'
                      ? (project.screenshots.length === 3 ? 'grid-cols-3 max-w-[280px]' : 'grid-cols-5')
                      : (project.screenshots.length === 4 ? 'grid-cols-4' : 'grid-cols-3')
                  }`}>
                    {project.screenshots.map((s, idx) => (
                      <div 
                        key={idx} 
                        className={`${
                          project.category === 'Mobile Architecture' ? 'aspect-[9/16]' : 'aspect-[16/10]'
                        } rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-[var(--border)] relative`}
                      >
                        <img
                          src={s.url}
                          alt={s.caption || `Screen ${idx + 1}`}
                          className="w-full h-full object-cover group-hover/screens:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Tags */}
              <div className="mt-4 pt-3 border-t border-[var(--border)] flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
