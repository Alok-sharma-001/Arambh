import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LearningArena() {
  const navigate = useNavigate();
  const [code, setCode] = useState('x = 5\ny = 10\nz = x + y\nprint(z)');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    setOutput('Running code...\nOutput: 15\n[Visualizing memory allocation...]');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-700 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-bold">Module 1: Variables & Memory</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            className="flex items-center space-x-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
          >
            <Play size={16} fill="currentColor" />
            <span>Run</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors">
            <Send size={16} />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Visual Arena */}
        <div className="flex-1 relative bg-slate-950 flex flex-col">
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700">
              <Database size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Memory Visualization</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center relative group overflow-hidden"
                >
                  <span className="text-slate-600 text-xs absolute top-2 right-2">0x{i.toString(16).padStart(2, '0')}</span>
                  {i === 0 && (
                    <motion.div
                      layoutId="var-x"
                      className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20"
                    >
                      5
                      <div className="absolute -bottom-6 text-xs text-blue-400 font-bold">x</div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
             <p className="text-xs text-slate-500 italic">Visualizing: Value 5 enters RAM slot 0x00. Variable label 'x' attaches.</p>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="w-1/2 flex flex-col border-l border-slate-700 bg-[#1e1e1e]">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                automaticLayout: true,
              }}
            />
          </div>
          <div className="h-48 border-t border-slate-700 bg-slate-900 p-4 font-mono text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 uppercase tracking-wider text-xs font-bold">Terminal</span>
            </div>
            <pre className="text-green-400 whitespace-pre-wrap">{output || '> Ready'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
