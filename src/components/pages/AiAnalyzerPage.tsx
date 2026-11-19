import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../common/GlassCard';
import { BadgePill } from '../common/BadgePill';
import { analyzeMessage, PRESET_ANALYZER_SAMPLES } from '../../services/aiAnalyzer';
import { AIAnalysisResult } from '../../types';
import { cyberAudio } from '../../utils/sound';
import { 
  Cpu, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Key, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  AlertOctagon, 
  Check, 
  Info, 
  Server
} from 'lucide-react';

export const AiAnalyzerPage: React.FC = () => {
  const { 
    isDemoModeOnly, 
    setIsDemoModeOnly,
    setShowApiKeyModal, 
    recordAnalyzerScan,
    serverStatus,
    refreshServerStatus,
    userApiKey,
    isGeminiConnected
  } = useGame();

  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'threats' | 'recommendations'>('threats');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendNotice, setBackendNotice] = useState<string | null>(null);

  const isServerConfigured = Boolean(serverStatus?.configured);

  const handleSelectPreset = (sampleText: string) => {
    cyberAudio.playClick();
    setInputText(sampleText);
    setResult(null);
    setErrorMessage(null);
    setBackendNotice(null);
  };

  const handleClear = () => {
    cyberAudio.playClick();
    setInputText('');
    setResult(null);
    setErrorMessage(null);
    setBackendNotice(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      alert('Please enter or paste a sample message first.');
      return;
    }

    cyberAudio.playScan();
    setAnalyzing(true);
    setResult(null);
    setErrorMessage(null);
    setBackendNotice(null);

    setLoadingStep(
      !isDemoModeOnly && isGeminiConnected
        ? `Dispatching to Google Gemini AI (${serverStatus?.model || 'gemini-3.1-flash-lite'})...`
        : 'Running SCAMLENS local cybersecurity forensic engine...'
    );

    try {
      const outcome = await analyzeMessage(inputText, isDemoModeOnly, userApiKey);

      setResult(outcome.result);
      recordAnalyzerScan();

      if (outcome.warningMessage) {
        setBackendNotice(outcome.warningMessage);
      }

      if (outcome.result.riskScore >= 50) {
        cyberAudio.playWarning();
      } else {
        cyberAudio.playCorrect();
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'An unexpected error occurred while analyzing the message.'
      );
      cyberAudio.playWarning();
    } finally {
      setAnalyzing(false);
      setLoadingStep('');
    }
  };

  const getVerdictStyles = (verdict: AIAnalysisResult['verdict']) => {
    switch (verdict) {
      case 'Critical Threat':
        return {
          bg: 'bg-rose-950/60 border-rose-500/80 text-rose-300 shadow-[0_0_25px_rgba(225,29,72,0.4)]',
          badge: 'burgundy' as const,
          icon: <AlertOctagon className="w-7 h-7 text-rose-400 animate-pulse" />
        };
      case 'High-Risk Scam':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.25)]',
          badge: 'burgundy' as const,
          icon: <ShieldAlert className="w-7 h-7 text-rose-400" />
        };
      case 'Suspicious':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
          badge: 'amber' as const,
          icon: <AlertTriangle className="w-7 h-7 text-amber-400" />
        };
      case 'Genuine / Safe':
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
          badge: 'emerald' as const,
          icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />
        };
    }
  };

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Page Title & Engine Mode Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span>AI NEURAL COGNITION // THREAT FORENSICS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Message Analyzer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyze any suspicious message for social engineering, malicious links, and fraud.
          </p>
        </div>

        {/* Engine Mode Badge & Config Button */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 text-xs font-mono">
            <div className={`w-2.5 h-2.5 rounded-full ${
              isGeminiConnected && !isDemoModeOnly 
                ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]' 
                : 'bg-emerald-400'
            }`} />
            <div>
              <span className="text-slate-400 block text-[10px]">ACTIVE ENGINE:</span>
              <span className="text-white font-semibold">
                {isDemoModeOnly
                  ? 'Forced Demo Mode (Local Heuristics)'
                  : isGeminiConnected
                  ? `Google Gemini AI (${serverStatus?.model || 'gemini-3.1-flash-lite'})`
                  : 'Demo Mode (Gemini key pending)'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              refreshServerStatus();
              setShowApiKeyModal(true);
            }}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition ${
              isGeminiConnected && !isDemoModeOnly
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-400 hover:text-cyan-300'
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
            }`}
            title="Configure Gemini AI Connection"
          >
            {isGeminiConnected && !isDemoModeOnly ? (
              <>
                <Server className="w-4 h-4" />
                <span className="hidden sm:inline">Gemini Connected</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Connect Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Backend Status Notice if key not configured */}
      {!isGeminiConnected && !isDemoModeOnly && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">
                Ready for Gemini Integration:
              </strong>
              <span>
                To activate real-time Gemini threat analysis, connect your Google AI Studio API key. You can paste it into your <code className="px-1.5 py-0.5 rounded bg-black/50 text-cyan-200 font-mono">.env</code> file or directly in the website settings. The app is currently running in <strong>Demo Mode</strong> with built-in heuristic detection.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono text-[11px] whitespace-nowrap shadow-[0_0_12px_rgba(0,240,255,0.3)] transition"
          >
            Connect Key
          </button>
        </div>
      )}

      {/* Preset Samples Strip */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Quick-Load Preset Case Samples (Click to test):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_ANALYZER_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(sample.text)}
              className="p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-left transition group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                <span>{sample.label}</span>
                <span className="text-[10px] text-slate-500 font-mono">Sample #{idx + 1}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                {sample.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area Card */}
      <GlassCard variant="cyan" className="p-6">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
          <span className="text-cyan-300 font-semibold flex items-center gap-1.5 uppercase">
            <Search className="w-3.5 h-3.5" />
            Message Payload for Inspection
          </span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>{inputText.length} characters</span>
            {inputText && (
              <button
                onClick={handleClear}
                className="text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste any sample email, SMS smishing, Discord DM, or job offer here to analyze... (e.g. 'URGENT: Your account credentials have expired. Click here within 24 hours to preserve access...')"
          rows={6}
          className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-sans text-slate-100 placeholder-slate-600 outline-none transition leading-relaxed resize-y"
        />

        {/* Mode Toggle & Analyze Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 select-none">
            <input
              type="checkbox"
              checked={isDemoModeOnly}
              onChange={(e) => setIsDemoModeOnly(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>Force Demo Mode (Offline rule engine)</span>
          </label>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !inputText.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold font-mono text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Scanning Threat Vectors...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Analyze Message with SCAMLENS AI</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* Loading State Banner */}
      {analyzing && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center space-y-3 animate-pulse">
          <div className="w-8 h-8 mx-auto border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <h4 className="text-sm font-mono font-bold text-cyan-300">
            {loadingStep}
          </h4>
          <p className="text-xs text-slate-400 font-mono">
            Evaluating psychological urgency, domain authenticity, credential solicitation, and monetary patterns...
          </p>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-white block">Analysis Error:</strong>
            <p>{errorMessage}</p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setIsDemoModeOnly(true);
                  handleAnalyze();
                }}
                className="px-3 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-white font-mono text-[11px] transition"
              >
                Switch to Demo Mode and Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fallback Notice (if switched automatically) */}
      {backendNotice && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{backendNotice}</span>
        </div>
      )}

      {/* Analysis Output Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Executive Verdict Banner */}
          {(() => {
            const styles = getVerdictStyles(result.verdict);
            return (
              <div className={`p-6 sm:p-8 rounded-2xl border ${styles.bg} transition-all`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      {styles.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                          Forensic Risk Level:
                        </span>
                        <BadgePill label={result.verdict} variant={styles.badge} size="md" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                        {result.verdict}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-right">
                    <div>
                      <span className="text-[11px] text-slate-400 block">THREAT RISK INDEX</span>
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {result.riskScore}<span className="text-base font-normal text-slate-400">/100</span>
                      </span>
                    </div>
                    <div className="pl-6 border-l border-white/10">
                      <span className="text-[11px] text-slate-400 block">AI CONFIDENCE</span>
                      <span className="text-2xl sm:text-3xl font-bold text-cyan-300">
                        {result.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                    // Forensic Summary
                  </span>
                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed max-w-4xl font-normal">
                    {result.executiveSummary}
                  </p>
                </div>

                {/* Engine Source Badge */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>
                    Analysis Source: {result.sourceMode === 'gemini-live' ? '🟢 Google Gemini AI' : '⚡ Local Heuristic Engine'}
                  </span>
                  <span>Safety Verified</span>
                </div>
              </div>
            );
          })()}

          {/* Threat Factors Radar Breakdown */}
          <GlassCard variant="dark" className="p-6">
            <h3 className="text-sm font-mono text-cyan-300 font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Four-Pillar Threat Factor Analysis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              {result.threatFactors.map((factor, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold truncate" title={factor.name}>
                      {factor.name}
                    </span>
                    <BadgePill
                      label={factor.level}
                      size="sm"
                      variant={
                        factor.level === 'Critical' || factor.level === 'High'
                          ? 'burgundy'
                          : factor.level === 'Medium'
                          ? 'amber'
                          : 'emerald'
                      }
                    />
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        factor.score >= 60
                          ? 'bg-rose-500'
                          : factor.score >= 30
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-snug">
                    {factor.detail}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Warning Signs vs Safe Next Steps Tabs */}
          <GlassCard variant="cyan" className="p-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-5">
              <button
                onClick={() => setActiveTab('threats')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition ${
                  activeTab === 'threats'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Warning Signs ({result.detectedIndicators.length})
              </button>

              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition ${
                  activeTab === 'recommendations'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Safe Next Steps ({result.recommendations.length})
              </button>
            </div>

            {/* Warning Signs Content */}
            {activeTab === 'threats' ? (
              <div className="space-y-3">
                {result.detectedIndicators.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    No hostile signature patterns detected in this text.
                  </div>
                ) : (
                  result.detectedIndicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">
                            {ind.flag}
                          </span>
                          <BadgePill
                            label={ind.severity.toUpperCase()}
                            size="sm"
                            variant={ind.severity === 'danger' ? 'burgundy' : ind.severity === 'warning' ? 'amber' : 'slate'}
                          />
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {ind.explanation}
                        </p>
                      </div>

                      {ind.snippet && (
                        <div className="flex-shrink-0 max-w-xs font-mono text-[11px] p-2 rounded bg-slate-900 border border-slate-800 text-rose-300 break-all">
                          &ldquo;{ind.snippet}&rdquo;
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Safe Next Steps Content */
              <div className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold font-mono text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium pt-0.5">{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

        </div>
      )}

    </div>
  );
};
