import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { syncApi } from '../services/syncApi';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { username, email, password });
      
      // Auto-login after registration
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      const loginRes = await api.post('/auth/login', formData);
      setToken(loginRes.data.access_token);

      // Migrate existing local progress to cloud
      try {
        const localProgression = localStorage.getItem('pyquest_progression');
        const localKnowledge = localStorage.getItem('pyquest_knowledge_graph');
        const localTower = localStorage.getItem('pyquest_tower_progress');
        
        let kgPayload = undefined;
        if (localKnowledge) {
          try {
            const parsedKg = JSON.parse(localKnowledge);
            if (parsedKg?.state?.graph) {
              kgPayload = parsedKg.state.graph;
            }
          } catch(e) {}
        }
        
        let towerPayload = undefined;
        if (localTower) {
          try {
            const parsedTp = JSON.parse(localTower);
            if (parsedTp?.state?.progress) {
              towerPayload = parsedTp.state.progress;
            }
          } catch(e) {}
        }
        
        if (localProgression) {
          const parsed = JSON.parse(localProgression);
          await syncApi.migrateState({
            timestamp: new Date().toISOString(),
            stats: parsed.stats,
            inventory: parsed.inventory || [],
            lessons: [],
            regions: [],
            knowledge_graph: kgPayload,
            tower_progress: towerPayload
          });
        }
      } catch (e) {
        console.warn('Migration failed', e);
      }

      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
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
          <h1 className="text-4xl font-black font-display text-warm-white tracking-tight">Join the Guild</h1>
          <p className="mt-2 text-sm text-mid-gray">Create an account to begin your Python quest.</p>
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
            <label className="block text-xs font-semibold uppercase tracking-widest text-mid-gray mb-1.5">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-[#0a0908] border border-warm-white/10 rounded-lg focus:ring-1 focus:ring-gold focus:border-gold text-warm-white transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Create Character
          </button>
        </form>
        <p className="text-center text-sm text-mid-gray">
          Already have an account? <Link to="/login" className="text-gold hover:underline font-medium">Return to the Quest</Link>
        </p>
      </div>
    </div>
  );
}
