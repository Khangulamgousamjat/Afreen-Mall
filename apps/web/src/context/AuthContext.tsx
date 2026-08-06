import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserSession, RoleName } from '@afreen-mall/shared-types';

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (identifier: string, password: string) => Promise<any>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserSession | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    // Purge legacy unauthenticated localStorage tokens
    localStorage.removeItem('afreen_token');
    localStorage.removeItem('afreen_user');

    const expiresAt = sessionStorage.getItem('afreen_session_expires');
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      sessionStorage.clear();
      return null;
    }

    const saved = sessionStorage.getItem('afreen_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const expiresAt = sessionStorage.getItem('afreen_session_expires');
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      sessionStorage.clear();
      return null;
    }
    return sessionStorage.getItem('afreen_token');
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('afreen_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('afreen_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Strict Backend Authentication Login — Zero Client-Side Bypasses
  const login = async (identifier: string, password: string) => {
    const sessionExpiresAt = Date.now() + 12 * 60 * 60 * 1000;

    // Send credentials strictly to backend auth endpoint
    const res = await api.post('/auth/login', { identifier, password });

    if (res.data && res.data.token && res.data.user) {
      const { token: jwtToken, user: userPayload } = res.data;
      setToken(jwtToken);
      setUser(userPayload);
      sessionStorage.setItem('afreen_token', jwtToken);
      sessionStorage.setItem('afreen_user', JSON.stringify(userPayload));
      sessionStorage.setItem('afreen_session_expires', String(sessionExpiresAt));
      return res.data;
    }

    throw new Error('Authentication failed: Invalid response from server');
  };

  // Strict Password Change with Backend Verification
  const changePassword = async (newPassword: string, currentPassword?: string) => {
    const res = await api.post('/auth/change-password', { newPassword, currentPassword });
    if (user) {
      const updated = { ...user, mustChangePassword: false };
      setUser(updated);
      sessionStorage.setItem('afreen_user', JSON.stringify(updated));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear();
    localStorage.removeItem('afreen_token');
    localStorage.removeItem('afreen_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        theme,
        toggleTheme,
        login,
        changePassword,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
