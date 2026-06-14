import { syncApi, SyncPayload } from './syncApi';
import { useLessonStore } from '../store/lessonStore';
import { useRegionStore } from '../store/regionStore';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { useTowerStore } from '../store/towerStore';
import { useProgressionStore } from '../store/progressionStore';

export const syncManager = {
  /** Pulls state from the server and hydrates local stores */
  pullAndHydrate: async () => {
    try {
      const data = await syncApi.pullState();
      
      if (data.lessons) useLessonStore.getState().hydrate(data.lessons);
      if (data.regions) useRegionStore.getState().hydrate(data.regions);
      if (data.knowledge_graph) useKnowledgeStore.getState().hydrate(data.knowledge_graph);
      if (data.tower_progress) useTowerStore.getState().hydrate(data.tower_progress);
      
      // Progression store (stats/inventory) is currently hydrated via its own fetchProgression()
      // We can also hydrate it here if we want to unify, but for now we focus on the newly wired stores.
      console.log('✅ Local state successfully hydrated from Arambh cloud.');
    } catch (e) {
      console.warn('⚠️ Cloud sync pull failed. Using local state.', e);
    }
  },

  /** Aggregates current local state and pushes to the server */
  performBackgroundSync: async () => {
    try {
      const lessonState = useLessonStore.getState().progress;
      const regionState = useRegionStore.getState().regions;
      const knowledgeState = useKnowledgeStore.getState().graph;
      const towerState = useTowerStore.getState().progress;

      const payload: SyncPayload = {
        timestamp: new Date().toISOString(),
        lessons: Object.values(lessonState).map(l => ({
          lesson_id: String(l.lessonId),
          status: l.status,
          stages_completed: l.stagesCompleted || [],
          completed_at: l.status === 'completed' ? new Date().toISOString() : null,
          code_snapshot: null
        })),
        regions: Object.entries(regionState).map(([id, reg]) => ({
          region_id: id,
          status: reg.regionStatus,
          boss_defeated: reg.bossStatus === 'completed',
          completed_at: reg.regionStatus === 'completed' ? new Date().toISOString() : null
        })),
        knowledge_graph: knowledgeState,
        tower_progress: towerState
      };

      await syncApi.pushState(payload);
    } catch (e) {
      console.warn('⚠️ Background sync push failed. Changes saved locally.', e);
    }
  }
};
