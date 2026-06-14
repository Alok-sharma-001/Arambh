import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncManager } from '../services/syncManager';

export type RegionStatus = 'locked' | 'available' | 'completed';
export type BossStatus = 'locked' | 'available' | 'completed';

export interface RegionState {
  completedLessons: string[];
  currentLesson: string;
  bossStatus: BossStatus;
  regionStatus: RegionStatus;
  artifactAcquired: boolean;
  completionPercentage: number;
}

interface RegionStore {
  regions: Record<string, RegionState>;
  
  // Actions
  unlockRegion: (regionId: string) => void;
  completeLesson: (regionId: string, lessonId: string) => void;
  unlockBoss: (regionId: string) => void;
  completeBoss: (regionId: string) => void;
  getRegionProgress: (regionId: string) => RegionState;
  hydrate: (serverRegions: any[]) => void;
}

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      regions: {
        'variables-forest': {
          completedLessons: [],
          currentLesson: '1',
          bossStatus: 'locked',
          regionStatus: 'available',
          artifactAcquired: false,
          completionPercentage: 0,
        },
        'data-types-valley': {
          completedLessons: [],
          currentLesson: '1',
          bossStatus: 'locked',
          regionStatus: 'locked',
          artifactAcquired: false,
          completionPercentage: 0,
        },
        'loops-desert': {
          completedLessons: [],
          currentLesson: '1',
          bossStatus: 'locked',
          regionStatus: 'locked',
          artifactAcquired: false,
          completionPercentage: 0,
        },
        'functions-mountain': {
          completedLessons: [],
          currentLesson: '16', // Note: currentLesson usually needs to track the offset
          bossStatus: 'locked',
          regionStatus: 'locked',
          artifactAcquired: false,
          completionPercentage: 0,
        },
        'collections-kingdom': {
          completedLessons: [],
          currentLesson: '21',
          bossStatus: 'locked',
          regionStatus: 'locked',
          artifactAcquired: false,
          completionPercentage: 0,
        }
      },
      
      hydrate: (serverRegions: any[]) => {
        const newRegions = { ...get().regions };
        serverRegions.forEach(r => {
          const bossDefeated = r.boss_defeated;
          newRegions[r.region_id] = {
            ...(newRegions[r.region_id] || {
              completedLessons: [], currentLesson: '1', bossStatus: 'locked', artifactAcquired: false, completionPercentage: 0
            }),
            regionStatus: r.status as RegionStatus,
            bossStatus: bossDefeated ? 'completed' : newRegions[r.region_id]?.bossStatus || 'locked',
            artifactAcquired: bossDefeated,
            completionPercentage: bossDefeated ? 100 : newRegions[r.region_id]?.completionPercentage || 0,
          };
        });
        set({ regions: newRegions });
      },

      unlockRegion: (regionId) => {
        set((state) => ({
          regions: {
            ...state.regions,
            [regionId]: {
              ...(state.regions[regionId] || {
                completedLessons: [], currentLesson: '1', bossStatus: 'locked', artifactAcquired: false, completionPercentage: 0
              }),
              regionStatus: 'available'
            }
          }
        }));
        syncManager.performBackgroundSync();
      },

      completeLesson: (regionId, lessonId) => {
        set((state) => {
          const region = state.regions[regionId];
          if (!region) return state;

          const newCompleted = region.completedLessons.includes(lessonId) 
            ? region.completedLessons 
            : [...region.completedLessons, lessonId];
          
          // Let's assume there are 5 lessons per region right now
          const totalLessons = 5;
          const completionPercentage = (newCompleted.length / totalLessons) * 100;

          let bossStatus = region.bossStatus;
          if (newCompleted.length === totalLessons) {
            bossStatus = 'available';
          }
          
          const nextLessonStr = String(Math.min(totalLessons, newCompleted.length + 1));

          return {
            regions: {
              ...state.regions,
              [regionId]: {
                ...region,
                completedLessons: newCompleted,
                currentLesson: nextLessonStr,
                completionPercentage,
                bossStatus
              }
            }
          };
        });
        syncManager.performBackgroundSync();
      },

      unlockBoss: (regionId) => {
        set((state) => {
          const region = state.regions[regionId];
          if (!region) return state;
          return {
            regions: {
              ...state.regions,
              [regionId]: {
                ...region,
                bossStatus: 'available'
              }
            }
          };
        });
        syncManager.performBackgroundSync();
      },

      completeBoss: (regionId) => {
        set((state) => {
          const region = state.regions[regionId];
          if (!region) return state;
          
          const nextRegions: Record<string, string> = {
            'variables-forest': 'data-types-valley',
            'data-types-valley': 'loops-desert',
            'loops-desert': 'functions-mountain',
            'functions-mountain': 'collections-kingdom',
            'collections-kingdom': 'oop-castle',
            'oop-castle': 'exception-abyss',
            'exception-abyss': 'file-system-ruins',
            'file-system-ruins': 'modules-harbor',
            'modules-harbor': 'algorithm-arena',
            'algorithm-arena': 'boss-gate',
            'boss-gate': 'dsa-dungeon',
            'dsa-dungeon': 'ai-temple'
          };
          const nextRegionId = nextRegions[regionId];
          
          const newRegions: Record<string, RegionState> = {
            ...state.regions,
            [regionId]: {
              ...region,
              bossStatus: 'completed' as BossStatus,
              regionStatus: 'completed' as RegionStatus,
              artifactAcquired: true,
              completionPercentage: 100,
            }
          };

          if (nextRegionId) {
            const nextRegionState = newRegions[nextRegionId] || {
              completedLessons: [], currentLesson: '1', bossStatus: 'locked' as BossStatus, artifactAcquired: false, completionPercentage: 0
            };
            newRegions[nextRegionId] = {
              ...nextRegionState,
              regionStatus: 'available' as RegionStatus
            } as RegionState;
          }

          return { regions: newRegions };
        });
        syncManager.performBackgroundSync();
      },

      getRegionProgress: (regionId) => {
        const state = get().regions[regionId];
        return state || {
          completedLessons: [],
          currentLesson: '1',
          bossStatus: 'locked',
          regionStatus: 'locked',
          artifactAcquired: false,
          completionPercentage: 0
        };
      }
    }),
    {
      name: 'pyquest-region-progress',
    }
  )
);
