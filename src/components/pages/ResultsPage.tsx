import React from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../common/GlassCard';
import { BadgePill } from '../common/BadgePill';
import { SCENARIOS } from '../../data/scenarios';
import { CHALLENGES } from '../../data/challenges';
import { BADGES, LEVEL_MILESTONES } from '../../data/badges';
import { 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Printer, 
  ArrowRight, 
  Share2, 
  Sparkles,
  Search,
  Cpu,
  Swords,
  Lock
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { userProgress, resetAllProgress, setCurrentPage } = useGame();

  const totalScenarios = SCENARIOS.length;
  const completedScenarios = Object.keys(userProgress.scenarioAttempts).length;
  const correctScenarios = Object.values(userProgress.scenarioAttempts).filter(s => s.isClassificationCorrect).length;

  const totalChallenges = CHALLENGES.length;
  const completedChallenges = Object.keys(userProgress.challengeAttempts).length;
  const correctChallenges = Object.values(userProgress.challengeAttempts).filter(c => c.isCorrect).length;

  const totalAttempted = completedScenarios + completedChallenges;
  const totalCorrect = correctScenarios + correctChallenges;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;

  const unlockedBadgesCount = userProgress.unlockedBadges.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <Award className="w-4 h-4" />
            <span>OFFICIAL CLEARANCE // DOSSIER CERTIFICATION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Investigator Clearance Results
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Official summary of your cybersecurity forensic capability and scam detection proficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={resetAllProgress}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Certificate / Dossier Frame */}
      <div className="relative rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-b from-[#0a1022] to-[#060913] p-8 md:p-12 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        
        {/* Certificate Decorative Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-500/40">
          DOC ID: SL-2026-CONFIDENTIAL
        </div>
        <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-600">
          VERIFIED STUDENT FORENSICS
        </div>

        {/* Certificate Badge & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-950/60 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.3)] mb-4">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-2">
            Cyber Threat Defense Credential
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            {userProgress.levelTitle}
          </h3>
          <p className="text-sm text-slate-300 mt-2 font-light">
            Awarded to the student investigator for demonstrating active scam identification, domain analysis, and credential protection skills.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10 font-mono">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">TOTAL XP ACCRUED</span>
            <span className="text-3xl font-extrabold text-cyan-400">{userProgress.totalXp}</span>
            <span className="text-[10px] text-slate-500 block mt-1">XP Points</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">FORENSIC ACCURACY</span>
            <span className="text-3xl font-extrabold text-emerald-400">{accuracy}%</span>
            <span className="text-[10px] text-slate-500 block mt-1">{totalCorrect} / {totalAttempted} Correct</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">CASES REVIEWED</span>
            <span className="text-3xl font-extrabold text-white">{completedScenarios} / {totalScenarios}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Detective Files</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">BADGES UNLOCKED</span>
            <span className="text-3xl font-extrabold text-rose-400">{unlockedBadgesCount} / {BADGES.length}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Honor Medals</span>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-slate-800/80 mb-10 space-y-4">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-bold text-center tracking-wider">
            Investigator Competency Matrix
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Phishing & Smishing Detection</span>
                <span className="text-cyan-400 font-bold">{Math.min(100, Math.round((correctScenarios / Math.max(1, totalScenarios)) * 100))}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-cyan-400 rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, Math.round((correctScenarios / Math.max(1, totalScenarios)) * 100))}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Social Engineering & Coercion Resistance</span>
                <span className="text-rose-400 font-bold">{Math.min(100, Math.round((correctChallenges / Math.max(1, totalChallenges)) * 100))}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, Math.round((correctChallenges / Math.max(1, totalChallenges)) * 100))}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Domain & Deceptive Link Dissection</span>
                <span className="text-emerald-400 font-bold">{userProgress.analyzerScanCount > 0 ? '100%' : '50%'}</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700" 
                  style={{ width: userProgress.analyzerScanCount > 0 ? '100%' : '50%' }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Footer Stamp */}
        <div className="text-center font-mono text-xs text-slate-500 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ISSUED BY: SCAMLENS ACADEMIC DEFENSE LAB</span>
          <span>CRYPTOGRAPHIC VERIFICATION STATUS: VALID</span>
        </div>

      </div>

      {/* Badges Earned Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Investigator Badges & Honors</h3>
            <p className="text-xs text-slate-400">Medals unlocked across all challenges and forensic investigations</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {unlockedBadgesCount} of {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = userProgress.unlockedBadges.includes(badge.id);
            return (
              <GlassCard
                key={badge.id}
                variant={isUnlocked ? 'cyan' : 'dark'}
                className={`p-5 flex items-start gap-3.5 transition-all ${
                  isUnlocked ? 'shadow-[0_0_20px_rgba(0,240,255,0.15)]' : 'opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  isUnlocked ? 'bg-cyan-950 border border-cyan-400/50' : 'bg-slate-900 border border-slate-800'
                }`}>
                  {isUnlocked ? '🎖️' : '🔒'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        EARNED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {badge.description}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 block mt-2">
                    Requirement: {badge.requirement}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Bottom Re-engage CTAs */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Want to continue training?</h4>
          <p className="text-xs text-slate-400">
            Return to case investigations or scan your own suspicious messages with the AI Analyzer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('detective')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono tracking-wide flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition"
          >
            <Search className="w-4 h-4" />
            <span>Replay Detective Cases</span>
          </button>

          <button
            onClick={() => setCurrentPage('arena')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono tracking-wide flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)] transition"
          >
            <Swords className="w-4 h-4" />
            <span>Play Challenge Arena</span>
          </button>
        </div>
      </div>

    </div>
  );
};
