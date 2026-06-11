import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Award, Zap, Shield } from 'lucide-react';
import { FloatingXP } from '../ui/FloatingXP';
import { useToastStore } from '../../store/toastStore';
import { motion } from 'framer-motion';

const getRankTitle = (level: number) => {
  if (level >= 50) return 'Python Master';
  if (level >= 20) return 'Python Knight';
  if (level >= 10) return 'Adventurer';
  if (level >= 5) return 'Explorer';
  return 'Beginner';
};

export const UserOverview: React.FC = () => {
  const [xp, setXp] = useState(1200);
  const [level, setLevel] = useState(5);
  const [xpTrigger, setXpTrigger] = useState(0);
  const addToast = useToastStore((state) => state.addToast);

  const xpNeeded = level * 500;
  const progress = (xp / xpNeeded) * 100;

  const handleGainXP = () => {
    const gained = 50;
    const newXp = xp + gained;
    setXpTrigger(prev => prev + 1);
    
    addToast({
      type: 'xp',
      title: 'Quest Progress!',
      xpAmount: gained
    });

    if (newXp >= xpNeeded) {
      setXp(newXp - xpNeeded);
      setLevel(l => l + 1);
      addToast({
        type: 'achievement',
        title: `Level Up! Reached Level ${level + 1}`,
        icon: '🎉'
      });
    } else {
      setXp(newXp);
    }
  };

  return (
    <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-slate-900 border-slate-700/50 shadow-2xl relative overflow-hidden group">
      {/* Dynamic background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />
      
      <div className="relative">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGainXP}
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 p-1 shadow-2xl shadow-blue-900/50 cursor-pointer relative z-10 border-2 border-slate-600 hover:border-blue-500 transition-colors"
        >
          <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden relative">
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=hero&backgroundColor=transparent`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <FloatingXP amount={50} triggerKey={xpTrigger} />
        </motion.button>
        <div className="absolute -bottom-3 -right-3 z-20">
          <Badge variant="warning" size="md" icon={<Award className="w-4 h-4" />} className="shadow-lg">
            Lv {level}
          </Badge>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left w-full mt-2 md:mt-0 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 justify-center md:justify-start">
              PyMaster99
              <Shield className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-1">
              {getRankTitle(level)}
            </p>
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <Badge variant="purple" icon={<Zap className="w-3 h-3" />}>3 Day Streak</Badge>
          </div>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/50 mt-4 md:mt-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-end mb-3 relative z-10">
            <span className="text-sm font-bold text-slate-200">Level {level} Progress</span>
            <span className="text-xs font-bold text-amber-400">{xp} / {xpNeeded} XP</span>
          </div>
          <ProgressBar progress={progress} color="bg-gradient-to-r from-amber-500 to-yellow-400" height="h-3" className="relative z-10" />
          <p className="text-xs text-slate-400 mt-3 font-medium relative z-10">
            Earn <strong className="text-white">{xpNeeded - xp}</strong> more XP to reach Level {level + 1}
          </p>
        </div>
      </div>
    </Card>
  );
};
