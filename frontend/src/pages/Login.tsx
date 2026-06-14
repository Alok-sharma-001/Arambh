import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { syncApi } from '../services/syncApi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      setToken(response.data.access_token);
      
      // Pull state from cloud
      try {
        const cloudState = await syncApi.pullState();
        if (cloudState.stats) {
          localStorage.setItem('pyquest_progression', JSON.stringify({
            stats: cloudState.stats,
            inventory: cloudState.inventory
          }));
        }
        if (cloudState.knowledge_graph) {
          localStorage.setItem('pyquest_knowledge_graph', JSON.stringify({
            state: { graph: cloudState.knowledge_graph },
            version: 0
          }));
        }
        if (cloudState.tower_progress) {
          localStorage.setItem('pyquest_tower_progress', JSON.stringify({
            state: { progress: cloudState.tower_progress, activeStreak: 0 },
            version: 0
          }));
        }
        if (cloudState.regions && cloudState.regions.length > 0) {
          // A proper region hydration would merge state, but for now we reload
          // The regionStore needs an update if we want to hydrate it via local storage
        }
      } catch (e) {
        console.warn('Failed to pull state upon login', e);
      }
      
      // Force reload to re-hydrate stores
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-near-black relative overflow-hidden font-body">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-royal-purple/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 w-full max-w-md p-10 space-y-8 bg-[#121212]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-warm-white/[0.06]">
        <div className="text-center">
          <h1 className="text-4xl font-black font-display text-warm-white tracking-tight">Return to the Quest</h1>
          <p className="mt-2 text-sm text-mid-gray">Enter your credentials to continue your journey.</p>
        </div>
        
        {error && <div className="p-3 text-sm text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/20 rounded-lg">{error}</div>}
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-mid-gray mb-1.5">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-[#0a0908] border border-warm-white/10 rounded-lg focus:ring-1 focus:ring-gold focus:border-gold text-warm-white transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-mid-gray mb-1.5">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-[#0a0908] border border-warm-white/10 rounded-lg focus:ring-1 focus:ring-gold focus:border-gold text-warm-white transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3.5 mt-2 font-bold text-near-black bg-gold rounded-lg hover:bg-[#d4b76e] hover:shadow-gold-glow transition-all duration-300 focus:outline-none uppercase tracking-wider text-sm"
          >
            Enter Realm
          </button>
        </form>
        <p className="text-center text-sm text-mid-gray">
          Don't have an account? <Link to="/register" className="text-gold hover:underline font-medium">Join the Guild</Link>
        </p>
      </div>
    </div>
  );
}
