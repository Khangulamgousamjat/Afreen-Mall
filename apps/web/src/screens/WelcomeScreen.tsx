import React from 'react';
import { Sun, Moon, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AfreenMallLogo } from '../components/AfreenMallLogo';

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
      {/* Top-left logo header — matches every internal page */}
      <div style={{ position: 'absolute', top: '16px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src={theme === 'dark' ? '/logo-dark.jpg' : '/logo-light.jpg'}
          alt="Afreen Mall"
          style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
          draggable={false}
        />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', letterSpacing: '0.4px' }}>Afreen Mall</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Internal Operations</div>
        </div>
      </div>

      {/* Top-right theme toggle */}
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <button className="btn" onClick={toggleTheme} style={{ fontSize: '12px', padding: '6px 12px' }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div
        className="card"
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          padding: '36px 32px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Sleek, Compact Transparent Vector Logo */}
        <AfreenMallLogo size="large" />

        {/* Single CTA Button */}
        <button
          className="btn btn-primary"
          onClick={onGoToLogin}
          style={{
            width: '100%',
            maxWidth: '340px',
            padding: '14px',
            fontSize: '16px',
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>Staff Login</span>
          <ArrowRight size={18} />
        </button>

        <div
          style={{
            marginTop: '20px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--accent-lime)' }} />
          <span>Internal Operations Platform · Authorized Staff Access Only</span>
        </div>
      </div>
    </div>
  );
};
