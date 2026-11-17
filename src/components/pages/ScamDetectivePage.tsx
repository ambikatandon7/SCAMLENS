import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../common/GlassCard';
import { BadgePill } from '../common/BadgePill';
import { SCENARIOS } from '../../data/scenarios';
import { WARNING_SIGNS } from '../../data/warningSigns';
import { ClassificationType, Scenario } from '../../types';
import { cyberAudio } from '../../utils/sound';
import { triggerCyberCelebration } from '../../utils/confetti';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Mail, 
  MessageSquare, 
  Paperclip, 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ExternalLink,
  Info,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ScamDetectivePage: React.FC = () => {
  const { 
    userProgress, 
    recordScenarioAttempt, 
    activeScenarioId, 
    setActiveScenarioId,
    setCurrentPage
  } = useGame();

  // Selected scenario
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (activeScenarioId) {
      const idx = SCENARIOS.findIndex(s => s.id === activeScenarioId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const scenario: Scenario = SCENARIOS[currentIndex];

  // User input states for current scenario
  const [selectedClassification, setSelectedClassification] = useState<ClassificationType | null>(null);
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Sync when activeScenarioId changes externally
  useEffect(() => {
    if (activeScenarioId) {
      const idx = SCENARIOS.findIndex(s => s.id === activeScenarioId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [activeScenarioId]);

  // Load previous attempt if exists
  useEffect(() => {
    const previousAttempt = userProgress.scenarioAttempts[scenario.id];
    if (previousAttempt) {
      setSelectedClassification(previousAttempt.userClassification);
      setSelectedSigns(previousAttempt.selectedWarningSigns);
      setHasSubmitted(true);
      setShowExplanation(true);
    } else {
      setSelectedClassification(null);
      setSelectedSigns([]);
      setHasSubmitted(false);
      setShowExplanation(false);
    }
  }, [currentIndex, scenario.id, userProgress.scenarioAttempts]);

  const handleToggleSign = (signId: string) => {
    if (hasSubmitted) return;
    cyberAudio.playClick();
    if (selectedSigns.includes(signId)) {
      setSelectedSigns(selectedSigns.filter(s => s !== signId));
    } else {
      setSelectedSigns([...selectedSigns, signId]);
    }
  };

  const handleSelectClassification = (type: ClassificationType) => {
    if (hasSubmitted) return;
    cyberAudio.playClick();
    setSelectedClassification(type);
  };

  const handleSubmit = () => {
    if (!selectedClassification) {
      alert('Please select a classification verdict (Genuine, Suspicious, or Scam) first.');
      return;
    }

    const isClassificationCorrect = selectedClassification === scenario.correctClassification;
    
    // Evaluate Warning Signs matching
    let warningSignScore = 0;
    if (scenario.correctWarningSigns.length === 0) {
      // Genuine message should have 0 warning signs
      warningSignScore = selectedSigns.length === 0 ? 100 : Math.max(0, 100 - selectedSigns.length * 25);
    } else {
      // Calculate intersection and false positives
      const truePositives = selectedSigns.filter(s => scenario.correctWarningSigns.includes(s)).length;
      const falsePositives = selectedSigns.filter(s => !scenario.correctWarningSigns.includes(s)).length;
      const recall = truePositives / scenario.correctWarningSigns.length;
      const penalty = falsePositives * 0.15;
      warningSignScore = Math.round(Math.max(0, (recall - penalty)) * 100);
    }

    // Composite score
    const totalScorePct = isClassificationCorrect 
      ? Math.round(50 + (warningSignScore * 0.5))
      : Math.round(warningSignScore * 0.3);

    // Calculate XP awarded
    const earnedXp = Math.round((totalScorePct / 100) * scenario.xpReward);

    if (isClassificationCorrect && totalScorePct >= 70) {
      cyberAudio.playCorrect();
      triggerCyberCelebration();
    } else {
      cyberAudio.playWarning();
    }

    recordScenarioAttempt(
      scenario.id,
      selectedClassification,
      selectedSigns,
      isClassificationCorrect,
      totalScorePct,
      earnedXp
    );

    setHasSubmitted(true);
    setShowExplanation(true);
  };

  const handleNextCase = () => {
    cyberAudio.playClick();
    if (currentIndex < SCENARIOS.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setActiveScenarioId(SCENARIOS[nextIdx].id);
    } else {
      // Go to results
      setCurrentPage('results');
    }
  };

  const handlePrevCase = () => {
    cyberAudio.playClick();
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setActiveScenarioId(SCENARIOS[prevIdx].id);
    }
  };

  const handleRetry = () => {
    cyberAudio.playClick();
    setHasSubmitted(false);
    setShowExplanation(false);
    setSelectedClassification(null);
    setSelectedSigns([]);
  };

  const currentAttempt = userProgress.scenarioAttempts[scenario.id];

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Breadcrumb & Case Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <Search className="w-4 h-4" />
            <span>FORENSIC LAB // EVIDENCE INSPECTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Case File #{currentIndex + 1}: {scenario.title}</span>
          </h1>
        </div>

        {/* Case Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {SCENARIOS.map((sc, idx) => {
            const att = userProgress.scenarioAttempts[sc.id];
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  cyberAudio.playClick();
                  setCurrentIndex(idx);
                  setActiveScenarioId(sc.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex-shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : att
                      ? att.isClassificationCorrect
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <span>#{idx + 1}</span>
                {att && (
                  <span className="text-[10px]">{att.isClassificationCorrect ? '✓' : '✗'}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Message Evidence UI / Right Forensic Analysis Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Evidence Message Mockup): 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard variant="dark" className="p-6 border-slate-700/60">
            
            {/* Mockup Header Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-300 font-semibold uppercase tracking-wider">
                  {scenario.platform} CLIENT INSPECTION
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BadgePill 
                  label={scenario.difficulty} 
                  variant={scenario.difficulty === 'Easy' ? 'cyan' : scenario.difficulty === 'Medium' ? 'amber' : 'burgundy'} 
                />
                <span className="text-cyan-400 font-bold">+{scenario.xpReward} XP</span>
              </div>
            </div>

            {/* Email / SMS / Discord UI Frame */}
            {scenario.platform === 'email' ? (
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 font-sans space-y-4">
                <div className="space-y-2 border-b border-slate-800/80 pb-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 font-mono">
                    <div>
                      <span className="text-slate-500">From: </span>
                      <span className="text-slate-200 font-medium">{scenario.senderName} </span>
                      <span className="text-rose-400 font-mono text-[11px]">&lt;{scenario.senderAddress}&gt;</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{scenario.timestamp}</span>
                  </div>
                  {scenario.subject && (
                    <div className="pt-1">
                      <span className="text-slate-500 font-mono text-[11px]">Subject: </span>
                      <span className="text-white font-semibold text-sm">{scenario.subject}</span>
                    </div>
                  )}
                </div>

                {/* Email Body */}
                <div className="text-slate-200 text-sm whitespace-pre-line leading-relaxed font-normal bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  {scenario.content}
                </div>

                {/* Attachment Chip */}
                {scenario.attachmentName && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    <Paperclip className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="truncate">Attachment: {scenario.attachmentName}</span>
                    <span className="ml-auto text-[10px] uppercase font-bold text-rose-400">Suspicious</span>
                  </div>
                )}
              </div>
            ) : scenario.platform === 'sms' ? (
              /* Phone SMS Mockup */
              <div className="max-w-md mx-auto rounded-2xl bg-slate-950 border-2 border-slate-800 p-4 font-sans shadow-2xl">
                <div className="text-center pb-3 border-b border-slate-800 mb-4 font-mono text-xs">
                  <span className="text-slate-400 block font-semibold">{scenario.senderName}</span>
                  <span className="text-slate-500 text-[11px]">{scenario.timestamp}</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-900 border border-slate-700/70 text-slate-200 text-sm leading-relaxed">
                    {scenario.content}
                  </div>
                </div>
              </div>
            ) : (
              /* Discord / DM Mockup */
              <div className="rounded-xl bg-[#1e1f22] border border-slate-800 p-5 font-sans space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-rose-600 flex items-center justify-center font-bold text-white text-sm">
                    {scenario.senderName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{scenario.senderName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300">BOT/USER</span>
                      <span className="text-slate-500 text-xs font-mono">{scenario.timestamp}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">@{scenario.senderAddress}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-[#2b2d31] text-slate-200 text-sm whitespace-pre-line leading-relaxed">
                  {scenario.content}
                </div>
              </div>
            )}

            {/* Instruction Tip */}
            <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
              <span>
                <strong>Investigator Tip:</strong> Carefully examine sender addresses, URL top-level domains, psychological urgency triggers, and unrealistic reward promises.
              </span>
            </div>

          </GlassCard>

          {/* Navigation Controls between scenarios */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevCase}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-mono text-slate-300 flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Case</span>
            </button>

            <span className="text-xs font-mono text-slate-500">
              Case {currentIndex + 1} of {SCENARIOS.length}
            </span>

            <button
              onClick={handleNextCase}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2 transition"
            >
              <span>{currentIndex < SCENARIOS.length - 1 ? 'Next Case' : 'View Final Dossier'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (Detective Actions & Warning Signs Form): 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard variant="cyan" className="p-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Forensic Verdict</span>
              </h3>
              {hasSubmitted && (
                <button
                  onClick={handleRetry}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-test</span>
                </button>
              )}
            </div>

            {/* Step 1: Classification Buttons */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-mono text-cyan-300 font-semibold block uppercase">
                Step 1: Classify this communication
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={hasSubmitted}
                  onClick={() => handleSelectClassification('genuine')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedClassification === 'genuine'
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold font-mono">GENUINE</span>
                </button>

                <button
                  type="button"
                  disabled={hasSubmitted}
                  onClick={() => handleSelectClassification('suspicious')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedClassification === 'suspicious'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold font-mono">SUSPICIOUS</span>
                </button>

                <button
                  type="button"
                  disabled={hasSubmitted}
                  onClick={() => handleSelectClassification('scam')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedClassification === 'scam'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)] ring-1 ring-rose-500'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span className="text-xs font-bold font-mono">SCAM</span>
                </button>
              </div>
            </div>

            {/* Step 2: Warning Signs Checklist */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-cyan-300 font-semibold uppercase">
                  Step 2: Flag Suspicious Red Flags
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedSigns.length} selected
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {WARNING_SIGNS.map((sign) => {
                  const isChecked = selectedSigns.includes(sign.id);
                  const isScenarioExpected = scenario.correctWarningSigns.includes(sign.id);

                  let indicatorClass = '';
                  if (hasSubmitted) {
                    if (isScenarioExpected && isChecked) {
                      indicatorClass = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300';
                    } else if (isScenarioExpected && !isChecked) {
                      indicatorClass = 'border-amber-500/60 bg-amber-950/30 text-amber-300';
                    } else if (!isScenarioExpected && isChecked) {
                      indicatorClass = 'border-rose-500/60 bg-rose-950/30 text-rose-300';
                    }
                  }

                  return (
                    <div
                      key={sign.id}
                      onClick={() => handleToggleSign(sign.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition select-none flex items-start gap-2.5 ${
                        indicatorClass || (isChecked
                          ? 'bg-cyan-950/50 border-cyan-400/60 text-cyan-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900')
                      } ${hasSubmitted ? 'cursor-default' : ''}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 transition ${
                        isChecked
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                          : 'border-slate-600 bg-slate-900'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5">
                        <span className="font-semibold block">{sign.label}</span>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {sign.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Button */}
            {!hasSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedClassification}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold font-mono text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(0,240,255,0.3)] transition"
              >
                Submit Forensic Evaluation
              </button>
            ) : (
              /* Results Summary Banner */
              <div className={`p-4 rounded-xl border space-y-3 ${
                currentAttempt?.isClassificationCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentAttempt?.isClassificationCorrect ? (
                      <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                    ) : (
                      <X className="w-5 h-5 text-rose-400 stroke-[3]" />
                    )}
                    <span className="font-mono font-bold text-sm">
                      {currentAttempt?.isClassificationCorrect ? 'Classification Accurate' : 'Incorrect Classification'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm">
                    +{currentAttempt?.xpEarned || 0} XP
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Actual Classification: <strong className="uppercase font-mono text-white">{scenario.correctClassification}</strong>.
                  Your score: <span className="font-mono font-bold">{currentAttempt?.scorePercentage}%</span>.
                </p>
              </div>
            )}

          </GlassCard>
        </div>

      </div>

      {/* Forensic Explanation Section (Revealed after submission) */}
      {showExplanation && (
        <GlassCard variant="dark" className="p-6 border-slate-700/80 animate-fadeIn space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">
                Forensic Case Debrief: {scenario.title}
              </h3>
            </div>
            <BadgePill 
              label={`Official Verdict: ${scenario.correctClassification.toUpperCase()}`} 
              variant={scenario.correctClassification === 'genuine' ? 'emerald' : scenario.correctClassification === 'suspicious' ? 'amber' : 'burgundy'} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Clues */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                Critical Clues Dissected
              </h4>
              <ul className="space-y-2">
                {scenario.explanation.keyClues.map((clue, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{clue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student Protocol & Threat Context */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  What You Should Do (Student Defense Protocol)
                </h4>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {scenario.explanation.whatToDo}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Real-World Threat Context
                </h4>
                <p className="text-xs text-slate-400 italic">
                  "{scenario.explanation.realWorldPrevalence}"
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={handleNextCase}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono tracking-wide flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition"
            >
              <span>{currentIndex < SCENARIOS.length - 1 ? 'Proceed to Next Case' : 'Review Investigator Dossier'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}

    </div>
  );
};
