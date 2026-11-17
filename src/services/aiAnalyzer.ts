import { AIAnalysisResult, ThreatFactor } from '../types';

interface RuleMatch {
  flag: string;
  category: 'urgency' | 'financial' | 'credentials' | 'links' | 'identity' | 'manipulation';
  severity: 'info' | 'warning' | 'danger';
  weight: number;
  snippet?: string;
  explanation: string;
}

export interface BackendStatus {
  status: string;
  configured: boolean;
  model: string;
  message: string;
}

/**
 * Checks whether the backend server has a valid GEMINI_API_KEY configured.
 */
export async function checkServerApiStatus(): Promise<BackendStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) {
      return {
        status: 'error',
        configured: false,
        model: 'unknown',
        message: 'Backend server /api/status endpoint unreachable.'
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      configured: false,
      model: 'unknown',
      message: 'Server offline or not responding.'
    };
  }
}

/**
 * Analyzes a suspicious message.
 * Attempts to use the secure backend Gemini endpoint (/api/analyze) first.
 * If demo mode is forced or if the backend is unavailable/unconfigured,
 * it falls back cleanly to the built-in local heuristic engine.
 */
export async function analyzeMessage(
  text: string,
  forceDemoMode: boolean = false
): Promise<{ result: AIAnalysisResult; usedBackend: boolean; warningMessage?: string }> {
  // If user selected Demo Mode, run local intelligence directly
  if (forceDemoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      result: runHeuristicAnalysis(text),
      usedBackend: false
    };
  }

  // Attempt to call the secure backend endpoint
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text.trim() })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        result: data,
        usedBackend: true
      };
    }

    // Backend returned an error (e.g. 503 key missing or 500 error)
    const errData = await res.json().catch(() => ({}));
    const errorMessage = errData.error || `Server responded with status ${res.status}`;

    console.warn('[SCAMLENS] Backend Gemini API unavailable, falling back to Demo Mode:', errorMessage);

    // Run fallback local analysis
    await new Promise(resolve => setTimeout(resolve, 500));
    const fallbackResult = runHeuristicAnalysis(text);

    return {
      result: fallbackResult,
      usedBackend: false,
      warningMessage: errData.isMissingKey
        ? 'GEMINI_API_KEY not configured in .env. Switched automatically to Demo Mode.'
        : `Gemini API notice: ${errorMessage}. Falling back to Demo Mode.`
    };
  } catch (networkError: any) {
    console.warn('[SCAMLENS] Network error reaching /api/analyze, falling back to Demo Mode:', networkError);

    await new Promise(resolve => setTimeout(resolve, 500));
    const fallbackResult = runHeuristicAnalysis(text);

    return {
      result: fallbackResult,
      usedBackend: false,
      warningMessage: 'Could not reach backend API endpoint. Switched automatically to Demo Mode.'
    };
  }
}

/**
 * Built-in local cybersecurity heuristic engine (Demo Mode).
 * 100% offline, privacy safe, runs without external API keys.
 */
