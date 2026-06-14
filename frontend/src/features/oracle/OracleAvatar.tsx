import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Lightbulb } from 'lucide-react';
import { useOracleStore } from '../../store/oracleStore';

interface OracleAvatarProps {
  context?: string;
  onHintRequest?: (level: number) => void;
  currentError?: string | null;
}

export const OracleAvatar = ({ onHintRequest }: OracleAvatarProps) => {
  const { isOpen, toggleOracle, messages, activeHintLevel, setActiveHintLevel, currentError, setCurrentError } = useOracleStore();
  const [pulse, setPulse] = useState(false);

  // Pulse when a new error occurs
  useEffect(() => {
    if (currentError) {
      setPulse(true);
      const timer = setTimeout(() => {
        setPulse(false);
        setCurrentError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentError, setCurrentError]);

  const requestHint = () => {
    const nextLevel = Math.min(activeHintLevel + 1, 4);
    setActiveHintLevel(nextLevel);
    if (onHintRequest) onHintRequest(nextLevel);
    
    // Auto-open if requesting hint
    if (!isOpen) toggleOracle();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 sm:w-96 bg-slate-900/90 backdrop-blur-xl border border-game-purple/50 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <div className="p-3 border-b border-game-purple/30 bg-game-purple/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-game-purple animate-pulse" />
                <span className="font-bold text-white tracking-wide">Oracle Py</span>
              </div>
              <button onClick={toggleOracle} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar min-h-[200px]">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 font-mono text-sm mt-8">
                  <BrainCircuit className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                  "I am the silent observer of your code. Seek guidance when the logic fractures."
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl p-3 text-sm ${m.role === 'user' ? 'bg-game-blue text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                      {m.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t border-slate-700 bg-slate-800/50 flex gap-2">
              <button 
                onClick={requestHint}
                disabled={activeHintLevel >= 4}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-game-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-bold transition-all"
              >
                <Lightbulb className="w-4 h-4" /> 
                {activeHintLevel === 0 ? "Seek Guidance" : `Deeper Hint (${activeHintLevel}/4)`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOracle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={pulse ? {
          boxShadow: ['0 0 0 0 rgba(139,92,246,0.7)', '0 0 0 20px rgba(139,92,246,0)'],
        } : {}}
        transition={{ repeat: pulse ? Infinity : 0, duration: 1.5 }}
        className="w-14 h-14 rounded-full bg-slate-900 border-2 border-game-purple flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.6)] relative group"
      >
        <div className="absolute inset-0 rounded-full bg-game-purple/20 group-hover:bg-game-purple/40 transition-colors" />
        <BrainCircuit className="w-7 h-7 text-game-purple relative z-10" />
        {currentError && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900" />
        )}
      </motion.button>
    </div>
  );
};
