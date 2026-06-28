import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { analyticsApi } from './services/analyticsApi';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LearningArena from './pages/LearningArena';
import LearningMap from './pages/LearningMap';
import Quests from './pages/Quests';
import Achievements from './pages/Achievements';
import InventoryPage from './pages/InventoryPage';
import LessonPlayer from './features/lessons/LessonPlayer';
import RegionMap from './pages/RegionMap';
import BossBattleRouter from './features/boss/BossBattleRouter';
import GuildHall from './features/guild/GuildHall';
import OracleHub from './features/oracle/OracleHub';
import TowerHub from './features/tower/TowerHub';
import { useAuthStore } from './store/authStore';
import { Atmosphere } from './components/ui/Atmosphere';
import { TriggerEngine } from './engine/TriggerEngine';

// PyQuest Migrated Pages
import HomePage from './pages/HomePage';
import WorldMapPage from './pages/WorldMapPage';
import LessonPage from './pages/LessonPage';
import LessonChallengePage from './pages/LessonChallengePage';
import LibraryPage from './pages/LibraryPage';
import ArtifactsPage from './pages/ArtifactsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MemoryVaultPage from './pages/MemoryVaultPage';
import { PlayerProvider } from './context/PlayerContext';
import Onboarding from './pages/Onboarding';
import BetaFeedbackPage from './pages/BetaFeedbackPage';

// Initialize the event triggers (achievements, artifacts, quests)
TriggerEngine.initialize();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (token) {
    return <Navigate to="/map" replace />;
  }
  return <>{children}</>;
};

function AnalyticsTracker() {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    analyticsApi.logEvent('session_started');
    const startTime = Date.now();

    const handleUnload = () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        const payload = JSON.stringify({
          event_type: 'session_ended',
          details: { duration_seconds: durationSeconds }
        });
        const baseUrl = import.meta.env.VITE_API_URL || '/api';
        const url = baseUrl.startsWith('http') 
          ? `${baseUrl}/analytics/event` 
          : `${window.location.origin}${baseUrl}/analytics/event`;
        
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenString}`
          },
          body: payload,
          keepalive: true
        }).catch(err => console.warn('Failed to send session ended beacon:', err));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload();
    };
  }, [token]);

  useEffect(() => {
    if (token) {
      analyticsApi.logEvent('page_view', { path: location.pathname });
    }
  }, [location.pathname, token]);

  return null;
}

function App() {
  return (
    <PlayerProvider>
      <Atmosphere />
      <div className="relative z-10 min-h-screen">
        <Router>
          <AnalyticsTracker />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Landing Page (Accessible by both logged in and logged out users) */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />

            {/* PyQuest Core UI Routes (Private) */}
            <Route path="/map" element={<PrivateRoute><WorldMapPage /></PrivateRoute>} />
            <Route path="/lesson/:regionId/:lessonId" element={<PrivateRoute><LessonPage /></PrivateRoute>} />
            <Route path="/training/:regionId" element={<PrivateRoute><LessonChallengePage /></PrivateRoute>} />
            <Route path="/challenge/:regionId/:lessonId" element={<PrivateRoute><LessonChallengePage /></PrivateRoute>} />
            <Route path="/library" element={<PrivateRoute><LibraryPage /></PrivateRoute>} />
            <Route path="/artifacts" element={<PrivateRoute><ArtifactsPage /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
            <Route path="/vault" element={<PrivateRoute><MemoryVaultPage /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
            <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/beta-feedback" element={<PrivateRoute><BetaFeedbackPage /></PrivateRoute>} />

            {/* Legacy Arambh Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/learning-map" element={<PrivateRoute><LearningMap /></PrivateRoute>} />
            <Route path="/region/:regionId" element={<PrivateRoute><RegionMap /></PrivateRoute>} />
            <Route path="/region/:regionId/boss" element={<PrivateRoute><BossBattleRouter /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
            <Route path="/quests" element={<PrivateRoute><Quests /></PrivateRoute>} />
            <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
            <Route path="/guild" element={<PrivateRoute><GuildHall /></PrivateRoute>} />
            <Route path="/oracle" element={<PrivateRoute><OracleHub /></PrivateRoute>} />
            <Route path="/tower" element={<PrivateRoute><TowerHub /></PrivateRoute>} />
            <Route path="/arena" element={<PrivateRoute><LearningArena /></PrivateRoute>} />
            <Route path="/legacy-lesson/:lessonId" element={<LessonPlayer />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </PlayerProvider>
  );
}

export default App;

