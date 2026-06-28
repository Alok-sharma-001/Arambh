import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Flame, 
  Award, 
  HelpCircle, 
  AlertTriangle, 
  BarChart2, 
  Zap, 
  Clock, 
  RefreshCw, 
  Bug, 
  UserX,
  Target,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { analyticsApi, FounderDashboardResponse, BetaAdminPanelResponse } from '../services/analyticsApi';

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<FounderDashboardResponse | null>(null);
  const [adminData, setAdminData] = useState<BetaAdminPanelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'founder' | 'admin' | 'bugs'>('founder');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setError(null);
    try {
      const [dash, adm] = await Promise.all([
        analyticsApi.getFounderDashboard(),
        analyticsApi.getAdminPanel()
      ]);
      setDashboardData(dash);
      setAdminData(adm);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Failed to fetch analytics data. Make sure you are logged in as founder or admin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-near-black pt-[72px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-mid-gray font-mono text-sm tracking-wider uppercase">Loading Oracle Intel...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-near-black pt-[72px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1c1212] border border-[#ea580c]/30 rounded-2xl p-6 text-center space-y-4">
          <AlertTriangle className="mx-auto text-[#ea580c]" size={40} />
          <h2 className="text-xl font-display font-bold text-warm-white">Access Denied / Query Failed</h2>
          <p className="text-sm text-mid-gray">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/30 rounded-lg py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#ea580c]/20 transition-colors"
          >
            Retry Call
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-near-black pt-[72px] text-warm-white">
      {/* Title Header */}
      <div className="border-b border-warm-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-gold">Oracle's Spire</h1>
            <p className="text-sm text-mid-gray mt-1">Founder Intelligence & Beta Progression Control Center</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gold hover:bg-gold/15 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Intel'}
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-warm-white/[0.06] mb-8 overflow-x-auto">
          {[
            { id: 'founder', label: 'Founder Analytics', icon: BarChart2 },
            { id: 'admin', label: 'Beta Admin Panel', icon: Users },
            { id: 'bugs', label: `Bug Reports (${adminData?.bug_reports.length || 0})`, icon: Bug }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gold text-gold bg-gold/[0.02]'
                    : 'border-transparent text-mid-gray hover:text-warm-white'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Founder Analytics */}
        {activeTab === 'founder' && dashboardData && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid gap-6 sm:grid-cols-4">
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-5">
                <div className="flex items-center justify-between text-mid-gray">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Initiates</span>
                  <Users size={20} className="text-gold" />
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-display font-bold text-warm-white">{dashboardData.total_users}</h3>
                  <p className="text-xs text-mid-gray mt-1">Registered players</p>
                </div>
              </div>

              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-5">
                <div className="flex items-center justify-between text-mid-gray">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Initiates Today</span>
                  <Zap size={20} className="text-gold animate-pulse" />
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-display font-bold text-warm-white">{dashboardData.active_users_today}</h3>
                  <p className="text-xs text-mid-gray mt-1">Daily Active Users (DAU)</p>
                </div>
              </div>
              
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-5">
                <div className="flex items-center justify-between text-mid-gray">
                  <span className="text-xs font-bold uppercase tracking-wider">XP Earned Today</span>
                  <Award size={20} className="text-emerald" />
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-display font-bold text-warm-white">{dashboardData.xp_earned_today.toLocaleString()}</h3>
                  <p className="text-xs text-mid-gray mt-1">Total experience gained</p>
                </div>
              </div>

              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-5">
                <div className="flex items-center justify-between text-mid-gray">
                  <span className="text-xs font-bold uppercase tracking-wider">Day-1 Retention</span>
                  <Zap size={20} className="text-cyan-400" />
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-display font-bold text-warm-white">{dashboardData.retention_d1 || Math.round(dashboardData.retention_rate * 100)}%</h3>
                  <p className="text-xs text-mid-gray mt-1">Next-day return rate</p>
                </div>
              </div>
            </div>

            {/* Retention & Cohorts Curves */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Cohort Retention Curve
                </h2>
                <div className="flex items-end justify-between h-48 px-6 pb-2 border-b border-warm-white/10 relative">
                  {[
                    { label: 'Day 1', val: dashboardData.retention_d1 },
                    { label: 'Day 3', val: dashboardData.retention_d3 },
                    { label: 'Day 7', val: dashboardData.retention_d7 }
                  ].map((cohort) => (
                    <div key={cohort.label} className="flex flex-col items-center gap-2 w-1/4 z-10">
                      <span className="text-xs font-mono font-bold text-gold">{cohort.val}%</span>
                      <div 
                        className="w-12 bg-gradient-to-t from-game-purple/80 to-cyan-400/80 rounded-t-lg transition-all duration-700" 
                        style={{ height: `${Math.max(10, cohort.val * 1.2)}px` }} 
                      />
                      <span className="text-xs text-mid-gray font-bold">{cohort.label}</span>
                    </div>
                  ))}
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-1/4 border-t border-warm-white/[0.03] pointer-events-none" />
                  <div className="absolute inset-x-0 top-2/4 border-t border-warm-white/[0.03] pointer-events-none" />
                  <div className="absolute inset-x-0 top-3/4 border-t border-warm-white/[0.03] pointer-events-none" />
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                  <Clock size={18} />
                  Engagement Metrics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-warm-white/[0.06] bg-[#141413] p-4 text-center">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-mid-gray">Avg Session Duration</span>
                    <strong className="block text-2xl font-display font-bold text-warm-white mt-1">
                      {Math.round(dashboardData.avg_session_length / 60)}m
                    </strong>
                    <span className="block text-[9px] text-slate-500 mt-1 font-mono">{dashboardData.avg_session_length}s average</span>
                  </div>

                  <div className="rounded-xl border border-warm-white/[0.06] bg-[#141413] p-4 text-center">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-mid-gray">Lessons per initiate</span>
                    <strong className="block text-2xl font-display font-bold text-warm-white mt-1">
                      {dashboardData.lessons_per_user}
                    </strong>
                    <span className="block text-[9px] text-slate-500 mt-1">completes ratio</span>
                  </div>

                  <div className="rounded-xl border border-warm-white/[0.06] bg-[#141413] p-4 text-center">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-mid-gray">Mentor Chats Ratio</span>
                    <strong className="block text-2xl font-display font-bold text-warm-white mt-1">
                      {dashboardData.mentor_queries_per_user}
                    </strong>
                    <span className="block text-[9px] text-slate-500 mt-1">prompts / user</span>
                  </div>

                  <div className="rounded-xl border border-warm-white/[0.06] bg-[#141413] p-4 text-center">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-mid-gray">Vault Reviews Ratio</span>
                    <strong className="block text-2xl font-display font-bold text-warm-white mt-1">
                      {dashboardData.vault_reviews_per_user}
                    </strong>
                    <span className="block text-[9px] text-slate-500 mt-1">card reviews / user</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Funnel & Dropoffs */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                  <Target size={18} />
                  Activation Funnel Rates
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Signup → First Lesson', val: dashboardData.activation_signup_to_lesson },
                    { label: 'First Lesson → Completion', val: dashboardData.activation_lesson_to_completion },
                    { label: 'Completion → Training Ground', val: dashboardData.activation_completion_to_training },
                    { label: 'Training Ground → Boss Fight', val: dashboardData.activation_training_to_boss }
                  ].map((step, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">{step.label}</span>
                        <span className="text-game-gold font-mono">{step.val}%</span>
                      </div>
                      <div className="w-full bg-[#141413] h-2.5 rounded-full overflow-hidden border border-warm-white/[0.04]">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-game-purple to-game-gold transition-all duration-500" 
                          style={{ width: `${step.val}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dropoff Detection */}
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                  <TrendingDown size={18} />
                  Dropoff Identification
                </h2>
                <div className="space-y-3">
                  {[
                    { label: 'Registered but never started a lesson', val: dashboardData.dropoffs?.registered_no_lesson || 0 },
                    { label: 'Started lesson but never completed it', val: dashboardData.dropoffs?.started_no_complete || 0 },
                    { label: 'Completed lesson but never entered training ground', val: dashboardData.dropoffs?.completed_no_training || 0 },
                    { label: 'Completed region but never returned next day', val: dashboardData.dropoffs?.completed_region_no_return || 0 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-warm-white/[0.04] bg-[#141413]">
                      <span className="text-xs text-slate-400 font-bold">{item.label}</span>
                      <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold">
                        {item.val} initiates
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Friction Reports Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Exit rates & Quiz failure rates */}
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-400" />
                  Friction hotspots: exit & failure rates
                </h2>
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-mid-gray mb-3">Lessons with highest exit rates</h3>
                    {dashboardData.friction_lesson_exit_rates?.length === 0 ? (
                      <p className="text-xs text-slate-500">No exits recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {dashboardData.friction_lesson_exit_rates?.slice(0, 3).map((l, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs font-mono">
                            <span className="text-warm-white">{l.lesson_id}</span>
                            <span className="text-red-400 font-bold">{l.exit_rate}% exit rate</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-warm-white/[0.04] pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-mid-gray mb-3">Quizzes with highest failure rates</h3>
                    {dashboardData.friction_quiz_failure_rates?.length === 0 ? (
                      <p className="text-xs text-slate-500">No quiz failures recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {dashboardData.friction_quiz_failure_rates?.slice(0, 3).map((q, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs font-mono">
                            <span className="text-warm-white">{q.challenge_id}</span>
                            <span className="text-red-400 font-bold">{q.failure_rate}% fail rate</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mentor prompts & Revisited concepts */}
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Friction hotspots: helper search triggers
                </h2>
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-mid-gray mb-3">Concepts Users Revisit Repeatedly</h3>
                    {dashboardData.friction_revisited_concepts?.length === 0 ? (
                      <p className="text-xs text-slate-500">No concept view history.</p>
                    ) : (
                      <div className="space-y-2">
                        {dashboardData.friction_revisited_concepts?.slice(0, 3).map((c, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs font-mono">
                            <span className="text-warm-white">{c.concept_id}</span>
                            <span className="text-game-gold font-bold">{c.views} views</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-warm-white/[0.04] pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-mid-gray mb-3">Frequent AI Mentor Prompts</h3>
                    {dashboardData.friction_mentor_prompts?.length === 0 ? (
                      <p className="text-xs text-slate-500">No mentor interactions.</p>
                    ) : (
                      <div className="space-y-2">
                        {dashboardData.friction_mentor_prompts?.slice(0, 3).map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-warm-white truncate max-w-[250px] font-medium">"{p.prompt}"</span>
                            <span className="text-cyan-400 font-mono font-bold">{p.count} calls</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Journeys Timeline */}
            <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
              <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                <Users size={18} />
                Initiate Journey Timelines (Replay)
              </h2>
              {dashboardData.user_journeys?.length === 0 ? (
                <p className="text-sm text-mid-gray py-4 text-center">No journey replay timelines logged yet.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {dashboardData.user_journeys?.slice(0, 4).map((journey, idx) => (
                    <div key={idx} className="rounded-xl border border-warm-white/[0.06] bg-[#141413] p-4 flex flex-col justify-between">
                      <div className="border-b border-warm-white/[0.04] pb-2 mb-3">
                        <strong className="text-xs text-game-gold font-bold">{journey.username}</strong>
                      </div>
                      <div className="space-y-2 relative border-l border-warm-white/10 pl-4 ml-2">
                        {journey.timeline.map((item, tIdx) => (
                          <div key={tIdx} className="relative flex items-center justify-between text-[11px]">
                            {/* Dot on line */}
                            <div className="absolute -left-[21px] rounded-full w-2.5 h-2.5 bg-game-purple border-2 border-near-black" />
                            <div>
                              <span className="font-bold text-slate-300 mr-2">{item.event}</span>
                              <span className="text-slate-500 font-mono text-[9px]">{item.summary}</span>
                            </div>
                            <span className="text-slate-500 font-mono text-[9px]">{item.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Beta Admin Panel */}
        {activeTab === 'admin' && adminData && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Stuck Users List */}
            <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
              <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
                <UserX size={18} />
                Stuck Initiates (No progress in 3 days)
              </h2>
              {adminData.stuck_users.length === 0 ? (
                <p className="text-sm text-mid-gray py-4 text-center">No stuck users detected. All players are moving! ⚔️</p>
              ) : (
                <div className="space-y-4">
                  {adminData.stuck_users.map((u) => (
                    <div key={u.username} className="flex items-center justify-between border-b border-warm-white/[0.04] pb-3 last:border-none">
                      <div>
                        <strong className="text-sm font-semibold text-warm-white">{u.username}</strong>
                        <span className="block text-xs text-mid-gray mt-1">Region: <span className="font-mono text-gold">{u.current_region}</span></span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-gold font-mono">LVL {u.current_level}</span>
                        <span className="block text-[10px] text-mid-gray mt-1">Last Active: {new Date(u.last_active).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Difficult Concepts & Content Engagement */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-lg font-bold text-gold mb-4">Difficult Concepts (Mentorship Hotspots)</h2>
                {adminData.difficult_concepts.length === 0 ? (
                  <p className="text-sm text-mid-gray py-4 text-center">No concept triggers logged yet.</p>
                ) : (
                  <div className="space-y-4">
                    {adminData.difficult_concepts.map((concept) => (
                      <div key={concept.concept_id} className="flex items-center justify-between border-b border-warm-white/[0.04] pb-3 last:border-none">
                        <span className="font-mono text-sm text-warm-white">{concept.concept_id}</span>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-mid-gray">{concept.views} views</span>
                          <span className="text-gold font-bold">{concept.mentor_chats} mentor chats</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
                <h2 className="font-display text-lg font-bold text-gold mb-4">Difficult Regions (Boss Failure Gates)</h2>
                {adminData.difficult_regions.length === 0 ? (
                  <p className="text-sm text-mid-gray py-4 text-center">No region completions recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {adminData.difficult_regions.map((reg) => (
                      <div key={reg.region_id} className="border-b border-warm-white/[0.04] pb-3 last:border-none">
                        <div className="flex justify-between items-center text-sm font-semibold text-warm-white">
                          <span className="font-mono text-gold">{reg.region_id}</span>
                          <span className="text-xs text-mid-gray">Completion rate: {Math.round(reg.completion_rate * 100)}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-mid-gray mt-1.5">
                          <span>Boss fail rate:</span>
                          <span className="font-mono text-red-500 font-bold">{Math.round(reg.boss_fail_rate * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bug Reports */}
        {activeTab === 'bugs' && adminData && (
          <div className="rounded-2xl border border-warm-white/[0.06] bg-deep-charcoal/40 p-6">
            <h2 className="font-display text-xl font-bold text-gold mb-6 flex items-center gap-2">
              <Bug size={18} />
              Realm Bug Reports & Feedback Logs
            </h2>
            {adminData.bug_reports.length === 0 ? (
              <p className="text-sm text-mid-gray py-8 text-center">No bug reports submitted. The realm is pristine! 🛡️</p>
            ) : (
              <div className="space-y-4">
                {adminData.bug_reports.map((report) => (
                  <div key={report.id} className="border border-warm-white/[0.06] rounded-xl p-5 bg-[#121212] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-gold/15 text-gold px-2.5 py-1 font-bold uppercase tracking-wider">
                          {report.category}
                        </span>
                        <span className="text-mid-gray">submitted by</span>
                        <strong className="text-warm-white font-semibold">{report.username}</strong>
                      </div>
                      <span className="text-mid-gray font-mono">{new Date(report.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-warm-white leading-relaxed">{report.description}</p>
                    {report.context_info && (
                      <details className="text-xs border-t border-warm-white/[0.04] pt-3">
                        <summary className="text-mid-gray hover:text-gold cursor-pointer font-bold uppercase tracking-wider select-none">
                          Technical Details (Agent, Screen, URL)
                        </summary>
                        <pre className="mt-2 rounded-lg bg-black/45 p-3 font-mono text-[10px] text-emerald overflow-x-auto">
                          {JSON.stringify(JSON.parse(report.context_info), null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
