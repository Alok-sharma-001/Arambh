import api from './api';

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  completed: boolean;
  claimed: boolean;
}

export const questsApi = {
  getActiveQuests: async (): Promise<Quest[]> => {
    const res = await api.get<Quest[]>('/quests/active');
    return res.data;
  },

  claimReward: async (questId: string): Promise<{ status: string; xp_reward: number; total_xp: number }> => {
    const res = await api.post('/quests/claim', { quest_id: questId });
    return res.data;
  }
};
