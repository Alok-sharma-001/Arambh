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
        whileHover={hoverEffect ? { y: -2 } : {}}
        className={`bg-black/60 backdrop-blur-md border border-warm-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,183,110,0.05)] hover:border-gold/30 ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
