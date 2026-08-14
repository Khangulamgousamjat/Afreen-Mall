import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserSession } from '@afreen-mall/shared-types';

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
    const saved = localStorage.getItem('afreen_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('afreen_token'));

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

  const login = async (identifier: string, password: string) => {
    const res = await api.post('/auth/login', { identifier, password });
    const { token: jwtToken, user: userPayload } = res.data;

    setToken(jwtToken);
    setUser(userPayload);
    localStorage.setItem('afreen_token', jwtToken);
    localStorage.setItem('afreen_user', JSON.stringify(userPayload));

    return res.data;
  };

  const changePassword = async (newPassword: string, currentPassword?: string) => {
    await api.post('/auth/change-password', { newPassword, currentPassword });
    if (user) {
      const updated = { ...user, mustChangePassword: false };
      setUser(updated);
      localStorage.setItem('afreen_user', JSON.stringify(updated));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
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
