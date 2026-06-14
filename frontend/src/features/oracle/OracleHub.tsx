import { motion } from 'framer-motion';
import { BrainCircuit, Activity, BookOpen } from 'lucide-react';
import { useKnowledgeStore, KnowledgeGraph } from '../../store/knowledgeStore';

export default function OracleHub() {
  const { graph } = useKnowledgeStore();

  const maxVal = 100;
  const categories: { key: keyof KnowledgeGraph, label: string }[] = [
    { key: 'variables', label: 'Variables' },
    { key: 'data_types', label: 'Data Types' },
    { key: 'loops', label: 'Loops' },
    { key: 'functions', label: 'Functions' },
    { key: 'collections', label: 'Collections' },
    { key: 'oop', label: 'OOP' },
    { key: 'exceptions', label: 'Exceptions' },
    { key: 'files', label: 'File I/O' },
    { key: 'modules', label: 'Modules' },
    { key: 'algorithms', label: 'Algorithms' },
  ];

  // Helper to draw radar chart (SVG)
  const drawRadar = () => {
    const size = 300;
    const center = size / 2;
    const radius = (size - 60) / 2;
    const points: string[] = [];
    const bgPoints: string[] = [];

    categories.forEach((cat, i) => {
      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
      const val = graph[cat.key];
      const r = (val / maxVal) * radius;
      
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points.push(`${x},${y}`);

      const bgX = center + radius * Math.cos(angle);
      const bgY = center + radius * Math.sin(angle);
      bgPoints.push(`${bgX},${bgY}`);
    });

    return { points: points.join(' '), bgPoints: bgPoints.join(' '), size, center, radius };
  };

  const radar = drawRadar();

  const getMasteryRank = (val: number) => {
    if (val === 0) return 'Uninitiated';
    if (val < 30) return 'Novice';
    if (val < 60) return 'Apprentice';
    if (val < 100) return 'Adept';
    return 'Master';
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-game-purple flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <BrainCircuit className="w-10 h-10 text-game-purple" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-wide">Oracle Py</h1>
          <p className="text-slate-400 font-mono text-sm mt-1">AI Mentor Hub & Knowledge Graph</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Knowledge Graph Radar */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Activity className="w-5 h-5 text-game-blue" /> Your Knowledge Graph
          </h2>
          
          <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
            <svg width="100%" height="100%" viewBox={`0 0 ${radar.size} ${radar.size}`} className="overflow-visible">
              {/* Background web */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => {
                const webPoints = categories.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                  const x = radar.center + radar.radius * scale * Math.cos(angle);
                  const y = radar.center + radar.radius * scale * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return <polygon key={idx} points={webPoints} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
              })}
              
              {/* Spokelines */}
              {categories.map((_, i) => {
                const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                const x = radar.center + radar.radius * Math.cos(angle);
                const y = radar.center + radar.radius * Math.sin(angle);
                return <line key={i} x1={radar.center} y1={radar.center} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
              })}

              {/* Data Polygon */}
              <motion.polygon 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                points={radar.points} 
                fill="rgba(139,92,246,0.3)" 
                stroke="#8b5cf6" 
                strokeWidth="2" 
                style={{ transformOrigin: 'center' }}
              />

              {/* Labels */}
              {categories.map((cat, i) => {
                const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                const x = radar.center + (radar.radius + 20) * Math.cos(angle);
                const y = radar.center + (radar.radius + 20) * Math.sin(angle);
                const anchor = x > radar.center + 10 ? 'start' : x < radar.center - 10 ? 'end' : 'middle';
                return (
                  <text 
                    key={i} 
                    x={x} 
                    y={y} 
                    fill="#94a3b8" 
                    fontSize="10" 
                    fontFamily="monospace"
                    textAnchor={anchor}
                    alignmentBaseline="middle"
                  >
                    {cat.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Concept Mastery List */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 flex flex-col max-h-[600px]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" /> Core Pillars
          </h2>
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            {categories.map(cat => {
              const val = graph[cat.key];
              const rank = getMasteryRank(val);
              return (
                <div key={cat.key} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-slate-200">{cat.label}</span>
                    <span className={`text-xs font-mono px-2 py-1 rounded bg-slate-800 ${val === 100 ? 'text-game-purple' : 'text-slate-400'}`}>
                      {rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-game-blue transition-all duration-1000" style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 font-mono w-8">{val}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mentor Recommendations */}
      <div className="bg-gradient-to-r from-game-purple/20 to-indigo-900/20 border border-game-purple/30 rounded-3xl p-8 flex items-start gap-6">
        <div className="p-3 bg-game-purple/20 rounded-full shrink-0">
          <BrainCircuit className="w-8 h-8 text-game-purple" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Oracle's Analysis</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Your logic structures are sound, but the Knowledge Graph indicates weakness in <strong className="text-white">File I/O</strong> and <strong className="text-white">Exceptions</strong>. I recommend venturing to the File System Ruins to stabilize these concepts.
          </p>
          <button className="px-6 py-2 bg-game-purple hover:bg-purple-500 text-white font-bold rounded-lg transition-colors text-sm">
            Travel to File System Ruins
          </button>
        </div>
      </div>
    </div>
  );
}
