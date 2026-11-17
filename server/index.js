import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeMessageWithGemini } from './geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health / status endpoint to check if GEMINI_API_KEY is configured
app.get('/api/status', (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(key && key.trim().length > 10 && key !== 'your_gemini_api_key_here');
  
  res.json({
    status: 'ok',
    configured: isConfigured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    message: isConfigured 
      ? 'Gemini API key is configured on server.' 
      : 'GEMINI_API_KEY environment variable is not set or empty in .env.'
  });
});

// Secure analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing or empty "message" string in request body.'
      });
    }

    const analysisResult = await analyzeMessageWithGemini(message);
    return res.json(analysisResult);
  } catch (err) {
    console.error('[SCAMLENS Server] Error during Gemini analysis:', err.message);

    // Differentiate missing key vs Gemini API errors
    const isMissingKey = err.message.includes('GEMINI_API_KEY is not configured');
    
    return res.status(isMissingKey ? 503 : 500).json({
      error: err.message || 'An error occurred while communicating with Gemini API.',
      isMissingKey
    });
  }
});

// Start listening if run directly
app.listen(PORT, () => {
  console.log(`[SCAMLENS Backend] Secure API server running at http://localhost:${PORT}`);
  console.log(`[SCAMLENS Backend] Checking GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Present' : 'Not configured (check .env)'}`);
});
