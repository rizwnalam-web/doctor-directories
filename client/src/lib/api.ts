import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://doctor-directories-server.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  withCredentials: false
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (import.meta.env.VITE_ENABLE_DEBUG_LOGGING) {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.VITE_ENABLE_DEBUG_LOGGING) {
      console.error('API Error:', error.response?.data || error.message);
    }

    if (error.response?.status === 401) {
      if (import.meta.env.VITE_AUTH_PERSISTENT) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
      window.location.href = '/login';
    }

    if (error.response?.status === 429) {
      // Rate limiting error
      console.warn('Too many requests. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
