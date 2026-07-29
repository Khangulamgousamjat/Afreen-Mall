import React, { useState, useRef, useEffect } from 'react';
import { AlertOctagon, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onBackToWelcome: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToWelcome, onLoginSuccess }) => {
  const { login, theme } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('Authenticating...');

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const timer1Ref = useRef<NodeJS.Timeout | null>(null);
  const timer2Ref = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (timer1Ref.current) clearTimeout(timer1Ref.current);
    if (timer2Ref.current) clearTimeout(timer2Ref.current);
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Staff ID / Username and Password are required');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 60-second timeout to allow Render free tier cold-starts to complete naturally
    timeoutIdRef.current = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      setLoading(true);
      setStatusText('Authenticating...');

      // Dynamic status progress updates for cashier feedback
      timer1Ref.current = setTimeout(() => {
        setStatusText('Connecting to Cloud API...');
      }, 3000);

      timer2Ref.current = setTimeout(() => {
        setStatusText('Waking Cloud Server (~30s Cold Start)...');
      }, 8000);

      await login(identifier.trim(), password);

      clearAllTimers();
      onLoginSuccess();
    } catch (err: any) {
      clearAllTimers();

      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || err.name === 'AbortError' || err?.message === 'canceled') {
        setError('Server request timed out. Please click Retry below to try again.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to backend server. Please check internet connection or click Retry.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      clearAllTimers();
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Top-left logo header — matches every internal page */}
      <div style={{ position: 'absolute', top: '16px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={theme === 'dark' ? '/logo-dark.jpg' : '/logo-light.jpg'}
          alt="Afreen Mall"
          style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
          draggable={false}
        />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Afreen Mall</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Internal Operations</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
          <button
            className="btn"
            onClick={onBackToWelcome}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '4px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Staff Secure Login</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enter 6-digit Staff ID (e.g. 300000) or Username
          </div>
        </div>

        {error && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid var(--status-red)',
              color: 'var(--status-red)',
              padding: '10px 12px',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertOctagon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{error}</div>
            </div>
            <button
              className="btn"
              onClick={handleSubmit}
              style={{
                alignSelf: 'flex-end',
                padding: '4px 10px',
                fontSize: '11px',
                borderColor: 'var(--status-red)',
                color: 'var(--status-red)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RefreshCw size={12} />
              <span>Retry Login</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              6-Digit Staff ID / Username
            </label>
            <input
              type="text"
              className="input-field tabular-nums"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 300000 or Superkhan"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px', marginTop: '6px' }}>
            {loading ? statusText : 'Sign In to Operations'}
          </button>
        </form>

        <div style={{ width: '100%', marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          Strictly internal access. Accounts provisioned by Super Admin.
        </div>
      </div>
    </div>
  );
};
