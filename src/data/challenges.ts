import { ChallengeQuestion } from '../types';

export const CHALLENGES: ChallengeQuestion[] = [
  {
    id: 'arena-001',
    title: 'Spot the Spoofed Domain',
    category: 'Phishing',
    difficulty: 'Easy',
    scenarioText: 'You receive an urgent security alert stating your online banking password needs to be changed. You hover over the link to check the destination URL.',
    question: 'Which of the following URLs is the REAL, legitimate domain for "MyBank"?',
    options: [
      {
        id: 'opt-a',
        text: 'https://mybank.com.security-verification-portal.net/login',
        isCorrect: false,
        explanation: 'Incorrect. The actual domain is the last segment before the top-level domain: security-verification-portal.net. The "mybank.com" part is just a deceptive subdomain.'
      },
      {
        id: 'opt-b',
        text: 'https://login.mybank.com/auth/security',
        isCorrect: true,
        explanation: 'Correct! The primary domain is "mybank.com", with "login" as a valid legitimate subdomain, served over secure HTTPS.'
      },
      {
        id: 'opt-c',
        text: 'https://mybank-security-support.org/verify',
        isCorrect: false,
        explanation: 'Incorrect. Hyphenated brand names with generic suffixes like -security-support on a .org are a classic phishing domain giveaway.'
      },
      {
        id: 'opt-d',
        text: 'http://mybank.com/account/login',
        isCorrect: false,
        explanation: 'Incorrect. Legitimate financial institutions always enforce HTTPS encryption; unencrypted HTTP is an immediate red flag.'
      }
    ],
    xpReward: 80,
    tip: 'Rule of thumb: Look immediately to the left of the first single forward slash (/) to find the actual domain name.'
  },
  {
    id: 'arena-002',
    title: 'The "Friend in Trouble" DM',
    category: 'Impersonation',
    difficulty: 'Easy',
    scenarioText: 'A high school friend suddenly messages you on Instagram from a new account with the exact same profile picture and username with an extra underscore: "Hey! I got locked out of my main account and need 2 people to receive recovery codes. Can I send one to your phone?"',
    question: 'What is actually happening here?',
    options: [
      {
        id: 'opt-a',
        text: 'Instagram requires friends to verify each other when locked out of mobile devices.',
        isCorrect: false,
        explanation: 'Incorrect. While some platforms had trusted contacts, modern platforms never send your 2FA recovery codes to other people without multi-step verification.'
      },
      {
        id: 'opt-b',
        text: 'A scammer cloned your friend\'s profile and is trying to trigger a password reset on YOUR account, using you to steal your own 2FA OTP.',
        isCorrect: true,
        explanation: 'Correct! The attacker cloned the profile, requested a password reset for YOUR phone number, and is tricking you into relaying YOUR two-factor authentication code!'
      },
      {
        id: 'opt-c',
        text: 'Your friend had their phone wiped and needs you to download an authorization file.',
        isCorrect: false,
        explanation: 'Incorrect. Never download unsolicited files or share SMS verification numbers.'
      },
      {
        id: 'opt-d',
        text: 'It is a glitch caused by Instagram server migrations.',
        isCorrect: false,
        explanation: 'Incorrect. This is an active social engineering attack.'
      }
    ],
    xpReward: 90,
    tip: 'Never share verification codes sent to your phone with anyone, even people you think are your friends.'
  },
  {
    id: 'arena-003',
    title: 'The Tech Support Blue Screen Popup',
    category: 'Tech Support',
    difficulty: 'Easy',
    scenarioText: 'While browsing online research papers, your browser window freezes with a loud siren noise, a flashing red banner, and a popup claiming: "WINDOWS DEFENDER CRITICAL WARNING: Trojan Spyware Detected! Call Microsoft Certified Engineers at 1-800-555-0144 immediately to unlock your PC."',
    question: 'What is the correct, safe course of action?',
    options: [
      {
        id: 'opt-a',
        text: 'Call the 1-800 number immediately so certified engineers can remotely connect and clean the infection.',
        isCorrect: false,
        explanation: 'Never call these numbers! Legitimate operating system warnings NEVER provide telephone numbers or demand phone calls.'
      },
      {
        id: 'opt-b',
        text: 'Pay the $99 diagnostic fee via Apple Gift Card or Bitcoin as instructed by the voice prompt.',
        isCorrect: false,
        explanation: 'Scammers frequently request gift cards or cryptocurrency because they are irreversible and untraceable.'
      },
      {
        id: 'opt-c',
        text: 'Force close the browser tab using Task Manager (Ctrl+Shift+Esc) or browser tabs, and run a legitimate antivirus scan.',
        isCorrect: true,
        explanation: 'Spot on! This is a simple browser lockup script (HTML fullscreen audio loop). Closing the browser tab terminates the fake alert.'
      },
      {
        id: 'opt-d',
        text: 'Reinstall Windows from scratch immediately.',
        isCorrect: false,
        explanation: 'Unnecessary. The page is merely a deceptive website tab running Javascript dialogs, not a rootkit.'
      }
    ],
    xpReward: 85,
    tip: 'Microsoft, Apple, and Google will never include a toll-free customer support telephone number inside an error pop-up.'
  },
  {
    id: 'arena-004',
    title: 'The QR Code Parking Meter Trap (Quishing)',
    category: 'QR Code & Links',
    difficulty: 'Medium',
    scenarioText: 'You arrive at a parking station. On the side of the digital payment machine, there is a physical glossy sticker with a QR code saying "SCAN HERE FOR QUICK CONTACTLESS PARKING PAYMENT".',
    question: 'Why should you exercise extreme caution before scanning and paying?',
    options: [
      {
        id: 'opt-a',
        text: 'QR codes emit ultraviolet laser signals that can damage smartphone camera sensors.',
        isCorrect: false,
        explanation: 'False. QR codes are simple optical images with no harmful physical radiation.'
      },
      {
        id: 'opt-b',
        text: 'Criminals paste fraudulent QR code stickers over legitimate parking meters, redirecting drivers to fake payment portals that steal card details.',
        isCorrect: true,
        explanation: 'Correct! This technique is known as "Quishing" (QR Phishing). Scammers stick rogue QR stickers over official signs to steal card details.'
      },
      {
        id: 'opt-c',
        text: 'Parking lots only accept physical coins and cash by municipal law.',
        isCorrect: false,
        explanation: 'False. Most modern parking accepts card or official mobile apps.'
      },
      {
        id: 'opt-d',
        text: 'Scanning a QR code automatically empties your Apple Pay or Google Wallet without user confirmation.',
        isCorrect: false,
        explanation: 'Digital wallets still require biometric or passcode confirmation, but a spoofed browser form will trick you into typing your full card numbers.'
      }
    ],
    xpReward: 110,
    tip: 'Check if the QR code is a sticker overlaid on top of the original machine surface. Prefer official app stores or official meter terminals.'
  },
  {
    id: 'arena-005',
    title: 'The Celebrity Cryptocurrency Giveaway',
    category: 'Fake Giveaways',
    difficulty: 'Easy',
    scenarioText: 'You are scrolling on X (formerly Twitter) or YouTube and see a verified account live-streaming an interview with a famous tech CEO. The description reads: "To celebrate our AI launch, send 0.1 BTC to this wallet address and we will immediately send back 0.2 BTC to double your investment!"',
    question: 'How do you know this is a 100% scam?',
    options: [
      {
        id: 'opt-a',
        text: 'Nobody—no tech company, billionaire, or foundation—gives away free money on the condition that you send them cryptocurrency first.',
        isCorrect: true,
        explanation: 'Correct! "Send money to get double back" is the oldest advance-fee fraud in existence. Once crypto is transferred, the transaction is irreversible.'
      },
      {
        id: 'opt-b',
        text: '0.1 BTC is too small an amount for tech billionaires to process.',
        isCorrect: false,
        explanation: 'The amount does not matter; any scheme promising guaranteed doubled funds in exchange for an upfront payment is fraudulent.'
      },
      {
        id: 'opt-c',
        text: 'YouTube and X disable cryptocurrency transactions by default.',
        isCorrect: false,
        explanation: 'The transaction happens off-platform on the blockchain, outside of social media controls.'
      },
      {
        id: 'opt-d',
        text: 'The offer is genuine, but only valid during the first 10 minutes of the livestream.',
        isCorrect: false,
        explanation: 'Dangerous misconception! Scammers add fake countdown timers to pressure victims into transferring funds quickly.'
      }
    ],
    xpReward: 90,
    tip: 'Any promise of guaranteed exponential returns or "send crypto to get 2x back" is an undeniable fraud.'
  },
  {
    id: 'arena-006',
    title: 'The Accidental Zelle / Venmo Refund',
    category: 'Urgency Scams',
    difficulty: 'Medium',
    scenarioText: 'You receive a notification that a stranger just sent $400 to your Venmo account. Seconds later, they frantically message you: "I am so sorry, I meant to pay my daughter\'s rent! Please be kind and send it back to my other account @urgent-care-mom right now!"',
    question: 'What is the safest way to handle this situation?',
    options: [
      {
        id: 'opt-a',
        text: 'Immediately send the $400 to @urgent-care-mom to be a good person.',
        isCorrect: false,
        explanation: 'Do NOT send money! If you send $400 from your balance, and the original payment was made using a stolen credit card, the platform will reverse the initial $400 later, leaving you out of pocket $400.'
      },
      {
        id: 'opt-b',
        text: 'Contact Venmo / Zelle support directly, report the unsolicited transaction, and let the platform reverse it on their end.',
        isCorrect: true,
        explanation: 'Exactly right! Let the payment platform reverse the original transaction through official dispute mechanisms so you are never liable for sending your own funds.'
      },
      {
        id: 'opt-c',
        text: 'Withdraw the $400 to your personal checking account and keep it.',
        isCorrect: false,
        explanation: 'The fraudulent payment will eventually bounce or be disputed by the legitimate cardholder, causing your account to be hit with negative balances or overdraft fees.'
      },
      {
        id: 'opt-d',
        text: 'Ask the person for their social security number as collateral before transferring the money.',
        isCorrect: false,
        explanation: 'Never exchange sensitive personal information or get involved in unauthorized peer-to-peer wire arrangements with strangers.'
      }
    ],
    xpReward: 120,
    tip: 'Never return funds yourself for an accidental transfer; tell the sender to file a dispute with the payment provider directly.'
  },
  {
    id: 'arena-007',
    title: 'Unsolicited Multifactor Authentication Push',
    category: 'Urgency Scams',
    difficulty: 'Medium',
    scenarioText: 'It is 2:00 AM and your phone suddenly receives 15 consecutive notification prompts asking: "Approve login request for your Google / University account?"',
    question: 'What type of cyberattack is this, and what should you do?',
    options: [
      {
        id: 'opt-a',
        text: 'This is an MFA Fatigue (Push Bombing) attack. Tap "Deny", change your password immediately, and inform IT.',
        isCorrect: true,
        explanation: 'Correct! The attacker already stole your password and is spamming push prompts hoping you will accidentally tap "Approve" out of frustration or sleepiness.'
      },
      {
        id: 'opt-b',
        text: 'Tap "Approve" once so the notifications stop waking you up.',
        isCorrect: false,
        explanation: 'Tapping Approve grants the cybercriminal instant authorized access to your account and sensitive files!'
      },
      {
        id: 'opt-c',
        text: 'Disable Wi-Fi and Bluetooth on your phone permanently.',
        isCorrect: false,
        explanation: 'The attack is happening over the cloud server authentication gateway, not local device radio protocols.'
      },
      {
        id: 'opt-d',
        text: 'Delete the Authenticator app and reinstall it in the morning.',
        isCorrect: false,
        explanation: 'Deleting the app does not protect your account; the credentials must be changed immediately.'
      }
    ],
    xpReward: 125,
    tip: 'MFA Fatigue exploits human frustration. If you did not initiate a login, ALWAYS deny the request and change your password.'
  },
  {
    id: 'arena-008',
    title: 'The Fake Antivirus Subscription Invoice',
    category: 'Phishing',
    difficulty: 'Medium',
    scenarioText: 'You receive an email invoice from "GeekSquad Total Tech" stating: "Your automatic renewal of $599.00 has been debited from your checking account. If you did not authorize this charge, call our cancellation desk within 2 hours at 1-888-555-0199."',
    question: 'What is the real objective of the cybercriminal behind this email?',
    options: [
      {
        id: 'opt-a',
        text: 'To get you to panic and call the phone number, where they trick you into installing remote desktop software (AnyDesk/TeamViewer) to access your bank account.',
        isCorrect: true,
        explanation: 'Bullseye! Known as "Refund Scam" or "Callback Phishing", scammers use fake high-dollar invoices to induce panic, lure you to call their call center, and gain remote control of your computer.'
      },
      {
        id: 'opt-b',
        text: 'To legally bill you for antivirus software you accidentally installed.',
        isCorrect: false,
        explanation: 'No charge has actually occurred. The invoice is completely fabricated to create urgency.'
      },
      {
        id: 'opt-c',
        text: 'To ask you for feedback on GeekSquad customer service satisfaction.',
        isCorrect: false,
        explanation: 'This is an illicit financial fraud operation, not legitimate customer service.'
      },
      {
        id: 'opt-d',
        text: 'To sell your email address to legitimate newsletter advertising agencies.',
        isCorrect: false,
        explanation: 'The objective is direct bank theft through remote access manipulation.'
      }
    ],
    xpReward: 110,
    tip: 'Check your real bank statement directly before panicking. If no charge appears, delete the email and never call numbers provided in unsolicited invoices.'
  }
];
