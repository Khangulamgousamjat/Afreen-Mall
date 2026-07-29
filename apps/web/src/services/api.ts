import axios from 'axios';

// Fallback directly to live Render backend host if VITE_API_URL is not set at build time
const DEFAULT_BACKEND_URL = 'https://afreen-mall.onrender.com';
const API_HOST = import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL;
const API_BASE = `${API_HOST.replace(/\/$/, '')}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000, // 20 second global request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('afreen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('afreen_token');
      localStorage.removeItem('afreen_user');
    }
    return Promise.reject(error);
  }
);
