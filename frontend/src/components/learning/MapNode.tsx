import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Lock, Unlock, Star, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MapNodeProps {
  id: number;
  title: string;
  description: string;
  status: 'locked' | 'current' | 'completed';
  completion: number;
  xpReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const MapNode: React.FC<MapNodeProps> = ({ 
  title, 
  description, 
  status, 
  completion, 
  xpReward, 
  difficulty 
}) => {
  const difficultyColors = {
    Beginner: "emerald",
    Intermediate: "amber",
    Advanced: "red",
  } as const;

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  return (
    <motion.div 
      whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
      className="relative group w-full"
    >
      {/* Glow for completed nodes */}
      {isCompleted && (
        <div className="absolute -inset-0.5 bg-emerald-500/20 blur-xl rounded-2xl group-hover:bg-emerald-500/30 transition-all duration-500" />
      )}
      
      {/* Pulse for current node */}
      {isCurrent && (
        <div className="absolute -inset-1 bg-game-purple/30 blur-lg rounded-2xl animate-pulse" />
      )}

      <Card 
        className={`p-6 relative border-2 transition-all duration-300 backdrop-blur-md overflow-hidden ${
          isLocked 
            ? 'border-[#181820] bg-[#0D0D12]/60 grayscale opacity-80' 
            : isCompleted
            ? 'border-emerald-500/50 bg-[#0D0D12] shadow-[0_0_20px_rgba(16,185,129,0.15)] cursor-pointer hover:border-emerald-400'
            : 'border-game-purple/50 bg-[#0D0D12] cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:border-game-purple'
        }`}
      >
        {/* Fog effect for locked nodes */}
        {isLocked && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
             <Lock className="w-12 h-12 text-slate-600 drop-shadow-2xl" />
          </div>
        )}

        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center bg-[#0D0D12] border-2 border-[#181820] z-10 shadow-lg">
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : isCurrent ? (
            <Unlock className="w-5 h-5 text-game-purple" />
          ) : (
            <Lock className="w-5 h-5 text-slate-600" />
          )}
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-slate-500' : 'text-white'}`}>
          {title}
        </h3>
        <p className="text-slate-400 text-sm mb-5 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant={difficultyColors[difficulty]} icon={<Star className="w-3 h-3" />}>
            {difficulty}
          </Badge>
          <Badge variant="warning" icon={<Zap className="w-3 h-3" />}>
            {xpReward} XP
          </Badge>
        </div>
        
        <div className="mt-auto">
          {!isLocked && (
            <ProgressBar 
              progress={completion} 
              color={isCompleted ? "bg-emerald-500" : "bg-game-purple"} 
              showLabel 
            />
          )}
          {isLocked && (
             <div className="h-2 w-full bg-[#181820] rounded-full" />
          )}
        </div>
      </Card>
    </motion.div>
  );
};
