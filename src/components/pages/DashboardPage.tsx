import React from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../common/GlassCard';
import { LevelProgressBar } from '../common/LevelProgressBar';
import { BadgePill } from '../common/BadgePill';
import { SCENARIOS } from '../../data/scenarios';
import { CHALLENGES } from '../../data/challenges';
import { BADGES } from '../../data/badges';
import { 
  ShieldAlert, 
  Terminal, 
  Search, 
  Cpu, 
  Swords, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Zap,
  Flame,
  RotateCcw
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    userProgress, 
    setCurrentPage, 
    setActiveScenarioId, 
    resetAllProgress 
  } = useGame();

  const totalScenarios = SCENARIOS.length;
  const completedScenarios = Object.keys(userProgress.scenarioAttempts).length;
  const totalChallenges = CHALLENGES.length;
  const completedChallenges = Object.keys(userProgress.challengeAttempts).length;

  const solvedScenariosCount = Object.values(userProgress.scenarioAttempts).filter(s => s.isClassificationCorrect).length;
  const solvedChallengesCount = Object.values(userProgress.challengeAttempts).filter(c => c.isCorrect).length;

  const accuracyPct = (completedScenarios + completedChallenges) > 0
    ? Math.round(((solvedScenariosCount + solvedChallengesCount) / (completedScenarios + completedChallenges)) * 100)
    : 100;

  const categories = [
    { name: 'Phishing Attacks', icon: '🎣', count: '4 Cases', desc: 'Email spoofing & credential harvesters', color: 'cyan' },
    { name: 'Delivery Smishing', icon: '📦', count: '2 Cases', desc: 'Bogus parcel fees & SMS shorteners', color: 'burgundy' },
    { name: 'Job & Internship Scams', icon: '💼', count: '2 Cases', desc: 'Telegram recruiters & advance fee bait', color: 'cyan' },
    { name: 'Tech Support Popups', icon: '💻', count: '2 Cases', desc: 'Fake virus sirens & browser lockups', color: 'amber' },
    { name: 'MFA & Push Fatigue', icon: '📱', count: '2 Cases', desc: '2FA push bombing & credential theft', color: 'burgundy' },
    { name: 'Quishing & QR Scams', icon: '🏁', count: '2 Cases', desc: 'Malicious parking & physical QR overlays', color: 'emerald' },
  ];

  const handleLaunchScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setCurrentPage('detective');
  };

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-cyan-400">
            <Terminal className="w-4 h-4" />
            <span>TERMINAL // INVESTIGATOR OPERATIONS CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Investigator Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Active session: <span className="text-slate-200 font-semibold">{userProgress.levelTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('detective')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono tracking-wide flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition"
          >
            <Search className="w-4 h-4" />
            <span>Open Next Case File</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('analyzer')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono tracking-wide flex items-center gap-2 transition"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI Analyzer</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Level Progress & Key Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard variant="cyan" className="p-6">
            <h2 className="text-sm font-mono text-cyan-300 font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Investigative Rank & Progression
            </h2>
            <LevelProgressBar
              currentXp={userProgress.totalXp}
              currentLevel={userProgress.investigatorLevel}
              levelTitle={userProgress.levelTitle}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 font-mono">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">TOTAL SCORE</span>
                <span className="text-xl font-bold text-cyan-400">{userProgress.totalXp}</span>
                <span className="text-[10px] text-slate-500 block">XP Earned</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">CASE ACCURACY</span>
                <span className="text-xl font-bold text-emerald-400">{accuracyPct}%</span>
                <span className="text-[10px] text-slate-500 block">Classification</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">CASES SOLVED</span>
                <span className="text-xl font-bold text-white">{completedScenarios} / {totalScenarios}</span>
                <span className="text-[10px] text-slate-500 block">Detective Scenarios</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">ARENA QUIZZES</span>
                <span className="text-xl font-bold text-rose-400">{completedChallenges} / {totalChallenges}</span>
                <span className="text-[10px] text-slate-500 block">Challenges Met</span>
              </div>
            </div>
          </GlassCard>

          {/* Case File Queue */}
          <GlassCard variant="dark" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Active Case Files</span>
              </h2>
              <button
                onClick={() => setCurrentPage('detective')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View All Cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {SCENARIOS.slice(0, 4).map((scenario) => {
                const attempt = userProgress.scenarioAttempts[scenario.id];
                const isDone = Boolean(attempt);
                const isPassed = attempt?.isClassificationCorrect;

                return (
                  <div
                    key={scenario.id}
                    onClick={() => handleLaunchScenario(scenario.id)}
                    className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        isDone 
                          ? isPassed ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {isDone ? (isPassed ? '✓' : '!') : scenario.difficulty[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-200">
                            {scenario.title}
                          </h4>
                          <BadgePill 
                            label={scenario.category} 
                            size="sm" 
                            variant={scenario.difficulty === 'Easy' ? 'cyan' : scenario.difficulty === 'Medium' ? 'amber' : 'burgundy'} 
                          />
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {scenario.senderName} • {scenario.platform.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right font-mono flex-shrink-0">
                      <div>
                        <span className="text-xs text-cyan-400 font-bold block">+{scenario.xpReward} XP</span>
                        <span className="text-[10px] text-slate-500">
                          {isDone ? (isPassed ? 'Solved' : 'Review') : 'Unsolved'}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right 1 Col: Badges & Investigator Intel */}
        <div className="space-y-6">
          
          {/* Quick Challenge Arena Teaser */}
          <GlassCard variant="burgundy" className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-rose-400 font-semibold flex items-center gap-1.5">
                <Swords className="w-4 h-4" />
                Challenge Arena
              </span>
              <span className="text-xs font-mono text-slate-400">
                {completedChallenges} / {totalChallenges} done
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Test Your Cyber Reflexes</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Multiple-choice challenges covering quishing, domain spoofing, and MFA fatigue tactics.
            </p>
            <button
              onClick={() => setCurrentPage('arena')}
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(225,29,72,0.3)] transition"
            >
              Enter Challenge Arena
            </button>
          </GlassCard>

          {/* Badges Preview */}
          <GlassCard variant="dark" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Investigator Badges</span>
              </h3>
              <button
                onClick={() => setCurrentPage('results')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                View Dossier
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BADGES.map((badge) => {
                const isUnlocked = userProgress.unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border text-center transition ${
                      isUnlocked
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="text-xl mb-1">{isUnlocked ? '🎖️' : '🔒'}</div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {badge.title}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {badge.requirement}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Reset Action */}
          <div className="text-center pt-2">
            <button
              onClick={resetAllProgress}
              className="text-xs text-slate-500 hover:text-rose-400 transition flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Local Progress & History</span>
            </button>
          </div>

        </div>

      </div>

      {/* Challenge Categories Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Threat Categories Covered</h2>
          <p className="text-xs text-slate-400">Master the primary vectors utilized by cyber adversaries against students</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <GlassCard key={idx} variant="dark" className="p-4 flex items-start gap-3">
              <span className="text-2xl p-2 rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0">
                {cat.icon}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{cat.desc}</p>
                <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                  {cat.count}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};
