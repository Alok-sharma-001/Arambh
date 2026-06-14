import React from 'react';
import { motion } from 'framer-motion';
import { ArtifactDefinition } from '../../services/artifactService';
import { Lock } from 'lucide-react';

interface ArtifactCardProps {
  artifact: ArtifactDefinition;
  isUnlocked: boolean;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, isUnlocked }) => {
  const Icon = artifact.icon;

  return (
    <motion.div
      whileHover={isUnlocked ? { y: -5, scale: 1.05 } : {}}
      className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
        isUnlocked 
          ? `border-[#181820] bg-[#13131A] shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer group` 
          : 'border-dashed border-slate-800 bg-[#0D0D12] opacity-60 grayscale cursor-not-allowed'
      }`}
    >
      {/* Background glow for unlocked */}
      {isUnlocked && (
        <div className={`absolute inset-0 blur-2xl opacity-20 ${artifact.bg} rounded-2xl transition-opacity group-hover:opacity-40`} />
      )}

      {/* Icon Container */}
      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? artifact.bg : 'bg-slate-800'}`}>
        {isUnlocked ? (
          <Icon className={`w-8 h-8 ${artifact.color} drop-shadow-lg`} />
        ) : (
          <Lock className="w-8 h-8 text-slate-600" />
        )}
        
        {/* Unlocked ring effect */}
        {isUnlocked && (
          <div className={`absolute inset-0 rounded-full border border-white/10 ${artifact.bg} opacity-50 scale-110`} />
        )}
      </div>

      {/* Text Content */}
      <div className="text-center relative z-10 w-full">
        <h3 className={`font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
          {isUnlocked ? artifact.name : 'Unknown Artifact'}
        </h3>
        {isUnlocked ? (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {artifact.description}
          </p>
        ) : (
          <p className="text-xs font-mono text-slate-600 tracking-wider">
            Unlocks at Level {artifact.unlockLevel}
          </p>
        )}
      </div>
    </motion.div>
  );
};
