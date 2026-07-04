import React from 'react';
import { Card } from '../ui/Card';
import { RankBadge } from '../progression/RankBadge';
import { useProgression } from '../../hooks/useProgression';
import { TrendingUp, Star, Gift, ChevronRight } from 'lucide-react';

export const ProgressionWidget: React.FC = () => {
  const { level, totalXP, xpIntoLevel, xpNeeded, xpPercent, rank, nextReward, unlockedRewards } = useProgression();

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-1.5 bg-gold/10 rounded-lg border border-gold/20">
          <TrendingUp className="w-5 h-5 text-gold" />
        </div>
        <h3 className="text-lg font-bold text-warm-white">Progression</h3>
      </div>

      <div className="space-y-3">
        {/* Current Level */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111]/50 border border-warm-white/10">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold text-slate-300">Level</span>
          </div>
          <span className="text-sm font-black text-white">{level}</span>
        </div>

        {/* Rank */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111]/50 border border-warm-white/10">
          <span className="text-xs font-semibold text-slate-300">Rank</span>
          <RankBadge rank={rank} size="sm" />
        </div>

        {/* XP */}
        <div className="p-2.5 rounded-lg bg-[#111111]/50 border border-warm-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">XP</span>
            <span className="text-xs font-bold text-amber-400">{totalXP.toLocaleString()}</span>
          </div>
          <div className="w-full bg-[#0A0A0A] rounded-full h-1.5 border border-warm-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-500 mt-1">{xpIntoLevel} / {xpNeeded} to next level</p>
        </div>

        {nextReward && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111]/50 border border-warm-white/10">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-gold" />
              <div>
                <p className="text-[9px] text-slate-500">Next Reward</p>
                <p className="text-xs font-bold text-white">{nextReward.icon} {nextReward.name}</p>
              </div>
            </div>
            <div className="flex items-center text-[10px] text-slate-500">
              Lv {nextReward.level}
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Unlocked Count */}
        <div className="text-center pt-2 border-t border-warm-white/10">
          <span className="text-xs text-slate-500">
            {unlockedRewards.length} reward{unlockedRewards.length !== 1 ? 's' : ''} unlocked
          </span>
        </div>
      </div>
    </Card>
  );
};
