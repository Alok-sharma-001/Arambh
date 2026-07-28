import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, CheckCircle2, ArrowRight, Compass, Award } from 'lucide-react';
import { progressionApi } from '../services/progressionApi';

interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correct: number;
  topic: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    topic: 'Variables',
    question: 'What will be the output of this Python code?',
    code: 'x = 5\ny = x\nx = 10\nprint(y)',
    options: ['5', '10', 'None', 'Error'],
    correct: 0
  },
  {
    id: 2,
    topic: 'Data Types',
    question: 'Which of the following is an immutable data type in Python?',
    options: ['List', 'Dictionary', 'Tuple', 'Set'],
    correct: 2
  },
  {
    id: 3,
    topic: 'Loops',
    question: 'How many times will "Arambh" be printed?',
    code: 'for i in range(1, 5):\n    print("Arambh")',
    options: ['5', '4', '1', 'Infinite'],
    correct: 1
  },
  {
    id: 4,
    topic: 'Functions',
    question: 'What is returned by default if a Python function has no return statement?',
    options: ['0', 'False', 'None', 'Empty String ""'],
    correct: 2
  },
  {
    id: 5,
    topic: 'Collections',
    question: 'How do you safely retrieve a key from a dictionary without raising a KeyError?',
    options: ['dict.fetch("key")', 'dict.get("key")', 'dict.find("key")', 'dict["key"]'],
    correct: 1
  },
  {
    id: 6,
    topic: 'OOP',
    question: 'What is the purpose of self as the first parameter in a class method?',
    options: ['Refers to the current class definition', 'Refers to the specific instance of the object', 'Global variable accessor', 'Optional parameter'],
    correct: 1
  },
  {
    id: 7,
    topic: 'Exceptions',
    question: 'Which block in Python always executes regardless of whether an exception occurs?',
    options: ['try', 'except', 'finally', 'else'],
    correct: 2
  },
  {
    id: 8,
    topic: 'Files',
    question: 'What is the advantage of using with open(...) as f: over f = open(...)?',
    options: ['Runs code faster', 'Automatically closes the file when done', 'Encrypts file contents', 'Allows writing to read-only files'],
    correct: 1
  },
  {
    id: 9,
    topic: 'Algorithms',
    question: 'What is the time complexity of looking up a value by key in a Python dictionary?',
    options: ['O(1) average', 'O(N)', 'O(N log N)', 'O(N²)'],
    correct: 0
  },
  {
    id: 10,
    topic: 'Recursion',
    question: 'What causes a recursion function to stop calling itself?',
    options: ['Break statement', 'Base case condition', 'StackOverflow exception', 'Global flag'],
    correct: 1
  }
];

export default function PlacementTest() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{ score: number; unlocked: string[]; bonus_xp: number } | null>(null);

  const q = QUESTIONS[currentIdx];

  const handleOptionSelect = (optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let calculatedScore = 0;
    QUESTIONS.forEach((quest, idx) => {
      if (selectedAnswers[idx] === quest.correct) {
        calculatedScore += 1;
      }
    });

    try {
      await progressionApi.submitPlacementTest(calculatedScore);

      let unlocked: string[] = [];
      let bonus_xp = 100;
      if (calculatedScore >= 8) {
        unlocked = ['Variables Forest', 'Data Types Valley', 'Loops Desert', 'Functions Mountain', 'Collections Kingdom', 'OOP Citadel'];
        bonus_xp = 1200;
      } else if (calculatedScore >= 5) {
        unlocked = ['Variables Forest', 'Data Types Valley', 'Loops Desert'];
        bonus_xp = 500;
      } else {
        unlocked = ['Variables Forest'];
        bonus_xp = 100;
      }

      setResult({ score: calculatedScore, unlocked, bonus_xp });
    } catch (err) {
      console.error('Failed placement test submission:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#12131a] border border-[#c8a45e]/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto w-20 h-20 rounded-full bg-[#c8a45e]/10 border border-[#c8a45e]/30 flex items-center justify-center">
            <Award className="w-10 h-10 text-[#c8a45e]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#fcfbf7] font-serif">
              Assessment Completed!
            </h1>
            <p className="text-xl font-bold text-[#c8a45e]">
              Score: {result.score} / 10
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
            <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c8a45e]" />
              Unlocked Regions ({result.unlocked.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {result.unlocked.map((r, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-[#c8a45e]/20 border border-[#c8a45e]/40 text-[#c8a45e] text-xs font-semibold">
                  ✓ {r}
                </span>
              ))}
            </div>
            <div className="text-xs text-emerald-400 font-semibold pt-1">
              + {result.bonus_xp} XP Bonus Awarded to your profile!
            </div>
          </div>

          <button
            onClick={() => navigate('/world-map')}
            className="w-full py-3.5 rounded-xl bg-[#c8a45e] hover:bg-[#b8944e] text-[#0a0a0c] font-bold text-sm transition-all shadow-lg shadow-[#c8a45e]/20 flex items-center justify-center gap-2"
          >
            Enter World Map
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 p-6 md:p-12 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Compass className="w-7 h-7 text-[#c8a45e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#fcfbf7] font-serif">
                Python Skill Placement Assessment
              </h1>
              <p className="text-xs text-slate-400">Question {currentIdx + 1} of {QUESTIONS.length}</p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
            {q.topic}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-[#c8a45e] h-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-[#12131a] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-semibold text-slate-200 leading-relaxed">
            {q.question}
          </h2>

          {q.code && (
            <pre className="bg-[#0a0a0c] border border-slate-800 p-4 rounded-xl font-mono text-sm text-[#c8a45e] overflow-x-auto">
              <code>{q.code}</code>
            </pre>
          )}

          {/* Options */}
          <div className="space-y-3 pt-2">
            {q.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleOptionSelect(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#c8a45e]/15 border-[#c8a45e] text-[#fcfbf7]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#c8a45e]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="px-6 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentIdx === QUESTIONS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(selectedAnswers).length < QUESTIONS.length}
              className="px-8 py-2.5 rounded-xl bg-[#c8a45e] hover:bg-[#b8944e] text-[#0a0a0c] font-bold text-sm transition-all shadow-lg shadow-[#c8a45e]/20 disabled:opacity-50"
            >
              {submitting ? 'Calculating Result...' : 'Complete Assessment'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentIdx] === undefined}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700 disabled:opacity-30"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
