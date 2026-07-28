import { useEffect, useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { MapNode, MapNodeProps } from '../components/learning/MapNode';
import { Map, ChevronLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useRegionStore } from '../store/regionStore';
import { useProgressionStore } from '../store/progressionStore';
import { regions as regionDefinitions } from '../data/regions';
import { NavigationService } from '../core/progression/NavigationService';
import { PaymentGate } from '../components/PaymentGate';

export default function RegionMap() {
  const navigate = useNavigate();
  const { regionId } = useParams<{ regionId: string }>();
  const { getRegionProgress } = useRegionStore();
  const { inventory } = useProgressionStore();

  useEffect(() => {
    sessionStorage.setItem('mapSource', 'region');
  }, []);
  
  if (!regionId) return <Navigate to="/world-map" replace />;
  
  const regionDef = useMemo(() => regionDefinitions.find((r) => r.id === regionId), [regionId]);
  if (!regionDef) return <Navigate to="/world-map" replace />;

  const progress = getRegionProgress(regionId);
  
  const mapNodes: MapNodeProps[] = useMemo(() => {
    const nodes: MapNodeProps[] = regionDef.lessons.map((lesson, index) => {
      const isCompleted = progress.completedLessons.includes(lesson.id);
      const isNextAvailable = !isCompleted && 
        (index === 0 || progress.completedLessons.includes(regionDef.lessons[index - 1].id));
      
      let status: 'locked' | 'available' | 'current' | 'completed' = 'locked';
      if (isCompleted) status = 'completed';
      else if (isNextAvailable) status = 'current';

      return {
        id: lesson.id,
        title: `Lesson ${lesson.number}: ${lesson.title}`,
        description: `Complete this lesson to earn ${lesson.xpReward} XP.`,
        status,
        completion: isCompleted ? 100 : 0,
        xpReward: lesson.xpReward,
        difficulty: 'Beginner'
      };
    });

    // Add the boss gate
    const bossUnlocked = progress.completedLessons.length >= regionDef.lessons.length;
    nodes.push({
      id: 'boss',
      title: regionDef.bossChallenge.title,
      description: progress.bossStatus === 'locked' 
        ? `Complete all ${regionDef.lessons.length} lessons to unlock the guardian.` 
        : `Defeat the boss to restore the region!`,
      status: progress.bossStatus === 'completed' ? 'completed' 
            : progress.bossStatus === 'available' || bossUnlocked ? 'current' 
            : 'locked',
      completion: progress.bossStatus === 'completed' ? 100 : 0,
      difficulty: 'Boss',
      isBossGate: true,
      artifactReward: regionDef.bossChallenge.artifactReward
    });

    return nodes;
  }, [regionDef, progress]);

  const totalLessons = regionDef.lessons.length;

  const regionName = regionId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  let regionDesc = 'Restore the scattered memory fragments of the ancient crystal.';
  if (regionId === 'data-types-valley') {
    regionDesc = 'Master the fundamental shapes of data and reclaim the lost types.';
  } else if (regionId === 'functions-mountain') {
    regionDesc = 'Ascend the peaks and learn to forge reusable magic blueprints.';
  } else if (regionId === 'collections-kingdom') {
    regionDesc = 'Organize the grand archives and master the containers of knowledge.';
  } else if (regionId === 'oop-citadel') {
    regionDesc = 'Awaken the living constructs and inherit the ancestral blueprints.';
  } else if (regionId === 'exception-abyss') {
    regionDesc = 'Survive the corrupted anomalies and stabilize the fractured reality.';
  } else if (regionId === 'filesystem-ruins') {
    regionDesc = 'Recover lost knowledge from ancient archives and memory vaults.';
  } else if (regionId === 'modules-harbor') {
    regionDesc = 'Navigate the trade networks to import powerful artifacts and modular magic.';
  } else if (regionId === 'algorithm-arena') {
    regionDesc = 'Step into the colosseum of logic and optimize your code to defeat time itself.';
  } else if (regionId === 'bossgate-saga') {
    regionDesc = 'The final challenge. Unite the seals and defeat the Ancient Python Dragon.';
  }

  // Artifact check for Boss Gate
  if (regionId === 'bossgate-saga' && inventory.length < 10) {
    return (
      <div className="min-h-screen bg-[#050505] p-8 flex items-center justify-center font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl text-center bg-red-900/10 border border-red-500/30 p-12 rounded-3xl backdrop-blur-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-red-400 mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">The Boss Gate is Sealed</h1>
          <p className="text-xl text-red-200/80 mb-8 font-light">
            You must collect all 10 artifacts to break the seal. Return when you have gathered the artifacts of mastery.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
             <span className="text-red-400 font-bold uppercase tracking-widest text-sm">Artifacts Collected:</span>
             <span className="text-2xl font-black text-white">{inventory.length} / 10</span>
          </div>
          <button 
            onClick={() => navigate('/world-map')}
            className="px-8 py-4 bg-red-600/20 text-red-400 font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-red-600/40 border border-red-500/50 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            Return to Map
          </button>
        </motion.div>
      </div>
    );
  }

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
    <PaymentGate regionId={regionId}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex items-center gap-4 mb-6 pt-8 px-6">
        <button 
          id="region-back-button"
          onClick={() => navigate('/world-map')} 
          className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <PageHeader 
          title={regionName} 
          description={regionDesc}
          icon={<Map className="w-6 h-6" />}
        />
      </div>

      {/* Progress Summary */}
      <div id="region-progress-bar" className="px-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-game-purple/20 border-2 border-game-purple flex items-center justify-center">
              <span className="text-2xl font-bold text-game-purple">{progress.completedLessons.length}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Region Progress</h3>
              <p className="text-slate-400">{progress.completedLessons.length} / {totalLessons} Lessons Completed</p>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="flex justify-between text-sm mb-2 font-bold text-slate-300">
              <span>Completion</span>
              <span className="text-game-emerald">{progress.completionPercentage}%</span>
            </div>
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-game-emerald transition-all duration-1000"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        id="region-timeline"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-12 md:mt-20 flex flex-col items-center relative w-full"
        >
          {mapNodes.map((mod, index) => {
            const isLeft = index % 2 === 0;
            const isLast = index === mapNodes.length - 1;
            const pathColor = mod.status === 'completed' ? 'stroke-amber-500/60' 
                            : mod.status === 'current' ? 'stroke-purple-500/60' 
                            : 'stroke-slate-800';

            return (
              <div key={mod.id} className="relative w-full max-w-4xl flex flex-col items-center">
                
                {!isLast && (
                  <div className="absolute top-[58%] left-0 right-0 h-32 md:h-48 z-0 pointer-events-none flex justify-center">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-32 md:w-52 h-full">
                      <defs>
                        <linearGradient id="timeline-flow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#5682B1" />
                          <stop offset="50%" stopColor="#FFE8DB" />
                          <stop offset="100%" stopColor="#5682B1" />
                        </linearGradient>
                      </defs>
                      <path
                        d={isLeft 
                          ? `M 50 0 C 85 20, 85 80, 50 100` 
                          : `M 50 0 C 15 20, 15 80, 50 100`
                        }
                        fill="none"
                        className={`${pathColor} transition-colors duration-1000`}
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                      {(mod.status === 'completed' || mod.status === 'current') && (
                         <path
                         d={isLeft 
                           ? `M 50 0 C 85 20, 85 80, 50 100` 
                           : `M 50 0 C 15 20, 15 80, 50 100`
                         }
                         fill="none"
                         stroke="url(#timeline-flow-grad)"
                         strokeWidth="2"
                         strokeDasharray="8 16"
                         className="animate-timeline-flow opacity-80"
                       />
                      )}
                    </svg>
                  </div>
                )}

                <motion.div 
                  variants={itemVariants}
                  className={`relative z-10 flex w-full justify-center md:justify-start ${isLeft ? 'md:pl-0' : 'md:justify-end md:pr-0'} mb-12 md:mb-20`}
                >
                  <div className={`w-[90%] md:w-[45%] flex items-center justify-center relative ${isLeft ? 'md:ml-auto md:mr-12' : 'md:mr-auto md:ml-12'}`}>
                    
                    <div className={`hidden md:flex absolute ${isLeft ? '-right-12 translate-x-1/2' : '-left-12 -translate-x-1/2'} top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0D0D12] border-4 border-[#181820] items-center justify-center z-20`}>
                      <div className={`w-3 h-3 rounded-full ${
                        mod.status === 'completed' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)]' 
                        : mod.status === 'current' ? 'bg-game-purple shadow-[0_0_15px_rgba(139,92,246,1)] animate-pulse' 
                        : 'bg-slate-700'
                      }`} />
                    </div>

                    <div 
                      id={mod.isBossGate ? "region-boss-gate" : undefined}
                      onClick={() => {
                        if (mod.status !== 'locked') {
                          if (mod.isBossGate) {
                            NavigationService.goToBoss(regionId);
                          } else {
                            NavigationService.goToLesson(regionId, mod.id.toString());
                          }
                        }
                      }}
                      className="w-full cursor-pointer"
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
    </PaymentGate>
  );
}
