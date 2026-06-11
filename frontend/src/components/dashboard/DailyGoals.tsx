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
    <Card className="p-6 h-full flex flex-col bg-slate-900 border-slate-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Scroll className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Daily Quests</h3>
        </div>
        <span className="text-xs font-bold text-slate-400">Resets in 12h</span>
      </div>

      <div className="space-y-4 flex-1">
        {goals.map(goal => (
          <motion.div 
            key={goal.id} 
            layout
            className={`group p-4 rounded-xl border transition-all cursor-pointer ${
              goal.completed 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
            }`}
            onClick={() => simulateProgress(goal.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={false}
                  animate={{ scale: goal.completed ? [1, 1.2, 1] : 1 }}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-slate-600 group-hover:border-blue-400 transition-colors" />
                  )}
                </motion.div>
                <span className={`font-semibold ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                  {goal.title}
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                goal.completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
                +{goal.xp} XP
              </span>
            </div>
            {!goal.completed && (
              <div className="pl-8">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress} / {goal.target}</span>
                </div>
                <ProgressBar 
                  progress={(goal.progress / goal.target) * 100} 
                  color="bg-blue-500" 
                  height="h-1.5" 
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
