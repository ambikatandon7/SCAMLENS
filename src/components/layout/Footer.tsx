import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#050811]/90 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Mission */}
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-mono text-slate-200 font-semibold tracking-wide">
              SCAMLENS // The Digital Scam Detective
            </p>
            <p className="text-[11px] text-slate-500">
              Interactive cyber awareness training for high school & university students.
            </p>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="max-w-md text-center md:text-left p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>
            <strong className="text-rose-300">Privacy & Safety Notice:</strong> All scenarios and case files are strictly fictional. SCAMLENS never solicits real credentials, banking PINs, or sensitive personal data.
          </span>
        </div>

        {/* System Status / Built With */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Core Cyber Grid Online
          </span>
          <span>v1.0.0</span>
        </div>

      </div>
    </footer>
  );
};
