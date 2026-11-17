import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../common/GlassCard';
import { BadgePill } from '../common/BadgePill';
import { CHALLENGES } from '../../data/challenges';
import { ChallengeQuestion } from '../../types';
import { cyberAudio } from '../../utils/sound';
import { triggerCyberCelebration } from '../../utils/confetti';
import { 
  Swords, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ArrowLeft, 
  Lightbulb, 
  ShieldCheck, 
  RotateCcw,
  HelpCircle
} from 'lucide-react';

export const ChallengeArenaPage: React.FC = () => {
  const { userProgress, recordChallengeAttempt, setCurrentPage } = useGame();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const categories = ['All', 'Phishing', 'Fake Giveaways', 'Tech Support', 'Urgency Scams', 'Impersonation', 'QR Code & Links'];

  const filteredChallenges = selectedFilter === 'All'
    ? CHALLENGES
    : CHALLENGES.filter(c => c.category === selectedFilter);

  const activeChallenge: ChallengeQuestion = filteredChallenges[currentIndex] || CHALLENGES[0];
  const previousAttempt = userProgress.challengeAttempts[activeChallenge.id];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(previousAttempt?.selectedOptionId || null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(Boolean(previousAttempt));

  // Sync state on index change
  React.useEffect(() => {
    const att = userProgress.challengeAttempts[activeChallenge.id];
    if (att) {
      setSelectedOptionId(att.selectedOptionId);
      setHasAnswered(true);
    } else {
      setSelectedOptionId(null);
      setHasAnswered(false);
    }
  }, [currentIndex, activeChallenge.id, userProgress.challengeAttempts]);

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (hasAnswered) return;

    setSelectedOptionId(optionId);
    setHasAnswered(true);

    if (isCorrect) {
      cyberAudio.playCorrect();
      triggerCyberCelebration();
    } else {
      cyberAudio.playWarning();
    }

    recordChallengeAttempt(activeChallenge.id, optionId, isCorrect, activeChallenge.xpReward);
  };

  const handleNext = () => {
    cyberAudio.playClick();
    if (currentIndex < filteredChallenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentPage('results');
    }
  };

  const handlePrev = () => {
    cyberAudio.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const totalAttempted = Object.keys(userProgress.challengeAttempts).length;
  const totalCorrect = Object.values(userProgress.challengeAttempts).filter(a => a.isCorrect).length;

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header & Arena Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-rose-400 mb-1">
            <Swords className="w-4 h-4" />
            <span>CYBER COMBAT ARENA // SCENARIO REFLEX DRILLS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Challenge Arena
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            High-stakes decision scenarios designed to train rapid scam identification reflexes.
          </p>
        </div>

        {/* Arena Score Banner */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 font-mono text-xs">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SOLVED DRILLS</span>
              <span className="text-white font-bold text-sm">
                {totalCorrect} / {CHALLENGES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              cyberAudio.playClick();
              setSelectedFilter(cat);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
              selectedFilter === cat
                ? 'bg-rose-600 text-white font-bold shadow-[0_0_15px_rgba(225,29,72,0.35)]'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Challenge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Challenge Scenario & Options (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <GlassCard variant="burgundy" className="p-6">
            
            {/* Challenge Meta */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-500/20 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">
                  Drill {currentIndex + 1} of {filteredChallenges.length}
                </span>
                <span className="text-slate-600">•</span>
                <BadgePill label={activeChallenge.category} variant="burgundy" size="sm" />
                <BadgePill 
                  label={activeChallenge.difficulty} 
                  variant={activeChallenge.difficulty === 'Easy' ? 'cyan' : 'amber'} 
                  size="sm" 
                />
              </div>

              <span className="text-cyan-400 font-bold">
                +{activeChallenge.xpReward} XP
              </span>
            </div>

            {/* Scenario Story Prompt */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm leading-relaxed mb-5 font-sans">
              <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
                // SCENARIO INCIDENT:
              </span>
              {activeChallenge.scenarioText}
            </div>

            {/* Question Heading */}
            <h3 className="text-lg font-bold text-white mb-4 flex items-start gap-2">
              <HelpCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{activeChallenge.question}</span>
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {activeChallenge.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200';

                if (hasAnswered) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.25)]';
                  } else {
                    optionStyle = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60';
                  }
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                    className={`p-4 rounded-xl border text-sm transition select-none flex flex-col gap-2 ${
                      hasAnswered ? 'cursor-default' : 'cursor-pointer hover:border-cyan-500/40 hover:bg-slate-900/80'
                    } ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${
                        hasAnswered
                          ? opt.isCorrect
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : isSelected
                            ? 'bg-rose-500 border-rose-400 text-slate-950'
                            : 'border-slate-700 text-slate-600'
                          : 'border-slate-600 text-slate-400'
                      }`}>
                        {hasAnswered && opt.isCorrect ? (
                          '✓'
                        ) : hasAnswered && isSelected && !opt.isCorrect ? (
                          '✗'
                        ) : (
                          opt.id.split('-')[1]?.toUpperCase()
                        )}
                      </div>

                      <div className="font-medium flex-1 leading-snug">
                        {opt.text}
                      </div>
                    </div>

                    {/* Reveal Explanation when answered */}
                    {hasAnswered && (isSelected || opt.isCorrect) && (
                      <div className={`pl-8 text-xs leading-relaxed ${
                        opt.isCorrect ? 'text-emerald-300' : 'text-rose-300'
                      }`}>
                        {opt.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </GlassCard>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-mono text-slate-300 flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Drill</span>
            </button>

            <span className="text-xs font-mono text-slate-500">
              {currentIndex + 1} of {filteredChallenges.length}
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2 transition"
            >
              <span>{currentIndex < filteredChallenges.length - 1 ? 'Next Drill' : 'Review Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Tactical Tip & Progress (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Tactical Defense Tip */}
          <GlassCard variant="cyan" className="p-6">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>Cyber Defender's Rule</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {activeChallenge.tip}
            </p>
          </GlassCard>

          {/* Arena Challenge Ladder */}
          <GlassCard variant="dark" className="p-6">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
              Arena Drill Queue
            </h4>
            <div className="space-y-2">
              {filteredChallenges.map((item, idx) => {
                const att = userProgress.challengeAttempts[item.id];
                const isCur = idx === currentIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      cyberAudio.playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                      isCur
                        ? 'bg-rose-950/60 border-rose-500 text-white font-semibold'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-slate-500">
                        #{idx + 1}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex-shrink-0 font-mono">
                      {att ? (
                        att.isCorrect ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : (
                          <span className="text-rose-400 font-bold">✗</span>
                        )
                      ) : (
                        <span className="text-slate-600">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
