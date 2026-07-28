import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface PracticePanelProps {
  title: string;
  description: string;
  initialCode: string;
  validation: (code: string) => { isValid: boolean; error?: string };
  onSuccess: () => void;
}

export function PracticePanel({
  title,
  description,
  initialCode,
  validation,
  onSuccess
}: PracticePanelProps) {
  const [code, setCode] = useState(initialCode);
  const [feedback, setFeedback] = useState<{ isValid: boolean; error?: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleRunAndValidate = () => {
    const result = validation(code);
    setFeedback(result);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-300 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#12131a]">
        <div>
          <h2 className="text-xl font-bold text-[#c8a45e] font-serif">{title}</h2>
        </div>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-slate-400 hover:text-[#c8a45e] transition-colors flex items-center gap-2 text-sm"
        >
          <HelpCircle size={16} />
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
      </div>

      {/* Hint / Description */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#12131a] border-b border-white/10"
          >
            <div className="p-4 text-sm text-slate-300 whitespace-pre-wrap">
              {description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="flex-1 min-h-[300px] relative">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => {
            setCode(value || '');
            if (feedback) setFeedback(null); // Clear feedback on edit
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            padding: { top: 16 },
            fontFamily: 'JetBrains Mono, monospace',
            scrollBeyondLastLine: false,
            roundedSelection: false,
            overviewRulerLanes: 0,
            wordWrap: 'on',
            automaticLayout: true
          }}
        />
      </div>

      {/* Footer / Controls */}
      <div className="p-4 border-t border-white/10 bg-[#12131a] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={handleRunAndValidate}
            className="bg-[#c8a45e] hover:bg-[#b08d4a] text-black font-bold flex items-center gap-2"
          >
            <Play size={18} />
            Run & Validate
          </Button>

          <AnimatePresence>
            {feedback?.isValid && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  onClick={onSuccess}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold flex items-center gap-2"
                >
                  Continue
                  <ChevronRight size={18} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded border ${
                feedback.isValid
                  ? 'bg-green-900/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  : 'bg-red-900/20 border-red-500/50 text-red-400'
              }`}
            >
              {feedback.isValid
                ? 'Success! Your code passes the validation.'
                : feedback.error || 'Validation failed. Check your code and try again.'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
