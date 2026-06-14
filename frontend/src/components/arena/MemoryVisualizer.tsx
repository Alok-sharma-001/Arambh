import React, { useState } from 'react';
import { useEngineStore } from '../../store/engineStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryOrb } from './MemoryOrb';
import { CalculationChamber } from './CalculationChamber';
import { TypeInspector } from './TypeInspector';
import { MemoryVariable } from '../../engine/VisualizationEngine';
import { Archive, Database, Scroll, Ship, Package, Link, Cpu, Gauge, GitCommitHorizontal } from 'lucide-react';

export const MemoryVisualizer: React.FC = React.memo(() => {
  const { steps, currentStepIndex } = useEngineStore();
  const [inspectedVariable, setInspectedVariable] = useState<MemoryVariable | null>(null);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const memorySnapshot = currentStep.memorySnapshot;

  const slots = Array.from({ length: 8 }, (_, i) => `0x0${i}`);

  const isError = currentStep.type === 'ERROR';

  return (
    <motion.div 
      className="flex-1 flex items-center justify-center p-8 relative z-10 w-full min-h-[300px]"
      animate={isError ? { x: [-10, 10, -10, 10, 0], filter: ['hue-rotate(0deg)', 'hue-rotate(90deg) blur(2px)', 'hue-rotate(0deg)'] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Error Glitch Overlay */}
      <AnimatePresence>
        {isError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 bg-red-600/20 pointer-events-none z-50 mix-blend-color-dodge"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)'
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Execution Chamber Background Glow */}
      <AnimatePresence>
        {currentStep.type === 'EVALUATE' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-game-purple/20 blur-[100px] rounded-full pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-8 w-full max-w-2xl relative z-10">
        
        {slots.map((address) => {
          const variable = memorySnapshot[address];
          const isJustAllocated = currentStep.type === 'ALLOCATE' && currentStep.variable?.address === address;
          const isEvaluating = currentStep.type === 'EVALUATE' && currentStep.evaluation && 
               (variable?.value === currentStep.evaluation.leftVal || variable?.value === currentStep.evaluation.rightVal);

          return (
            <motion.div
              key={address}
              initial={false}
              animate={{
                borderColor: isJustAllocated ? '#8B5CF6' : isEvaluating ? '#FBBF24' : 'rgba(255,255,255,0.05)',
                boxShadow: isJustAllocated ? 'inset 0 0 30px rgba(139,92,246,0.3)' : isEvaluating ? 'inset 0 0 30px rgba(251,191,36,0.3)' : 'none',
              }}
              className="aspect-square bg-[#13131A]/80 backdrop-blur-md border-2 rounded-3xl flex items-center justify-center relative group overflow-visible shadow-inner transition-colors duration-500"
            >
              <span className="text-slate-600 font-mono text-[10px] absolute top-3 right-3 font-bold z-10">
                {address}
              </span>

              <AnimatePresence>
                {variable && (
                  <MemoryOrb 
                    variable={variable} 
                    isEvaluating={isEvaluating}
                    onClick={(v) => setInspectedVariable(v)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Global Evaluation overlay rendering */}
        <AnimatePresence>
          {currentStep.type === 'EVALUATE' && currentStep.evaluation && (
            <CalculationChamber evaluation={currentStep.evaluation} />
          )}
        </AnimatePresence>

      </div>

      {/* Archive Explorer */}
      {currentStep.fileSystemSnapshot && Object.keys(currentStep.fileSystemSnapshot).length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-8 top-8 bottom-8 w-64 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_0_30px_rgba(34,211,238,0.1)] z-20"
        >
          <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs flex items-center gap-2 pb-2 border-b border-white/10">
            <Archive className="w-4 h-4" /> Archive Explorer
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {Object.entries(currentStep.fileSystemSnapshot).map(([filename, content]) => (
              <div 
                key={filename}
                className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group"
                onClick={() => setInspectedVariable({ address: 'disk', name: filename, value: content, type: filename.endsWith('.json') ? 'json_file' : 'text_file' } as any)}
              >
                {filename.endsWith('.json') ? (
                  <Database className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Scroll className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm font-mono text-slate-300 group-hover:text-white truncate">{filename}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Dependency Map / Fleet Radar */}
      {currentStep.importedModules && Object.keys(currentStep.importedModules).length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-8 top-8 bottom-8 w-64 bg-slate-900/80 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_0_30px_rgba(217,70,239,0.1)] z-20"
        >
          <h3 className="text-fuchsia-400 font-bold uppercase tracking-wider text-xs flex items-center gap-2 pb-2 border-b border-white/10">
            <Link className="w-4 h-4" /> Dependency Map
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-game-purple/30 border-2 border-game-purple flex items-center justify-center z-10">
                <span className="font-bold text-white text-xs">main</span>
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-game-purple to-fuchsia-500/50" />
            </div>

            {Object.entries(currentStep.importedModules).map(([moduleName, info], idx) => (
              <div key={moduleName} className="flex flex-col items-center">
                {idx > 0 && <div className="w-0.5 h-6 bg-fuchsia-500/30" />}
                <div 
                  className="w-full bg-black/40 border border-fuchsia-500/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/10 hover:border-fuchsia-400 transition-colors group relative overflow-hidden"
                  onClick={() => setInspectedVariable({ address: 'module', name: moduleName, value: JSON.stringify(info.exports), type: 'module', __rawInfo: info } as any)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/10 to-transparent pointer-events-none" />
                  {info.type === 'package' ? (
                    <Package className="w-5 h-5 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Ship className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-mono text-slate-200 group-hover:text-white truncate">{moduleName}</span>
                    <span className="text-[10px] text-fuchsia-400/70 font-bold uppercase">{info.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Algorithm Theater */}
      <AnimatePresence>
        {currentStep.algorithmState && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[800px] bg-slate-900/90 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.15)] z-30"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-rose-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <Cpu className="w-5 h-5" /> {currentStep.algorithmState.algorithmName}
              </h3>
              
              <div className="flex gap-4">
                <div className="bg-black/40 px-3 py-1 rounded-lg border border-white/5 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-slate-400 font-bold uppercase">Complexity</span>
                  <span className="text-orange-400 font-mono font-bold">{currentStep.algorithmState.complexity}</span>
                </div>
                <div className="bg-black/40 px-3 py-1 rounded-lg border border-white/5 flex items-center gap-2">
                  <GitCommitHorizontal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400 font-bold uppercase">Operations</span>
                  <span className="text-cyan-400 font-mono font-bold">{currentStep.algorithmState.operations}</span>
                </div>
              </div>
            </div>

            {/* Array Visualization */}
            <div className="h-32 flex items-end justify-center gap-2 pb-8 relative border-b border-white/10">
              {currentStep.algorithmState.array.map((val, idx) => {
                const isComparing = currentStep.algorithmState?.comparing?.includes(idx);
                const isSwapped = currentStep.algorithmState?.swapped?.includes(idx);
                const maxVal = Math.max(...currentStep.algorithmState!.array.filter(v => typeof v === 'number')) || 100;
                const heightPercent = typeof val === 'number' ? Math.max(10, (val / maxVal) * 100) : 50;
                
                let pointerLabel = '';
                Object.entries(currentStep.algorithmState!.pointers).forEach(([pName, pIdx]) => {
                  if (pIdx === idx) {
                    pointerLabel += (pointerLabel ? ', ' : '') + pName;
                  }
                });

                return (
                  <div key={idx} className="relative flex flex-col items-center justify-end h-full">
                    <motion.div
                      animate={{
                        height: `${heightPercent}%`,
                        backgroundColor: isSwapped ? '#F97316' : isComparing ? '#F43F5E' : '#3B82F6',
                        scale: isSwapped || isComparing ? 1.1 : 1,
                      }}
                      className="w-10 rounded-t-sm shadow-[0_0_10px_rgba(59,130,246,0.3)] relative group flex items-center justify-center cursor-pointer transition-colors"
                      onClick={() => setInspectedVariable({ address: `arr[${idx}]`, name: `array[${idx}]`, value: String(val), type: typeof val === 'number' ? 'int' : 'string' } as any)}
                    >
                      <span className="absolute -top-6 text-white font-mono text-xs font-bold drop-shadow-md">{val}</span>
                    </motion.div>
                    
                    {/* Index Label */}
                    <span className="absolute -bottom-5 text-[10px] font-mono text-slate-500">{idx}</span>
                    
                    {/* Pointers */}
                    {pointerLabel && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(244,63,94,0.5)] whitespace-nowrap z-10"
                      >
                        {pointerLabel}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-500 rotate-45" />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loop Portal and Counters */}
      <AnimatePresence>
        {(currentStep.type === 'LOOP_START' || currentStep.type === 'LOOP_ITERATION' || currentStep.type === 'LOOP_END') && currentStep.loopState && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2, rotate: 45 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
          >
            {/* Swirling Portal Effect */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute w-[600px] h-[600px] rounded-full border-2 border-dashed border-cyan-500/30"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute w-[650px] h-[650px] rounded-full border border-cyan-400/20 shadow-[0_0_50px_rgba(34,211,238,0.1)]"
            />
            
            {/* Iteration Counter */}
            <div className="absolute top-8 right-8 bg-slate-900/80 backdrop-blur-md border border-cyan-500/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                {currentStep.loopState.loopType} Loop Active
              </div>
              <div className="text-3xl font-bold text-white font-mono">
                Iteration: {currentStep.loopState.currentIteration}
                {currentStep.loopState.totalIterations && <span className="text-slate-500 text-xl"> / {currentStep.loopState.totalIterations}</span>}
              </div>
            </div>
            
            {/* Iteration Pulse */}
            {currentStep.type === 'LOOP_ITERATION' && (
              <motion.div
                initial={{ opacity: 0.8, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1 }}
                className="absolute w-[500px] h-[500px] rounded-full border-4 border-cyan-400/50"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Function Call / Return Effects */}
      <AnimatePresence>
        {(currentStep.type === 'FUNCTION_CALL' || currentStep.type === 'FUNCTION_RETURN') && currentStep.functionCall && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur-md border-2 border-emerald-500/50 p-6 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] z-30 min-w-[250px]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  {currentStep.type === 'FUNCTION_CALL' ? 'Function Invoked' : 'Function Returned'}
                </div>
                <div className="text-2xl font-bold text-white font-mono">
                  {currentStep.functionCall.functionName}()
                </div>
              </div>
            </div>

            {currentStep.type === 'FUNCTION_CALL' && currentStep.functionCall.args && Object.keys(currentStep.functionCall.args).length > 0 && (
              <div className="bg-black/50 rounded-xl p-4 border border-emerald-500/20">
                <div className="text-xs text-slate-400 font-bold mb-2 uppercase">Parameters</div>
                <div className="space-y-2">
                  {Object.entries(currentStep.functionCall.args || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between font-mono text-sm gap-4">
                      <span className="text-emerald-300">{key}:</span>
                      <span className="text-white bg-slate-800 px-2 rounded">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.type === 'FUNCTION_RETURN' && currentStep.functionCall.returnValue && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-emerald-950/50 rounded-xl p-4 border border-emerald-500/50 flex items-center justify-between mt-2 gap-4"
              >
                <span className="text-emerald-400 font-bold text-sm uppercase">Returned</span>
                <span className="font-mono text-lg font-bold text-white bg-emerald-600/30 px-3 py-1 rounded-lg border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  {currentStep.functionCall.returnValue}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <TypeInspector 
        variable={inspectedVariable} 
        onClose={() => setInspectedVariable(null)} 
      />
    </motion.div>
  );
});

MemoryVisualizer.displayName = 'MemoryVisualizer';
