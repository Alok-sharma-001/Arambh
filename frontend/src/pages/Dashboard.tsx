
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
      className="max-w-[1280px] mx-auto px-6 py-6 space-y-6"
    >
      {/* Level-up modal (renders only on event) */}
      <LevelUpModal />

      <ArtifactRevealModal />

      {/* Main RPG Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Row 1: Player (8 cols) & Progression (4 cols) */}
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-8">
          <CharacterCard />
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-4">
          <ProgressionWidget />
        </motion.div>

        {/* Row 2: Continue Learning (12 cols) */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-12">
          <Card className="p-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-warm-white">Continue Learning</h3>
                <p className="text-xs text-mid-gray">You're currently in the <strong className="text-gold font-bold">{activeRegionName}</strong> module.</p>
              </div>
              <button 
                onClick={() => navigate(resumePath)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 hover:border-gold/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                Resume Quest
                <Play className="w-3 h-3 fill-gold" />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Row 3: Daily Quests (6 cols) & Daily Rewards (6 cols) */}
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-6">
          <DailyGoals />
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-6">
          <DailyLoginRewards />
        </motion.div>

        {/* Row 4: Collection (6 cols) & Recent Activity (6 cols) */}
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-6">
          <ArtifactWidget />
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-6">
          <RecentActivity />
        </motion.div>

      </div>
    </motion.div>
  );
}
