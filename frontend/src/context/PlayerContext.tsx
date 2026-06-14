import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { PlayerState } from '@/types';
import { regions } from '@/data/regions';
import { useProgressionStore } from '@/store/progressionStore';
import { useRegionStore } from '@/store/regionStore';

interface PlayerContextType {
  player: PlayerState;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  completeLesson: (regionId: string, lessonId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { stats, fetchProgression, gainXP } = useProgressionStore();
  const { regions: storeRegions, completeLesson: storeCompleteLesson } = useRegionStore();
  
  const [sessionXP, setSessionXP] = useState(0);

  // Fetch progression on mount
  useEffect(() => {
    fetchProgression();
  }, [fetchProgression]);

  // Dynamically build the regionProgress map required by PyQuest UI
  const regionProgress: Record<string, { completed: boolean; lessonsCompleted: number; totalLessons: number }> = {};
  
  regions.forEach(r => {
    const storeRegion = storeRegions[r.id];
    const totalLessons = r.lessons.length;
    
    // If store region exists, use it. Otherwise use defaults based on region.ts status
    if (storeRegion) {
      regionProgress[r.id] = {
        completed: storeRegion.regionStatus === 'completed',
        lessonsCompleted: storeRegion.completedLessons.length,
        totalLessons
      };
    } else {
      regionProgress[r.id] = {
        completed: r.status === 'completed',
        lessonsCompleted: r.status === 'completed' ? totalLessons : r.status === 'current' ? 2 : 0,
        totalLessons
      };
    }
  });

  // Calculate current region (first one that isn't locked or completed)
  let currentRegion = 'variables-forest'; // Default
  for (const r of regions) {
    const status = storeRegions[r.id]?.regionStatus || r.status;
    if (status === 'available' || status === 'current') {
      currentRegion = r.id;
      break;
    }
  }

  const player: PlayerState = {
    level: stats?.current_level || 1,
    totalXP: stats?.total_xp || 0,
    currentRegion,
    regionProgress,
    streak: stats?.streak_days || 0,
    sessionXP,
  };

  const addXP = useCallback((amount: number) => {
    gainXP(amount, 'lesson');
    setSessionXP(prev => prev + amount);
  }, [gainXP]);

  const incrementStreak = useCallback(() => {
    // Streaks are handled via backend login APIs in Arambh.
  }, []);

  const resetStreak = useCallback(() => {
    // Streaks are handled via backend login APIs in Arambh.
  }, []);

  const completeLesson = useCallback((regionId: string, lessonId: string) => {
    storeCompleteLesson(regionId, lessonId);
  }, [storeCompleteLesson]);

  return (
    <PlayerContext.Provider value={{ player, addXP, incrementStreak, resetStreak, completeLesson }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
