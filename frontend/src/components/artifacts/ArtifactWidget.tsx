import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { CollectionTracker } from './CollectionTracker';
import { useArtifacts } from '../../hooks/useArtifacts';
import { ChevronRight, Lock } from 'lucide-react';

export const ArtifactWidget: React.FC = () => {
  const { nextArtifact, hasAllArtifacts } = useArtifacts();
  const navigate = useNavigate();

  return (
    <Card 
      onClick={() => navigate('/inventory')}
      className="p-4 cursor-pointer group relative overflow-hidden h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-warm-white">Collection</h3>
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-gold transition-colors" />
      </div>

      <div className="relative z-10 mb-6">
        <CollectionTracker />
      </div>

      <div className="mt-auto relative z-10">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Next Artifact</p>
        {hasAllArtifacts ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
             <span className="text-sm font-bold">All Artifacts Collected!</span>
          </div>
        ) : nextArtifact ? (
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#111111]/50 border border-warm-white/10">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${nextArtifact.bg}`}>
              <nextArtifact.icon className={`w-5 h-5 ${nextArtifact.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{nextArtifact.name}</p>
              <p className="text-xs text-slate-500">Unlocks at Level {nextArtifact.unlockLevel}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#111111]/50 border border-warm-white/10">
             <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800/50">
                <Lock className="w-5 h-5 text-slate-600" />
             </div>
             <p className="text-sm text-slate-500">Unknown</p>
          </div>
        )}
      </div>

      {/* Hover glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-colors" />
    </Card>
  );
};
