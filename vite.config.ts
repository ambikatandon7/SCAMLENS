import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { analyzeMessageWithGemini } from './server/geminiService.js';

// Load .env variables into process.env for the backend server
dotenv.config();

function scamLensApiPlugin() {
  return {
    name: 'scamlens-api-endpoint',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        // GET /api/status - check server-side Gemini configuration
        if (req.url === '/api/status' && req.method === 'GET') {
          const key = process.env.GEMINI_API_KEY;
          const isConfigured = Boolean(
            key && key.trim().length > 10 && key !== 'your_gemini_api_key_here'
          );

          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'ok',
              configured: isConfigured,
              model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
              message: isConfigured
                ? 'Gemini API key is configured securely on the server.'
                : 'GEMINI_API_KEY is not set in .env on the server.'
            })
          );
          return;
        }

        // POST /api/analyze - secure endpoint for AI message analysis
        if (req.url === '/api/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { message } = parsed;

              if (!message || typeof message !== 'string' || message.trim().length === 0) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Message payload is required.' }));
                return;
              }

              // Call Gemini via official SDK on the backend
              const result = await analyzeMessageWithGemini(message);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              const isMissingKey = err.message?.includes('GEMINI_API_KEY is not configured');
              res.statusCode = isMissingKey ? 503 : 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: err.message || 'An error occurred while communicating with Gemini API.',
                  isMissingKey
                })
              );
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), scamLensApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
