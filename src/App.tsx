import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { BadgesSection } from './components/BadgesSection';
import { EducationSection } from './components/EducationSection';
import { TechStackSection } from './components/TechStackSection';
import { ProjectsSection } from './components/ProjectsSection';
import { VoidProjectSection } from './components/void/VoidProjectSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingDock } from './components/FloatingDock';
import { CvStudioModal } from './components/CvStudioModal';
import { ProjectModal } from './components/ProjectModal';
import { BadgeModal } from './components/BadgeModal';
import { PROFILE_DATA, CaseStudyProject, BadgeItem } from './data/portfolioData';
import { useCredlySync } from './hooks/useCredlySync';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isCvStudioOpen, setIsCvStudioOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CaseStudyProject | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // 24-hour Credly automatic sync hook
  const { badges, isSyncing, syncNow, lastSyncTime } = useCredlySync();

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      return;
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(#home)'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

    sections.forEach((section) => observer.observe(section));
    document.documentElement.classList.add('motion-ready');

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
      sections.forEach((section) => section.classList.remove('is-visible'));
    };
  }, []);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleSelectBadgeById = (badgeId: string) => {
    const found = badges.find(b => b.id === badgeId) || PROFILE_DATA.badges.find(b => b.id === badgeId);
    if (found) {
      setSelectedBadge(found);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors selection:bg-neutral-800 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenCvStudio={() => setIsCvStudioOpen(true)}
          onSelectBadge={handleSelectBadgeById}
        />

        {/* Featured First Project: VOID — Real-Time Voice Assistant */}
        <VoidProjectSection />

        {/* Selected Commercial & Enterprise Case Studies */}
        <ProjectsSection
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* Badges & Industry Credentials Showcase with 24h Auto-Sync */}
        <BadgesSection
          badges={badges}
          isSyncing={isSyncing}
          onSyncNow={syncNow}
          lastSyncTime={lastSyncTime}
          onSelectBadge={(badge) => setSelectedBadge(badge)}
        />

        {/* Engineering Experience Timeline with X-Y-Z formula */}
        <ExperienceTimeline />

        {/* About & Education (Academic Scholarship) */}
        <EducationSection />

        {/* Categorized Tech Stack */}
        <TechStackSection />

        {/* Direct Contact & Collaboration */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenCvStudio={() => setIsCvStudioOpen(true)} />

      <FloatingDock
        onOpenCvStudio={() => setIsCvStudioOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Master Adjustable CV Studio Modal */}
      <CvStudioModal
        isOpen={isCvStudioOpen}
        onClose={() => setIsCvStudioOpen(false)}
      />

      {/* Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Badge Credential Inspection Modal */}
      <BadgeModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}
