import React from 'react';

interface LogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
}

export default function Logo({
  theme = 'dark',
  size = 'md',
  showSubtitle = true,
  className = '',
}: LogoProps) {
  const isDark = theme === 'dark';

  // Size configurations — control max width of the image
  const widths = {
    sm: 140,
    md: 180,
    lg: 240,
    hero: 320,
  }[size];

  const logoSrc = isDark
    ? '/logo dark .png'
    : '/logo light .png';

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        userSelect: 'none',
      }}
    >
      <img
        src={logoSrc}
        alt="Afreen Mall Logo"
        style={{
          width: widths,
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
        draggable={false}
      />
    </div>
  );
}
