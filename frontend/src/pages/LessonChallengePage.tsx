import { useState, useRef, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { usePlayer } from '@/context/PlayerContext';
import { analyticsApi } from '@/services/analyticsApi';
import { useConfetti } from '@/hooks/useConfetti';
import { sampleQuestions } from '@/data/regions';
import { regions } from '@/data/regions';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import { Flame, Check, X as XIcon, ChevronRight, Lightbulb } from 'lucide-react';
import { MentorChatPanel } from '@/components/mentor/MentorChatPanel';
import { playSound } from '../utils/audio';
import { useEffect } from 'react';
import { useRegionStore } from '../store/regionStore';

export default function LessonChallengePage() {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const { player, addXP, incrementStreak, resetStreak } = usePlayer();
  const skipRegion = useRegionStore((state) => state.skipRegion);
  const { burst } = useConfetti();
  const cardRef = useRef<HTMLDivElement>(null);

  const getBackUrl = () => {
    const mapSource = sessionStorage.getItem('mapSource');
    if (mapSource === 'region' && regionId) {
      return `/region/${regionId}`;
    }
    if (mapSource === 'map') {
      return '/world-map';
    }
    return sessionStorage.getItem('arambh_source_route') || (regionId ? `/region/${regionId}` : '/world-map');
  };
  const sourceRoute = getBackUrl();
  const isRegionMap = sessionStorage.getItem('mapSource') === 'region' || sourceRoute.startsWith('/region/');
  const mapLabel = isRegionMap ? 'Region Map' : 'World Map';

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [animatingXP, setAnimatingXP] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showLevelUpSuccess, setShowLevelUpSuccess] = useState(false);
  const [showLevelUpFail, setShowLevelUpFail] = useState(false);
  const [leftTab, setLeftTab] = useState<'code' | 'visualization'>('code');

  useEffect(() => {
    if (regionId) {
      analyticsApi.logEvent('training_ground_enter', { region_id: regionId });
      const startTime = Date.now();

      const loggedStarted = localStorage.getItem('arambh_first_training_ground_started');
      if (!loggedStarted) {
        analyticsApi.logEvent('first_training_ground_started', { region_id: regionId });
        localStorage.setItem('arambh_first_training_ground_started', 'true');
      }

      const handleUnload = () => {
        const durationSeconds = Math.round((Date.now() - startTime) / 1000);
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
          const payload = JSON.stringify({
            event_type: 'training_ground_time_spent',
            details: {
              region_id: regionId,
              duration_seconds: durationSeconds
            }
          });
          const baseUrl = import.meta.env.VITE_API_URL || '/api';
          const url = baseUrl.startsWith('http') 
            ? `${baseUrl}/analytics/event` 
            : `${window.location.origin}${baseUrl}/analytics/event`;
          
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenString}`
            },
            body: payload,
            keepalive: true
          }).catch(() => {});
        }
      };

      window.addEventListener('beforeunload', handleUnload);
      return () => {
        window.removeEventListener('beforeunload', handleUnload);
        handleUnload();
      };
    }
  }, [regionId]);
  const [trainingMode, setTrainingMode] = useState<'topic' | 'random' | 'level_up'>('topic');

  const region = regions.find((r) => r.id === regionId);
  const questions = useMemo(() => {
    if (trainingMode === 'random') {
      return [...sampleQuestions].sort((a, b) => b.id.localeCompare(a.id));
    }

    let filtered = [...sampleQuestions];
    if (regionId === 'variables-forest') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('v-basic-'));
    } else if (regionId === 'data-types-valley') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('d-val-') || item.id === 'q1');
    } else if (regionId === 'loops-desert') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('l-des-') || ['q2', 'q5'].includes(item.id));
    } else if (regionId === 'functions-mountain') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('f-mou-') || item.id === 'q3');
    } else if (regionId === 'collections-kingdom') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('c-kin-') || ['q4', 'q7', 'q8'].includes(item.id));
    } else if (regionId === 'oop-citadel') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('o-cit-'));
    } else if (regionId === 'exception-abyss') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('e-aby-') || item.id === 'q6');
    } else if (regionId === 'filesystem-ruins') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('fs-rui-'));
    } else if (regionId === 'modules-harbor') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('m-har-'));
    } else if (regionId === 'algorithm-arena') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('a-are-'));
    } else if (regionId === 'iterator-isles') {
      filtered = sampleQuestions.filter((item) => item.id.startsWith('i-tg-'));
    } else {
      filtered = sampleQuestions.slice(0, 4);
    }

    if (trainingMode === 'level_up') {
      return filtered.slice(0, 5);
    }
    return filtered;
  }, [regionId, trainingMode]);
  const question = questions[currentQ];

  const changeTrainingMode = (mode: 'topic' | 'random' | 'level_up') => {
    setTrainingMode(mode);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    setAnimatingXP(0);
    setIncorrectAnswers(0);
  };

  const handleSelect = (letter: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(letter);
  };

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer || !question) return;

    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setHasSubmitted(true);

    analyticsApi.logEvent('training_attempt', {
      region_id: regionId,
      question_id: question.id,
      is_correct: correct
    });

    if (correct) {
      const nextStreak = player.streak + 1;
      playSound.combo(nextStreak);
      incrementStreak();
      
      let bonusXP = 0;
      if (nextStreak >= 5) bonusXP = 15;
      else if (nextStreak >= 3) bonusXP = 10;
      else if (nextStreak >= 1) bonusXP = 5;

      const totalXP = question.xpReward + bonusXP;
      addXP(totalXP);

      // Animate XP counter
      let xpVal = 0;
      const interval = setInterval(() => {
        xpVal += Math.ceil(totalXP / 20);
        if (xpVal >= totalXP) {
          xpVal = totalXP;
          clearInterval(interval);
        }
        setAnimatingXP(xpVal);
      }, 40);

      // Confetti burst
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        burst(rect.left + rect.width / 2, rect.top + rect.height / 3);
      }
    } else {
      resetStreak();
      setIncorrectAnswers((prev) => prev + 1);
    }
  }, [selectedAnswer, question, incrementStreak, addXP, resetStreak, burst, player.streak, regionId]);

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      // Slide out current
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          x: '-100%', opacity: 0, duration: 0.3, ease: 'power2.in',
          onComplete: () => {
            setCurrentQ((prev) => prev + 1);
            setSelectedAnswer(null);
            setHasSubmitted(false);
            setIsCorrect(null);
            setShowHint(false);
            setAnimatingXP(0);
            // Slide in new
            gsap.fromTo(cardRef.current, { x: '100%', opacity: 0 }, { x: '0%', opacity: 1, duration: 0.4, ease: 'expo.out', delay: 0.1 });
          },
        });
      }
    } else {
      // Challenge complete
      if (trainingMode === 'level_up') {
        if (incorrectAnswers === 0) {
          setShowLevelUpSuccess(true);
        } else {
          setShowLevelUpFail(true);
        }
      } else {
        navigate(sourceRoute);
      }
    }
  };

  const handleRetryChallenge = () => {
    setShowLevelUpFail(false);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    setAnimatingXP(0);
    setIncorrectAnswers(0);
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-near-black flex items-center justify-center">
        <p className="text-mid-gray">No questions available.</p>
      </div>
    );
  }

  const difficultyDots = question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : 3;

  return (
    <main className="min-h-screen bg-near-black pt-[72px]">
      {/* Training Header */}
      <div className="border-b border-warm-white/[0.06] h-14">
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate(sourceRoute)} className="text-mid-gray hover:text-gold transition-colors">{mapLabel}</button>
            <span className="text-mid-gray">/</span>
            <span className="text-mid-gray">{region?.name || 'Challenge'}</span>
            <span className="text-mid-gray">/</span>
            <span className="text-warm-white font-medium">Training Ground</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Flame size={16} className="text-gold" />
              <span className="font-mono text-sm font-bold text-gold">{player.streak}</span>
            </div>
            <span className="font-mono text-sm font-bold text-emerald">+{player.sessionXP} XP</span>
            <span className="font-mono text-xs text-mid-gray">{currentQ + 1} / {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Training Arena */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6 md:py-8">
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-warm-white/[0.08] bg-deep-charcoal/70 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-lg font-black text-white tracking-tight">Training Ground</h1>
            <p className="mt-0.5 text-xs text-mid-gray/70">Choose focused topic practice or a random question mix.</p>
          </div>
          <div className="inline-flex rounded-lg border border-warm-white/[0.08] bg-near-black p-1 flex-wrap gap-1">
            {[
              { key: 'topic' as const, label: 'Topic Practice' },
              { key: 'random' as const, label: 'Random Mix' },
              { key: 'level_up' as const, label: 'Level Up Challenge' },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => changeTrainingMode(mode.key)}
                className={`rounded-md px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-apple-fast ${
                  trainingMode === mode.key
                    ? 'bg-gold text-near-black'
                    : 'text-mid-gray hover:text-warm-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {/* Left - Code Visualizer */}
          <div className="bg-code-editor-bg border border-warm-white/[0.08] rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-warm-white/[0.06]">
              <button 
                onClick={() => setLeftTab('code')}
                className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  leftTab === 'code' ? 'text-gold border-b-2 border-gold' : 'text-mid-gray hover:text-warm-white'
                }`}
              >
                CODE
              </button>
              <button 
                onClick={() => setLeftTab('visualization')}
                className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  leftTab === 'visualization' ? 'text-gold border-b-2 border-gold' : 'text-mid-gray hover:text-warm-white'
                }`}
              >
                VISUALIZATION
              </button>
            </div>

            {/* Code / Visualization display */}
            <div className="p-4 min-h-[300px]">
              {leftTab === 'code' ? (
                <div className="flex">
                  <div className="w-8 pr-3 text-right font-mono text-xs text-warm-white/15 select-none shrink-0">
                    {question.code.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <SyntaxHighlighter code={question.code} />
                  </div>
                </div>
              ) : (
                <div className="p-4 text-xs font-mono text-slate-300 bg-slate-900/60 rounded-lg space-y-2">
                  <div className="text-gold font-bold uppercase tracking-wider mb-2">Line Execution Graph</div>
                  {question.code.split('\n').map((lineText, i) => (
                    <div key={i} className="flex items-center gap-3 p-1.5 rounded bg-slate-800/40 border border-slate-800">
                      <span className="text-slate-500 w-4 text-right">{i + 1}</span>
                      <span className="text-white flex-1">{lineText}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                        Step {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hint toggle */}
            <div className="px-4 pb-4.5">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-gold text-xs font-bold hover:underline"
              >
                <Lightbulb size={13} />
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
              {showHint && (
                <div className="mt-2.5 bg-gold/5 border border-gold/15 rounded-lg px-3.5 py-2.5 text-xs text-mid-gray/80">
                  Pay attention to the operators used and what they do in Python!
                </div>
              )}
            </div>
          </div>

          {/* Right - Challenge Card */}
          <div
            ref={cardRef}
            className="relative"
            style={{
              background: 'radial-gradient(circle at 70% 50%, rgba(212,183,110,0.04) 0%, transparent 50%)',
            }}
          >
            <div className="bg-deep-charcoal border-2 border-gold/15 rounded-xl p-5 md:p-6 lg:p-7">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1.5 rounded-full border border-gold/30 bg-gold/15 text-gold text-[9px] font-extrabold uppercase tracking-wider">
                  TRAINING GROUND
                </span>
                <span className="font-mono text-xs text-mid-gray">
                  Question {currentQ + 1} of {questions.length}
                </span>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-1.5 mt-2.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i <= difficultyDots
                        ? question.difficulty === 'easy' ? 'bg-emerald' : question.difficulty === 'medium' ? 'bg-gold' : 'bg-red-400'
                        : 'border border-warm-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Streak & Combo Flame */}
              {player.streak > 0 && (
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/25">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4.5 h-4.5 text-orange-500 fill-orange-500 animate-bounce" />
                    <div>
                      <div className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Streak active</div>
                      <div className="text-xs font-black text-white">{player.streak} Correct Answers</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-orange-500 text-black">
                    {player.streak >= 5 ? 'COMBO x3 (+15 XP)' : player.streak >= 3 ? 'COMBO x2 (+10 XP)' : 'COMBO x1 (+5 XP)'}
                  </span>
                </div>
              )}

              {/* Question */}
              <h3 id="training-question" className="mt-4.5 font-display font-black text-lg text-white tracking-tight leading-snug">
                {question.question}
              </h3>

              {/* Answer Options */}
              <div id="training-options" className="mt-5 space-y-2.5">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option.letter;
                  const isCorrectOption = hasSubmitted && option.letter === question.correctAnswer;
                  const isWrongOption = hasSubmitted && isSelected && !isCorrect;

                  let borderColor = 'border-warm-white/[0.08]';
                  let bgColor = 'bg-transparent';
                  let labelBg = 'bg-warm-white/[0.06]';
                  let labelText = 'text-warm-white';

                  if (isCorrectOption) {
                    borderColor = 'border-emerald';
                    bgColor = 'bg-emerald/[0.08]';
                    labelBg = 'bg-emerald';
                    labelText = 'text-near-black';
                  } else if (isWrongOption) {
                    borderColor = 'border-red-400';
                    bgColor = 'bg-red-400/[0.08]';
                    labelBg = 'bg-red-400';
                    labelText = 'text-near-black';
                  } else if (isSelected && !hasSubmitted) {
                    borderColor = 'border-gold';
                    bgColor = 'bg-gold/[0.08]';
                    labelBg = 'bg-gold';
                    labelText = 'text-near-black';
                  }

                  return (
                    <button
                      key={option.letter}
                      onClick={() => handleSelect(option.letter)}
                      disabled={hasSubmitted}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border ${borderColor} ${bgColor} transition-apple-fast hover:border-gold/25 hover:bg-gold/[0.02] disabled:cursor-default`}
                    >
                      <span className={`w-7 h-7 rounded-full ${labelBg} ${labelText} font-mono text-xs font-bold flex items-center justify-center shrink-0`}>
                        {option.letter}
                      </span>
                      <span className="text-xs text-warm-white text-left flex-1 font-medium">{option.text}</span>
                      {isCorrectOption && <Check size={16} className="text-emerald shrink-0" />}
                      {isWrongOption && <XIcon size={16} className="text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submit or Next Button */}
              {!hasSubmitted ? (
                <button
                  id="training-submit"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className={`w-full mt-6 py-2.5 rounded-lg font-body font-black text-xs uppercase tracking-wider transition-apple-fast ${
                    selectedAnswer
                      ? 'bg-gold text-near-black hover:bg-[#d4b76e]'
                      : 'bg-gold/40 text-near-black/60 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <>
                  {/* Feedback Panel */}
                  <div
                    className={`mt-6 rounded-xl p-5 border ${
                      isCorrect
                        ? 'bg-emerald/[0.08] border-emerald'
                        : 'bg-red-400/[0.06] border-red-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald' : 'bg-red-400'}`}>
                        {isCorrect ? <Check size={18} className="text-near-black" /> : <XIcon size={18} className="text-near-black" />}
                      </div>
                      <h4 className={`font-display font-bold ${isCorrect ? 'text-emerald' : 'text-red-400'}`}>
                        {isCorrect ? 'Correct! Well done.' : "Not quite. Let's learn."}
                      </h4>
                    </div>
                    <p className="mt-3 text-sm text-mid-gray leading-relaxed">
                      {question.explanation}
                    </p>
                    {isCorrect && (
                      <div className="mt-3 inline-flex items-center px-3 py-1 bg-gold/15 border border-gold/30 rounded-full">
                        <span className="font-mono text-sm font-bold text-gold">+{animatingXP || question.xpReward} XP</span>
                      </div>
                    )}
                    {!isCorrect && (
                      <p className="mt-3 text-sm text-mid-gray italic">You'll get it next time!</p>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    className="w-full mt-6 py-3.5 bg-gold text-near-black rounded-lg font-body font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#d4b76e] hover:-translate-y-0.5 hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {currentQ < questions.length - 1 ? 'Next Question' : 'Complete Training'}
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <MentorChatPanel 
        conceptId={regionId} 
        lessonId={question?.id || 'challenge'} 
        getCodeSnapshot={() => question?.code || ''} 
      />

      {/* Level Up Victory Modal */}
      {showLevelUpSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-near-black/80 backdrop-blur-sm" />
          <div className="relative bg-[#121212] border-2 border-gold/30 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/40 animate-bounce">
              <span className="text-3xl text-gold">🏆</span>
            </div>
            <h3 className="text-2xl font-display font-black text-gold">Region Cleared!</h3>
            <p className="text-mid-gray text-sm">
              Incredible skill, Code-Master! You scored 100% on the Placement Challenge for <strong className="text-white">{region?.name}</strong>. You have proven that you are not a beginner!
            </p>
            <div className="bg-gold/5 border border-gold/15 p-4 rounded-xl">
              <span className="text-xs uppercase text-gold font-mono tracking-widest font-bold">Reward</span>
              <div className="text-xl font-mono font-black text-gold mt-1">+100 XP Challenge Bonus</div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  if (regionId) {
                    skipRegion(regionId);
                    addXP(100);
                  }
                  setShowLevelUpSuccess(false);
                  navigate(sourceRoute);
                }}
                className="w-full px-4 py-3 rounded-lg bg-gold text-near-black font-black uppercase text-xs tracking-wider hover:bg-[#d4b76e] transition-colors shadow-lg shadow-gold/20"
              >
                Skip Lessons & Unlock Next Region
              </button>
              <button
                onClick={() => {
                  setShowLevelUpSuccess(false);
                  navigate(sourceRoute);
                }}
                className="w-full px-4 py-3 rounded-lg border border-warm-white/10 text-warm-white hover:bg-warm-white/5 transition-colors font-medium text-xs uppercase tracking-wider"
              >
                Stay in current region
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Failure Modal */}
      {showLevelUpFail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-near-black/80 backdrop-blur-sm" />
          <div className="relative bg-[#121212] border-2 border-red-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <span className="text-3xl text-red-400">🛡️</span>
            </div>
            <h3 className="text-2xl font-display font-black text-red-400">Test Incomplete</h3>
            <p className="text-mid-gray text-sm">
              You got <strong className="text-white">{incorrectAnswers}</strong> question(s) wrong during the challenge. To bypass this region and unlock the next level, you must achieve a perfect score.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowLevelUpFail(false);
                  navigate(sourceRoute);
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-warm-white/10 text-warm-white hover:bg-warm-white/5 transition-colors font-semibold text-xs uppercase tracking-wider"
              >
                {mapLabel}
              </button>
              <button
                onClick={handleRetryChallenge}
                className="flex-1 px-4 py-3 rounded-lg bg-gold text-near-black font-black hover:bg-[#d4b76e] transition-colors font-semibold text-xs uppercase tracking-wider"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
