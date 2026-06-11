import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Award, Zap } from 'lucide-react';

export const UserOverview: React.FC = () => {
  return (
    <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50">
      <div className="relative">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-2xl shadow-blue-900/50">
          <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
            {/* Fallback Avatar Icon */}
            <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-400">
              PQ
            </span>
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3">
          <Badge variant="warning" size="md" icon={<Award className="w-4 h-4" />}>
            Lv 5
          </Badge>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left w-full mt-2 md:mt-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">PyMaster99</h2>
            <p className="text-slate-400 font-medium">Novice Explorer</p>
          </div>
          <div className="flex gap-2 justify-center md:justify-end">
            <Badge variant="purple" icon={<Zap className="w-3 h-3" />}>3 Day Streak</Badge>
          </div>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 mt-4 md:mt-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-300">Level 5 Progress</span>
            <span className="text-xs font-medium text-slate-400">1200 / 2500 XP</span>
          </div>
          <ProgressBar progress={48} color="bg-blue-500" height="h-3" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Earn 1300 more XP to reach Level 6</p>
        </div>
      </div>
    </Card>
  );
};
