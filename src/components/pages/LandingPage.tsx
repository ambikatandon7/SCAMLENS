import React from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../common/GlassCard';
import { AudioNarrationButton } from '../common/AudioNarrationButton';
import { 
  ShieldAlert, 
  Terminal, 
  Search, 
  Cpu, 
  Swords, 
  Award, 
  ArrowRight, 
  AlertTriangle, 
  Zap, 
  Eye, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, userProgress } = useGame();

  const features = [
    {
      icon: <Search className="w-6 h-6 text-cyan-400" />,
      title: 'Scam Detective Case Files',
      description: 'Analyze realistic simulated phishing emails, delivery smishing texts, and fake job DMs. Classify threats and identify real-world red flags.',
      actionPage: 'detective' as const,
      badge: '5+ Scenarios'
    },
    {
      icon: <Cpu className="w-6 h-6 text-rose-400" />,
      title: 'AI Threat Analyzer',
      description: 'Paste any suspicious message into the scanner. Get instant risk scores, deceptive URL breakdowns, and actionable student safety advice.',
      actionPage: 'analyzer' as const,
      badge: 'Heuristic + Gemini'
    },
    {
      icon: <Swords className="w-6 h-6 text-sky-400" />,
      title: 'Interactive Challenge Arena',
      description: 'Sharpen your cyber instincts with scenario-based multiple-choice quizzes across domain spoofing, MFA fatigue, and quishing.',
      actionPage: 'arena' as const,
      badge: 'Earn XP'
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: 'Investigator Progression',
      description: 'Level up from Cadet Trainee to Chief Cyber Inspector. Earn digital badges and review your personalized investigative clearance dossier.',
      actionPage: 'results' as const,
      badge: 'Level 1 - 5'
    }
  ];

  return (
    <div className="relative z-10 py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>CYBERSECURITY EDUCATION PLATFORM FOR STUDENTS</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          <span className="block font-sans">Think Before</span>
          <span className="block mt-1 font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-rose-400 text-glow-cyan">
            You Click.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-light">
          Welcome to <span className="font-semibold text-cyan-300">SCAMLENS</span>, the gamified cybersecurity training ground. 
          Learn to dissect deceptive emails, smishing texts, and social engineering attacks before they cost you your credentials or savings.
        </p>

        {/* Audio Narration Controller (ElevenLabs Voiceover) */}
        <div className="mb-10 flex justify-center">
          <AudioNarrationButton />
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage('detective')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <ShieldAlert className="w-5 h-5 text-slate-950" />
            <span>Start Investigation</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>

          <button
            onClick={() => setCurrentPage('analyzer')}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center gap-2.5 transition-all duration-200"
          >
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Try AI Message Analyzer</span>
          </button>
        </div>

        {/* Live Quick Stats Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">STUDENT THREATS</span>
            <span className="text-rose-400 text-lg font-bold">3.4B+</span>
            <span className="text-slate-500 block text-[10px]">Phishing attempts / yr</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">AVG TIME TO CLICK</span>
            <span className="text-cyan-400 text-lg font-bold">82 Sec</span>
            <span className="text-slate-500 block text-[10px]">On deceptive links</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">CURRENT RANK</span>
            <span className="text-white text-lg font-bold">Lvl {userProgress.investigatorLevel}</span>
            <span className="text-cyan-400 block text-[10px]">{userProgress.levelTitle}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">YOUR XP</span>
            <span className="text-emerald-400 text-lg font-bold">{userProgress.totalXp} XP</span>
            <span className="text-slate-500 block text-[10px]">Saved Locally</span>
          </div>
        </div>

      </div>

      {/* Interactive Cyber Teaser / How It Works */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            How The Scam Detective Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Train your eyes in three rigorous forensic stages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="cyan" className="p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-mono font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Inspect Fictional Messages</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Examine hyper-realistic SMS notifications, emergency campus IT emails, and fraudulent job offers in an authentic mockup UI.
            </p>
          </GlassCard>

          <GlassCard variant="burgundy" className="p-6">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 font-mono font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Isolate The Red Flags</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Select specific deception tactics: artificial urgency, spoofed subdomains, off-platform Telegram redirects, or untraceable payment demands.
            </p>
          </GlassCard>

          <GlassCard variant="cyan" className="p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-mono font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Earn XP & Level Up</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Receive immediate expert forensic breakdowns, advance your Investigator Level from Cadet to Chief Inspector, and unlock badges.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Investigation Modules
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explore the four core engines powering SCAMLENS
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>Open Investigator Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => (
            <GlassCard
              key={idx}
              variant={idx % 2 === 0 ? 'cyan' : 'burgundy'}
              hoverEffect={true}
              onClick={() => setCurrentPage(feat.actionPage)}
              className="p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {feat.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {feat.description}
              </p>
              <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Launch module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Safety Commitment Banner */}
      <GlassCard variant="dark" className="p-8 text-center border-slate-800">
        <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Our Student Privacy Guarantee</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          SCAMLENS is built exclusively for cybersecurity awareness. All scenarios are simulated safely in-browser. 
          Your progress is stored locally on your device with no login, no tracking, and zero solicitation of real personal data.
        </p>
      </GlassCard>

    </div>
  );
};
