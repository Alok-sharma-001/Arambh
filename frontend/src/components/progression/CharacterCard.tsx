import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { RankBadge } from '../progression/RankBadge';
import { XPToast } from '../progression/XPToast';
import { useProgression } from '../../hooks/useProgression';
import { useAuthStore } from '../../store/authStore';
import { Award, Zap, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export const CharacterCard: React.FC = () => {
  const { 
    level, xpIntoLevel, xpNeeded, xpPercent,
    rank, playerClass, nextReward,
    stats, isLoading, gainXP
  } = useProgression();
  const { user } = useAuthStore();
  const [xpTrigger, setXpTrigger] = useState(0);

  const handleGainXP = async () => {
    setXpTrigger(prev => prev + 1);
    await gainXP('MANUAL_CLICK', 'Avatar Click');
  };

  if (isLoading || !stats) {
    return <Card className="p-8 h-48 animate-pulse bg-[#0D0D12]" />;
  }

  return (
    <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#0D0D12] border-[#181820] shadow-2xl relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-game-purple/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-game-purple/20 transition-colors duration-700" />

      {/* Avatar + Level Badge */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGainXP}
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#13131A] to-[#181820] p-1 shadow-2xl shadow-game-purple/50 cursor-pointer relative z-10 border-2 border-[#181820] hover:border-game-purple transition-colors"
        >
          <div className="w-full h-full bg-[#0D0D12] rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'hero'}&backgroundColor=transparent`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <XPToast amount={50} triggerKey={xpTrigger} />
        </motion.button>
        <div className="absolute -bottom-3 -right-3 z-20">
          <Badge variant="warning" size="md" icon={<Award className="w-4 h-4" />} className="shadow-lg">
            Lv {level}
          </Badge>
        </div>
      </div>

      {/* Info Panel */}
      <div className="flex-1 text-center md:text-left w-full mt-2 md:mt-0 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 justify-center md:justify-start">
              {user?.username || 'Player'}
            </h2>
            <div className="flex gap-2 items-center justify-center md:justify-start mt-1 flex-wrap">
              <RankBadge rank={rank} />
              {playerClass && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-medium text-xs">{playerClass}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <Badge variant="purple" icon={<Zap className="w-3 h-3" />}>
              {stats.streak_days} Day Streak
            </Badge>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-[#13131A]/80 p-5 rounded-2xl border border-[#181820] mt-4 md:mt-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-end mb-3 relative z-10">
            <span className="text-sm font-bold text-slate-200">Level {level} Progress</span>
            <span className="text-xs font-bold text-amber-400">{xpIntoLevel} / {xpNeeded} XP</span>
          </div>
          <ProgressBar progress={xpPercent} color="bg-gradient-to-r from-amber-500 to-yellow-400" height="h-3" className="relative z-10" />
          
          {/* Next Reward Preview */}
          <div className="flex justify-between items-center mt-3 relative z-10">
            <p className="text-xs text-slate-400 font-medium">
              <strong className="text-white">{xpNeeded - xpIntoLevel}</strong> XP to Level {level + 1}
            </p>
            {nextReward && (
              <div className="flex items-center gap-1.5 text-xs text-game-purple font-bold">
                <Gift className="w-3 h-3" />
                <span>Next: {nextReward.icon} {nextReward.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
