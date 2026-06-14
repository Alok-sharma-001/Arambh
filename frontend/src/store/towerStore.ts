import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncManager } from '../services/syncManager';

export interface TowerProgress {
  max_floor: number;
  current_floor: number;
  resonance: number;
}

interface TowerStore {
  progress: TowerProgress;
  activeStreak: number;
  
  advanceFloor: () => void;
  failFloor: () => void;
  addResonance: (amount: number) => void;
  setTowerProgress: (progress: TowerProgress) => void;
  hydrate: (serverProgress: Partial<TowerProgress>) => void;
}

export const useTowerStore = create<TowerStore>()(
  persist(
    (set) => ({
      progress: {
        max_floor: 0,
        current_floor: 1,
        resonance: 0
      },
      activeStreak: 0,
      
      hydrate: (serverProgress) => set((state) => ({
        progress: { ...state.progress, ...serverProgress }
      })),
      
      advanceFloor: () => {
        set((state) => {
          const nextFloor = state.progress.current_floor + 1;
          return {
            progress: {
              ...state.progress,
              current_floor: nextFloor,
              max_floor: Math.max(state.progress.max_floor, nextFloor)
            },
            activeStreak: state.activeStreak + 1
          };
        });
        syncManager.performBackgroundSync();
      },
      
      failFloor: () => {
        set((state) => {
          // Drop down to the last milestone (every 10 floors)
          const milestone = Math.max(1, Math.floor((state.progress.current_floor - 1) / 10) * 10);
          return {
            progress: {
              ...state.progress,
              current_floor: milestone
            },
            activeStreak: 0
          };
        });
        syncManager.performBackgroundSync();
      },
      
      addResonance: (amount) => {
        set((state) => ({
          progress: {
            ...state.progress,
            resonance: state.progress.resonance + amount
          }
        }));
        syncManager.performBackgroundSync();
      },

      setTowerProgress: (progress) => {
        set({ progress });
        syncManager.performBackgroundSync();
      }
    }),
    { name: 'pyquest_tower_progress' }
  )
);

