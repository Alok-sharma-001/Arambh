import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sword, ChevronRight, AlertTriangle, Play, Sparkles, 
  Clock, Zap, Trophy, RefreshCw, X, ArrowRight, Flame 
} from 'lucide-react';

import { BOSSES_REGISTRY, BossChallenge, BossData } from './bossChallengesData';
import { audioManager } from './AudioManager';
import { useProgressionStore } from '../../store/progressionStore';
import { useRegionStore } from '../../store/regionStore';
import { analyticsApi } from '../../services/analyticsApi';
import { mentorApi } from '../../services/mentorApi';
import SyntaxHighlighter from '../../components/SyntaxHighlighter';
import { Button } from '../../components/ui/Button';
import { ProgressEngine } from '../../core/progression/ProgressEngine';
import { NavigationService } from '../../core/progression/NavigationService';

interface BossArenaProps {
  regionId: string;
}

interface FloatingDamage {
  id: number;
  text: string;
  x: number;
  y: number;
  type: 'player' | 'boss' | 'crit' | 'ultimate';
}

export const BossArena: React.FC<BossArenaProps> = ({ regionId }) => {
  const navigate = useNavigate();
  const { gainXP, gainItem } = useProgressionStore();
  const { completeBoss } = useRegionStore();

  const bossData: BossData = BOSSES_REGISTRY[regionId] || BOSSES_REGISTRY['variables-forest'];

  // Game Phase State
  const [phase, setPhase] = useState<'intro' | 'dialogue' | 'battle' | 'victory' | 'defeat'>('intro');
  const [bossHp, setBossHp] = useState(bossData.maxHp);
  const [playerHp, setPlayerHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [ultimateCharge, setUltimateCharge] = useState(0); // 0 to 100

  // Dialogue & Speech
  const [speechBubble, setSpeechBubble] = useState(bossData.introduction);
  const [isGeneratingTaunt, setIsGeneratingTaunt] = useState(false);
  const [aiConversationId, setAiConversationId] = useState<number | null>(null);

  // Challenges/Puzzles Deck
  const [challengeQueue, setChallengeQueue] = useState<BossChallenge[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [dragOrder, setDragOrder] = useState<string[]>([]); // For drag-code
  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null); // For fix-bug
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Visual Effects
  const [damageTexts, setDamageTexts] = useState<FloatingDamage[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [overlayFlash, setOverlayFlash] = useState<'hit' | 'heal' | 'ultimate' | null>(null);
  const [showUltimateCinematic, setShowUltimateCinematic] = useState(false);

  // Statistics
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [critAttempts, setCritAttempts] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [fastestAnswer, setFastestAnswer] = useState<number>(Infinity);

  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());
  const damageIdRef = useRef<number>(0);

  // Initialize challenges & AI conversation
  useEffect(() => {
    // Shuffle challenges
    const shuffled = [...bossData.challenges].sort(() => Math.random() - 0.5);
    setChallengeQueue(shuffled);
    setCurrentIdx(0);
    audioManager.startBossMusic('intro');

    // Create AI Mentor Conversation for custom taunts
    mentorApi.createConversation(regionId, `boss_${regionId}`).then((res) => {
      setAiConversationId(res.id);
    }).catch(err => {
      console.warn('Failed to start AI Mentor conversation for boss taunts', err);
    });

    return () => {
      audioManager.stopBossMusic();
    };
  }, [regionId, bossData]);

  // General Timer
  useEffect(() => {
    if (phase === 'battle') {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Adjust music depending on boss health
  useEffect(() => {
    if (phase !== 'battle') return;
    const hpPercent = (bossHp / bossData.maxHp) * 100;
    if (hpPercent <= 10) {
      audioManager.startBossMusic('desperation');
    } else if (hpPercent <= 50) {
      audioManager.startBossMusic('enraged');
    } else {
      audioManager.startBossMusic('battle');
    }
  }, [bossHp, phase, bossData.maxHp]);

  // Helper: Trigger floating damage popups
  const spawnDamageText = (text: string, type: 'player' | 'boss' | 'crit' | 'ultimate', isBossSide: boolean) => {
    const id = damageIdRef.current++;
    const x = isBossSide ? 25 + Math.random() * 15 : 65 + Math.random() * 15;
    const y = 30 + Math.random() * 20;
    
    setDamageTexts((prev) => [...prev, { id, text, x, y, type }]);

    setTimeout(() => {
      setDamageTexts((prev) => prev.filter((d) => d.id !== id));
    }, 2000);
  };

  // Helper: Screen shake
  const triggerScreenShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  // Helper: Background flash
  const triggerOverlayFlash = (type: 'hit' | 'heal' | 'ultimate') => {
    setOverlayFlash(type);
    setTimeout(() => setOverlayFlash(null), 600);
  };

  // AI Mentor custom taunt builder
  const fetchCustomAiTaunt = async (userAnswer: string, correctAnswer: string, questionText: string, codeContext: string) => {
    if (!aiConversationId) return;
    setIsGeneratingTaunt(true);
    try {
      const prompt = `The player is currently in a boss battle against the '${bossData.name}'. They made a programming mistake on the following challenge:\n` +
        `Question: "${questionText}"\n` +
        `Code Context:\n${codeContext}\n` +
        `Player Answer: "${userAnswer}"\n` +
        `Correct Answer: "${correctAnswer}"\n\n` +
        `Please respond with a brief, high-impact RPG boss taunt (maximum 1 sentence, under 18 words) mocking their coding error in character. Maintain the boss element theme (${bossData.element}).`;
      
      const response = await mentorApi.sendMessage(aiConversationId, prompt, codeContext);
      setSpeechBubble(response.content);
    } catch (e) {
      console.warn('AI Mentor taunt generation error', e);
      // Fallback
      const randomTaunt = bossData.taunts[Math.floor(Math.random() * bossData.taunts.length)];
      setSpeechBubble(randomTaunt);
    } finally {
      setIsGeneratingTaunt(false);
    }
  };

  // Start the battle
  const startCombat = () => {
    setPhase('dialogue');
    audioManager.playSpell();
    setTimeout(() => {
      setPhase('battle');
      questionStartTimeRef.current = Date.now();
    }, 2000);
  };

  // Reset values for a new question
  const prepareNextChallenge = () => {
    setHasSubmitted(false);
    setSelectedLetter('');
    setSelectedBugLine(null);
    setDragOrder([]);
    setCurrentIdx((prev) => (prev + 1) % challengeQueue.length);
    questionStartTimeRef.current = Date.now();
  };

  // Submit Counter Spell
  const submitAnswer = async () => {
    if (hasSubmitted) return;

    const currentChallenge = challengeQueue[currentIdx];
    let userAns = selectedLetter;
    let isAnswerCorrect = false;

    // Validate based on challenge type
    if (currentChallenge.type === 'drag-code') {
      const orderJoined = dragOrder.join('');
      userAns = orderJoined;
      isAnswerCorrect = orderJoined === currentChallenge.correctAnswer;
    } else if (currentChallenge.type === 'fix-bug') {
      isAnswerCorrect = selectedBugLine === currentChallenge.buggyLineIndex;
      userAns = selectedBugLine !== null ? `Line ${selectedBugLine + 1}` : '';
    } else {
      isAnswerCorrect = selectedLetter === currentChallenge.correctAnswer;
    }

    const answerDuration = (Date.now() - questionStartTimeRef.current) / 1000;
    setFastestAnswer((prev) => Math.min(prev, answerDuration));
    setTotalAttempts((prev) => prev + 1);

    setHasSubmitted(true);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      // Correct Counter Spell
      audioManager.playSpell();
      setCorrectAttempts((prev) => prev + 1);
      
      // Calculate combo
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      // Ultimate charge
      const newCharge = Math.min(100, ultimateCharge + 25);
      setUltimateCharge(newCharge);

      // Crit chance calculation
      const isCrit = Math.random() < 0.15 + (newCombo * 0.05); // increases with combo
      const baseDamage = currentChallenge.difficulty === 'easy' ? 15 : currentChallenge.difficulty === 'medium' ? 25 : 35;
      const speedMultiplier = answerDuration < 5 ? 1.5 : answerDuration < 12 ? 1.2 : 1.0;
      const comboMultiplier = 1 + (newCombo * 0.1);
      const critMultiplier = isCrit ? 2.0 : 1.0;

      const finalDamage = Math.round(baseDamage * speedMultiplier * comboMultiplier * critMultiplier);

      if (isCrit) {
        setCritAttempts((prev) => prev + 1);
        audioManager.playCrit();
        spawnDamageText(`CRITICAL! -${finalDamage}`, 'crit', true);
        triggerScreenShake();
      } else {
        audioManager.playStrike();
        audioManager.playCombo(newCombo);
        spawnDamageText(`-${finalDamage}`, 'player', true);
      }

      setBossHp((prev) => {
        const nextHp = Math.max(0, prev - finalDamage);
        if (nextHp <= 0) {
          // Boss Defeated!
          setTimeout(() => {
            setPhase('victory');
            audioManager.playVictory();
            analyticsApi.logEvent('boss_victory', { region_id: regionId });
          }, 1500);
        }
        return nextHp;
      });

      // Quick success text
      setSpeechBubble('N-No! Your code is fully compiled!');
    } else {
      // Wrong Spell - Boss Attack Lands
      audioManager.playDefeat();
      setCombo(0); // Break combo

      const bossAttack = bossData.attacks[Math.floor(Math.random() * bossData.attacks.length)];
      triggerOverlayFlash('hit');
      triggerScreenShake();
      spawnDamageText(`-${bossAttack.damage} HP`, 'boss', false);

      setPlayerHp((prev) => {
        const nextHp = Math.max(0, prev - bossAttack.damage);
        if (nextHp <= 0) {
          setTimeout(() => {
            setPhase('defeat');
            audioManager.playDefeat();
            analyticsApi.logEvent('boss_defeat', { region_id: regionId });
          }, 1500);
        }
        return nextHp;
      });

      // Generate dynamic custom taunt
      const correctText = currentChallenge.options.find(o => o.letter === currentChallenge.correctAnswer)?.text || currentChallenge.correctAnswer;
      const userText = currentChallenge.options.find(o => o.letter === userAns)?.text || userAns;
      fetchCustomAiTaunt(userText, correctText, currentChallenge.question, currentChallenge.code);
    }
  };

  // Trigger Ultimate Ability
  const triggerUltimate = () => {
    if (ultimateCharge < 100 || bossHp <= 0) return;

    audioManager.playUltimate();
    setUltimateCharge(0);
    setShowUltimateCinematic(true);

    setTimeout(() => {
      setShowUltimateCinematic(false);
      triggerOverlayFlash('ultimate');
      triggerScreenShake();

      const ultDamage = 50;
      spawnDamageText(`ULTIMATE NOVA! -${ultDamage}`, 'ultimate', true);

      setBossHp((prev) => {
        const nextHp = Math.max(0, prev - ultDamage);
        if (nextHp <= 0) {
          setTimeout(() => {
            setPhase('victory');
            audioManager.playVictory();
            analyticsApi.logEvent('boss_victory', { region_id: regionId });
          }, 1500);
        }
        return nextHp;
      });
    }, 2500);
  };

  // Claim Rewards
  const claimRewards = async () => {
    gainItem(bossData.artifactReward);
    const xpReward = bossData.level * 200 + 100;
    await ProgressEngine.completeBoss(regionId, xpReward);
    NavigationService.returnToWorldMap();
  };

  // Calculate Rank Letter
  const getRank = () => {
    const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;
    if (accuracy >= 0.95 && maxCombo >= 5) return 'SSS';
    if (accuracy >= 0.88 && maxCombo >= 4) return 'SS';
    if (accuracy >= 0.80) return 'S';
    if (accuracy >= 0.70) return 'A';
    if (accuracy >= 0.60) return 'B';
    if (accuracy >= 0.50) return 'C';
    return 'D';
  };

  // Setup challenge queues
  const currentChallenge = challengeQueue[currentIdx];

  // Helper: Drag-code select
  const toggleDragBlock = (blockLetter: string) => {
    if (hasSubmitted) return;
    if (dragOrder.includes(blockLetter)) {
      setDragOrder((prev) => prev.filter((b) => b !== blockLetter));
    } else {
      setDragOrder((prev) => [...prev, blockLetter]);
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-[#05050A] text-white font-sans overflow-hidden relative select-none ${screenShake ? 'animate-shake' : ''}`}>
      {/* Background canvas fog overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,10,35,0.8),#05050A)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-clouds bg-repeat-x opacity-10 pointer-events-none z-0 animate-cloud-scroll" />

      {/* Screen Overlay Flash */}
      {overlayFlash === 'hit' && <div className="absolute inset-0 bg-red-600/30 backdrop-blur-[1px] z-50 pointer-events-none animate-flash" />}
      {overlayFlash === 'heal' && <div className="absolute inset-0 bg-emerald-500/25 backdrop-blur-[1px] z-50 pointer-events-none animate-flash" />}
      {overlayFlash === 'ultimate' && <div className="absolute inset-0 bg-yellow-500/40 backdrop-blur-[2px] z-50 pointer-events-none animate-flash" />}

      {/* Floating Damage Text Container */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {damageTexts.map((dmg) => (
          <motion.div
            key={dmg.id}
            initial={{ opacity: 0, scale: 0.5, y: `${dmg.y}%` }}
            animate={{ opacity: 1, scale: [1, 1.4, 1], y: `${dmg.y - 12}%` }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className={`absolute font-black text-4xl tracking-tighter text-center w-full select-none ${
              dmg.type === 'crit' ? 'text-game-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] scale-125' :
              dmg.type === 'ultimate' ? 'text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.9)] scale-150' :
              dmg.type === 'boss' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
              'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'
            }`}
            style={{ left: `${dmg.x}%`, transform: 'translateX(-50%)' }}
          >
            {dmg.text}
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Ultimate Cinematic */}
      <AnimatePresence>
        {showUltimateCinematic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
              className="text-center space-y-6"
            >
              <Zap className="w-28 h-28 text-game-gold mx-auto animate-pulse-glow" />
              <h1 className="text-6xl font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-game-gold via-yellow-200 to-purple-600 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                Python Nova
              </h1>
              <p className="text-purple-400 font-mono tracking-widest uppercase text-sm">
                Executing Ultimate Syntax Compression...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 border-b border-warm-white/[0.06] flex items-center justify-between px-6 bg-near-black/50 backdrop-blur-xl relative z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => NavigationService.returnToWorldMap()}
            className="border-white/5 hover:bg-white/5 text-slate-400 hover:text-white"
          >
            <X size={16} /> Exit
          </Button>
          <span className="text-mid-gray/50">|</span>
          <span className="font-mono text-xs text-game-gold tracking-widest uppercase">
            Boss Battle 2.0 • Region {bossData.level}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold font-mono">
            {bossData.element}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-purple-950/20 border border-purple-500/20 text-purple-400 text-xs font-bold font-mono">
            {bossData.difficulty}
          </div>
        </div>
      </header>

      {/* Phase Renderers */}
      <main className="flex-1 flex items-center justify-center relative z-10 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Phase 1: Intro Cinematic */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl text-center z-10 space-y-8"
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-36 h-36 mx-auto bg-black border-4 border-red-500 rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.4)]"
              >
                <div className="text-7xl animate-pulse">👹</div>
                <div className="absolute inset-0 bg-red-600/10 animate-ping" />
              </motion.div>
              <div className="space-y-3">
                <p className="text-red-400 font-mono tracking-[0.25em] uppercase text-xs">A corrupt anomaly approaches</p>
                <h1 className="text-5xl font-black uppercase tracking-wider text-white">
                  {bossData.name}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                  {bossData.introduction}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={startCombat}
                className="bg-red-600 hover:bg-red-500 hover:shadow-red-glow border-none px-8 py-4 text-lg w-full max-w-sm mx-auto shadow-xl"
              >
                Face the Guardian
              </Button>
            </motion.div>
          )}

          {/* Phase 2: Dialogue / Transition */}
          {phase === 'dialogue' && (
            <motion.div
              key="dialogue"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl text-center space-y-6 z-10 p-8 border border-red-500/20 bg-black/80 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)]"
            >
              <div className="text-red-400 font-mono tracking-widest text-xs uppercase">Boss dialogue</div>
              <p className="text-2xl font-semibold italic text-white leading-relaxed">
                "{bossData.taunts[0]}"
              </p>
              <div className="w-12 h-1 bg-red-600 mx-auto rounded" />
            </motion.div>
          )}

          {/* Phase 3: Active Battle Arena */}
          {phase === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left: RPG Boss Card & HUD */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Boss Panel */}
                <div className="bg-near-black/60 border border-warm-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                  {/* Floating particles background inside boss card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none" />
                  
                  {/* Character Frame */}
                  <div className="w-32 h-32 bg-black border-2 border-red-500/40 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.2)] animate-float">
                    <div className="text-7xl">👿</div>
                    <div className="absolute bottom-2 bg-red-600/90 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                      LVL {bossData.level}
                    </div>
                  </div>

                  {/* Details */}
                  <h2 className="mt-4 font-display text-2xl font-black uppercase tracking-tight text-white">
                    {bossData.name}
                  </h2>
                  
                  {/* HP Bar */}
                  <div className="w-full mt-6 space-y-2">
                    <div className="flex items-center justify-between text-xs font-black font-mono">
                      <span className="text-red-400 uppercase tracking-widest">Boss HP</span>
                      <span className="text-white">{bossHp} / {bossData.maxHp}</span>
                    </div>
                    <div className="h-4 w-full bg-slate-900 rounded-full border border-white/5 p-0.5 relative overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-sm"
                        animate={{ width: `${(bossHp / bossData.maxHp) * 100}%` }}
                        transition={{ type: 'spring', bounce: 0.15 }}
                      />
                    </div>
                  </div>

                  {/* Speech Bubble */}
                  <div className="w-full mt-6 relative bg-[#0D0D12] border border-white/5 rounded-xl p-4 min-h-[72px]">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0d0d12] border-t border-l border-white/5 rotate-45" />
                    {isGeneratingTaunt ? (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <span className="animate-bounce font-black text-red-500">•</span>
                        <span className="animate-bounce font-black text-red-500 [animation-delay:0.2s]">•</span>
                        <span className="animate-bounce font-black text-red-500 [animation-delay:0.4s]">•</span>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-mid-gray leading-relaxed text-center italic">
                        "{speechBubble}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Player HUD Card */}
                <div className="bg-near-black/60 border border-warm-white/[0.06] rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Player HP</h4>
                      <div className="text-2xl font-black mt-1 text-white">{playerHp} / 100</div>
                    </div>
                    {combo > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/25 animate-pulse">
                        <Flame className="w-4.5 h-4.5 text-orange-500 fill-orange-500" />
                        <span className="font-mono text-sm font-black text-orange-500">COMBO x{combo}</span>
                      </div>
                    )}
                  </div>

                  {/* Player HP Bar */}
                  <div className="h-3 w-full bg-slate-900 rounded-full border border-white/5 p-0.5 relative overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-sm"
                      animate={{ width: `${playerHp}%` }}
                      transition={{ type: 'spring', bounce: 0.1 }}
                    />
                  </div>

                  {/* Ultimate Charger Bar */}
                  <div className="grid grid-cols-5 gap-1.5 items-center pt-2">
                    <div className="col-span-4 space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ultimate energy</span>
                      <div className="h-2.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden p-0.5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-game-gold to-yellow-300 rounded-sm"
                          animate={{ width: `${ultimateCharge}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={triggerUltimate}
                      disabled={ultimateCharge < 100 || bossHp <= 0}
                      className={`h-11 rounded-lg font-black uppercase text-[10px] tracking-wider transition-all duration-300 ${
                        ultimateCharge >= 100
                          ? 'bg-game-gold text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] cursor-pointer animate-pulse'
                          : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      ULT
                    </button>
                  </div>
                </div>

              </div>

              {/* Right: Coding Counter Spell Card */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Combat Card */}
                {currentChallenge ? (
                  <div className="bg-near-black/60 border border-warm-white/[0.06] rounded-2xl p-6 flex flex-col h-full shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[90px] pointer-events-none" />

                    <div className="flex justify-between items-center border-b border-warm-white/[0.06] pb-4">
                      <span className="px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Zap size={11} /> Counter Spell
                      </span>
                      <span className="font-mono text-xs text-mid-gray font-bold">
                        Challenge {currentIdx + 1} of {challengeQueue.length}
                      </span>
                    </div>

                    {/* Challenge Prompt */}
                    <div className="my-6">
                      <h3 className="text-lg font-bold text-white leading-relaxed">
                        {currentChallenge.question}
                      </h3>
                    </div>

                    {/* Code Snippet Box */}
                    {currentChallenge.code && currentChallenge.code !== '# Choose the correct syntax' && currentChallenge.code !== '# Put the lines in order' && (
                      <div className="mb-6 rounded-xl bg-code-editor-bg border border-warm-white/[0.06] p-4 font-mono text-sm leading-relaxed overflow-x-auto">
                        {currentChallenge.type === 'fix-bug' ? (
                          <div className="space-y-1 select-text">
                            {currentChallenge.code.split('\n').map((line, idx) => {
                              const isSelected = selectedBugLine === idx;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => !hasSubmitted && setSelectedBugLine(idx)}
                                  className={`flex items-center gap-4 px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                    isSelected ? 'bg-red-500/20 border border-red-500/40' : 'hover:bg-white/5 border border-transparent'
                                  }`}
                                >
                                  <span className="text-slate-600 font-bold select-none text-[11px] w-4">{idx + 1}</span>
                                  <span className="flex-1 whitespace-pre">{line}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <SyntaxHighlighter code={currentChallenge.code} />
                        )}
                      </div>
                    )}

                    {/* Interactive inputs depending on challenge type */}
                    <div className="flex-1 flex flex-col justify-end space-y-3">
                      
                      {/* MCQ / Predict Output Options */}
                      {(currentChallenge.type === 'mcq' || currentChallenge.type === 'predict-output' || currentChallenge.type === 'fill-blank') && (
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                          {currentChallenge.options.map((option) => {
                            const isSelected = selectedLetter === option.letter;
                            const isCorrectOption = hasSubmitted && option.letter === currentChallenge.correctAnswer;
                            const isWrongOption = hasSubmitted && isSelected && !isCorrect;

                            let borderCls = 'border-warm-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/[0.02]';
                            let labelBgCls = 'bg-warm-white/[0.06] text-mid-gray';
                            let bgCls = 'bg-black/20';

                            if (isCorrectOption) {
                              borderCls = 'border-emerald-500 bg-emerald-500/5';
                              labelBgCls = 'bg-emerald text-black';
                            } else if (isWrongOption) {
                              borderCls = 'border-red-500 bg-red-500/5';
                              labelBgCls = 'bg-red-500 text-black';
                            } else if (isSelected && !hasSubmitted) {
                              borderCls = 'border-cyan-400 bg-cyan-400/5';
                              labelBgCls = 'bg-cyan-400 text-black';
                            }

                            return (
                              <button
                                key={option.letter}
                                onClick={() => !hasSubmitted && setSelectedLetter(option.letter)}
                                disabled={hasSubmitted}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${borderCls} ${bgCls}`}
                              >
                                <span className={`w-7 h-7 rounded-full ${labelBgCls} font-mono text-xs font-black flex items-center justify-center shrink-0`}>
                                  {option.letter}
                                </span>
                                <span className="text-sm font-semibold text-slate-200">{option.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Drag-and-drop Code Block Ordering */}
                      {currentChallenge.type === 'drag-code' && currentChallenge.dragBlocks && (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tap blocks in the correct logical execution order:</p>
                          
                          {/* Sorter Area */}
                          <div className="min-h-[64px] rounded-xl border border-dashed border-warm-white/10 bg-black/40 p-3 flex flex-wrap gap-2 items-center">
                            {dragOrder.length === 0 && <span className="text-xs text-slate-500 font-semibold italic pl-2">Select blocks below...</span>}
                            {dragOrder.map((letter) => {
                              const blockText = currentChallenge.options.find((o) => o.letter === letter)?.text;
                              return (
                                <button
                                  key={letter}
                                  onClick={() => toggleDragBlock(letter)}
                                  disabled={hasSubmitted}
                                  className="px-3.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-2 hover:bg-cyan-500/20"
                                >
                                  {blockText}
                                  {!hasSubmitted && <span className="text-[9px] opacity-60">✕</span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* Options Block Area */}
                          <div className="flex flex-wrap gap-2.5 pt-2">
                            {currentChallenge.options.map((option) => {
                              const isChosen = dragOrder.includes(option.letter);
                              return (
                                <button
                                  key={option.letter}
                                  onClick={() => toggleDragBlock(option.letter)}
                                  disabled={hasSubmitted || isChosen}
                                  className={`px-4 py-3.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                                    isChosen
                                      ? 'border-white/5 bg-white/5 opacity-30 text-slate-600'
                                      : 'border-warm-white/[0.08] bg-black/20 text-slate-200 hover:border-cyan-500/30'
                                  }`}
                                >
                                  {option.text}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Submit Actions */}
                      <div className="pt-6 border-t border-warm-white/[0.06] flex items-center gap-3">
                        {!hasSubmitted ? (
                          <Button
                            variant="primary"
                            onClick={submitAnswer}
                            disabled={
                              (currentChallenge.type === 'drag-code' && dragOrder.length === 0) ||
                              (currentChallenge.type === 'fix-bug' && selectedBugLine === null) ||
                              ((currentChallenge.type === 'mcq' || currentChallenge.type === 'predict-output' || currentChallenge.type === 'fill-blank') && !selectedLetter)
                            }
                            leftIcon={<Sword className="w-5 h-5" />}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-glow border-none py-4 text-base shadow-lg"
                          >
                            Cast Counter Spell
                          </Button>
                        ) : (
                          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-[#0D0D12]/90 border border-white/5 p-4 rounded-xl">
                            <div className="flex-1">
                              <span className={`text-xs font-black uppercase tracking-wider block ${isCorrect ? 'text-emerald' : 'text-red-500'}`}>
                                {isCorrect ? 'Spell Succeeded!' : 'Spell Failed!'}
                              </span>
                              <p className="text-xs text-mid-gray/80 mt-1 leading-relaxed">
                                {currentChallenge.explanation}
                              </p>
                            </div>
                            <Button
                              variant="primary"
                              onClick={prepareNextChallenge}
                              rightIcon={<ArrowRight className="w-4 h-4" />}
                              className="bg-cyan-600 hover:bg-cyan-500 border-none shrink-0"
                            >
                              Next Wave
                            </Button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                    <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
                    <span className="text-sm font-semibold text-slate-400">Loading magic blocks...</span>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* Phase 4: Victory / Loot Screen */}
          {phase === 'victory' && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl text-center p-10 border border-game-gold bg-black/90 backdrop-blur-2xl rounded-2xl shadow-[0_0_80px_rgba(251,191,36,0.25)] relative overflow-hidden z-10"
            >
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-game-gold/20 blur-[100px] pointer-events-none" />
              
              <Trophy className="w-24 h-24 text-game-gold mx-auto mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce" />
              
              <h1 className="text-4xl font-black uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-game-gold via-yellow-100 to-amber-500">
                Victory Achieved
              </h1>
              <p className="text-game-emerald text-sm font-bold uppercase tracking-[0.2em] mt-2">
                Trial cleared successfully
              </p>

              {/* Performance Stats */}
              <div className="my-8 grid grid-cols-2 gap-4 border-t border-b border-white/5 py-6 font-mono">
                <div className="text-left bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</div>
                  <div className="text-xl font-black text-white mt-1">
                    {totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}%
                  </div>
                </div>
                <div className="text-left bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Max Combo</div>
                  <div className="text-xl font-black text-orange-500 mt-1">x{maxCombo}</div>
                </div>
                <div className="text-left bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Battle Rating</div>
                  <div className="text-2xl font-black text-game-gold mt-0.5 tracking-tighter">
                    Rank {getRank()}
                  </div>
                </div>
                <div className="text-left bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Elapsed Time</div>
                  <div className="text-xl font-black text-white mt-1">
                    {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                  </div>
                </div>
              </div>

              {/* Loot Explosion List */}
              <div className="space-y-2 mb-8">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-3">Loot drops acquired</span>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {bossData.lootReward.map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 * idx }}
                      className="px-3 py-1.5 rounded-lg bg-game-gold/10 border border-game-gold/30 text-game-gold text-xs font-bold font-mono"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={claimRewards}
                rightIcon={<ChevronRight className="w-5 h-5" />}
                className="bg-game-gold hover:bg-yellow-400 text-black font-bold text-lg w-full py-4 shadow-xl"
              >
                Claim Rewards & Continue
              </Button>
            </motion.div>
          )}

          {/* Phase 5: Defeat / Fail Screen */}
          {phase === 'defeat' && (
            <motion.div
              key="defeat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md text-center p-10 border border-red-500 bg-black/90 backdrop-blur-2xl rounded-2xl shadow-[0_0_80px_rgba(239,68,68,0.25)] relative overflow-hidden z-10 space-y-6"
            >
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-600/10 blur-[100px] pointer-events-none" />
              
              <AlertTriangle className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
              
              <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-wider text-red-500">
                  Quest Failed
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  Your execution thread was terminated. The memory structures have collapsed.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                  leftIcon={<RefreshCw className="w-5 h-5" />}
                  className="bg-red-600 hover:bg-red-500 w-full py-4 text-base border-none font-bold"
                >
                  Retry Challenge
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => NavigationService.returnToWorldMap()}
                  className="w-full py-4 text-base border-white/10 text-slate-400 hover:text-white"
                >
                  Return to World Map
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default BossArena;
