import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export const SCAMLENS_SYSTEM_INSTRUCTION = `You are SCAMLENS AI, an expert cybersecurity digital detective and forensic investigator dedicated to helping students and everyday internet users identify scams, social engineering tricks, credential theft, and malicious communications.

Analyze the user's provided message thoroughly. Look for:
1. Artificial urgency, coercive psychological pressure, and threats of account termination.
2. Deceptive domains, lookalike URLs, suspicious URL shorteners (bit.ly, tinyurl), or atypical TLDs (.xyz, .top, .online, .biz).
3. Solicitation of sensitive credentials, passwords, 2FA/MFA codes, social security numbers, or banking PINs.
4. Demands for unconventional or irreversible payment (crypto, gift cards, wire transfer, unverified peer-to-peer transfers).
5. Unrealistic promises (free checks, unearned prizes, high-paying easy remote jobs with no experience, crypto multipliers).
6. Generic or suspicious salutations, grammar quirks, and off-platform communication steering (asking to move to Telegram/WhatsApp).

You must respond ONLY with a valid JSON object matching the following structure:
{
  "riskScore": number between 0 and 100,
  "verdict": "Genuine / Safe" | "Suspicious" | "High-Risk Scam" | "Critical Threat",
  "confidence": number between 75 and 99,
  "executiveSummary": "2-3 concise sentences summarizing what the message is attempting to do and the primary threat level.",
  "threatFactors": [
    {
      "name": "Urgency & Psychological Coercion",
      "score": number between 0 and 100,
      "level": "Safe" | "Low" | "Medium" | "High" | "Critical",
      "detail": "Specific detail regarding urgency cues in this message."
    },
    {
      "name": "Deceptive Links & Infrastructure",
      "score": number between 0 and 100,
      "level": "Safe" | "Low" | "Medium" | "High" | "Critical",
      "detail": "Specific detail regarding links or domain flags in this message."
    },
    {
      "name": "Credential & Financial Harvesting",
      "score": number between 0 and 100,
      "level": "Safe" | "Low" | "Medium" | "High" | "Critical",
      "detail": "Specific detail regarding credential or monetary solicitation."
    },
    {
      "name": "Social Engineering & Platform Manipulation",
      "score": number between 0 and 100,
      "level": "Safe" | "Low" | "Medium" | "High" | "Critical",
      "detail": "Specific detail regarding social tactics or platform hopping."
    }
  ],
  "detectedIndicators": [
    {
      "flag": "Name of warning sign (e.g. Artificial Urgency / Threat)",
      "snippet": "Quoted phrase from message if applicable",
      "explanation": "Why this warning sign indicates a scam.",
      "severity": "info" | "warning" | "danger"
    }
  ],
  "recommendations": [
    "Specific safe next step 1 for the student",
    "Specific safe next step 2 for the student",
    "Specific safe next step 3 for the student"
  ]
}`;

/**
 * Analyzes a suspicious message securely using the official Google Gen AI SDK.
 * Reads GEMINI_API_KEY from environment variables on the backend.
 */
export async function analyzeMessageWithGemini(messageText) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY is not configured on the server. Please add your key to the .env file.'
    );
  }

  // Initialize the official Google Gen AI client with server-side key
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

  // Use the recommended model, customizable via GEMINI_MODEL if needed
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: `Analyze this suspicious message:\n\n"""\n${messageText}\n"""` }]
        }
      ],
      config: {
        systemInstruction: SCAMLENS_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini API returned an empty response.');
    }

    const parsedData = JSON.parse(responseText);

    return {
      ...parsedData,
      sourceMode: 'gemini-live'
    };
  } catch (error) {
    // If gemini-2.5-flash fails due to model availability on an older tier, attempt fallback to gemini-1.5-flash
    if (error.message && (error.message.includes('not found') || error.message.includes('404')) && modelName !== 'gemini-1.5-flash') {
      console.warn(`Model ${modelName} not found, falling back to gemini-1.5-flash...`);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Analyze this suspicious message:\n\n"""\n${messageText}\n"""` }]
          }
        ],
        config: {
          systemInstruction: SCAMLENS_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const fallbackText = fallbackResponse.text;
      const parsedData = JSON.parse(fallbackText);
      return {
        ...parsedData,
        sourceMode: 'gemini-live'
      };
    }

    throw error;
  }
}
