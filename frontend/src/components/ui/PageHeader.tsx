import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-3 bg-game-purple/10 text-game-purple rounded-xl border border-game-purple/20">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            {title}
          </h1>
          {description && (
            <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
};
