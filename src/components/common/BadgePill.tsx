import React from 'react';

interface BadgePillProps {
  label: string;
  variant?: 'cyan' | 'burgundy' | 'emerald' | 'amber' | 'slate';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const BadgePill: React.FC<BadgePillProps> = ({
  label,
  variant = 'cyan',
  size = 'sm',
  icon,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30';
      case 'burgundy':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
      case 'emerald':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/30';
      case 'slate':
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-700';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${sizeStyles} ${getStyles()}`}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      {label}
    </span>
  );
};
