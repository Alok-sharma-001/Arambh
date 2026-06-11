import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  rarity,
  unlocked,
  unlockedAt
}) => {
  const rarityColors = {
    Common: "slate",
    Rare: "emerald",
    Epic: "purple",
    Legendary: "warning",
  } as const;

  const bgColors = {
    Common: "bg-slate-500",
    Rare: "bg-emerald-500",
    Epic: "bg-purple-500",
    Legendary: "bg-amber-500",
  };

  return (
    <Card 
      hoverEffect={unlocked} 
      className={`relative overflow-hidden ${!unlocked ? 'opacity-75 grayscale border-slate-800' : ''}`}
    >
      {/* Decorative gradient blob */}
      {unlocked && (
        <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 ${bgColors[rarity]}`} />
      )}
      
      <div className="p-6 flex flex-col items-center text-center h-full">
        <div className="relative mb-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 
            ${unlocked ? 'bg-[#13131A] border-[#181820]' : 'bg-[#0D0D12] border-[#181820]'}`}>
            {unlocked ? (
              <motion.div 
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }} 
                className="text-4xl"
              >
                {icon}
              </motion.div>
            ) : (
              <Lock className="w-8 h-8 text-slate-600" />
            )}
          </div>
        </div>

        <h3 className={`text-lg font-bold mb-2 ${unlocked ? 'text-white' : 'text-slate-500'}`}>
          {title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 flex-1">
          {description}
        </p>

        <div className="w-full flex justify-between items-center mt-auto">
          <Badge variant={unlocked ? rarityColors[rarity] : 'slate'} size="sm">
            {rarity}
          </Badge>
          {unlocked && unlockedAt && (
            <span className="text-xs font-medium text-slate-500">{unlockedAt}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
