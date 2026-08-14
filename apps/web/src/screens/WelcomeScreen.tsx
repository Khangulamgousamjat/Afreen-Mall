import React from 'react';
import { Store, ShieldCheck, Sun, Moon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface WelcomeScreenProps {
  onGoToLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGoToLogin }) => {
  const { theme, toggleTheme } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '24px',
      }}
    >
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <button className="btn" onClick={toggleTheme} style={{ fontSize: '12px', padding: '6px 12px' }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div
        className="card"
        style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          padding: '48px 32px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent-lime)' }}>
            <Store size={48} style={{ color: 'var(--accent-lime)' }} />
          </div>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Afreen Mall
        </h1>
        <div style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Internal Retail & Store Operations Platform
        </div>

        <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '32px', padding: '16px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
          Authorized Staff Portal for Store Operations, POS Billing, Cash Reconciliation, Inventory Control, and Purchasing Management.
        </div>

        <button
          className="btn btn-primary"
          onClick={onGoToLogin}
          style={{ width: '100%', padding: '14px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
        >
          <span>Staff Login</span>
          <ArrowRight size={18} />
        </button>

        <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} />
          <span>Staff-Only Access · Restricted Operations System</span>
        </div>
      </div>
    </div>
  );
};
