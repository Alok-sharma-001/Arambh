import { create } from 'zustand';
import { guildApi, GuildResponse, GuildSummary } from '../services/guildApi';

interface GuildState {
  myGuild: GuildResponse | null;
  publicGuilds: GuildSummary[];
  isLoading: boolean;
  error: string | null;
  
  fetchMyGuild: () => Promise<void>;
  fetchPublicGuilds: () => Promise<void>;
  createGuild: (name: string, desc?: string, crest?: string) => Promise<void>;
  joinGuild: (id: number) => Promise<void>;
  leaveGuild: () => Promise<void>;
}

export const useGuildStore = create<GuildState>((set) => ({
  myGuild: null,
  publicGuilds: [],
  isLoading: false,
  error: null,

  fetchMyGuild: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await guildApi.getMyGuild();
      set({ myGuild: data, isLoading: false });
    } catch (e: any) {
      set({ myGuild: null, isLoading: false });
    }
  },

  fetchPublicGuilds: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await guildApi.listGuilds();
      set({ publicGuilds: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail || 'Failed to fetch guilds', isLoading: false });
    }
  },

  createGuild: async (name, desc, crest) => {
    set({ isLoading: true, error: null });
    try {
      await guildApi.createGuild(name, desc, crest);
      const data = await guildApi.getMyGuild();
      set({ myGuild: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail || 'Failed to create guild', isLoading: false });
      throw e;
    }
  },

  joinGuild: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await guildApi.joinGuild(id);
      const data = await guildApi.getMyGuild();
      set({ myGuild: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail || 'Failed to join guild', isLoading: false });
      throw e;
    }
  },

  leaveGuild: async () => {
    set({ isLoading: true, error: null });
    try {
      await guildApi.leaveGuild();
      set({ myGuild: null, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail || 'Failed to leave guild', isLoading: false });
      throw e;
    }
  }
}));
