import api from './api';

export interface UserStats {
  current_level: number;
  total_xp: number;
  intelligence_stat: number;
  streak_days: number;
  player_class: string | null;
  rank: string;
  title: string | null;
  daily_streak: number;
  last_claimed_at: string | null;
  total_login_days: number;
}

export interface InventoryItem {
  id: number;
  item_id: string;
  acquired_at: string;
}

export interface ProgressionResponse {
  stats: UserStats;
  inventory: InventoryItem[];
}

export const progressionApi = {
  getProgression: async () => {
    const response = await api.get<ProgressionResponse>('/progression/me');
    return response.data;
  },
  
  setClass: async (playerClass: string) => {
    const response = await api.post<ProgressionResponse>('/progression/class', { player_class: playerClass });
    return response.data;
  },

  addXP: async (amount: number, reason: string) => {
    const response = await api.post<ProgressionResponse>('/progression/xp', { amount, reason });
    return response.data;
  },

  addInventoryItem: async (itemId: string) => {
    const response = await api.post<ProgressionResponse>('/progression/inventory', { item_id: itemId });
    return response.data;
  },

  claimDailyReward: async () => {
    const response = await api.post<ProgressionResponse>('/progression/claim-daily');
    return response.data;
  }
};
