import { useEffect, useRef, useState } from 'react';
import { useProgressionStore } from '../../store/progressionStore';
import { useRegionStore } from '../../store/regionStore';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { useTowerStore } from '../../store/towerStore';
import { useLessonStore } from '../../store/lessonStore';
import { syncApi } from '../../services/syncApi';

export const AutoSync = () => {
  const { stats, inventory } = useProgressionStore();
  const regionsState = useRegionStore();
  const knowledgeState = useKnowledgeStore();
  const towerState = useTowerStore();
  const lessonState = useLessonStore();
  const [status, setStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('syncing');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialized = useRef(false);

  // Initial pull hydration
  useEffect(() => {
    const hydrate = async () => {
      try {
        const data = await syncApi.pullState();
        if (data.regions) regionsState.hydrate(data.regions);
        if (data.knowledge_graph) knowledgeState.hydrate(data.knowledge_graph);
        if (data.tower_progress) towerState.hydrate(data.tower_progress);
        if (data.lessons) lessonState.hydrate(data.lessons);
        
        setStatus('synced');
        isInitialized.current = true;
      } catch (e) {
        console.warn('Failed to pull initial state from cloud', e);
        setStatus('offline');
        isInitialized.current = true;
      }
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;
    
    // Debounce the sync
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setStatus('syncing');
    timeoutRef.current = setTimeout(async () => {
      try {
        const regionsSync = Object.entries(regionsState.regions).map(([id, reg]) => ({
          region_id: id,
          status: reg.regionStatus,
          boss_defeated: reg.bossStatus === 'completed',
          completed_at: null
        }));

        const lessonsSync = Object.values(lessonState.progress).map(l => ({
          lesson_id: String(l.lessonId),
          status: l.status,
          stages_completed: l.stagesCompleted || [],
          completed_at: l.status === 'completed' ? new Date().toISOString() : null,
          code_snapshot: null
        }));

        const res = await syncApi.pushState({
          timestamp: new Date().toISOString(),
          stats: stats as any,
          inventory: inventory as any,
          regions: regionsSync,
          lessons: lessonsSync,
          knowledge_graph: knowledgeState.graph as any,
          tower_progress: towerState.progress as any
        });

        if (res.status === 'success') {
          setStatus('synced');
        } else {
          setStatus('offline');
        }
      } catch (e) {
        console.warn(e);
        setStatus('error');
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stats, inventory, regionsState.regions, knowledgeState.graph, towerState.progress, lessonState.progress]);

  // Display status in bottom right corner
  return (
    <div className="fixed bottom-4 right-4 z-50 text-[10px] font-mono flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
      {status === 'synced' && <><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" /> <span className="text-emerald-400">Cloud Synced</span></>}
      {status === 'syncing' && <><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,1)]" /> <span className="text-amber-400">Saving...</span></>}
      {status === 'offline' && <><div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]" /> <span className="text-orange-400">Offline (Local)</span></>}
      {status === 'error' && <><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" /> <span className="text-red-400">Sync Error</span></>}
    </div>
  );
};
