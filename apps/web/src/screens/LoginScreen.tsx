import React, { useState, useRef, useEffect } from 'react';
import { AlertOctagon, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

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

  const isHealthPingInFlight = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  };

  // Task 1: Fire lightweight GET to /health on mount to wake Render instance early
  useEffect(() => {
    isHealthPingInFlight.current = true;
    const wakeServer = async () => {
      try {
        await api.get('/health', { timeout: 30000 });
      } catch {
        // Fire-and-forget background ping to trigger Render cold start
      } finally {
        isHealthPingInFlight.current = false;
      }
    };
    wakeServer();

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

    // Task 1: 60-second total client timeout
    timeoutIdRef.current = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      setLoading(true);

      // Task 1: Immediate cold-start message if health ping is still in flight
      if (isHealthPingInFlight.current) {
        setStatusText('Waking Cloud Server (~30s Cold Start)...');
      } else {
        setStatusText('Authenticating...');
      }

      // Task 1: Exponential backoff retry (up to 3 attempts)
      const maxRetries = 3;
      let lastErr: any = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (controller.signal.aborted) break;

        try {
          if (attempt > 1) {
            setStatusText(`Waking Cloud Server (Attempt ${attempt}/${maxRetries})...`);
            const delay = Math.pow(2, attempt - 1) * 1000; // 2s, 4s
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          await login(identifier.trim(), password);
          clearAllTimers();
          onLoginSuccess();
          return;
        } catch (err: any) {
          lastErr = err;
          // If error is invalid credentials or 401, don't retry - fail immediately
          if (err.response?.status === 401 || err.response?.status === 400 || err.response?.status === 423) {
            throw err;
          }
        }
      }

      if (lastErr) throw lastErr;
    } catch (err: any) {
      clearAllTimers();

      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || err.name === 'AbortError' || err?.message === 'canceled') {
        setError('Server request timed out after 60s. Click Retry below.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to backend server. Please check connection or retry.');
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
