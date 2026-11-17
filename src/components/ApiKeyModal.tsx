import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GlassCard } from './common/GlassCard';
import { 
  X, 
  Key, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  RotateCcw,
  Server,
  Lock
} from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { 
    showApiKeyModal, 
    setShowApiKeyModal, 
    isDemoModeOnly,
    setIsDemoModeOnly,
    serverStatus,
    refreshServerStatus
  } = useGame();

  const [checking, setChecking] = useState(false);

  if (!showApiKeyModal) return null;

  const handleRefresh = async () => {
    setChecking(true);
    await refreshServerStatus();
    setChecking(false);
  };

  const isConfigured = Boolean(serverStatus?.configured);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg">
        <GlassCard variant="cyan" className="p-6 border-cyan-500/40 shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Gemini API Connection
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    Backend Security
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Secure server-side integration via official Google Gen AI SDK.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowApiKeyModal(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Server Connection Status Banner */}
          <div className={`p-4 rounded-xl border mb-5 flex items-start gap-3 ${
            isConfigured
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          }`}>
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <strong className="text-sm font-semibold text-white">
                  {isConfigured ? 'Gemini Backend Connected' : 'Gemini Key Not Detected'}
                </strong>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/10 text-slate-300">
                  Model: {serverStatus?.model || 'gemini-2.5-flash'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {isConfigured
                  ? 'Your backend successfully detected GEMINI_API_KEY. All messages sent to the AI Analyzer will be processed with Gemini AI!'
                  : 'The backend has not detected GEMINI_API_KEY in your .env file yet. The website is currently operating in Demo Mode.'}
              </p>
            </div>
          </div>

          {/* Setup Steps for Beginners */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-mono uppercase text-cyan-300 font-bold tracking-wider">
              How to Connect Your Gemini Key (3 Easy Steps):
            </h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0">
                  1
                </span>
                <div>
                  <span>Get your free Gemini API key from </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1"
                  >
                    Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0">
                  2
                </span>
                <div>
                  <span>Open the <code className="text-cyan-300 font-mono">.env</code> file in your project root and add:</span>
                  <pre className="mt-1 p-2 rounded bg-black/70 border border-slate-800 font-mono text-[11px] text-cyan-200">
                    GEMINI_API_KEY=your_actual_key_here
                  </pre>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0">
                  3
                </span>
                <div>
                  <span>Restart your dev server (<code className="text-cyan-300 font-mono">npm run dev</code>) so it loads the new environment variable, then click <strong>Check Status</strong> below.</span>
                </div>
              </div>
            </div>

            {/* Security Explanation Note */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Zero Key Exposure:</strong> Your API key is loaded strictly on the Node.js backend. It is never included in client JavaScript bundles or exposed to website visitors.
              </span>
            </div>
          </div>

          {/* Mode Switch Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDemoModeOnly}
                onChange={(e) => setIsDemoModeOnly(e.target.checked)}
                className="mt-1 accent-cyan-400 rounded"
              />
              <div>
                <span className="text-sm font-semibold text-white block">
                  Force Demo Mode (Built-in Local Heuristic Rules)
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  100% offline analysis. Useful when testing without internet or saving API quota.
                </p>
              </div>
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={checking}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition flex items-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Checking Server...' : 'Check Status'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowApiKeyModal(false)}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.4)] transition"
            >
              Done
            </button>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};
