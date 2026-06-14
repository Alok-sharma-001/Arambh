export interface Region {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  accentColor: string;
  status: 'completed' | 'current' | 'locked';
  lore: string;
  lessons: Lesson[];
  bossChallenge: BossChallenge;
  position: { x: number; y: number };
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  status: 'completed' | 'current' | 'locked';
  xpReward: number;
}

export interface BossChallenge {
  title: string;
  description: string;
  xpReward: number;
  artifactReward: string;
  locked: boolean;
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  code: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  lore: string;
  regionId: string;
  regionName: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  accentColor: string;
  icon: string; // emoji
  unlocked: boolean;
  unlockCondition: string;
  statBoost: string;
  xpValue: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  totalXP: number;
  regionsCompleted: number;
  artifactsCollected: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface PlayerState {
  level: number;
  totalXP: number;
  currentRegion: string;
  regionProgress: Record<string, {
    completed: boolean;
    lessonsCompleted: number;
    totalLessons: number;
  }>;
  streak: number;
  sessionXP: number;
}

export interface MemorySlot {
  name: string;
  value: string;
  type: string;
  note: string;
  accent: string;
}

export interface DebugStep {
  line: number;
  action: string;
  why: string;
  memory: MemorySlot[];
  output?: string;
}

export interface LessonDebugContent {
  title: string;
  hook: string;
  concept: string;
  code: string;
  mentalModel: string[];
  debuggerSteps: DebugStep[];
}
