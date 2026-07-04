import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Home, MapPin, Swords, BookOpen, Brain, Trophy, Flame, Sparkles } from 'lucide-react';
import { useTour } from '../context/TourContext';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'World Map', path: '/map' },
  { label: 'Training', path: '/training/loops-desert' },
  { label: 'Library', path: '/library' },
  { label: 'Vault', path: '/vault' },
  { label: 'Artifacts', path: '/artifacts' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Dashboard', path: '/dashboard' },
];

const mobileTabItems = [
  { label: 'Map', path: '/map', icon: MapPin },
  { label: 'Train', path: '/training/loops-desert', icon: Swords },
  { label: 'Library', path: '/library', icon: BookOpen },
  { label: 'Vault', path: '/vault', icon: Brain },
  { label: 'Home', path: '/dashboard', icon: Home },
];

export default function Navigation() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { player } = usePlayer();
  const { startTour } = useTour();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const username = (() => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64)).sub || null;
    } catch {
      return null;
    }
  })();

  const isAdmin = username === 'founder' || username === 'admin';
  const visibleLinks = isAdmin 
    ? [...navLinks, { label: 'Founder', path: '/admin' }]
    : navLinks;

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  return (
    <>
      {/* ─── Top Navigation Bar ─── */}
      <nav id="navigation-bar" className="fixed top-0 left-0 right-0 z-40 h-[56px] bg-black/60 backdrop-blur-xl border-b border-warm-white/10">
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/" className="font-mono text-sm font-bold tracking-[0.2em] text-gold hover:opacity-80 transition-opacity">
            PYQUEST
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 h-full">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path === '/map' && location.pathname.startsWith('/map')) ||
                (link.path.startsWith('/training') && location.pathname.startsWith('/training'));
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`relative h-full flex items-center text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
                    isActive ? 'text-gold' : 'text-warm-white/70 hover:text-gold'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold shadow-[0_0_8px_rgba(255,232,219,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions (desktop) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {token ? (
              <div className="flex items-center gap-4 lg:gap-6">
                {/* Flame Streak Indicator */}
                <div id="streak-counter" className="flex items-center gap-1.5 text-amber-500 font-mono text-[11px]" title="Daily Streak">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  <span className="font-bold">3</span>
                </div>

                {/* Level / XP Tracker */}
                <div id="xp-badge" className="flex items-center gap-2 border-l border-warm-white/10 pl-4 lg:pl-6">
                  {/* Level Circle */}
                  <div className="w-4.5 h-4.5 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10" title="Level">
                    <span className="font-mono text-[9px] font-bold text-gold">{player.level}</span>
                  </div>
                  {/* XP */}
                  <span className="font-mono text-[11px] text-gold/80 tabular-nums">{player.totalXP.toLocaleString()} XP</span>
                </div>

                {/* Minimal Utility Icons */}
                <div className="flex items-center gap-3 border-l border-warm-white/10 pl-4 lg:pl-6">
                  <button 
                    onClick={startTour}
                    className="text-mid-gray hover:text-gold transition-colors p-1"
                    title="Tour Guide"
                  >
                    <Sparkles size={14} />
                  </button>
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-mid-gray hover:text-warm-white transition-colors p-1"
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-xs font-semibold text-warm-white/80 hover:text-gold transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-xs font-bold text-near-black bg-gold px-3.5 py-1.5 rounded-lg hover:bg-[#d4b76e] transition-colors shadow-sm">
                  Join Guild
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Streak + XP badge + logout (top right, no hamburger) */}
          <div className="md:hidden flex items-center gap-3">
            {token ? (
              <>
                {/* Mobile Streak */}
                <div id="streak-counter-mobile" className="flex items-center gap-1 text-amber-500 font-mono text-xs">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="font-bold">3</span>
                </div>

                {/* Level / XP */}
                <div id="xp-badge-mobile" className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10">
                    <span className="font-mono text-[9px] font-bold text-gold">{player.level}</span>
                  </div>
                  <span className="font-mono text-[11px] text-gold/80 tabular-nums">{player.totalXP.toLocaleString()}</span>
                </div>

                {/* Minimal Icons for Mobile Top Nav */}
                <button 
                  onClick={startTour}
                  className="text-mid-gray hover:text-gold transition-colors p-1"
                  title="Tour Guide"
                >
                  <Sparkles size={15} />
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-mid-gray hover:text-warm-white transition-colors p-1"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-xs font-bold text-near-black bg-gold px-3 py-1.5 rounded">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      {token && (
        <div id="navigation-bar" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070708]/98 backdrop-blur-xl border-t border-warm-white/[0.06] pb-[env(safe-area-inset-bottom,0px)]">
          <div className="flex items-center justify-around h-16 px-1">
            {mobileTabItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/map' && location.pathname.startsWith('/map')) ||
                (item.path === '/training/loops-desert' && location.pathname.startsWith('/training'));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex flex-1 flex-col items-center justify-center h-14 relative group select-none"
                  style={{ minWidth: '48px' }}
                >
                  {/* Active indicator pill (animated with framer-motion) */}
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-active-tab-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-gold shadow-[0_0_10px_rgba(255,232,219,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon
                    size={19}
                    className={`transition-all duration-200 ${
                      isActive ? 'text-gold scale-105' : 'text-zinc-500 hover:text-zinc-400'
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider mt-1 transition-colors duration-200 ${
                      isActive ? 'text-gold' : 'text-zinc-500 group-hover:text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-near-black/80 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-[#121212] border border-warm-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-display font-bold text-warm-white mb-2">Leave the Realm?</h3>
            <p className="text-mid-gray mb-8">Are you sure you want to log out? Your progress is safely saved in the cloud.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-warm-white/10 text-warm-white font-medium hover:bg-warm-white/5 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-3 rounded-lg bg-gold text-near-black font-bold hover:bg-[#d4b76e] hover:shadow-gold-glow transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
