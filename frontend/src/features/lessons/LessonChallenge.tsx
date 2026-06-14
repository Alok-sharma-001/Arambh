import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ChevronRight, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { useOracleStore } from '../../store/oracleStore';
import { MemoryVisualizer } from '../../components/arena/MemoryVisualizer';
import Editor from '@monaco-editor/react';
import { ALL_LESSONS as VARIABLES_FOREST_LESSONS } from '../../data/allLessons';
import { CodeEvaluator } from '../../engine/CodeEvaluator';
import { CodeNormalizer } from '../../engine/CodeNormalizer';

interface LessonChallengeProps {
  lessonId: string;
  onComplete: () => void;
}

export const LessonChallenge: React.FC<LessonChallengeProps> = ({ lessonId, onComplete }) => {
  const data = VARIABLES_FOREST_LESSONS[lessonId];
  const [code, setCode] = useState(data?.challenge.initialCode || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { initialize, play, isPlaying } = useEngineStore();
  const { setCurrentError, addMessage } = useOracleStore();

  useEffect(() => {
    if (data) {
      setCode(data.challenge.initialCode);
      setError(null);
      setSuccess(false);
    }
  }, [data]);

  if (!data) return <div>Lesson not found</div>;

  const handleRun = () => {
    setError(null);
    
    // Prevent empty execution
    if (!code || code.trim() === '') {
      const errMsg = "Please write some code before running.";
      setError(errMsg);
      setCurrentError(errMsg);
      addMessage({ role: 'oracle', content: errMsg });
      return;
    }

    // Prevent submitting unmodified starter code
    if (code.trim() === data.challenge.initialCode.trim() && code.trim() !== '') {
      const errMsg = "You must modify the starter code to solve this challenge.";
      setError(errMsg);
      setCurrentError(errMsg);
      addMessage({ role: 'oracle', content: errMsg });
      return;
    }
    
    // Phase 1: Semantic Evaluation
    // We normalize the code for the strict validators
    CodeNormalizer.stripAll(code); // Execute for potential side-effects or just removed
    
    // Run the legacy validator with the super-stripped code (fixes space/quote rigidity)
    // We pass both the raw code and stripped code if the validator expects raw code.
    // Actually, most legacy validators do `const cleaned = code.replace(/\s+/g, '')` themselves.
    // So the main rigidity is single vs double quotes.
    const quoteNormalizedCode = code.replace(/'/g, '"');
    const result = data.challenge.validation(quoteNormalizedCode);
    
    // Run our new Semantic Evaluator to dynamically generate real execution steps!
    const semanticResult = CodeEvaluator.evaluate(code);
    
    if (result.isValid || semanticResult.isValid) {
      // Phase 2: Use Dynamic Steps if available, otherwise fallback to successSteps
      let finalSteps = semanticResult.steps.length > 0 ? semanticResult.steps : JSON.parse(JSON.stringify(data.challenge.successSteps));
      
      if (result.parsedVars && semanticResult.steps.length === 0) {
        finalSteps.forEach((step: any) => {
          if (step.variable && result.parsedVars![step.variable.name]) {
            const newVal = result.parsedVars![step.variable.name];
            step.variable.value = newVal;
            if (step.memorySnapshot && step.memorySnapshot[step.variable.address]) {
              step.memorySnapshot[step.variable.address].value = newVal;
            }
          }
        });
      }

      useEngineStore.setState({ 
        steps: finalSteps,
        currentStepIndex: 0,
        isPlaying: false,
        executionMode: 'PLAY'
      });
      initialize();
      play();
      setTimeout(() => setSuccess(true), Math.max(2000, finalSteps.length * 1000));
    } else {
      const errMsg = result.error || semanticResult.error || 'Incorrect. Try again!';
      setError(errMsg);
      setCurrentError(errMsg);
      addMessage({
        role: 'oracle',
        content: `Error detected: ${errMsg}. Check your logic and try again.`
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full max-w-6xl mx-auto p-6 items-center justify-center">
      
      {/* Left: Challenge Description */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/3 space-y-6"
      >
        <div className="bg-slate-950/80 backdrop-blur-md border border-game-purple/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-game-purple/10 blur-[50px]" />
          
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-gold to-orange-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>⚔️</span> {data.challenge.title}
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            {data.challenge.description}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl bg-game-crimson/10 border border-game-crimson/30 flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-game-crimson flex-shrink-0" />
                <span className="text-sm text-game-crimson">{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 rounded-xl bg-game-emerald/10 border border-game-emerald flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-game-emerald" />
                  <span className="text-game-emerald font-bold">Challenge Passed!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button 
            variant="secondary"
            onClick={handleRun}
            disabled={isPlaying || success}
            leftIcon={<Play className="w-4 h-4" />}
            className="w-full bg-slate-900/50 border-game-gold/30 hover:bg-game-gold/10 hover:border-game-gold text-white"
          >
            {isPlaying ? 'Running...' : 'Submit Answer'}
          </Button>

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-slate-800"
            >
              <Button 
                variant="primary"
                onClick={onComplete}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="w-full bg-game-purple hover:bg-game-purple/80"
              >
                Complete Lesson
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Right: Editor and Visualizer */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-2/3 min-h-[300px] h-full flex flex-col gap-4"
      >
        {/* Editor */}
        <div className="h-48 bg-slate-950/80 backdrop-blur-2xl border border-game-border rounded-2xl overflow-hidden shadow-lg relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              padding: { top: 16 },
              fontSize: 18,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Memory Visualizer */}
        <div className="flex-1 bg-[#0B0B0F] border border-game-border rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_70%)] pointer-events-none" />
          <MemoryVisualizer />
        </div>
      </motion.div>

    </div>
  );
};
