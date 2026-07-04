import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Lock, Unlock, Star, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MapNodeProps {
  id: number | string;
  title: string;
  description: string;
  status: 'locked' | 'current' | 'completed';
  completion: number;
  xpReward?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Boss';
  artifactReward?: string;
  isBossGate?: boolean;
}

export const MapNode: React.FC<MapNodeProps> = ({ 
  title, 
  description, 
  status, 
  completion, 
  xpReward, 
  difficulty,
  artifactReward,
  isBossGate
}) => {
  const difficultyColors = {
    Beginner: "emerald",
    Intermediate: "amber",
    Advanced: "red",
    Boss: "purple"
  } as const;

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  return (
    <motion.div 
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.12 }}
      className="relative group w-full"
    >
      {/* Glow for completed nodes */}
      {isCompleted && (
        <div className="absolute -inset-0.5 bg-emerald-500/10 blur-xl rounded-2xl group-hover:bg-emerald-500/20 transition-all duration-300" />
      )}
      
      {/* Pulse ring for current active node */}
      {isCurrent && (
        <>
          <div className="absolute -inset-1 rounded-[22px] animate-pulse-ring z-0" />
          <div className="absolute -inset-0.5 bg-game-purple/20 blur-xl rounded-2xl animate-pulse" />
        </>
      )}

      <Card 
        className={`p-4 md:p-5 relative border-2 transition-apple backdrop-blur-md overflow-hidden rounded-[18px] z-10 ${
          isLocked 
            ? 'border-[#181820] bg-[#0D0D12]/60 grayscale opacity-80' 
            : isCompleted
            ? 'border-emerald-500/30 bg-[#070708] shadow-[0_0_15px_rgba(16,185,129,0.08)] cursor-pointer hover:border-emerald-400'
            : 'border-game-purple/50 bg-[#070708] cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:border-game-purple'
        }`}
      >
        {/* Fog effect for locked nodes */}
        {isLocked && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] z-20 flex items-center justify-center">
             <Lock className="w-8 h-8 text-slate-700" />
          </div>
        )}

        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center bg-[#070708] border-2 border-[#181820] z-10 shadow-lg">
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : isCurrent ? (
            <Unlock className="w-4 h-4 text-game-purple animate-pulse" />
          ) : (
            <Lock className="w-4 h-4 text-slate-600" />
          )}
        </div>
        
        <h3 className={`text-lg font-black tracking-tight mb-1.5 ${isLocked ? 'text-slate-500' : 'text-white'}`}>
          {title}
        </h3>
        <p className="text-slate-400 text-xs mb-3.5 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {difficulty && (
            <Badge variant={difficultyColors[difficulty]} icon={<Star className="w-3 h-3" />} size="sm">
              {difficulty}
            </Badge>
          )}
          {xpReward && (
            <Badge variant="warning" icon={<Zap className="w-3 h-3" />} size="sm">
              {xpReward} XP
            </Badge>
          )}
          {artifactReward && !isLocked && !isBossGate && (
             <Badge variant="purple" icon={<Star className="w-3 h-3" />} size="sm">
               Unlocks Artifact
             </Badge>
          )}
        </div>
        
        <div className="mt-auto">
          {!isLocked && !isBossGate && (
            <ProgressBar 
              progress={completion} 
              color={isCompleted ? "bg-emerald-500" : "bg-game-purple"} 
              showLabel 
            />
          )}
          {isLocked && (
             <div className="h-1.5 w-full bg-[#181820] rounded-full" />
          )}
        </div>
      </Card>
    </motion.div>
  );
};
