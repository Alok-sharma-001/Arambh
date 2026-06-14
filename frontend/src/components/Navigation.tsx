import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, LogOut } from 'lucide-react';

const navLinks = [
  { label: 'World Map', path: '/map' },
  { label: 'Training Ground', path: '/training/loops-desert' },
  { label: 'Library', path: '/library' },
  { label: 'Artifacts', path: '/artifacts' },
  { label: 'Leaderboard', path: '/leaderboard' },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { player } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-[72px] bg-near-black/80 backdrop-blur-xl border-b border-warm-white/[0.06]">
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">
          {/* Brand */}
          <Link to="/" className="font-mono text-sm font-bold tracking-[0.2em] text-gold hover:opacity-80 transition-opacity">
            PYQUEST
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
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

          {/* Right Side Actions */}
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-warm-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-near-black/95 backdrop-blur-xl border-t border-warm-white/[0.06] px-6 py-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-warm-white hover:text-gold transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4 border-t border-warm-white/[0.06]">
              {token ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                    <span className="font-mono text-[0.625rem] font-bold text-near-black">{player.level}</span>
                  </div>
                  <span className="font-mono text-sm text-gold">{player.totalXP.toLocaleString()} XP</span>
                </>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <Link to="/login" className="text-center text-sm font-medium text-warm-white hover:text-gold border border-warm-white/20 py-2 rounded" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="text-center text-sm font-bold text-near-black bg-gold py-2 rounded" onClick={() => setMenuOpen(false)}>
                    Join Guild
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>

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
