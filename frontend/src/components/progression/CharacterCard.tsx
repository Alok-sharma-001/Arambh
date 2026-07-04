import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { RankBadge } from '../progression/RankBadge';
import { XPToast } from '../progression/XPToast';
import { useProgression } from '../../hooks/useProgression';
import { useAuthStore } from '../../store/authStore';
import { Award, Zap, Gift, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export const CharacterCard: React.FC = () => {
  const { 
    level, xpIntoLevel, xpNeeded, xpPercent,
    rank, playerClass, nextReward,
    stats, isLoading, gainXP
  } = useProgression();
  const { user } = useAuthStore();
  const AVATAR_STYLES = ['adventurer', 'bottts', 'avataaars', 'lorelei', 'micah'];
  const [avatarStyleIdx, setAvatarStyleIdx] = useState(() => {
    return parseInt(localStorage.getItem('arambh_avatar_style') || '0', 10);
  });
  
  const handleAvatarChange = () => {
    const nextIdx = (avatarStyleIdx + 1) % AVATAR_STYLES.length;
    setAvatarStyleIdx(nextIdx);
    localStorage.setItem('arambh_avatar_style', nextIdx.toString());
  };

  if (isLoading || !stats) {
    return <Card className="p-8 h-48 animate-pulse" />;
  }

  const currentStyle = AVATAR_STYLES[avatarStyleIdx];

  return (
    <Card className="p-5 flex flex-col md:flex-row items-center md:items-stretch gap-6 relative overflow-hidden group h-full">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-colors duration-700" />

      {/* Avatar + Level Badge */}
      <div className="relative flex flex-col justify-center items-center flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAvatarChange}
          title="Click to choose a different avatar style"
          className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#0A0A0A] to-[#111111] p-1 shadow-2xl shadow-gold/20 cursor-pointer relative z-10 border border-warm-white/10 hover:border-gold/40 transition-colors group/avatar"
        >
          <div className="w-full h-full bg-near-black rounded-xl flex items-center justify-center overflow-hidden relative">
            <img
              src={`https://api.dicebear.com/7.x/${currentStyle}/svg?seed=${user?.username || 'hero'}&backgroundColor=transparent`}
              alt="Avatar"
              className="w-full h-full object-cover transition-opacity"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[10px] font-bold text-warm-white uppercase tracking-wider">Change</span>
            </div>
          </div>
        </motion.button>
        <div className="absolute -bottom-2 -right-2 z-20">
          <Badge variant="warning" size="md" icon={<Award className="w-3.5 h-3.5" />} className="shadow-lg py-0.5">
            Lv {level}
          </Badge>
        </div>
      </div>

      {/* Info Panel */}
      <div className="flex-1 flex flex-col justify-between text-center md:text-left w-full mt-1 md:mt-0 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2 justify-center md:justify-start">
              {user?.username || 'Player'}
            </h2>
            <div className="flex gap-2 items-center justify-center md:justify-start mt-0.5 flex-wrap">
              <RankBadge rank={rank} />
              {playerClass && (
                <>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-slate-400 font-medium text-xs">{playerClass}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <Badge variant="warning" icon={<Flame className="w-3.5 h-3.5" />}>
              {stats.streak_days} Day Streak
            </Badge>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-black/40 p-4 rounded-xl border border-warm-white/10 mt-3 md:mt-auto shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-end mb-2 relative z-10">
            <span className="text-xs font-bold text-slate-200">Level {level} Progress</span>
            <span className="text-xs font-bold text-amber-400">{xpIntoLevel} / {xpNeeded} XP</span>
          </div>
          <ProgressBar progress={xpPercent} color="bg-gradient-to-r from-amber-500 to-yellow-400" height="h-2" className="relative z-10" />
          
          {/* Next Reward Preview */}
          <div className="flex justify-between items-center mt-2 relative z-10">
            <p className="text-[11px] text-slate-400 font-medium">
              <strong className="text-white">{xpNeeded - xpIntoLevel}</strong> XP to Level {level + 1}
            </p>
            {nextReward && (
              <div className="flex items-center gap-1.5 text-xs text-gold font-bold">
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
