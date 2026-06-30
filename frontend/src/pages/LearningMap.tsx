
import { PageHeader } from '../components/ui/PageHeader';
import { MapNode, MapNodeProps } from '../components/learning/MapNode';
import { Map, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { useArtifacts } from '../hooks/useArtifacts';

import { useNavigate } from 'react-router-dom';

import { useRegionStore } from '../store/regionStore';
import { useEffect } from 'react';

export default function LearningMap() {
  const { hasAllArtifacts, collectedCount, totalCount } = useArtifacts();
  const { getRegionProgress } = useRegionStore();
  const navigate = useNavigate();
  
  const getMapNodeStatus = (regionId: string) => {
    const prog = getRegionProgress(regionId);
    return prog.regionStatus === 'locked' ? 'locked' : prog.regionStatus === 'completed' ? 'completed' : 'current';
  };

  // Self-healing logic for existing local storage state
  useEffect(() => {
    const fnStatus = getRegionProgress('functions-mountain').regionStatus;
    const colStatus = getRegionProgress('collections-kingdom').regionStatus;
    
    // If Functions Mountain is completed but Collections Kingdom is locked, unlock it
    if (fnStatus === 'completed' && colStatus === 'locked') {
      useRegionStore.getState().unlockRegion('collections-kingdom');
    }
    
    // If Collections Kingdom is not completed, ensure later regions are locked (unless somehow they skipped)
    const oopStatus = getRegionProgress('oop-citadel').regionStatus;
    if (colStatus !== 'completed' && oopStatus !== 'locked') {
      // Force lock later regions by directly updating state to fix dirty cache
      useRegionStore.setState(state => ({
        regions: {
          ...state.regions,
          'oop-citadel': {
            ...state.regions['oop-citadel'],
            regionStatus: 'locked'
          },
          'exception-abyss': {
            ...state.regions['exception-abyss'],
            regionStatus: 'locked'
          },
          'filesystem-ruins': {
            ...state.regions['filesystem-ruins'],
            regionStatus: 'locked'
          },
          'modules-harbor': {
            ...state.regions['modules-harbor'],
            regionStatus: 'locked'
          },
          'algorithm-arena': {
            ...state.regions['algorithm-arena'],
            regionStatus: 'locked'
          },
          'bossgate-saga': {
            ...state.regions['bossgate-saga'],
            regionStatus: 'locked'
          }
        }
      }));
    }
  }, []);

  const mapNodes: MapNodeProps[] = [
    { 
      id: 'variables-forest', 
      title: 'Variables Forest', 
      description: 'Learn the basics of storing and manipulating data.', 
      status: getMapNodeStatus('variables-forest') as any, 
      completion: getRegionProgress('variables-forest').completionPercentage, 
      xpReward: 100, 
      difficulty: 'Beginner', 
      artifactReward: 'forest-ring' 
    },
    { 
      id: 'data-types-valley', 
      title: 'Data Types Valley', 
      description: 'Understand numbers, strings, booleans, and more.', 
      status: getMapNodeStatus('data-types-valley') as any, 
      completion: getRegionProgress('data-types-valley').completionPercentage, 
      xpReward: 150, 
      difficulty: 'Beginner' 
    },
    { id: 'loops-desert', title: 'Loops Desert', description: 'Master for and while loops to iterate over data.', status: getMapNodeStatus('loops-desert') as any, completion: getRegionProgress('loops-desert').completionPercentage, xpReward: 200, difficulty: 'Intermediate', artifactReward: 'dune-scroll' },
    { id: 'functions-mountain', title: 'Functions Mountain', description: 'Build reusable blocks of code.', status: getMapNodeStatus('functions-mountain') as any, completion: getRegionProgress('functions-mountain').completionPercentage, xpReward: 250, difficulty: 'Intermediate', artifactReward: 'summit-crown' },
    { id: 'collections-kingdom', title: 'Collections Kingdom', description: 'Organize the grand archives and master containers.', status: getMapNodeStatus('collections-kingdom') as any, completion: getRegionProgress('collections-kingdom').completionPercentage, xpReward: 300, difficulty: 'Intermediate', artifactReward: 'royal-scepter' },
    { id: 'oop-citadel', title: 'OOP Citadel', description: 'Discover classes, objects, inheritance, and polymorphism.', status: getMapNodeStatus('oop-citadel') as any, completion: getRegionProgress('oop-citadel').completionPercentage, xpReward: 400, difficulty: 'Advanced', artifactReward: 'class-sigil' },
    { id: 'exception-abyss', title: 'Exception Abyss', description: 'Survive the corrupted anomalies and stabilize the fractured reality.', status: getMapNodeStatus('exception-abyss') as any, completion: getRegionProgress('exception-abyss').completionPercentage, xpReward: 450, difficulty: 'Advanced', artifactReward: 'abyssal-shield' },
    { id: 'filesystem-ruins', title: 'File System Ruins', description: 'Recover lost knowledge from ancient archives and memory vaults.', status: getMapNodeStatus('filesystem-ruins') as any, completion: getRegionProgress('filesystem-ruins').completionPercentage, xpReward: 450, difficulty: 'Advanced', artifactReward: 'stone-tablet' },
    { id: 'modules-harbor', title: 'Modules & Libraries Harbor', description: 'Navigate the trade networks to import powerful artifacts and modular magic.', status: getMapNodeStatus('modules-harbor') as any, completion: getRegionProgress('modules-harbor').completionPercentage, xpReward: 500, difficulty: 'Advanced', artifactReward: 'harbor-compass' },
    { id: 'algorithm-arena', title: 'Algorithm Arena', description: 'Step into the colosseum of logic and optimize your code to defeat time itself.', status: getMapNodeStatus('algorithm-arena') as any, completion: getRegionProgress('algorithm-arena').completionPercentage, xpReward: 500, difficulty: 'Advanced', artifactReward: 'arena-trophy' },
    { id: 'bossgate-saga', title: 'The Boss Gate Saga', description: 'Unite the seals. Defeat the Ancient Python Dragon.', status: getMapNodeStatus('bossgate-saga') as any, completion: getRegionProgress('bossgate-saga').completionPercentage, xpReward: 5000, difficulty: 'Boss', artifactReward: 'legends-crown' },
    {
      id: 'boss_gate',
      title: 'Boss Gate',
      description: hasAllArtifacts ? 'The gate is open! The final challenge awaits.' : `Need ${collectedCount}/${totalCount} Artifacts to unlock this gate.`,
      status: hasAllArtifacts ? 'completed' : 'locked',
      completion: hasAllArtifacts ? 100 : 0,
      difficulty: 'Boss',
      isBossGate: true,
    }
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <PageHeader 
        title="Python Kingdom" 
        description="Your journey through the world of Python. Reclaim the lost artifacts of logic to restore the kingdom."
        icon={<Map className="w-6 h-6" />}
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative py-12 mt-8 flex flex-col items-center"
      >
        {mapNodes.map((mod, index) => {
          const isLeft = index % 2 === 0;
          const isLast = index === mapNodes.length - 1;
          const nextMod = !isLast ? mapNodes[index + 1] : null;
          
          // Determine path connection color based on completion
          const pathColor = mod.status === 'completed' && nextMod?.status !== 'locked' 
            ? 'stroke-emerald-500/50' 
            : mod.status === 'current'
            ? 'stroke-game-purple/50'
            : 'stroke-[#181820]';

          return (
            <div key={mod.id} className="relative w-full max-w-4xl flex flex-col items-center">
              
              {/* Connector Path to Next Node */}
              {!isLast && (
                <div className="absolute top-1/2 left-0 right-0 h-48 md:h-64 z-0 pointer-events-none flex justify-center mt-8">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      d={isLeft 
                        ? `M 50% 0 C 80% 20, 80% 80, 50% 100` 
                        : `M 50% 0 C 20% 20, 20% 80, 50% 100`
                      }
                      fill="none"
                      className={`${pathColor} transition-colors duration-1000`}
                      strokeWidth="6"
                      strokeDasharray="10 10"
                    />
                    {/* Animated flow line */}
                    {(mod.status === 'completed' || mod.status === 'current') && (
                       <path
                       d={isLeft 
                         ? `M 50% 0 C 80% 20, 80% 80, 50% 100` 
                         : `M 50% 0 C 20% 20, 20% 80, 50% 100`
                       }
                       fill="none"
                       stroke="white"
                       strokeWidth="2"
                       strokeDasharray="50 1000"
                       strokeDashoffset="0"
                       className="animate-[dash_3s_linear_infinite] opacity-50"
                     />
                    )}
                  </svg>
                </div>
              )}

              {/* Node Content */}
              <motion.div 
                variants={itemVariants}
                className={`relative z-10 flex w-full justify-center md:justify-start ${isLeft ? 'md:pl-0' : 'md:justify-end md:pr-0'} mb-24 md:mb-32`}
              >
                <div className={`w-full md:w-[45%] flex items-center justify-center relative ${isLeft ? 'md:ml-auto md:mr-12' : 'md:mr-auto md:ml-12'}`}>
                  
                  {/* Waypoint Marker for Desktop */}
                  <div className={`hidden md:flex absolute ${isLeft ? '-right-12 translate-x-1/2' : '-left-12 -translate-x-1/2'} top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0D0D12] border-4 border-[#181820] items-center justify-center z-20`}>
                    <div className={`w-3 h-3 rounded-full ${
                      mod.status === 'completed' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)]' 
                      : mod.status === 'current' ? 'bg-game-purple shadow-[0_0_15px_rgba(139,92,246,1)]' 
                      : 'bg-slate-700'
                    }`} />
                  </div>

                  {mod.status === 'current' && (
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute -top-12 ${isLeft ? '-right-16' : '-left-16'} hidden md:block z-30`}
                    >
                      <MapPin className="w-10 h-10 text-game-gold fill-game-gold/20 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    </motion.div>
                  )}

                  <div 
                    onClick={() => {
                      if (mod.status !== 'locked' && !mod.isBossGate) {
                        navigate(`/region/${mod.id}`);
                      }
                    }}
                    className="w-full"
                  >
                    <MapNode {...mod} />
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
