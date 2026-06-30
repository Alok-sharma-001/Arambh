import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { syncApi } from '../services/syncApi';
import { analyticsApi } from '../services/analyticsApi';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lampOn, setLampOn] = useState(false);
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

      // Log signup telemetry
      try {
        await analyticsApi.logEvent('signup_completed', { username });
      } catch (e) {
        console.warn('Telemetry event logging failed', e);
      }

      window.location.href = '/onboarding';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-body flex items-center justify-center">
      
      {/* Prompt text at top */}
      <AnimatePresence>
        {!lampOn && (
          <motion.p
            className="absolute top-12 left-1/2 -translate-x-1/2 text-zinc-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono z-30 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            Pull the string to toggle sign up
          </motion.p>
        )}
      </AnimatePresence>

      {/* ─── Main Layout: Lamp (left) + Form (right) ─── */}
      <div className="relative flex flex-col md:flex-row items-center md:items-end justify-center gap-4 md:gap-0 w-full max-w-4xl mx-auto px-4 md:px-8">
        
        {/* ─── Desk Lamp (left side) ─── */}
        <div className="relative flex-shrink-0 flex flex-col items-center md:items-end z-20 md:mr-[-40px]"
          style={{ minHeight: '380px' }}
        >
          {/* Lamp shade + bulb area */}
          <button
            onClick={() => setLampOn(!lampOn)}
            className="relative cursor-pointer focus:outline-none group"
            aria-label="Toggle lamp"
          >
            {/* Lamp Arm (angled) */}
            <div className="flex flex-col items-center">
              {/* Shade */}
              <div className="relative">
                <div
                  className="w-36 h-16 sm:w-44 sm:h-20 rounded-b-[55%] border-b-2 border-x-2 transition-all duration-700"
                  style={{
                    borderColor: lampOn ? 'rgba(255,232,219,0.5)' : 'rgba(63,63,70,0.6)',
                    background: lampOn
                      ? 'linear-gradient(180deg, rgba(55,45,35,0.95), rgba(65,52,38,0.9))'
                      : 'linear-gradient(180deg, rgba(35,35,35,0.95), rgba(22,22,22,0.9))',
                    boxShadow: lampOn ? '0 10px 50px rgba(255,232,219,0.2)' : 'none',
                  }}
                />
                {/* Bulb */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <motion.div
                    className="w-6 h-6 rounded-full"
                    animate={{
                      backgroundColor: lampOn ? '#FFE8DB' : '#27272a',
                      boxShadow: lampOn
                        ? '0 0 40px 15px rgba(255,232,219,0.7), 0 0 100px 40px rgba(255,232,219,0.25), 0 0 160px 60px rgba(255,232,219,0.1)'
                        : '0 0 0px 0px transparent',
                    }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </button>

          {/* Pull string */}
          <motion.div
            className="flex flex-col items-center mt-1 cursor-pointer z-10"
            onClick={() => setLampOn(!lampOn)}
            whileHover={{ y: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="w-[1px] bg-zinc-600" style={{ height: '32px' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-500 border border-zinc-400" />
          </motion.div>

          {/* Lamp neck (vertical pole) */}
          <div className="w-[3px] bg-gradient-to-b from-zinc-600 to-zinc-700 rounded-full" style={{ height: '200px' }} />

          {/* Lamp base */}
          <div className="relative mt-1">
            <div className="w-28 h-3 rounded-full bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700" />
            <div className="w-20 h-2 mx-auto mt-0.5 rounded-full bg-zinc-800" />
          </div>
        </div>

        {/* ─── Light Cone (from lamp toward the form) ─── */}
        <AnimatePresence>
          {lampOn && (
            <motion.div
              className="absolute pointer-events-none z-10"
              style={{
                left: '50%',
                top: '20%',
                transform: 'translateX(-30%)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div
                style={{
                  width: '600px',
                  height: '500px',
                  background: 'radial-gradient(ellipse 60% 80% at 20% 10%, rgba(255,232,219,0.1) 0%, rgba(255,232,219,0.04) 40%, transparent 70%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient warm glow on background */}
        <AnimatePresence>
          {lampOn && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="absolute"
                style={{
                  left: '20%',
                  top: '10%',
                  width: '80%',
                  height: '80%',
                  background: 'radial-gradient(ellipse at 30% 30%, rgba(255,232,219,0.06) 0%, transparent 60%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Register Form Card (right side, in the light) ─── */}
        <AnimatePresence>
          {lampOn && (
            <motion.div
              className="relative z-30 w-full max-w-sm md:ml-4"
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
              <div className="p-8 sm:p-9 bg-[#111111]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-warm-white/[0.08]">
                <h2 className="text-2xl font-display font-bold text-warm-white text-center">
                  Join the Guild
                </h2>
                <p className="mt-1 text-xs text-mid-gray text-center">Create an account to begin your Python quest</p>

                {error && (
                  <div className="mt-4 p-3 text-sm text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/20 rounded-lg">
                    {error}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-mid-gray mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-warm-white/10 rounded-lg focus:ring-1 focus:ring-[#FFE8DB] focus:border-[#FFE8DB] text-warm-white text-sm transition-colors placeholder:text-zinc-600"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-mid-gray mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-warm-white/10 rounded-lg focus:ring-1 focus:ring-[#FFE8DB] focus:border-[#FFE8DB] text-warm-white text-sm transition-colors placeholder:text-zinc-600"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-mid-gray mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-warm-white/10 rounded-lg focus:ring-1 focus:ring-[#FFE8DB] focus:border-[#FFE8DB] text-warm-white text-sm transition-colors placeholder:text-zinc-600"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3.5 font-bold text-near-black bg-[#FFE8DB] rounded-lg hover:bg-[#f5d8c8] hover:shadow-gold-glow transition-all duration-300 focus:outline-none uppercase tracking-wider text-sm"
                  >
                    Create Character
                  </button>
                </form>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-warm-white/[0.06]" />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-warm-white/[0.06]" />
                </div>

                <button
                  type="button"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border border-warm-white/10 rounded-lg text-sm text-mid-gray hover:text-warm-white hover:border-warm-white/20 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <p className="mt-5 text-center text-xs text-mid-gray">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#FFE8DB] hover:underline font-medium">
                    Return to the Quest
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
