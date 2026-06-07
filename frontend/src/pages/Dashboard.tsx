import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { User, Trophy, Brain, Flame, Play } from 'lucide-react';

export default function Dashboard() {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    intelligence: 10,
    streak: 0,
    username: 'Explorer'
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/progress/me');
        setStats(prev => ({ ...prev, ...response.data }));
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };

    fetchStats();
  }, [token, navigate]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Player HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Level {stats.level}</p>
            <p className="text-xl font-bold text-white">{stats.username}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total XP</p>
            <p className="text-xl font-bold text-white">{stats.xp}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
            <Brain size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Intelligence</p>
            <p className="text-xl font-bold text-white">{stats.intelligence}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Streak</p>
            <p className="text-xl font-bold text-white">{stats.streak} Days</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Master Python Through Visual Adventures</h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          Start your journey into the variables and memory module.
          Visualize how Python handles data in real-time.
        </p>
        <button
          onClick={() => navigate('/arena')}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg flex items-center space-x-2 mx-auto transition-transform hover:scale-105"
        >
          <Play size={24} fill="currentColor" />
          <span>Enter Learning Arena</span>
        </button>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={logout}
          className="text-slate-500 hover:text-white text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
