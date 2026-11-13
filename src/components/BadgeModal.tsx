import React, { useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { BadgeItem } from '../data/portfolioData';

interface BadgeModalProps {
  badge: BadgeItem | null;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ badge, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!badge) return null;

  const isFreeAcademy = badge.issuer === 'FreeAcademy AI';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-opacity duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg lg:max-w-xl bg-[var(--card-bg)] text-[var(--foreground)] rounded-3xl border border-[var(--border)] shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close badge modal"
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Full Certificate Banner for FreeAcademy AI */}
        {isFreeAcademy && (
          <div className="mb-5 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <img
              src={badge.badgeImage}
              alt={`${badge.title} certificate`}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Badge Visual & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
          {!isFreeAcademy && (
            <div className="w-20 h-20 rounded-2xl bg-[var(--surface)] p-2.5 flex items-center justify-center border border-[var(--border)] shrink-0">
              <img
                src={badge.badgeImage}
                alt={`${badge.title} badge`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="text-center sm:text-left flex-1">
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
              {badge.issuer} · {badge.category}
            </div>

            <h2 className="text-xl font-serif font-normal text-[var(--foreground)] leading-snug mb-1">
              {badge.title}
            </h2>

            <div className="text-xs text-[var(--muted)] font-mono">
              Issued: {badge.date}
              {badge.credentialId ? ` · ID: ${badge.credentialId}` : ''}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-1.5">
            Credential Details
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            {badge.description}
          </p>
        </div>

        {/* Verified Skills */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium mb-2">
            Verified Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {badge.keySkills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-3 text-xs">
          <a
            href={badge.verifyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full hover:opacity-90 transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{isFreeAcademy ? 'Verify on FreeAcademy AI' : 'Verify on Credly'}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {badge.pdfPath && (
            <a
              href={badge.pdfPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-[var(--foreground)] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] rounded-full transition-colors"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Certificate PDF</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 font-medium text-[var(--muted)] hover:text-[var(--foreground)] rounded-full transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
