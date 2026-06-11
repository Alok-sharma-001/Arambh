import { create } from 'zustand';
import { progressionApi, UserStats, InventoryItem } from '../services/progressionApi';
import { calculateLevel, calculateRank, getRewardForLevel, XP_REWARDS, XPAction } from '../services/progressionService';
import type { LevelReward } from '../services/progressionService';

export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  reward: LevelReward | null;
}

interface ProgressionState {
  stats: UserStats | null;
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  
  // Level-up event
  levelUpEvent: LevelUpEvent | null;
  dismissLevelUp: () => void;
  
  // Actions
  fetchProgression: () => Promise<void>;
  setClass: (playerClass: string) => Promise<void>;
  gainXP: (action: XPAction | number, reason: string) => Promise<void>;
  gainItem: (itemId: string) => Promise<void>;
}

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  stats: null,
  inventory: [],
  isLoading: false,
  error: null,
  levelUpEvent: null,

  dismissLevelUp: () => set({ levelUpEvent: null }),

  fetchProgression: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await progressionApi.getProgression();
      set({ stats: data.stats, inventory: data.inventory, isLoading: false });
    } catch (error: any) {
      // Fallback: if API is unavailable, use localStorage
      const cached = localStorage.getItem('pyquest_progression');
      if (cached) {
        const parsed = JSON.parse(cached);
        set({ stats: parsed.stats, inventory: parsed.inventory || [], isLoading: false });
      } else {
        // Initialize default stats locally
        set({ 
          stats: {
            current_level: 1,
            total_xp: 0,
            intelligence_stat: 10,
            streak_days: 0,
            player_class: null,
            rank: 'Novice',
            title: null,
          },
          inventory: [],
          isLoading: false 
        });
      }
    }
  },

  setClass: async (playerClass: string) => {
    const current = get().stats;
    try {
      const data = await progressionApi.setClass(playerClass);
      set({ stats: data.stats, inventory: data.inventory });
      persistLocally(data.stats, data.inventory);
    } catch {
      // Fallback: set locally
      if (current) {
        const updated = { ...current, player_class: playerClass };
        set({ stats: updated });
        persistLocally(updated, get().inventory);
      }
    }
  },

  gainXP: async (action: XPAction | number, reason: string) => {
    const amount = typeof action === 'number' ? action : XP_REWARDS[action];
    const prevStats = get().stats;
    const prevLevel = prevStats?.current_level || 1;

    try {
      const data = await progressionApi.addXP(amount, reason);
      const newLevel = data.stats.current_level;
      
      set({ stats: data.stats, inventory: data.inventory });
      persistLocally(data.stats, data.inventory);
      
      // Detect level-up
      if (newLevel > prevLevel) {
        const reward = getRewardForLevel(newLevel);
        set({ levelUpEvent: { oldLevel: prevLevel, newLevel, reward } });
      }
    } catch {
      // Fallback: compute locally
      if (prevStats) {
        const newXP = prevStats.total_xp + amount;
        const newLevel = calculateLevel(newXP);
        const newRank = calculateRank(newXP);
        const updated: UserStats = {
          ...prevStats,
          total_xp: newXP,
          current_level: newLevel,
          rank: newRank,
        };
        set({ stats: updated });
        persistLocally(updated, get().inventory);
        
        if (newLevel > prevLevel) {
          const reward = getRewardForLevel(newLevel);
          set({ levelUpEvent: { oldLevel: prevLevel, newLevel, reward } });
        }
      }
    }
  },

  gainItem: async (itemId: string) => {
    try {
      const data = await progressionApi.addInventoryItem(itemId);
      set({ stats: data.stats, inventory: data.inventory });
      persistLocally(data.stats, data.inventory);
    } catch {
      // Fallback: add locally
      const inv = get().inventory;
      if (!inv.find(i => i.item_id === itemId)) {
        const newItem: InventoryItem = { id: Date.now(), item_id: itemId, acquired_at: new Date().toISOString() };
        const updated = [...inv, newItem];
        set({ inventory: updated });
        persistLocally(get().stats!, updated);
      }
    }
  }
}));

/** Persist to localStorage so data survives refresh even without backend */
function persistLocally(stats: UserStats, inventory: InventoryItem[]) {
  localStorage.setItem('pyquest_progression', JSON.stringify({ stats, inventory }));
}
