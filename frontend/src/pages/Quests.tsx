import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { QuestCard } from '../components/quests/QuestCard';
import { Target, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { questsApi, Quest } from '../services/questsApi';

export default function Quests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const data = await questsApi.getActiveQuests();
      setQuests(data);
    } catch (err) {
      console.error('Failed to load active quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (questId: string) => {
    try {
      await questsApi.claimReward(questId);
      // Refresh list
      fetchQuests();
    } catch (err: any) {
      console.error('Failed to claim quest:', err);
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <PageHeader 
        title="Active Quests" 
        description="Complete quests to earn bonus XP and level up faster."
        icon={<Target className="w-6 h-6" />}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quests.map((quest) => (
            <motion.div key={quest.id} variants={itemVariants} className="h-full">
              <QuestCard
                {...quest}
                onClaim={() => handleClaim(quest.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
