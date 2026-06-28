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
    <Card className="w-full p-6 bg-[#0D0D12]/90 border border-slate-800/80 rounded-2xl relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-game-purple/5 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-game-purple mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">Daily Rewards</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Daily Login Calendar</h2>
          <p className="text-xs text-slate-400 mt-1">
            Claim daily XP bonuses and progress towards the legendary Artifact Chest on Day 7!
          </p>
        </div>

        {canClaimToday && nextClaimableDay <= 7 && (
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <button
              onClick={() => handleClaim(REWARDS[nextClaimableDay - 1])}
              className="px-6 py-2.5 rounded-xl bg-game-gold text-black font-extrabold text-xs uppercase tracking-wider hover:bg-game-gold/90 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
              Claim Day {nextClaimableDay} Reward
            </button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
        {REWARDS.map((item) => {
          const isClaimed = claimedDays.includes(item.day);
          const isCurrent = item.day === nextClaimableDay && canClaimToday;
          const isUpcoming = item.day > nextClaimableDay || (item.day === nextClaimableDay && !canClaimToday);

          return (
            <div
              key={item.day}
              onClick={() => isCurrent && handleClaim(item)}
              className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center transition-all duration-300 relative ${
                isClaimed
                  ? 'border-emerald-500/20 bg-emerald-500/5 opacity-70'
                  : isCurrent
                  ? 'border-game-gold bg-game-gold/5 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:scale-[1.03]'
                  : 'border-[#181820] bg-[#101015]/60'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {item.title}
              </span>

              <div className="my-3">
                {isClaimed ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                ) : item.rewardType === 'chest' ? (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-game-purple/20 border border-game-purple/50' : 'bg-slate-800/40 border border-slate-700/50'}`}>
                    <Gift className={`w-5 h-5 ${isCurrent ? 'text-game-purple animate-bounce' : 'text-slate-400'}`} />
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-game-gold/20 border border-game-gold/50' : 'bg-slate-800/40 border border-slate-700/50'}`}>
                    <Sparkles className={`w-5 h-5 ${isCurrent ? 'text-game-gold animate-pulse' : 'text-slate-400'}`} />
                  </div>
                )}
              </div>

              <span className={`text-xs font-extrabold ${isClaimed ? 'text-emerald-400/80' : isCurrent ? 'text-game-gold' : 'text-slate-400'}`}>
                {item.rewardType === 'chest' ? 'Chest' : `+${item.xp} XP`}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
