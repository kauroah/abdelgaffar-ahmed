import React from 'react';
import { Github, Award, Send, FileText } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import { Logo } from './Logo';

interface FooterProps {
  onOpenCvStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCvStudio }) => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] text-[var(--muted)] py-12 pb-24 md:pb-12 transition-colors">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Identity with Unique Logo */}
        <div className="flex items-center gap-3">
          <Logo size="sm" showLabel={false} />
          <div>
            <div className="text-sm font-serif font-normal text-[var(--foreground)]">
              Ahmed Abdelgaffar
            </div>
            <div className="text-xs text-[var(--muted)]">
              Systems Architecture · RTU MIREA & KFU ITIS
            </div>
          </div>
        </div>

        {/* Quick Functional Links */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
          <button
            onClick={onOpenCvStudio}
            className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Master CV Studio</span>
          </button>

          <a
            href={PROFILE_DATA.contact.credlyUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span>Credly Badges</span>
          </a>

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
            className="hover:text-sky-500 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span>Telegram</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[var(--muted)] font-mono">
          © {new Date().getFullYear()} Ahmed Abdelgaffar
        </div>

      </div>
    </footer>
  );
};
