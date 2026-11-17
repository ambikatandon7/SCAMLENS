import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'case-001',
    title: 'Urgent University IT Account Termination',
    category: 'Phishing',
    difficulty: 'Easy',
    xpReward: 150,
    platform: 'email',
    senderName: 'Campus IT Helpdesk',
    senderAddress: 'it-support-desk@uni-auth-portal365.online',
    timestamp: 'Today at 08:42 AM',
    subject: 'URGENT: Your Student Email & Portal will be disabled in 24 Hours',
    content: `Dear Valued Student,

Our system detected that your University credentials have expired under the new 2026 security protocol. 

Failure to re-verify within 24 HOURS will result in permanent deletion of your university email, course submissions, and campus cloud storage.

Please click the secure validation link below immediately to preserve your account:
https://portal-verify.uni-auth-portal365.online/login?session=exp49182

Do not ignore this warning.
Campus IT Administration Services`,
    attachmentName: 'Account_Termination_Notice_0921.html',
    correctClassification: 'scam',
    correctWarningSigns: [
      'artificial_urgency',
      'mismatched_sender',
      'deceptive_link',
      'generic_greeting',
      'request_sensitive_info',
      'unexpected_attachment'
    ],
    explanation: {
      summary: 'This is a classic credential harvesting phishing attack exploiting academic deadline anxiety.',
      keyClues: [
        'Sender domain is "uni-auth-portal365.online", NOT the official university ".edu" or official institutional domain.',
        'Uses extreme artificial urgency ("24 HOURS", "permanent deletion") to rush the student into clicking without thinking.',
        'Generic greeting "Dear Valued Student" shows a mass-blast template rather than a personalized internal campus communication.',
        'Includes an attached .html file which often runs client-side fake login forms to steal passwords.'
      ],
      whatToDo: 'Never click links or open attachments in unsolicited security warnings. Log in directly via your official university bookmark or contact your campus help desk via their verified telephone number.',
      realWorldPrevalence: 'College campus phishing attacks surge during start-of-semester and exam periods when students fear losing access to course portals.'
    }
  },
  {
    id: 'case-002',
    title: 'ApexExpress Courier Reschedule Fee',
    category: 'Delivery Fraud',
    difficulty: 'Easy',
    xpReward: 120,
    platform: 'sms',
    senderName: '+1 (833) 948-0129',
    senderAddress: '+18339480129',
    timestamp: 'Today at 02:15 PM',
    content: `[ApexExpress Alert]: We attempted delivery of your parcel #AX88912-US today, but unpaid customs duty ($1.85) remains outstanding. If unpaid by midnight, item will be destroyed. Update dispatch address and pay fee here: https://bit.ly/apex-delivery-track-82`,
    correctClassification: 'scam',
    correctWarningSigns: [
      'artificial_urgency',
      'mismatched_sender',
      'deceptive_link',
      'request_sensitive_info'
    ],
    explanation: {
      summary: 'This is a "smishing" (SMS phishing) package delivery scam designed to steal credit card details.',
      keyClues: [
        'The sender uses a generic VOIP number rather than an official verified carrier shortcode.',
        'Threatens extreme consequences ("item will be destroyed by midnight") to provoke panic.',
        'Uses a shortened Bitly link hiding the real phishing website.',
        'Requests a seemingly trivial amount ($1.85) to lower your guard, but the fraudulent form actually steals your full card number, expiration, and CVV.'
      ],
      whatToDo: 'Delete the SMS. If expecting a real package, look up the tracking number directly on the courier official app or website.',
      realWorldPrevalence: 'Delivery smishing represents over 35% of all reported text message scams worldwide.'
    }
  },
  {
    id: 'case-003',
    title: 'MetroTrust Bank Verified One-Time Passcode',
    category: 'Account Security',
    difficulty: 'Medium',
    xpReward: 160,
    platform: 'sms',
    senderName: 'MetroTrustBank (Shortcode 44201)',
    senderAddress: '44201',
    timestamp: 'Yesterday at 07:11 PM',
    content: `MetroTrust Bank Alert: 492018 is your one-time verification code for payment of $34.50 to CoffeeBean Roasters. MetroTrust employees will NEVER call or text asking for this code. If you did not make this purchase, call 1-800-555-0199 immediately.`,
    correctClassification: 'genuine',
    correctWarningSigns: [],
    explanation: {
      summary: 'This is a genuine automated bank transaction verification SMS message.',
      keyClues: [
        'Sent from a verified corporate 5-digit shortcode (44201).',
        'Explicitly reminds the user: "MetroTrust employees will NEVER call or text asking for this code".',
        'Contains NO suspicious clickable links or demands to enter private information on unfamiliar websites.',
        'Provides standard fraud reporting guidance with a known bank hotline format.'
      ],
      whatToDo: 'If you initiated the coffee shop purchase, enter the OTP into the verified merchant checkout page. If you did NOT make the purchase, call the official number on the back of your debit/credit card.',
      realWorldPrevalence: 'Banks frequently send transaction OTPs; scammers often impersonate them or call asking victims to read out genuine codes.'
    }
  },
  {
    id: 'case-004',
    title: 'Remote Campus Brand Ambassador Discord DM',
    category: 'Job Scam',
    difficulty: 'Medium',
    xpReward: 180,
    platform: 'discord',
    senderName: 'Elena HR @ CryptoNovaGlobal',
    senderAddress: 'elena_talenthunt#8821',
    timestamp: 'Today at 11:04 AM',
    content: `Hey! I came across your profile in the Student Developer server and loved your vibe. 

We are expanding our Student Ambassador & Remote Data Review program. The role pays $45 - $65/hour, completely flexible hours (5-10 hrs/week). No previous experience required!

To get started right away and receive your free company MacBook Pro and onboarding stipend check ($2,400), please message our hiring manager on Telegram @cryptonova_careers and fill in your home address and SSN/Gov ID.`,
    correctClassification: 'scam',
    correctWarningSigns: [
      'too_good_to_be_true',
      'mismatched_sender',
      'request_sensitive_info'
    ],
    explanation: {
      summary: 'This is an advance-fee / fake check employment scam targeting college students looking for flexible remote work.',
      keyClues: [
        'The pay rate ($45-$65/hr for unskilled, zero-experience work) is completely unrealistic and designed to entice.',
        'Promises an immediate free MacBook and a $2,400 "onboarding check" (which will later bounce after asking you to wire money back for equipment).',
        'Pushes you off Discord onto Telegram, where messages can be wiped and accounts cannot be traced.',
        'Unsolicited direct message from someone not in your company or verified school network.'
      ],
      whatToDo: 'Block and report the account on Discord. Never provide government IDs, SSNs, or deposit checks from unknown online recruiters.',
      realWorldPrevalence: 'Fake remote student internships and brand ambassador scams are currently the #1 financial fraud vector hitting Gen-Z students.'
    }
  },
  {
    id: 'case-005',
    title: 'Collaborative Project Document Sharing Notification',
    category: 'Social Media',
    difficulty: 'Hard',
    xpReward: 200,
    platform: 'email',
    senderName: 'Google Docs Notifications',
    senderAddress: 'comments-noreply@docs.google.com',
    timestamp: 'Today at 04:30 PM',
    subject: 'Alex Rivera mentioned you in "Final_Semester_Project_Master_Rubric.xlsx"',
    content: `Alex Rivera (marketing-student-network994@cloud-share.biz) mentioned you in a comment:

"Hey team, check out the updated syllabus and grant allocation here: https://docs.google.com.user-access-portal.net/view?id=88319 Please review before our presentation tomorrow morning!"

Open in Docs: [View Document]`,
    correctClassification: 'suspicious',
    correctWarningSigns: [
      'deceptive_link',
      'mismatched_sender',
      'artificial_urgency'
    ],
    explanation: {
      summary: 'This is an advanced Google Docs comment abuse phishing attack where attackers use legitimate document notification relay systems to deliver fraudulent links.',
      keyClues: [
        'The notification itself came through a legitimate Google notification server, which makes it pass spam filters.',
        'HOWEVER, the user mentioned inside the comment has a suspicious email (@cloud-share.biz) and you do not know them.',
        'Look closely at the link inside the comment text: "docs.google.com.user-access-portal.net". This is NOT Google Docs! The real domain is "user-access-portal.net", a lookalike domain created to steal Google account credentials.',
        'Creates academic peer pressure ("review before our presentation tomorrow morning").'
      ],
      whatToDo: 'Do NOT click the link inside the comment. If you do not recognize Alex Rivera or the project, report the comment directly as abuse within Google Drive.',
      realWorldPrevalence: 'Cloud notification abuse is a trending attack vector because users instinctively trust emails originating from major tech company relay addresses.'
    }
  },
  {
    id: 'case-006',
    title: 'StreamPrime Account Hold Notification',
    category: 'Phishing',
    difficulty: 'Easy',
    xpReward: 130,
    platform: 'email',
    senderName: 'StreamPrime Billing Support',
    senderAddress: 'support@billing-streamprime-secure.co',
    timestamp: 'Today at 09:15 AM',
    subject: 'Action Required: Your StreamPrime subscription renewal could not be processed',
    content: `Dear Customer,

We were unable to process your monthly subscription renewal of $15.99 due to an issue with your payment method on file.

Your membership has been temporarily placed on hold. To continue enjoying uninterrupted 4K streaming and downloads, please update your billing information within 48 hours.

[Update Billing Details Now] -> https://streamprime.secure-renew-portal.co/account/update

Thank you for being a valued member of the StreamPrime community.
Customer Experience Team`,
    correctClassification: 'scam',
    correctWarningSigns: [
      'mismatched_sender',
      'deceptive_link',
      'generic_greeting',
      'artificial_urgency'
    ],
    explanation: {
      summary: 'A standard subscription phishing scheme spoofing popular video streaming services to capture credit card credentials.',
      keyClues: [
        'Sender domain is "billing-streamprime-secure.co", not the official company streaming domain.',
        'The link points to "secure-renew-portal.co" rather than the authenticated streaming platform.',
        'Generic greeting "Dear Customer" instead of your actual profile name.',
        'Time-sensitive threat that service will be cut off.'
      ],
      whatToDo: 'Open your streaming app directly or navigate to the official website in your browser to check your payment status. Never follow links in billing failure emails.',
      realWorldPrevalence: 'Subscription service phishing is among the top 5 most common cyber scam templates used globally.'
    }
  }
];
