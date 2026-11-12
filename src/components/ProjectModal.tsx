import React, { useState, useEffect } from 'react';
import { X, Github, ExternalLink, CheckCircle2, ChevronLeft, ChevronRight, Smartphone, Monitor, FileText } from 'lucide-react';
import { CaseStudyProject } from '../data/portfolioData';

interface ProjectModalProps {
  project: CaseStudyProject | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState<number>(0);

  useEffect(() => {
    setActiveScreenshotIndex(0);
  }, [project?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (project?.screenshots && project.screenshots.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveScreenshotIndex((prev) => (prev > 0 ? prev - 1 : project.screenshots!.length - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveScreenshotIndex((prev) => (prev < project.screenshots!.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, project?.screenshots]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl lg:max-w-3xl bg-[var(--card-bg)] text-[var(--foreground)] rounded-3xl border border-[var(--border)] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project modal"
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Optional App Icon */}
        <div className="flex items-start gap-4 mb-4 pr-8">
          {project.icon && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-1 shrink-0 shadow-xs">
              <img
                src={project.icon}
                alt={`${project.title} icon`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs text-[var(--muted)] mb-1">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{project.category}</span>
              <span> · </span>
              <span>{project.role}</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-normal text-[var(--foreground)] leading-snug break-words">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Interactive App Screen Showcase */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium flex items-center gap-2">
                {project.category === 'Mobile Architecture' ? (
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                ) : (
                  <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span>
                  {project.category === 'Mobile Architecture' ? 'Production Mobile Screens' : 'System Architecture & Telemetry Screens'}
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                {activeScreenshotIndex + 1} / {project.screenshots.length}
              </span>
            </div>

            {/* Main Active Screen Display */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900/60 border border-[var(--border)] flex items-center justify-center p-3 sm:p-5 min-h-[320px] max-h-[440px]">
              <img
                src={project.screenshots[activeScreenshotIndex].url}
                alt={project.screenshots[activeScreenshotIndex].caption || 'Screen'}
                className="max-h-[380px] w-auto max-w-full object-contain rounded-xl shadow-xl transition-all duration-200"
              />

              {/* Previous & Next Navigation Buttons */}
              {project.screenshots.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveScreenshotIndex((prev) => (prev > 0 ? prev - 1 : project.screenshots!.length - 1))}
                    className="absolute left-3 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white transition-all backdrop-blur-xs cursor-pointer shadow-md"
                    aria-label="Previous screen"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveScreenshotIndex((prev) => (prev < project.screenshots!.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white transition-all backdrop-blur-xs cursor-pointer shadow-md"
                    aria-label="Next screen"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            {project.screenshots[activeScreenshotIndex].caption && (
              <div className="text-center text-xs font-medium text-[var(--foreground)] mt-3">
                {project.screenshots[activeScreenshotIndex].caption}
              </div>
            )}

            {/* Thumbnail Navigation Strip (only if multiple screens) */}
            {project.screenshots.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3.5 overflow-x-auto py-1">
                {project.screenshots.map((s, idx) => (
                  <button
                    key={s.url}
                    onClick={() => setActiveScreenshotIndex(idx)}
                    className={`${
                      project.category === 'Mobile Architecture' ? 'w-12 h-20' : 'w-24 h-14'
                    } rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeScreenshotIndex === idx
                        ? 'border-neutral-900 dark:border-white scale-105 shadow-md ring-2 ring-indigo-500/20'
                        : 'border-[var(--border)] opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`Jump to screen ${idx + 1}`}
                  >
                    <img src={s.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Architecture Pattern Spec */}
        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-5 text-xs">
          <div className="text-[11px] uppercase tracking-wider text-[var(--muted)] mb-0.5">
            Architecture & Pattern
          </div>
          <div className="font-medium text-[var(--foreground)] text-sm">
            {project.architecturePattern}
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-2">
            Performance Highlights
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {project.benchmarkedMetrics.map((b) => (
              <div key={b.metric} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-lg font-serif font-normal text-emerald-600 dark:text-emerald-400">
                  {b.impact}
                </div>
                <div className="text-xs font-medium text-[var(--foreground)] mt-0.5">
                  {b.metric}
                </div>
                {b.baselineComparison && (
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    {b.baselineComparison}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1.5">
            Overview & Problem Statement
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            {project.problemStatement}
          </p>
        </div>

        {/* Key Decisions */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-2">
            Key Architectural Decisions
          </div>
          <div className="space-y-2">
            {project.systemDecisions.map((decision, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--foreground)]/90 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{decision}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="pt-4 border-t border-[var(--border)] mb-6">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-2">
            Technologies Used
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links & App Store Verification */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[var(--border)] text-xs">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full hover:opacity-90 transition-all shadow-xs"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source Code</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {project.links.gitlab && (
            <a
              href={project.links.gitlab}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-all shadow-xs"
            >
              <span>GitLab Repo</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {project.links.thesisPdf && (
            <a
              href={project.links.thesisPdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium rounded-full border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:opacity-90 transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Bachelor Thesis (PDF)</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {project.links.pitchDeckPdf && (
            <a
              href={project.links.pitchDeckPdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium rounded-full border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:opacity-90 transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Pitch Deck (PDF)</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {project.links.specPdf && (
            <a
              href={project.links.specPdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:opacity-90 transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Technical Spec (PDF)</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {project.links.appStore && (
            <a
              href={project.links.appStore}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-all shadow-xs"
            >
              <span>App Store</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {project.links.googlePlay && (
            <a
              href={project.links.googlePlay}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-all shadow-xs"
            >
              <span>Google Play</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {project.links.ruStore && (
            <a
              href={project.links.ruStore}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-all shadow-xs"
            >
              <span>RuStore</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-full transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
