import React from 'react';
import { Globe, CheckCircle2, MapPin, GraduationCap } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';

export const EducationSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Avinash-style Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[var(--muted)] font-medium uppercase mb-2">
            BACKGROUND & EDUCATION
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[var(--foreground)] tracking-tight">
            About <span className="animated-text-gradient italic">Ahmed</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-3">
            Software engineer with a solid academic foundation in computer science and distributed systems.
          </p>
        </div>

        {/* Bio Overview */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8 lg:p-10 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
            <div>
              <h3 className="text-xl font-serif font-normal text-[var(--foreground)]">
                Ahmed Abdelgaffar
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Full-Stack & Distributed Systems Developer
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] max-w-fit">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Moscow, Russia</span>
            </div>
          </div>

          <p className="text-sm text-[var(--muted)] leading-relaxed mt-4">
            I hold a Bachelor's Degree in Software Engineering from <strong className="text-[var(--foreground)] font-medium">Kazan Federal University (Higher Institute of ITIS)</strong> and am currently completing my Master's Degree in Information Systems Architecture at <strong className="text-[var(--foreground)] font-medium">RTU MIREA</strong> under a competitive Russian Federation State Quota Scholarship. My core technical strengths span Java 21, Spring Boot, RabbitMQ, Kafka, TypeScript, Next.js, Flutter, and PostgreSQL.
          </p>
        </div>

        {/* Academic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* RTU MIREA Master's Degree */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs text-[var(--muted)] font-mono">
                  2026 – 2028 (Year 1)
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  State Scholarship Quota
                </span>
              </div>

              <h3 className="text-xl font-serif font-normal text-[var(--foreground)]">
                RTU MIREA
              </h3>
              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 mb-3">
                Master's · Information Systems Architecture (Moscow)
              </div>

              <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                Selected for the competitive Russian Federation international scholarship quota by the Ministry of Science and Higher Education for exceptional academic record.
              </p>

              <div className="space-y-1.5 text-xs text-[var(--foreground)]/90">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>High-concurrency microservices & distributed consensus</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Event log replication with RabbitMQ & Kafka</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>MongoDB Atlas Vector Search & RAG pipelines</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kazan Federal University Bachelor's Degree */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs text-[var(--muted)] font-mono">
                  2022 – 2026
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]">
                  Bachelor of Science
                </span>
              </div>

              <h3 className="text-xl font-serif font-normal text-[var(--foreground)]">
                Kazan Federal University (KFU)
              </h3>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 mb-3">
                Higher Institute of ITIS · Software Engineering
              </div>

              <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                Rigorous curriculum covering multi-threaded programming, relational database normalization, operating systems, and network protocols.
              </p>

              <div className="space-y-1.5 text-xs text-[var(--foreground)]/90">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Concurrent Java Programming (Locks, CompletableFuture)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>ACID Transaction Isolation & SQL Query Optimization</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Spring Security & OAuth 2.0 / OIDC Specifications</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Languages */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-serif font-normal text-[var(--foreground)]">
              Languages
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROFILE_DATA.languages.map((lang) => (
              <div key={lang.name} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-xs font-semibold text-[var(--foreground)]">
                  {lang.name}
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {lang.level}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">
                  {lang.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
