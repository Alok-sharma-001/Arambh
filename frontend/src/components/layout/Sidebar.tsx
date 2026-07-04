import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Target, 
  Trophy, 
  Code2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Grid,
  Users,
  BrainCircuit,
  TowerControl
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { name: 'Learning Map', path: '/learning-map', icon: MapIcon },
  { name: 'Inventory', path: '/inventory', icon: Grid },
  { name: 'Quests', path: '/quests', icon: Target },
  { name: 'Achievements', path: '/achievements', icon: Trophy },
  { name: 'Learning Arena', path: '/arena', icon: Code2 },
  { name: 'Guild Realms', path: '/guild', icon: Users },
  { name: 'Oracle Hub', path: '/oracle', icon: BrainCircuit },
  { name: 'Infinite Tower', path: '/tower', icon: TowerControl },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  
  const isLessonRoute = location.pathname.includes('/lesson/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.22 } },
    closed: { x: '-100%', transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.22 } }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0A0A0A] border-r border-warm-white/10 text-slate-300 w-60 shadow-2xl">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-warm-white/10">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-[#d4b76e] flex items-center justify-center shadow-lg shadow-gold/10">
          <Code2 className="w-4 h-4 text-near-black" />
        </div>
        <span className="text-lg font-bold font-display tracking-wider text-warm-white">
          PyQuest
        </span>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-150 group relative text-sm
                ${isActive 
                  ? 'bg-gold/[0.06] text-gold font-semibold' 
                  : 'text-mid-gray/70 hover:bg-warm-white/[0.03] hover:text-warm-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 w-0.5 h-6 bg-gold rounded-r-full shadow-[0_0_10px_rgba(255,232,219,0.5)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-105 text-gold' : 'group-hover:scale-105'}`} />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-warm-white/10 space-y-1">
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-mid-gray/70 hover:text-warm-white hover:bg-warm-white/[0.03] transition-all duration-150 group">
          <Settings className="w-4 h-4 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          <span className="truncate">Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-150 group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isLessonRoute && (
        <button 
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 backdrop-blur-md border border-warm-white/10 rounded-lg text-white shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed lg:sticky top-0 left-0 z-40 h-screen"
      >
        <div className="h-full hidden lg:block">
           <SidebarContent />
        </div>
        <div className="h-full lg:hidden block w-64 bg-[#0A0A0A] absolute left-0 top-0">
           <SidebarContent />
        </div>
      </motion.aside>
      
      {/* Force sidebar open on desktop UNLESS we are in a lesson */}
      {!isLessonRoute && (
        <aside className="hidden lg:block sticky top-0 left-0 z-40 h-screen flex-shrink-0">
           <SidebarContent />
        </aside>
      )}
    </>
  );
};
