import React from 'react';
import { Card } from '../ui/Card';
import { History, Trophy, BookOpen, Code2 } from 'lucide-react';

const activities = [
  { id: 1, type: 'achievement', title: 'Earned First Login Achievement', time: '2 hours ago', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 2, type: 'lesson', title: 'Completed Variables Module', time: '5 hours ago', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 3, type: 'challenge', title: 'Solved "Hello World" Challenge', time: '1 day ago', icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

export const RecentActivity: React.FC = () => {
  return (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <History className="w-5 h-5 text-purple-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="relative flex gap-4">
              {/* Timeline Line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-5 top-10 bottom-[-1.5rem] w-px bg-slate-700" />
              )}
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-slate-700/50 ${activity.bg}`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-slate-200">{activity.title}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
