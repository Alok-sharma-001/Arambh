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

export default function LessonChallengePage() {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const { player, addXP, incrementStreak, resetStreak } = usePlayer();
  const { burst } = useConfetti();
  const cardRef = useRef<HTMLDivElement>(null);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [animatingXP, setAnimatingXP] = useState(0);

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
  const [trainingMode, setTrainingMode] = useState<'topic' | 'random'>('topic');

  const region = regions.find((r) => r.id === regionId);
  const questions = useMemo(() => {
    if (trainingMode === 'random') {
      return [...sampleQuestions].sort((a, b) => b.id.localeCompare(a.id));
    }

    if (regionId === 'variables-forest') {
      return sampleQuestions.filter((item) => item.id.startsWith('v-basic-'));
    }

    if (regionId === 'loops-desert') {
      return sampleQuestions.filter((item) => ['q2', 'q5'].includes(item.id));
    }

    if (regionId === 'iterator-isles') {
      return sampleQuestions.filter((item) => item.id.startsWith('i-tg-'));
    }

    return sampleQuestions.slice(0, 4);
  }, [regionId, trainingMode]);
  const question = questions[currentQ];

  const changeTrainingMode = (mode: 'topic' | 'random') => {
    setTrainingMode(mode);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    setAnimatingXP(0);
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
      // Challenge complete - go back to map
      navigate('/map');
    }
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
            <Link to="/map" className="text-mid-gray hover:text-gold transition-colors">World Map</Link>
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
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-warm-white/[0.08] bg-deep-charcoal/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-warm-white">Training Ground</h1>
            <p className="mt-1 text-sm text-mid-gray">Choose focused topic practice or a random question mix.</p>
          </div>
          <div className="inline-flex rounded-lg border border-warm-white/[0.08] bg-near-black p-1">
            {[
              { key: 'topic' as const, label: 'Topic Practice' },
              { key: 'random' as const, label: 'Random Mix' },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => changeTrainingMode(mode.key)}
                className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Code Visualizer */}
          <div className="bg-code-editor-bg border border-warm-white/[0.08] rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-warm-white/[0.06]">
              <button className="px-6 py-3 text-xs font-semibold uppercase text-gold border-b-2 border-gold">
                CODE
              </button>
              <button className="px-6 py-3 text-xs font-semibold uppercase text-mid-gray hover:text-warm-white transition-colors">
                VISUALIZATION
              </button>
            </div>

            {/* Code display */}
            <div className="p-6 min-h-[400px]">
              <div className="flex">
                <div className="w-10 pr-4 text-right font-mono text-xs text-warm-white/15 select-none shrink-0">
                  {question.code.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1 overflow-x-auto">
                  <SyntaxHighlighter code={question.code} />
                </div>
              </div>
            </div>

            {/* Hint toggle */}
            <div className="px-6 pb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-gold text-sm hover:underline"
              >
                <Lightbulb size={14} />
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
              {showHint && (
                <div className="mt-3 bg-gold/5 border border-gold/15 rounded-lg px-4 py-3 text-sm text-mid-gray">
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
              background: 'radial-gradient(circle at 70% 50%, rgba(124,92,255,0.04) 0%, transparent 50%)',
            }}
          >
            <div className="bg-deep-charcoal border-2 border-gold/15 rounded-[20px] p-8 lg:p-10">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="inline-block px-4 py-1.5 rounded-full border border-royal-purple/30 bg-royal-purple/15 text-royal-purple text-xs font-semibold uppercase tracking-[0.15em]">
                  TRAINING GROUND
                </span>
                <span className="font-mono text-xs text-mid-gray">
                  Question {currentQ + 1} of {questions.length}
                </span>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-1.5 mt-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= difficultyDots
                        ? question.difficulty === 'easy' ? 'bg-emerald' : question.difficulty === 'medium' ? 'bg-gold' : 'bg-red-400'
                        : 'border border-warm-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Streak & Combo Flame */}
              {player.streak > 0 && (
                <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/35">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" />
                    <div>
                      <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Streak active</div>
                      <div className="text-sm font-extrabold text-white">{player.streak} Correct Answers</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded bg-orange-500 text-black">
                    {player.streak >= 5 ? 'COMBO x3 (+15 XP)' : player.streak >= 3 ? 'COMBO x2 (+10 XP)' : 'COMBO x1 (+5 XP)'}
                  </span>
                </div>
              )}

              {/* Question */}
              <h3 className="mt-6 font-display font-bold text-xl text-warm-white leading-snug">
                {question.question}
              </h3>

              {/* Answer Options */}
              <div className="mt-8 space-y-3">
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
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border ${borderColor} ${bgColor} transition-all duration-200 hover:border-gold/30 hover:bg-gold/[0.03] disabled:cursor-default`}
                    >
                      <span className={`w-8 h-8 rounded-full ${labelBg} ${labelText} font-mono text-sm font-bold flex items-center justify-center shrink-0`}>
                        {option.letter}
                      </span>
                      <span className="text-sm text-warm-white text-left flex-1">{option.text}</span>
                      {isCorrectOption && <Check size={18} className="text-emerald shrink-0" />}
                      {isWrongOption && <XIcon size={18} className="text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submit or Next Button */}
              {!hasSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className={`w-full mt-8 py-3.5 rounded-lg font-body font-semibold text-sm uppercase tracking-[0.1em] transition-all duration-300 ${
                    selectedAnswer
                      ? 'bg-gold text-near-black hover:bg-[#d4b76e] hover:-translate-y-0.5 hover:shadow-gold-glow'
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
    </main>
  );
}
