import { Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_clue',
    title: 'First Clue Discovered',
    description: 'Complete your first Scam Detective case review.',
    iconName: 'Search',
    isUnlocked: false,
    requirement: '1 scenario completed'
  },
  {
    id: 'sharp_eye',
    title: 'Eagle Eye Investigator',
    description: 'Score 100% accuracy on any suspicious scenario warning signs.',
    iconName: 'Eye',
    isUnlocked: false,
    requirement: '100% score on a scenario'
  },
  {
    id: 'phish_buster',
    title: 'Phish Buster Pro',
    description: 'Solve 3 phishing and delivery fraud scenarios correctly.',
    iconName: 'ShieldAlert',
    isUnlocked: false,
    requirement: '3 scam scenarios classified correctly'
  },
  {
    id: 'arena_gladiator',
    title: 'Arena Contender',
    description: 'Answer at least 4 Challenge Arena questions correctly.',
    iconName: 'Swords',
    isUnlocked: false,
    requirement: '4 correct arena challenges'
  },
  {
    id: 'ai_collaborator',
    title: 'AI Cyber Sentinel',
    description: 'Analyze at least 2 custom suspicious messages using the AI Analyzer.',
    iconName: 'Cpu',
    isUnlocked: false,
    requirement: 'Scan 2 messages with AI Analyzer'
  },
  {
    id: 'grand_sleuth',
    title: 'Master Cyber Sleuth',
    description: 'Reach Level 4 Investigator and earn over 600 XP.',
    iconName: 'Award',
    isUnlocked: false,
    requirement: 'Reach 600+ total XP'
  }
];

export const LEVEL_MILESTONES = [
  { level: 1, title: 'Cadet Trainee', minXp: 0, maxXp: 199, icon: 'Shield' },
  { level: 2, title: 'Junior Investigator', minXp: 200, maxXp: 449, icon: 'Compass' },
  { level: 3, title: 'Cyber Threat Detective', minXp: 450, maxXp: 749, icon: 'ShieldCheck' },
  { level: 4, title: 'Senior Forensics Analyst', minXp: 750, maxXp: 1199, icon: 'Terminal' },
  { level: 5, title: 'Chief Cyber Inspector', minXp: 1200, maxXp: 9999, icon: 'Award' },
];
