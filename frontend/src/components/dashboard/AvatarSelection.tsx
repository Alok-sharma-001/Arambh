import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wand2, Sword, FlaskConical } from 'lucide-react';
import { useProgressionStore } from '../../store/progressionStore';
import { useAuthStore } from '../../store/authStore';
import { analyticsApi } from '../../services/analyticsApi';

const CLASSES = [
  { 
    id: 'Python Mage', 
    icon: Wand2, 
    color: 'text-game-purple', 
    bg: 'bg-game-purple/10', 
    border: 'border-game-purple/50', 
    desc: 'Masters of the arcane syntax. Excels in coding logic, decorators, and OOP wizardry.' 
  },
  { 
    id: 'Automation Rogue', 
    icon: Sword, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/50', 
    desc: 'Stealthy scripters. Automates tasks, parses files, and bypasses manual labor.' 
  },
  { 
    id: 'Data Warrior', 
    icon: FlaskConical, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/50', 
    desc: 'Frontline analysts. Conquers massive data sets with Pandas, NumPy, and brute statistics.' 
  },
];

export const AvatarSelection: React.FC = () => {
  const { stats, setClass } = useProgressionStore();
  const { user } = useAuthStore();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If stats is not loaded or class is already set, don't show the modal
  if (!stats || stats.player_class) {
    return null;
  }

  const handleConfirm = async () => {
    if (!selectedClass) return;
    setIsSubmitting(true);
    try {
      await setClass(selectedClass);
      // Log class_selected telemetry
      analyticsApi.logEvent('class_selected', { 
        username: user?.username || 'unknown',
        class: selectedClass 
      });
      // Redirect to the first lesson
      window.location.href = '/lesson/variables-forest/v1';
    } catch (e) {
      console.warn("Failed to set class or log telemetry:", e);
      // Fallback redirect even if telemetry fails
      window.location.href = '/lesson/variables-forest/v1';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-6 md:p-12 bg-black/95 text-white overflow-y-auto"
      >
        <Card className="w-full max-w-4xl p-8 bg-[#0D0D12] border-2 border-game-gold/30 shadow-2xl relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-game-purple/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 text-center mb-10">
            <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-game-gold mb-2">
              Welcome to Arambh, Adventurer.
            </h1>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-gold to-game-purple mb-4">
              Select Your Path
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Greetings, <strong className="text-game-gold">{user?.username || 'Adventurer'}</strong> (Level 1). 
              Choose astarting archetype to define your identity and customize your visual stats in the Python Kingdom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
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
                      ? `${cls.border} ${cls.bg} shadow-[0_0_30px_rgba(139,92,246,0.15)]` 
                      : 'border-[#181820] bg-[#13131A] hover:border-slate-700 opacity-75 hover:opacity-100'
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
                  <h3 className={`font-bold mb-2 ${isSelected ? 'text-game-gold' : 'text-slate-300'}`}>{cls.id}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cls.desc}</p>
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
                  ? 'bg-game-gold text-black hover:bg-game-gold/90 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                  : 'bg-[#181820] text-slate-500 cursor-not-allowed border border-slate-800'
              }`}
            >
              {isSubmitting ? 'Initializing...' : 'Begin Your First Quest'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
