import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#060913]" />

      {/* Cyber grid lines */}
      <div className="absolute inset-0 cyber-grid opacity-70" />

      {/* Electric blue glow orb top-left */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full opacity-20 blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00f0ff 0%, #0369a1 60%, transparent 100%)'
        }}
      />

      {/* Deep burgundy / crimson glow orb bottom-right */}
      <div 
        className="absolute -bottom-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full opacity-25 blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #e11d48 0%, #4c0519 60%, transparent 100%)'
        }}
      />

      {/* Central cyber radar sweep (subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-cyan-500/5 pointer-events-none opacity-40">
        <div className="absolute inset-16 rounded-full border border-cyan-500/10" />
        <div className="absolute inset-36 rounded-full border border-cyan-500/10" />
        <div className="absolute inset-64 rounded-full border border-burgundy-500/10" />
        {/* Radar crosshairs */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-500/10" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-500/10" />
      </div>

      {/* Very subtle scanlines */}
      <div className="absolute inset-0 scanline-overlay opacity-30" />
    </div>
  );
};
