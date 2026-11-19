import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { GlassCard } from './common/GlassCard';
import { testGeminiApiKey, getMaskedKey } from '../services/aiAnalyzer';
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
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Sparkles
} from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { 
    showApiKeyModal, 
    setShowApiKeyModal, 
    isDemoModeOnly,
    setIsDemoModeOnly,
    serverStatus,
    refreshServerStatus,
    userApiKey,
    updateUserApiKey,
    isGeminiConnected
  } = useGame();

  const [inputKey, setInputKey] = useState<string>(userApiKey || '');
  const [showKeyText, setShowKeyText] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    model?: string;
  }>({ type: null, message: '' });

  // Sync input with userApiKey on modal open
  useEffect(() => {
    if (showApiKeyModal) {
      setInputKey(userApiKey || '');
      setTestResult({ type: null, message: '' });
      refreshServerStatus();
    }
  }, [showApiKeyModal, userApiKey]);

  if (!showApiKeyModal) return null;

  const isServerConfigured = Boolean(serverStatus?.configured);
  const isDirectConfigured = Boolean(userApiKey && userApiKey.trim().length > 10);

  const handleVerifyAndSave = async () => {
    if (!inputKey.trim()) {
      setTestResult({
        type: 'error',
        message: 'Please paste your Google AI Studio API key first.'
      });
      return;
    }

    setVerifying(true);
    setTestResult({ type: null, message: '' });

    try {
      const outcome = await testGeminiApiKey(inputKey.trim());
      if (outcome.success) {
        updateUserApiKey(inputKey.trim());
        setTestResult({
          type: 'success',
          message: outcome.message,
          model: outcome.model
        });
      } else {
        setTestResult({
          type: 'error',
          message: outcome.message,
          model: outcome.model
        });
      }
    } catch (err: any) {
      setTestResult({
        type: 'error',
        message: err.message || 'Verification failed.'
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleClearKey = () => {
    updateUserApiKey('');
    setInputKey('');
    setTestResult({
      type: 'success',
      message: 'Client-side API key cleared.'
    });
  };

  const handleCheckServer = async () => {
    setVerifying(true);
    await refreshServerStatus();
    setVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <GlassCard variant="cyan" className="p-6 border-cyan-500/40 shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Connect Gemini AI
                  <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    Google AI Studio
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Power SCAMLENS with live Google Gemini threat analysis.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowApiKeyModal(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Connection Status Badge */}
          <div className={`p-4 rounded-xl border mb-5 flex items-start gap-3.5 transition-all ${
            isGeminiConnected && !isDemoModeOnly
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          }`}>
            {isGeminiConnected && !isDemoModeOnly ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <strong className="text-sm font-semibold text-white flex items-center gap-2">
                  {isGeminiConnected && !isDemoModeOnly
                    ? 'Gemini AI Connected & Active'
                    : 'Operating in Demo Mode'}
                </strong>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 font-bold">
                  MODEL: {serverStatus?.model || testResult.model || 'gemini-3.1-flash-lite'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {isGeminiConnected && !isDemoModeOnly
                  ? `Active! All messages in AI Message Analyzer will be evaluated by Google Gemini.`
                  : `Connect your free Google AI Studio key below to activate live neural threat analysis.`}
              </p>
            </div>
          </div>

          {/* SECTION 1: Connect API Key Directly to Website */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 mb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="gemini-key-input" className="text-xs font-mono uppercase text-cyan-300 font-bold tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  Website Gemini API Key
                </label>
                {isDirectConfigured && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active ({getMaskedKey(userApiKey)})
                  </span>
                )}
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1"
              >
                Get Free Key in AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="gemini-key-input"
                type={showKeyText ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste your Gemini key here (e.g. AQ.Ab8...)"
                className="w-full px-3.5 py-2.5 pr-20 rounded-lg bg-black/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs font-mono text-cyan-200 placeholder-slate-500 outline-none transition"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="p-1.5 text-slate-400 hover:text-white rounded transition"
                  title={showKeyText ? 'Hide API Key' : 'Show API Key'}
                >
                  {showKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                {inputKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded transition"
                    title="Clear key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Test result message */}
            {testResult.type && (
              <div className={`p-2.5 rounded-lg text-xs font-mono flex items-start gap-2 ${
                testResult.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              }`}>
                {testResult.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Saved privately in your browser's local storage.
              </span>

              <button
                type="button"
                onClick={handleVerifyAndSave}
                disabled={verifying}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save & Connect Key</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 2: Server-Side .env Configuration */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2.5 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono font-semibold text-slate-300">
                  Backend Server (.env) Status
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckServer}
                disabled={verifying}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
              >
                <RotateCcw className={`w-3 h-3 ${verifying ? 'animate-spin' : ''}`} />
                Check Server
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isServerConfigured ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-500'}`} />
                <span className="text-slate-300">
                  {isServerConfigured
                    ? `Detected in .env (${serverStatus?.maskedKey || 'Configured'})`
                    : 'Not detected in server process'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans">
                {isServerConfigured ? 'Zero exposure on client' : 'Runs via npm run dev'}
              </span>
            </div>
          </div>

          {/* Force Demo Mode Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDemoModeOnly}
                onChange={(e) => setIsDemoModeOnly(e.target.checked)}
                className="mt-1 accent-cyan-400 rounded"
              />
              <div>
                <span className="text-sm font-semibold text-white block">
                  Force Offline Demo Mode
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uses SCAMLENS's built-in local forensic heuristic rules without consuming API quota.
                </p>
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowApiKeyModal(false)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-wider uppercase font-mono shadow-[0_0_20px_rgba(0,240,255,0.4)] transition"
            >
              Done / Close
            </button>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};
