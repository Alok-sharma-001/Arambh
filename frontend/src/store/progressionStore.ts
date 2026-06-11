import { create } from 'zustand';
import { progressionApi, UserStats, InventoryItem } from '../services/progressionApi';

interface ProgressionState {
  stats: UserStats | null;
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  
  fetchProgression: () => Promise<void>;
  setClass: (playerClass: string) => Promise<void>;
  gainXP: (amount: number, reason: string) => Promise<void>;
  gainItem: (itemId: string) => Promise<void>;
}

export const useProgressionStore = create<ProgressionState>((set) => ({
  stats: null,
  inventory: [],
  isLoading: false,
  error: null,

  fetchProgression: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await progressionApi.getProgression();
      set({ stats: data.stats, inventory: data.inventory, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setClass: async (playerClass: string) => {
    try {
      const data = await progressionApi.setClass(playerClass);
      set({ stats: data.stats, inventory: data.inventory });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  gainXP: async (amount: number, reason: string) => {
    try {
      const data = await progressionApi.addXP(amount, reason);
      // We could add logic here to detect level up if data.stats.current_level > current.stats.current_level
      set({ stats: data.stats, inventory: data.inventory });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  gainItem: async (itemId: string) => {
    try {
      const data = await progressionApi.addInventoryItem(itemId);
      set({ stats: data.stats, inventory: data.inventory });
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
