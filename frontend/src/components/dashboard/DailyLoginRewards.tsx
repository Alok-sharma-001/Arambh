import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Calendar, Gift, Check, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { playSound } from '../../utils/audio';
import { useProgressionStore } from '../../store/progressionStore';
import { progressionApi } from '../../services/progressionApi';

interface RewardDay {
  day: number;
  xp: number;
  rewardType: 'xp' | 'chest';
  title: string;
}

const REWARDS: RewardDay[] = [
  { day: 1, xp: 25, rewardType: 'xp', title: 'Day 1' },
  { day: 2, xp: 50, rewardType: 'xp', title: 'Day 2' },
  { day: 3, xp: 75, rewardType: 'xp', title: 'Day 3' },
  { day: 4, xp: 100, rewardType: 'xp', title: 'Day 4' },
  { day: 5, xp: 125, rewardType: 'xp', title: 'Day 5' },
  { day: 6, xp: 150, rewardType: 'xp', title: 'Day 6' },
  { day: 7, xp: 250, rewardType: 'chest', title: 'Artifact Chest' },
];

export const DailyLoginRewards: React.FC = () => {
  const stats = useProgressionStore((s) => s.stats);
  const { fetchProgression } = useProgressionStore();
  const { user } = useAuthStore();
  const [claimedDays, setClaimedDays] = useState<number[]>([]);
  const [canClaimToday, setCanClaimToday] = useState(false);
  const [nextClaimableDay, setNextClaimableDay] = useState(1);

  const storageKey = user ? `daily_login_rewards_${user.username}` : 'daily_login_rewards_guest';

  useEffect(() => {
    if (!stats) return;

    const streak = stats.daily_streak || 0;
    const lastClaim = stats.last_claimed_at ? new Date(stats.last_claimed_at).getTime() : null;
    const now = Date.now();

    if (!lastClaim) {
      setClaimedDays([]);
      setCanClaimToday(true);
      setNextClaimableDay(1);
      return;
    }

    const msSinceLastClaim = now - lastClaim;
    const hoursSinceLastClaim = msSinceLastClaim / (1000 * 60 * 60);

    const isStreakBroken = hoursSinceLastClaim > 48;
    const canClaim = hoursSinceLastClaim >= 21;

    setCanClaimToday(canClaim);

    if (isStreakBroken) {
      setClaimedDays([]);
      setNextClaimableDay(1);
    } else {
      const currentCycleDay = ((streak - 1) % 7) + 1;
      
      if (canClaim) {
        if (currentCycleDay === 7) {
          setClaimedDays([]);
          setNextClaimableDay(1);
        } else {
          const claimed = Array.from({ length: currentCycleDay }, (_, i) => i + 1);
          setClaimedDays(claimed);
          setNextClaimableDay(currentCycleDay + 1);
        }
      } else {
        const claimed = Array.from({ length: currentCycleDay }, (_, i) => i + 1);
        setClaimedDays(claimed);
        setNextClaimableDay(currentCycleDay === 7 ? 8 : currentCycleDay + 1);
      }
    }
  }, [stats]);

  const handleClaim = async (dayConfig: RewardDay) => {
    if (!canClaimToday || dayConfig.day !== nextClaimableDay) return;

    playSound.success();

    try {
      await progressionApi.claimDailyReward();
      await fetchProgression();
      
      // Mirror state to localStorage for offline cache
      const updatedStreak = (stats?.daily_streak || 0) + 1;
      const cycleDay = ((updatedStreak - 1) % 7) + 1;
      const newClaimed = Array.from({ length: cycleDay }, (_, i) => i + 1);
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          claimed: newClaimed,
          lastClaim: Date.now(),
        })
      );
    } catch (e) {
      console.warn("Failed to claim daily reward on backend:", e);
    }
  };

  return (
    <Card className="w-full p-4 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Glow background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gold/10 rounded-lg border border-gold/20">
            <Calendar className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-warm-white leading-tight">Daily Rewards</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Login Calendar</p>
          </div>
        </div>

        {canClaimToday && nextClaimableDay <= 7 && (
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <button
              onClick={() => handleClaim(REWARDS[nextClaimableDay - 1])}
              className="px-3 py-1.5 rounded-lg bg-game-gold text-black font-extrabold text-[10px] uppercase tracking-wider hover:bg-game-gold/90 transition-all shadow-[0_0_12px_rgba(251,191,36,0.2)]"
            >
              Claim Day {nextClaimableDay}
            </button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 relative z-10 mt-auto">
        {REWARDS.map((item) => {
          const isClaimed = claimedDays.includes(item.day);
          const isCurrent = item.day === nextClaimableDay && canClaimToday;
          const isUpcoming = item.day > nextClaimableDay || (item.day === nextClaimableDay && !canClaimToday);

          return (
            <div
              key={item.day}
              onClick={() => isCurrent && handleClaim(item)}
              className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center transition-apple-fast relative ${
                isClaimed
                  ? 'border-emerald-500/15 bg-emerald-500/5 opacity-70'
                  : isCurrent
                  ? 'border-game-gold bg-game-gold/5 cursor-pointer shadow-[0_0_8px_rgba(251,191,36,0.05)] hover:scale-[1.02]'
                  : 'border-warm-white/10 bg-black/40'
              }`}
            >
              <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
                Day {item.day}
              </span>

              <div className="my-1.5">
                {isClaimed ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                ) : item.rewardType === 'chest' ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isCurrent ? 'bg-gold/20 border border-gold/50' : 'bg-slate-800/40 border border-slate-700/50'}`}>
                    <Gift className={`w-3.5 h-3.5 ${isCurrent ? 'text-gold animate-bounce' : 'text-slate-400'}`} />
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isCurrent ? 'bg-game-gold/20 border border-game-gold/50' : 'bg-slate-800/40 border border-slate-700/50'}`}>
                    <Sparkles className={`w-3.5 h-3.5 ${isCurrent ? 'text-game-gold animate-pulse' : 'text-slate-400'}`} />
                  </div>
                )}
              </div>

              <span className={`text-[9px] font-extrabold ${isClaimed ? 'text-emerald-400/80' : isCurrent ? 'text-game-gold' : 'text-slate-400'}`}>
                {item.rewardType === 'chest' ? 'Chest' : `+${item.xp}`}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
