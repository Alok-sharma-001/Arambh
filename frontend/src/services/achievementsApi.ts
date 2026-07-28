import api from './api';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

export const achievementsApi = {
  getAchievements: async (): Promise<Achievement[]> => {
    const res = await api.get<Achievement[]>('/achievements');
    return res.data;
  }
};
