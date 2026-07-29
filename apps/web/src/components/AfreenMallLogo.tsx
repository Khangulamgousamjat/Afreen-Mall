import React from 'react';
import { useAuth } from '../context/AuthContext';

interface AfreenMallLogoProps {
  size?: 'small' | 'medium' | 'large' | 'huge';
  className?: string;
}

export const AfreenMallLogo: React.FC<AfreenMallLogoProps> = ({ size = 'medium', className = '' }) => {
  const { theme } = useAuth();

  const widths = {
    small: 160,
    medium: 180,
    large: 220,
    huge: 280,
  };

  const width = widths[size];

  const logoSrc = theme === 'dark'
    ? '/logo dark .png'
    : '/logo light .png';

  return (
    <img
      src={logoSrc}
      alt="Afreen Mall Logo"
      className={className}
      style={{
        width,
        maxWidth: '100%',
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
      draggable={false}
    />
  );
};