export function runHeuristicAnalysis(rawText: string): AIAnalysisResult {
  const text = rawText.trim();
  const matches: RuleMatch[] = [];

  // 1. Urgency & Threats
  const urgencyPatterns = [
    { regex: /\b(immediate|immediately|urgent|urgently|within\s+\d+\s*(hours?|hrs?|mins?|minutes?)|24\s*hours?|act\s+now|action\s+required|right\s+now)\b/i, weight: 22, flag: 'High Pressure / Time Crunch', exp: 'Message uses aggressive time constraints to create panic and stop you from thinking critically.' },
    { regex: /\b(suspend(ed)?|terminat(ed)?|disable(d)?|block(ed)?|destro(yed|y)|close\s+your\s+account|legal\s+action|arrest)\b/i, weight: 26, flag: 'Punitive Threat / Loss of Account', exp: 'Threatens catastrophic loss of access or punitive consequences if you do not comply immediately.' },
  ];

  urgencyPatterns.forEach(p => {
    const match = text.match(p.regex);
    if (match) {
      matches.push({
        flag: p.flag,
        category: 'urgency',
        severity: 'danger',
        weight: p.weight,
        snippet: match[0],
        explanation: p.exp
      });
    }
  });

  // 2. Financial & Payment Extortion
  const financialPatterns = [
    { regex: /\b(wire\s+transfer|gift\s+card|bitcoin|crypto|btc|eth|usdt|apple\s+gift|google\s+play\s+card|western\s+union)\b/i, weight: 35, flag: 'Untraceable Payment Method', exp: 'Demands cryptocurrency or gift cards, which cannot be reversed or traced once sent.' },
    { regex: /\b(fee\s+of|\$\d+(\.\d{2})?|customs\s+fee|processing\s+charge|penalty|unpaid\s+balance|refund\s+of\s+\$\d+)\b/i, weight: 20, flag: 'Unsolicited Financial Claim', exp: 'Claims you owe unexpected fees or are entitled to an unverified refund.' },
    { regex: /\b(double\s+your|earn\s+\$\d+|\$4[0-9]\s*-\s*\$8[0-9]\/hr|no\s+experience\s+required|free\s+macbook|onboarding\s+check|lottery|winner|won)\b/i, weight: 28, flag: 'Unrealistic Financial Bait', exp: 'Promises huge compensation, unearned prizes, or free luxury items with zero requirements.' }
  ];

  financialPatterns.forEach(p => {
    const match = text.match(p.regex);
    if (match) {
      matches.push({
        flag: p.flag,
        category: 'financial',
        severity: 'danger',
        weight: p.weight,
        snippet: match[0],
        explanation: p.exp
      });
    }
  });

  // 3. Credential Harvesting & Sensitive Info
  const credentialPatterns = [
    { regex: /\b(password|passcode|otp|one-time\s+code|ssn|social\s+security|credit\s+card|cvv|pin\s+number|security\s+code)\b/i, weight: 32, flag: 'Sensitive Credential Solicitation', exp: 'Legitimate organizations and banks will NEVER ask for passwords, OTPs, or PINs via email or text.' },
    { regex: /\b(verify\s+your\s+identity|validate\s+your\s+account|update\s+billing|re-verify|confirm\s+credentials)\b/i, weight: 22, flag: 'Account Verification Bait', exp: 'Directs you to update or verify confidential account credentials through an unverified channel.' }
  ];

  credentialPatterns.forEach(p => {
    const match = text.match(p.regex);
    if (match) {
      matches.push({
        flag: p.flag,
        category: 'credentials',
        severity: 'danger',
        weight: p.weight,
        snippet: match[0],
        explanation: p.exp
      });
    }
  });

  // 4. Link & Domain Anomaly Detection
  const linkPatterns = [
    { regex: /https?:\/\/(bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy)\/[a-zA-Z0-9_-]+/i, weight: 25, flag: 'URL Shortener Concealing Target', exp: 'Uses a URL shortener to hide the real destination domain from antivirus and email filters.' },
    { regex: /https?:\/\/[a-zA-Z0-9-]+\.(online|xyz|top|click|club|buzz|info|cc|work|rest|quest|skin|biz)\b/i, weight: 28, flag: 'High-Risk Cheap Top-Level Domain (TLD)', exp: 'Uses low-reputation or disposable domain extensions frequently leveraged by transient phishing campaigns.' },
    { regex: /(login|signin|verify|secure|update|support|billing)-[a-zA-Z0-9-]+\.(com|net|org|co)/i, weight: 24, flag: 'Deceptive Lookalike Domain Pattern', exp: 'Mimics known brand keywords using hyphenated suffixes (e.g. brand-security.com).' },
    { regex: /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i, weight: 35, flag: 'Direct IP Address Hostname', exp: 'Links directly to a raw numerical IP address instead of an authenticated domain name.' }
  ];

  linkPatterns.forEach(p => {
    const match = text.match(p.regex);
    if (match) {
      matches.push({
        flag: p.flag,
        category: 'links',
        severity: 'danger',
        weight: p.weight,
        snippet: match[0],
        explanation: p.exp
      });
    }
  });

  // 5. Psychological Manipulation & Platform Flipping
  const manipulationPatterns = [
    { regex: /\b(kindly\s+(send|provide|click|update|confirm)|dear\s+(valued\s+)?(customer|member|user|client|student|sir|madam))\b/i, weight: 15, flag: 'Generic Salutation / Archaic Phrasing', exp: 'Uses "Kindly" or generic unpersonalized salutations typical of mass scripted scam operations.' },
    { regex: /\b(telegram|whatsapp|signal)\s*(@|number|group|chat)?\b/i, weight: 22, flag: 'Off-Platform Channel Shifting', exp: 'Attempts to redirect conversation onto encrypted or ephemeral messaging apps to evade audit logs.' }
  ];

  manipulationPatterns.forEach(p => {
    const match = text.match(p.regex);
    if (match) {
      matches.push({
        flag: p.flag,
        category: 'manipulation',
        severity: 'warning',
        weight: p.weight,
        snippet: match[0],
        explanation: p.exp
      });
    }
  });

  // Calculate composite score
  const totalWeight = matches.reduce((sum, m) => sum + m.weight, 0);
  const normalizedScore = Math.min(100, Math.max(0, Math.round(totalWeight * 0.95)));

  let verdict: AIAnalysisResult['verdict'] = 'Genuine / Safe';
  if (normalizedScore >= 75) {
    verdict = 'Critical Threat';
  } else if (normalizedScore >= 45) {
    verdict = 'High-Risk Scam';
  } else if (normalizedScore >= 20) {
    verdict = 'Suspicious';
  }

  // Calculate Threat Factors
  const urgencyScore = Math.min(100, matches.filter(m => m.category === 'urgency').reduce((acc, m) => acc + m.weight * 2, 5));
  const linksScore = Math.min(100, matches.filter(m => m.category === 'links').reduce((acc, m) => acc + m.weight * 2, 5));
  const credentialScore = Math.min(100, matches.filter(m => m.category === 'credentials' || m.category === 'financial').reduce((acc, m) => acc + m.weight * 1.8, 5));
  const socialScore = Math.min(100, matches.filter(m => m.category === 'manipulation' || m.category === 'identity').reduce((acc, m) => acc + m.weight * 2, 5));

  const toLevel = (score: number): ThreatFactor['level'] => {
    if (score >= 70) return 'Critical';
    if (score >= 45) return 'High';
    if (score >= 20) return 'Medium';
    if (score > 10) return 'Low';
    return 'Safe';
  };

  const threatFactors: ThreatFactor[] = [
    {
      name: 'Urgency & Psychological Coercion',
      score: urgencyScore,
      level: toLevel(urgencyScore),
      detail: urgencyScore > 30 ? 'Presence of artificial deadlines and punitive pressure.' : 'Normal or neutral message tempo.'
    },
    {
      name: 'Deceptive Links & Destination Infrastructure',
      score: linksScore,
      level: toLevel(linksScore),
      detail: linksScore > 30 ? 'Disguised URLs, shorteners, or atypical TLD extensions detected.' : 'No hostile or shortened link structures found.'
    },
    {
      name: 'Credential & Financial Harvesting Risk',
      score: credentialScore,
      level: toLevel(credentialScore),
      detail: credentialScore > 30 ? 'Asks for credentials, codes, or unconventional payment.' : 'No sensitive information requests detected.'
    },
    {
      name: 'Social Engineering & Platform Manipulation',
      score: socialScore,
      level: toLevel(socialScore),
      detail: socialScore > 30 ? 'Generic salutation or attempt to move chat off-platform.' : 'Authentic conversational indicators.'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  if (normalizedScore >= 45) {
    recommendations.push('Do NOT click any hyperlinks, download files, or respond to this message.');
    recommendations.push('Navigate to the organization\'s verified website or app independently through your browser bookmarks.');
    recommendations.push('Block the sender and report the message to your school or email provider\'s security portal.');
  } else if (normalizedScore >= 20) {
    recommendations.push('Proceed with caution: Inspect all sender email headers and hover over links before interacting.');
    recommendations.push('Verify with the alleged sender via a known trusted secondary communication channel.');
  } else {
    recommendations.push('No obvious scam signatures detected. However, remain vigilant and never disclose passwords or MFA codes.');
  }

  let executiveSummary = '';
  if (normalizedScore >= 75) {
    executiveSummary = `CRITICAL ALERT: This message exhibits ${matches.length} classic digital scam indicators, including aggressive psychological pressure, deceptive routing, or unauthorized credential solicitation. Under no circumstances should you engage.`;
  } else if (normalizedScore >= 45) {
    executiveSummary = `HIGH RISK DETECTED: Multiple threat patterns identified. The sender attempts to manipulate urgency or steer you towards unverified external endpoints.`;
  } else if (normalizedScore >= 20) {
    executiveSummary = `CAUTION ADVISED: A few anomalous markers were flagged. While it may be marketing or automated notification noise, avoid sharing private information.`;
  } else {
    executiveSummary = `MINIMAL THREAT SIGNATURE: Analysis of the text showed no significant indicators of known phishing, smishing, or credential harvesting tactics.`;
  }

  return {
    riskScore: normalizedScore,
    verdict,
    confidence: Math.min(98, Math.max(78, 82 + matches.length * 3)),
    executiveSummary,
    threatFactors,
    detectedIndicators: matches.map(m => ({
      flag: m.flag,
      snippet: m.snippet,
      explanation: m.explanation,
      severity: m.severity
    })),
    recommendations,
    sourceMode: 'heuristic-demo'
  };
}

export const PRESET_ANALYZER_SAMPLES = [
  {
    label: 'Campus Tax Refund Phishing',
    category: 'Student Impersonation',
    text: `Subject: Internal Revenue Service & Campus Bursar Notice
Dear Student,
We reviewed your 2025/2026 academic tuition tax return and found an overpayment refund of $1,420.00.
To transfer your refund to your direct deposit account before the midnight deadline, claim here:
https://irs-tuition-portal.student-verify99.online/claim
Failure to claim within 12 hours will forfeit the payment.
Office of University Financial Aid`
  },
  {
    label: 'Crypto Double Investment Trap',
    category: 'Advance-Fee Scam',
    text: `CONGRATULATIONS! You have been randomly selected in the Global Telegram Giveaway.
Send 0.05 BTC or 200 USDT to wallet 0x9fA448C218B11 to verify your identity and instantly receive 0.50 BTC (10X multiplier) returned to your address.
Only 4 spots remaining! Act immediately to lock in your slot.`
  },
  {
    label: 'Legitimate IT Maintenance Announcement',
    category: 'Genuine Campus Email',
    text: `Subject: Scheduled Maintenance Notice: Canvas & Library Catalog
Good afternoon University Community,
Please be advised that the main Library catalog and Canvas LMS will undergo scheduled infrastructure maintenance this Saturday, November 21st, between 2:00 AM and 4:00 AM EST.
No action is required on your part. Do not enter your login details on third-party sites during this window.
For any questions, visit our official campus service status page at https://status.university.edu or reach out to helpdesk@university.edu.
Sincerely,
Campus IT Infrastructure Team`
  },
  {
    label: 'Toll Road Unpaid Bill Smishing',
    category: 'SMS Smishing',
    text: `[Toll Services Alert]: Our records indicate an unpaid toll invoice ($6.50) from your recent highway transit. A late citation of $85.00 will be added if not settled today: https://bit.ly/toll-ezpass-settlement-pay`
  }
];
