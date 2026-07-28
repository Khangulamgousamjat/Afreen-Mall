import React from 'react';
import { Sun, Moon, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Topbar: React.FC = () => {
  const { user, theme, toggleTheme, logout } = useAuth();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Afreen Mall
        </h2>
        <span style={{ fontSize: '12px', padding: '2px 8px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
          INTERNAL OPERATIONS
        </span>
      </div>

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
