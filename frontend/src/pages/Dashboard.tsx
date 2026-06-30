
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { CharacterCard } from '../components/progression/CharacterCard';
import { LevelUpModal } from '../components/progression/LevelUpModal';
import { ArtifactRevealModal } from '../components/artifacts/ArtifactRevealModal';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { ArtifactWidget } from '../components/artifacts/ArtifactWidget';
import { ProgressionWidget } from '../components/dashboard/ProgressionWidget';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LayoutDashboard, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgression } from '../hooks/useProgression';
import { useRegionStore } from '../store/regionStore';
import { ALL_LESSONS, getRegionForLesson } from '../data/allLessons';
import { DailyLoginRewards } from '../components/dashboard/DailyLoginRewards';
import { useProgressionStore } from '../store/progressionStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { fetchProgression } = useProgression();
  const stats = useProgressionStore((state) => state.stats);

  useEffect(() => {
    fetchProgression();
  }, [fetchProgression]);

  useEffect(() => {
    if (stats && !stats.player_class) {
      navigate('/onboarding');
    }
  }, [stats, navigate]);

  const regions = useRegionStore((state) => state.regions);
  const REGION_ORDER = [
    'variables-forest',
    'data-types-valley',
    'loops-desert',
    'functions-mountain',
    'collections-kingdom',
    'oop-citadel',
    'exception-abyss',
    'filesystem-ruins',
    'modules-harbor',
    'algorithm-arena',
    'iterator-isles',
    'bossgate-saga',
  ];
  
  let activeRegionId = 'variables-forest';
  for (const rId of REGION_ORDER) {
    const r = regions[rId];
    if (r && r.regionStatus !== 'locked' && r.regionStatus !== 'completed') {
      activeRegionId = rId;
      break;
    }
  }

  const activeRegion = regions[activeRegionId];
  let resumePath = '/learning-map';
  if (activeRegion) {
    if (activeRegion.bossStatus === 'available') {
      resumePath = `/region/${activeRegionId}/boss`;
    } else {
      // Find the first uncompleted lesson for this region
      const regionLessons = Object.keys(ALL_LESSONS).filter(id => getRegionForLesson(id) === activeRegionId);
      regionLessons.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      
      const uncompletedLessons = regionLessons.filter(id => !activeRegion.completedLessons.includes(id));
      const targetLessonId = uncompletedLessons.length > 0 ? uncompletedLessons[0] : regionLessons[0];
      
      if (targetLessonId) {
        resumePath = `/lesson/${activeRegionId}/${targetLessonId}`;
      } else {
        resumePath = `/region/${activeRegionId}`;
      }
    }
  }
  
  const activeRegionName = activeRegionId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8"
    >
      {/* Level-up modal (renders only on event) */}
      <LevelUpModal />

      <ArtifactRevealModal />

      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your progress."
        icon={<LayoutDashboard className="w-6 h-6" />}
      />

      {/* Character Profile Card — the RPG hero area */}
      <motion.div variants={itemVariants}>
        <CharacterCard />
      </motion.div>

      {/* Daily Login Reward Calendar */}
      <motion.div variants={itemVariants}>
        <DailyLoginRewards />
      </motion.div>

      {/* Artifact Collection Widget */}
      <motion.div variants={itemVariants}>
        <ArtifactWidget />
      </motion.div>

      {/* Main content grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Continue Learning CTA */}
          <Card className="p-6 md:p-8 bg-gradient-to-r from-game-purple/20 to-indigo-900/20 border-game-purple/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Continue Learning</h3>
                <p className="text-slate-300">You're currently in the <strong className="text-game-gold">{activeRegionName}</strong> module.</p>
              </div>
              <Button 
                size="lg" 
                rightIcon={<Play className="w-5 h-5" />}
                onClick={() => navigate(resumePath)}
                className="w-full sm:w-auto shadow-xl shadow-game-purple/30 bg-game-purple hover:bg-game-purple/80 border-none"
              >
                Resume Quest
              </Button>
            </div>
          </Card>
          
          {/* Quests + Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <DailyGoals />
            <RecentActivity />
          </div>
        </div>

        {/* Progression Widget sidebar */}
        <div className="lg:col-span-1">
          <ProgressionWidget />
        </div>
      </motion.div>
    </motion.div>
  );
}
