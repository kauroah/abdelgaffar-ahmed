import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ExternalLink, Github } from 'lucide-react';
import { CaseStudyProject, PROFILE_DATA } from '../data/portfolioData';

interface ProjectsSectionProps {
  onSelectProject: (project: CaseStudyProject) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectProject }) => {
  const [filter, setFilter] = useState<'All' | 'Distributed Systems' | 'Mobile Architecture' | 'Applied AI / RAG' | 'Microservices'>('All');

  const filteredProjects = PROFILE_DATA.caseStudies
    .filter(project => filter === 'All' || project.category === filter)
    .sort((a, b) => {
      const priority = (category: string) => {
        if (category === 'Applied AI / RAG') return 0;
        if (category === 'Mobile Architecture') return 1;
        return 2;
      };
      return priority(a.category) - priority(b.category);
    });

  return (
    <section id="projects" className="border-t border-[var(--border)] bg-[var(--background)] pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
            EXPLORE MY WORK
          </p>
          <h2 className="text-4xl font-normal tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Featured <span className="animated-text-gradient font-serif italic">Projects</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted)] sm:text-base lg:text-lg">
            A selection of production-ready systems, distributed backends, and mobile applications I&apos;ve built.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {(['All', 'Distributed Systems', 'Mobile Architecture', 'Applied AI / RAG', 'Microservices'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs transition-all ${
                  filter === tab
                    ? 'border-transparent bg-neutral-900 font-medium text-white shadow-xs dark:bg-white dark:text-neutral-900'
                    : 'border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                }`}
              >
                {tab === 'All' ? `All (${PROFILE_DATA.caseStudies.length})` : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {filteredProjects.map(project => (
            <article
              key={project.id}
              id={project.id}
              className="motion-card group flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm transition-all hover:shadow-md sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    {project.icon && (
                      <img
                        src={project.icon}
                        alt={`${project.title} app icon`}
                        className="h-11 w-11 shrink-0 rounded-xl border border-[var(--border)] object-cover shadow-2xs"
                      />
                    )}
                    <div className="min-w-0">
                      <span className="inline-block rounded-full border border-indigo-200/50 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:border-indigo-800/40 dark:bg-indigo-950/50 dark:text-indigo-400">
                        {project.category}
                      </span>
                      <div className="mt-0.5 max-w-[180px] truncate text-xs font-medium text-[var(--muted)] sm:max-w-xs">
                        {project.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-2xs transition-all hover:bg-[var(--surface-hover)]"
                        title="View Source Code"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs transition-all hover:opacity-90 dark:bg-white dark:text-neutral-900"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 break-words font-serif text-xl font-normal leading-snug text-[var(--foreground)] [text-wrap:balance] sm:text-2xl">
                  {project.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  {project.problemStatement}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-[var(--foreground)]/90 sm:text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span><strong>Architecture:</strong> {project.architecturePattern}</span>
                  </div>
                  {project.benchmarkedMetrics.map(metric => (
                    <div key={metric.metric} className="flex items-start gap-2 text-xs text-[var(--foreground)]/90 sm:text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>{metric.metric}:</strong> {metric.impact}
                        {metric.baselineComparison ? ` (${metric.baselineComparison})` : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {(project.links.appStore || project.links.googlePlay || project.links.ruStore) && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="text-[11px] font-medium text-[var(--muted)]">Stores:</span>
                    {project.links.appStore && (
                      <a href={project.links.appStore} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-[var(--foreground)] hover:underline">
                        <span>App Store</span><ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    )}
                    {project.links.googlePlay && (
                      <a href={project.links.googlePlay} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-[var(--foreground)] hover:underline">
                        <span>Google Play</span><ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    )}
                    {project.links.ruStore && (
                      <a href={project.links.ruStore} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-[var(--foreground)] hover:underline">
                        <span>RuStore</span><ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    )}
                  </div>
                )}

                {project.screenshots && project.screenshots.length > 0 && (
                  <div
                    onClick={() => onSelectProject(project)}
                    className="group/screens mt-4 cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 transition-all hover:border-[var(--muted)]"
                  >
                    <div className="mb-2.5 flex items-center justify-between px-0.5 text-xs text-[var(--muted)]">
                      <span className="font-medium text-[var(--foreground)]">
                        {project.category === 'Mobile Architecture' ? 'Mobile Screens' : 'System Screens'} ({project.screenshots.length})
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 transition-transform group-hover/screens:translate-x-0.5 dark:text-indigo-400">
                        <span>Inspect Details</span><ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                    <div className={`grid gap-2 ${
                      project.category === 'Mobile Architecture'
                        ? (project.screenshots.length === 3 ? 'max-w-[280px] grid-cols-3' : 'grid-cols-5')
                        : (project.screenshots.length === 4 ? 'grid-cols-4' : 'grid-cols-3')
                    }`}>
                      {project.screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className={`${project.category === 'Mobile Architecture' ? 'aspect-[9/16]' : 'aspect-[16/10]'} relative overflow-hidden rounded-lg border border-[var(--border)] bg-neutral-200 dark:bg-neutral-800`}
                        >
                          <img
                            src={screenshot.url}
                            alt={screenshot.caption || `Screen ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/screens:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-3">
                {project.technologies.map(technology => (
                  <span key={technology} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                    {technology}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
