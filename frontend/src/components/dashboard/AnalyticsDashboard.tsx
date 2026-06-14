import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { useProgressionStore } from '../../store/progressionStore';
import { useRegionStore } from '../../store/regionStore';
import { Flame, Brain, Target, Shield, Zap, TrendingUp, BookOpen, Skull, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_LESSONS } from '../../data/allLessons';

const RADAR_METRICS = [
  { subject: 'Variables', key: 'variables' },
  { subject: 'Data Types', key: 'data_types' },
  { subject: 'Loops', key: 'loops' },
  { subject: 'Functions', key: 'functions' },
  { subject: 'Collections', key: 'collections' },
  { subject: 'OOP', key: 'oop' },
  { subject: 'Exceptions', key: 'exceptions' },
  { subject: 'Files', key: 'files' },
  { subject: 'Modules', key: 'modules' },
  { subject: 'Algorithms', key: 'algorithms' }
];

export default function AnalyticsDashboard() {
  const { graph } = useKnowledgeStore();
  const { stats } = useProgressionStore();
  const { regions } = useRegionStore();

  const radarData = useMemo(() => {
    return RADAR_METRICS.map(metric => ({
      subject: metric.subject,
      A: graph[metric.key as keyof typeof graph] || 0,
      fullMark: 100
    }));
  }, [graph]);

  const { strengths, weaknesses } = useMemo(() => {
    const sorted = [...radarData].sort((a, b) => b.A - a.A);
    return {
      strengths: sorted.filter(s => s.A > 0).slice(0, 3),
      weaknesses: sorted.filter(s => s.A < 100).reverse().slice(0, 3)
    };
  }, [radarData]);

  const completionStats = useMemo(() => {
    let completedLessons = 0;
    const totalLessons = Object.keys(ALL_LESSONS).length;
    let bossesDefeated = 0;
    let regionsUnlocked = 0;

    Object.values(regions).forEach(reg => {
      if (reg.regionStatus !== 'locked') regionsUnlocked++;
      if (reg.bossStatus === 'completed') bossesDefeated++;
      completedLessons += reg.completedLessons.length;
    });

    return {
      completedLessons,
      totalLessons,
      percentage: Math.round((completedLessons / totalLessons) * 100) || 0,
      bossesDefeated,
      regionsUnlocked
    };
  }, [regions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full pb-20"
      >
        {/* Top RPG Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {/* XP Card */}
          <div className="relative overflow-hidden rounded-2xl border border-warm-white/[0.06] p-6 text-left transition-all hover:-translate-y-1 hover:shadow-card-hover"
               style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98))' }}>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-20 bg-gold" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gold/[0.06] border border-gold/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray">Total XP</p>
                <p className="text-2xl font-bold font-mono text-warm-white mt-0.5">{stats?.total_xp || 0}</p>
              </div>
            </div>
          </div>
          
          {/* Rank Card */}
          <div className="relative overflow-hidden rounded-2xl border border-warm-white/[0.06] p-6 text-left transition-all hover:-translate-y-1 hover:shadow-card-hover"
               style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98))' }}>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-20 bg-[#60a5fa]" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#60a5fa]/[0.06] border border-[#60a5fa]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#60a5fa]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray">Current Rank</p>
                <p className="text-xl font-display font-bold text-warm-white mt-0.5">{stats?.rank || 'Novice'}</p>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="relative overflow-hidden rounded-2xl border border-warm-white/[0.06] p-6 text-left transition-all hover:-translate-y-1 hover:shadow-card-hover"
               style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98))' }}>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-20 bg-[#34d399]" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#34d399]/[0.06] border border-[#34d399]/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#34d399]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray">Current Level</p>
                <p className="text-2xl font-bold font-mono text-warm-white mt-0.5">{stats?.current_level || 1}</p>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="relative overflow-hidden rounded-2xl border border-warm-white/[0.06] p-6 text-left transition-all hover:-translate-y-1 hover:shadow-card-hover"
               style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98))' }}>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-20 bg-[#f97316]" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#f97316]/[0.06] border border-[#f97316]/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#f97316]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray">Streak</p>
                <p className="text-2xl font-bold font-mono text-warm-white mt-0.5">{stats?.streak_days || 0} Days</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Knowledge Radar Matrix */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="relative h-full rounded-2xl border border-warm-white/[0.06] p-8 overflow-hidden"
                 style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98))' }}>
              <div className="absolute inset-x-0 top-0 h-px opacity-70"
                   style={{ background: `linear-gradient(90deg, transparent, #8b5cf6, transparent)` }} />
              
              <div className="flex items-center gap-3 mb-8">
                <Target className="w-6 h-6 text-[#8b5cf6]" />
                <h2 className="text-2xl font-display font-bold text-warm-white">The Knowledge Matrix</h2>
              </div>
              
              <div className="h-[450px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255, 252, 242, 0.08)" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: 'rgba(255, 252, 242, 0.7)', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif' }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: 'rgba(255, 252, 242, 0.3)' }} 
                      stroke="rgba(255, 252, 242, 0.08)"
                    />
                    <Radar 
                      name="Mastery" 
                      dataKey="A" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fill="#8b5cf6" 
                      fillOpacity={0.3} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.95)', borderColor: 'rgba(139, 92, 246, 0.4)', borderRadius: '12px', color: '#fffcf2' }}
                      itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Aptitude Analysis */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Strengths */}
            <div className="relative rounded-2xl border border-[#34d399]/20 bg-[#34d399]/[0.02] p-6">
              <div className="absolute inset-x-0 top-0 h-px opacity-50"
                   style={{ background: `linear-gradient(90deg, transparent, #34d399, transparent)` }} />
              <h3 className="text-lg font-display font-bold text-warm-white mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#34d399]" /> Greatest Strengths
              </h3>
              <div className="space-y-3">
                {strengths.length > 0 ? strengths.map((s, i) => (
                  <div key={i} className="flex justify-between items-center rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.02] p-4 transition-colors hover:bg-warm-white/[0.04]">
                    <span className="text-sm font-medium text-warm-white/80">{s.subject}</span>
                    <span className="text-sm font-mono font-bold text-[#34d399]">{s.A}%</span>
                  </div>
                )) : (
                  <p className="text-mid-gray text-sm italic">Complete lessons to discover strengths.</p>
                )}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="relative rounded-2xl border border-[#f43f5e]/20 bg-[#f43f5e]/[0.02] p-6">
              <div className="absolute inset-x-0 top-0 h-px opacity-50"
                   style={{ background: `linear-gradient(90deg, transparent, #f43f5e, transparent)` }} />
              <h3 className="text-lg font-display font-bold text-warm-white mb-5 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#f43f5e]" /> Areas of Focus
              </h3>
              <div className="space-y-3">
                {weaknesses.length > 0 ? weaknesses.map((w, i) => (
                  <div key={i} className="flex justify-between items-center rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.02] p-4 transition-colors hover:bg-warm-white/[0.04]">
                    <span className="text-sm font-medium text-warm-white/80">{w.subject}</span>
                    <span className="text-sm font-mono font-bold text-[#f43f5e]">{w.A}%</span>
                  </div>
                )) : (
                  <p className="text-mid-gray text-sm italic">You are a perfect master.</p>
                )}
              </div>
            </div>
            
            {/* Encounters */}
            <div className="relative rounded-2xl border border-warm-white/[0.06] p-6 text-left"
                 style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98))' }}>
              <h3 className="text-lg font-display font-bold text-warm-white mb-6 flex items-center gap-2">
                <Skull className="w-5 h-5 text-mid-gray" /> Progression Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.02] p-4 text-center">
                  <p className="text-3xl font-bold font-mono text-gold mb-1">{completionStats.bossesDefeated}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray">Bosses Defeated</p>
                </div>
                <div className="rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.02] p-4 text-center">
                  <p className="text-3xl font-bold font-mono text-warm-white mb-1">{completionStats.regionsUnlocked}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray">Regions Found</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
