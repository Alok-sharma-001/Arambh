import { PageHeader } from '../components/ui/PageHeader';
import { AchievementCard, AchievementCardProps } from '../components/achievements/AchievementCard';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRegionStore } from '../store/regionStore';

export default function Achievements() {
  const { regions } = useRegionStore();
  const dataTypesValleyCompleted = regions['data-types-valley']?.bossStatus === 'completed';
  const loopsDesertCompleted = regions['loops-desert']?.bossStatus === 'completed';

  const achievements: AchievementCardProps[] = [
    { title: 'First Login', description: 'Welcome to PyQuest! The journey begins.', icon: '👋', rarity: 'Common', unlocked: true, unlockedAt: 'Oct 12, 2026' },
    { title: 'First Program', description: 'Write and run your first line of code.', icon: '💻', rarity: 'Common', unlocked: true, unlockedAt: 'Oct 12, 2026' },
    { title: 'Python Explorer', description: 'Complete the Variables Forest module.', icon: '🌲', rarity: 'Rare', unlocked: true, unlockedAt: 'Oct 14, 2026' },
    { title: 'Master of Forms', description: 'Complete Data Types Valley and witness the true shapes of memory.', icon: '🔮', rarity: 'Epic', unlocked: dataTypesValleyCompleted, unlockedAt: dataTypesValleyCompleted ? 'Oct 16, 2026' : undefined },
    { title: 'Master of Cycles', description: 'Survive the infinite serpent and complete Loops Desert.', icon: '🔁', rarity: 'Epic', unlocked: loopsDesertCompleted, unlockedAt: loopsDesertCompleted ? 'Oct 18, 2026' : undefined },
    { title: '100 XP Club', description: 'Earn your first 100 Experience Points.', icon: '💯', rarity: 'Rare', unlocked: true, unlockedAt: 'Oct 15, 2026' },
    { title: '7 Day Streak', description: 'Maintain a learning streak for 7 consecutive days.', icon: '🔥', rarity: 'Epic', unlocked: false },
    { title: 'Bug Squasher', description: 'Solve 10 challenges without syntax errors.', icon: '🐛', rarity: 'Epic', unlocked: false },
    { title: 'Grandmaster', description: 'Reach Level 100 and complete the AI Temple.', icon: '👑', rarity: 'Legendary', unlocked: false },
    { title: 'Speed Coder', description: 'Solve a Hard difficulty challenge in under 3 minutes.', icon: '⚡', rarity: 'Legendary', unlocked: false },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader 
        title="Achievements Vault" 
        description="Showcase your milestones and rare trophies collected throughout your journey."
        icon={<Trophy className="w-6 h-6" />}
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {achievements.map((achievement, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <AchievementCard {...achievement} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
