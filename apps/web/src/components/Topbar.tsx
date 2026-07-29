import React from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Topbar: React.FC = () => {
  const { user, theme, toggleTheme, logout } = useAuth();

  const logoSrc = theme === 'dark' ? '/logo-dark.jpg' : '/logo-light.jpg';

  return (
    <header className="topbar">
      {/* LEFT: Logo + Mall name (shared across every internal page) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src={logoSrc}
          alt="Afreen Mall"
          style={{ height: '32px', width: 'auto', objectFit: 'contain', display: 'block' }}
          draggable={false}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: '15px', fontWeight: '500', letterSpacing: '0.5px', color: 'var(--text-main)' }}>
            Afreen Mall
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Internal Operations
          </span>
        </div>
      </div>

      {/* RIGHT: Theme toggle + user info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          className="btn"
          onClick={toggleTheme}
          title="Toggle Light/Dark Theme"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.fullName}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="tabular-nums">
                Staff ID: <strong>{user.staffId}</strong> | {user.role}
              </div>
            </div>
            <button
              className="btn"
              onClick={logout}
              title="Logout"
              style={{ padding: '6px 10px', color: 'var(--status-red)', borderColor: 'var(--border-color)' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
