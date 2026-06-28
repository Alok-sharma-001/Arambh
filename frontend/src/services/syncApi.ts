const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface SyncPayload {
  timestamp: string;
  stats?: any;
  inventory?: any[];
  lessons?: any[];
  regions?: any[];
  achievements?: any[];
  quests?: any[];
  knowledge_graph?: any;
  tower_progress?: any;
  revisions?: any[];
}

export const syncApi = {
  pushState: async (payload: SyncPayload) => {
    const token = localStorage.getItem('token');
    if (!token) return { status: 'offline' };
    
    try {
      const response = await fetch(`${API_URL}/v1/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        throw new Error('Sync failed');
      }
      return await response.json();
    } catch (e) {
      console.warn('Sync failed, queuing offline.', e);
      return { status: 'offline' };
    }
  },

  pullState: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    
    const response = await fetch(`${API_URL}/v1/sync/pull`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Pull failed');
    return await response.json();
  },

  migrateState: async (payload: SyncPayload) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    
    const response = await fetch(`${API_URL}/v1/sync/migrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Migration failed');
    return await response.json();
  }
};
