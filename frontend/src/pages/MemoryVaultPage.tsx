import React, { useEffect, useState, useMemo } from 'react';
import { useRevisionStore } from '../store/revisionStore';
import { topics } from '../data/libraryTopics';
import type { QuizQuestion } from '../data/libraryTopics';
import { Brain, CheckCircle2, XCircle, RefreshCw, BookOpen, Search, Copy, Check, Sparkles, Zap, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../services/analyticsApi';

const pythonCheatSheets = [
  {
    category: 'Variables & Data Types',
    title: 'Variables, Strings & Numbers',
    snippet: `# Variable Assignment\nplayer_name = "Arambh Mage"\nplayer_level = 1\nis_active = True\n\n# String Formatting\nprint(f"Welcome, {player_name}! Level: {player_level}")`,
    notes: 'Variables store data in RAM. f-strings allow embedding expressions inside strings.'
  },
  {
    category: 'Data Structures',
    title: 'Lists, Dictionaries & Sets',
    snippet: `# Lists (Ordered, Mutable)\ninventory = ["Forest Ring", "Dune Scroll"]\ninventory.append("Crystal Lens")\n\n# Dictionaries (Key-Value Pairs)\nstats = {"hp": 100, "mana": 50, "xp": 250}\n\n# Sets (Unique Elements Only)\nunlocked_skills = {"fireball", "heal", "fireball"}\n# {"fireball", "heal"}`,
    notes: 'Use lists for sequences, dicts for key lookups, and sets for unique collections.'
  },
  {
    category: 'Control Flow',
    title: 'Conditionals & Loops',
    snippet: `# If-Else Logic\nif stats["hp"] > 0:\n    print("Player is alive!")\nelse:\n    print("Player collapsed!")\n\n# For Loop with Enumerate\nfor index, item in enumerate(inventory):\n    print(f"Item #{index + 1}: {item}")`,
    notes: 'Loops repeat code efficiently; enumerate gives both index and value.'
  },
  {
    category: 'Functions & Scope',
    title: 'Functions & Return Values',
    snippet: `# Defining Functions\ndef calculate_damage(attack: int, defense: int = 5) -> int:\n    """Calculates net damage dealt."""\n    return max(1, attack - defense)\n\nnet_dmg = calculate_damage(25, 10)\nprint(f"Net Damage: {net_dmg}")`,
    notes: 'Functions encapsulate reusable logic. Default arguments specify fallbacks.'
  },
  {
    category: 'Object-Oriented Programming',
    title: 'Classes & Objects',
    snippet: `class Hero:\n    def __init__(self, name: str, role: str):\n        self.name = name\n        self.role = role\n        self.xp = 0\n\n    def gain_xp(self, amount: int):\n        self.xp += amount\n\nhero = Hero("Alok", "Pyromancer")\nhero.gain_xp(100)`,
    notes: 'Classes serve as blueprints for instantiating objects with state and behavior.'
  },
  {
    category: 'Advanced Python',
    title: 'Generators & Yield',
    snippet: `# Memory-Efficient Generator\ndef xp_stream(limit: int):\n    for i in range(1, limit + 1):\n        yield i * 50\n\nfor xp in xp_stream(3):\n    print(f"Claimed +{xp} XP")`,
    notes: 'Generators use yield to stream items lazily without loading everything into memory.'
  }
];

export default function MemoryVaultPage() {
  const { dueConcepts, isLoading, fetchDueRevisions, submitReview } = useRevisionStore();
  const [activeTab, setActiveTab] = useState<'revision' | 'cheatsheet' | 'topics'>('revision');
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualTopicId, setManualTopicId] = useState<string | null>(null);

  useEffect(() => {
    fetchDueRevisions();
    analyticsApi.logEvent('memory_vault_view');
  }, [fetchDueRevisions]);

  const activeConceptId = manualTopicId || dueConcepts[currentConceptIndex] || topics[0]?.id;
  const activeTopic = topics.find(t => t.id === activeConceptId) || topics[0];

  useEffect(() => {
    if (activeTopic && activeTopic.quiz && activeTopic.quiz.length > 0) {
      const randomQuiz = activeTopic.quiz[Math.floor(Math.random() * activeTopic.quiz.length)];
      setCurrentQuiz(randomQuiz);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setCurrentQuiz(null);
    }
  }, [activeTopic]);

  const handleReview = async (quality: number) => {
    if (!activeConceptId || submitting) return;
    setSubmitting(true);
    try {
      if (dueConcepts.includes(activeConceptId)) {
        await submitReview(activeConceptId, quality);
      }
      if (manualTopicId) {
        setManualTopicId(null);
      } else {
        setCurrentConceptIndex(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = (snippet: string, idx: number) => {
    navigator.clipboard.writeText(snippet);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredCheatSheets = useMemo(() => {
    if (!searchQuery.trim()) return pythonCheatSheets;
    const q = searchQuery.toLowerCase();
    return pythonCheatSheets.filter(
      cs => cs.title.toLowerCase().includes(q) || cs.category.toLowerCase().includes(q) || cs.snippet.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-near-black pt-[72px] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-near-black pt-[72px] pb-24 px-4 sm:px-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="py-8 border-b border-warm-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold mb-3">
            <Brain size={13} /> Neural Memory Vault
          </span>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-warm-white">
            Memory Vault & Knowledge Library
          </h1>
          <p className="text-mid-gray text-sm mt-2 max-w-xl leading-relaxed">
            Strengthen your memory with spaced repetition, search Python syntax cheat sheets, and practice any topic on demand.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('revision')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'revision'
                ? 'bg-gold text-near-black shadow-gold-glow'
                : 'bg-warm-white/[0.04] text-mid-gray hover:text-warm-white'
            }`}
          >
            <Zap size={14} /> Spaced Review ({dueConcepts.length})
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'cheatsheet'
                ? 'bg-gold text-near-black shadow-gold-glow'
                : 'bg-warm-white/[0.04] text-mid-gray hover:text-warm-white'
            }`}
          >
            <BookOpen size={14} /> Cheat Sheet
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'topics'
                ? 'bg-gold text-near-black shadow-gold-glow'
                : 'bg-warm-white/[0.04] text-mid-gray hover:text-warm-white'
            }`}
          >
            <Layers size={14} /> Topic Library
          </button>
        </div>
      </div>

      {/* ── TAB 1: SPACED REPETITION REVISION ── */}
      {activeTab === 'revision' && (
        <div className="mt-8">
          {dueConcepts.length === 0 && !manualTopicId ? (
            <div className="rounded-2xl border border-gold/20 bg-deep-charcoal/60 p-10 text-center max-w-2xl mx-auto shadow-2xl">
              <Brain className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-90 animate-pulse" />
              <h2 className="text-2xl font-display font-bold text-warm-white mb-2">Memory Vault Clear!</h2>
              <p className="text-mid-gray text-sm mb-6 leading-relaxed">
                You have reviewed all your due memory flashcards! Want to keep practicing? Choose any Python topic below to test your recall on demand.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('topics')}
                  className="px-6 py-2.5 bg-gold text-near-black font-bold uppercase tracking-wider rounded-lg text-xs hover:bg-[#d4b76e] transition-colors flex items-center gap-2"
                >
                  Browse Topics Library <ArrowRight size={14} />
                </button>
                <Link
                  to="/world-map"
                  className="px-6 py-2.5 bg-warm-white/[0.06] border border-warm-white/10 text-warm-white font-bold uppercase tracking-wider rounded-lg text-xs hover:bg-warm-white/10 transition-colors"
                >
                  Return to Map
                </Link>
              </div>
            </div>
          ) : activeTopic && currentQuiz ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-mono text-gold font-bold uppercase tracking-widest">
                    {manualTopicId ? 'Manual Topic Practice' : `${dueConcepts.length} Reviews Due`}
                  </span>
                  <h2 className="text-xl font-bold text-warm-white mt-1">{activeTopic.title}</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold">
                  {activeTopic.category}
                </span>
              </div>

              <div className="bg-deep-charcoal border border-warm-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-amber-500" />
                
                <p className="text-lg text-warm-white leading-relaxed mb-8 text-center max-w-2xl mx-auto">
                  {currentQuiz.question}
                </p>

                <div className="space-y-3 mb-8 max-w-xl mx-auto">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuiz.correctIndex;
                    let btnClass = "border-warm-white/10 hover:border-gold/50 hover:bg-warm-white/5";
                    
                    if (showAnswer) {
                      if (isCorrect) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                      else if (isSelected) btnClass = "border-red-500 bg-red-500/10 text-red-400";
                      else btnClass = "border-warm-white/5 opacity-50";
                    } else if (isSelected) {
                      btnClass = "border-gold bg-gold/10 text-gold";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !showAnswer && setSelectedOption(idx)}
                        disabled={showAnswer}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${showAnswer && isCorrect ? 'border-emerald-500' : 'border-warm-white/30'}`}>
                            {showAnswer && isCorrect && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                            {!showAnswer && isSelected && <div className="w-3 h-3 bg-gold rounded-full" />}
                          </div>
                          <span className="font-medium text-sm">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!showAnswer ? (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowAnswer(true)}
                      disabled={selectedOption === null}
                      className="px-8 py-3 bg-gold text-near-black font-bold uppercase tracking-wider rounded-lg disabled:opacity-50 hover:bg-[#d4b76e] transition-colors"
                    >
                      Check Answer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-xl border ${selectedOption === currentQuiz.correctIndex ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      <div className="flex items-start gap-3">
                        {selectedOption === currentQuiz.correctIndex ? <CheckCircle2 className="shrink-0" /> : <XCircle className="shrink-0" />}
                        <div>
                          <h4 className="font-bold text-sm mb-1">{selectedOption === currentQuiz.correctIndex ? 'Correct!' : 'Incorrect'}</h4>
                          <p className="text-xs text-warm-white/80 leading-relaxed">{currentQuiz.explanation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-warm-white/10 pt-6">
                      <p className="text-center text-xs text-mid-gray mb-4 uppercase tracking-widest font-bold">How easy was this recall?</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                        <button onClick={() => handleReview(0)} disabled={submitting} className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors flex flex-col items-center">
                          <span>Forgot</span>
                          <span className="text-[9px] font-normal opacity-70 mt-1">Review soon</span>
                        </button>
                        <button onClick={() => handleReview(3)} disabled={submitting} className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors flex flex-col items-center">
                          <span>Hard</span>
                          <span className="text-[9px] font-normal opacity-70 mt-1">Took effort</span>
                        </button>
                        <button onClick={() => handleReview(4)} disabled={submitting} className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors flex flex-col items-center">
                          <span>Good</span>
                          <span className="text-[9px] font-normal opacity-70 mt-1">Solid recall</span>
                        </button>
                        <button onClick={() => handleReview(5)} disabled={submitting} className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors flex flex-col items-center">
                          <span>Easy</span>
                          <span className="text-[9px] font-normal opacity-70 mt-1">Mastered</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ── TAB 2: PYTHON CHEAT SHEET & FORMULAS ── */}
      {activeTab === 'cheatsheet' && (
        <div className="mt-8 space-y-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Python formulas & syntax..."
              className="h-10 w-full rounded-lg border border-warm-white/10 bg-deep-charcoal pl-10 pr-4 text-xs text-warm-white outline-none placeholder:text-mid-gray/50 focus:border-gold/40 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCheatSheets.map((cs, idx) => (
              <div key={idx} className="rounded-xl border border-warm-white/[0.08] bg-deep-charcoal/60 p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded">
                    {cs.category}
                  </span>
                  <button
                    onClick={() => copyCode(cs.snippet, idx)}
                    className="flex items-center gap-1 text-[11px] text-mid-gray hover:text-gold transition-colors font-mono"
                  >
                    {copiedIndex === idx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedIndex === idx ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <h3 className="font-display font-bold text-base text-warm-white">{cs.title}</h3>

                <pre className="p-3.5 rounded-lg bg-black/60 border border-warm-white/[0.06] font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
                  {cs.snippet}
                </pre>

                <p className="text-xs text-mid-gray/80 leading-relaxed font-medium">
                  {cs.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: TOPIC LIBRARY & ON-DEMAND PRACTICE ── */}
      {activeTab === 'topics' && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-warm-white mb-4">Python Topics Library</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t) => (
              <div key={t.id} className="rounded-xl border border-warm-white/[0.08] bg-deep-charcoal/60 p-5 flex flex-col justify-between space-y-4 hover:border-gold/30 transition-all">
                <div>
                  <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">{t.category}</span>
                  <h3 className="font-display font-bold text-base text-warm-white mt-1">{t.title}</h3>
                  <p className="text-xs text-mid-gray mt-2 leading-relaxed line-clamp-2">{t.overview}</p>

                </div>

                <button
                  onClick={() => {
                    setManualTopicId(t.id);
                    setActiveTab('revision');
                  }}
                  className="w-full py-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  Practice Topic <Zap size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
