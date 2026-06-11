import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Database, Terminal, Code } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-[#020617] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.15),rgba(255,255,255,0))] text-white overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-2xl relative z-20 shadow-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Module 1: Variables & Memory
            </h1>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mt-0.5">Python Kingdom • Beginner</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            leftIcon={<Play className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />}
            className="bg-slate-900/50 border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 backdrop-blur-md"
          >
            Run Code
          </Button>
          <Button 
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
            className="shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            Submit Solution
          </Button>
        </div>
      </header>

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6 relative z-10">
        {/* Left: Visual Arena */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none" />

          <div className="absolute top-5 left-5 z-10">
            <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
              <Database size={16} className="text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Memory Visualization</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 relative z-10">
            <div className="grid grid-cols-4 gap-8 w-full max-w-2xl">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square bg-black/20 backdrop-blur-sm border-2 border-white/5 rounded-3xl flex items-center justify-center relative group overflow-hidden shadow-inner"
                >
                  <span className="text-slate-600 font-mono text-[10px] absolute top-3 right-3 font-bold">0x{i.toString(16).padStart(2, '0')}</span>
                  {i === 0 && (
                    <motion.div
                      layoutId="var-x"
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                    >
                      5
                      <div className="absolute -bottom-8 text-xs text-blue-400 font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">x</div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-5 border-t border-white/5 bg-black/20 backdrop-blur-xl relative z-10">
             <p className="text-sm font-medium text-slate-400 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                Visualizing: Value <strong className="text-white">5</strong> enters RAM slot <strong className="text-blue-400">0x00</strong>. Variable label <strong className="text-white">'x'</strong> attaches.
             </p>
          </div>
        </motion.div>

        {/* Right: Code Editor & Terminal */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[45%] flex flex-col gap-6"
        >
          <div className="flex-1 bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
             <div className="h-12 border-b border-white/5 bg-black/20 flex items-center justify-between px-5">
               <div className="flex items-center gap-4">
                 <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                 </div>
                 <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold font-mono text-slate-300 tracking-wide">main.py</span>
                 </div>
               </div>
             </div>
            <div className="flex-1 p-3">
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
          
          <div className="h-64 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 font-mono text-sm flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-4 text-slate-400 border-b border-white/5 pb-3">
              <Terminal className="w-5 h-5 text-emerald-500" />
              <span className="uppercase tracking-widest text-xs font-extrabold text-slate-300">Terminal Output</span>
            </div>
            <pre className="text-emerald-400 whitespace-pre-wrap flex-1 overflow-y-auto custom-scrollbar leading-relaxed">
              {output || '> Waiting for execution...'}
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
