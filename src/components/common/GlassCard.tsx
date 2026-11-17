import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'cyan' | 'burgundy' | 'neutral' | 'dark';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'cyan',
  hoverEffect = false,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'bg-slate-900/70 border-cyan-500/20 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]';
      case 'burgundy':
        return 'bg-[#180a14]/75 border-rose-600/25 shadow-[0_4px_24px_-4px_rgba(225,29,72,0.15)]';
      case 'dark':
        return 'bg-[#0a0f1d]/90 border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.6)]';
      case 'neutral':
      default:
        return 'bg-slate-900/60 border-slate-700/40 shadow-xl';
    }
  };

  const hoverStyles = hoverEffect
    ? variant === 'burgundy'
      ? 'hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(225,29,72,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer'
      : 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border backdrop-blur-xl ${getVariantStyles()} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
