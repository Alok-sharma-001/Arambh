import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageSquare, AlertTriangle, Lightbulb, FileText, Send, Sparkles } from 'lucide-react';
import { analyticsApi } from '../services/analyticsApi';

const TYPES = [
  { id: 'bug', label: 'Bug Report', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'feature_request', label: 'Feature Request', icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'content', label: 'Content Issue', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' }
];

export default function BetaFeedbackPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [contextInfo, setContextInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !description.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await analyticsApi.submitBetaFeedback({
        feedback_type: selectedType,
        description: description.trim(),
        context_info: contextInfo.trim() || undefined
      });
      setSuccess(true);
      setDescription('');
      setContextInfo('');
      setSelectedType(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-near-black relative overflow-hidden font-body text-slate-300">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 md:p-10 bg-[#0D0D12]/90 border border-slate-800/80 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-game-purple/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#13131A] border border-game-gold/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.1)] animate-pulse">
                <Sparkles className="w-8 h-8 text-game-gold" />
              </div>
              <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-game-gold mb-2">
                Beta Feedback Panel
              </h1>
              <h2 className="text-3xl font-extrabold text-white font-display">
                Help Us Forge Arambh
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
                Your feedback is crucial. Report bugs, suggest features, or highlight learning difficulties so we can improve PyQuest.
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-emerald-400 mb-2">Feedback Received!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8">
                  Your response has been transmitted to the developer console. Thank you for making Arambh stronger!
                </p>
                <Button
                  onClick={() => setSuccess(false)}
                  className="px-8 bg-[#13131A] border border-[#181820] text-slate-300 hover:bg-[#181820]"
                >
                  Submit Another Report
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 ${
                            isSelected
                              ? `border-game-gold ${type.bg} shadow-[0_0_15px_rgba(251,191,36,0.1)]`
                              : 'border-[#181820] bg-[#101015] hover:border-slate-800 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type.bg} border ${type.border}`}>
                            <Icon className={`w-5 h-5 ${type.color}`} />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-game-gold' : 'text-slate-400'}`}>
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Details
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of what happened, what you suggest, or what you experienced..."
                    className="w-full h-32 p-4 rounded-xl bg-[#101015] border border-slate-800 text-slate-300 text-sm focus:border-game-gold focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    System/Context Info (Optional)
                  </label>
                  <input
                    type="text"
                    value={contextInfo}
                    onChange={(e) => setContextInfo(e.target.value)}
                    placeholder="e.g. Chrome 125, MacOS, or specific lesson name"
                    className="w-full p-4 rounded-xl bg-[#101015] border border-slate-800 text-slate-300 text-sm focus:border-game-gold focus:outline-none transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    disabled={!selectedType || !description.trim() || isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                    className={`w-full py-4 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all ${
                      selectedType && description.trim()
                        ? 'bg-game-gold text-black hover:bg-game-gold/90 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                        : 'bg-[#181820] text-slate-500 cursor-not-allowed border border-slate-800'
                    }`}
                  >
                    {isSubmitting ? 'Transmitting...' : 'Transmit Feedback'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
