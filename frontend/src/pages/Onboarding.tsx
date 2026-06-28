import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Wand2, Sword, FlaskConical, ChevronRight, Sparkles } from 'lucide-react';
import { useProgressionStore } from '../store/progressionStore';
import { useAuthStore } from '../store/authStore';
import { analyticsApi } from '../services/analyticsApi';

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

export default function Onboarding() {
  const navigate = useNavigate();
  const { setClass } = useProgressionStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    setStep(2);
  };

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
      window.location.href = '/lesson/variables-forest/v1';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-near-black relative overflow-hidden font-body">
      {/* Background Glow Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-royal-purple/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="p-10 md:p-14 bg-[#0D0D12]/90 border border-slate-800/80 rounded-2xl relative overflow-hidden shadow-2xl">
                {/* Glow behind the emblem */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-game-gold/10 blur-[80px] rounded-full pointer-events-none" />

                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="w-24 h-24 mx-auto mb-8 bg-[#13131A] border border-game-gold/40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                >
                  <Sparkles className="w-10 h-10 text-game-gold" />
                </motion.div>

                <h1 className="text-xs font-bold uppercase tracking-[0.4em] text-game-gold mb-3">
                  Welcome to Arambh
                </h1>
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-gold via-yellow-100 to-game-purple mb-6 font-display">
                  Master Python Through Visual Adventures
                </h2>
                
                <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                  Welcome, initiate! You are about to embark on a journey through the Python Kingdom. 
                  Uncover memory allocations, code visual logic, and level up your Python intelligence.
                </p>

                <Button
                  size="lg"
                  onClick={handleNextStep}
                  rightIcon={<ChevronRight className="w-5 h-5" />}
                  className="px-10 py-4 text-base font-bold uppercase tracking-wider rounded-xl bg-game-gold text-black hover:bg-game-gold/90 hover:shadow-gold-glow transition-all duration-300"
                >
                  Create Character
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="class-selection"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 md:p-12 bg-[#0D0D12]/90 border border-slate-800/80 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-game-purple/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 text-center mb-10">
                  <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-game-gold mb-2">
                    Archetype Selection
                  </h1>
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-gold to-game-purple mb-4 font-display">
                    Select Your Path
                  </h2>
                  <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                    Greetings, <strong className="text-game-gold">{user?.username || 'Adventurer'}</strong> (Level 1). 
                    Choose a starting archetype to define your identity and customize your visual stats in the Python Kingdom.
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
                        className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 flex flex-col items-center text-center ${
                          isSelected 
                            ? `border-game-gold ${cls.bg} shadow-[0_0_30px_rgba(251,191,36,0.15)]` 
                            : 'border-[#181820] bg-[#13131A] hover:border-slate-700 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${cls.bg} border ${cls.border}`}>
                          <Icon className={`w-8 h-8 ${cls.color}`} />
                        </div>
                        <h3 className={`font-bold mb-2 font-display ${isSelected ? 'text-game-gold' : 'text-slate-300'}`}>{cls.id}</h3>
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
                    className={`px-12 py-4 text-base font-bold uppercase tracking-wider rounded-xl transition-all ${
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
