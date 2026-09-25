import React from 'react';

interface HUDFrameProps {
  children: React.ReactNode;
  className?: string;
  tag?: string;
  glow?: boolean;
}

export const HUDFrame: React.FC<HUDFrameProps> = ({
  children,
  className = '',
  tag,
  glow = false,
}) => {
  return (
    <div
      className={`relative bg-olympus-card/80 backdrop-blur-md border border-olympus-border rounded-lg p-6 ${
        glow ? 'border-olympus-cyan/40 shadow-cyan-glow' : ''
      } ${className}`}
    >
      {/* Corner Brackets */}
      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-olympus-cyan pointer-events-none" />
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-olympus-cyan pointer-events-none" />
      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-olympus-cyan pointer-events-none" />
      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-olympus-cyan pointer-events-none" />

      {/* Optional Technical Tag */}
      {tag && (
        <div className="absolute -top-2.5 right-6 px-2 py-0.5 bg-olympus-bg border border-olympus-cyan/50 text-[10px] font-mono tracking-widest text-olympus-cyan uppercase">
          {tag}
        </div>
      )}

      {children}
    </div>
  );
};
