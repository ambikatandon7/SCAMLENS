import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PageType, 
  UserProgress, 
  UserScenarioAttempt, 
  UserChallengeAttempt 
} from '../types';
import { BADGES, LEVEL_MILESTONES } from '../data/badges';
import { cyberAudio } from '../utils/sound';
import { triggerCyberCelebration } from '../utils/confetti';
import { checkServerApiStatus, BackendStatus } from '../services/aiAnalyzer';

interface GameContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  activeScenarioId: string | null;
  setActiveScenarioId: (id: string | null) => void;
  userProgress: UserProgress;
  recordScenarioAttempt: (scenarioId: string, userClassification: any, selectedWarningSigns: string[], isClassificationCorrect: boolean, scorePercentage: number, xpEarned: number) => void;
  recordChallengeAttempt: (challengeId: string, selectedOptionId: string, isCorrect: boolean, xpEarned: number) => void;
  recordAnalyzerScan: () => void;
  resetAllProgress: () => void;
  isDemoModeOnly: boolean;
  setIsDemoModeOnly: (val: boolean) => void;
  showApiKeyModal: boolean;
  setShowApiKeyModal: (show: boolean) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  newBadgeUnlocked: string | null;
  dismissBadgeNotification: () => void;
  serverStatus: BackendStatus | null;
  refreshServerStatus: () => Promise<void>;
}

const STORAGE_KEY = 'scamlens_user_progress_v1';
const DEMO_MODE_STORAGE = 'scamlens_demo_mode_only';

