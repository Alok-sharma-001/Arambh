import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Full-page crash fallback UI — shown when an unhandled React error
 * crashes a route. Themed to match Arambh's dark fantasy aesthetic.
 */
export function AppCrashFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#fcfbf7]" style={{ fontFamily: 'Cinzel, serif' }}>
            A Glitch in the Realm
          </h1>
          <p className="text-sm text-[#a0a0a0] leading-relaxed">
            Something unexpected happened and the current page couldn't render.
            Your progress is safe — try refreshing the page.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#d4b76e]/10 border border-[#d4b76e]/30 text-[#d4b76e] text-sm font-semibold hover:bg-[#d4b76e]/20 transition-all"
          >
            <RefreshCw size={16} />
            Reload Page
          </button>
          <button
            onClick={() => { window.location.href = '/dashboard'; }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#fcfbf7]/10 text-[#a0a0a0] text-sm hover:text-[#fcfbf7] hover:border-[#fcfbf7]/20 transition-all"
          >
            Return to Dashboard
          </button>
        </div>

        {/* Bug Report Link */}
        <p className="text-xs text-[#666]">
          If this keeps happening,{' '}
          <a href="/beta-feedback" className="text-[#d4b76e]/70 hover:text-[#d4b76e] underline transition-colors">
            report a bug
          </a>
          .
        </p>
      </div>
    </div>
  );
}
