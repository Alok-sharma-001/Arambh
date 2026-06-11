import React from 'react';
import { Card } from '../ui/Card';
import { useProgressionStore } from '../../store/progressionStore';
import { Diamond, Compass, Scroll, Hexagon, Component } from 'lucide-react';
import { motion } from 'framer-motion';

const ALL_ARTIFACTS = [
  { id: 'variables_crystal', name: 'Variables Crystal', icon: Diamond, color: 'text-game-purple', bg: 'bg-game-purple/10' },
  { id: 'loop_compass', name: 'Loop Compass', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'function_scroll', name: 'Function Scroll', icon: Scroll, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'oop_relic', name: 'OOP Relic', icon: Hexagon, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'algorithm_stone', name: 'Algorithm Stone', icon: Component, color: 'text-red-400', bg: 'bg-red-500/10' },
];

export const InventoryPreview: React.FC = () => {
  const { inventory } = useProgressionStore();
  
  // Create a quick lookup for acquired items
  const acquiredIds = new Set(inventory.map(item => item.item_id));

  return (
    <Card className="p-6 md:p-8 h-full bg-[#0D0D12] border-[#181820]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Learning Artifacts</h3>
          <p className="text-sm text-slate-400 mt-1">Collect all 5 artifacts to unlock the Boss Gate.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {ALL_ARTIFACTS.map((artifact) => {
          const Icon = artifact.icon;
          const isAcquired = acquiredIds.has(artifact.id);
          
          return (
            <motion.div 
              key={artifact.id}
              whileHover={isAcquired ? { y: -5, scale: 1.05 } : {}}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                isAcquired 
                  ? `border-[#181820] bg-[#13131A] shadow-[0_0_15px_rgba(0,0,0,0.5)]` 
                  : 'border-dashed border-slate-800 bg-[#0D0D12] opacity-50 grayscale'
              }`}
            >
              {isAcquired && (
                <div className={`absolute inset-0 blur-xl opacity-20 ${artifact.bg} rounded-2xl`} />
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isAcquired ? artifact.bg : 'bg-slate-800'}`}>
                <Icon className={`w-6 h-6 ${isAcquired ? artifact.color : 'text-slate-600'}`} />
              </div>
              <span className={`text-xs font-bold text-center ${isAcquired ? 'text-slate-200' : 'text-slate-600'}`}>
                {isAcquired ? artifact.name : 'Unknown'}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
