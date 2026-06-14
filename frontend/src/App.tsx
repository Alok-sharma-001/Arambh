import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
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
import { PlayerProvider } from './context/PlayerContext';

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
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <PlayerProvider>
      <Atmosphere />
      <div className="relative z-10 min-h-screen">
        <Router>
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

