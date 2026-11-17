import React from 'react';
import { LEVEL_MILESTONES } from '../../data/badges';
import { Shield, Sparkles } from 'lucide-react';

interface LevelProgressBarProps {
  currentXp: number;
  currentLevel: number;
  levelTitle: string;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  currentXp,
  currentLevel,
  levelTitle,
}) => {
  const currentMilestone = LEVEL_MILESTONES.find(m => m.level === currentLevel) || LEVEL_MILESTONES[0];
  const nextMilestone = LEVEL_MILESTONES.find(m => m.level === currentLevel + 1);

  const minXp = currentMilestone.minXp;
  const maxXp = nextMilestone ? nextMilestone.minXp : currentMilestone.maxXp;
  const progressInLevel = Math.max(0, currentXp - minXp);
  const totalInLevel = Math.max(1, maxXp - minXp);
  const percent = nextMilestone 
    ? Math.min(100, Math.round((progressInLevel / totalInLevel) * 100))
    : 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-mono text-cyan-400 font-semibold">
                Rank Lvl {currentLevel}
              </span>
              <span className="text-white font-medium text-sm">
                {levelTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {nextMilestone 
                ? `${nextMilestone.minXp - currentXp} XP until ${nextMilestone.title}` 
                : 'Maximum Rank Achieved!'}
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-cyan-300 font-bold text-sm">{currentXp}</span>
          <span className="text-slate-500 text-xs"> / {nextMilestone ? nextMilestone.minXp : currentMilestone.maxXp} XP</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-3 bg-slate-900/80 rounded-full border border-slate-700/50 overflow-hidden p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-rose-500 transition-all duration-700 ease-out relative"
          style={{ width: `${percent}%` }}
        >
          {/* Glowing pulse head */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/70 rounded-full blur-[2px]" />
        </div>
      </div>
    </div>
  );
};
