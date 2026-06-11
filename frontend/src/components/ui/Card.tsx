import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', hoverEffect = false, glowEffect = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -4 } : {}}
        className={`bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden ${
          glowEffect ? 'shadow-lg shadow-blue-900/20 hover:shadow-blue-500/20 transition-shadow duration-300' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
