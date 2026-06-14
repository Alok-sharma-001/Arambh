import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const learnLinks = [
  { label: 'World Map', path: '/map' },
  { label: 'Training Ground', path: '/training/loops-desert' },
  { label: 'Practice', path: '/training/loops-desert' },
  { label: 'Knowledge Library', path: '/library' },
];

const communityLinks = [
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Artifacts', path: '/artifacts' },
  { label: 'Guilds', path: '#' },
  { label: 'AI Mentor', path: '#' },
];

const accountLinks = [
  { label: 'Profile', path: '#' },
  { label: 'Settings', path: '#' },
  { label: 'Sign Out', path: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-near-black border-t border-warm-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="font-mono text-xl font-bold tracking-[0.2em] text-gold">PYQUEST</span>
            <p className="mt-3 font-display italic text-mid-gray text-base">Where Code Becomes Legend</p>
            <p className="mt-2 text-mid-gray text-sm">Master Python. Unlock Your Power.</p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-mid-gray mb-4">Learn</h4>
            <ul className="space-y-3">
              {learnLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-warm-white text-sm hover:text-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-mid-gray mb-4">Community</h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-warm-white text-sm hover:text-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-mid-gray mb-4">Account</h4>
            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-warm-white text-sm hover:text-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-warm-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-mid-gray text-xs">2026 PyQuest. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-mid-gray hover:text-gold transition-colors" aria-label="GitHub">
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
