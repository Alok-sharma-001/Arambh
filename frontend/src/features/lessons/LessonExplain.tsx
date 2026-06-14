import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ChevronRight, Play } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { MemoryVisualizer } from '../../components/arena/MemoryVisualizer';
import Editor from '@monaco-editor/react';
import { LineExecutionHighlighter } from '../../components/arena/LineExecutionHighlighter';
import * as monaco from 'monaco-editor';
import { ALL_LESSONS as VARIABLES_FOREST_LESSONS } from '../../data/allLessons';

interface LessonExplainProps {
  lessonId: string;
  onComplete: () => void;
}

export const LessonExplain: React.FC<LessonExplainProps> = ({ lessonId, onComplete }) => {
  const { initialize, play, isPlaying, steps, currentStepIndex } = useEngineStore();
  const [editorInstance, setEditorInstance] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const data = VARIABLES_FOREST_LESSONS[lessonId];

  useEffect(() => {
    if (!data) return;
    // Reset engine state when entering
    useEngineStore.setState({ 
      steps: data.explain.steps,
      currentStepIndex: 0,
      isPlaying: false,
      executionMode: 'SLOW'
    });
  }, [data]);

  if (!data) return <div>Lesson not found</div>;

  const handlePlay = () => {
    setHasPlayed(true);
    initialize();
    play();
  };

  const isDone = hasPlayed && currentStepIndex >= steps.length - 1;

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full max-w-6xl mx-auto p-6 items-center justify-center">
      
      {/* Left: Explanation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/3 space-y-6"
      >
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-game-purple/10 blur-[50px]" />
          
          <h2 className="text-2xl font-extrabold text-white mb-4">{data.explain.title}</h2>
          {data.explain.description.map((desc, idx) => (
            <p key={idx} className="text-slate-300 leading-relaxed mb-4">
              {desc}
            </p>
          ))}
          
          <Button 
            variant="secondary"
            onClick={handlePlay}
            disabled={isPlaying}
            leftIcon={<Play className="w-4 h-4" />}
            className="w-full bg-slate-900/50 border-game-emerald/30 hover:bg-game-emerald/10 hover:border-game-emerald text-white"
          >
            {isPlaying ? 'Watching...' : 'Watch Example'}
          </Button>

          {isDone && (
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
                I Understand
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Right: Visualization Mini-Arena */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-2/3 h-[500px] flex flex-col gap-4"
      >
        {/* Editor */}
        <div className="h-24 bg-slate-950/80 backdrop-blur-2xl border border-game-border rounded-2xl overflow-hidden shadow-lg relative">
          <LineExecutionHighlighter editor={editorInstance} lineNumber={steps[currentStepIndex]?.lineNumber || null} />
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={data.explain.code}
            onMount={(editor) => setEditorInstance(editor)}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: 'off',
              padding: { top: 16 },
              fontSize: 18,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              scrollBeyondLastLine: false,
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 10
            }}
          />
        </div>

        {/* Memory Visualizer */}
        <div className="flex-1 bg-[#0B0B0F] border border-game-border rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />
          <MemoryVisualizer />
        </div>
      </motion.div>

    </div>
  );
};
