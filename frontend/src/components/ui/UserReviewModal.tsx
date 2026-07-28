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
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-[#0a0a0c] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(200,164,94,0.15)] overflow-hidden text-slate-200"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#12131a]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#c8a45e] font-serif">Community Opinion & Reviews</h2>
                <p className="text-xs text-slate-400">Share your thoughts to help shape the future of Arambh</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-[#0d0e14]">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === 'submit'
                  ? 'text-amber-400 border-amber-400 bg-amber-500/5'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Send size={14} /> Leave an Opinion
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeTab === 'community'
                  ? 'text-amber-400 border-amber-400 bg-amber-500/5'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <ThumbsUp size={14} /> Community Feed ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'submit' ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rating Stars */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
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
                          size={28}
                          className={`transition-colors ${
                            (hoverRating || rating) >= star
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-mono text-sm text-amber-400 font-bold">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Feedback Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#12131a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="general">✨ General Experience & Design</option>
                    <option value="lesson">📚 Debugger & Lesson Quality</option>
                    <option value="feature">💡 Feature Request / Suggestion</option>
                    <option value="bug">🐛 Bug Report</option>
                  </select>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Your Feedback & Review
                  </label>
                  <textarea
                    rows={4}
                    value={opinion}
                    onChange={(e) => setOpinion(e.target.value)}
                    placeholder="Tell us what you love or what we should improve to make Arambh the best Python learning experience..."
                    className="w-full bg-[#12131a] border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none font-sans"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !opinion.trim()}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    'Submitting Opinion...'
                  ) : (
                    <>
                      <Sparkles size={16} /> Submit Review
                    </>
                  )}
                </button>

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-950/40 border border-green-500/50 rounded-xl text-green-400 text-xs text-center flex items-center justify-center gap-2 font-mono"
                  >
                    <CheckCircle2 size={16} /> Thank you! Your review has been published to the community feed.
                  </motion.div>
                )}
              </form>
            ) : (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingReviews ? (
                  <div className="text-center py-12 text-slate-500 text-sm font-mono animate-pulse">
                    Loading community feed...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No community reviews yet. Be the first to submit your opinion!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-[#12131a] border border-white/5 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold font-mono uppercase">
                            {rev.username.slice(0, 2)}
                          </div>
                          <span className="font-bold text-slate-200 text-sm">{rev.username}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                          {rev.feedback_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans pl-9">
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
