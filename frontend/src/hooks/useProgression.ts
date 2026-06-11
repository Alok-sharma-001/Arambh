import { useProgressionStore } from '../store/progressionStore';
import { getLevelProgress, calculateRank, getNextReward, getUnlockedRewards, getRewardForLevel } from '../services/progressionService';

/**
 * useProgression — clean hook that wraps progressionStore
 * and computes all derived progression values.
 * Components use this instead of importing progressionService directly.
 */
export function useProgression() {
  const { stats, inventory, isLoading, error, levelUpEvent, dismissLevelUp, fetchProgression, setClass, gainXP, gainItem } = useProgressionStore();

  const totalXP = stats?.total_xp || 0;
  const progress = getLevelProgress(totalXP);
  const rank = stats?.rank || calculateRank(totalXP);
  const nextReward = getNextReward(progress.level);
  const unlockedRewards = getUnlockedRewards(progress.level);
  const currentLevelReward = getRewardForLevel(progress.level);

  return {
    // Raw state
    stats,
    inventory,
    isLoading,
    error,

    // Computed progression
    level: progress.level,
    totalXP: progress.totalXP,
    xpIntoLevel: progress.xpIntoLevel,
    xpNeeded: progress.xpNeeded,
    xpPercent: progress.percent,
    nextLevelXP: progress.nextLevelXP,
    rank,
    playerClass: stats?.player_class || null,

    // Rewards
    nextReward,
    unlockedRewards,
    currentLevelReward,

    // Level-up event
    levelUpEvent,
    dismissLevelUp,

    // Actions
    fetchProgression,
    setClass,
    gainXP,
    gainItem,
  };
}
