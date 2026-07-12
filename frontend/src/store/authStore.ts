import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => void;
}

const getUsernameFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64)).sub || null;
  } catch {
    return null;
  }
};

const initialToken = localStorage.getItem('token');
const initialUsername = getUsernameFromToken(initialToken);

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: initialUsername ? { username: initialUsername } : null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      const username = getUsernameFromToken(token);
      set({ token, user: username ? { username } : null });
    } else {
      localStorage.removeItem('token');
      set({ token, user: null });
    }
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
