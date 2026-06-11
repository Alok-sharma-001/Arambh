import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LearningArena from './pages/LearningArena';
import LearningMap from './pages/LearningMap';
import Quests from './pages/Quests';
import Achievements from './pages/Achievements';
import { useAuthStore } from './store/authStore';
import { Atmosphere } from './components/ui/Atmosphere';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Atmosphere />
      <div className="relative z-10 min-h-screen">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Private Routes */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/learning-map" element={<PrivateRoute><LearningMap /></PrivateRoute>} />
            <Route path="/quests" element={<PrivateRoute><Quests /></PrivateRoute>} />
            <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
            <Route path="/arena" element={<PrivateRoute><LearningArena /></PrivateRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
