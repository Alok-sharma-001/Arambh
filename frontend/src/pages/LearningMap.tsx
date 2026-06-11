
import { PageHeader } from '../components/ui/PageHeader';
import { MapNode, MapNodeProps } from '../components/learning/MapNode';
import { Map } from 'lucide-react';
import { motion } from 'framer-motion';

const modules: MapNodeProps[] = [
  { id: 1, title: 'Variables Forest', description: 'Learn the basics of storing and manipulating data.', isLocked: false, completion: 100, xpReward: 100, difficulty: 'Beginner' },
  { id: 2, title: 'Data Types Valley', description: 'Understand numbers, strings, booleans, and more.', isLocked: false, completion: 45, xpReward: 150, difficulty: 'Beginner' },
  { id: 3, title: 'Loops Desert', description: 'Master for and while loops to iterate over data.', isLocked: true, completion: 0, xpReward: 200, difficulty: 'Intermediate' },
  { id: 4, title: 'Functions Mountain', description: 'Build reusable blocks of code.', isLocked: true, completion: 0, xpReward: 250, difficulty: 'Intermediate' },
  { id: 5, title: 'OOP Castle', description: 'Discover classes, objects, inheritance, and polymorphism.', isLocked: true, completion: 0, xpReward: 400, difficulty: 'Advanced' },
  { id: 6, title: 'DSA Dungeon', description: 'Conquer data structures and algorithms.', isLocked: true, completion: 0, xpReward: 500, difficulty: 'Advanced' },
  { id: 7, title: 'AI Temple', description: 'Unlock the secrets of machine learning and AI.', isLocked: true, completion: 0, xpReward: 1000, difficulty: 'Advanced' },
];

export default function LearningMap() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Python Kingdom" 
        description="Your journey through the world of Python. Unlock regions by completing lessons."
        icon={<Map className="w-6 h-6" />}
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative py-10"
      >
        {/* Decorative background path */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-2 bg-slate-800/50 rounded-full hidden md:block" />

        <div className="space-y-12 md:space-y-24">
          {modules.map((mod, index) => (
            <motion.div 
              key={mod.id} 
              variants={itemVariants}
              className={`relative flex items-center justify-center md:justify-between w-full ${
                index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              <div className="w-full md:w-5/12 z-10">
                <MapNode {...mod} />
              </div>
              
              {/* Path connector dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-4 border-slate-700 items-center justify-center z-10">
                <div className={`w-3 h-3 rounded-full ${mod.isLocked ? 'bg-slate-600' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
