import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'slate' | 'emerald' | 'amber' | 'red' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'sm', 
  className = '',
  icon
}) => {
  const variants = {
    primary: "bg-game-purple/10 text-game-purple border-game-purple/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    slate: "bg-slate-700/50 text-slate-300 border-slate-600",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    blue: "bg-game-purple/10 text-game-purple border-game-purple/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};
