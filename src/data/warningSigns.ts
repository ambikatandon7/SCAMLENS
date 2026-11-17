import { WarningSignOption } from '../types';

export const WARNING_SIGNS: WarningSignOption[] = [
  {
    id: 'artificial_urgency',
    label: 'Artificial Urgency / Threats',
    description: 'Demands immediate action (e.g., "Act in 15 mins", "Account suspended unless you verify now").',
    category: 'urgency'
  },
  {
    id: 'mismatched_sender',
    label: 'Suspicious / Spoofed Sender Address',
    description: 'The email domain or sender number looks strange, contains typos, or uses free mail domains like @gmail.com for official brands.',
    category: 'identity'
  },
  {
    id: 'deceptive_link',
    label: 'Deceptive or Shortened Hyperlink',
    description: 'The URL does not match the genuine organization domain (e.g. paypa1-security.xyz instead of paypal.com).',
    category: 'link'
  },
  {
    id: 'generic_greeting',
    label: 'Generic or Robotic Salutation',
    description: 'Uses vague terms like "Dear Valued Customer" or "Dear Member" instead of your actual registered name.',
    category: 'identity'
  },
  {
    id: 'request_sensitive_info',
    label: 'Request for Sensitive Credentials / Money',
    description: 'Asks to confirm passwords, 2FA codes, PINs, card digits, or send crypto/gift cards.',
    category: 'financial'
  },
  {
    id: 'grammar_spelling_quirks',
    label: 'Grammatical Flaws / Unusual Formatting',
    description: 'Contains awkward syntax, odd capitalization, character substitutions (0 for O), or blatant spelling errors.',
    category: 'grammar'
  },
  {
    id: 'too_good_to_be_true',
    label: 'Too-Good-To-Be-True Offer',
    description: 'Promises unexpected lotteries, free crypto, unearned cash windfalls, or high-paying easy remote jobs.',
    category: 'financial'
  },
  {
    id: 'unexpected_attachment',
    label: 'Suspicious Attachment / Macro File',
    description: 'Includes unsolicited files (.zip, .iso, .html, or macro-enabled documents) pretending to be an invoice or receipt.',
    category: 'technical'
  }
];
