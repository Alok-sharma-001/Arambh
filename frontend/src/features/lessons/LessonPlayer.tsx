import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonStory } from './LessonStory';
import { LessonExplain } from './LessonExplain';
import { LessonPractice } from './LessonPractice';
import { LessonChallenge } from './LessonChallenge';
import { LessonReward } from './LessonReward';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_LESSONS, getRegionForLesson } from '../../data/allLessons';
import { OracleAvatar } from '../oracle/OracleAvatar';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';

type LessonStage = 'story' | 'explain' | 'practice' | 'challenge' | 'reward';

const STAGES: LessonStage[] = ['story', 'explain', 'practice', 'challenge', 'reward'];

export default function LessonPlayer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  if (!lessonId) {
    return <div className="p-8 text-white">Error: No lesson ID provided in URL</div>;
  }

  if (!ALL_LESSONS[lessonId]) {
    return (
      <div className="p-8 text-white h-screen bg-slate-950 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Lesson Not Found</h1>
        <p className="mb-4">Could not find lesson data for ID: {lessonId}</p>
        <pre className="bg-black p-4 rounded text-xs text-left overflow-auto max-w-full w-96 text-slate-400">
          Available Keys: {Object.keys(ALL_LESSONS).join(', ')}
        </pre>
        <button 
          onClick={() => navigate('/learning-map')}
          className="mt-8 px-6 py-2 bg-slate-800 rounded hover:bg-slate-700 transition"
        >
          Return to Map
        </button>
      </div>
    );
  }

  const regionId = getRegionForLesson(lessonId);
  const regionName = regionId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const advanceStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const currentStage = STAGES[currentStageIndex];
  const progressPercent = ((currentStageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="h-screen flex flex-col bg-[#05050A] text-white font-sans overflow-hidden relative">
      {/* Global Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none z-0" />

      {/* Header Navigation */}
      <header className="h-16 border-b border-game-border flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md relative z-30">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(`/region/${regionId}`)} 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-game-purple to-indigo-400">
              {regionName} • Lesson {lessonId}
            </h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs mx-auto hidden md:block">
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div 
              className="h-full bg-game-emerald"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-center mt-1 text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            {currentStage}
          </div>
        </div>

        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {currentStage === 'story' && (
              <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <LessonStory lessonId={lessonId} onComplete={advanceStage} />
              </motion.div>
            )}
            {currentStage === 'explain' && (
              <motion.div key="explain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <LessonExplain lessonId={lessonId} onComplete={advanceStage} />
              </motion.div>
            )}
            {currentStage === 'practice' && (
              <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <LessonPractice lessonId={lessonId} onComplete={advanceStage} />
              </motion.div>
            )}
            {currentStage === 'challenge' && (
              <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <LessonChallenge lessonId={lessonId} onComplete={advanceStage} />
              </motion.div>
            )}
            {currentStage === 'reward' && (
              <motion.div key="reward" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <LessonReward lessonId={lessonId} />
              </motion.div>
            )}
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <OracleAvatar context={`lesson_${lessonId}_stage_${currentStage}`} />
    </div>
  );
}
