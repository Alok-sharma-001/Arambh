import React from 'react';
import { Card } from '../ui/Card';
import { RankBadge } from '../progression/RankBadge';
import { useProgression } from '../../hooks/useProgression';
import { TrendingUp, Star, Gift, ChevronRight } from 'lucide-react';

export const ProgressionWidget: React.FC = () => {
  const { level, totalXP, xpIntoLevel, xpNeeded, xpPercent, rank, nextReward, unlockedRewards } = useProgression();

  return (
    <Card className="p-6 h-full bg-[#0D0D12] border-[#181820]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-game-gold/10 rounded-xl border border-game-gold/20">
          <TrendingUp className="w-5 h-5 text-game-gold" />
        </div>
        <h3 className="text-xl font-bold text-white">Progression</h3>
      </div>

      <div className="space-y-4">
        {/* Current Level */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#13131A] border border-[#181820]">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-game-gold" />
            <span className="text-sm font-medium text-slate-300">Level</span>
          </div>
          <span className="text-lg font-black text-white">{level}</span>
        </div>

        {/* Rank */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#13131A] border border-[#181820]">
          <span className="text-sm font-medium text-slate-300">Rank</span>
          <RankBadge rank={rank} size="sm" />
        </div>

        {/* XP */}
        <div className="p-3 rounded-xl bg-[#13131A] border border-[#181820]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">XP</span>
            <span className="text-xs font-bold text-amber-400">{totalXP.toLocaleString()}</span>
          </div>
          <div className="w-full bg-[#0D0D12] rounded-full h-2 border border-[#181820]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">{xpIntoLevel} / {xpNeeded} to next level</p>
        </div>

        {/* Next Reward */}
        {nextReward && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#13131A] border border-[#181820]">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-game-purple" />
              <div>
                <p className="text-xs text-slate-500">Next Reward</p>
                <p className="text-sm font-bold text-white">{nextReward.icon} {nextReward.name}</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-slate-500">
              Lv {nextReward.level}
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Unlocked Count */}
        <div className="text-center pt-2 border-t border-[#181820]">
          <span className="text-xs text-slate-500">
            {unlockedRewards.length} reward{unlockedRewards.length !== 1 ? 's' : ''} unlocked
          </span>
        </div>
      </div>
    </Card>
  );
};
