import { create } from 'zustand';
import api from '../services/api';

export interface Revision {
  concept_id: string;
  next_review_date: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
}

interface RevisionStore {
  revisions: Record<string, Revision>;
  dueConcepts: string[];
  isLoading: boolean;
  
  fetchDueRevisions: () => Promise<void>;
  submitReview: (conceptId: string, quality: number) => Promise<void>;
  setRevisions: (revisions: Revision[]) => void;
  getDueCount: () => number;
}

export const useRevisionStore = create<RevisionStore>((set, get) => ({
  revisions: {},
  dueConcepts: [],
  isLoading: false,

  fetchDueRevisions: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/v1/revisions/due');
      const dueRevs: Revision[] = response.data;
      
      const dueIds = dueRevs.map(r => r.concept_id);
      
      set((state) => {
        const newRevisions = { ...state.revisions };
        dueRevs.forEach(r => {
          newRevisions[r.concept_id] = r;
        });
        
        return {
          revisions: newRevisions,
          dueConcepts: dueIds,
          isLoading: false
        };
      });
    } catch (error) {
      console.error('Failed to fetch due revisions', error);
      set({ isLoading: false });
    }
  },

  submitReview: async (conceptId: string, quality: number) => {
    try {
      const response = await api.post('/v1/revisions/review', {
        concept_id: conceptId,
        quality
      });
      
      const updatedRev: Revision = response.data;
      
      set((state) => {
        const newRevisions = { ...state.revisions, [conceptId]: updatedRev };
        // Remove from due list
        const newDue = state.dueConcepts.filter(id => id !== conceptId);
        
        return {
          revisions: newRevisions,
          dueConcepts: newDue
        };
      });
    } catch (error) {
      console.error('Failed to submit review', error);
      throw error;
    }
  },

  setRevisions: (revisions: Revision[]) => {
    const revMap: Record<string, Revision> = {};
    const dueIds: string[] = [];
    const now = new Date();
    
    revisions.forEach(r => {
      revMap[r.concept_id] = r;
      if (new Date(r.next_review_date) <= now) {
        dueIds.push(r.concept_id);
      }
    });
    
    set({ revisions: revMap, dueConcepts: dueIds });
  },
  
  getDueCount: () => get().dueConcepts.length,
}));
