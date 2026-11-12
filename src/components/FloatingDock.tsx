import React, { useState, useEffect } from 'react';
import { Home, FolderGit2, User, Mail, FileText, Sun, Moon } from 'lucide-react';

interface FloatingDockProps {
  onOpenCvStudio: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onOpenCvStudio,
  isDark,
  onToggleTheme,
}) => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'void', 'projects', 'badges', 'experience', 'about', 'contact'];
      const scrollY = window.scrollY;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 150;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section === 'void' ? 'projects' : section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '#home' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, href: '#void' },
    { id: 'about', label: 'About', icon: User, href: '#about' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
  ];

  return (
    <aside aria-label="Quick navigation dock" className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 floating-dock select-none">
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border border-[var(--border)] shadow-lg shadow-black/5 dark:shadow-black/40 transition-all">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <div key={item.id} className="relative">
              <a
                href={item.href}
                aria-label={item.label}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`navbar-li ${isActive ? 'active' : ''} p-2 sm:p-2.5`}
              >
                <Icon className="w-4 h-4" />
              </a>

              {/* Tooltip positioned below the top navigation bar */}
              {hoveredItem === item.id && (
                <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md animate-in fade-in duration-150 pointer-events-none z-50">
                  {item.label}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 dark:bg-neutral-100" />
                </div>
              )}
            </div>
          );
        })}

        <div className="h-4 sm:h-5 w-[1px] bg-[var(--border)] mx-0.5 sm:mx-1" />

        {/* CV Studio Trigger Button */}
        <div className="relative">
          <button
            onClick={onOpenCvStudio}
            aria-label="Master CV Studio"
            onMouseEnter={() => setHoveredItem('cv')}
            onMouseLeave={() => setHoveredItem(null)}
            className="navbar-li p-2 sm:p-2.5 text-[var(--foreground)]"
          >
            <FileText className="w-4 h-4" />
          </button>
          {hoveredItem === 'cv' && (
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md pointer-events-none z-50">
              CV Studio
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 dark:bg-neutral-100" />
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <div className="relative">
          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onMouseEnter={() => setHoveredItem('theme')}
            onMouseLeave={() => setHoveredItem(null)}
            className="navbar-li p-2 sm:p-2.5"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-800" />}
          </button>
          {hoveredItem === 'theme' && (
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md pointer-events-none z-50">
              {isDark ? 'Light' : 'Dark'} Mode
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 dark:bg-neutral-100" />
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};
