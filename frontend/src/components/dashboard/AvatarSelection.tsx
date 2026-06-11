import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wand2, Sword, FlaskConical, BrainCircuit, Bug } from 'lucide-react';
import { useProgressionStore } from '../../store/progressionStore';

const CLASSES = [
  { id: 'Python Mage', icon: Wand2, color: 'text-game-purple', bg: 'bg-game-purple/10', border: 'border-game-purple/50', desc: 'Masters of the arcane syntax. Excel in logic and functional programming.' },
  { id: 'Code Warrior', icon: Sword, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50', desc: 'Frontline developers who tackle algorithms head-on with brute force.' },
  { id: 'Data Alchemist', icon: FlaskConical, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', desc: 'Transmutes raw data into golden insights using Pandas and NumPy.' },
  { id: 'AI Scholar', icon: BrainCircuit, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/50', desc: 'Seekers of artificial truth. Specialists in machine learning models.' },
  { id: 'Bug Hunter', icon: Bug, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/50', desc: 'Stealthy trackers who eliminate errors before they reach production.' },
];

export const AvatarSelection: React.FC = () => {
  const { stats, setClass } = useProgressionStore();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If stats is not loaded or class is already set, don't show the modal
  if (!stats || stats.player_class) {
    return null;
  }

  const handleConfirm = async () => {
    if (!selectedClass) return;
    setIsSubmitting(true);
    await setClass(selectedClass);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <Card className="w-full max-w-4xl p-8 bg-[#0D0D12] border-[#181820] shadow-2xl relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-game-purple/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 text-center mb-10">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-gold to-game-purple mb-4">
              Choose Your Path
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Welcome to the Python Kingdom. Before you begin your journey, you must declare your class. This will determine your identity in the realm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 relative z-10">
            {CLASSES.map((cls) => {
              const Icon = cls.icon;
              const isSelected = selectedClass === cls.id;
              
              return (
                <motion.div
                  key={cls.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col items-center text-center ${
                    isSelected 
                      ? `${cls.border} ${cls.bg} shadow-[0_0_30px_rgba(0,0,0,0.3)] shadow-${cls.color.split('-')[1]}-500/20` 
                      : 'border-[#181820] bg-[#13131A] hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="selection-ring"
                      className={`absolute inset-0 border-2 rounded-2xl ${cls.border}`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${cls.bg} border ${cls.border}`}>
                    <Icon className={`w-8 h-8 ${cls.color}`} />
                  </div>
                  <h3 className={`font-bold mb-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{cls.id}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cls.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center relative z-10">
            <Button 
              size="lg" 
              onClick={handleConfirm}
              disabled={!selectedClass || isSubmitting}
              className={`px-12 py-4 text-lg font-bold rounded-xl transition-all ${
                selectedClass 
                  ? 'bg-game-purple hover:bg-game-purple/80 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
                  : 'bg-[#181820] text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Awakening...' : 'Begin Journey'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
