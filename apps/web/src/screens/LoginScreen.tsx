import React, { useState } from 'react';
import { Lock, AlertOctagon, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onBackToWelcome: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToWelcome, onLoginSuccess }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Staff ID / Username and Password are required');
      return;
    }

    try {
      setLoading(true);
      await login(identifier, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
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
      }}
    >
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px 28px' }}>
        <button
          className="btn"
          onClick={onBackToWelcome}
          style={{ marginBottom: '20px', padding: '4px 8px', fontSize: '12px' }}
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Shield size={36} style={{ color: 'var(--accent-lime)', marginBottom: '8px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase' }}>Afreen Mall Staff Login</h2>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enter your 6-digit Staff ID (e.g. 300000) or Username
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid var(--status-red)',
              color: 'var(--status-red)',
              padding: '12px',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertOctagon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
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
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px', marginTop: '8px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Operations'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          Strictly internal access. Accounts are created exclusively by Super Admin.
        </div>
      </div>
    </div>
  );
};
