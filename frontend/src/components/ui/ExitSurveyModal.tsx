import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { X, HelpCircle } from 'lucide-react';
import { analyticsApi } from '../../services/analyticsApi';

interface ExitSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: string; // 'registration', 'first_lesson', 'first_region'
}

const OPTIONS = [
  'Too difficult',
  'Too easy',
  'Confusing',
  'Bug',
  'Not enough time',
  'Other'
];

export const ExitSurveyModal: React.FC<ExitSurveyModalProps> = ({ isOpen, onClose, context }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      await analyticsApi.submitExitSurvey({
        reason: selectedReason,
        details: details.trim(),
        context
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedReason(null);
        setDetails('');
        onClose();
      }, 1500);
    } catch (e) {
      console.warn("Failed to submit exit survey:", e);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md relative z-10"
          >
            <Card className="p-6 bg-[#0D0D12]/95 border border-slate-800/80 rounded-2xl shadow-2xl relative overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-game-gold mb-4">
                <HelpCircle className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">Quick Survey</span>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">Thank you!</h3>
                  <p className="text-xs text-slate-400">Your feedback helps us make Arambh better.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-extrabold text-white mb-2 font-display">
                    What stopped you today?
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    We noticed you are leaving early. Help us improve PyQuest by telling us what went wrong.
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {OPTIONS.map((opt) => {
                      const isSelected = selectedReason === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedReason(opt)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            isSelected
                              ? 'border-game-gold bg-game-gold/10 text-game-gold shadow-[0_0_10px_rgba(251,191,36,0.1)]'
                              : 'border-[#181820] bg-[#13131A] text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedReason && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4"
                    >
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Can you share a bit more detail? (Optional)"
                        className="w-full h-20 p-3 rounded-xl bg-[#13131A] border border-slate-800 text-slate-300 text-xs focus:border-game-gold focus:outline-none transition-all resize-none"
                      />
                    </motion.div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      className="flex-1 border-[#181820] text-slate-400"
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedReason || isSubmitting}
                      className={`flex-1 ${
                        selectedReason
                          ? 'bg-game-gold text-black hover:bg-game-gold/90'
                          : 'bg-[#181820] text-slate-500 cursor-not-allowed border border-slate-800'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
