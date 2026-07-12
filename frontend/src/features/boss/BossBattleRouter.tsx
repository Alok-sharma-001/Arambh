import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { analyticsApi } from '@/services/analyticsApi';
import BossArena from './BossArena';
import { ProgressValidator } from '../../core/progression/ProgressValidator';
import { useProgressionStore } from '../../store/progressionStore';

export default function BossBattleRouter() {
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  const inventory = useProgressionStore((state) => state.inventory);

  const isUnlocked = useMemo(() => {
    if (!regionId) return false;
    return ProgressValidator.isBossUnlocked(regionId);
  }, [regionId]);

  useEffect(() => {
    if (regionId) {
      analyticsApi.logEvent('boss_attempt', { region_id: regionId });
    }
  }, [regionId]);

  useEffect(() => {
    if (regionId && !isUnlocked) {
      console.warn(`BossBattleRouter: Blocked locked boss access for region ${regionId}`);
      navigate('/world-map', { replace: true });
    }
  }, [regionId, isUnlocked, navigate]);

  if (!regionId) {
    return <Navigate to="/world-map" replace />;
  }

  if (!isUnlocked) {
    return <Navigate to="/world-map" replace />;
  }

  // Final boss gate seal check (requires all 10 artifacts)
  if (regionId === 'bossgate-saga' && inventory.length < 10) {
    return (
      <div className="min-h-screen bg-[#050505] p-8 flex items-center justify-center font-sans">
        <div className="max-w-2xl text-center bg-red-900/10 border border-red-500/30 p-12 rounded-3xl backdrop-blur-md">
          <h1 className="text-4xl font-black text-red-400 mb-4 tracking-tight">The Boss Gate is Sealed</h1>
          <p className="text-xl text-red-200/80 mb-8 font-light">
            You must collect all 10 artifacts to break the seal. Return when you have gathered the artifacts of mastery.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-red-400 font-bold uppercase tracking-widest text-sm">Artifacts Collected:</span>
            <span className="text-2xl font-black text-white">{inventory.length} / 10</span>
          </div>
          <button 
            onClick={() => navigate('/world-map')}
            className="px-8 py-4 bg-red-600/20 text-red-400 font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-red-600/40 border border-red-500/50 transition-all"
          >
            Return to World Map
          </button>
        </div>
      </div>
    );
  }

  return <BossArena regionId={regionId} />;
}
