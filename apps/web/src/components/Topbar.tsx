import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Topbar: React.FC = () => {
  const { user, theme } = useAuth();
  const logoSrc = theme === 'dark' ? '/logo-dark.jpg' : '/logo-light.jpg';

  return (
    <header className="topbar">
      {/* LEFT: Logo + Mall name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={logoSrc}
          alt="Afreen Mall"
          style={{ height: '42px', width: 'auto', objectFit: 'contain', display: 'block' }}
          draggable={false}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: '16px', fontWeight: '500', letterSpacing: '0.5px', color: 'var(--text-main)' }}>
            Afreen Mall
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Internal Operations
          </span>
        </div>
      </div>

      {/* RIGHT: Logged-in Staff Info Only */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{user.fullName}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="tabular-nums">
              Staff ID: <strong>{user.staffId}</strong> | {user.role}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
