import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'GUEST' | 'PATIENT' | 'DOCTOR' | 'ADMIN';
  phone?: string;
  avatar?: string;
  patient?: any;
  doctor?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isLoading: false,

  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isLoading: false });
      toast.success('Login successful!');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true });
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isLoading: false });
      toast.success('Registration successful!');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  },
}));
