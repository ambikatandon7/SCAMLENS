import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PageType } from '../../types';
import { 
  ShieldAlert, 
  Terminal, 
  Search, 
  Cpu, 
  Swords, 
  Award, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Sparkles,
  Radar
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    userProgress, 
    setShowApiKeyModal,
    isSoundEnabled,
    toggleSound,
    isDemoModeOnly,
    serverStatus,
    isGeminiConnected
  } = useGame();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Radar className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Terminal className="w-4 h-4" /> },
    { id: 'detective', label: 'Scam Detective', icon: <Search className="w-4 h-4" /> },
    { id: 'analyzer', label: 'AI Analyzer', icon: <Cpu className="w-4 h-4" /> },
    { id: 'arena', label: 'Challenge Arena', icon: <Swords className="w-4 h-4" /> },
    { id: 'results', label: 'Results & Dossier', icon: <Award className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const isGeminiActive = !isDemoModeOnly && isGeminiConnected;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/15 bg-[#060913]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-rose-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:border-cyan-300 transition-all duration-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-rose-400 text-lg font-mono">
                SCAMLENS
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40">
                CYBER
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
              The Digital Scam Detective
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Stats, Sound, AI Studio Config */}
        <div className="flex items-center gap-2.5">
          {/* XP & Level Badge */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 hover:border-cyan-500/40 transition group"
            title="Click to view full Investigator Dossier"
          >
            <div className="flex items-center gap-1 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-bold">{userProgress.totalXp}</span>
              <span className="text-slate-500 text-[10px]">XP</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-500/30">
              Lvl {userProgress.investigatorLevel}
            </span>
          </div>

          {/* AI Mode Selector Button */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition"
            title="Configure AI Engine (Backend Gemini vs Demo Heuristic)"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline text-[11px] font-mono">
              {isGeminiActive ? 'Gemini AI' : 'Demo Engine'}
            </span>
            <span 
              className={`w-2 h-2 rounded-full ${
                isGeminiActive ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]' : 'bg-emerald-400'
              }`} 
            />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
            title={isSoundEnabled ? 'Audio Feedback Enabled (Click to mute)' : 'Audio Muted (Click to enable)'}
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyan-500/20 bg-[#070b16] px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Investigator Level:</span>
            <span className="text-cyan-400 font-bold">
              Level {userProgress.investigatorLevel} ({userProgress.totalXp} XP)
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
