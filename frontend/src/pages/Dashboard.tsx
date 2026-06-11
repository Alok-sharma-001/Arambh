
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { UserOverview } from '../components/dashboard/UserOverview';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LayoutDashboard, Star, Flame, Brain, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();

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
      className="max-w-6xl mx-auto space-y-6 md:space-y-8"
    >
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your progress."
        icon={<LayoutDashboard className="w-6 h-6" />}
      />

      <motion.div variants={itemVariants}>
        <UserOverview />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Level" value="5" icon={<Star className="w-6 h-6" />} color="blue" />
        <StatCard title="Total XP" value="1,200" icon={<Star className="w-6 h-6" />} trend="250 this week" color="amber" />
        <StatCard title="Streak" value="3 Days" icon={<Flame className="w-6 h-6" />} trend="Personal Best: 7" color="red" />
        <StatCard title="Intelligence" value="142" icon={<Brain className="w-6 h-6" />} trend="Top 15%" color="purple" />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="p-6 md:p-8 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Continue Learning</h3>
                <p className="text-slate-300">You're currently in the <strong className="text-blue-400">Data Types Valley</strong> module.</p>
              </div>
              <Button 
                size="lg" 
                rightIcon={<Play className="w-5 h-5" />}
                onClick={() => navigate('/learning-map')}
                className="w-full sm:w-auto shadow-xl shadow-blue-900/50"
              >
                Resume Quest
              </Button>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
             <DailyGoals />
             <RecentActivity />
          </div>
        </div>
        <div className="lg:col-span-1">
           {/* Additional space for right sidebar widgets if needed, currently filled by grid layout adjustments. 
               Let's make DailyGoals and RecentActivity fill the space better. Actually, placing them in a 2/1 grid works well. */}
           <div className="h-full hidden lg:block">
              <RecentActivity />
           </div>
        </div>
      </motion.div>
      
      {/* Mobile view override for Recent Activity since it's hidden above */}
      <motion.div variants={itemVariants} className="lg:hidden">
         <RecentActivity />
      </motion.div>
    </motion.div>
  );
}
