import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  highlight,
  subtitle,
  align = 'center',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'}`}>
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-olympus-cyan/30 bg-olympus-cyan/5 text-xs font-mono uppercase tracking-widest text-olympus-cyan ${
            isCenter ? 'justify-center' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-olympus-cyan animate-ping" />
          {badge}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-tech uppercase">
        {title}{' '}
        {highlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-olympus-cyan to-olympus-blue-light">
            {highlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}>
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-olympus-blue" />
        <span className="w-3 h-1 bg-olympus-cyan rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-olympus-blue" />
      </div>
    </div>
  );
};
