import React from 'react';
import Navigation from '../Navigation';
import Footer from '../Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ToastProvider } from '../ui/ToastProvider';
import { AutoSync } from '../sync/AutoSync';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-100 font-sans selection:bg-game-purple/30">
      <Navigation />
      <ToastProvider />
      <AutoSync />
      <main className="flex-1 overflow-x-hidden min-w-0 flex flex-col relative mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};
