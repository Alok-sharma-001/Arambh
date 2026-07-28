import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { AchievementCard } from '../components/achievements/AchievementCard';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { achievementsApi, Achievement } from '../services/achievementsApi';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await achievementsApi.getAchievements();
      setAchievements(data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <PageHeader 
        title="Achievements Vault" 
        description="Showcase your milestones and rare trophies collected throughout your journey."
        icon={<Trophy className="w-6 h-6" />}
      />

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin w-8 h-8 border-2 border-[#c8a45e] border-t-transparent rounded-full" />
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {achievements.map((achievement) => (
            <motion.div key={achievement.id} variants={itemVariants} className="h-full">
              <AchievementCard {...achievement} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
