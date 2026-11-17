export type PageType = 
  | 'landing' 
  | 'dashboard' 
  | 'detective' 
  | 'analyzer' 
  | 'arena' 
  | 'results';

export type ClassificationType = 'genuine' | 'suspicious' | 'scam';

export type PlatformType = 'email' | 'sms' | 'dm' | 'discord' | 'delivery';

export interface WarningSignOption {
  id: string;
  label: string;
  description: string;
  category: 'urgency' | 'identity' | 'link' | 'grammar' | 'financial' | 'technical';
}

export interface Scenario {
  id: string;
  title: string;
  category: 'Phishing' | 'Job Scam' | 'Tech Support' | 'Delivery Fraud' | 'Social Media' | 'Account Security';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  platform: PlatformType;
  senderName: string;
  senderAddress: string;
  timestamp: string;
  subject?: string;
  content: string;
  attachmentName?: string;
  correctClassification: ClassificationType;
  correctWarningSigns: string[]; // WarningSign ids that apply
  explanation: {
    summary: string;
    keyClues: string[];
    whatToDo: string;
    realWorldPrevalence: string;
  };
}

export interface UserScenarioAttempt {
  scenarioId: string;
  userClassification: ClassificationType;
  selectedWarningSigns: string[];
  isClassificationCorrect: boolean;
  scorePercentage: number;
  xpEarned: number;
  timestamp: number;
}

export interface ChallengeQuestion {
  id: string;
  title: string;
  category: 'Phishing' | 'Fake Giveaways' | 'Tech Support' | 'Urgency Scams' | 'Impersonation' | 'QR Code & Links';
  difficulty: 'Easy' | 'Medium';
  scenarioText: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  xpReward: number;
  tip: string;
}

export interface UserChallengeAttempt {
  challengeId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  xpEarned: number;
  timestamp: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: number;
  isUnlocked: boolean;
  requirement: string;
}

export interface UserProgress {
  totalXp: number;
  investigatorLevel: number;
  levelTitle: string;
  scenarioAttempts: Record<string, UserScenarioAttempt>;
  challengeAttempts: Record<string, UserChallengeAttempt>;
  analyzerScanCount: number;
  unlockedBadges: string[];
  streakDays: number;
  lastActiveDate: string;
}

export interface ThreatFactor {
  name: string;
  level: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  score: number; // 0 to 100
  detail: string;
}

export interface AIAnalysisResult {
  riskScore: number; // 0 - 100
  verdict: 'Genuine / Safe' | 'Suspicious' | 'High-Risk Scam' | 'Critical Threat';
  confidence: number; // 0 - 100%
  executiveSummary: string;
  threatFactors: ThreatFactor[];
  detectedIndicators: {
    flag: string;
    snippet?: string;
    explanation: string;
    severity: 'info' | 'warning' | 'danger';
  }[];
  recommendations: string[];
  sourceMode: 'heuristic-demo' | 'gemini-live';
}
