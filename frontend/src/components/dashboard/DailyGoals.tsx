import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Target, CheckCircle2 } from 'lucide-react';

const goals = [
  { id: 1, title: 'Complete 1 Lesson', progress: 100, target: 100, completed: true, xp: 20 },
  { id: 2, title: 'Earn 50 XP today', progress: 30, target: 50, completed: false, xp: 15 },
  { id: 3, title: 'Solve 3 Challenges', progress: 33, target: 100, completed: false, xp: 30 },
];

export const DailyGoals: React.FC = () => {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Target className="w-5 h-5 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Daily Goals</h3>
      </div>

      <div className="space-y-5 flex-1">
        {goals.map(goal => (
          <div key={goal.id} className="group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {goal.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-slate-500 transition-colors" />
                )}
                <span className={`font-medium ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                  {goal.title}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                +{goal.xp} XP
              </span>
            </div>
            {!goal.completed && (
              <ProgressBar 
                progress={goal.progress} 
                color="bg-amber-500" 
                height="h-1.5" 
                className="mt-2 ml-7 w-[calc(100%-1.75rem)]" 
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
