import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryVariable } from '../../engine/VisualizationEngine';
import { X, Beaker, MapPin, Tag, Database } from 'lucide-react';

interface TypeInspectorProps {
  variable: MemoryVariable | null;
  onClose: () => void;
}

export const TypeInspector: React.FC<TypeInspectorProps> = React.memo(({ variable, onClose }) => {
  if (!variable) return null;

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'int':
        return "Whole number value. Never leaks, never changes shape. Perfect for counting and exact quantities.";
      case 'float':
        return "Decimal number value. Fluid and precise. Used for measurements and fractions.";
      case 'string':
        return "Sequence of characters. Stored as text on magical memory scrolls. Grows as text length increases.";
      case 'bool':
        return "Logical value representing Truth (True) or Falsehood (False). Flips states instantly.";
      case 'list':
        return "Treasure chest of items. Ordered and mutable. Elements can be changed or added at any time.";
      case 'tuple':
        return "Ancient stone tablet. Ordered but locked forever. Once inscribed, its contents cannot be altered.";
      case 'set':
        return "Magical circle of uniqueness. Unordered and strictly contains no duplicate elements.";
      case 'dict':
        return "Library shelf of knowledge. Maps unique string keys to specific values for rapid retrieval.";
      case 'class':
        return "An ancient holographic blueprint. It defines the structure and behavior for creating living objects, but is not alive itself.";
      case 'object':
        return "A living magical entity created from a blueprint. It has its own unique state, memory address, and internal properties.";
      case 'exception':
        return "A volatile anomaly representing crashed execution. It must be caught with a shield of 'except' to prevent reality from shattering.";
      case 'text_file':
        return "An ancient scroll of persistent knowledge. Its contents are etched into external memory.";
      case 'json_file':
        return "A glowing memory crystal containing highly structured, structured relational data.";
      case 'module':
        return "A massive galleon of pre-packaged knowledge. Import it to gain access to its cargo of functions and variables.";
      default:
        return "Unknown memory type.";
    }
  };

  return (
    <AnimatePresence>
      {variable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-slate-900 border ${variable.type === 'exception' ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'border-game-purple/50 shadow-[0_0_50px_rgba(139,92,246,0.3)]'} rounded-2xl p-6 max-w-sm w-full mx-4 relative overflow-hidden`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className={`text-xl font-bold ${variable.type === 'exception' ? 'text-red-400' : 'text-white'} flex items-center gap-2`}>
                {variable.type === 'json_file' ? <Database className="w-5 h-5 text-emerald-400" /> :
                 variable.type === 'text_file' ? <Beaker className="w-5 h-5 text-amber-500" /> :
                 variable.type === 'module' ? <Database className="w-5 h-5 text-fuchsia-400" /> :
                 <Database className={`w-5 h-5 ${variable.type === 'exception' ? 'text-red-500' : 'text-game-purple'}`} />}
                {variable.address === 'disk' ? 'File Inspector' : variable.address === 'module' ? 'Import Inspector' : 'Type Inspector'}
              </h3>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {/* Variable Name */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 col-span-2">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Variable Name
                </p>
                <p className="text-xl text-game-gold font-mono font-bold">{variable.name}</p>
              </div>

              {/* Data Type */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Beaker className="w-3 h-3 text-cyan-400" /> Data Type
                </p>
                <p className="text-lg text-cyan-400 font-bold uppercase tracking-wider">{variable.type}</p>
              </div>

              {/* Address / Location */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> {variable.address === 'disk' ? 'Location' : variable.address === 'module' ? 'Fleet' : 'Memory Addr'}
                </p>
                <p className="text-lg text-emerald-400 font-mono font-bold">{variable.address}</p>
              </div>

              {/* Value / Collection Inspector */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 col-span-2 flex flex-col min-h-[80px]">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                   <span>{variable.type === 'object' ? 'Internal Properties (__dict__)' : variable.type === 'class' ? 'Class Definition' : variable.address === 'disk' ? 'File Contents' : variable.address === 'module' ? 'Available Exports' : 'Contents'}</span>
                   {['list', 'tuple', 'set', 'dict', 'object', 'json_file', 'module'].includes(variable.type) && (
                     <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px]">
                       {variable.type === 'object' ? 'Properties' : variable.type === 'module' ? 'Exports' : 'Size'}: {
                         (() => {
                           try {
                             const parsed = JSON.parse(variable.value.replace(/'/g, '"'));
                             return Object.keys(parsed).length;
                           } catch (e) {
                             return '?';
                           }
                         })()
                       }
                     </span>
                   )}
                 </p>
                 <div className="text-white font-mono text-sm max-h-[150px] overflow-y-auto w-full custom-scrollbar">
                   {['list', 'tuple', 'set', 'dict', 'object', 'json_file', 'module'].includes(variable.type) ? (
                     <pre className="whitespace-pre-wrap break-all text-emerald-300 bg-black/30 p-3 rounded-lg border border-emerald-500/20">
                       {(() => {
                         try {
                           const parsed = JSON.parse(variable.value.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']')); 
                           return JSON.stringify(parsed, null, 2);
                         } catch (e) {
                           return variable.value;
                         }
                       })()}
                     </pre>
                   ) : variable.type === 'text_file' ? (
                     <pre className="whitespace-pre-wrap break-all text-amber-200 bg-amber-900/20 p-3 rounded-lg border border-amber-500/20">
                       {variable.value}
                     </pre>
                   ) : (
                     <p className="text-3xl font-extrabold text-center mt-2">{variable.value}</p>
                   )}
                 </div>
              </div>

              {/* Description */}
              <div className="col-span-2 mt-2 border-t border-white/10 pt-4">
                 <p className="text-sm text-slate-400 leading-relaxed italic">
                   "{getTypeDescription(variable.type)}"
                 </p>
              </div>
            </div>

            {/* Background Accents */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 ${variable.type === 'exception' ? 'bg-red-500/20' : 'bg-game-purple/20'} blur-[60px] rounded-full pointer-events-none`} />
            <div className={`absolute -bottom-24 -left-24 w-48 h-48 ${variable.type === 'exception' ? 'bg-orange-500/10' : 'bg-cyan-500/10'} blur-[60px] rounded-full pointer-events-none`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

TypeInspector.displayName = 'TypeInspector';
