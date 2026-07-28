import { create } from 'zustand';
import api from '../services/api';

interface AuthState {
  token: string | null;
  user: any | null;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => Promise<void>;
}

const savedUser = localStorage.getItem('user');

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: savedUser ? JSON.parse(savedUser) : null,
  setToken: (token) => {
    set({ token });
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore network error on logout
    }
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));
