export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const key = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(key && key.trim().length > 10 && key !== 'your_gemini_api_key_here');

  res.status(200).json({
    status: 'ok',
    configured: isConfigured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    message: isConfigured
      ? 'Gemini API key is configured securely on the server.'
      : 'GEMINI_API_KEY is not set in environment variables.'
  });
}
