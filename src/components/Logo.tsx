import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showLabel = true }) => {
  const sizeMap = {
    sm: { container: 'h-7 w-5', text: 'text-sm' },
    md: { container: 'h-8.5 w-6', text: 'text-base' },
    lg: { container: 'h-10 w-7', text: 'text-lg' },
  };

  const currentSize = sizeMap[size];

  return (
    <a 
      href="#home"
      aria-label="Ahmed Abdelgaffar — Home" 
      className={`inline-flex items-center gap-2.5 group select-none cursor-pointer ${className}`}
    >
      {/* Uploaded Calligraphic AA Monogram Logo */}
      <div className={`relative shrink-0 flex items-center justify-center ${currentSize.container}`}>
        <img
          src="/assets/aistudio/monogram_logo_vector_9faf5d59.svg"
          alt="Ahmed Abdelgaffar Monogram Logo"
          className="w-full h-full object-contain dark:invert transition-transform duration-300 group-hover:scale-105"
          loading="eager"
        />
      </div>

      {/* Brand Label */}
      {showLabel && (
        <div className="flex items-baseline gap-1.5">
          <span className={`font-semibold tracking-tight text-[var(--foreground)] ${currentSize.text} group-hover:opacity-85 transition-opacity`}>
            Ahmed Abdelgaffar
          </span>
          <span className="font-mono text-[11px] text-[var(--muted)]">
            / swe
          </span>
        </div>
      )}
    </a>
  );
};
