import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Printer,
  FileText,
  Code2,
  FileDown,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import { BulletStyle, TargetRole, buildResumeData } from '../data/cvTemplates';
import { generateAndDownloadPdf } from '../utils/pdfGenerator';

export type { TargetRole };

interface CvStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvStudioModal: React.FC<CvStudioModalProps> = ({ isOpen, onClose }) => {
  const [targetRole, setTargetRole] = useState<TargetRole>('flutter_ai');
  const [bulletStyle, setBulletStyle] = useState<BulletStyle>('xyz');
  const [includeBadges, setIncludeBadges] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);

  const resume = useMemo(
    () => buildResumeData(targetRole, bulletStyle),
    [targetRole, bulletStyle]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExportDialog) {
          setShowExportDialog(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, showExportDialog, onClose]);

  if (!isOpen) return null;

  const portfolioOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  const generateMarkdown = () => {
    let secNum = 1;
    const nextNum = () => String(secNum++).padStart(2, '0');

    const competenciesMd = resume.competencies
      .map((c) => `* **${c.label}:** ${c.value}`)
      .join('\n');

    const badgesMd = includeBadges
      ? `\n---\n\n## ${nextNum()} · VERIFIED CERTIFICATIONS & SKILL BADGES (13)\n${resume.badges
          .map((b) => `* ${b}`)
          .join('\n')}`
      : '';

    const expMd = resume.experiences
      .map(
        (exp) =>
          `### **${exp.company}**\n*${exp.roleLocation}* | ${exp.period}\n${exp.bullets
            .map((b) => `* ${b}`)
            .join('\n')}`
      )
      .join('\n\n');

    const projectsMd = resume.projects
      .map(
        (proj) =>
          `### **${proj.title}**\n*${proj.stack}*\n${proj.bullets
            .map((b) => `* ${b}`)
            .join('\n')}`
      )
      .join('\n\n');

    const eduMd = resume.education
      .map(
        (edu) =>
          `* **${edu.institution}** (${edu.period})  \n  ${edu.degree}  \n  *${edu.note}*`
      )
      .join('\n\n');

    return `# AHMED ABDELGAFFAR
**${resume.roleTitle.toUpperCase()}**  
${resume.subtitle}  
Moscow, Russia | ahmedabdelhady0246@gmail.com | +7 (996) 846-9573  
[GitHub: github.com/kauroah](https://github.com/kauroah) | [Credly Badges](https://www.credly.com/users/ahmed-abdelgaffar)${
      portfolioOrigin ? ` | [Portfolio](${portfolioOrigin})` : ''
    }

---

## ${nextNum()} · PROFESSIONAL SUMMARY
${resume.summary}

---

## ${nextNum()} · TECHNICAL COMPETENCIES
${competenciesMd}
${badgesMd}

---

## ${nextNum()} · ENGINEERING EXPERIENCE

${expMd}

---

## ${nextNum()} · SELECTED PROJECTS

${projectsMd}

---

## ${nextNum()} · EDUCATION & SCHOLARSHIPS

${eduMd}

---

## ${nextNum()} · LANGUAGES
${resume.languages}
`;
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdown());
      setCopiedMarkdown(true);
      globalThis.setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateAndDownloadPdf(targetRole, includeBadges, bulletStyle, portfolioOrigin);
      setShowExportDialog(false);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleTriggerPrint = () => {
    setShowExportDialog(false);
    setActiveTab('preview');
    globalThis.setTimeout(() => {
      window.print();
    }, 150);
  };

  // Dynamic section numbering in HTML Document Preview
  const sectionNumbers = {
    summary: '01',
    competencies: '02',
    badges: includeBadges ? '03' : null,
    experience: includeBadges ? '04' : '03',
    projects: includeBadges ? '05' : '04',
    education: includeBadges ? '06' : '05',
    languages: includeBadges ? '07' : '06',
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 cv-modal-overlay transition-opacity duration-150"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl lg:max-w-5xl 2xl:max-w-6xl bg-[var(--card-bg)] text-[var(--foreground)] rounded-3xl border border-[var(--border)] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden cv-modal-card"
        >
          {/* Modal Header */}
          <div className="px-6 py-4.5 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--card-bg)] modal-controls-bar">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[var(--muted)] font-medium mb-0.5">
                Adjustable Resume Generator
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[var(--foreground)] tracking-tight">
                Curriculum Vitae <span className="italic font-serif">Studio</span>
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Close CV studio"
              className="p-2 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Studio Controls Strip */}
          <div className="p-4 sm:px-6 bg-[var(--surface)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 modal-controls-bar">
            {/* Target Role Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[var(--muted)] mr-1">
                Role Focus:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'flutter_ai', label: 'Flutter & AI' },
                    { id: 'flutter', label: 'Flutter / Mobile' },
                    { id: 'ai', label: 'Applied AI' },
                    { id: 'fullstack', label: 'Full-Stack' },
                    { id: 'java', label: 'Java / Backend' },
                  ] as const
                ).map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setTargetRole(role.id)}
                    className={`px-3.5 py-1 text-xs rounded-full transition-all cursor-pointer ${
                      targetRole === role.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium shadow-xs'
                        : 'border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration Toggles & Print Button */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1 p-0.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-full">
                <button
                  onClick={() => setBulletStyle('xyz')}
                  className={`px-3 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
                    bulletStyle === 'xyz'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  X-Y-Z Formula
                </button>
                <button
                  onClick={() => setBulletStyle('concise')}
                  className={`px-3 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
                    bulletStyle === 'concise'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  Concise
                </button>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-[var(--muted)] hover:text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={includeBadges}
                  onChange={(e) => setIncludeBadges(e.target.checked)}
                  className="rounded accent-neutral-900 dark:accent-white"
                />
                <span>Include Badges</span>
              </label>

              <button
                onClick={() => setShowExportDialog(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 rounded-full transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* View Switcher: Document vs Raw Markdown */}
          <div className="px-6 pt-3 flex items-center justify-between gap-4 border-b border-[var(--border)] text-xs modal-controls-bar bg-[var(--card-bg)]">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('preview')}
                className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'border-[var(--foreground)] text-[var(--foreground)] font-medium'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('markdown')}
                className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'markdown'
                    ? 'border-[var(--foreground)] text-[var(--foreground)] font-medium'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Markdown Source</span>
              </button>
            </div>

            {activeTab === 'markdown' && (
              <button
                onClick={handleCopyMarkdown}
                className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] text-[11px] font-medium transition-colors cursor-pointer"
              >
                {copiedMarkdown ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[var(--surface)]">
            {activeTab === 'preview' ? (
              <div
                id="ats-printable-cv"
                className="max-w-3xl lg:max-w-4xl mx-auto bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-[var(--foreground)] text-xs sm:text-sm"
              >
                {/* ATS Header */}
                <div className="text-center pb-5 border-b border-[var(--border)]">
                  <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[var(--foreground)] tracking-tight">
                    Ahmed Abdelgaffar
                  </h1>
                  <div className="text-sm font-serif italic text-[var(--foreground)] mt-1">
                    {resume.roleTitle}
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono mt-1">
                    {resume.subtitle}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[var(--muted)] mt-3">
                    <span>Moscow, Russia</span>
                    <span>·</span>
                    <span>{PROFILE_DATA.contact.secondaryEmail}</span>
                    <span>·</span>
                    <span>{PROFILE_DATA.contact.phone}</span>
                    <span>·</span>
                    <a
                      href={PROFILE_DATA.contact.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--foreground)] underline hover:opacity-80"
                    >
                      github.com/kauroah
                    </a>
                    <span>·</span>
                    <a
                      href={PROFILE_DATA.contact.credlyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--foreground)] underline hover:opacity-80"
                    >
                      Credly Badges
                    </a>
                    {portfolioOrigin && (
                      <>
                        <span>·</span>
                        <a
                          href={portfolioOrigin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--foreground)] underline hover:opacity-80"
                        >
                          Live Portfolio
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* 01 Summary */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Professional Summary
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {sectionNumbers.summary}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--muted)]">{resume.summary}</p>
                </div>

                {/* 02 Technical Competencies */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Technical Competencies
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {sectionNumbers.competencies}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[var(--muted)] leading-relaxed">
                    {resume.competencies.map((row) => (
                      <div key={row.label}>
                        <strong className="text-[var(--foreground)] font-medium">
                          {row.label}:{' '}
                        </strong>
                        <span>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 03 Verified Badges & Certificates */}
                {includeBadges && sectionNumbers.badges && (
                  <div>
                    <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                      <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                        Verified Credentials &amp; Certificates (13)
                      </h2>
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        {sectionNumbers.badges}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-[var(--muted)] leading-relaxed">
                      {resume.badges.map((line, i) => (
                        <div key={i}>• {line}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 04 Engineering Experience */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-3">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Engineering Experience
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {sectionNumbers.experience}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {resume.experiences.map((exp) => (
                      <div key={exp.company}>
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-semibold text-sm text-[var(--foreground)]">
                            {exp.company}
                          </span>
                          <span className="text-xs font-mono text-[var(--muted)] shrink-0">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-xs font-serif italic text-[var(--foreground)] mb-1.5">
                          {exp.roleLocation}
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-[var(--muted)] leading-relaxed">
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 05 Selected Projects */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-3">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Selected Projects
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {sectionNumbers.projects}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {resume.projects.map((proj) => (
                      <div key={proj.title}>
                        <div className="font-semibold text-sm text-[var(--foreground)]">
                          {proj.title}
                        </div>
                        <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5 mb-1.5">
                          {proj.stack}
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-[var(--muted)] leading-relaxed">
                          {proj.bullets.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 06 Education */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Education &amp; Scholarships
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {sectionNumbers.education}
                    </span>
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed">
                    {resume.education.map((edu) => (
                      <div key={edu.institution}>
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-semibold text-[var(--foreground)]">
                            {edu.institution}
                          </span>
                          <span className="font-mono text-[var(--muted)] shrink-0">
                            {edu.period}
                          </span>
                        </div>
                        <div className="text-[var(--muted)] font-serif italic">{edu.degree}</div>
                        <div className="text-[11px] text-[var(--muted)] mt-0.5">{edu.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 07 Languages */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Languages
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">
                      {sectionNumbers.languages}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)]">{resume.languages}</div>
                </div>
              </div>
            ) : (
              /* Raw Markdown View */
              <div className="max-w-3xl mx-auto">
                <pre className="p-6 rounded-2xl bg-[var(--card-bg)] text-[var(--foreground)] font-mono text-xs leading-relaxed overflow-x-auto border border-[var(--border)] shadow-xs whitespace-pre-wrap">
                  {generateMarkdown()}
                </pre>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 px-6 border-t border-[var(--border)] bg-[var(--card-bg)] flex items-center justify-between gap-4 text-xs modal-controls-bar">
            <div className="text-[var(--muted)]">
              ATS-Standard Single-Column Format · Synced across Preview, Markdown &amp; PDF
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 font-medium rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation & Export Dialog Modal */}
      {showExportDialog && (
        <div
          onClick={() => setShowExportDialog(false)}
          className="fixed inset-0 z-60 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[var(--card-bg)] text-[var(--foreground)] rounded-3xl border border-[var(--border)] shadow-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-2xl font-serif font-normal text-[var(--foreground)]">
                  Export Resume
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Target profile: {resume.roleTitle}
                </p>
              </div>

              <button
                onClick={() => setShowExportDialog(false)}
                aria-label="Close export dialog"
                className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--muted)] mb-5 leading-relaxed">
              Choose your preferred export method. Direct download compiles an ATS-readable PDF directly to your device:
            </p>

            <div className="space-y-3 mb-5">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-left flex items-start gap-3.5 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-5 h-5 text-[var(--foreground)] animate-spin mt-0.5 shrink-0" />
                ) : (
                  <FileDown className="w-5 h-5 text-[var(--foreground)] mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Directly'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium">
                      Direct Download
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                    Generates an ATS-compliant <span className="font-semibold text-[var(--foreground)]">.pdf</span> with Selected Projects, Experience, and Credentials.
                  </div>
                </div>
              </button>

              <button
                onClick={handleTriggerPrint}
                className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] transition-all text-left flex items-start gap-3.5 cursor-pointer"
              >
                <Printer className="w-5 h-5 text-[var(--muted)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    Print / System PDF Dialog
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                    Opens your browser print preview using the printable document layout.
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => setShowExportDialog(false)}
                className="px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
