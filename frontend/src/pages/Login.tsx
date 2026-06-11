import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
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
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0D0D12] via-[#13131A] to-indigo-900/20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-game-purple/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-center text-white">Login to Arambh</h1>
        {error && <div className="p-3 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 mt-1 bg-slate-700 border border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 bg-slate-700 border border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
