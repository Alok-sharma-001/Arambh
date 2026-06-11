import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Lock, Unlock, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MapNodeProps {
  id: number;
  title: string;
  description: string;
  isLocked: boolean;
  completion: number;
  xpReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const MapNode: React.FC<MapNodeProps> = ({ 
  title, 
  description, 
  isLocked, 
  completion, 
  xpReward, 
  difficulty 
}) => {
  const difficultyColors = {
    Beginner: "emerald",
    Intermediate: "amber",
    Advanced: "red",
  } as const;

  return (
    <motion.div whileHover={!isLocked ? { scale: 1.05 } : {}}>
      <Card 
        className={`p-6 relative border-2 transition-all duration-300 ${
          isLocked ? 'border-slate-800 bg-slate-900/50 opacity-75' : 'border-blue-500/30 cursor-pointer hover:border-blue-500'
        }`}
        glowEffect={!isLocked}
      >
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center bg-slate-900 border-2 border-slate-800">
          {isLocked ? (
            <Lock className="w-5 h-5 text-slate-500" />
          ) : (
            <Unlock className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-slate-500' : 'text-white'}`}>
          {title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={difficultyColors[difficulty]} icon={<Star className="w-3 h-3" />}>
            {difficulty}
          </Badge>
          <Badge variant="warning" icon={<Zap className="w-3 h-3" />}>
            {xpReward} XP
          </Badge>
        </div>
        
        {!isLocked && (
          <div className="mt-auto">
            <ProgressBar progress={completion} showLabel />
          </div>
        )}
      </Card>
    </motion.div>
  );
};
