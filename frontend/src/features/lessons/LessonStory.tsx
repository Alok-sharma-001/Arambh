import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { ALL_LESSONS as VARIABLES_FOREST_LESSONS, getRegionForLesson } from '../../data/allLessons';

interface LessonStoryProps {
  lessonId: string;
  onComplete: () => void;
}

export const LessonStory: React.FC<LessonStoryProps> = ({ lessonId, onComplete }) => {
  const data = VARIABLES_FOREST_LESSONS[lessonId];
  const regionId = getRegionForLesson(lessonId);
  const regionName = regionId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (!data) return <div>Lesson not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-slate-950/80 backdrop-blur-2xl border border-game-purple/50 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] text-center">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-game-purple/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-game-emerald/20 blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-purple to-indigo-400 uppercase tracking-widest">
            {data.title}
          </h2>
          <p className="text-game-gold text-sm font-bold tracking-[0.2em] mt-2">{regionName} • Lesson {lessonId}</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 border border-slate-800 rounded-2xl p-6 text-left relative z-10"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-game-purple flex-shrink-0 flex items-center justify-center text-xl">
              {data.story.emoji}
            </div>
            <div>
              <h4 className="text-game-purple font-bold text-sm uppercase tracking-wider mb-2">{data.story.speaker}</h4>
              {data.story.lines.map((line, idx) => (
                <p key={idx} className={`text-slate-300 leading-relaxed ${idx > 0 ? 'mt-4' : ''}`}>
                  "{line}"
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex justify-end"
        >
          <Button 
            variant="primary" 
            onClick={onComplete}
            rightIcon={<ChevronRight className="w-5 h-5" />}
            className="shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-game-purple hover:bg-game-purple/80 px-8"
          >
            Begin Training
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
