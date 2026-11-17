import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CyberBackground } from './components/layout/CyberBackground';
import { ApiKeyModal } from './components/ApiKeyModal';
import { BotpressChatbot } from './components/BotpressChatbot';

// Pages
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ScamDetectivePage } from './components/pages/ScamDetectivePage';
import { AiAnalyzerPage } from './components/pages/AiAnalyzerPage';
import { ChallengeArenaPage } from './components/pages/ChallengeArenaPage';
import { ResultsPage } from './components/pages/ResultsPage';

import { Award, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPage, newBadgeUnlocked, dismissBadgeNotification } = useGame();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'detective':
        return <ScamDetectivePage />;
      case 'analyzer':
        return <AiAnalyzerPage />;
      case 'arena':
        return <ChallengeArenaPage />;
      case 'results':
        return <ResultsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white">
      <CyberBackground />
      <Navbar />

      {/* Floating Badge Unlock Notification (Positioned at bottom-left so it never blocks the Botpress chat bubble) */}
      {newBadgeUnlocked && (
        <div className="fixed bottom-6 left-6 z-50 animate-bounce">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-rose-950 border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center gap-3.5 text-white max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-xl flex-shrink-0">
              🎖️
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                NEW BADGE UNLOCKED!
              </span>
              <h4 className="text-sm font-bold text-white">
                {newBadgeUnlocked}
              </h4>
            </div>
            <button
              onClick={dismissBadgeNotification}
              className="p-1 text-slate-400 hover:text-white rounded ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer />
      <ApiKeyModal />

      {/* Floating Botpress AI Assistant (Always available across all pages) */}
      <BotpressChatbot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
};

export default App;
