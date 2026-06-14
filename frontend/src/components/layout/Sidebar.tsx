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
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Learning Map', path: '/learning-map', icon: MapIcon },
  { name: 'Inventory', path: '/inventory', icon: Grid },
  { name: 'Quests', path: '/quests', icon: Target },
  { name: 'Achievements', path: '/achievements', icon: Trophy },
  { name: 'Learning Arena', path: '/arena', icon: Code2 },
  { name: 'Guild Realms', path: '/guild', icon: Users },
  { name: 'Oracle Hub', path: '/oracle', icon: BrainCircuit },
  { name: 'Infinite Tower', path: '/tower', icon: TowerControl },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setToken = useAuthStore((state) => state.setToken);
  
  const isLessonRoute = location.pathname.includes('/lesson/');

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0D0D12]/60 backdrop-blur-3xl border-r border-[#181820] text-slate-300 w-64 shadow-2xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-game-purple to-indigo-600 flex items-center justify-center shadow-lg shadow-game-purple/20">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          PyQuest
        </span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-game-purple/10 text-game-purple font-semibold shadow-inner' 
                  : 'hover:bg-[#13131A] hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-8 bg-game-purple rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#181820] space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-[#13131A] transition-all duration-200 group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          <span>Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Logout</span>
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
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#13131A] border border-[#181820] rounded-lg text-white shadow-lg"
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
            className="lg:hidden fixed inset-0 z-40 bg-[#0D0D12]/80 backdrop-blur-sm"
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
        <div className="h-full lg:hidden block w-64 bg-[#0D0D12] absolute left-0 top-0">
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
