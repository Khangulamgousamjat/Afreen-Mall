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
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <button className="btn" onClick={toggleTheme} style={{ fontSize: '12px', padding: '6px 12px' }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div
        className="card"
        style={{
          maxWidth: '680px',
          width: '100%',
          textAlign: 'center',
          padding: '48px 40px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Prominent Aesthetic Brand Logo (Big Display, No Down Words) */}
        <AfreenMallLogo size="huge" />

        {/* Single CTA Button */}
        <button
          className="btn btn-primary"
          onClick={onGoToLogin}
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '16px',
            fontSize: '17px',
            marginTop: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>Staff Login</span>
          <ArrowRight size={20} />
        </button>

        <div
          style={{
            marginTop: '28px',
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
