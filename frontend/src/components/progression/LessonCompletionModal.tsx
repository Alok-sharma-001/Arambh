import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Sparkles, ArrowRight, Map, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { analyticsApi } from '../../services/analyticsApi';

interface LessonCompletionModalProps {
  isOpen: boolean;
  xpReward: number;
  regionTitle: string;
  completedCount: number;
  totalCount: number;
  nextLessonTitle: string | null;
  onNextLesson: () => void;
  onReturnToMap: () => void;
  onFeedbackSubmit: (helpful: boolean) => void;
  feedbackSubmitted: boolean;
  feedbackHelpful: boolean | null;
}

export const LessonCompletionModal: React.FC<LessonCompletionModalProps> = ({
  isOpen,
  xpReward,
  regionTitle,
  completedCount,
  totalCount,
  nextLessonTitle,
  onNextLesson,
  onReturnToMap,
  onFeedbackSubmit,
  feedbackSubmitted,
  feedbackHelpful,
}) => {
  const [animatedXP, setAnimatedXP] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Play success audio chime
      playSound.success();

      // Log telemetry event
      analyticsApi.logEvent('lesson_completion_modal_viewed');

      // Animate XP number counting up
      let current = 0;
      const step = Math.ceil(xpReward / 15);
      const interval = setInterval(() => {
        current += step;
        if (current >= xpReward) {
          current = xpReward;
          clearInterval(interval);
        }
        setAnimatedXP(current);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen, xpReward]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));
  const previousProgressPercent = Math.max(0, Math.min(100, Math.round(((completedCount - 1) / totalCount) * 100)));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      >
        {/* Floating particles radiating from center */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 300;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-game-gold rounded-full"
                initial={{
                  x: '50vw',
                  y: '50vh',
                  opacity: 1,
                  scale: 0.5 + Math.random() * 0.8,
                }}
                animate={{
                  x: `calc(50vw + ${Math.cos(angle) * distance}px)`,
                  y: `calc(50vh + ${Math.sin(angle) * distance}px)`,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1.5,
                  ease: 'easeOut',
                  repeat: 0,
                }}
              />
            );
          })}
        </div>

        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 bg-[#0D0D12] border-2 border-game-gold/50 shadow-[0_0_80px_rgba(251,191,36,0.25)] max-h-[90vh] overflow-y-auto text-center relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-game-gold/10 blur-[60px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ rotate: -15, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-game-gold/10 border-2 border-game-gold/30 mb-6"
            >
              <Sparkles className="w-10 h-10 text-game-gold" />
            </motion.div>

            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-game-gold mb-2">
              Lesson Complete
            </h2>
            <h1 className="text-3xl font-extrabold text-white mb-6">
              Quest Cleared!
            </h1>

            {/* XP Gain Ceremony */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-game-gold/30"
              >
                <span className="text-3xl font-black text-game-gold tracking-tight">
                  +{animatedXP} XP
                </span>
              </motion.div>
            </div>

            {/* Region Progress Section */}
            <div className="p-5 rounded-2xl bg-[#13131A] border border-[#181820] mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{regionTitle} Progress</span>
                <span className="text-xs font-bold text-game-gold">{completedCount} of {totalCount} Completed</span>
              </div>
              
              <div className="relative">
                {/* Progress bar animation */}
                <ProgressBar
                  progress={progressPercent}
                  color="bg-gradient-to-r from-game-gold to-amber-400"
                  height="h-2.5"
                />
              </div>
            </div>

            {/* Was this lesson helpful feedback widget */}
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-slate-800/80 mb-6">
              <p className="text-xs font-medium text-slate-400 mb-3">
                Was this lesson helpful?
              </p>
              {!feedbackSubmitted ? (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onFeedbackSubmit(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 transition-colors text-xs font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Yes
                  </button>
                  <button
                    onClick={() => onFeedbackSubmit(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors text-xs font-bold"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    No
                  </button>
                </div>
              ) : (
                <p className="text-xs text-game-gold font-bold flex items-center justify-center gap-1.5 animate-pulse">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Thank you for your feedback!
                </p>
              )}
            </div>

            {/* Tomorrow's Quest Awaits Loop */}
            <div className="p-5 rounded-2xl bg-[#0D0D12] border border-[#181820] shadow-inner mb-8 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-game-purple/5 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="text-xs font-black uppercase tracking-widest text-game-purple mb-2 flex items-center gap-1.5">
                ⚔️ Tomorrow's Quest Awaits
              </h3>
              <p className="text-sm font-bold text-white mb-1">
                {nextLessonTitle || "Boss Battle Awaits!"}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-game-gold" /> Daily Login: +25 XP</span>
                <span className="text-slate-700">|</span>
                <span>Next Quest: +50 XP</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  analyticsApi.logEvent('next_lesson_clicked');
                  onNextLesson();
                }}
                className="flex-1 py-3.5 px-6 rounded-xl bg-game-gold text-black font-extrabold text-sm hover:bg-game-gold/90 transition-all flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(251,191,36,0.2)]"
              >
                {nextLessonTitle ? "Next Lesson" : "Fight Boss"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => {
                  analyticsApi.logEvent('return_to_map_clicked');
                  onReturnToMap();
                }}
                className="py-3.5 px-6 rounded-xl bg-[#13131A] border border-[#181820] text-slate-300 font-bold text-sm hover:bg-[#181820] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Map className="w-4 h-4" />
                Return to Map
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
