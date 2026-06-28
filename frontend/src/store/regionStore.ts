import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncManager } from '../services/syncManager';
import { regions as regionDefinitions } from '../data/regions';
import { analyticsApi } from '../services/analyticsApi';

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

const REGION_SEQUENCE = regionDefinitions.map((region) => region.id);

const createDefaultRegionState = (regionId: string): RegionState => ({
  completedLessons: [],
  currentLesson: regionDefinitions.find((region) => region.id === regionId)?.lessons[0]?.id || '1',
  bossStatus: 'locked',
  regionStatus: regionId === REGION_SEQUENCE[0] ? 'available' : 'locked',
  artifactAcquired: false,
  completionPercentage: 0,
});

const createInitialRegions = (): Record<string, RegionState> =>
  Object.fromEntries(REGION_SEQUENCE.map((regionId) => [regionId, createDefaultRegionState(regionId)]));

const getLessonCount = (regionId: string) =>
  regionDefinitions.find((region) => region.id === regionId)?.lessons.length || 4;

const getNextRegionId = (regionId: string) => {
  const currentIndex = REGION_SEQUENCE.indexOf(regionId);
  return currentIndex >= 0 ? REGION_SEQUENCE[currentIndex + 1] : undefined;
};

export const useRegionStore = create<RegionStore>()(
  persist(
    (set, get) => ({
      regions: createInitialRegions(),
      
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
          const region = state.regions[regionId] || createDefaultRegionState(regionId);

          const newCompleted = region.completedLessons.includes(lessonId) 
            ? region.completedLessons 
            : [...region.completedLessons, lessonId];
          
          const totalLessons = getLessonCount(regionId);
          const completionPercentage = Math.min(100, Math.round((newCompleted.length / totalLessons) * 100));

          let bossStatus = region.bossStatus;
          if (newCompleted.length >= totalLessons) {
            bossStatus = 'available';
          }
          
          const nextLesson = regionDefinitions
            .find((definition) => definition.id === regionId)
            ?.lessons.find((lesson) => !newCompleted.includes(lesson.id))?.id || lessonId;

          return {
            regions: {
              ...state.regions,
              [regionId]: {
                ...region,
                completedLessons: newCompleted,
                currentLesson: nextLesson,
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
        // Track boss victory and region completion
        analyticsApi.logEvent('boss_victory', { region_id: regionId });
        analyticsApi.logEvent('region_complete', { region_id: regionId });

        set((state) => {
          const region = state.regions[regionId];
          if (!region) return state;
          
          const nextRegionId = getNextRegionId(regionId);
          
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
              ...createDefaultRegionState(nextRegionId),
              regionStatus: 'locked' as RegionStatus,
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
        return state || createDefaultRegionState(regionId);
      }
    }),
    {
      name: 'pyquest-region-progress',
      version: 2,
      merge: (persisted, current) => {
        const persistedRegions = (persisted as any)?.state?.regions || {};
        return {
          ...current,
          ...(persisted as any)?.state,
          regions: {
            ...createInitialRegions(),
            ...persistedRegions,
          },
        };
      },
    }
  )
);
