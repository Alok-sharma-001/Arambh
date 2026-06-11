import React from 'react';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden min-w-0 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 pt-20 lg:pt-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
