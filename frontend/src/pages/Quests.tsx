
import { PageHeader } from '../components/ui/PageHeader';
import { QuestCard, QuestCardProps } from '../components/quests/QuestCard';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

const quests: QuestCardProps[] = [
  { title: 'Finish First Lesson', description: 'Complete the very first module in the Learning Map.', progress: 1, target: 1, xpReward: 50, difficulty: 'Easy', completed: true },
  { title: 'Complete Variables Module', description: 'Finish all lessons and quizzes in the Variables Forest.', progress: 5, target: 5, xpReward: 150, difficulty: 'Medium', completed: true },
  { title: 'Earn 500 XP', description: 'Accumulate a total of 500 experience points.', progress: 320, target: 500, xpReward: 100, difficulty: 'Medium', completed: false },
  { title: 'Submit 5 Programs', description: 'Write and execute 5 working programs in the Learning Arena.', progress: 2, target: 5, xpReward: 200, difficulty: 'Hard', completed: false },
  { title: 'Maintain 3 Day Streak', description: 'Log in and complete at least one goal for 3 consecutive days.', progress: 3, target: 3, xpReward: 100, difficulty: 'Easy', completed: true },
  { title: 'Master of Loops', description: 'Complete the Loops Desert with a 100% score.', progress: 0, target: 1, xpReward: 300, difficulty: 'Epic', completed: false },
];

export default function Quests() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader 
        title="Active Quests" 
        description="Complete quests to earn bonus XP and level up faster."
        icon={<Target className="w-6 h-6" />}
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {quests.map((quest, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <QuestCard {...quest} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
