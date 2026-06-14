import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  CheckCircle2,
  Clock,
  Code2,
  Database,
  Lightbulb,
  Play,
  RotateCw,
  Search,
  Target,
  Terminal,
  TrendingUp,
  AlertTriangle,
  XCircle,
  ChevronRight,
  BookOpen,
  Zap,
  Hash,
} from 'lucide-react';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import { topics } from '../data/libraryTopics';
import type { LibraryTopic } from '../data/libraryTopics';

/* ──────────────────────────────────────────────
   Table-of-Contents sections
   ────────────────────────────────────────────── */
const TOC_SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'why-exists', label: 'Why This Exists' },
  { id: 'analogy', label: 'Real-World Analogy' },
  { id: 'syntax', label: 'Syntax' },
  { id: 'interactive', label: 'Interactive Engine' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'quiz', label: 'Concept Check' },
];

export default function LibraryPage() {
  const [selectedId, setSelectedId] = useState('variables');
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState('introduction');
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  const filteredTopics = useMemo(() => {
    const n = query.trim().toLowerCase();
    if (!n) return topics;
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(n) ||
        t.category.toLowerCase().includes(n) ||
        t.overview.toLowerCase().includes(n),
    );
  }, [query]);

  const categories = useMemo(() => {
    const g: Record<string, LibraryTopic[]> = {};
    filteredTopics.forEach((t) => {
      if (!g[t.category]) g[t.category] = [];
      g[t.category].push(t);
    });
    return g;
  }, [filteredTopics]);

  const selectedTopic =
    filteredTopics.find((t) => t.id === selectedId) || filteredTopics[0];

  /* Reset interactive state on topic switch */
  useEffect(() => {
    setOutput(null);
    setReadingProgress(0);
  }, [selectedId]);

  /* Scroll-spy for TOC + reading progress */
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      setReadingProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));

      const sections = article.querySelectorAll('[data-section]');
      let current = 'introduction';
      sections.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= 140) current = s.getAttribute('data-section') || current;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [selectedId]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setOutput(selectedTopic.interactiveCode.expectedOutput);
      setIsRunning(false);
    }, 800);
  };

  const handleQuizSubmit = (qid: string) =>
    setQuizSubmitted((p) => ({ ...p, [qid]: true }));
  const handleOptionSelect = (qid: string, idx: number) => {
    if (quizSubmitted[qid]) return;
    setQuizAnswers((p) => ({ ...p, [qid]: idx }));
  };

  const switchTopic = (id: string) => {
    setSelectedId(id);
    setOutput(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ──────────────────────────────────────────────
     RENDER
     ────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-near-black pt-[72px]">
      {/* Reading progress bar */}
      <div className="fixed top-[72px] left-0 right-0 z-30 h-[2px] bg-warm-white/[0.04]">
        <div
          className="h-full bg-gold transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* ─── 3-COLUMN GRID ─── */}
      <div className="mx-auto w-[94%] max-w-[1800px] py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_240px] gap-8 items-start">

          {/* ════════════════════════════════════════
              LEFT SIDEBAR
             ════════════════════════════════════════ */}
          <aside className="hidden lg:block sticky top-[90px] max-h-[calc(100vh-110px)] overflow-y-auto pr-3 custom-scrollbar">
            {/* Search */}
            <div className="relative mb-6">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray" />
              <input
                aria-label="Search concepts"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-10 w-full rounded-lg border border-warm-white/[0.08] bg-deep-charcoal/60 pl-9 pr-3 text-xs text-warm-white outline-none placeholder:text-mid-gray/60 focus:border-gold/40 transition-colors"
              />
            </div>

            {/* Topic tree */}
            {Object.entries(categories).map(([cat, catTopics]) => (
              <div key={cat} className="mb-5">
                <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-mid-gray/70">
                  {cat}
                </h3>
                <div className="space-y-0.5">
                  {catTopics.map((t) => {
                    const Icon = t.icon;
                    const active = selectedTopic?.id === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => switchTopic(t.id)}
                        className={`group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-all text-[13px] ${
                          active
                            ? 'bg-gold/10 text-gold font-semibold'
                            : 'text-warm-white/70 hover:bg-warm-white/[0.04] hover:text-warm-white'
                        }`}
                      >
                        <Icon
                          size={14}
                          className={active ? 'text-gold' : 'text-mid-gray/60 group-hover:text-warm-white/60 transition-colors'}
                        />
                        <span className="truncate">{t.title}</span>
                        {t.completion > 0 && (
                          <span className="ml-auto text-[10px] text-gold/70">{t.completion}%</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* ════════════════════════════════════════
              MAIN ARTICLE
             ════════════════════════════════════════ */}
          <article ref={articleRef} className="min-w-0 pb-24">
            {selectedTopic ? (
              <>
                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-2 text-xs text-mid-gray mb-6">
                  <span>Library</span>
                  <ChevronRight size={12} />
                  <span className="text-gold">{selectedTopic.category}</span>
                  <ChevronRight size={12} />
                  <span className="text-warm-white">{selectedTopic.title}</span>
                </div>

                {/* ── Title block ── */}
                <header data-section="introduction" className="mb-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      selectedTopic.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : selectedTopic.difficulty === 'Intermediate'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      <Target size={11} /> {selectedTopic.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-mid-gray">
                      <Clock size={11} /> {selectedTopic.estimatedTime}
                    </span>
                  </div>
                  <h1 className="font-display text-4xl lg:text-[3.2rem] font-bold text-warm-white leading-[1.15] tracking-tight">
                    {selectedTopic.title}
                  </h1>
                  <p className="mt-5 text-[17px] leading-[1.85] text-warm-white/80 max-w-[72ch]">
                    {selectedTopic.overview}
                  </p>
                  <div className="mt-6 h-px bg-warm-white/[0.06]" />
                </header>

                {/* ── Why This Exists ── */}
                <section data-section="why-exists" className="mb-12">
                  <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-warm-white mb-4">
                    <Brain className="text-gold" size={22} />
                    Why does this exist?
                  </h2>
                  <p className="text-[15px] leading-[1.9] text-warm-white/75 max-w-[72ch]">
                    {selectedTopic.whyExists}
                  </p>
                </section>

                {/* ── Real-World Analogy ── */}
                <section data-section="analogy" className="mb-12">
                  <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-warm-white mb-4">
                    <Lightbulb className="text-gold" size={22} />
                    Real-World Analogy
                  </h2>
                  <div className="relative border-l-[3px] border-gold/40 pl-6 py-1">
                    <p className="text-lg font-semibold text-gold mb-2">
                      {selectedTopic.realLifeAnalogy.title}
                    </p>
                    <p className="text-[15px] leading-[1.9] text-warm-white/75 max-w-[68ch]">
                      {selectedTopic.realLifeAnalogy.description}
                    </p>
                  </div>
                </section>

                {/* ── Syntax ── */}
                <section data-section="syntax" className="mb-12">
                  <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-warm-white mb-4">
                    <Code2 className="text-gold" size={22} />
                    Syntax
                  </h2>
                  <div className="rounded-lg bg-code-editor-bg border border-warm-white/[0.06] p-5">
                    <SyntaxHighlighter code={selectedTopic.syntax} />
                  </div>
                  {selectedTopic.example && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-mid-gray mb-3">Example</p>
                      <div className="rounded-lg bg-code-editor-bg border border-warm-white/[0.06] p-5">
                        <SyntaxHighlighter code={selectedTopic.example} />
                      </div>
                    </div>
                  )}
                </section>

                {/* ── INTERACTIVE EXECUTION ENGINE ── */}
                <section data-section="interactive" className="mb-12">
                  <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-warm-white mb-4">
                    <Zap className="text-gold" size={22} />
                    Interactive Execution Engine
                  </h2>
                  <p className="text-sm text-mid-gray mb-5 max-w-[60ch]">
                    Run the code below to see Python execute step-by-step. The memory model shows every variable's state after execution.
                  </p>

                  {/* Code editor */}
                  <div className="rounded-xl overflow-hidden border border-warm-white/[0.08] bg-code-editor-bg">
                    <div className="flex items-center justify-between border-b border-warm-white/[0.06] bg-deep-charcoal/40 px-5 py-3">
                      <span className="flex items-center gap-2 font-mono text-xs text-mid-gray">
                        <Code2 size={13} /> playground.py
                      </span>
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex items-center gap-2 rounded-md bg-gold px-4 py-1.5 text-xs font-bold text-near-black uppercase tracking-wider hover:bg-[#d4b76e] disabled:opacity-50 transition-colors"
                      >
                        {isRunning ? <RotateCw size={13} className="animate-spin" /> : <Play size={13} />}
                        {isRunning ? 'Running…' : 'Run Code'}
                      </button>
                    </div>
                    <div className="p-5">
                      <SyntaxHighlighter code={selectedTopic.interactiveCode.code} />
                    </div>

                    {/* ── Memory Model (revealed after run) ── */}
                    {output !== null && selectedTopic.memoryModel.length > 0 && (
                      <div className="border-t border-warm-white/[0.06] bg-near-black/60 px-5 py-4">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold mb-3">
                          <Database size={12} /> Memory State After Execution
                        </p>
                        <div className="grid gap-2">
                          {selectedTopic.memoryModel.map((slot, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 rounded-md bg-warm-white/[0.02] border border-warm-white/[0.04] px-4 py-2.5"
                            >
                              <code className="font-mono text-sm font-bold text-warm-white min-w-[100px]">
                                {slot.name}
                              </code>
                              <span className="text-mid-gray/50">=</span>
                              <span
                                className="font-mono text-sm font-semibold px-2.5 py-0.5 rounded"
                                style={{ color: slot.accent, backgroundColor: `${slot.accent}12` }}
                              >
                                {slot.value}
                              </span>
                              <span className="ml-1 rounded border border-warm-white/[0.06] bg-warm-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-mid-gray">
                                {slot.type}
                              </span>
                              <span className="ml-auto text-[11px] text-mid-gray/50 italic hidden sm:inline">
                                {slot.note}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Console Output ── */}
                    {output !== null && (
                      <div className="border-t border-warm-white/[0.06] bg-near-black px-5 py-4">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400 mb-2">
                          <Terminal size={12} /> Console Output
                        </p>
                        <pre className="font-mono text-sm text-warm-white whitespace-pre-wrap leading-relaxed">
                          {output}
                        </pre>
                      </div>
                    )}
                  </div>
                </section>

                {/* ── Best Practices ── */}
                <section data-section="best-practices" className="mb-12">
                  <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-warm-white mb-5">
                    <CheckCircle2 className="text-emerald-400" size={22} />
                    Best Practices
                  </h2>
                  <ul className="space-y-3 max-w-[68ch]">
                    {selectedTopic.bestPractices.map((bp, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-warm-white/80 leading-[1.75]">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
                        {bp}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* ── Common Mistakes ── */}
                <section data-section="mistakes" className="mb-12">
                  <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-warm-white mb-5">
                    <AlertTriangle className="text-amber-400" size={22} />
                    Common Mistakes
                  </h2>
                  <ul className="space-y-3 max-w-[68ch]">
                    {selectedTopic.mistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-warm-white/80 leading-[1.75]">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/60" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* ── Quiz ── */}
                {selectedTopic.quiz.length > 0 && (
                  <section data-section="quiz" className="mb-12">
                    <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-warm-white mb-6">
                      <TrendingUp className="text-gold" size={22} />
                      Concept Check
                    </h2>
                    <div className="space-y-8">
                      {selectedTopic.quiz.map((q) => {
                        const submitted = quizSubmitted[q.id];
                        const selected = quizAnswers[q.id];
                        const correct = selected === q.correctIndex;
                        return (
                          <div key={q.id} className="max-w-[68ch]">
                            <p className="font-medium text-warm-white text-[17px] mb-5 leading-relaxed">
                              {q.question}
                            </p>
                            <div className="space-y-2.5">
                              {q.options.map((opt, i) => {
                                let cls =
                                  'border-warm-white/[0.08] hover:border-gold/30 hover:bg-warm-white/[0.02]';
                                if (selected === i) cls = 'border-gold bg-gold/10';
                                if (submitted) {
                                  if (i === q.correctIndex)
                                    cls = 'border-emerald-500 bg-emerald-500/10';
                                  else if (selected === i && !correct)
                                    cls = 'border-red-500 bg-red-500/10';
                                  else cls = 'border-warm-white/[0.04] opacity-40';
                                }
                                return (
                                  <button
                                    key={i}
                                    onClick={() => handleOptionSelect(q.id, i)}
                                    disabled={submitted}
                                    className={`w-full flex items-center gap-3.5 rounded-lg border p-3.5 text-left transition-all text-sm ${cls}`}
                                  >
                                    <div
                                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
                                        selected === i ? 'border-gold' : 'border-warm-white/20'
                                      }`}
                                    >
                                      {selected === i && (
                                        <div className="h-2 w-2 rounded-full bg-gold" />
                                      )}
                                    </div>
                                    <span className="text-warm-white/90">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                            {!submitted ? (
                              <button
                                onClick={() => handleQuizSubmit(q.id)}
                                disabled={selected === undefined}
                                className="mt-5 rounded-lg bg-gold px-8 py-3 text-sm font-bold text-near-black uppercase tracking-wider hover:bg-[#d4b76e] disabled:opacity-40 transition-colors"
                              >
                                Check Answer
                              </button>
                            ) : (
                              <div
                                className={`mt-5 flex items-start gap-3 rounded-lg border p-4 ${
                                  correct
                                    ? 'bg-emerald-500/10 border-emerald-500/20'
                                    : 'bg-red-500/10 border-red-500/20'
                                }`}
                              >
                                {correct ? (
                                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p className={`font-bold text-sm mb-0.5 ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {correct ? 'Correct!' : 'Not quite.'}
                                  </p>
                                  <p className="text-sm text-warm-white/70 leading-relaxed">
                                    {q.explanation}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ── Master This Concept ── */}
                <div className="mt-8 border-t border-warm-white/[0.06] pt-10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gold mb-3">
                    Ready to practice?
                  </h3>
                  <p className="text-sm text-warm-white/60 mb-5 max-w-[50ch]">
                    Apply what you've learned in an interactive lesson or practice challenge.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to={selectedTopic.learnPath}
                      className="flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-near-black uppercase tracking-wider hover:bg-[#d4b76e] transition-colors"
                    >
                      <BookOpen size={15} /> Start Lesson
                    </Link>
                    <Link
                      to={selectedTopic.trainingPath}
                      className="flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-5 py-3 text-sm font-bold text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Terminal size={15} /> Practice
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <Search size={48} className="text-warm-white/10" />
                <h2 className="mt-6 font-display text-2xl font-bold text-warm-white">
                  No concepts found
                </h2>
                <p className="mt-2 text-sm text-mid-gray">
                  Try adjusting your search.
                </p>
              </div>
            )}
          </article>

          {/* ════════════════════════════════════════
              RIGHT PANEL — Table of Contents
             ════════════════════════════════════════ */}
          <aside className="hidden lg:block sticky top-[90px]">
            {/* On This Page */}
            <div className="mb-8">
              <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-mid-gray/70 mb-3">
                <Hash size={11} /> On this page
              </h4>
              <nav className="space-y-0.5">
                {TOC_SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .querySelector(`[data-section="${s.id}"]`)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`block rounded-md px-3 py-1.5 text-[12px] transition-all ${
                      activeSection === s.id
                        ? 'text-gold font-semibold bg-gold/[0.06]'
                        : 'text-mid-gray/70 hover:text-warm-white'
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Related Topics */}
            {selectedTopic && selectedTopic.relatedConcepts.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-mid-gray/70 mb-3">
                  Related Topics
                </h4>
                <div className="space-y-1">
                  {selectedTopic.relatedConcepts.map((relId) => {
                    const rel = topics.find((t) => t.id === relId);
                    if (!rel) return null;
                    const RelIcon = rel.icon;
                    return (
                      <button
                        key={relId}
                        onClick={() => switchTopic(relId)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[12px] text-warm-white/60 hover:text-gold hover:bg-warm-white/[0.03] transition-all"
                      >
                        <RelIcon size={13} className="text-mid-gray/50" />
                        {rel.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reading Progress */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-mid-gray/70 mb-2">
                Reading Progress
              </h4>
              <div className="h-1.5 w-full rounded-full bg-warm-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-mid-gray/50">
                {Math.round(readingProgress)}% read
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