const INITIAL_PROGRESS: UserProgress = {
  totalXp: 0,
  investigatorLevel: 1,
  levelTitle: 'Cadet Trainee',
  scenarioAttempts: {},
  challengeAttempts: {},
  analyzerScanCount: 0,
  unlockedBadges: [],
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageRaw] = useState<PageType>('landing');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isDemoModeOnly, setIsDemoModeOnlyRaw] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_MODE_STORAGE) === 'true';
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => cyberAudio.isEnabled());
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<BackendStatus | null>(null);

  const refreshServerStatus = async () => {
    try {
      const status = await checkServerApiStatus();
      setServerStatus(status);
    } catch {
      setServerStatus({
        status: 'offline',
        configured: false,
        model: 'gemini-2.5-flash',
        message: 'Could not contact backend API.'
      });
    }
  };

  useEffect(() => {
    refreshServerStatus();
  }, []);

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved progress, resetting to default:', e);
    }
    return INITIAL_PROGRESS;
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (err) {
      console.error('Error saving progress to localStorage:', err);
    }
  }, [userProgress]);

  const setCurrentPage = (page: PageType) => {
    cyberAudio.playClick();
    setCurrentPageRaw(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setIsDemoModeOnly = (val: boolean) => {
    setIsDemoModeOnlyRaw(val);
    localStorage.setItem(DEMO_MODE_STORAGE, String(val));
  };

  const toggleSound = () => {
    const updated = cyberAudio.toggleSound();
    setIsSoundEnabled(updated);
  };

  const dismissBadgeNotification = () => {
    setNewBadgeUnlocked(null);
  };

  const currentProgressLevel = userProgress.investigatorLevel;

  const checkLevelAndBadges = (current: UserProgress, addedXp: number): UserProgress => {
    const newTotalXp = current.totalXp + addedXp;

    // Determine level
    let currentLevel = 1;
    let currentTitle = LEVEL_MILESTONES[0].title;
    for (const milestone of LEVEL_MILESTONES) {
      if (newTotalXp >= milestone.minXp) {
        currentLevel = milestone.level;
        currentTitle = milestone.title;
      }
    }

    const leveledUp = currentLevel > currentProgressLevel;
    if (leveledUp) {
      cyberAudio.playLevelUp();
      triggerCyberCelebration();
    }

    // Evaluate badges
    const unlocked = new Set<string>(current.unlockedBadges);
    const scenarioCount = Object.keys(current.scenarioAttempts).length;
    const challengeCount = Object.keys(current.challengeAttempts).length;
    const correctChallenges = Object.values(current.challengeAttempts).filter(c => c.isCorrect).length;
    const correctScenarios = Object.values(current.scenarioAttempts).filter(s => s.isClassificationCorrect).length;
    const has100Score = Object.values(current.scenarioAttempts).some(s => s.scorePercentage === 100);

    const newlyUnlockedList: string[] = [];

    if (scenarioCount >= 1 && !unlocked.has('first_clue')) {
      unlocked.add('first_clue');
      newlyUnlockedList.push('First Clue Discovered');
    }
    if (has100Score && !unlocked.has('sharp_eye')) {
      unlocked.add('sharp_eye');
      newlyUnlockedList.push('Eagle Eye Investigator');
    }
    if (correctScenarios >= 3 && !unlocked.has('phish_buster')) {
      unlocked.add('phish_buster');
      newlyUnlockedList.push('Phish Buster Pro');
    }
    if (correctChallenges >= 4 && !unlocked.has('arena_gladiator')) {
      unlocked.add('arena_gladiator');
      newlyUnlockedList.push('Arena Gladiator');
    }
    if (current.analyzerScanCount >= 2 && !unlocked.has('ai_collaborator')) {
      unlocked.add('ai_collaborator');
      newlyUnlockedList.push('AI Cyber Sentinel');
    }
    if (newTotalXp >= 600 && !unlocked.has('grand_sleuth')) {
      unlocked.add('grand_sleuth');
      newlyUnlockedList.push('Master Cyber Sleuth');
    }

    if (newlyUnlockedList.length > 0) {
      setNewBadgeUnlocked(newlyUnlockedList[0]);
      triggerCyberCelebration();
    }

    return {
      ...current,
      totalXp: newTotalXp,
      investigatorLevel: currentLevel,
      levelTitle: currentTitle,
      unlockedBadges: Array.from(unlocked)
    };
  };

  const recordScenarioAttempt = (
    scenarioId: string,
    userClassification: any,
    selectedWarningSigns: string[],
    isClassificationCorrect: boolean,
    scorePercentage: number,
    xpEarned: number
  ) => {
    setUserProgress(prev => {
      const existing = prev.scenarioAttempts[scenarioId];
      const alreadyEarned = existing ? existing.xpEarned : 0;
      const netXp = Math.max(0, xpEarned - alreadyEarned);

      const updatedAttempt: UserScenarioAttempt = {
        scenarioId,
        userClassification,
        selectedWarningSigns,
        isClassificationCorrect,
        scorePercentage,
        xpEarned: Math.max(alreadyEarned, xpEarned),
        timestamp: Date.now()
      };

      const updatedScenarios = {
        ...prev.scenarioAttempts,
        [scenarioId]: updatedAttempt
      };

      const draft: UserProgress = {
        ...prev,
        scenarioAttempts: updatedScenarios
      };

      return checkLevelAndBadges(draft, netXp);
    });
  };

  const recordChallengeAttempt = (
    challengeId: string,
    selectedOptionId: string,
    isCorrect: boolean,
    xpEarned: number
  ) => {
    setUserProgress(prev => {
      const existing = prev.challengeAttempts[challengeId];
      const alreadyEarned = existing ? existing.xpEarned : 0;
      const netXp = isCorrect ? Math.max(0, xpEarned - alreadyEarned) : 0;

      const updatedAttempt: UserChallengeAttempt = {
        challengeId,
        selectedOptionId,
        isCorrect,
        xpEarned: Math.max(alreadyEarned, isCorrect ? xpEarned : 0),
        timestamp: Date.now()
      };

      const draft: UserProgress = {
        ...prev,
        challengeAttempts: {
          ...prev.challengeAttempts,
          [challengeId]: updatedAttempt
        }
      };

      return checkLevelAndBadges(draft, netXp);
    });
  };

  const recordAnalyzerScan = () => {
    setUserProgress(prev => {
      const draft: UserProgress = {
        ...prev,
        analyzerScanCount: prev.analyzerScanCount + 1
      };
      const scanXp = prev.analyzerScanCount < 5 ? 25 : 5;
      return checkLevelAndBadges(draft, scanXp);
    });
  };

  const resetAllProgress = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to reset all your investigative records, XP, and badges? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setUserProgress(INITIAL_PROGRESS);
      cyberAudio.playClick();
    }
  };

  return (
    <GameContext.Provider value={{
      currentPage,
      setCurrentPage,
      activeScenarioId,
      setActiveScenarioId,
      userProgress,
      recordScenarioAttempt,
      recordChallengeAttempt,
      recordAnalyzerScan,
      resetAllProgress,
      isDemoModeOnly,
      setIsDemoModeOnly,
      showApiKeyModal,
      setShowApiKeyModal,
      isSoundEnabled,
      toggleSound,
      newBadgeUnlocked,
      dismissBadgeNotification,
      serverStatus,
      refreshServerStatus
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
