import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ToastProvider } from '../ui/ToastProvider';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100 font-sans selection:bg-game-purple/30">
      <Sidebar />
      <ToastProvider />
      <main className="flex-1 overflow-x-hidden min-w-0 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 pt-20 lg:pt-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
