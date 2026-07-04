import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Scroll, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToastStore } from '../../store/toastStore';

export const DailyGoals: React.FC = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Run 3 programs', progress: 1, target: 3, completed: false, xp: 50 },
    { id: 2, title: 'Complete a lesson', progress: 1, target: 1, completed: true, xp: 100 },
    { id: 3, title: 'Earn 150 XP today', progress: 50, target: 150, completed: false, xp: 75 },
  ]);

  const addToast = useToastStore((state) => state.addToast);

  const simulateProgress = (id: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id && !g.completed) {
        const newProgress = Math.min(g.progress + 1, g.target);
        const isNowCompleted = newProgress >= g.target;
        
        if (isNowCompleted) {
          addToast({
            type: 'achievement',
            title: 'Quest Completed!',
            description: g.title,
            xpAmount: g.xp
          });
        }
        
        return { ...g, progress: newProgress, completed: isNowCompleted };
      }
      return g;
    }));
  };

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gold/10 rounded-lg border border-gold/20">
            <Scroll className="w-5 h-5 text-gold" />
          </div>
          <h3 className="text-lg font-bold text-warm-white">Daily Quests</h3>
        </div>
        <span className="text-xs text-slate-500">Resets in 12h</span>
      </div>

      <div className="space-y-2.5 flex-1 mt-auto">
        {goals.map(goal => (
          <motion.div 
            key={goal.id} 
            layout
            className={`group p-2.5 rounded-lg border transition-apple-fast cursor-pointer ${
              goal.completed 
                ? 'bg-emerald-500/5 border-emerald-500/10 opacity-70'
                : 'bg-[#111111]/50 border-warm-white/10 hover:bg-[#111111] hover:border-gold/30'
            }`}
            onClick={() => simulateProgress(goal.id)}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2.5">
                <motion.div 
                  initial={false}
                  animate={{ scale: goal.completed ? [1, 1.15, 1] : 1 }}
                  className="shrink-0"
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded border border-slate-600 group-hover:border-gold transition-colors" />
                  )}
                </motion.div>
                <span className={`text-xs font-semibold ${goal.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {goal.title}
                </span>
              </div>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                goal.completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
                +{goal.xp} XP
              </span>
            </div>
            {!goal.completed && (
              <div className="pl-6.5 mt-1.5">
                <div className="flex justify-between text-[8px] font-bold text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress} / {goal.target}</span>
                </div>
                <ProgressBar 
                  progress={(goal.progress / goal.target) * 100} 
                  color="bg-gold" 
                  height="h-1" 
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
