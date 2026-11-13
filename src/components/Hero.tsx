import React from 'react';
import { ArrowRight, FileText, Github, Send, ExternalLink, Award, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PROFILE_DATA } from '../data/portfolioData';
import { Logo } from './Logo';

interface HeroProps {
  onOpenCvStudio: () => void;
  onSelectBadge: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCvStudio }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="home" className="relative pt-3 pb-14 md:pt-4 md:pb-24 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Sleek, Compact Top Brand Header */}
        <div className="flex items-center justify-between py-2.5 sm:py-3 mb-8 md:mb-12 border-b border-[var(--border)]">
          <Logo size="md" showLabel={true} />
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] sm:text-xs">Available for opportunities</span>
          </div>
        </div>

        {/* Main 2-Column Intro Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Headline & Bio */}
          <motion.div
            className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium mb-3">
              Flutter &amp; Applied AI Engineer
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-[var(--foreground)] leading-[1.1] mb-6 [text-wrap:balance]">
              Building intelligent products with{' '}
              <span className="font-serif italic animated-text-gradient text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl">
                Flutter &amp; Applied AI
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
              Hi, I'm <strong className="text-[var(--foreground)] font-medium">Ahmed Abdelgaffar</strong>. I specialize in shipping production <strong className="text-[var(--foreground)] font-medium">Flutter</strong> mobile apps (App Store, Google Play &amp; RuStore) and <strong className="text-[var(--foreground)] font-medium">Applied AI</strong> systems—from real-time voice agents and ONNX medical inference to RAG pipelines—backed by scalable TypeScript and Java APIs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <a
                href="#projects"
                className="px-6 py-2.5 text-sm font-medium rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-all shadow-sm"
              >
                View Projects
              </a>

              <button
                onClick={onOpenCvStudio}
                className="px-6 py-2.5 text-sm font-medium rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Resume / CV</span>
              </button>

              <a
                href="#contact"
                className="px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Contact Me
              </a>
            </div>

            {/* Direct Social Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[var(--muted)]">
              <a
                href={PROFILE_DATA.contact.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              <a
                href={PROFILE_DATA.contact.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-sky-500" />
                <span>Telegram</span>
              </a>

              <a
                href={PROFILE_DATA.contact.credlyUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Credly (6 Badges)</span>
              </a>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span>{PROFILE_DATA.location}</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Clean Profile Card */}
          <motion.div
            className="lg:col-span-5 xl:col-span-5 flex justify-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.12, ease: 'easeOut' }}
          >
            <div className="w-full max-w-md lg:max-w-none rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8 shadow-md hover:shadow-lg transition-all">
              
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[var(--border)]">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface)] shrink-0">
                  <img
                    src={PROFILE_DATA.photoUrl}
                    alt="Ahmed Abdelgaffar portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-[var(--foreground)]">
                    Ahmed Abdelgaffar
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Software Engineer
                  </p>
                  <p className="text-xs text-[var(--muted)] font-mono mt-0.5">
                    {PROFILE_DATA.contact.email}
                  </p>
                </div>
              </div>

              {/* Education Summary */}
              <div className="space-y-2.5 text-xs text-[var(--foreground)]">
                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="font-medium text-[var(--foreground)]">Master's (2026–2028):</span>
                  <div className="text-[var(--muted)] mt-0.5 leading-relaxed">RTU MIREA · Information Systems Architecture</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="font-medium text-[var(--foreground)]">Bachelor's (2022–2026):</span>
                  <div className="text-[var(--muted)] mt-0.5 leading-relaxed">Kazan Federal Univ · Software Engineering (ITIS)</div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Core: Flutter · Applied AI · TypeScript</span>
                <a href="#about" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                  More About Me &rarr;
                </a>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
