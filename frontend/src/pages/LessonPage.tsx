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
import { regions } from '@/data/regions';
import { lessons } from '@/data/lessons';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import { MentorChatPanel } from '@/components/mentor/MentorChatPanel';
import { usePlayer } from '@/context/PlayerContext';
import { useRevisionStore } from '@/store/revisionStore';
import { LessonCompletionModal } from '@/components/progression/LessonCompletionModal';
import { useRegionStore } from '@/store/regionStore';
import { ExitSurveyModal } from '@/components/ui/ExitSurveyModal';

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

  const handleExitAttempt = (targetUrl: string) => {
    // If it is the first lesson and not completed yet
    if (lessonId === 'v1' || lessonId === 'variables-basics' || lessonId === 'v-basic-syntax') {
      if (!hasCompleted) {
        setPendingNavigation(targetUrl);
        setShowExitSurvey(true);
        return;
      }
    }
    navigate(targetUrl);
  };
  const { submitReview } = useRevisionStore();
  
  const region = regions.find((r) => r.id === regionId);
  const lesson = region?.lessons.find((item) => item.id === lessonId) || region?.lessons[0];
  const regionProgress = useRegionStore((s) => regionId ? s.regions[regionId] : undefined);
  
  // Dynamic lesson content based on lessonId, falling back to a placeholder if missing
  const content = (lessonId && lessons[lessonId]) ? lessons[lessonId] : lessons['default'];
  
  const startTimeRef = useRef<number>(Date.now());
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackHelpful, setFeedbackHelpful] = useState<boolean | null>(null);

  useEffect(() => {
    if (regionId && lessonId) {
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
  // Fix double-escaped newlines that may come from JSON serialization
  const codeLines = useMemo(() => {
    if (!content?.code) return [];
    return content.code.replace(/\\n/g, '\n').split('\n');
  }, [content?.code]);

  if (!region || !lesson) {
    return (
      <main className="min-h-screen bg-near-black pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-mid-gray">Lesson not found.</p>
          <Link to="/map" className="mt-4 inline-flex text-gold hover:underline">Back to map</Link>
        </div>
      </main>
    );
  }

  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < content.debuggerSteps.length - 1;

  const handleCompleteLesson = async () => {
    if (!regionId || !lesson?.id || isCompleting) return;

    setIsCompleting(true);
    setCompletionError(null);
    try {
      completeLesson(regionId, lesson.id);
      addXP(lesson.xpReward);
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
      setShowCompletionModal(true);
    } catch {
      setCompletionError('Progress was saved locally, but revision sync failed. You can keep learning.');
      setShowCompletionModal(true);
    } finally {
      setIsCompleting(false);
    }
  };

  const currentLessonIndex = region ? region.lessons.findIndex((l) => l.id === lesson?.id) : -1;
  const nextLesson = region && currentLessonIndex !== -1 ? region.lessons[currentLessonIndex + 1] : undefined;
  const nextLessonTitle = nextLesson ? nextLesson.title : null;

  const handleNextLesson = () => {
    setShowCompletionModal(false);
    if (nextLesson) {
      navigate(`/lesson/${regionId}/${nextLesson.id}`);
      setStepIndex(0);
    } else {
      navigate(`/region/${regionId}/boss`);
    }
  };

  const handleReturnToMap = () => {
    setShowCompletionModal(false);
    navigate('/map');
  };

  const handleFeedback = async (helpful: boolean) => {
    if (!regionId || !lessonId) return;
    try {
      await analyticsApi.submitFeedback({
        region_id: regionId,
        lesson_id: lessonId,
        helpful,
      });
      setFeedbackSubmitted(true);
      setFeedbackHelpful(helpful);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-near-black pt-[72px]">
      <div className="border-b border-warm-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button onClick={() => handleExitAttempt('/map')} className="text-mid-gray hover:text-gold transition-colors">World Map</button>
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
                <div className="lg:col-span-7 p-4">
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
                <div className="lg:col-span-5 p-4 bg-warm-white/[0.01] flex flex-col justify-center">
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
                <div className="p-4 flex flex-col bg-[#080809]">
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
                <div className="p-4 flex flex-col bg-near-black">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-gold mb-3">
                    <Terminal size={12} />
                    Output Console
                  </div>
                  <pre className="flex-1 min-h-[96px] whitespace-pre-wrap rounded-lg bg-black/50 border border-warm-white/[0.04] p-3 font-mono text-xs text-emerald-400">
                    {currentStep.output || 'No output console feedback'}
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
                    onClick={() => setStepIndex((prev) => Math.min(prev + 1, content.debuggerSteps.length - 1))}
                    disabled={!canGoNext}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-near-black disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#d4b76e] transition-apple-fast"
                  >
                    Run Line
                    <ArrowRight size={12} />
                  </button>
                  {!canGoNext && (
                    <button
                      onClick={handleCompleteLesson}
                      disabled={isCompleting}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald disabled:cursor-not-allowed disabled:opacity-40 hover:bg-emerald/20 transition-apple-fast"
                    >
                      {isCompleting ? 'Saving...' : `Complete +${lesson.xpReward} XP`}
                    </button>
                  )}
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
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-near-black hover:bg-[#d4b76e] transition-colors"
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
    </main>
  );
}
