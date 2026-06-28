import React, { useEffect, useState } from 'react';
import { useRevisionStore } from '../store/revisionStore';
import { topics } from '../data/libraryTopics';
import type { LibraryTopic, QuizQuestion } from '../data/libraryTopics';
import { Brain, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../services/analyticsApi';

export default function MemoryVaultPage() {
  const { dueConcepts, isLoading, fetchDueRevisions, submitReview } = useRevisionStore();
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDueRevisions();
    
    analyticsApi.logEvent('memory_vault_view');
    const startTime = Date.now();

    const handleUnload = () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        const payload = JSON.stringify({
          event_type: 'memory_vault_duration',
          details: { duration_seconds: durationSeconds }
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
  }, [fetchDueRevisions]);

  const activeConceptId = dueConcepts[currentConceptIndex];
  const activeTopic = topics.find(t => t.id === activeConceptId);

  useEffect(() => {
    if (activeTopic && activeTopic.quiz && activeTopic.quiz.length > 0) {
      // Pick a random quiz from the topic
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
      await submitReview(activeConceptId, quality);
      // Move to next (since one is removed from dueConcepts, the index stays same)
      setCurrentConceptIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-near-black pt-[72px] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (dueConcepts.length === 0) {
    return (
      <div className="min-h-screen bg-near-black pt-[72px] flex flex-col items-center justify-center p-6 text-center">
        <Brain className="w-16 h-16 text-emerald-400 mb-6 opacity-80" />
        <h1 className="text-3xl font-display font-bold text-warm-white mb-4">Memory Vault Clear</h1>
        <p className="text-mid-gray max-w-md mb-8">
          You have reviewed all your past knowledge. Return tomorrow to strengthen your neural pathways further.
        </p>
        <Link to="/map" className="px-6 py-3 bg-gold text-near-black font-bold uppercase tracking-wider rounded-lg hover:bg-[#d4b76e] transition-colors">
          Return to Map
        </Link>
      </div>
    );
  }

  if (!activeTopic || !currentQuiz) {
    // If somehow a concept has no quizzes
    return (
      <div className="min-h-screen bg-near-black pt-[72px] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-display text-warm-white mb-4">Preparing next memory...</h1>
        <button onClick={() => handleReview(5)} className="px-4 py-2 bg-slate-800 text-white rounded">
          Skip
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-near-black pt-[72px] pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-warm-white flex items-center gap-3">
              <Brain className="text-gold" /> The Memory Vault
            </h1>
            <p className="text-mid-gray mt-2 text-sm uppercase tracking-widest">
              {dueConcepts.length} Concepts Due for Review
            </p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-bold tracking-wider">
            {activeTopic.category}
          </div>
        </div>

        <div className="bg-deep-charcoal border border-warm-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-purple-600" />
          
          <h2 className="text-xl font-bold text-gold mb-6 text-center">{activeTopic.title}</h2>
          
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
                    <span className="font-medium">{opt}</span>
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
                Reveal Answer
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`p-4 rounded-xl border ${selectedOption === currentQuiz.correctIndex ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                <div className="flex items-start gap-3">
                  {selectedOption === currentQuiz.correctIndex ? <CheckCircle2 className="shrink-0" /> : <XCircle className="shrink-0" />}
                  <div>
                    <h4 className="font-bold mb-1">{selectedOption === currentQuiz.correctIndex ? 'Correct!' : 'Incorrect'}</h4>
                    <p className="text-sm text-warm-white/80 leading-relaxed">{currentQuiz.explanation}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-warm-white/10 pt-6">
                <p className="text-center text-sm text-mid-gray mb-4 uppercase tracking-widest font-bold">How hard was this for you?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                  <button onClick={() => handleReview(0)} disabled={submitting} className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-colors flex flex-col items-center">
                    <span>Blackout</span>
                    <span className="text-[10px] font-normal opacity-70 mt-1">Forgot completely</span>
                  </button>
                  <button onClick={() => handleReview(3)} disabled={submitting} className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold hover:bg-amber-500/20 transition-colors flex flex-col items-center">
                    <span>Hard</span>
                    <span className="text-[10px] font-normal opacity-70 mt-1">Struggled a lot</span>
                  </button>
                  <button onClick={() => handleReview(4)} disabled={submitting} className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold hover:bg-blue-500/20 transition-colors flex flex-col items-center">
                    <span>Good</span>
                    <span className="text-[10px] font-normal opacity-70 mt-1">Recalled with effort</span>
                  </button>
                  <button onClick={() => handleReview(5)} disabled={submitting} className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors flex flex-col items-center">
                    <span>Easy</span>
                    <span className="text-[10px] font-normal opacity-70 mt-1">Instant recall</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
