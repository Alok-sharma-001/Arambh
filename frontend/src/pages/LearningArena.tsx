import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Database, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export default function LearningArena() {
  const navigate = useNavigate();
  const [code, setCode] = useState('x = 5\ny = 10\nz = x + y\nprint(z)');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    setOutput('Running code...\nOutput: 15\n[Visualizing memory allocation...]');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg text-white">Module 1: Variables & Memory</h1>
            <p className="text-xs text-slate-400">Python Kingdom • Beginner</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            leftIcon={<Play className="w-4 h-4 text-emerald-400" />}
            className="hover:border-emerald-500/50 hover:bg-emerald-500/10"
          >
            Run Code
          </Button>
          <Button 
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
          >
            Submit Solution
          </Button>
        </div>
      </header>

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left: Visual Arena */}
        <div className="flex-1 relative bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 shadow-lg">
              <Database size={16} className="text-blue-400" />
              <span className="text-sm font-bold text-slate-200">Memory Visualization</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900 to-slate-900">
            <div className="grid grid-cols-4 gap-6 w-full max-w-2xl">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square bg-slate-800/30 border-2 border-dashed border-slate-700/50 rounded-2xl flex items-center justify-center relative group overflow-hidden"
                >
                  <span className="text-slate-500 font-mono text-[10px] absolute top-2 right-2">0x{i.toString(16).padStart(2, '0')}</span>
                  {i === 0 && (
                    <motion.div
                      layoutId="var-x"
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-blue-500/20"
                    >
                      5
                      <div className="absolute -bottom-6 text-xs text-blue-400 font-bold bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">x</div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
             <p className="text-sm text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Visualizing: Value 5 enters RAM slot 0x00. Variable label 'x' attaches.
             </p>
          </div>
        </div>

        {/* Right: Code Editor & Terminal */}
        <div className="w-1/2 flex flex-col gap-4">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
             <div className="h-10 border-b border-slate-800 bg-slate-900/80 flex items-center px-4">
               <div className="flex space-x-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
               </div>
               <span className="ml-4 text-xs font-mono text-slate-500">main.py</span>
             </div>
            <div className="flex-1 p-2">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 15,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  automaticLayout: true,
                  renderLineHighlight: "all",
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                }}
              />
            </div>
          </div>
          
          <div className="h-56 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm flex flex-col shadow-2xl">
            <div className="flex items-center gap-2 mb-3 text-slate-400 border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4" />
              <span className="uppercase tracking-wider text-xs font-bold">Terminal Output</span>
            </div>
            <pre className="text-emerald-400 whitespace-pre-wrap flex-1 overflow-y-auto custom-scrollbar">
              {output || '> Ready'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
