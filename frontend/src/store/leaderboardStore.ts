import { create } from 'zustand';
import api from '../services/api';

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  level: number;
  total_xp: number;
  streak: number;
  artifacts_collected: number;
  regions_completed: number;
  is_current_user: boolean;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/progression/leaderboard');
      // response.data contains entries and last_updated
      set({ 
        entries: response.data.entries, 
        lastUpdated: response.data.last_updated,
        isLoading: false 
      });
    } catch (e: any) {
      console.error('Failed to fetch leaderboard:', e);
      set({ 
        error: e.response?.data?.detail || 'Failed to fetch leaderboard', 
        isLoading: false 
      });
    }
  }
}));
