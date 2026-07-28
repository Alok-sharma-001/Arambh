import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, Mail, CheckCircle2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import api from '../../services/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setDemoOtp(res.data.otp_demo || '');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) return;

    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: email.trim(), otp: otp.trim() });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setStep(1);
        setSuccess(false);
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#0d0e12] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(200,164,94,0.15)] overflow-hidden text-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#13141c]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#c8a45e] font-serif">Account Recovery</h2>
                <p className="text-xs text-slate-400">Reset your password with OTP verification</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {success ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Password Reset Successful!</h3>
                <p className="text-xs text-slate-400 font-mono">You can now sign in with your new password.</p>
              </motion.div>
            ) : (
              <>
                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-mono transition-all ${
                        step === s
                          ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          : step > s
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {step > s ? '✓' : s}
                    </div>
                  ))}
                </div>

                {error && <div className="p-3 mb-4 bg-red-950/40 border border-red-500/40 rounded-xl text-red-400 text-xs font-mono">{error}</div>}

                {/* Step 1: Send OTP */}
                {step === 1 && (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Enter the email address registered with your Arambh account. We'll send you a 6-digit OTP verification code.
                    </p>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address or Username
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 text-slate-500" size={16} />
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. founder@arambh.com or warrior"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#14151e] border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'Sending OTP...' : <>Send Verification Code <ArrowRight size={14} /></>}
                    </button>
                  </form>
                )}

                {/* Step 2: Enter OTP */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      A 6-digit OTP code has been sent to <strong className="text-amber-400">{email}</strong>.
                    </p>

                    {demoOtp && (
                      <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-center space-y-1">
                        <span className="text-[11px] text-amber-400/80 font-mono uppercase tracking-wider block">Your Verification OTP Code:</span>
                        <span className="text-2xl font-mono font-black text-amber-400 tracking-widest">{demoOtp}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        6-Digit Verification OTP
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full text-center tracking-widest font-mono font-bold px-4 py-3 bg-[#14151e] border border-white/10 rounded-xl text-lg text-slate-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'Verifying Code...' : <>Verify Code <ShieldCheck size={14} /></>}
                    </button>
                  </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      OTP verified! Enter your new password below to update your account.
                    </p>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 bg-[#14151e] border border-white/10 rounded-xl text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 bg-[#14151e] border border-white/10 rounded-xl text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !newPassword || newPassword !== confirmPassword}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'Resetting Password...' : <>Update Password <Lock size={14} /></>}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
