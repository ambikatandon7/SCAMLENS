import { analyzeMessageWithGemini } from '../server/geminiService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Missing or empty "message" string in request body.' });
    }

    const result = await analyzeMessageWithGemini(message);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[Vercel Serverless Error]:', err.message);
    const isMissingKey = err.message?.includes('GEMINI_API_KEY is not configured');
    return res.status(isMissingKey ? 503 : 500).json({
      error: err.message || 'Error executing Gemini API.',
      isMissingKey
    });
  }
}
