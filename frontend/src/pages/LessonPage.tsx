import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { analyticsApi } from '@/services/analyticsApi';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  Database,
  Library,
  Play,
  RotateCcw,
  Target,
  Terminal,
} from 'lucide-react';
import { regions, sampleQuestions } from '@/data/regions';
import { lessons } from '@/data/lessons';
import { ALL_LESSONS } from '@/data/allLessons';
import { PracticePanel } from '@/components/lesson/PracticePanel';
import { CodeEvaluator } from '@/engine/CodeEvaluator';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import { MentorChatPanel } from '@/components/mentor/MentorChatPanel';
import { usePlayer } from '@/context/PlayerContext';
import { useRevisionStore } from '@/store/revisionStore';
import { LessonCompletionModal } from '@/components/progression/LessonCompletionModal';
import { useRegionStore } from '@/store/regionStore';
import { ExitSurveyModal } from '@/components/ui/ExitSurveyModal';

// Core Progression
import { ProgressEngine } from '../core/progression/ProgressEngine';
import { ProgressValidator } from '../core/progression/ProgressValidator';
import { ProgressPersistence } from '../core/progression/ProgressPersistence';
import { NavigationService } from '../core/progression/NavigationService';

export default function LessonPage() {
  const { regionId, lessonId } = useParams();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { completeLesson, addXP } = usePlayer();

  const [showExitSurvey, setShowExitSurvey] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Progression locking check: if lesson is locked, bounce user back to world map
  useEffect(() => {
    if (regionId && lessonId && !ProgressValidator.isLessonUnlocked(regionId, lessonId)) {
      console.warn(`LessonPage: Redirecting locked lesson ${lessonId}`);
      navigate('/world-map', { replace: true });
    }
  }, [regionId, lessonId, navigate]);

  // Challenge modal states
  const [showChallenge, setShowChallenge] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeIsCorrect, setChallengeIsCorrect] = useState<boolean | null>(null);
  const [showPractice, setShowPractice] = useState(false);

  // Map lessonId to corresponding challenge question
  const challengeQuestion = useMemo(() => {
    const map: Record<string, string> = {
      'v1': 'v-basic-1', 'v2': 'v-basic-2', 'v3': 'v-basic-3', 'v4': 'q1',
      'd1': 'd-val-1', 'd2': 'q7', 'd3': 'd-val-2', 'd4': 'q6',
      'l1': 'l-des-1', 'l2': 'q2', 'l3': 'q5', 'l4': 'l-des-1',
      'f1': 'f-mou-1', 'f2': 'q3', 'f3': 'f-mou-1', 'f4': 'q3',
      'c1': 'q8', 'c2': 'q7', 'c3': 'q4', 'c4': 'q8',
      'o1': 'o-cit-1', 'o2': 'o-cit-2', 'o3': 'o-cit-1', 'o4': 'o-cit-2',
      'e1': 'e-aby-1', 'e2': 'q6', 'e3': 'e-aby-1', 'e4': 'e-aby-1',
      'fs1': 'fs-rui-1', 'fs2': 'fs-rui-2', 'fs3': 'fs-rui-1', 'fs4': 'fs-rui-2',
      'm1': 'm-har-1', 'm2': 'm-har-2', 'm3': 'm-har-1', 'm4': 'm-har-2',
      'a1': 'a-are-1', 'a2': 'a-are-2', 'a3': 'a-are-1', 'a4': 'a-are-2',
      'i1': 'i-tg-1', 'i2': 'i-tg-2', 'i3': 'i-tg-3', 'i4': 'i-tg-3',
    };
    const qId = map[lessonId || ''];
    return sampleQuestions.find(q => q.id === qId) || sampleQuestions[0];
  }, [lessonId]);

  const sourceRoute = sessionStorage.getItem('arambh_source_route') || (regionId ? `/region/${regionId}` : '/world-map');
  const isRegionMap = sessionStorage.getItem('mapSource') === 'region' || sourceRoute.startsWith('/region/');
  const mapLabel = isRegionMap ? 'Region Map' : 'World Map';

  const getBackUrl = () => {
    if (regionId) {
      return `/region/${regionId}`;
    }
    return '/world-map';
  };

  const handleExitAttempt = (targetUrl: string) => {
    // If it is the first lesson and not completed yet
    if (lessonId === 'v1' || lessonId === 'variables-basics' || lessonId === 'v-basic-syntax') {
      if (!hasCompleted) {
        setPendingNavigation(targetUrl);
        setShowExitSurvey(true);
        return;
      }
    }
    if (targetUrl === '/map' || targetUrl === '/learning-map' || targetUrl.startsWith('/region/')) {
      if (targetUrl.startsWith('/region/')) {
        const matched = targetUrl.match(/\/region\/([^/]+)/);
        if (matched && matched[1]) {
          NavigationService.openRegion(matched[1]);
          return;
        }
      }
      NavigationService.returnToWorldMap();
    } else {
      navigate(targetUrl);
    }
  };
  const { submitReview } = useRevisionStore();
  
  const region = regions.find((r) => r.id === regionId);
  const lesson = region?.lessons.find((item) => item.id === lessonId) || region?.lessons[0];
  const regionProgress = useRegionStore((s) => regionId ? s.regions[regionId] : undefined);
  
  // Dynamic lesson content based on lessonId, falling back to a placeholder if missing
  const rawContent = (lessonId && lessons[lessonId]) ? lessons[lessonId] : lessons['default'];

  // Normalize double-escaped newlines from lesson data ("\\n" → real newlines)
  const normalizedCode = useMemo(() => {
    if (!rawContent?.code) return '';
    return rawContent.code.replace(/\\n/g, '\n');
  }, [rawContent?.code]);

  // Statically check interpreter validation output
  const evaluationResult = useMemo(() => {
    if (!normalizedCode) return null;
    try {
      return CodeEvaluator.evaluate(normalizedCode);
    } catch {
      return null;
    }
  }, [normalizedCode]);

  // Dynamically generate debugger steps if empty or <= 1 steps are defined
  const content = useMemo(() => {
    if (!rawContent) return rawContent;
    if (rawContent.debuggerSteps && rawContent.debuggerSteps.length > 1) {
      return rawContent;
    }

    try {
      const evaluation = CodeEvaluator.evaluate(normalizedCode);
      if (evaluation.steps && evaluation.steps.length > 0) {
        let accumulatedOutput = '';
        const generatedSteps = evaluation.steps.map((step) => {
          if (step.type === 'PRINT' && step.output !== undefined) {
            if (accumulatedOutput) {
              accumulatedOutput += '\n' + step.output;
            } else {
              accumulatedOutput = step.output;
            }
          }

          // Map memory variables
          const memorySlots = Object.values(step.memorySnapshot).map((v) => {
            const mappedType = v.type === 'string' ? 'str' : v.type;
            let accent = '#34d399'; // default green (emerald)
            if (mappedType === 'int' || mappedType === 'float') {
              accent = '#60a5fa'; // blue
            } else if (mappedType === 'bool') {
              accent = '#fbbf24'; // amber
            } else if (mappedType === 'list') {
              accent = '#c8a45e'; // gold/brown
            } else if (mappedType === 'tuple') {
              accent = '#818cf8'; // indigo
            } else if (mappedType === 'set') {
              accent = '#f472b6'; // pink
            } else if (mappedType === 'dict') {
              accent = '#fb7185'; // rose
            } else if (mappedType === 'function') {
              accent = '#a78bfa'; // violet
            }

            let note = 'Still in memory';
            if (step.variable && step.variable.name === v.name) {
              if (step.type === 'ALLOCATE') {
                note = `Created on line ${step.lineNumber}`;
              } else if (step.type === 'UPDATE') {
                note = `Updated on line ${step.lineNumber}`;
              }
            }

            return {
              name: v.name,
              value: v.value,
              type: mappedType,
              note,
              accent,
            };
          });

          // Map action & why
          let action = step.description;
          let why = '';
          if (step.type === 'ALLOCATE') {
            why = `Python stores the value in memory under the variable name '${step.variable?.name}'.`;
          } else if (step.type === 'UPDATE') {
            why = `Python updates the variable '${step.variable?.name}' with the new value.`;
          } else if (step.type === 'PRINT') {
            why = `The print() function outputs the value to the console.`;
          } else if (step.type === 'LOOP_ITERATION') {
            why = `Executing loop iteration index ${step.loopState?.currentIteration}.`;
          } else if (step.type === 'FUNCTION_DEF') {
            why = `Python defines the function '${step.functionCall?.functionName || ''}' but does not run its body yet.`;
          } else if (step.type === 'FUNCTION_CALL') {
            why = `Python calls the function '${step.functionCall?.functionName || ''}' and passes the arguments.`;
          } else if (step.type === 'FUNCTION_RETURN') {
            why = `The function returns '${step.functionCall?.returnValue || ''}' back to the caller.`;
          } else {
            why = `Executing line ${step.lineNumber}.`;
          }

          return {
            line: step.lineNumber,
            action,
            why,
            memory: memorySlots,
            output: accumulatedOutput,
          };
        });

        return {
          ...rawContent,
          debuggerSteps: generatedSteps,
        };
      }
    } catch (err) {
      console.error('Failed to dynamically evaluate code for lesson:', err);
    }

    return rawContent;
  }, [rawContent, normalizedCode]);
  
  const startTimeRef = useRef<number>(Date.now());
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackHelpful, setFeedbackHelpful] = useState<boolean | null>(null);

  useEffect(() => {
    if (regionId && lessonId) {
      setStepIndex(0);
      startTimeRef.current = Date.now();
      setFeedbackSubmitted(false);
      setFeedbackHelpful(null);
      setHasCompleted(false);
      analyticsApi.logEvent('lesson_start', { region_id: regionId, lesson_id: lessonId });

      // Log first_lesson_started telemetry if not already set
      const loggedStarted = localStorage.getItem('arambh_first_lesson_started');
      if (!loggedStarted) {
        analyticsApi.logEvent('first_lesson_started', { region_id: regionId, lesson_id: lessonId });
        localStorage.setItem('arambh_first_lesson_started', 'true');
      }

      const handleUnload = () => {
        const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
          const payload = JSON.stringify({
            event_type: 'lesson_time_spent',
            details: {
              region_id: regionId,
              lesson_id: lessonId,
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
  }, [regionId, lessonId]);
  
  const currentStep = content?.debuggerSteps[stepIndex] || { line: 0, action: 'Loading...', why: '', memory: [] };

  const consoleOutput = useMemo(() => {
    if (evaluationResult && !evaluationResult.isValid) {
      return `Syntax/Execution Error:\n${evaluationResult.error}`;
    }
    return currentStep.output || 'No output console feedback';
  }, [evaluationResult, currentStep.output]);
  // Fix double-escaped newlines that may come from JSON serialization
  const codeLines = useMemo(() => {
    if (!normalizedCode) return [];
    return normalizedCode.split('\n');
  }, [normalizedCode]);

  if (!region || !lesson) {
    const backUrl = getBackUrl();
    const isFallbackRegion = sessionStorage.getItem('mapSource') === 'region' || backUrl.startsWith('/region/');
    const fallbackLabel = isFallbackRegion ? 'Back to Region Map' : 'Back to World Map';
    return (
      <main className="min-h-screen bg-near-black pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-mid-gray">Lesson not found.</p>
          <Link to={backUrl} className="mt-4 inline-flex text-gold hover:underline">{fallbackLabel}</Link>
        </div>
      </main>
    );
  }

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < (content?.debuggerSteps?.length ? content.debuggerSteps.length - 1 : 0);

  const handleRunLine = () => {
    if (!canGoNext) return;
    setStepIndex((prev) => prev + 1);
    ProgressPersistence.save();
  };

  const handleCompleteLesson = async () => {
    if (!regionId || !lesson?.id || isCompleting) return;

    setIsCompleting(true);
    setCompletionError(null);
    try {
      // completeLesson may return false if already completed (idempotent) — that's OK
      await ProgressEngine.completeLesson(regionId, lesson.id, lesson.xpReward);
      setHasCompleted(true);
      
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      analyticsApi.logEvent('lesson_complete', {
        region_id: regionId,
        lesson_id: lesson.id,
        duration_seconds: durationSeconds
      });

      // Log first_lesson_completed telemetry if not already set
      const loggedCompleted = localStorage.getItem('arambh_first_lesson_completed');
      if (!loggedCompleted) {
        analyticsApi.logEvent('first_lesson_completed', { region_id: regionId, lesson_id: lesson.id });
        localStorage.setItem('arambh_first_lesson_completed', 'true');
      }

      await submitReview(regionId, 4);
    } catch (e) {
      console.error('Lesson completion error:', e);
      setCompletionError('Progress was saved locally, but revision sync failed. You can keep learning.');
    } finally {
      setIsCompleting(false);
      // Always show the completion modal so the user can proceed
      setShowCompletionModal(true);
    }
  };

  const handleCompleteAttempt = () => {
    if (stepIndex < content.debuggerSteps.length - 1) {
      setCompletionError('Please step through all lines of code first.');
      return;
    }
    if (evaluationResult && !evaluationResult.isValid) {
      setCompletionError('Cannot complete lesson with compiler/evaluation errors.');
      return;
    }

    if (challengeQuestion) {
      setShowChallenge(true);
    } else {
      handleCompleteLesson();
    }
  };

  const currentLessonIndex = region ? region.lessons.findIndex((l) => l.id === lesson?.id) : -1;
  const nextLesson = region && currentLessonIndex !== -1 ? region.lessons[currentLessonIndex + 1] : undefined;
  const nextLessonTitle = nextLesson ? nextLesson.title : null;

  const handleNextLesson = () => {
    setShowCompletionModal(false);
    if (nextLesson) {
      NavigationService.goToLesson(regionId!, nextLesson.id);
      setStepIndex(0);
    } else {
      NavigationService.goToBoss(regionId!);
    }
  };

  const handleReturnToMap = () => {
    setShowCompletionModal(false);
    const backUrl = getBackUrl();
    if (backUrl.startsWith('/region/')) {
      const matched = backUrl.match(/\/region\/([^/]+)/);
      if (matched && matched[1]) {
        NavigationService.openRegion(matched[1]);
        return;
      }
    }
    NavigationService.returnToWorldMap();
  };

  const handleFeedback = (helpful: boolean) => {
    if (!regionId || !lessonId) return;
    
    // 1. Optimistic UI Updates: Immediate visual feedback
    setFeedbackSubmitted(true);
    setFeedbackHelpful(helpful);
    
    // 2. Background API submission: Dispatched asynchronously without blocking UI flow
    analyticsApi.submitFeedback({
      region_id: regionId,
      lesson_id: lessonId,
      helpful,
    }).catch((error) => {
      // 3. Graceful Error Handling: Silently log error, do not revert or impact user experience
      console.error("Feedback background sync failed:", error);
    });
  };

  return (
    <main className="min-h-screen bg-near-black pt-[72px]">
      <div className="border-b border-warm-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button onClick={() => handleExitAttempt(getBackUrl())} className="text-mid-gray hover:text-gold transition-colors">
              {mapLabel}
            </button>
            <span className="text-mid-gray">/</span>
            <span className="text-mid-gray">{region.name}</span>
            <span className="text-mid-gray">/</span>
            <span className="text-warm-white font-medium">{content.title}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExitAttempt('/library')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-warm-white/[0.08] bg-warm-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-warm-white hover:border-gold/30 hover:text-gold transition-colors"
            >
              <Library size={15} />
              Library
            </button>
            <button
              onClick={() => handleExitAttempt(`/training/${region.id}`)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gold hover:bg-gold/15 transition-colors"
            >
              <Target size={15} />
              Training Ground
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-warm-white/[0.08] bg-warm-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold">
              <BookOpen size={14} />
              Learning Mode
            </span>
            <div>
              <h1 className="font-display text-4xl font-bold leading-tight text-warm-white">
                {content.title}
              </h1>
              <p className="mt-4 text-lg leading-7 text-warm-white">
                {content.hook}
              </p>
              <p className="mt-3 text-sm leading-7 text-mid-gray">
                {content.concept}
              </p>
            </div>

            <div className="rounded-2xl border border-gold/15 bg-deep-charcoal/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gold">
                <Brain size={14} />
                Before Debugging
              </div>
              <div className="mt-4 grid gap-3">
                {content.mentalModel.map((item) => (
                  <p key={item} className="rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.025] px-4 py-3 text-sm leading-6 text-mid-gray">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </aside>

          <div className="grid gap-6">
            <div className="overflow-hidden rounded-2xl border border-warm-white/[0.08] bg-code-editor-bg flex flex-col shadow-2xl">
              {/* HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-warm-white/[0.06] px-5 py-3.5">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-gold">
                  <Play size={14} className="fill-gold/10" />
                  Code Sandbox & Debugger
                </span>
                <span className="font-mono text-xs text-mid-gray">
                  Step {stepIndex + 1} of {content.debuggerSteps.length}
                </span>
              </div>

              {/* TOP SECTION: Code Editor & Explanation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-warm-white/[0.06] divide-y lg:divide-y-0 lg:divide-x divide-warm-white/[0.06]">
                {/* Code Editor (7/12) */}
                <div id="lesson-code-editor" className="lg:col-span-7 p-4">
                  <div className="space-y-1 font-mono text-sm">
                    {codeLines.map((line, index) => {
                      const lineNumber = index + 1;
                      const isActive = lineNumber === currentStep.line;
                      return (
                        <div
                          key={lineNumber}
                          className={`grid grid-cols-[2rem_1fr] rounded-lg px-2 py-1.5 transition-apple-fast ${
                            isActive ? 'bg-gold/10 ring-1 ring-gold/25' : 'bg-transparent'
                          }`}
                        >
                          <span className={`select-none text-right text-xs leading-[1.8] ${isActive ? 'text-gold' : 'text-warm-white/20'}`}>
                            {lineNumber}
                          </span>
                          <span className="min-w-0 overflow-x-auto whitespace-pre pl-4">
                            <SyntaxHighlighter code={line} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation Panel (5/12) */}
                <div id="lesson-execution-panel" className="lg:col-span-5 p-4 bg-warm-white/[0.01] flex flex-col justify-center">
                  <div className="rounded-xl border border-gold/15 bg-gold/[0.02] p-3.5">
                    <span className="font-mono text-[9px] text-gold font-bold uppercase tracking-wider">Line {currentStep.line} execution</span>
                    <h2 className="mt-1 font-display text-base font-extrabold text-white tracking-tight leading-tight">{currentStep.action}</h2>
                    <p className="mt-2 text-xs leading-relaxed text-mid-gray/80 font-medium">{currentStep.why}</p>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: Variables (Live Memory) & Output Console */}
              <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-warm-white/[0.06] divide-y lg:divide-y-0 lg:divide-x divide-warm-white/[0.06]">
                {/* Variables (Live Memory) */}
                <div id="lesson-memory-viewer" className="p-4 flex flex-col bg-[#080809]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-gold">
                      <Database size={12} />
                      Live Memory (Variables)
                    </div>
                    <span className="font-mono text-[10px] text-mid-gray/60 font-bold">
                      {currentStep.memory.length} variables
                    </span>
                  </div>
                  
                  {currentStep.memory.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center min-h-[96px] rounded-lg border border-dashed border-warm-white/[0.04] bg-near-black/20 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      No active variables
                    </div>
                  ) : (
                    <div className="grid gap-2 grid-cols-2">
                      {currentStep.memory.map((slot) => (
                        <div
                          key={slot.name}
                          className="relative overflow-hidden rounded-lg border bg-warm-white/[0.01] p-2.5 flex flex-col justify-between"
                          style={{ borderColor: `${slot.accent}20` }}
                        >
                          <div>
                            <span className="block font-mono text-[9px] text-mid-gray/60">{slot.name}</span>
                            <strong className="mt-0.5 block break-all font-mono text-sm text-warm-white leading-tight">{slot.value}</strong>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="inline-flex rounded px-1 py-0.5 font-mono text-[8px] uppercase tracking-wider font-extrabold" style={{ backgroundColor: `${slot.accent}10`, color: slot.accent }}>
                              {slot.type}
                            </span>
                            <span className="text-[9px] text-mid-gray/50 truncate max-w-[60px]" title={slot.note}>
                              {slot.note}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Output Console */}
                <div id="lesson-output-console" className="p-4 flex flex-col bg-near-black">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-gold mb-3">
                    <Terminal size={12} />
                    Output Console
                  </div>
                  <pre className="flex-1 min-h-[96px] whitespace-pre-wrap rounded-lg bg-black/50 border border-warm-white/[0.04] p-3 font-mono text-xs text-emerald-400">
                    {consoleOutput}
                  </pre>
                </div>
              </div>

              {/* FOOTER ACTIONS BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#050506] px-5 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStepIndex(0)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-warm-white/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-mid-gray hover:text-warm-white transition-apple-fast"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                  <button
                    onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={!canGoBack}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-warm-white/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-warm-white disabled:cursor-not-allowed disabled:opacity-30 transition-apple-fast"
                  >
                    <ArrowLeft size={12} />
                    Back
                  </button>
                  <button
                    id="lesson-run-button"
                    onClick={handleRunLine}
                    disabled={!canGoNext}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#d4b76e] px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-near-black disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90 transition-apple-fast"
                  >
                    Run Line
                    <ArrowRight size={12} />
                  </button>
                  <button
                    onClick={handleCompleteAttempt}
                    disabled={isCompleting || stepIndex < (content?.debuggerSteps?.length ? content.debuggerSteps.length - 1 : 0) || evaluationResult?.isValid === false}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald disabled:cursor-not-allowed disabled:opacity-40 hover:bg-emerald/20 transition-apple-fast"
                  >
                    {isCompleting ? 'Saving...' : `Complete +${lesson.xpReward} XP`}
                  </button>
                  <button
                    onClick={async () => {
                      await handleCompleteLesson();
                      handleNextLesson();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-gold hover:bg-gold/20 transition-apple-fast"
                  >
                    ☀️ Sun Button
                  </button>
                </div>
                {completionError && (
                  <p className="text-xs text-gold font-bold">{completionError}</p>
                )}
              </div>
            </div>
            {/* Feedback Poll */}
            <div className="rounded-2xl border border-warm-white/[0.08] bg-[#10100f] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-warm-white">Was this lesson helpful?</h3>
                  <p className="text-xs text-mid-gray mt-1">Your feedback helps improve our curriculum.</p>
                </div>
                {!feedbackSubmitted ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFeedback(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border border-emerald/30 bg-emerald/10 text-emerald hover:bg-emerald/20 transition-all animate-pulse"
                    >
                      👍 Yes
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 transition-all"
                    >
                      👎 No
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gold font-medium">
                    {feedbackHelpful ? 'Awesome! Glad you found it helpful. ⚔️' : 'Thanks! We will work to improve this lesson. 🛡️'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate(`/training/${region.id}`)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#d4b76e] px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-near-black hover:opacity-90 transition-colors"
              >
                Practice in Training Ground
                <ChevronRight size={16} />
              </button>
              <Link
                to="/library"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-warm-white/[0.08] px-5 py-3.5 text-sm font-semibold text-warm-white hover:border-gold/30 hover:text-gold transition-colors"
              >
                <Library size={16} />
                Open Library
              </Link>
            </div>
          </div>
        </div>
      </section>
      <MentorChatPanel 
        conceptId={regionId} 
        lessonId={lessonId} 
        getCodeSnapshot={() => content?.code || ''} 
      />
      <LessonCompletionModal
        isOpen={showCompletionModal}
        xpReward={lesson?.xpReward || 50}
        regionTitle={region?.name || 'Variables Forest'}
        completedCount={regionProgress?.completedLessons.length || 0}
        totalCount={region?.lessons.length || 4}
        nextLessonTitle={nextLessonTitle}
        onNextLesson={handleNextLesson}
        onReturnToMap={handleReturnToMap}
        onFeedbackSubmit={handleFeedback}
        feedbackSubmitted={feedbackSubmitted}
        feedbackHelpful={feedbackHelpful}
      />

      <ExitSurveyModal
        isOpen={showExitSurvey}
        onClose={() => {
          setShowExitSurvey(false);
          if (pendingNavigation) {
            navigate(pendingNavigation);
          }
        }}
        context="first_lesson"
      />

      {/* Challenge Modal */}
      {showChallenge && challengeQuestion && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowChallenge(false)} />
          <div className="relative bg-[#0D0D12] border-2 border-gold/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-left space-y-5">
            <div className="flex items-center justify-between border-b border-warm-white/[0.06] pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gold">
                🛡️ Lesson Challenge
              </span>
              <button onClick={() => setShowChallenge(false)} className="text-mid-gray hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-black text-lg text-white tracking-tight leading-snug">
                {challengeQuestion.question}
              </h3>
              {challengeQuestion.code && challengeQuestion.code !== '# Choose the correct syntax' && (
                <div className="rounded-xl bg-code-editor-bg border border-warm-white/[0.06] p-4 font-mono text-xs leading-relaxed overflow-x-auto text-emerald-400">
                  <pre>{challengeQuestion.code}</pre>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {challengeQuestion.options.map((option: any) => {
                const isSelected = selectedAnswer === option.letter;
                const isCorrectOption = challengeSubmitted && option.letter === challengeQuestion.correctAnswer;
                const isWrongOption = challengeSubmitted && isSelected && !challengeIsCorrect;

                let borderColor = 'border-warm-white/[0.08]';
                let bgColor = 'bg-transparent';
                let labelBg = 'bg-warm-white/[0.06]';
                let labelText = 'text-warm-white';

                if (isCorrectOption) {
                  borderColor = 'border-emerald-500';
                  bgColor = 'bg-emerald-500/10';
                  labelBg = 'bg-emerald-500';
                  labelText = 'text-near-black';
                } else if (isWrongOption) {
                  borderColor = 'border-red-400';
                  bgColor = 'bg-red-400/10';
                  labelBg = 'bg-red-400';
                  labelText = 'text-near-black';
                } else if (isSelected && !challengeSubmitted) {
                  borderColor = 'border-gold';
                  bgColor = 'bg-gold/10';
                  labelBg = 'bg-gold';
                  labelText = 'text-near-black';
                }

                return (
                  <button
                    key={option.letter}
                    onClick={() => !challengeSubmitted && setSelectedAnswer(option.letter)}
                    disabled={challengeSubmitted}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border ${borderColor} ${bgColor} transition-colors hover:border-gold/25 hover:bg-gold/[0.02] disabled:cursor-default text-left`}
                  >
                    <span className={`w-7 h-7 rounded-full ${labelBg} ${labelText} font-mono text-xs font-bold flex items-center justify-center shrink-0`}>
                      {option.letter}
                    </span>
                    <span className="text-xs text-warm-white flex-1 font-medium">{option.text}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-warm-white/[0.06] flex flex-col gap-3">
              {challengeSubmitted && (
                <div className={`p-4 rounded-xl border text-sm leading-relaxed ${challengeIsCorrect ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-400/10 border-red-400/30 text-red-400'}`}>
                  <strong className="block mb-1">{challengeIsCorrect ? 'Correct! Well done.' : "Not quite. Try again!"}</strong>
                  <p className="text-xs text-mid-gray/80">{challengeQuestion.explanation}</p>
                </div>
              )}

              <div className="flex gap-3">
                {!challengeSubmitted ? (
                  <button
                    onClick={() => {
                      if (!selectedAnswer) return;
                      const correct = selectedAnswer === challengeQuestion.correctAnswer;
                      setChallengeIsCorrect(correct);
                      setChallengeSubmitted(true);
                    }}
                    disabled={!selectedAnswer}
                    className="flex-1 py-3 bg-[#d4b76e] text-near-black font-black uppercase text-xs tracking-wider rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <>
                    {challengeIsCorrect ? (
                      <button
                        onClick={() => {
                          setShowChallenge(false);
                          if (lessonId && (ALL_LESSONS[lessonId] as any)?.practice) {
                            setShowPractice(true);
                          } else {
                            handleCompleteLesson();
                          }
                        }}
                        className="flex-1 py-3 bg-emerald-600 text-white font-black uppercase text-xs tracking-wider rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        {lessonId && (ALL_LESSONS[lessonId] as any)?.practice ? 'Continue to Practice' : 'Complete & Grant XP'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setChallengeSubmitted(false);
                          setSelectedAnswer(null);
                          setChallengeIsCorrect(null);
                        }}
                        className="flex-1 py-3 bg-red-600 text-white font-black uppercase text-xs tracking-wider rounded-lg"
                      >
                        Try Again
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Practice Modal */}
      {showPractice && lessonId && (ALL_LESSONS[lessonId] as any)?.practice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowPractice(false)} />
          <div className="relative w-full max-w-4xl h-[80vh]">
            <PracticePanel
              title={(ALL_LESSONS[lessonId] as any).practice.title}
              description={(ALL_LESSONS[lessonId] as any).practice.description}
              initialCode={(ALL_LESSONS[lessonId] as any).practice.initialCode}
              validation={(ALL_LESSONS[lessonId] as any).practice.validation}
              onSuccess={() => {
                setShowPractice(false);
                handleCompleteLesson();
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
