import { PageHeader } from '../components/ui/PageHeader';
import { MapNode, MapNodeProps } from '../components/learning/MapNode';
import { Map, ChevronLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useRegionStore } from '../store/regionStore';
import { useProgressionStore } from '../store/progressionStore';
import { VARIABLES_FOREST_LESSONS } from '../data/variablesForestData';
import { DATA_TYPES_VALLEY_LESSONS } from '../data/dataTypesValleyData';
import { LOOPS_DESERT_LESSONS } from '../data/loopsDesertData';
import { functionsMountainData } from '../data/functionsMountainData';
import { collectionsKingdomData } from '../data/collectionsKingdomData';
import { oopCastleData } from '../data/oopCastleData';
import { exceptionAbyssData } from '../data/exceptionAbyssData';
import { fileSystemRuinsData } from '../data/fileSystemRuinsData';
import { modulesHarborData } from '../data/modulesHarborData';
import { algorithmArenaData } from '../data/algorithmArenaData';
import { bossGateSagaData } from '../data/bossGateSagaData';

export default function RegionMap() {
  const navigate = useNavigate();
  const { regionId } = useParams<{ regionId: string }>();
  const { getRegionProgress, regions } = useRegionStore();
  const { inventory } = useProgressionStore();
  
  if (!regionId) return <Navigate to="/learning-map" replace />;
  
  const regionConfig = regions[regionId];
  if (!regionConfig) return <Navigate to="/learning-map" replace />;

  const progress = getRegionProgress(regionId);
  
  let currentLessons: any = null;
  let bossTitle = 'Coming Soon';
  let bossArtifact = '';
  
  if (regionId === 'variables-forest') {
    currentLessons = VARIABLES_FOREST_LESSONS;
    bossTitle = 'Corrupted Crystal Guardian';
    bossArtifact = 'forest-ring';
  } else if (regionId === 'data-types-valley') {
    currentLessons = DATA_TYPES_VALLEY_LESSONS;
    bossTitle = 'The Type Shapeshifter';
    bossArtifact = 'crystal-lens';
  } else if (regionId === 'loops-desert') {
    currentLessons = LOOPS_DESERT_LESSONS;
    bossTitle = 'The Infinite Serpent';
    bossArtifact = 'dune-scroll';
  } else if (regionId === 'functions-mountain') {
    currentLessons = functionsMountainData;
    bossTitle = 'The Forgotten Architect';
    bossArtifact = 'summit-crown';
  } else if (regionId === 'collections-kingdom') {
    currentLessons = collectionsKingdomData;
    bossTitle = 'The Data Hoarder';
    bossArtifact = 'royal-scepter';
  } else if (regionId === 'oop-citadel') {
    currentLessons = oopCastleData;
    bossTitle = 'The Hollow King';
    bossArtifact = 'class-sigil';
  } else if (regionId === 'exception-abyss') {
    currentLessons = exceptionAbyssData;
    bossTitle = 'The Chaos Compiler';
    bossArtifact = 'abyssal-shield';
  } else if (regionId === 'filesystem-ruins') {
    currentLessons = fileSystemRuinsData;
    bossTitle = 'The Forgotten Archivist';
    bossArtifact = 'stone-tablet';
  } else if (regionId === 'modules-harbor') {
    currentLessons = modulesHarborData;
    bossTitle = 'The Smuggler of Secrets';
    bossArtifact = 'harbor-compass';
  } else if (regionId === 'algorithm-arena') {
    currentLessons = algorithmArenaData;
    bossTitle = 'The Time Eater';
    bossArtifact = 'arena-trophy';
  } else if (regionId === 'bossgate-saga') {
    currentLessons = bossGateSagaData;
    bossTitle = 'The Ancient Python Dragon';
    bossArtifact = 'legends-crown';
  }

  // If region is not implemented yet
  if (!currentLessons) {
    return (
      <div className="max-w-6xl mx-auto pb-20 pt-8 px-6 text-center">
        <button 
          onClick={() => navigate('/learning-map')} 
          className="mb-8 p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all inline-flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Back to Map
        </button>
        <div className="bg-slate-950/80 backdrop-blur-xl border border-game-border p-12 rounded-3xl">
          <Map className="w-16 h-16 text-game-purple mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-bold text-white mb-4">Region Under Construction</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            This region of the Python Kingdom is still being forged by the developers. Check back in a future update!
          </p>
        </div>
      </div>
    );
  }
  
  const mapNodes: MapNodeProps[] = Object.values(currentLessons as Record<string, any>).map((lesson: any, index) => {
    const isCompleted = progress.completedLessons.includes(lesson.id);
    const isNextAvailable = !isCompleted && 
      (index === 0 || progress.completedLessons.includes(Object.values(currentLessons as Record<string, any>)[index - 1].id));
    
    let status: 'locked' | 'available' | 'current' | 'completed' = 'locked';
    if (isCompleted) status = 'completed';
    else if (isNextAvailable) status = 'current';

    return {
      id: lesson.id,
      title: `Lesson ${lesson.id}: ${lesson.title}`,
      description: `Complete this lesson to earn ${lesson.rewardXP} XP.`,
      status,
      completion: isCompleted ? 100 : 0,
      xpReward: lesson.rewardXP,
      difficulty: 'Beginner'
    };
  });

  const totalLessons = Object.keys(currentLessons as Record<string, any>).length;

  // Add the boss gate
  mapNodes.push({
    id: 'boss',
    title: bossTitle,
    description: progress.bossStatus === 'locked' 
      ? `Complete all ${totalLessons} lessons to unlock the guardian.` 
      : `Defeat the boss to restore the region!`,
    status: progress.bossStatus === 'completed' ? 'completed' 
          : progress.bossStatus === 'available' ? 'current' 
          : 'locked',
    completion: progress.bossStatus === 'completed' ? 100 : 0,
    difficulty: 'Boss',
    isBossGate: true,
    artifactReward: bossArtifact
  });

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
            onClick={() => navigate('/learning-map')}
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
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6 pt-8 px-6">
        <button 
          onClick={() => navigate('/learning-map')} 
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
      <div className="px-6 mb-12">
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
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative py-12 mt-8 flex flex-col items-center"
      >
        {mapNodes.map((mod, index) => {
          const isLeft = index % 2 === 0;
          const isLast = index === mapNodes.length - 1;
          const nextMod = !isLast ? mapNodes[index + 1] : null;
          
          const pathColor = mod.status === 'completed' && nextMod?.status !== 'locked' 
            ? 'stroke-emerald-500/50' 
            : mod.status === 'current'
            ? 'stroke-game-purple/50'
            : 'stroke-[#181820]';

          return (
            <div key={mod.id} className="relative w-full max-w-4xl flex flex-col items-center">
              
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

              <motion.div 
                variants={itemVariants}
                className={`relative z-10 flex w-full justify-center md:justify-start ${isLeft ? 'md:pl-0' : 'md:justify-end md:pr-0'} mb-24 md:mb-32`}
              >
                <div className={`w-full md:w-[45%] flex items-center justify-center relative ${isLeft ? 'md:ml-auto md:mr-12' : 'md:mr-auto md:ml-12'}`}>
                  
                  <div className={`hidden md:flex absolute ${isLeft ? '-right-12 translate-x-1/2' : '-left-12 -translate-x-1/2'} top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0D0D12] border-4 border-[#181820] items-center justify-center z-20`}>
                    <div className={`w-3 h-3 rounded-full ${
                      mod.status === 'completed' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)]' 
                      : mod.status === 'current' ? 'bg-game-purple shadow-[0_0_15px_rgba(139,92,246,1)]' 
                      : 'bg-slate-700'
                    }`} />
                  </div>

                  <div 
                    onClick={() => {
                      if (mod.status !== 'locked') {
                        if (mod.isBossGate) {
                          navigate(`/region/${regionId}/boss`);
                        } else {
                          navigate(`/lesson/${regionId}/${mod.id}`);
                        }
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
