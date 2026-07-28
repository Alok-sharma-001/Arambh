import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { analyticsApi } from './services/analyticsApi';
import { useAuthStore } from './store/authStore';
import { Atmosphere } from './components/ui/Atmosphere';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppCrashFallback } from './components/ui/AppCrashFallback';
import { TriggerEngine } from './engine/TriggerEngine';
import { PlayerProvider } from './context/PlayerContext';

// Core Progression
import { ProgressEngine } from './core/progression/ProgressEngine';
import { setGlobalNavigate } from './core/progression/NavigationService';

// Lazy Loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const LearningArena = lazy(() => import('./pages/LearningArena'));
const Quests = lazy(() => import('./pages/Quests'));
const Achievements = lazy(() => import('./pages/Achievements'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const GuildHall = lazy(() => import('./features/guild/GuildHall'));
const OracleHub = lazy(() => import('./features/oracle/OracleHub'));
const TowerHub = lazy(() => import('./features/tower/TowerHub'));

const HomePage = lazy(() => import('./pages/HomePage'));
const WorldMapPage = lazy(() => import('./pages/WorldMapPage'));
const RegionMap = lazy(() => import('./pages/RegionMap'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const LessonChallengePage = lazy(() => import('./pages/LessonChallengePage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const ArtifactsPage = lazy(() => import('./pages/ArtifactsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const MemoryVaultPage = lazy(() => import('./pages/MemoryVaultPage'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const BetaFeedbackPage = lazy(() => import('./pages/BetaFeedbackPage'));
const BossBattleRouter = lazy(() => import('./features/boss/BossBattleRouter'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const PlacementTest = lazy(() => import('./pages/PlacementTest'));
const CertificatePage = lazy(() => import('./pages/CertificatePage'));

// Initialize the event triggers (achievements, artifacts, quests)
TriggerEngine.initialize();

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
      <p className="font-mono text-sm text-amber-500/80 tracking-widest uppercase">Loading Realm...</p>
    </div>
  </div>
);

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
      
      const path = location.pathname;
      if (path === '/world-map' || (path.startsWith('/region/') && !path.includes('/boss'))) {
        sessionStorage.setItem('arambh_source_route', path);
      }
    }
  }, [location.pathname, token]);

  return null;
}

function ProgressEngineInitializer() {
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate);
    ProgressEngine.init();
  }, [navigate]);

  return null;
}

function App() {
  return (
    <PlayerProvider>
      <Atmosphere />
      <div className="relative z-10 min-h-screen">
        <Router>
          <AnalyticsTracker />
          <ProgressEngineInitializer />
          <ErrorBoundary fallback={<AppCrashFallback />}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                {/* Landing Page */}
                <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />

                {/* PyQuest Core UI Routes (Private) */}
                <Route path="/kingdom" element={<Navigate to="/world-map" replace />} />
                <Route path="/world-map" element={<PrivateRoute><WorldMapPage /></PrivateRoute>} />
                <Route path="/region/:regionId" element={<PrivateRoute><RegionMap /></PrivateRoute>} />
                <Route path="/lesson/:lessonId" element={<PrivateRoute><LessonPage /></PrivateRoute>} />
                <Route path="/lesson/:regionId/:lessonId" element={<PrivateRoute><LessonPage /></PrivateRoute>} />
                <Route path="/boss/:regionId" element={<PrivateRoute><BossBattleRouter /></PrivateRoute>} />
                <Route path="/region/:regionId/boss" element={<Navigate to="/boss/:regionId" replace />} />
                <Route path="/training/:regionId" element={<PrivateRoute><LessonChallengePage /></PrivateRoute>} />
                <Route path="/challenge/:regionId/:lessonId" element={<PrivateRoute><LessonChallengePage /></PrivateRoute>} />
                
                <Route path="/library" element={<PrivateRoute><LibraryPage /></PrivateRoute>} />
                <Route path="/artifacts" element={<PrivateRoute><ArtifactsPage /></PrivateRoute>} />
                <Route path="/leaderboard" element={<PrivateRoute><LeaderboardPage /></PrivateRoute>} />
                <Route path="/vault" element={<PrivateRoute><MemoryVaultPage /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
                <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
                <Route path="/beta-feedback" element={<PrivateRoute><BetaFeedbackPage /></PrivateRoute>} />
                <Route path="/pricing" element={<PrivateRoute><PricingPage /></PrivateRoute>} />
                <Route path="/placement-test" element={<PrivateRoute><PlacementTest /></PrivateRoute>} />
                <Route path="/certificate" element={<PrivateRoute><CertificatePage /></PrivateRoute>} />
                <Route path="/certificate/verify/:certId" element={<CertificatePage />} />

                {/* Legacy Map Redirections */}
                <Route path="/map" element={<Navigate to="/world-map" replace />} />
                <Route path="/learning-map" element={<Navigate to="/world-map" replace />} />
                <Route path="/legacy-lesson/:lessonId" element={<Navigate to="/world-map" replace />} />

                {/* Other Arambh Private Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
                <Route path="/quests" element={<PrivateRoute><Quests /></PrivateRoute>} />
                <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
                <Route path="/guild" element={<PrivateRoute><GuildHall /></PrivateRoute>} />
                <Route path="/oracle" element={<PrivateRoute><OracleHub /></PrivateRoute>} />
                <Route path="/tower" element={<PrivateRoute><TowerHub /></PrivateRoute>} />
                <Route path="/arena" element={<PrivateRoute><LearningArena /></PrivateRoute>} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Router>
      </div>
    </PlayerProvider>
  );
}

export default App;
