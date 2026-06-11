import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore, Toast } from '../../store/toastStore';
import { Trophy, Zap, Info, X } from 'lucide-react';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const getIcon = () => {
    if (toast.icon) return <span className="text-2xl">{toast.icon}</span>;
    switch (toast.type) {
      case 'achievement': return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 'xp': return <Zap className="w-6 h-6 text-amber-400" />;
      default: return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'achievement': return 'bg-yellow-400/10 border-yellow-400/30';
      case 'xp': return 'bg-amber-400/10 border-amber-400/30';
      default: return 'bg-blue-400/10 border-blue-400/30';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative w-80 p-4 rounded-xl border backdrop-blur-lg shadow-2xl flex items-start gap-4 ${getBgColor()}`}
    >
      <div className="shrink-0 p-2 bg-slate-900 rounded-lg shadow-inner">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white text-sm">
          {toast.type === 'achievement' ? 'Achievement Unlocked!' : toast.title}
        </h4>
        <p className="text-xs text-slate-300 mt-1">
          {toast.type === 'achievement' ? toast.title : toast.description}
        </p>
        {toast.xpAmount && (
          <p className="text-xs font-bold text-amber-400 mt-1">+{toast.xpAmount} XP</p>
        )}
      </div>
      <button 
        onClick={() => removeToast(toast.id)}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
