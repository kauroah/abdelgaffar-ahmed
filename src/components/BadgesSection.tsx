import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, FileCheck } from 'lucide-react';
import { BadgeItem, PROFILE_DATA } from '../data/portfolioData';

interface BadgesSectionProps {
  badges: BadgeItem[];
  isSyncing: boolean;
  onSyncNow: () => void;
  lastSyncTime: number;
  onSelectBadge: (badge: BadgeItem) => void;
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({
  badges,
  onSelectBadge
}) => {
  const [filter, setFilter] = useState<'All' | 'Google Cloud' | 'MongoDB'>('All');

  // Deduplicate badges by credentialId or normalized title to ensure zero duplicates
  const normTitle = (s: string) => s.toLowerCase().replace(/skill\s*badge/gi, '').replace(/[^a-z0-9]/g, '');
  const uniqueBadges = badges.filter((b, idx, arr) => {
    // If title has trailing "Skill Badge" and another item exists without it, drop the duplicate
    if (b.title.trim().endsWith('Skill Badge')) {
      const baseExists = arr.some(other => other.id !== b.id && normTitle(other.title) === normTitle(b.title));
      if (baseExists) return false;
    }
    const key = b.credentialId || normTitle(b.title);
    return arr.findIndex(other => (other.credentialId || normTitle(other.title)) === key) === idx;
  });

  const filteredBadges = uniqueBadges.filter(b => {
    if (filter === 'All') return true;
    return b.issuer === filter;
  });

  return (
    <section id="badges" className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Clean Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[var(--muted)] font-medium uppercase mb-2">
            CREDENTIALS & CERTIFICATIONS
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[var(--foreground)] tracking-tight">
            MongoDB & Google Cloud <span className="animated-text-gradient italic">Badges</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-3">
            Verified technical skill badges earned from MongoDB and Google Cloud.
          </p>

          {/* Credly Link & Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href={PROFILE_DATA.contact.credlyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full hover:opacity-90 transition-all shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>Verify on Credly</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <div className="flex items-center gap-1.5 p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]">
              {(['All', 'Google Cloud', 'MongoDB'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1 text-xs rounded-full transition-all cursor-pointer ${
                    filter === tab
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs font-medium'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {tab === 'All' ? `All (${uniqueBadges.length})` : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => onSelectBadge(badge)}
              className="motion-card group rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 flex flex-col justify-between hover:border-[var(--muted)] hover:shadow-md transition-all cursor-pointer shadow-xs"
            >
              <div>
                {/* Header with Badge Image */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-[var(--surface)] p-2.5 flex items-center justify-center border border-[var(--border)] shrink-0 group-hover:scale-105 transition-transform">
                    <img
                      src={badge.badgeImage}
                      alt={`${badge.title} badge`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]">
                      {badge.issuer}
                    </span>
                    <div className="text-[11px] text-[var(--muted)] font-mono mt-1">
                      {badge.date}
                    </div>
                  </div>
                </div>

                {/* Badge Title */}
                <h3 className="text-lg font-serif font-normal text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-2">
                  {badge.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              <div>
                {/* Key Skills */}
                <div className="pt-3 border-t border-[var(--border)] mb-3 flex flex-wrap gap-1">
                  {badge.keySkills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                    >
                      {skill}
                    </span>
                  ))}
                  {badge.keySkills.length > 3 && (
                    <span className="text-[11px] text-[var(--muted)] px-1 self-center">
                      +{badge.keySkills.length - 3}
                    </span>
                  )}
                </div>

                {/* Card Action Link */}
                <div className="flex items-center justify-between pt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  <span className="group-hover:underline">View Details &rarr;</span>

                  {badge.pdfPath && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Certificate</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
