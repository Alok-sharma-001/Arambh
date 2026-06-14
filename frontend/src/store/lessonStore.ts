import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncManager } from '../services/syncManager';

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface LessonProgress {
  lessonId: number | string;
  status: LessonStatus;
  stagesCompleted: string[];
}

interface LessonStore {
  progress: Record<string, LessonProgress>;
  unlockLesson: (lessonId: string | number) => void;
  startLesson: (lessonId: string | number) => void;
  completeStage: (lessonId: string | number, stage: string) => void;
  completeLesson: (lessonId: string | number) => void;
  getLessonStatus: (lessonId: string | number) => LessonStatus;
  hydrate: (serverLessons: any[]) => void;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      // Initially, lesson 1 is available
      progress: {
        '1': {
          lessonId: '1',
          status: 'available' as LessonStatus,
          stagesCompleted: []
        }
      },
      hydrate: (serverLessons: any[]) => {
        const newProgress = { ...get().progress };
        serverLessons.forEach(l => {
          newProgress[l.lesson_id] = {
            lessonId: l.lesson_id,
            status: l.status,
            stagesCompleted: l.stages_completed || []
          };
        });
        set({ progress: newProgress });
      },
      unlockLesson: (lessonId) => {
        set((state) => {
          const current = state.progress[lessonId];
          if (!current || current.status === 'locked') {
            return {
              progress: {
                ...state.progress,
                [lessonId]: {
                  lessonId,
                  status: 'available' as LessonStatus,
                  stagesCompleted: []
                }
              }
            };
          }
          return state;
        });
        syncManager.performBackgroundSync();
      },
      startLesson: (lessonId) => {
        set((state) => {
          const current = state.progress[lessonId] || { lessonId, status: 'available' as LessonStatus, stagesCompleted: [] };
          if (current.status !== 'completed') {
            return {
              progress: {
                ...state.progress,
                [lessonId]: {
                  ...current,
                  status: 'in_progress' as LessonStatus
                }
              }
            };
          }
          return state;
        });
        syncManager.performBackgroundSync();
      },
      completeStage: (lessonId, stage) => {
        set((state) => {
          const current = state.progress[lessonId] || { lessonId, status: 'in_progress' as LessonStatus, stagesCompleted: [] };
          if (!current.stagesCompleted.includes(stage)) {
            return {
              progress: {
                ...state.progress,
                [lessonId]: {
                  ...current,
                  stagesCompleted: [...current.stagesCompleted, stage]
                }
              }
            };
          }
          return state;
        });
        syncManager.performBackgroundSync();
      },
      completeLesson: (lessonId) => {
        set((state) => {
          const current = state.progress[lessonId] || { lessonId, status: 'in_progress' as LessonStatus, stagesCompleted: [] };
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...current,
                status: 'completed' as LessonStatus
              }
            }
          };
        });
        syncManager.performBackgroundSync();
      },
      getLessonStatus: (lessonId) => {
        const current = get().progress[lessonId];
        return current ? current.status : 'locked';
      }
    }),
    {
      name: 'pyquest-lessons',
    }
  )
);
