import React, { useState } from 'react';
import { Menu, X, FileText, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenCvStudio: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCvStudio, isDark, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Badges', href: '#badges' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Unique Brand Logo */}
        <a 
          href="#home" 
          className="whitespace-nowrap shrink-0 flex items-center"
          aria-label="Ahmed Abdelgaffar - Portfolio"
        >
          <Logo size="md" showLabel={true} />
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[var(--muted)]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[var(--foreground)] transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action CTA + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onOpenCvStudio}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-full hover:opacity-90 shadow-2xs hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Master CV Studio</span>
          </button>

          <a
            href="#contact"
            className="px-4 py-2 text-xs font-medium text-[var(--foreground)] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] rounded-full transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-[var(--border)] text-[var(--foreground)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--background)] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCvStudio();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-full"
            >
              <FileText className="w-4 h-4" />
              <span>Open Master CV Studio</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
