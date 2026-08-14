import axios from 'axios';

// Use VITE_API_URL from .env.local for Render backend; fallback to relative path for local dev proxy
const API_BASE = (import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + '/api/v1'
  : '/api/v1');

export const api = axios.create({
  baseURL: API_BASE,
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
