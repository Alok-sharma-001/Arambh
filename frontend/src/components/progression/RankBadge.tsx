import React from 'react';
import { Shield } from 'lucide-react';

interface RankBadgeProps {
  rank: string;
  size?: 'sm' | 'md' | 'lg';
}

const RANK_COLORS: Record<string, string> = {
  Novice:       'text-slate-400 border-slate-600',
  Explorer:     'text-emerald-400 border-emerald-500/50',
  Adept:        'text-game-purple border-game-purple/50',
  Master:       'text-game-gold border-game-gold/50',
  Grandmaster:  'text-red-400 border-red-500/50',
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'sm' }) => {
  const colorClass = RANK_COLORS[rank] || 'text-slate-400 border-slate-600';
  const sizeClass = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  }[size];

  return (
    <span className={`inline-flex items-center font-bold rounded-full border ${colorClass} ${sizeClass} uppercase tracking-wider`}>
      <Shield className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      {rank}
    </span>
  );
};
