import api from './api';

export interface GuildSummary {
  id: number;
  name: string;
  crest_id: string;
  level: number;
  member_count: number;
  reputation: number;
}

export interface GuildMember {
  user_id: number;
  username: string;
  role: string;
  joined_at: string;
  contribution_gxp: number;
  level: number;
  rank: string;
}

export interface GuildProgress {
  active_boss_id: string | null;
  boss_health_remaining: number;
  completed_bosses: string[];
  active_quests: string[];
}

export interface GuildResponse {
  id: number;
  name: string;
  description: string;
  crest_id: string;
  level: number;
  total_gxp: number;
  reputation: number;
  created_at: string;
  members: GuildMember[];
  progress: GuildProgress | null;
}

export const guildApi = {
  createGuild: async (name: string, description?: string, crest_id?: string) => {
    const res = await api.post('/v1/guilds/', { name, description, crest_id });
    return res.data;
  },

  listGuilds: async (): Promise<GuildSummary[]> => {
    const res = await api.get('/v1/guilds/list');
    return res.data;
  },

  getMyGuild: async (): Promise<GuildResponse> => {
    const res = await api.get('/v1/guilds/me');
    return res.data;
  },

  joinGuild: async (guildId: number) => {
    const res = await api.post(`/v1/guilds/${guildId}/join`);
    return res.data;
  },

  leaveGuild: async () => {
    const res = await api.post('/v1/guilds/leave');
    return res.data;
  }
};
