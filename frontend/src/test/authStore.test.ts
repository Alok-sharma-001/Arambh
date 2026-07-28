import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';

describe('authStore Zustand State Management', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null });
  });

  it('should initialize with empty user state when localStorage is clean', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
  });

  it('should set user and persist to localStorage', () => {
    const mockUser = { username: 'test_mage', level: 5 };
    useAuthStore.getState().setUser(mockUser);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should clear user state and localStorage on logout', async () => {
    const mockUser = { username: 'test_rogue' };
    useAuthStore.getState().setUser(mockUser);

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
