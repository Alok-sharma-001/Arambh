import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { paymentsApi, SubscriptionStatus } from '../services/paymentsApi';

interface PaymentGateProps {
  regionId: string;
  children: React.ReactNode;
}

// Regions 1-3 are Free; Regions 4-12 are Premium
const FREE_REGIONS = new Set(['variables-forest', 'data-types-valley', 'loops-desert']);

export function PaymentGate({ regionId, children }: PaymentGateProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isPremiumRegion = !FREE_REGIONS.has(regionId);

  useEffect(() => {
    if (isPremiumRegion) {
      paymentsApi.getStatus()
        .then(res => setStatus(res))
        .catch(err => console.error('Payment check error:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [regionId, isPremiumRegion]);

  if (!isPremiumRegion || (status && status.is_premium)) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#0a0a0c]">
        <div className="animate-spin w-8 h-8 border-2 border-[#c8a45e] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[500px] flex items-center justify-center p-6 bg-[#0a0a0c]">
      <div className="max-w-lg w-full bg-[#12131a] border border-[#c8a45e]/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative z-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#c8a45e]/10 border border-[#c8a45e]/30 flex items-center justify-center">
          <Crown className="w-8 h-8 text-[#c8a45e]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#fcfbf7] font-serif">
            Premium Region Locked
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            This region contains advanced Python concepts. Upgrade to Arambh Premium to unlock all 12 regions and capstone challenges.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-[#c8a45e] font-semibold">
            <Sparkles size={14} />
            Included in Premium Pass:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Functions, OOP Citadel & Exception Abyss</li>
            <li>Filesystem Ruins, Algorithm Arena & Boss Gate Saga</li>
            <li>Line-by-line visual memory debugger for all 48+ lessons</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full py-3 rounded-xl bg-[#c8a45e] hover:bg-[#b8944e] text-[#0a0a0c] font-bold text-sm transition-all shadow-lg shadow-[#c8a45e]/20 flex items-center justify-center gap-2"
          >
            <Crown size={16} />
            View Premium Plans (From ₹499/mo)
          </button>
          <button
            onClick={() => navigate('/world-map')}
            className="w-full py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 text-sm font-medium transition-all"
          >
            Return to World Map
          </button>
        </div>
      </div>
    </div>
  );
}
