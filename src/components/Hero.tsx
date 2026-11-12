import React from 'react';
import { Award, FileText, Github, MapPin, Send } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import { Logo } from './Logo';

interface HeroProps {
  onOpenCvStudio: () => void;
  onSelectBadge: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCvStudio }) => {
  return (
    <section id="home" className="relative border-b border-[var(--border)] bg-[var(--background)] pb-14 pt-3 md:pb-24 md:pt-4">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="mb-8 flex items-center justify-between border-b border-[var(--border)] py-2.5 sm:mb-12 sm:py-3">
          <Logo size="md" showLabel />
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] sm:text-xs">Available for opportunities</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="hero-enter hero-enter-1 mb-3 text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              AI &amp; Flutter Developer
            </p>

            <h1 className="hero-enter hero-enter-2 mb-6 text-4xl font-normal leading-[1.1] tracking-tight text-[var(--foreground)] [text-wrap:balance] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              Building intelligent products and{' '}
              <span className="animated-text-gradient font-serif text-5xl italic sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl">
                Flutter apps
              </span>
            </h1>

            <p className="hero-enter hero-enter-3 mb-8 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg lg:text-xl">
              Hi, I&apos;m <strong className="font-medium text-[var(--foreground)]">Ahmed Abdelgaffar</strong>. I build AI-powered applications and cross-platform Flutter products—from local-first intelligence to mobile apps shipped to real users.
            </p>

            <div className="hero-enter hero-enter-4 mb-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#void"
                className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 dark:bg-white dark:text-neutral-900"
              >
                AI projects
              </a>
              <a
                href="#case-founders-mobile"
                className="rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-6 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--surface-hover)]"
              >
                Flutter apps
              </a>
              <button
                onClick={onOpenCvStudio}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-6 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--surface-hover)]"
              >
                <FileText className="h-4 w-4" />
                <span>Resume / CV</span>
              </button>
              <a href="#contact" className="px-4 py-2.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                Contact Me
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[var(--muted)]">
              <a href={PROFILE_DATA.contact.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
              <a href={PROFILE_DATA.contact.telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
                <Send className="h-3.5 w-3.5 text-sky-500" />
                <span>Telegram</span>
              </a>
              <a href={PROFILE_DATA.contact.credlyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
                <Award className="h-3.5 w-3.5 text-emerald-500" />
                <span>Credly (6 Badges)</span>
              </a>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--muted)]" />
                <span>{PROFILE_DATA.location}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <div className="hero-enter hero-enter-3 motion-card w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-md transition-all hover:shadow-lg sm:p-8 lg:max-w-none">
              <div className="mb-5 flex items-center gap-4 border-b border-[var(--border)] pb-5">
                <div className="h-18 w-18 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)] sm:h-20 sm:w-20">
                  <img
                    src={PROFILE_DATA.photoUrl}
                    alt="Ahmed Abdelgaffar portrait"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-normal text-[var(--foreground)] sm:text-2xl">Ahmed Abdelgaffar</h3>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">Software Engineer</p>
                  <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">{PROFILE_DATA.contact.email}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[var(--foreground)]">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                  <span className="font-medium text-[var(--foreground)]">Master&apos;s (2026–2028):</span>
                  <div className="mt-0.5 leading-relaxed text-[var(--muted)]">RTU MIREA · Information Systems Architecture</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                  <span className="font-medium text-[var(--foreground)]">Bachelor&apos;s (2022–2026):</span>
                  <div className="mt-0.5 leading-relaxed text-[var(--muted)]">Kazan Federal Univ · Software Engineering (ITIS)</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
                <span>Core: Java · Next.js · Flutter</span>
                <a href="#about" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">More About Me →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
