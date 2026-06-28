import React, { useState } from 'react';
import { Bug, X, Send, CheckCircle } from 'lucide-react';
import { analyticsApi } from '../../services/analyticsApi';

export const BugReportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('bug');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const contextInfo = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
      };

      await analyticsApi.submitBugReport({
        category,
        description: description.trim(),
        context_info: JSON.stringify(contextInfo),
      });

      setSubmitted(true);
      setDescription('');
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit bug report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2 rounded-full border border-gold/45 bg-[#151514] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-gold shadow-lg shadow-black/60 hover:bg-gold hover:text-near-black transition-all duration-300 transform hover:scale-105 active:scale-95"
        style={{ boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' }}
      >
        <Bug size={16} className="animate-bounce" />
        Report Bug
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gold/25 bg-[#111110] p-6 text-left shadow-2xl">
            {/* Background Accent glow */}
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-[#8c1d1d]/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-warm-white/[0.06] pb-4">
              <div className="flex items-center gap-2 text-gold">
                <Bug size={20} />
                <h3 className="font-display text-lg font-bold text-warm-white">Report a Bug / Issue</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-mid-gray hover:bg-warm-white/[0.06] hover:text-warm-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-emerald/10 p-3 text-emerald mb-4">
                  <CheckCircle size={32} />
                </div>
                <h4 className="font-display text-lg font-bold text-warm-white">Bug Report Submitted!</h4>
                <p className="mt-2 text-sm text-mid-gray px-4">
                  Thank you for helping us improve Arambh. The founder team has been notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mid-gray mb-2">
                    Issue Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bug', label: 'Technical Bug' },
                      { id: 'content', label: 'Content Issue' },
                      { id: 'ui', label: 'UI / UX Suggestion' },
                      { id: 'other', label: 'Other / Feedback' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold text-center transition-all ${
                          category === item.id
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-warm-white/[0.08] bg-warm-white/[0.02] text-mid-gray hover:border-warm-white/[0.15] hover:text-warm-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mid-gray mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe the issue in detail. What did you expect to happen, and what actually happened?"
                    rows={4}
                    className="w-full rounded-xl border border-warm-white/[0.1] bg-[#1a1a19] px-4 py-3 text-sm text-warm-white placeholder-mid-gray/50 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
                  />
                </div>

                {error && (
                  <p className="text-xs text-[#ea580c] font-medium bg-[#ea580c]/10 border border-[#ea580c]/25 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-warm-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-warm-white/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-wider text-warm-white hover:bg-warm-white/[0.04]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !description.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-near-black hover:bg-[#d4b76e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Sending...' : 'Submit Report'}
                    <Send size={12} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
