/**
 * Centralized Progression Service
 * All XP, Level, Rank, and Reward logic lives here.
 * Components NEVER calculate these values directly.
 */

// ─── XP Reward Table ────────────────────────────────────────────
export const XP_REWARDS = {
  DAILY_LOGIN:         10,
  LESSON_COMPLETE:     50,
  QUIZ_PASS:          100,
  CHALLENGE_COMPLETE: 150,
  ACHIEVEMENT_UNLOCK: 200,
  CODE_EXECUTION:      10,
  MANUAL_CLICK:        50,
} as const;

export type XPAction = keyof typeof XP_REWARDS;

// ─── Level Thresholds ───────────────────────────────────────────
// Level N requires LEVEL_THRESHOLDS[N] cumulative XP
const LEVEL_THRESHOLDS: Record<number, number> = {
  1:     0,
  2:   250,
  3:   600,
  4:  1000,
  5:  1600,
  6:  2500,
  7:  3500,
  8:  5000,
  9:  7000,
  10: 10000,
};

/** Returns current level for a given total XP */
export function calculateLevel(totalXP: number): number {
  let level = 1;
  const maxLevel = Math.max(...Object.keys(LEVEL_THRESHOLDS).map(Number));
  for (let i = 2; i <= maxLevel; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i;
    } else {
      break;
    }
  }
  // Beyond defined thresholds, extrapolate: each subsequent level = prev + 3000
  if (totalXP >= LEVEL_THRESHOLDS[maxLevel]) {
    const excess = totalXP - LEVEL_THRESHOLDS[maxLevel];
    level = maxLevel + Math.floor(excess / 3000);
  }
  return level;
}

/** Returns XP required to reach the next level from current level */
export function xpForNextLevel(currentLevel: number): number {
  const next = currentLevel + 1;
  if (LEVEL_THRESHOLDS[next] !== undefined) {
    return LEVEL_THRESHOLDS[next];
  }
  // Extrapolate
  const maxDefined = Math.max(...Object.keys(LEVEL_THRESHOLDS).map(Number));
  return LEVEL_THRESHOLDS[maxDefined] + (next - maxDefined) * 3000;
}

/** Returns XP threshold for a specific level */
export function xpForLevel(level: number): number {
  if (LEVEL_THRESHOLDS[level] !== undefined) {
    return LEVEL_THRESHOLDS[level];
  }
  const maxDefined = Math.max(...Object.keys(LEVEL_THRESHOLDS).map(Number));
  return LEVEL_THRESHOLDS[maxDefined] + (level - maxDefined) * 3000;
}

/** Returns XP progress within the current level as { current, needed, percent } */
export function getLevelProgress(totalXP: number) {
  const level = calculateLevel(totalXP);
  const currentThreshold = xpForLevel(level);
  const nextThreshold = xpForNextLevel(level);
  const xpIntoLevel = totalXP - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const percent = xpNeeded > 0 ? Math.min((xpIntoLevel / xpNeeded) * 100, 100) : 100;

  return {
    level,
    xpIntoLevel,
    xpNeeded,
    percent,
    totalXP,
    nextLevelXP: nextThreshold,
  };
}

// ─── Rank System ────────────────────────────────────────────────
const RANK_THRESHOLDS = [
  { minXP:     0, rank: 'Novice' },
  { minXP:   501, rank: 'Explorer' },
  { minXP:  1501, rank: 'Adept' },
  { minXP:  3001, rank: 'Master' },
  { minXP:  5001, rank: 'Grandmaster' },
  { minXP: 10000, rank: 'Legend' },
] as const;

export type Rank = typeof RANK_THRESHOLDS[number]['rank'] | 'Legend';

/** Returns rank based on total XP */
export function calculateRank(totalXP: number): Rank {
  let rank: Rank = 'Novice';
  for (const threshold of RANK_THRESHOLDS) {
    if (totalXP >= threshold.minXP) {
      rank = threshold.rank;
    }
  }
  return rank;
}

/** Returns the next rank and XP needed to reach it */
export function getNextRank(totalXP: number): { rank: Rank; xpNeeded: number } | null {
  for (const threshold of RANK_THRESHOLDS) {
    if (totalXP < threshold.minXP) {
      return { rank: threshold.rank, xpNeeded: threshold.minXP - totalXP };
    }
  }
  return null; // Already at max rank
}

// ─── Reward System ──────────────────────────────────────────────
export interface LevelReward {
  level: number;
  name: string;
  icon: string; // emoji
  type: 'badge' | 'artifact' | 'booster' | 'banner' | 'title';
}

export const LEVEL_REWARDS: LevelReward[] = [
  { level: 2,  name: 'Bronze Badge',       icon: '🥉', type: 'badge' },
  { level: 3,  name: 'Variables Crystal',   icon: '💎', type: 'artifact' },
  { level: 4,  name: 'XP Booster',         icon: '⚡', type: 'booster' },
  { level: 5,  name: 'Loop Compass',        icon: '🧭', type: 'artifact' },
  { level: 6,  name: 'Explorer Banner',     icon: '🚩', type: 'banner' },
  { level: 7,  name: 'Function Scroll',     icon: '📜', type: 'artifact' },
  { level: 8,  name: 'Gold Badge',          icon: '🥇', type: 'badge' },
  { level: 10, name: 'OOP Crown',           icon: '👑', type: 'artifact' },
  { level: 15, name: 'Algorithm Orb',       icon: '🔮', type: 'artifact' },
];

/** Returns the reward for a specific level, or null */
export function getRewardForLevel(level: number): LevelReward | null {
  return LEVEL_REWARDS.find(r => r.level === level) || null;
}

/** Returns the next upcoming reward based on current level */
export function getNextReward(currentLevel: number): LevelReward | null {
  return LEVEL_REWARDS.find(r => r.level > currentLevel) || null;
}

/** Returns all unlocked rewards up to current level */
export function getUnlockedRewards(currentLevel: number): LevelReward[] {
  return LEVEL_REWARDS.filter(r => r.level <= currentLevel);
}
