import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { syncApi } from '../services/syncApi';
import { analyticsApi } from '../services/analyticsApi';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lampOn, setLampOn] = useState(true);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    try {
      const response = await api.post(
        '/auth/google',
        { id_token: idToken },
        { withCredentials: true }
      );
      if (response.data.user) {
        setUser(response.data.user);
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google registration failed');
    }
  };

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
      setUser({ username });

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

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const formData = new FormData();
      formData.append('username', 'google_mage');
      formData.append('password', 'google_password123');

      try {
        const response = await api.post('/auth/login', formData);
        setToken(response.data.access_token);
      } catch (loginErr) {
        await api.post('/auth/register', {
          username: 'google_mage',
          email: 'google_mage@arambh.com',
          password: 'google_password123'
        });
        const response = await api.post('/auth/login', formData);
        setToken(response.data.access_token);
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google authentication failed');
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
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 w-full max-w-4xl mx-auto px-4 md:px-8 z-10">
        
        {/* ─── Desk Lamp (left side) ─── */}
        <div className="relative flex-shrink-0 z-40 select-none">
          <svg
            width="280"
            height="460"
            viewBox="0 0 280 460"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
          >
            {/* Gradients */}
            <defs>
              {/* Gold/Brass metallic shine */}
              <linearGradient id="brass" x1="0" y1="0" x2="280" y2="460" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E6C687" />
                <stop offset="25%" stopColor="#F9E8C7" />
                <stop offset="50%" stopColor="#C59B4B" />
                <stop offset="75%" stopColor="#E6C687" />
                <stop offset="100%" stopColor="#8A6421" />
              </linearGradient>

              {/* Matte Black textured shadow */}
              <linearGradient id="dark-metal" x1="0" y1="0" x2="280" y2="460" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#333336" />
                <stop offset="40%" stopColor="#1E1E20" />
                <stop offset="70%" stopColor="#121214" />
                <stop offset="100%" stopColor="#08080A" />
              </linearGradient>

              {/* Warm internal reflector glow */}
              <radialGradient id="reflector-glow" cx="60%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF2E6" />
                <stop offset="40%" stopColor="#FFD9B3" />
                <stop offset="85%" stopColor="#D4A373" />
                <stop offset="100%" stopColor="#8A5A36" />
              </radialGradient>

              {/* Glowing light cone */}
              <linearGradient id="light-cone" x1="160" y1="130" x2="350" y2="400" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE8DB" stopOpacity="0.4" />
                <stop offset="20%" stopColor="#FFE8DB" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#FFE8DB" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FFE8DB" stopOpacity="0" />
              </linearGradient>

              {/* Soft blur for the light rays */}
              <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="16" result="blur" />
              </filter>
            </defs>

            {/* Glowing Light Cone (Behind lamp) */}
            <AnimatePresence>
              {lampOn && (
                <motion.polygon
                  points="160,130 550,220 550,480 100,480"
                  fill="url(#light-cone)"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  filter="url(#soft-glow)"
                  style={{ mixBlendMode: 'screen' }}
                />
              )}
            </AnimatePresence>

            {/* ─── Lamp Base ─── */}
            <g id="lamp-base">
              {/* Bottom rubber base */}
              <path d="M 60 435 Q 125 425 190 435 L 195 442 Q 125 450 55 442 Z" fill="#0A0A0B" />
              {/* Brass base cover */}
              <path d="M 62 430 Q 125 418 188 430 L 191 436 Q 125 444 59 436 Z" fill="url(#brass)" stroke="#6E5019" strokeWidth="0.5" />
              {/* Base top ridge */}
              <path d="M 80 422 Q 125 414 170 422 L 175 428 Q 125 434 75 428 Z" fill="url(#dark-metal)" />
              <path d="M 80 422 Q 125 414 170 422" stroke="url(#brass)" strokeWidth="1" fill="none" />
            </g>

            {/* ─── Stand Structure ─── */}
            {/* Lower Stand Arm */}
            <g id="lower-arm">
              {/* Brass hinge joint at base */}
              <circle cx="125" cy="414" r="9" fill="url(#brass)" stroke="#6E5019" strokeWidth="0.5" />
              <circle cx="125" cy="414" r="4" fill="#1E1E20" />
              {/* Matte black main stand rod */}
              <line x1="125" y1="414" x2="110" y2="220" stroke="url(#dark-metal)" strokeWidth="8" strokeLinecap="round" />
              <line x1="123" y1="414" x2="108" y2="220" stroke="url(#brass)" strokeWidth="1.5" strokeOpacity="0.4" />
            </g>

            {/* Middle Joint */}
            <g id="middle-hinge">
              <circle cx="110" cy="220" r="8" fill="url(#brass)" stroke="#6E5019" strokeWidth="0.5" />
              <circle cx="110" cy="220" r="3" fill="#121214" />
            </g>

            {/* Upper curved arm */}
            <path d="M 110 220 Q 125 150 168 132" fill="none" stroke="url(#dark-metal)" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M 111 220 Q 126 150 169 132" fill="none" stroke="url(#brass)" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Shade Hinge Joint */}
            <circle cx="168" cy="132" r="6" fill="url(#brass)" stroke="#6E5019" strokeWidth="0.5" />

            {/* ─── Pull String (Interactive) ─── */}
            <motion.g
              className="cursor-pointer"
              onClick={() => setLampOn(!lampOn)}
              whileHover={{ y: 6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 12 }}
            >
              {/* Chain thread */}
              <line x1="150" y1="140" x2="150" y2="240" stroke="#71717A" strokeWidth="1.2" strokeDasharray="3,3" />
              {/* Brass pull cylinder */}
              <rect x="146.5" y="240" width="7" height="18" rx="2" fill="url(#brass)" stroke="#6E5019" strokeWidth="0.5" />
              {/* Tiny ring at string end */}
              <circle cx="150" cy="258" r="2.5" fill="url(#brass)" />
            </motion.g>

            {/* ─── Lamp Shade (Beautiful banker's style dome) ─── */}
            <g id="lamp-shade">
              {/* Inner golden glow reflector (changes styling based on lampOn) */}
              <path
                d="M 132 125 Q 170 100 208 125 L 218 142 Q 170 148 122 142 Z"
                fill={lampOn ? 'url(#reflector-glow)' : '#33241B'}
                stroke={lampOn ? '#FFD4B2' : '#22150E'}
                strokeWidth="0.5"
              />
              
              {/* Glowing Bulb */}
              <circle
                cx="170"
                cy="125"
                r="10"
                fill={lampOn ? '#FFFFFF' : '#333335'}
                style={{
                  filter: lampOn ? 'drop-shadow(0 0 12px #FFE8DB)' : 'none',
                }}
              />

              {/* Main Outer Dome */}
              <path
                d="M 125 125 Q 170 85 215 125 L 225 136 Q 170 142 115 136 Z"
                fill="url(#dark-metal)"
                stroke="#0A0A0C"
                strokeWidth="1"
              />

              {/* Brass rim accent */}
              <path d="M 115 136 Q 170 142 225 136" stroke="url(#brass)" strokeWidth="1.8" fill="none" />
            </g>
          </svg>
        </div>

        {/* Ambient warm glow overlay on whole scene */}
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
                className="absolute w-[80vw] h-[80vh] rounded-full blur-[120px]"
                style={{
                  left: '10%',
                  top: '10%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,232,219,0.08) 0%, transparent 70%)',
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

                <div className="mt-4 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google sign in failed')}
                    theme="filled_black"
                    shape="pill"
                  />
                </div>

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
