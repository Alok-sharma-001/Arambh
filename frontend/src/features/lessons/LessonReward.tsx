import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Map, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgressionStore } from '../../store/progressionStore';
import { getLevelProgress } from '../../services/progressionService';
import { useRegionStore } from '../../store/regionStore';
import { ALL_LESSONS as VARIABLES_FOREST_LESSONS, getRegionForLesson } from '../../data/allLessons';

interface LessonRewardProps {
  lessonId: string;
}

export const LessonReward: React.FC<LessonRewardProps> = ({ lessonId }) => {
  const navigate = useNavigate();
  const { gainXP, stats } = useProgressionStore();
  const { completeLesson } = useRegionStore();
  const data = VARIABLES_FOREST_LESSONS[lessonId];

  const { level, xpIntoLevel, xpNeeded } = getLevelProgress(stats?.total_xp || 0);

  useEffect(() => {
    if (!data) return;
    const regionId = getRegionForLesson(lessonId);
    // Award XP and complete the lesson on mount
    gainXP(data.rewardXP, `Completed Lesson ${lessonId}`);
    completeLesson(regionId, lessonId);
  }, [lessonId, gainXP, completeLesson, data]);

  if (!data) return <div>Lesson not found</div>;

  const progressPercent = (xpIntoLevel / xpNeeded) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-slate-950/80 backdrop-blur-2xl border border-game-gold/50 rounded-3xl p-10 relative overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.15)] text-center w-full">
        {/* Glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-game-gold/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-game-emerald/20 blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-[#0D0D12] border-4 border-game-gold rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
            <Award className="w-12 h-12 text-game-gold" />
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-gold to-yellow-200 uppercase tracking-widest">
            Lesson Complete!
          </h2>
          <p className="text-game-emerald text-sm font-bold tracking-[0.2em] mt-3 uppercase">Memory Restored</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 border border-slate-800 rounded-2xl p-6 relative z-10 w-full max-w-md mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-game-gold mb-6">
            <Star className="w-8 h-8 fill-game-gold" />
            +{data.rewardXP} XP
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-300">Level {level}</span>
              <span className="text-slate-500">{xpIntoLevel} / {xpNeeded} XP</span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-game-purple to-indigo-400"
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 flex justify-center"
        >
          <Button 
            variant="primary" 
            onClick={() => {
              const regionId = getRegionForLesson(lessonId);
              navigate(`/region/${regionId}`);
            }}
            leftIcon={<Map className="w-5 h-5" />}
            className="shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-game-gold hover:bg-game-gold/80 text-black px-8"
          >
            Return to Region Map
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
