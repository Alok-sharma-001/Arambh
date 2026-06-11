
import { PageHeader } from '../components/ui/PageHeader';
import { MapNode, MapNodeProps } from '../components/learning/MapNode';
import { Map, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const modules: MapNodeProps[] = [
  { id: 1, title: 'Variables Forest', description: 'Learn the basics of storing and manipulating data.', status: 'completed', completion: 100, xpReward: 100, difficulty: 'Beginner' },
  { id: 2, title: 'Data Types Valley', description: 'Understand numbers, strings, booleans, and more.', status: 'current', completion: 45, xpReward: 150, difficulty: 'Beginner' },
  { id: 3, title: 'Loops Desert', description: 'Master for and while loops to iterate over data.', status: 'locked', completion: 0, xpReward: 200, difficulty: 'Intermediate' },
  { id: 4, title: 'Functions Mountain', description: 'Build reusable blocks of code.', status: 'locked', completion: 0, xpReward: 250, difficulty: 'Intermediate' },
  { id: 5, title: 'OOP Castle', description: 'Discover classes, objects, inheritance, and polymorphism.', status: 'locked', completion: 0, xpReward: 400, difficulty: 'Advanced' },
  { id: 6, title: 'DSA Dungeon', description: 'Conquer data structures and algorithms.', status: 'locked', completion: 0, xpReward: 500, difficulty: 'Advanced' },
  { id: 7, title: 'AI Temple', description: 'Unlock the secrets of machine learning and AI.', status: 'locked', completion: 0, xpReward: 1000, difficulty: 'Advanced' },
];

export default function LearningMap() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <PageHeader 
        title="Python Kingdom" 
        description="Your journey through the world of Python. Reclaim the lost artifacts of logic to restore the kingdom."
        icon={<Map className="w-6 h-6" />}
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative py-12 mt-8 flex flex-col items-center"
      >
        {modules.map((mod, index) => {
          const isLeft = index % 2 === 0;
          const isLast = index === modules.length - 1;
          const nextMod = !isLast ? modules[index + 1] : null;
          
          // Determine path connection color based on completion
          const pathColor = mod.status === 'completed' && nextMod?.status !== 'locked' 
            ? 'stroke-emerald-500/50' 
            : mod.status === 'current'
            ? 'stroke-blue-500/50'
            : 'stroke-slate-800';

          return (
            <div key={mod.id} className="relative w-full max-w-4xl flex flex-col items-center">
              
              {/* Connector Path to Next Node */}
              {!isLast && (
                <div className="absolute top-1/2 left-0 right-0 h-48 md:h-64 z-0 pointer-events-none flex justify-center mt-8">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path
                      d={isLeft 
                        ? `M 50% 0 C 80% 20, 80% 80, 50% 100` 
                        : `M 50% 0 C 20% 20, 20% 80, 50% 100`
                      }
                      fill="none"
                      className={`${pathColor} transition-colors duration-1000`}
                      strokeWidth="6"
                      strokeDasharray="10 10"
                    />
                    {/* Animated flow line */}
                    {(mod.status === 'completed' || mod.status === 'current') && (
                       <path
                       d={isLeft 
                         ? `M 50% 0 C 80% 20, 80% 80, 50% 100` 
                         : `M 50% 0 C 20% 20, 20% 80, 50% 100`
                       }
                       fill="none"
                       stroke="white"
                       strokeWidth="2"
                       strokeDasharray="50 1000"
                       strokeDashoffset="0"
                       className="animate-[dash_3s_linear_infinite] opacity-50"
                     />
                    )}
                  </svg>
                </div>
              )}

              {/* Node Content */}
              <motion.div 
                variants={itemVariants}
                className={`relative z-10 flex w-full justify-center md:justify-start ${isLeft ? 'md:pl-0' : 'md:justify-end md:pr-0'} mb-24 md:mb-32`}
              >
                <div className={`w-full md:w-[45%] flex items-center justify-center relative ${isLeft ? 'md:ml-auto md:mr-12' : 'md:mr-auto md:ml-12'}`}>
                  
                  {/* Waypoint Marker for Desktop */}
                  <div className={`hidden md:flex absolute ${isLeft ? '-right-12 translate-x-1/2' : '-left-12 -translate-x-1/2'} top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-4 border-slate-700 items-center justify-center z-20`}>
                    <div className={`w-3 h-3 rounded-full ${
                      mod.status === 'completed' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)]' 
                      : mod.status === 'current' ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]' 
                      : 'bg-slate-600'
                    }`} />
                  </div>

                  {mod.status === 'current' && (
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute -top-12 ${isLeft ? '-right-16' : '-left-16'} hidden md:block z-30`}
                    >
                      <MapPin className="w-10 h-10 text-blue-500 fill-blue-500/20 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    </motion.div>
                  )}

                  <MapNode {...mod} />
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
