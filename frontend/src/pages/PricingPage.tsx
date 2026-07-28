import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Check, Lock, ArrowLeft, Zap, Crown } from 'lucide-react';
import { paymentsApi, SubscriptionStatus } from '../services/paymentsApi';

export default function PricingPage() {
  const navigate = useNavigate();
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const status = await paymentsApi.getStatus();
      setSubStatus(status);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    try {
      setProcessingPlan(plan);
      setMessage(null);

      const order = await paymentsApi.createOrder(plan);

      // Check if Razorpay JS SDK is loaded on window
      if ((window as any).Razorpay) {
        const options = {
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: 'Arambh Python Academy',
          description: `Unlock Premium Curriculum (${plan})`,
          order_id: order.order_id,
          handler: async (response: any) => {
            const verified = await paymentsApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id || order.order_id,
              razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'sig_mock',
              plan
            });
            setSubStatus(verified);
            setMessage('🎉 Welcome to Arambh Premium! All 12 Regions are now unlocked.');
            setTimeout(() => navigate('/world-map'), 2000);
          },
          theme: {
            color: '#c8a45e'
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback for Dev Sandbox testing when Razorpay script isn't loaded
        const verified = await paymentsApi.verifyPayment({
          razorpay_order_id: order.order_id,
          razorpay_payment_id: `pay_dev_${Date.now()}`,
          razorpay_signature: 'sig_dev_sandbox',
          plan
        });
        setSubStatus(verified);
        setMessage('🎉 Sandbox Upgrade Successful! All 12 Regions are now unlocked.');
        setTimeout(() => navigate('/world-map'), 2000);
      }
    } catch (err: any) {
      setMessage(`Payment failed: ${err.message || 'Please try again.'}`);
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c8a45e]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Navigation */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-12 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Back to Realm
        </button>
        <div className="flex items-center gap-2 text-[#c8a45e] font-serif text-lg font-bold">
          <Crown className="w-5 h-5 text-[#c8a45e]" />
          Arambh Premium Pass
        </div>
      </div>

      {/* Title Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#fcfbf7] font-serif tracking-tight">
          Unlock the Full Realm of Python Mastery
        </h1>
        <p className="text-slate-400 text-lg">
          Master advanced concepts from Functions & OOP to Data Structures & Capstone Saga.
        </p>

        {subStatus?.is_premium && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c8a45e]/20 border border-[#c8a45e]/40 text-[#c8a45e] text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Active Subscription: {subStatus.plan.toUpperCase()} (All Regions Unlocked)
          </div>
        )}

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium max-w-md mx-auto">
            {message}
          </div>
        )}
      </div>

      {/* Pricing Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
        {/* Monthly Plan */}
        <div className="bg-[#12131a]/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 flex flex-col justify-between transition-all backdrop-blur-xl relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-200">Monthly Warrior</h3>
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-slate-400 text-sm mb-6">Perfect for focused learners pushing through the core regions.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-[#fcfbf7]">₹499</span>
              <span className="text-slate-400 text-sm">/ month</span>
            </div>

            <ul className="space-y-4 mb-8 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Access to all 12 Regions & 48+ Lessons
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Line-by-Line Visual Memory Debugger
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Boss Gate Challenges & Artifact Rewards
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Cancel anytime
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe('monthly')}
            disabled={processingPlan === 'monthly' || subStatus?.is_premium}
            className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition-all border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processingPlan === 'monthly' ? 'Processing...' : subStatus?.is_premium ? 'Currently Active' : 'Subscribe Monthly'}
          </button>
        </div>

        {/* Yearly Plan - Featured */}
        <div className="bg-[#18161f]/90 border-2 border-[#c8a45e]/50 hover:border-[#c8a45e] rounded-2xl p-8 flex flex-col justify-between transition-all backdrop-blur-xl relative shadow-2xl shadow-[#c8a45e]/10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c8a45e] text-[#0a0a0c] text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider">
            Most Popular (Save 50%)
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#fcfbf7] font-serif">Yearly Grandmaster</h3>
              <Crown className="w-6 h-6 text-[#c8a45e]" />
            </div>
            <p className="text-slate-400 text-sm mb-6">Complete mastery pass for aspiring developers and students.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-[#c8a45e]">₹2,999</span>
              <span className="text-slate-400 text-sm">/ year</span>
              <span className="text-xs text-emerald-400 ml-2 font-semibold">(₹250/mo)</span>
            </div>

            <ul className="space-y-4 mb-8 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#c8a45e] flex-shrink-0" />
                <strong>Everything in Monthly Pass</strong>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#c8a45e] flex-shrink-0" />
                Unlimited AI Mentor Code Debugging
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#c8a45e] flex-shrink-0" />
                Verifiable Python Warrior Certificate
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#c8a45e] flex-shrink-0" />
                Priority Discord Support & Guild Access
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe('yearly')}
            disabled={processingPlan === 'yearly' || subStatus?.is_premium}
            className="w-full py-3.5 rounded-xl bg-[#c8a45e] hover:bg-[#b8944e] text-[#0a0a0c] font-bold transition-all shadow-lg shadow-[#c8a45e]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processingPlan === 'yearly' ? 'Processing...' : subStatus?.is_premium ? 'Currently Active' : 'Upgrade to Grandmaster'}
          </button>
        </div>
      </div>
    </div>
  );
}
