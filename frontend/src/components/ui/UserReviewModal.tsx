import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X, ThumbsUp, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

interface UserReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PublicReview {
  id: number;
  username: string;
  feedback_type: string;
  description: string;
  created_at?: string;
}

export const UserReviewModal: React.FC<UserReviewModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'community'>('submit');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('general');
  const [opinion, setOpinion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await api.get('/analytics/public-reviews');
      setReviews(res.data || []);
    } catch (e) {
      console.warn('Failed to fetch public reviews:', e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim()) return;

    setSubmitting(true);
    try {
      const formattedDesc = `[Rating: ${rating}/5 Stars] ${opinion.trim()}`;
      await api.post('/analytics/beta-feedback', {
        feedback_type: category,
        description: formattedDesc,
        context_info: `Star Rating: ${rating}/5`
      });

      setSuccessMsg(true);
      setOpinion('');
      fetchReviews();
      setTimeout(() => {
        setSuccessMsg(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to submit opinion:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-lg bg-[#0d0d12] border border-gold/30 rounded-2xl shadow-[0_0_60px_rgba(212,183,110,0.18)] overflow-hidden text-warm-white"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-center justify-between p-5 border-b border-warm-white/[0.08] bg-[#12121a]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold shadow-sm">
                <MessageSquare size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-gold tracking-tight">Adventurer Reviews & Feedback</h2>
                <p className="text-xs text-mid-gray mt-0.5">Shape the future of Arambh with your thoughts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-mid-gray hover:text-white hover:bg-warm-white/10 transition-colors"
              title="Close review modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-warm-white/[0.08] bg-[#09090e]">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === 'submit'
                  ? 'text-gold border-gold bg-gold/[0.04]'
                  : 'text-mid-gray border-transparent hover:text-warm-white'
              }`}
            >
              <Send size={13} /> Leave Feedback
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === 'community'
                  ? 'text-gold border-gold bg-gold/[0.04]'
                  : 'text-mid-gray border-transparent hover:text-warm-white'
              }`}
            >
              <ThumbsUp size={13} /> Community Feed ({reviews.length})
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6">
            {activeTab === 'submit' ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rating Stars */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gold/80 mb-2">
                    Your Overall Rating
                  </label>
                  <div className="flex items-center gap-2 bg-[#14141c] p-3 rounded-xl border border-warm-white/[0.06]">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={`transition-colors ${
                              (hoverRating || rating) >= star
                                ? 'text-gold fill-gold drop-shadow-[0_0_8px_rgba(212,183,110,0.7)]'
                                : 'text-warm-white/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="ml-auto font-mono text-xs text-gold font-bold bg-gold/10 px-2.5 py-1 rounded-lg border border-gold/20">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gold/80 mb-2">
                    Feedback Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#14141c] border border-warm-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-warm-white focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="general">✨ General Experience & Design</option>
                    <option value="lesson">📚 Debugger & Lesson Quality</option>
                    <option value="feature">💡 Feature Request / Suggestion</option>
                    <option value="bug">🐛 Bug Report</option>
                  </select>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gold/80 mb-2">
                    Your Review & Experience
                  </label>
                  <textarea
                    rows={4}
                    value={opinion}
                    onChange={(e) => setOpinion(e.target.value)}
                    placeholder="Tell us what you love or what we can refine to make Arambh extraordinary..."
                    className="w-full bg-[#14141c] border border-warm-white/[0.08] rounded-xl p-3.5 text-xs text-warm-white placeholder-mid-gray/50 focus:border-gold focus:outline-none resize-none font-sans leading-relaxed"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !opinion.trim()}
                  className="w-full py-3 bg-[#d4b76e] hover:bg-[#c4a75e] text-near-black font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-[0_0_20px_rgba(212,183,110,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {submitting ? (
                    'Submitting Review...'
                  ) : (
                    <>
                      <Sparkles size={15} /> Submit Review
                    </>
                  )}
                </button>

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs text-center flex items-center justify-center gap-2 font-medium"
                  >
                    <CheckCircle2 size={16} /> Thank you! Your review has been submitted to the community.
                  </motion.div>
                )}
              </form>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
                {loadingReviews ? (
                  <div className="text-center py-12 text-mid-gray text-xs font-mono animate-pulse">
                    Loading community feed...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-mid-gray text-xs">
                    No community reviews yet. Be the first to share your experience!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-[#14141c] border border-warm-white/[0.06] rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-[10px] font-bold font-mono uppercase">
                            {rev.username.slice(0, 2)}
                          </div>
                          <span className="font-bold text-warm-white text-xs">{rev.username}</span>
                        </div>
                        <span className="text-[9px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 uppercase font-bold">
                          {rev.feedback_type}
                        </span>
                      </div>
                      <p className="text-xs text-mid-gray leading-relaxed font-sans pl-8">
                        {rev.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
