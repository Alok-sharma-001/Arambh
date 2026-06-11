import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Target, Zap, CheckCircle2 } from 'lucide-react';

export interface QuestCardProps {
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  completed: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  progress,
  target,
  xpReward,
  difficulty,
  completed
}) => {
  const percentage = (progress / target) * 100;
  
  const difficultyColors = {
    Easy: "emerald",
    Medium: "blue",
    Hard: "amber",
    Epic: "purple",
  } as const;

  return (
    <Card className="p-6 h-full flex flex-col justify-between" hoverEffect>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${completed ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
              {completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Target className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                {title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <Badge variant={difficultyColors[difficulty]} size="sm">
            {difficulty}
          </Badge>
          <Badge variant="warning" size="sm" icon={<Zap className="w-3 h-3" />}>
            {xpReward} XP
          </Badge>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm font-semibold mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-white">{progress} / {target}</span>
        </div>
        <ProgressBar 
          progress={percentage} 
          color={completed ? "bg-emerald-500" : "bg-blue-500"} 
          height="h-2" 
        />
      </div>
    </Card>
  );
};
