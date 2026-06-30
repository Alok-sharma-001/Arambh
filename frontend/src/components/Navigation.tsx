import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, LogOut, MapPin, Swords, BookOpen, Brain, Trophy } from 'lucide-react';

const navLinks = [
  { label: 'World Map', path: '/map' },
  { label: 'Training Ground', path: '/training/loops-desert' },
  { label: 'Library', path: '/library' },
  { label: 'Memory Vault', path: '/vault' },
  { label: 'Artifacts', path: '/artifacts' },
  { label: 'Leaderboard', path: '/leaderboard' },
];

const mobileTabItems = [
  { label: 'Map', path: '/map', icon: MapPin },
  { label: 'Train', path: '/training/loops-desert', icon: Swords },
  { label: 'Library', path: '/library', icon: BookOpen },
  { label: 'Vault', path: '/vault', icon: Brain },
  { label: 'Board', path: '/leaderboard', icon: Trophy },
];

export default function Navigation() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { player } = usePlayer();
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
    ? [...navLinks, { label: 'Founder Dashboard', path: '/admin' }]
    : navLinks;

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  return (
    <>
      {/* ─── Top Navigation Bar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-[72px] bg-near-black/80 backdrop-blur-xl border-b border-warm-white/[0.06]">
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">
          {/* Brand */}
          <Link to="/" className="font-mono text-sm font-bold tracking-[0.2em] text-gold hover:opacity-80 transition-opacity">
            PYQUEST
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {visibleLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-gold' : 'text-warm-white hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center animate-level-pulse">
                    <span className="font-mono text-[0.625rem] font-bold text-near-black">{player.level}</span>
                  </div>
                  <span className="font-mono text-sm text-gold tabular-nums">{player.totalXP.toLocaleString()} XP</span>
                </div>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-mid-gray hover:text-warm-white transition-colors p-2"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-warm-white hover:text-gold transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm font-bold text-near-black bg-gold px-4 py-2 rounded hover:bg-[#d4b76e] transition-colors">
                Join Guild
              </Link>
            </>
          )}
        </div>

          {/* Mobile: XP badge + logout (top right, no hamburger) */}
          <div className="md:hidden flex items-center gap-3">
            {token ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center">
                    <span className="font-mono text-[0.5rem] font-bold text-near-black">{player.level}</span>
                  </div>
                  <span className="font-mono text-xs text-gold tabular-nums">{player.totalXP.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-mid-gray hover:text-warm-white transition-colors p-1"
                  title="Sign Out"
                >
                  <LogOut size={16} />
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
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-warm-white/[0.06] safe-area-bottom">
          <div className="flex items-center justify-around h-16 px-2">
            {mobileTabItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/map' && location.pathname.startsWith('/map')) ||
                (item.path === '/training/loops-desert' && location.pathname.startsWith('/training'));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-1 py-1 px-3 relative"
                >
                  {/* Active indicator pill */}
                  {isActive && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-gold" />
                  )}
                  <item.icon
                    size={20}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-gold' : 'text-zinc-500'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-gold' : 'text-zinc-500'
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
