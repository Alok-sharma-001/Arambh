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
        className={`bg-[#13131A]/80 backdrop-blur-md border border-[#181820] rounded-2xl overflow-hidden ${
          glowEffect ? 'shadow-lg shadow-game-purple/20 hover:shadow-game-purple/40 transition-shadow duration-300' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
