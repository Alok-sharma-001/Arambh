import React from 'react';
import { useArtifacts } from '../../hooks/useArtifacts';

interface CollectionTrackerProps {
  showLabel?: boolean;
}

export const CollectionTracker: React.FC<CollectionTrackerProps> = ({ showLabel = true }) => {
  const { collectedCount, totalCount, progressPercent } = useArtifacts();

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        {showLabel && <span className="text-sm font-bold text-slate-300">Artifacts Found</span>}
        <span className="text-xs font-black text-white">
          {collectedCount} / {totalCount} <span className="text-slate-500 font-medium ml-1">({Math.round(progressPercent)}%)</span>
        </span>
      </div>
      <div className="w-full h-2.5 bg-[#0D0D12] rounded-full overflow-hidden border border-[#181820]">
        <div 
          className="h-full bg-gradient-to-r from-game-purple to-indigo-500 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Shine effect */}
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
};
