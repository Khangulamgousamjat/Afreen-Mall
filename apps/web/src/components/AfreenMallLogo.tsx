import React from 'react';
import { useAuth } from '../context/AuthContext';

interface AfreenMallLogoProps {
  size?: 'small' | 'medium' | 'large' | 'huge';
  className?: string;
}

export const AfreenMallLogo: React.FC<AfreenMallLogoProps> = ({ size = 'medium', className = '' }) => {
  const { theme } = useAuth();
  const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  let height = '180px';

  if (size === 'small') {
    height = '42px';
  } else if (size === 'medium') {
    height = '140px';
  } else if (size === 'large') {
    height = '240px';
  } else if (size === 'huge') {
    height = '320px';
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <img
        src={logoSrc}
        alt="Afreen Mall"
        style={{
          height,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};
